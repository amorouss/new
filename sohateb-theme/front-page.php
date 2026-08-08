<?php
/**
 * Front page — product showcase UI.
 *
 * @package SohaTeb
 */

get_header();

$shop_url = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/shop/');
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
				<?php esc_html_e('زیبایی با استاندارد آموزش حرفه‌ای', 'sohateb'); ?>
			</h1>
			<p class="st-hero__lead" data-reveal data-reveal-delay="140">
				<?php esc_html_e('ویترین محصولات سها طب برای معرفی خطوط مراقبت پوست، آرایش و ابزار آموزشی.', 'sohateb'); ?>
			</p>
			<div class="st-hero__cta" data-reveal data-reveal-delay="200">
				<a class="st-btn st-btn--primary" href="<?php echo esc_url($shop_url); ?>">
					<?php esc_html_e('مشاهده محصولات', 'sohateb'); ?>
				</a>
				<a class="st-btn st-btn--ghost" href="#featured">
					<?php esc_html_e('محصولات ویژه', 'sohateb'); ?>
				</a>
			</div>
		</div>
		<div class="st-hero__scroll" aria-hidden="true" data-reveal data-reveal-delay="280"></div>
	</section>

	<section class="st-categories" aria-labelledby="st-cat-title">
		<div class="st-container">
			<header class="st-section-head" data-reveal>
				<h2 id="st-cat-title"><?php esc_html_e('دسته‌بندی‌ها', 'sohateb'); ?></h2>
				<p><?php esc_html_e('مسیر سریع به خطوط اصلی محصولات.', 'sohateb'); ?></p>
			</header>
			<div class="st-cat-row">
				<?php
				$cats = [
					['slug' => 'skin', 'label' => 'پوست', 'tone' => 'a'],
					['slug' => 'makeup', 'label' => 'آرایش', 'tone' => 'b'],
					['slug' => 'hair', 'label' => 'مو', 'tone' => 'c'],
					['slug' => 'tools', 'label' => 'ابزار', 'tone' => 'd'],
					['slug' => 'training', 'label' => 'آموزش', 'tone' => 'e'],
				];
				foreach ($cats as $cat) :
					$url = get_term_link($cat['slug'], 'product_cat');
					if (is_wp_error($url)) {
						$url = $shop_url;
					}
					?>
					<a class="st-cat st-cat--<?php echo esc_attr($cat['tone']); ?>" href="<?php echo esc_url($url); ?>" data-reveal>
						<span class="st-cat__label"><?php echo esc_html($cat['label']); ?></span>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="st-featured" id="featured" aria-labelledby="st-feat-title">
		<div class="st-container">
			<header class="st-section-head st-section-head--light" data-reveal>
				<h2 id="st-feat-title"><?php esc_html_e('محصولات منتخب', 'sohateb'); ?></h2>
				<p><?php esc_html_e('نمونه‌های ویترین — در مرحله بعد با محصولات واقعی جایگزین می‌شوند.', 'sohateb'); ?></p>
			</header>

			<div class="st-product-grid">
				<?php
				if (class_exists('WooCommerce')) {
					$q = new WP_Query([
						'post_type'      => 'product',
						'posts_per_page' => 8,
						'post_status'    => 'publish',
					]);
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
				<a class="st-btn st-btn--light" href="<?php echo esc_url($shop_url); ?>">
					<?php esc_html_e('همه محصولات', 'sohateb'); ?>
				</a>
			</div>
		</div>
	</section>

	<section class="st-spotlight" aria-labelledby="st-spot-title">
		<div class="st-container st-spotlight__grid">
			<figure class="st-spotlight__visual" data-reveal>
				<div class="st-spotlight__frame"></div>
			</figure>
			<div class="st-spotlight__copy" data-reveal>
				<p class="st-kicker">SOHA TEB</p>
				<h2 id="st-spot-title"><?php esc_html_e('از آموزش تا انتخاب محصول', 'sohateb'); ?></h2>
				<p><?php esc_html_e('سها طب فضای معرفی محصولات را با زبان مدرسه زیبایی می‌سازد؛ ساده، دقیق و آماده برای کاتالوگ کامل شما.', 'sohateb'); ?></p>
				<a class="st-btn st-btn--primary" href="<?php echo esc_url($shop_url); ?>">
					<?php esc_html_e('ورود به فروشگاه', 'sohateb'); ?>
				</a>
			</div>
		</div>
	</section>

	<section class="st-about" id="about" aria-labelledby="st-about-title">
		<div class="st-container">
			<header class="st-section-head" data-reveal>
				<h2 id="st-about-title"><?php esc_html_e('درباره سها طب', 'sohateb'); ?></h2>
				<p><?php esc_html_e('برند آموزشی زیبایی با تمرکز روی کیفیت محصول و تجربه هنرجو.', 'sohateb'); ?></p>
			</header>
		</div>
	</section>

</main>

<?php
get_footer();