<?php
/**
 * Footer template.
 *
 * @package SohaTeb
 */
?>

<footer class="st-footer" id="contact">
	<div class="st-container st-footer__grid">
		<div class="st-footer__brand">
			<img src="<?php echo esc_url(SOHATEB_URI . '/assets/images/logo-light.svg'); ?>" alt="Soha Teb" width="64" height="64">
			<strong>SOHA TEB</strong>
			<p><?php esc_html_e('مدرسه زیبایی سها طب — معرفی محصولات و مسیر آموزش حرفه‌ای.', 'sohateb'); ?></p>
		</div>

		<div>
			<h3><?php esc_html_e('دسترسی سریع', 'sohateb'); ?></h3>
			<?php
			wp_nav_menu([
				'theme_location' => 'footer',
				'container'      => false,
				'menu_class'     => 'st-footer__links',
				'fallback_cb'    => 'sohateb_fallback_menu',
			]);
			?>
		</div>

		<div>
			<h3><?php esc_html_e('تماس', 'sohateb'); ?></h3>
			<ul class="st-footer__links">
				<li><a href="mailto:info@soha-teb.ir">info@soha-teb.ir</a></li>
				<li><span><?php esc_html_e('ایران', 'sohateb'); ?></span></li>
			</ul>
		</div>
	</div>

	<div class="st-footer__bottom">
		<div class="st-container">
			<p>&copy; <?php echo esc_html(gmdate('Y')); ?> <?php bloginfo('name'); ?>. <?php esc_html_e('همه حقوق محفوظ است.', 'sohateb'); ?></p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>