<?php
/**
 * WooCommerce customizations.
 *
 * @package SohaTeb
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

add_action('after_setup_theme', function (): void {
	remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
	remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
	remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);
	remove_action('woocommerce_before_shop_loop', 'woocommerce_result_count', 20);
	remove_action('woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30);
});

add_action('woocommerce_before_main_content', function (): void {
	echo '<main class="st-main st-shop"><div class="st-container">';
}, 10);

add_action('woocommerce_after_main_content', function (): void {
	echo '</div></main>';
}, 10);

add_filter('loop_shop_columns', fn (): int => 4);
add_filter('loop_shop_per_page', fn (): int => 12);

add_filter('woocommerce_product_get_image', function (string $image, $product, string $size, array $attr, bool $placeholder, string $image_html): string {
	return $image_html;
}, 10, 6);

/**
 * Product card badge helper.
 */
function sohateb_product_badge(): void {
	global $product;
	if (!$product instanceof WC_Product) {
		return;
	}
	$brand = (string) get_post_meta($product->get_id(), '_sohateb_brand', true);
	if ($brand !== '') {
		echo '<span class="st-badge st-badge--brand">' . esc_html($brand) . '</span>';
		return;
	}
	if ($product->is_on_sale()) {
		echo '<span class="st-badge st-badge--sale">' . esc_html__('تخفیف', 'sohateb') . '</span>';
	} elseif ($product->is_featured()) {
		echo '<span class="st-badge st-badge--featured">' . esc_html__('ویژه', 'sohateb') . '</span>';
	}
}

/**
 * Show inquiry CTA when price is empty (catalog mode).
 */
add_filter('woocommerce_get_price_html', function ($price, $product) {
	if (!$product instanceof WC_Product) {
		return $price;
	}
	if ($product->get_price() === '' || $product->get_price() === null) {
		return '<span class="st-price-inquiry">' . esc_html__('قیمت به‌زودی', 'sohateb') . '</span>';
	}
	return $price;
}, 20, 2);