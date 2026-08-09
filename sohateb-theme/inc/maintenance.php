<?php
/**
 * Temporary public maintenance screen.
 *
 * Toggle with SOHATEB_MAINTENANCE in functions.php.
 *
 * @package SohaTeb
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Whether the public maintenance screen is enabled.
 */
function sohateb_is_maintenance_enabled(): bool {
	return defined('SOHATEB_MAINTENANCE') && SOHATEB_MAINTENANCE;
}

/**
 * Visitors who may bypass the maintenance screen (site admins).
 */
function sohateb_can_bypass_maintenance(): bool {
	return is_user_logged_in() && current_user_can('manage_options');
}

add_action('template_redirect', function (): void {
	if (!sohateb_is_maintenance_enabled()) {
		return;
	}

	if (sohateb_can_bypass_maintenance()) {
		return;
	}

	// Keep WordPress admin / auth / system endpoints reachable.
	if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
		return;
	}

	$uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
	if (preg_match('#/(wp-login\.php|wp-admin|wp-cron\.php|xmlrpc\.php)#i', $uri)) {
		return;
	}

	status_header(503);
	nocache_headers();
	header('Retry-After: 3600');

	$logo = SOHATEB_DIR . '/assets/images/brand-logo-white.png';
	$logo_uri = file_exists($logo)
		? SOHATEB_URI . '/assets/images/brand-logo-white.png'
		: SOHATEB_URI . '/assets/images/logo-light.svg';

	?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex,nofollow">
	<title><?php echo esc_html(get_bloginfo('name') . ' — ' . __('در حال به‌روزرسانی', 'sohateb')); ?></title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Vazirmatn:wght@300;400;500;600&display=swap" rel="stylesheet">
	<style>
		:root {
			--st-navy: #0f2747;
			--st-navy-deep: #0a1b31;
			--st-champagne: #c8a96a;
			--st-accent: #2cb7c9;
			--st-blush: #d8c4a0;
			--st-paper: #f5f7fa;
		}
		* { box-sizing: border-box; }
		html, body { margin: 0; min-height: 100%; }
		body {
			min-height: 100vh;
			display: grid;
			place-items: center;
			padding: 2rem 1.25rem;
			color: #f7f8fc;
			font-family: "Vazirmatn", Tahoma, sans-serif;
			background:
				radial-gradient(900px 500px at 90% 10%, rgba(44, 183, 201, 0.18), transparent 55%),
				radial-gradient(700px 420px at 10% 80%, rgba(200, 169, 106, 0.18), transparent 50%),
				linear-gradient(160deg, var(--st-navy-deep) 0%, var(--st-navy) 55%, #163557 100%);
			text-align: center;
		}
		.st-maint {
			width: min(100%, 34rem);
			animation: st-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
		}
		.st-maint__logo {
			width: 88px;
			height: 88px;
			margin: 0 auto 1.5rem;
			object-fit: contain;
			filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.28));
		}
		.st-maint__brand {
			font-family: "Cormorant Garamond", "Times New Roman", serif;
			font-size: clamp(2rem, 5vw, 2.75rem);
			font-weight: 600;
			letter-spacing: 0.08em;
			margin: 0;
		}
		.st-maint__brand em {
			display: block;
			margin-top: 0.2rem;
			font-size: 0.42em;
			font-style: normal;
			letter-spacing: 0.28em;
			color: var(--st-champagne);
			text-transform: uppercase;
		}
		.st-maint__line {
			width: 4.5rem;
			height: 1px;
			margin: 1.5rem auto;
			background: linear-gradient(90deg, transparent, var(--st-champagne), transparent);
		}
		.st-maint__title {
			margin: 0 0 0.75rem;
			font-size: clamp(1.35rem, 3.5vw, 1.7rem);
			font-weight: 500;
		}
		.st-maint__text {
			margin: 0;
			color: rgba(247, 248, 252, 0.78);
			line-height: 1.9;
			font-weight: 300;
			font-size: 1.02rem;
		}
		.st-maint__pulse {
			width: 10px;
			height: 10px;
			margin: 2rem auto 0;
			border-radius: 50%;
			background: var(--st-blush);
			box-shadow: 0 0 0 0 rgba(216, 184, 180, 0.55);
			animation: st-pulse 1.8s ease-out infinite;
		}
		@keyframes st-rise {
			from { opacity: 0; transform: translateY(16px); }
			to { opacity: 1; transform: translateY(0); }
		}
		@keyframes st-pulse {
			0% { box-shadow: 0 0 0 0 rgba(216, 184, 180, 0.55); }
			70% { box-shadow: 0 0 0 16px rgba(216, 184, 180, 0); }
			100% { box-shadow: 0 0 0 0 rgba(216, 184, 180, 0); }
		}
	</style>
</head>
<body>
	<main class="st-maint" role="main">
		<img class="st-maint__logo" src="<?php echo esc_url($logo_uri); ?>" alt="Soha Teb" width="88" height="88">
		<p class="st-maint__brand">SOHA TEB<em>Beauty School</em></p>
		<div class="st-maint__line" aria-hidden="true"></div>
		<h1 class="st-maint__title"><?php esc_html_e('فعلاً در حال به‌روزرسانی هستیم', 'sohateb'); ?></h1>
		<p class="st-maint__text"><?php esc_html_e('سایت به‌زودی با نسخهٔ جدید در دسترس قرار می‌گیرد. از شکیبایی شما سپاسگزاریم.', 'sohateb'); ?></p>
		<div class="st-maint__pulse" aria-hidden="true"></div>
	</main>
</body>
</html>
	<?php
	exit;
}, 0);
