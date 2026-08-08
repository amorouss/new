<?php
/**
 * Product card in loops.
 *
 * @package SohaTeb
 */

defined('ABSPATH') || exit;

global $product;

if (empty($product) || !$product->is_visible()) {
	return;
}
?>
<li <?php wc_product_class('st-product', $product); ?> data-reveal>
	<a href="<?php the_permalink(); ?>" class="st-product__link">
		<div class="st-product__media">
			<?php sohateb_product_badge(); ?>
			<?php echo $product->get_image('sohateb-product', ['class' => 'st-product__img']); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<div class="st-product__body">
			<?php
			$brand = (string) get_post_meta($product->get_id(), '_sohateb_brand', true);
			$line  = (string) get_post_meta($product->get_id(), '_sohateb_line', true);
			?>
			<span class="st-product__brand"><?php echo esc_html($brand !== '' ? $brand : 'SOHA TEB'); ?></span>
			<?php if ($line !== '') : ?>
				<span class="st-product__line"><?php echo esc_html($line); ?></span>
			<?php endif; ?>
			<h3 class="st-product__title"><?php the_title(); ?></h3>
			<div class="st-product__price"><?php echo $product->get_price_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
		</div>
	</a>
</li>