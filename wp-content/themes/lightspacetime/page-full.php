<?php
/*
Template Name: Full Width
*/
get_header(); ?>
<div class="row-full-width main-content-container">
	<div role="main">

	<?php /* Start loop */ ?>
	<?php while (have_posts()) : the_post(); ?>
		<article <?php post_class() ?> id="post-<?php the_ID(); ?>">
			<header id="header-section">
				<div class="text-overlay-header">
					<div class="title-container">
						<h1 class="entry-title"><?php the_title(); ?></h1>
					</div>
					<div class="description-container">
						<div class="description-border">
							<h2 class="site-description"><span class="bold">LESS TALK</span> <br /> MORE <span class="bold">ACTION</span></h2>
						</div>	
					</div>	
				</div>
			</header>
			<div class="entry-content">
				<?php the_content(); ?>
			</div>
			<footer>
				<?php wp_link_pages(array('before' => '<nav id="page-nav"><p>' . __('Pages:', 'FoundationPress'), 'after' => '</p></nav>' )); ?>
				<p><?php the_tags(); ?></p>
			</footer>
			<?php //comments_template(); ?>
		</article>
	<?php endwhile; // End the loop ?>

	</div>
</div>

<?php get_footer(); ?>
