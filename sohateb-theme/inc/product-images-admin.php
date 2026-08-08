<?php
/**
 * Admin UI: change + crop product images.
 *
 * @package SohaTeb
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

add_action('admin_menu', function (): void {
	add_menu_page(
		__('تصاویر محصولات', 'sohateb'),
		__('تصاویر محصولات', 'sohateb'),
		'edit_products',
		'sohateb-product-images',
		'sohateb_render_product_images_page',
		'dashicons-format-image',
		56
	);
});

add_action('admin_enqueue_scripts', function (string $hook): void {
	if ($hook !== 'toplevel_page_sohateb-product-images') {
		return;
	}

	wp_enqueue_media();
	wp_enqueue_style(
		'sohateb-product-images-admin',
		SOHATEB_URI . '/assets/css/product-images-admin.css',
		[],
		SOHATEB_VERSION
	);
	wp_enqueue_script(
		'sohateb-product-images-admin',
		SOHATEB_URI . '/assets/js/product-images-admin.js',
		['jquery'],
		SOHATEB_VERSION,
		true
	);
	wp_localize_script('sohateb-product-images-admin', 'sohatebImages', [
		'ajaxUrl' => admin_url('admin-ajax.php'),
		'nonce'   => wp_create_nonce('sohateb_product_image'),
		'i18n'    => [
			'title'  => __('انتخاب یا آپلود عکس محصول', 'sohateb'),
			'button' => __('استفاده به‌عنوان عکس محصول', 'sohateb'),
			'saved'  => __('عکس ذخیره شد', 'sohateb'),
			'error'  => __('خطا در ذخیره عکس', 'sohateb'),
		],
	]);
});

add_action('wp_ajax_sohateb_set_product_image', function (): void {
	if (!current_user_can('edit_products')) {
		wp_send_json_error(['message' => 'forbidden'], 403);
	}
	check_ajax_referer('sohateb_product_image', 'nonce');

	$product_id = isset($_POST['product_id']) ? (int) $_POST['product_id'] : 0;
	$image_id   = isset($_POST['image_id']) ? (int) $_POST['image_id'] : 0;

	if ($product_id <= 0 || get_post_type($product_id) !== 'product') {
		wp_send_json_error(['message' => 'invalid product'], 400);
	}
	if ($image_id <= 0 || get_post_type($image_id) !== 'attachment') {
		wp_send_json_error(['message' => 'invalid image'], 400);
	}
	if (!current_user_can('edit_post', $product_id)) {
		wp_send_json_error(['message' => 'cannot edit'], 403);
	}

	set_post_thumbnail($product_id, $image_id);
	if (function_exists('wc_delete_product_transients')) {
		wc_delete_product_transients($product_id);
	}

	$thumb = wp_get_attachment_image_url($image_id, 'medium') ?: wp_get_attachment_image_url($image_id, 'full');
	$edit  = admin_url('post.php?post=' . $image_id . '&action=edit');

	wp_send_json_success([
		'thumb'    => $thumb,
		'editUrl'  => $edit,
		'imageId'  => $image_id,
		'message'  => __('عکس ذخیره شد. برای برش، روی «برش عکس» بزنید.', 'sohateb'),
	]);
});

/**
 * Render product images manager page.
 */
