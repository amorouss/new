<?php
/**
 * Page template.
 *
 * @package SohaTeb
 */

get_header();
?>

<main id="main" class="st-main">
	<div class="st-container st-page">
		<?php while (have_posts()) : the_post(); ?>
			<article <?php post_class('st-article'); ?>>
				<h1 class="st-article__title"><?php the_title(); ?></h1>
				<div class="st-article__content">
					<?php the_content(); ?>
				</div>
			</article>
		<?php endwhile; ?>
	</div>
</main>

<?php
get_footer();