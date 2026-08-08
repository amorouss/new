<?php
/**
 * Soha Teb theme functions.
 *
 * @package SohaTeb
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

define('SOHATEB_VERSION', '1.0.1');
define('SOHATEB_DIR', get_template_directory());
define('SOHATEB_URI', get_template_directory_uri());

require_once SOHATEB_DIR . '/inc/setup.php';
require_once SOHATEB_DIR . '/inc/assets.php';
require_once SOHATEB_DIR . '/inc/woocommerce.php';
require_once SOHATEB_DIR . '/inc/demo-content.php';