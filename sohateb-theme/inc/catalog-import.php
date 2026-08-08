<?php
/**
 * Import catalog products from JSON.
 *
 * @package SohaTeb
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Import / refresh catalog from bundled JSON.
 *
 * @return array{created:int,updated:int,skipped:int,total:int}
 */
function sohateb_import_catalog(bool $replace_demo = true): array {
	if (!class_exists('WooCommerce')) {
		return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'total' => 0, 'error' => 'WooCommerce missing'];
	}

	$path = SOHATEB_DIR . '/inc/catalog/products.json';
	if (!file_exists($path)) {
		return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'total' => 0, 'error' => 'JSON missing'];
	}

	$data = json_decode((string) file_get_contents($path), true);
	if (!is_array($data) || empty($data['products']) || !is_array($data['products'])) {
		return ['created' => 0, 'updated' => 0, 'skipped' => 0, 'total' => 0, 'error' => 'Invalid JSON'];
	}

	if ($replace_demo) {
		sohateb_trash_demo_products();
	}

	$brand_terms = [];
	foreach ((array) ($data['brands'] ?? []) as $brand) {
		$brand_terms[$brand] = sohateb_ensure_term((string) $brand, 'product_cat', sanitize_title($brand));
	}

	$type_map = [
		'cream'        => 'کرم',
		'serum'        => 'سرم',
		'mask'         => 'ماسک',
		'eye'          => 'دور چشم',
		'cleanser'     => 'پاک‌کننده',
		'toner'        => 'تونر',
		'sunscreen'    => 'ضدآفتاب',
		'peel'         => 'لایه‌بردار',
		'kit'          => 'ست محصولات',
		'professional' => 'حرفه‌ای',
	];
	foreach ($type_map as $slug => $label) {
		sohateb_ensure_term($label, 'product_cat', $slug);
	}

	$created = 0;
	$updated = 0;
	$skipped = 0;

	foreach ($data['products'] as $item) {
		if (!is_array($item)) {
			$skipped++;
			continue;
		}

		$sku = trim((string) ($item['sku'] ?? ''));
		$title = trim((string) ($item['name_fa'] ?? ''));
		if ($title === '') {
			$title = trim((string) ($item['name_en'] ?? ''));
		}
		if ($title === '') {
			$skipped++;
			continue;
		}

		$product_id = 0;
		if ($sku !== '') {
			$existing_id = wc_get_product_id_by_sku($sku);
			if ($existing_id) {
				$product_id = (int) $existing_id;
			}
		}

		if (!$product_id) {
			$q = new WP_Query([
				'post_type'      => 'product',
				'title'          => $title,
				'posts_per_page' => 1,
				'post_status'    => ['publish', 'draft', 'private'],
				'fields'         => 'ids',
			]);
			if ($q->have_posts()) {
				$product_id = (int) $q->posts[0];
			}
			wp_reset_postdata();
		}

		$desc = trim((string) ($item['description_fa'] ?? ''));
		$en   = trim((string) ($item['name_en'] ?? ''));
		$vol  = trim((string) ($item['volume'] ?? ''));
		$content_parts = array_filter([$desc, $en ? 'نام انگلیسی: ' . $en : '', $vol ? 'حجم: ' . $vol : '']);
		$content = implode("\n\n", $content_parts);

		$postarr = [
			'post_title'   => $title,
			'post_content' => $content,
			'post_excerpt' => $desc,
			'post_status'  => 'publish',
			'post_type'    => 'product',
		];

		if ($product_id) {
			$postarr['ID'] = $product_id;
			wp_update_post($postarr);
			$updated++;
		} else {
			$product_id = (int) wp_insert_post($postarr);
			if (!$product_id || is_wp_error($product_id)) {
				$skipped++;
				continue;
			}
			$created++;
		}

		wp_set_object_terms($product_id, 'simple', 'product_type');

		$brand = (string) ($item['brand'] ?? '');
		$line  = trim((string) ($item['line'] ?? ''));
		$cat   = (string) ($item['category'] ?? '');

		if ($sku !== '') {
			update_post_meta($product_id, '_sku', $sku);
		}
		if (!empty($item['sku_pro'])) {
			update_post_meta($product_id, '_sohateb_sku_pro', (string) $item['sku_pro']);
		}
		update_post_meta($product_id, '_sohateb_brand', $brand);
		update_post_meta($product_id, '_sohateb_line', $line);
		update_post_meta($product_id, '_regular_price', '');
		update_post_meta($product_id, '_price', '');
		update_post_meta($product_id, '_manage_stock', 'no');
		update_post_meta($product_id, '_stock_status', 'instock');
		update_post_meta($product_id, '_virtual', 'no');
		update_post_meta($product_id, '_sold_individually', 'no');
		update_post_meta($product_id, '_catalog_visibility', 'visible');

		// Prefer WooCommerce product save so SKU lookup stays consistent.
		$product_obj = wc_get_product($product_id);
		if ($product_obj instanceof WC_Product) {
			if ($sku !== '') {
				$product_obj->set_sku($sku);
			}
			$product_obj->set_catalog_visibility('visible');
			$product_obj->set_stock_status('instock');
			$product_obj->save();
		}

		$term_ids = [];
		if ($brand !== '') {
			$brand_id = !empty($brand_terms[$brand])
				? (int) $brand_terms[$brand]
				: sohateb_ensure_term($brand, 'product_cat', sanitize_title($brand));
			if ($brand_id > 0) {
				$term_ids[] = $brand_id;
				$brand_terms[$brand] = $brand_id;
			}
		}
		if ($line !== '') {
			$line_id = sohateb_ensure_term($line, 'product_cat', sanitize_title($brand . '-' . $line));
			if ($line_id > 0) {
				$term_ids[] = $line_id;
			}
		}
		if ($cat !== '' && isset($type_map[$cat])) {
			$type_id = sohateb_ensure_term($type_map[$cat], 'product_cat', $cat);
			if ($type_id > 0) {
				$term_ids[] = $type_id;
			}
		}

		$term_ids = array_values(array_unique(array_filter($term_ids)));
		if ($term_ids) {
			wp_set_object_terms($product_id, $term_ids, 'product_cat', false);
		}

		if (!empty($item['featured'])) {
			update_post_meta($product_id, '_featured', 'yes');
			wp_set_object_terms($product_id, ['featured'], 'product_visibility', true);
		} else {
			update_post_meta($product_id, '_featured', 'no');
		}
	}

	if (!empty($data['contact']) && is_array($data['contact'])) {
		update_option('sohateb_contact', $data['contact']);
	}

	update_option('sohateb_catalog_imported', time());
	wc_delete_product_transients();

	return [
		'created' => $created,
		'updated' => $updated,
		'skipped' => $skipped,
		'total'   => count($data['products']),
	];
}

