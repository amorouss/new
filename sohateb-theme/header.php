<?php
/**
 * Header template.
 *
 * @package SohaTeb
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="st-skip" href="#main"><?php esc_html_e('رفتن به محتوا', 'sohateb'); ?></a>

<div class="st-announcement" data-reveal>
	<span><?php esc_html_e('سها طب — ویترین محصولات Isabelle Lancray و DSV-LINE', 'sohateb'); ?></span>
</div>

<header class="st-header" data-header>
	<div class="st-container st-header__inner">
		<button class="st-nav-toggle" type="button" aria-expanded="false" aria-controls="st-primary-nav" data-nav-toggle>
			<span></span><span></span>
			<span class="screen-reader-text"><?php esc_html_e('منو', 'sohateb'); ?></span>
		</button>

		<a class="st-brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
			<?php if (has_custom_logo()) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<?php
				$brand_icon = SOHATEB_DIR . '/assets/images/brand-icon.png';
				$brand_src  = file_exists($brand_icon)
					? SOHATEB_URI . '/assets/images/brand-icon.png'
					: SOHATEB_URI . '/assets/images/logo.svg';
				?>
				<img class="st-brand__mark" src="<?php echo esc_url($brand_src); ?>" alt="Soha Teb" width="56" height="56">
				<span class="st-brand__text">
					<strong>SOHA TEB</strong>
					<em><?php esc_html_e('Beauty School', 'sohateb'); ?></em>
				</span>
			<?php endif; ?>
		</a>

		<nav id="st-primary-nav" class="st-nav" data-nav aria-label="<?php esc_attr_e('منوی اصلی', 'sohateb'); ?>">
			<?php
			wp_nav_menu([
				'theme_location' => 'primary',
				'container'      => false,
				'menu_class'     => 'st-nav__list',
				'fallback_cb'    => 'sohateb_fallback_menu',
			]);
			?>
		</nav>

		<div class="st-header__actions" aria-hidden="true"></div>
	</div>
</header>