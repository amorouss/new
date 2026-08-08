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
			<span class="st-product__brand">SOHA TEB</span>
			<h3 class="st-product__title"><?php the_title(); ?></h3>
			<div class="st-product__price"><?php echo $product->get_price_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
		</div>
	</a>
</li>