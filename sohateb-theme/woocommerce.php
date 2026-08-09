<?php
/**
 * WooCommerce wrapper.
 *
 * @package SohaTeb
 */

get_header('shop');
?>

<main id="main" class="st-main st-shop">
	<div class="st-container">
		<?php woocommerce_content(); ?>
	</div>
</main>

<?php
get_footer('shop');