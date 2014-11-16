</section>
<footer class="row">
	<?php do_action('foundationPress_before_footer'); ?>
	<?php dynamic_sidebar("footer-widgets"); ?>
	<?php do_action('foundationPress_after_footer'); ?>
</footer>
<a class="exit-off-canvas"></a>

	<?php do_action('foundationPress_layout_end'); ?>
	</div>
</div>
<?php wp_footer(); ?>
<?php do_action('foundationPress_before_closing_body'); ?>
<script type="text/javascript">
	/*global $:false */
		
		var $window = $(window);
    
		$(function(){"use strict";
			$('#header-section').css({'height':($(window).height())+'px'});

			$(window).resize(function(){
				$('#header-section').css({'height':($(window).height())+'px'});
			});

		});
		

	</script>
</body>
</html>
