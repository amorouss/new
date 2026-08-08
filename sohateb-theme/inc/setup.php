<?php
/**
 * Theme setup.
 *
 * @package SohaTeb
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

add_action('after_setup_theme', function (): void {
	load_theme_textdomain('sohateb', SOHATEB_DIR . '/languages');

	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
	add_theme_support('custom-logo', [
		'height'      => 120,
		'width'       => 320,
		'flex-height' => true,
		'flex-width'  => true,
	]);
	add_theme_support('align-wide');
	add_theme_support('editor-styles');
	add_theme_support('woocommerce', [
		'thumbnail_image_width' => 600,
		'single_image_width'    => 900,
		'product_grid'          => [
			'default_rows'    => 3,
			'min_rows'        => 1,
			'max_rows'        => 8,
			'default_columns' => 4,
			'min_columns'     => 2,
			'max_columns'     => 4,
		],
	]);
	add_theme_support('wc-product-gallery-zoom');
	add_theme_support('wc-product-gallery-lightbox');
	add_theme_support('wc-product-gallery-slider');

	register_nav_menus([
		'primary' => __('منوی اصلی', 'sohateb'),
		'footer'  => __('منوی فوتر', 'sohateb'),
	]);

	add_image_size('sohateb-product', 720, 900, true);
	add_image_size('sohateb-hero', 1920, 1080, true);
});

add_action('widgets_init', function (): void {
	register_sidebar([
		'name'          => __('سایدبار فروشگاه', 'sohateb'),
		'id'            => 'shop-sidebar',
		'before_widget' => '<section class="st-widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="st-widget__title">',
		'after_title'   => '</h3>',
	]);
});

/**
 * Body classes.
 */
add_filter('body_class', function (array $classes): array {
	$classes[] = 'sohateb-theme';
	if (is_front_page()) {
		$classes[] = 'st-home';
	}
	return $classes;
});

/**
 * Fallback primary menu (shop / contact / training deferred for later placement).
 */
function sohateb_fallback_menu(): void {
	echo '<ul class="st-nav__list">';
	echo '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html__('خانه', 'sohateb') . '</a></li>';
	echo '<li><a href="' . esc_url(home_url('/#brands')) . '">' . esc_html__('برندها', 'sohateb') . '</a></li>';
	echo '<li><a href="' . esc_url(home_url('/#featured')) . '">' . esc_html__('محصولات', 'sohateb') . '</a></li>';
	echo '<li><a href="' . esc_url(home_url('/#about')) . '">' . esc_html__('درباره ما', 'sohateb') . '</a></li>';
	echo '</ul>';
}