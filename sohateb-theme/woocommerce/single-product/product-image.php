<?php
/**
 * Single Product Image — with Soha Teb logo mark.
 *
 * @package SohaTeb
 * @version 1.5.1
 */

defined('ABSPATH') || exit;

if (!function_exists('wc_get_gallery_image_html')) {
	return;
}

global $product;

$columns           = apply_filters('woocommerce_product_thumbnails_columns', 4);
$post_thumbnail_id = $product->get_image_id();
$wrapper_classes   = apply_filters(
	'woocommerce_single_product_image_gallery_classes',
	[
		'woocommerce-product-gallery',
		'woocommerce-product-gallery--' . ($post_thumbnail_id ? 'with-images' : 'without-images'),
		'woocommerce-product-gallery--columns-' . absint($columns),
		'images',
	]
);
?>
<div class="<?php echo esc_attr(implode(' ', array_map('sanitize_html_class', $wrapper_classes))); ?>" data-columns="<?php echo esc_attr((string) $columns); ?>" style="opacity: 0; transition: opacity .25s ease-in-out;">
	<span class="st-product__logo-mark st-product__logo-mark--single" aria-hidden="true">
		<img src="<?php echo esc_url(SOHATEB_URI . '/assets/images/brand-logo-white.png'); ?>" alt="" width="88" height="88">
	</span>
	<div class="woocommerce-product-gallery__wrapper">
		<?php
		if ($post_thumbnail_id) {
			$html = wc_get_gallery_image_html($post_thumbnail_id, true);
		} else {
			$wrapper_classname = $product->is_type('variable') && !empty($product->get_visible_children()) && '' !== $product->get_price()
				? 'woocommerce-product-gallery__image woocommerce-product-gallery__image--placeholder'
				: 'woocommerce-product-gallery__image--placeholder';
			$html  = sprintf('<div class="%s">', esc_attr($wrapper_classname));
			$html .= sprintf(
				'<img src="%s" alt="%s" class="wp-post-image" />',
				esc_url(wc_placeholder_img_src('woocommerce_single')),
				esc_html__('Awaiting product image', 'woocommerce')
			);
			$html .= '</div>';
		}

		echo apply_filters('woocommerce_single_product_image_thumbnail_html', $html, $post_thumbnail_id); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		do_action('woocommerce_product_thumbnails');
		?>
	</div>
</div>