/**
 * Ensure a product category exists.
 */
function sohateb_ensure_term(string $name, string $taxonomy, string $slug): int {
	$existing = term_exists($slug, $taxonomy);
	if ($existing) {
		return (int) (is_array($existing) ? $existing['term_id'] : $existing);
	}
	$by_name = term_exists($name, $taxonomy);
	if ($by_name) {
		return (int) (is_array($by_name) ? $by_name['term_id'] : $by_name);
	}
	$created = wp_insert_term($name, $taxonomy, ['slug' => $slug]);
	if (is_wp_error($created)) {
		return 0;
	}
	return (int) $created['term_id'];
}

/**
 * Trash previously seeded demo placeholders.
 */
function sohateb_trash_demo_products(): void {
	$titles = [
		'سرم آبرسان سها طب',
		'کرم مرطوب‌کننده روزانه',
		'پالت سایه حرفه‌ای',
		'رژ لب مخملی',
		'روغن تقویت مو',
		'ست براش آموزشی',
		'دوره مقدماتی میکاپ',
		'دوره مراقبت پوست',
	];
	foreach ($titles as $title) {
		$q = new WP_Query([
			'post_type'      => 'product',
			'title'          => $title,
			'posts_per_page' => 5,
			'post_status'    => 'any',
			'fields'         => 'ids',
		]);
		foreach ($q->posts as $id) {
			wp_trash_post((int) $id);
		}
		wp_reset_postdata();
	}
}