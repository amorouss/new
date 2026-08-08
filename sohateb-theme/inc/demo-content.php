<?php
/**
 * Seed placeholder products once when theme is activated (UI preview).
 *
 * @package SohaTeb
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

add_action('after_switch_theme', 'sohateb_seed_demo_content');

/**
 * Create sample categories + placeholder products if shop is empty.
 */
function sohateb_seed_demo_content(): void {
	if (!class_exists('WooCommerce')) {
		return;
	}

	if (get_option('sohateb_demo_seeded')) {
		return;
	}

	$categories = [
		'skin'     => 'پوست',
		'makeup'   => 'آرایش',
		'hair'     => 'مو',
		'tools'    => 'ابزار زیبایی',
		'training' => 'آموزش',
	];

	$term_ids = [];
	foreach ($categories as $slug => $name) {
		$existing = term_exists($slug, 'product_cat');
		if ($existing) {
			$term_ids[$slug] = (int) (is_array($existing) ? $existing['term_id'] : $existing);
			continue;
		}
		$created = wp_insert_term($name, 'product_cat', ['slug' => $slug]);
		if (!is_wp_error($created)) {
			$term_ids[$slug] = (int) $created['term_id'];
		}
	}

	$products = [
		[
			'title' => 'سرم آبرسان سها طب',
			'price' => '890000',
			'cat'   => 'skin',
			'desc'  => 'فرمول سبک برای آبرسانی عمیق و درخشش طبیعی پوست.',
		],
		[
			'title' => 'کرم مرطوب‌کننده روزانه',
			'price' => '650000',
			'cat'   => 'skin',
			'desc'  => 'مراقبت روزانه با بافت مخملی برای پوست حساس.',
		],
		[
			'title' => 'پالت سایه حرفه‌ای',
			'price' => '1250000',
			'cat'   => 'makeup',
			'desc'  => 'رنگ‌های مات و شاین برای آموزش و اجرای حرفه‌ای.',
		],
		[
			'title' => 'رژ لب مخملی',
			'price' => '420000',
			'cat'   => 'makeup',
			'desc'  => 'پوشش مات بادوام با حس سبک روی لب.',
		],
		[
			'title' => 'روغن تقویت مو',
			'price' => '780000',
			'cat'   => 'hair',
			'desc'  => 'ترکیب گیاهی برای نرمی و درخشندگی تار مو.',
		],
		[
			'title' => 'ست براش آموزشی',
			'price' => '1580000',
			'cat'   => 'tools',
			'desc'  => 'مجموعه کامل براش برای کلاس‌های آرایشگری.',
		],
		[
			'title' => 'دوره مقدماتی میکاپ',
			'price' => '4900000',
			'cat'   => 'training',
			'desc'  => 'مسیر آموزشی پایه تا اجرای کامل میکاپ روزانه.',
		],
		[
			'title' => 'دوره مراقبت پوست',
			'price' => '3900000',
			'cat'   => 'training',
			'desc'  => 'اصول اسکین‎کر حرفه‌ای برای هنرجویان سها طب.',
		],
	];

	foreach ($products as $item) {
		$existing_q = new WP_Query([
			'post_type'      => 'product',
			'title'          => $item['title'],
			'posts_per_page' => 1,
			'post_status'    => 'any',
			'fields'         => 'ids',
		]);
		$exists = $existing_q->have_posts();
		wp_reset_postdata();
		if ($exists) {
			continue;
		}

		$product_id = wp_insert_post([
			'post_title'   => $item['title'],
			'post_content' => $item['desc'],
			'post_excerpt' => $item['desc'],
			'post_status'  => 'publish',
			'post_type'    => 'product',
		]);

		if (is_wp_error($product_id) || !$product_id) {
			continue;
		}

		wp_set_object_terms($product_id, 'simple', 'product_type');
		if (!empty($term_ids[$item['cat']])) {
			wp_set_object_terms($product_id, [$term_ids[$item['cat']]], 'product_cat');
		}

		update_post_meta($product_id, '_regular_price', $item['price']);
		update_post_meta($product_id, '_price', $item['price']);
		update_post_meta($product_id, '_manage_stock', 'no');
		update_post_meta($product_id, '_stock_status', 'instock');
		update_post_meta($product_id, '_visibility', 'visible');
		update_post_meta($product_id, '_featured', 'yes');
	}

	// Ensure a primary menu exists.
	$menu_name = 'Soha Teb Primary';
	$menu = wp_get_nav_menu_object($menu_name);
	if (!$menu) {
		$menu_id = wp_create_nav_menu($menu_name);
		$items = [
			['title' => 'خانه', 'url' => home_url('/')],
			['title' => 'محصولات', 'url' => function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/shop/')],
			['title' => 'آموزش', 'url' => home_url('/product-category/training/')],
			['title' => 'درباره ما', 'url' => home_url('/#about')],
			['title' => 'تماس', 'url' => home_url('/#contact')],
		];
		foreach ($items as $item) {
			wp_update_nav_menu_item($menu_id, 0, [
				'menu-item-title'  => $item['title'],
				'menu-item-url'    => $item['url'],
				'menu-item-status' => 'publish',
				'menu-item-type'   => 'custom',
			]);
		}
		$locations = get_theme_mod('nav_menu_locations', []);
		$locations['primary'] = (int) $menu_id;
		$locations['footer']  = (int) $menu_id;
		set_theme_mod('nav_menu_locations', $locations);
	}

	// Front page uses theme front-page.php; keep reading settings clean.
	update_option('show_on_front', 'posts');

	update_option('sohateb_demo_seeded', 1);
}