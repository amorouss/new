<?php
/**
 * Enqueue scripts and styles.
 *
 * @package SohaTeb
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

add_action('wp_enqueue_scripts', function (): void {
	wp_enqueue_style(
		'sohateb-fonts',
		'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Vazirmatn:wght@300;400;500;600;700&display=swap',
		[],
		null
	);

	wp_enqueue_style(
		'sohateb-main',
		SOHATEB_URI . '/assets/css/main.css',
		['sohateb-fonts'],
		SOHATEB_VERSION
	);

	wp_enqueue_script(
		'sohateb-main',
		SOHATEB_URI . '/assets/js/main.js',
		[],
		SOHATEB_VERSION,
		true
	);

	wp_localize_script('sohateb-main', 'sohatebData', [
		'ajaxUrl' => admin_url('admin-ajax.php'),
		'homeUrl' => home_url('/'),
	]);
});