<?php
/**
 * Placeholder product grid when WooCommerce is unavailable.
 *
 * @package SohaTeb
 */

$items = [
	['title' => 'سرم آبرسان سها طب', 'price' => '۸۹۰٬۰۰۰ تومان', 'tone' => 'a'],
	['title' => 'کرم مرطوب‌کننده روزانه', 'price' => '۶۵۰٬۰۰۰ تومان', 'tone' => 'b'],
	['title' => 'پالت سایه حرفه‌ای', 'price' => '۱٬۲۵۰٬۰۰۰ تومان', 'tone' => 'c'],
	['title' => 'رژ لب مخملی', 'price' => '۴۲۰٬۰۰۰ تومان', 'tone' => 'd'],
	['title' => 'روغن تقویت مو', 'price' => '۷۸۰٬۰۰۰ تومان', 'tone' => 'e'],
	['title' => 'ست براش آموزشی', 'price' => '۱٬۵۸۰٬۰۰۰ تومان', 'tone' => 'a'],
	['title' => 'دوره مقدماتی میکاپ', 'price' => '۴٬۹۰۰٬۰۰۰ تومان', 'tone' => 'b'],
	['title' => 'دوره مراقبت پوست', 'price' => '۳٬۹۰۰٬۰۰۰ تومان', 'tone' => 'c'],
];
?>
<ul class="products columns-4">
	<?php foreach ($items as $item) : ?>
		<li class="st-product product" data-reveal>
			<div class="st-product__link">
				<div class="st-product__media st-product__media--<?php echo esc_attr($item['tone']); ?>">
					<span class="st-badge st-badge--featured"><?php esc_html_e('ویژه', 'sohateb'); ?></span>
				</div>
				<div class="st-product__body">
					<span class="st-product__brand">SOHA TEB</span>
					<h3 class="st-product__title"><?php echo esc_html($item['title']); ?></h3>
					<div class="st-product__price"><?php echo esc_html($item['price']); ?></div>
				</div>
			</div>
		</li>
	<?php endforeach; ?>
</ul>