<?php
/**
 * Front page — product showcase UI.
 *
 * @package SohaTeb
 */

get_header();

$shop_url = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/shop/');
$cat_url = static function (string $slug) use ($shop_url): string {
	$link = get_term_link($slug, 'product_cat');
	return is_wp_error($link) ? $shop_url : $link;
};
$isabelle_url = $cat_url('isabelle-lancry');
$dsv_url      = $cat_url('dsv-line');
$vv_url       = $cat_url('vv');
$rimpler_url  = $cat_url('dr-rimpler');
$serum_url    = $cat_url('serum');
$mask_url     = $cat_url('mask');
$pro_url      = $cat_url('professional');
?>

<main id="main" class="st-main">

	<section class="st-hero">
		<div class="st-hero__media" aria-hidden="true">
			<div class="st-hero__glow"></div>
			<div class="st-hero__grain"></div>
		</div>
		<div class="st-container st-hero__content">
			<p class="st-hero__brand" data-reveal>SOHA TEB</p>
			<h1 class="st-hero__title" data-reveal data-reveal-delay="80">
				<?php esc_html_e('نماینده رسمی مراقبت پوست حرفه‌ای', 'sohateb'); ?>
			</h1>
			<p class="st-hero__lead" data-reveal data-reveal-delay="140">
				<?php esc_html_e('ویترین Isabelle Lancray، DSV-LINE، V&V و Dr. Rimpler برای کلینیک، سالن و مراقبت در منزل.', 'sohateb'); ?>
			</p>
			<div class="st-hero__cta" data-reveal data-reveal-delay="200">
				<a class="st-btn st-btn--primary" href="#featured">
					<?php esc_html_e('مشاهده محصولات', 'sohateb'); ?>
				</a>
				<a class="st-btn st-btn--ghost" href="#brands">
					<?php esc_html_e('برندها', 'sohateb'); ?>
				</a>
			</div>
		</div>
		<div class="st-hero__scroll" aria-hidden="true" data-reveal data-reveal-delay="280"></div>
	</section>

	<section class="st-categories" id="brands" aria-labelledby="st-cat-title">
		<div class="st-container">
			<header class="st-section-head" data-reveal>
				<h2 id="st-cat-title"><?php esc_html_e('برندها و خطوط', 'sohateb'); ?></h2>
				<p><?php esc_html_e('چهار برند تخصصی سها طب برای مراقبت پوست حرفه‌ای و خانگی.', 'sohateb'); ?></p>
			</header>
			<div class="st-cat-row st-cat-row--brands">
				<a class="st-cat st-cat--a" href="<?php echo esc_url($isabelle_url); ?>" data-reveal>
					<span class="st-cat__eyebrow">PARIS</span>
					<span class="st-cat__label">Isabelle Lancray</span>
					<span class="st-cat__meta"><?php esc_html_e('EGOSTYLE · ILSA-PRO · ZENSIBIA', 'sohateb'); ?></span>
				</a>
				<a class="st-cat st-cat--b" href="<?php echo esc_url($dsv_url); ?>" data-reveal>
					<span class="st-cat__eyebrow">LEVEL 7</span>
					<span class="st-cat__label">DSV-LINE</span>
					<span class="st-cat__meta"><?php esc_html_e('معجزه آبی · معجزه سبز · سرم‌ها', 'sohateb'); ?></span>
				</a>
				<a class="st-cat st-cat--c" href="<?php echo esc_url($vv_url); ?>" data-reveal>
					<span class="st-cat__eyebrow">HERABIOTICS</span>
					<span class="st-cat__label">V&V</span>
					<span class="st-cat__meta"><?php esc_html_e('روشن‌کننده · ضدجوش · آبرسان', 'sohateb'); ?></span>
				</a>
				<a class="st-cat st-cat--d" href="<?php echo esc_url($rimpler_url); ?>" data-reveal>
					<span class="st-cat__eyebrow">GERMANY</span>
					<span class="st-cat__label">Dr. Rimpler</span>
					<span class="st-cat__meta"><?php esc_html_e('Clear · Hydro · Sensitive · Sun', 'sohateb'); ?></span>
				</a>
				<a class="st-cat st-cat--e" href="<?php echo esc_url($serum_url); ?>" data-reveal>
					<span class="st-cat__label"><?php esc_html_e('سرم‌ها', 'sohateb'); ?></span>
				</a>
				<a class="st-cat st-cat--f" href="<?php echo esc_url($mask_url); ?>" data-reveal>
					<span class="st-cat__label"><?php esc_html_e('ماسک‌ها', 'sohateb'); ?></span>
				</a>
				<a class="st-cat st-cat--g" href="<?php echo esc_url($pro_url); ?>" data-reveal>
					<span class="st-cat__label"><?php esc_html_e('حرفه‌ای', 'sohateb'); ?></span>
				</a>
			</div>
		</div>
	</section>

	<section class="st-featured" id="featured" aria-labelledby="st-feat-title">
		<div class="st-container">
			<header class="st-section-head st-section-head--light" data-reveal>
				<h2 id="st-feat-title"><?php esc_html_e('محصولات منتخب', 'sohateb'); ?></h2>
				<p><?php esc_html_e('انتخابی از کاتالوگ‌های Isabelle Lancray، DSV-LINE، V&V و Dr. Rimpler.', 'sohateb'); ?></p>
			</header>

			<div class="st-product-grid">
				<?php
				if (class_exists('WooCommerce')) {
					$q = new WP_Query([
						'post_type'      => 'product',
						'posts_per_page' => 8,
						'post_status'    => 'publish',
						'meta_key'       => '_featured',
						'meta_value'     => 'yes',
					]);
					if (!$q->have_posts()) {
						$q = new WP_Query([
							'post_type'      => 'product',
							'posts_per_page' => 8,
							'post_status'    => 'publish',
						]);
					}
					if ($q->have_posts()) {
						woocommerce_product_loop_start();
						while ($q->have_posts()) {
							$q->the_post();
							wc_get_template_part('content', 'product');
						}
						woocommerce_product_loop_end();
						wp_reset_postdata();
					} else {
						echo '<p class="st-empty">' . esc_html__('به‌زودی محصولات اضافه می‌شوند.', 'sohateb') . '</p>';
					}
				} else {
					get_template_part('template-parts/placeholder', 'products');
				}
				?>
			</div>

			<div class="st-section-cta" data-reveal>
				<a class="st-btn st-btn--light" href="#brands">
					<?php esc_html_e('مشاهده برندها', 'sohateb'); ?>
				</a>
			</div>
		</div>
	</section>

	<section class="st-spotlight" aria-labelledby="st-spot-title">
		<div class="st-container st-spotlight__grid">
			<figure class="st-spotlight__visual" data-reveal>
				<div class="st-spotlight__frame">
					<img
						class="st-spotlight__logo"
						src="<?php echo esc_url(SOHATEB_URI . '/assets/images/brand-logo-white.png'); ?>"
						alt="Soha Teb Beauty School"
						width="420"
						height="420"
					>
				</div>
			</figure>
			<div class="st-spotlight__copy" data-reveal>
				<p class="st-kicker">SOHA TEB</p>
				<h2 id="st-spot-title"><?php esc_html_e('از کلینیک تا مراقبت روزانه', 'sohateb'); ?></h2>
				<p><?php esc_html_e('سها طب نماینده رسمی Level 7 و ارائه‌دهنده خطوط Isabelle Lancray، DSV-LINE، V&V و Dr. Rimpler برای درمان حرفه‌ای و روتین خانگی است.', 'sohateb'); ?></p>
				<a class="st-btn st-btn--primary" href="#featured">
					<?php esc_html_e('محصولات منتخب', 'sohateb'); ?>
				</a>
			</div>
		</div>
	</section>

	<section class="st-about" id="about" aria-labelledby="st-about-title">
		<div class="st-container">
			<header class="st-section-head" data-reveal>
				<h2 id="st-about-title"><?php esc_html_e('درباره سها طب', 'sohateb'); ?></h2>
				<p><?php esc_html_e('توزیع تخصصی محصولات مراقبت پوست — Isabelle Lancray، DSV-LINE، V&V و Dr. Rimpler.', 'sohateb'); ?></p>
			</header>
		</div>
	</section>

</main>

<?php
get_footer();