function sohateb_render_product_images_page(): void {
	if (!current_user_can('edit_products')) {
		wp_die(esc_html__('دسترسی ندارید.', 'sohateb'));
	}

	$paged = isset($_GET['paged']) ? max(1, (int) $_GET['paged']) : 1;
	$search = isset($_GET['s']) ? sanitize_text_field(wp_unslash((string) $_GET['s'])) : '';
	$brand = isset($_GET['brand']) ? sanitize_text_field(wp_unslash((string) $_GET['brand'])) : '';

	$args = [
		'post_type'      => 'product',
		'post_status'    => 'publish',
		'posts_per_page' => 24,
		'paged'          => $paged,
		'orderby'        => 'title',
		'order'          => 'ASC',
	];
	if ($search !== '') {
		$args['s'] = $search;
	}
	if ($brand !== '') {
		$args['tax_query'] = [[
			'taxonomy' => 'product_cat',
			'field'    => 'slug',
			'terms'    => [$brand],
		]];
	}

	$q = new WP_Query($args);
	?>
	<div class="wrap st-img-admin">
		<h1><?php esc_html_e('مدیریت تصاویر محصولات', 'sohateb'); ?></h1>
		<p class="st-img-admin__help">
			<?php esc_html_e('روی «تغییر عکس» بزنید تا عکس جدید آپلود یا از رسانه انتخاب شود. بعد برای برش، «برش عکس» را باز کنید (ابزار برش خود وردپرس).', 'sohateb'); ?>
		</p>

		<form method="get" class="st-img-admin__filters">
			<input type="hidden" name="page" value="sohateb-product-images">
			<input type="search" name="s" value="<?php echo esc_attr($search); ?>" placeholder="<?php esc_attr_e('جستجوی محصول…', 'sohateb'); ?>">
			<select name="brand">
				<option value=""><?php esc_html_e('همه برندها', 'sohateb'); ?></option>
				<option value="isabelle-lancry" <?php selected($brand, 'isabelle-lancry'); ?>>Isabelle Lancray</option>
				<option value="dsv-line" <?php selected($brand, 'dsv-line'); ?>>DSV-LINE</option>
				<option value="vv" <?php selected($brand, 'vv'); ?>>V&amp;V</option>
				<option value="dr-rimpler" <?php selected($brand, 'dr-rimpler'); ?>>Dr. Rimpler</option>
			</select>
			<button class="button button-primary" type="submit"><?php esc_html_e('فیلتر', 'sohateb'); ?></button>
		</form>

		<div class="st-img-grid">
			<?php if ($q->have_posts()) : ?>
				<?php while ($q->have_posts()) : $q->the_post(); ?>
					<?php
					$product_id = get_the_ID();
					$thumb_id   = get_post_thumbnail_id($product_id);
					$thumb_url  = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'medium') : wc_placeholder_img_src('medium');
					$brand_meta = (string) get_post_meta($product_id, '_sohateb_brand', true);
					$line_meta  = (string) get_post_meta($product_id, '_sohateb_line', true);
					$edit_img   = $thumb_id ? admin_url('post.php?post=' . $thumb_id . '&action=edit') : '';
					?>
					<article class="st-img-card" data-product-id="<?php echo esc_attr((string) $product_id); ?>">
						<div class="st-img-card__media">
							<img src="<?php echo esc_url($thumb_url ?: ''); ?>" alt="" class="st-img-card__thumb">
						</div>
						<div class="st-img-card__body">
							<strong class="st-img-card__title"><?php the_title(); ?></strong>
							<?php if ($brand_meta || $line_meta) : ?>
								<span class="st-img-card__meta"><?php echo esc_html(trim($brand_meta . ($line_meta ? ' · ' . $line_meta : ''))); ?></span>
							<?php endif; ?>
							<div class="st-img-card__actions">
								<button type="button" class="button button-primary st-img-card__change" data-product-id="<?php echo esc_attr((string) $product_id); ?>">
									<?php esc_html_e('تغییر عکس', 'sohateb'); ?>
								</button>
								<a class="button st-img-card__crop <?php echo $edit_img ? '' : 'disabled'; ?>"
									href="<?php echo esc_url($edit_img ?: '#'); ?>"
									target="_blank"
									rel="noopener"
									<?php echo $edit_img ? '' : 'aria-disabled="true" tabindex="-1"'; ?>>
									<?php esc_html_e('برش عکس', 'sohateb'); ?>
								</a>
							</div>
							<p class="st-img-card__status" aria-live="polite"></p>
						</div>
					</article>
				<?php endwhile; ?>
			<?php else : ?>
				<p><?php esc_html_e('محصولی پیدا نشد.', 'sohateb'); ?></p>
			<?php endif; ?>
		</div>

		<?php
		$total = (int) $q->max_num_pages;
		if ($total > 1) {
			echo '<div class="st-img-admin__pager">';
			echo paginate_links([
				'base'      => add_query_arg('paged', '%#%'),
				'format'    => '',
				'current'   => $paged,
				'total'     => $total,
				'prev_text' => '«',
				'next_text' => '»',
			]);
			echo '</div>';
		}
		wp_reset_postdata();
		?>
	</div>
	<?php
}