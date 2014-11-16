/*
 * Griddler jQuery Plugin
 * Copyright (c) 2013 Mkamla.com
 * http://www.mkamla.com/products/griddler/demo
 * Version 1.1.0 (10-13-2013)
 *
 */

(function($){
	$.fn.Griddler = function(options){		
		var s = $.extend({
			ratio: '16:9',// width to height ratio in units. Ex: '16:9' or '1:1'
			margin: 5, //margin between blocks in pixels
			columns: 4, //number of vertical columns in layout
			featureGrid: 'inline',//featured grid option. Ex: 'inline', 'top' or 'disable'
			rollover: true,//enable rollover effect. Ex. true or false
			gridLimit: 13,//max number of grids to display. Ex: 5,10, or false
			expandLimit: true//true or false
		},options);

		var g = {};
		
		var n = s.ratio.split(':');
		s.ratio = (n[1])/(n[0]);
		if(isNaN(s.ratio)||s.ratio === 'undefined'){
			s.ratio = 1;
		};

		var userAgent = navigator.userAgent;
		var patt = /MSIE 7.0/i;
		var ie7 = patt.test(userAgent);
		var chrome = /Chrome/i.test(userAgent);

		var element = this;
		var parentContainer = $(element).parent().attr('id');
		var pLength = $(element).children().length;
		var pData = $(element).find('li');
		var dataLimit = (Number(s.gridLimit)!== 0)? s.gridLimit: pLength;
		var activeGrids = dataLimit;
		var lightboxMarkup = '<div id="lightbox_wrapper"><div id="lightbox"><div id="close_lightbox"></div></div></div>';

		function gridInline(){
			g.featWidth = (2/s.columns)*100;
			g.featHeight = (2/g.totalRowQt)*100;
			g.projTopWidth = g.width-g.featWidth;
			g.topRegWidth = (1/(s.columns-2))*100;
			g.topRegHeight = 50;
			g.regWidth = (1/s.columns)*100;
			g.regHeight = (1/g.btmRowQt)*100;
		};

		function gridTop(){
			g.featWidth = g.width;
			g.featHeight = (s.columns/(g.totalRowQt))*100;
			g.projTopWidth = g.width-g.featWidth;
			g.topRegWidth = (1/s.columns)*100;
			g.topRegHeight = (1/g.topRowQt)*100;
			g.regWidth = g.topRegWidth;
			g.regHeight = (1/g.btmRowQt)*100;
		};

		function gridList(){
			g.featWidth = g.width;
			g.featHeight = (1/g.rowQt)*100;
			g.projTopWidth = g.width;
			g.topRegWidth = g.width;
			g.topRegHeight = (1/g.topRowQt)*100;
			g.regWidth = g.width;
			g.regHeight = (1/g.btmRowQt)*100;
			s.columns = 1;/*IMPORTANT*/
		};

		function gridDisable(){
			g.topRegWidth = (1/s.columns)*100;
			g.topRegHeight = (1/g.topRowQt)*100;
			g.featHeight = (g.topRowQt/g.totalRowQt)*100;
			g.regWidth = g.topRegWidth;
			g.regHeight = (1/g.btmRowQt)*100;
		};

		function GridParams(w){
			g.width = 100;
			g.parentWidthPX = $('#'+parentContainer+'').width();
			if(s.columns<=2&&s.featureGrid ==='inline'){
				s.featureGrid = 'disable';
				s.columns = 1;
			} else if(s.columns<2&&s.featureGrid ==='top'){
				s.featureGrid = 'disable';
				s.columns = 1;
			};
			if(s.featureGrid !== 'disable'){
				//featured grid layout props
				if(s.columns>2&&s.featureGrid ==='inline'){
					//regular inline arrangement
					g.topCap = (s.columns-2)*2;
					g.rowQt = Math.ceil((activeGrids-(g.topCap+1))/s.columns);

					if((activeGrids-1)>=((s.columns-2)*2)){
						g.topRowQt = 2;
						g.btmRowQt = Math.ceil(((activeGrids-1)-(g.topCap))/s.columns);

					} else {
						g.topRowQt = Math.ceil((activeGrids-1)/s.columns);
						g.btmRowQt = 0;
					};

					g.totalRowQt = g.topRowQt+g.btmRowQt;
					
					gridInline();

				} else if(s.columns>=2&&s.featureGrid ==='top') {
					//regular top
					g.rowQt = Math.ceil((activeGrids-1)/s.columns);
					g.topCap = s.columns*(Math.floor(g.rowQt/2));
					g.topRowQt = g.topCap/s.columns;
					g.btmRowQt = g.rowQt-g.topRowQt;
					g.totalRowQt = s.columns+g.topRowQt+g.btmRowQt;

					gridTop();

				} else {
					//list
					g.rowQt = activeGrids;
					g.topCap = s.columns*(Math.floor((g.rowQt-1)/2));
					g.topRowQt = g.topCap;
					g.btmRowQt = (g.rowQt-1)-g.topRowQt;
					g.totalRowQt = activeGrids;

					gridList();
				}
			} else {
				//disabled grid props
				g.rowQt = Math.ceil(activeGrids/s.columns);
				g.topCap = s.columns*(Math.floor(g.rowQt/2));

				g.topRowQt = g.topCap/s.columns;
				g.btmRowQt = Math.ceil((activeGrids-g.topCap)/s.columns);
				g.totalRowQt = Math.ceil(activeGrids/s.columns);

				gridDisable();
			}

		};
		

		GridParams(parseInt($(element).css('width'),10)-1);

		function setData(){
			if(g.dataIsSet === 'set'){
				return;
			};

			var topQt, rowQt;
			if(s.featureGrid!=='disable'){
				$('#featured_project').append(pData[0]);
				
				for(i=1;i<dataLimit;i++){
					if(i<=g.topCap){
						$('#project_top').append(pData[i]);
					} else {
						$('#project_btm').append(pData[i]);
					};					
				};	
							
			} else {

				for(i=0;i<dataLimit;i++){
					if(i<g.topCap){
						$('#project_top').append(pData[i]);
					} else {
						$('#project_btm').append(pData[i]);
					};					
				};
			};

			$(element).remove();
			
			(function setGridLimit(){
				if(dataLimit !== 0 && s.expandLimit===true && (pLength-s.gridLimit)>0 && (pLength-activeGrids)>0){
					if($('#griddler_load').length<1){
						g.loaderExists = true;
						$('<div id="griddler_load">Load More</div>').insertAfter('#project_btm');
						g.loaderHeight = ($('#griddler_load').height())+parseInt($('#griddler_load').css('paddingTop'),10)+parseInt($('#griddler_load').css('paddingBottom'),10)+parseInt($('#griddler_load').css('marginTop'),10)+parseInt($('#griddler_load').css('marginBottom'),10);

					};
				} else {
					g.loaderExists = false;
					g.loaderHeight = 0;
				};
			}());

			$('#'+parentContainer+'').css({
				'height': GridHeight(),
				'paddingBottom': g.loaderHeight,
				'overflow': 'hidden'
			});
			
			g.dataIsSet = 'set';
		};
		
		function GridHeight(){
			var result;
			g.topRowQt;
			g.btmRowQt;
			g.totalRowQt;
			var newWidth = $('#'+parentContainer+'').width();			
			var newRowHeight = ((newWidth/s.columns)-(2*s.margin))*s.ratio;
			result = g.totalRowQt*(newRowHeight+(2*s.margin));
			return result;
		};

		function Grid(targ,w,h){
			var $$this = this;
			this.targ = targ;
			var targets;
			this.width = w;
			this.height = h;
			
			if(typeof(this.targ)==='object'){	
				targets = this.targ[0];
				for(i=1;i<this.targ.length;i++){
					targets = targets+', '+this.targ[i];
				};
			} else {
				targets = this.targ;
			};

			if(ie7){
				$(targets).css({
					'width': Math.floor(this.width)+'%',
					'height': Math.floor(this.height)+'%'
				});
			} else {
				$(targets).css({
					'width': this.width+'%',
					'height': this.height+'%'
				});
			};
			
			$(targets).find('a').each(function(i){
				var anchorTag = $(this);
				anchorTag.css({
					'width':'100%',
					'height':'100%',
					'overflow':'hidden',
					'display':'inline-block'
				});
			});

			$(targets).find('img').each(function(i){
				var targetImage = $(this);
				//force browser to avoid image cache
				var oSrc = targetImage.attr('src');
				targetImage.attr("src",oSrc+ "?" + new Date().getTime());
				if(targetImage.attr('class')!=='sized'){
					targetImage.css('opacity', '0');
				}
				targetImage.on('load',function(){
					$$this.imgFillr(targetImage,$$this.width,$$this.height);
				});
				
			});
		};

		Grid.prototype.imgFillr = function(image,width,height){
			$__this = this;
			this.image1 = image;
			this.iSrc = this.image1.attr('src');
			this.width1 = width;
			this.height1 = height;
			this.ratioRule = this.height1/this.width1;
			this.imageState = this.image1.attr('class');
			if(this.imageState==='sized'){
				return;
			};
			this.imageW = parseInt(this.image1.css('width'),10);
			this.imageH = parseInt(this.image1.css('height'),10);
			this.ratioImage = this.imageH/this.imageW;
			
			if(this.ratioImage !== s.ratio){
				if(this.ratioImage < s.ratio){
					//image is too tall
					this.finalHeight = '100%';
					this.finalWidth = (chrome===true)? (((this.imageW*n[1])/(this.imageH))/n[0])*100+'%':'auto';
				} else {
					//image is too wide
					this.finalHeight = 'auto';
					this.finalWidth = '100%';
				};
			} else {
				this.finalHeight = '100%';
				this.finalWidth = '100%';
			};
			
			this.image1.addClass('sized').css({
				'width': this.finalWidth,
				'height': this.finalHeight
			}).animate({'opacity': '1'});
		};
		
		function Lightbox(t,iframe){
			$this = this;
			this.target = t;
			this.iframe = iframe;
			$lightbox = $('#lightbox');
			this.windowWidth = parseInt($(window).width(),10);
			this.windowHeight = parseInt($(window).height(),10);
			this.lbPaddingTop = parseInt($lightbox.css('paddingTop'));
			this.lbPaddingRight = parseInt($lightbox.css('paddingRight'));
			this.lbPaddingBottom = parseInt($lightbox.css('paddingBottom'));
			this.lbPaddingLeft = parseInt($lightbox.css('paddingLeft'));
			this.closeWidth = parseInt($('#close_lightbox').css('width'),10);
			this.createDisplayElement();
			$lightboxImage = $('#lb_element');
			image = {};
			image.src = this.target.attr('href');
			$('embed, select, object').css('visibility','hidden');
			this.init();
		};
		
		Lightbox.prototype.createDisplayElement = function(){
			if($this.iframe === 'true'){
				var iframeURL = this.target.attr('href');
				var iframeWidth;
				var iframeHeight;
				var vimeoDetect = iframeURL.search('vimeo');
				var youtubeDetect = iframeURL.search('youtu');
				if(vimeoDetect===-1 && youtubeDetect===-1){
					iframeWidth = $this.windowWidth-($this.lbPaddingLeft + $this.lbPaddingRight+$this.closeWidth+100);
					iframeHeight = $this.windowHeight-($this.lbPaddingTop + $this.lbPaddingBottom+100);
				} else {
					iframeWidth = 560;
					iframeHeight = 315;
				};
				
				$('<iframe id="lb_element" src="" width="'+iframeWidth+'" height="'+iframeHeight+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>').insertBefore('#close_lightbox');
			} else {
				$('<img id="lb_element" src="" alt="" />').insertBefore('#close_lightbox');
			};
		};
		
		Lightbox.prototype.init = function(){
			_this = this;
			$lightboxImage.attr('src',image.src).css({'display': 'none'});
			$('#lightbox_wrapper').show();
			$lightboxImage.on('load',function(){
				$this.display();
			});
		};
		
		Lightbox.prototype.display = function(){
			paddingVertical = $this.lbPaddingTop + $this.lbPaddingBottom;
			paddingSide = $this.lbPaddingRight + $this.lbPaddingLeft;
			image.width = parseInt($lightboxImage.css('width'),10);
			image.height = parseInt($lightboxImage.css('height'),10);
			image.ratio = image.width/image.height;
			if((image.height+paddingVertical) > $this.windowHeight){
				image.height = ($this.windowHeight-paddingVertical);
				image.width = image.height*image.ratio;
				$lightboxImage.css({
					'width':image.width,
					'height':image.height
				});
			};
			
			if(image.width > ($this.windowWidth-(paddingSide+($this.closeWidth*2)))){
				image.width = ($this.windowWidth-(paddingSide+($this.closeWidth*2)));
				image.height = image.width/image.ratio;
				$lightboxImage.css({
					'width':image.width,
					'height':image.height
				});
			};
			
			$lightbox.css('top',($this.windowHeight - (image.height+paddingVertical))/2);
			
			$lightbox.animate({'width': image.width, 'height': image.height},500,function(){
				$lightboxImage.fadeIn();
			});
		};
		
		Lightbox.prototype.collapse = function(){
			$lightboxImage.stop(true, true).css({'width':'auto','height':'auto','display': 'none'}).remove();
			$lightbox.stop(true,true).css({'width': '0px', 'height': '0px'});
			$('#lightbox_wrapper').stop(true,true).hide();
			$('embed, select, object').css('visibility','visible');	
		};
		
		function RRenter(){		
			if(s.rollover !== false){
				$('.project_info', this).stop(true,true).fadeIn(300);
				$('.project_info h2', this).stop(true,true).animate({'top':'40%'});
			};	
		};

		function RRleave(){			
			if(s.rollover !== false){
				$('.project_info', this).stop(true,true).fadeOut();
				$('.project_info h2', this).stop(true,true).animate({'top':'120%'},300);
			};
		};

		function Click(e){
			
			if(ie7){
				var resource = this.firstChild.firstChild;
				resource.setAttribute('id','Light');
				if(resource.className ==='lightbox' || resource.className('class') ==='iframe'){
					e.preventDefault();
					iframe = (resource.className ==='iframe')? 'true': 'false';
					new Lightbox($('#Light'),iframe);
				} else {
					window.location = resource.getAttribute('href');
				};
				resource.removeAttribute('id');
			} else {
				var resource = $(this).children('a');
				if(resource.attr('class') ==='lightbox' || resource.attr('class') ==='iframe'){
					e.preventDefault();
					iframe = (resource.attr('class') ==='iframe')? 'true': 'false';
					new Lightbox(resource,iframe);
				} else {
					window.location = resource.attr('href');
				};
			}
		};

		function fontSize(){
			var size = (parseInt($('#project_top li').css('height'),10)*0.1)+'px';
			g.FontSize = size;
			return(size);
		};

		function setLayout(){
			$(element).css('visibility', 'none');

			if($('#lightbox_wrapper').length<1){
				$('#'+parentContainer+'').append(lightboxMarkup+'<ul id="featured_project"></ul><ul id="project_top"></ul><ul id="project_btm"></ul>');
			};
			if(s.featureGrid!=='disable'){

				if(s.columns>=2&&s.featureGrid ==='top'){
					//if top
					new Grid('#featured_project',g.featWidth,g.featHeight);

					setData();

					$('#project_top').css({
						'width': g.width+'%',
						'height': (g.topRowQt/g.totalRowQt)*100+'%'
					});

					$('#project_btm').css({
						'width': g.width+'%',
						'height': (g.btmRowQt/g.totalRowQt)*100+'%'
					});

					new Grid(['#project_top li'],g.topRegWidth,g.topRegHeight);
					new Grid(['#project_btm li'],g.regWidth,g.regHeight);
					
					new Grid(['#featured_project li'],g.featWidth,100);
			
					$('#featured_project .project_info').css({
						'height': (g.featHeight)
					});

				} else if (s.columns>2&&s.featureGrid ==='inline'){
					//if inline
					$('#featured_project').css({
						'width': g.featWidth+'%',
						'height': g.featHeight+'%'
					});
					setData();
					$('#project_top').css({
						'width': g.projTopWidth+'%',
						'height': g.featHeight+'%'
					});					
					$('#project_btm').css({
						'width': g.width+'%',
						'height': ((g.btmRowQt/g.totalRowQt)*100)+'%'
					});					


					new Grid(['#featured_project li'],100,100);
					new Grid(['#project_top li'],g.topRegWidth,g.topRegHeight);
					new Grid(['#project_btm li'],g.regWidth,g.regHeight);

				} else {
					//default single list
					$('#featured_project').css({
						'width': g.featWidth+'%',
						'height': g.featHeight+'%'
					});
					setData();
					$('#project_top').css({
						'width': g.width+'%',
						'height': ((g.btmRowQt/g.totalRowQt)*100)+'%'
					});					
					$('#project_btm').css({
						'width': g.width+'%',
						'height': ((g.btmRowQt/g.totalRowQt)*100)+'%'
					});					

					new Grid(['#featured_project li'],100,100);
					new Grid(['#project_top li'],g.topRegWidth,g.topRegHeight);
					new Grid(['#project_btm li'],g.regWidth,g.regHeight);

				};

			} else {
				//if disabled
				if($('#lightbox_wrapper').length<1){
					$('#'+parentContainer+'').append(lightboxMarkup+'<ul id="project_top"></ul><ul id="project_btm"></ul>');
				};
				$('#project_top').css({
					'width': g.width+'%',
					'height': (((g.topCap/s.columns)/g.rowQt)*100)+'%'
				});

				$('#project_btm').css({
					'width': g.width+'%',
					'height': ((g.rowQt-(g.topCap/s.columns))/g.rowQt)*100+'%'
				});

				setData();

				new Grid(['#project_top li'],g.topRegWidth,(100/g.topRowQt));
				new Grid(['#project_btm li'],g.regWidth,(100/g.btmRowQt));
				new Grid(['#featured_project li, #featured_project .project_info'],g.featWidth,100);
				
			};				

			if(ie7){
				$('#featured_project li, #project_top li, #project_btm li').wrapInner("<div class='grid_wrapper'></div>");
				$('#featured_project li, #project_top li, #project_btm li').css({
					'padding': '0px',
					'overflow': 'hidden',
					'display': 'inline-block'
				});
				$('.grid_wrapper').css({
					'padding': s.margin
				});
			} else{
				$('#featured_project li, #project_top li, #project_btm li').css({
					'boxSizing': 'border-box',
					'padding': s.margin,
					'overflow': 'hidden'
				});
			};
			

			$('#featured_project .project_info, #project_top .project_info, #project_btm .project_info').css({
				'width': '100%',
				'height': '100%',
				'padding': s.margin,
				'backgroundClip': 'content-box',
				'boxSizing': 'border-box'
			});

			if(g.loaderExists){
				$('#griddler_load').click(function(){
					loadMoreGrids();
				});
			};

			function loadMoreGrids(){
				var loadIncrement = ((pLength-activeGrids)>=s.columns*2)? s.columns*2: pLength-activeGrids;
				var btmLength = $('#project_btm li').length;
				if(btmLength>0){
					
					var newBtmRowQt = Math.ceil((btmLength+loadIncrement)/s.columns);
					var additionalGridQt = newBtmRowQt-g.btmRowQt;
					g.totalRowQt = g.totalRowQt+additionalGridQt;
					g.btmRowQt = g.btmRowQt+additionalGridQt;

					function recalcGrid(){
						if(s.featureGrid !== 'disable'){
							if(s.columns>2&&s.featureGrid ==='inline'){
								gridInline();
							} else if(s.columns>=2&&s.featureGrid ==='top') {
								gridTop();
							} else {
								gridList();
							}
						} else {
							gridDisable();
						};

						$('#'+parentContainer+'').css({
							'height': GridHeight()
						});

						for(i=0;i<loadIncrement;i++){
							var c = activeGrids+i;
							$('#project_btm').append(pData[c]);
							$(pData[c]).attr('id','appended_'+c+'').css({
								'boxSizing': 'border-box',
								'padding': s.margin,
								'overflow': 'hidden'
							});

							if(ie7){
								$('#appended_'+c).css({
									'padding': '0px',
									'overflow': 'hidden',
									'fontSize': g.FontSize,
									'display': 'inline-block'
								}).wrapInner("<div class='grid_wrapper'></div>");

								$('#appended_'+c+' .grid_wrapper').css({
									'padding': s.margin
								});
							};

							$('#appended_'+c+' h2').css({'fontSize': g.FontSize});

							$(pData[c]).bind( "click", Click);
							$(pData[c]).bind( "mouseenter", RRenter);
							$(pData[c]).bind( "mouseleave", RRleave);
						};

						new Grid('#featured_project',g.featWidth,g.featHeight);
						if(s.featureGrid==='inline'&&s.columns>2){
							new Grid('#project_top',g.projTopWidth,g.featHeight);
						} else {
							new Grid('#project_top',g.width,(g.topRowQt/g.totalRowQt)*100);
						};				
						new Grid('#project_btm',g.width,(g.btmRowQt/g.totalRowQt)*100);					


						new Grid(['#featured_project li'],100,100);
						new Grid(['#project_top li'],g.topRegWidth,g.topRegHeight);
						new Grid(['#project_btm li'],g.regWidth,g.regHeight);

						$('#project_btm .project_info').css({
							'width': '100%',
							'height': '100%',
							'padding': s.margin,
							'backgroundClip': 'content-box',
							'boxSizing': 'border-box'	
						});
						
					}
					recalcGrid();
				};
				
				(function(){
					$('#featured_project .project_info, #project_top .project_info, #project_btm .project_info').css({
						'width': '100%',
						'height': '100%'	
					});
					activeGrids = activeGrids+loadIncrement;
				}());
					
				if(pLength-activeGrids<=0){
					g.loaderExists = false;
					$('#griddler_load').remove();
				};
			};
				
		};
		
		var resizeSet = (function(){
  			var timer = 0;
		  	return function(callback, ms, state){
				if(g.resizeState === 'inactive'){
					clearTimeout (timer);
					timer = setTimeout(callback, ms);
				};
		  };
		})();
		
		setLayout();
		
		$('#featured_project li, #project_top li, #project_btm li').bind( "click", Click);
		$('#close_lightbox').click(function(){
			$this.collapse();
		});
		$('#featured_project li, #project_top li, #project_btm li').bind( "mouseenter", RRenter);
		$('#featured_project li .project_info h2, #project_top li .project_info h2, #project_btm li .project_info h2').css({'fontSize': fontSize()});
		$('#featured_project li, #project_top li, #project_btm li').bind( "mouseleave", RRleave);

		g.resizeState = 'inactive';
		$(window).resize(function(){
			resizeSet(function(){
				g.resizeState = 'active';
				$('#'+parentContainer+'').css('overflow', 'hidden').animate({'height': GridHeight()},350,function(){
					$('#featured_project li .project_info h2, #project_top li .project_info h2, #project_btm li .project_info h2').css({'fontSize': fontSize()});
				});
				g.resizeState = 'inactive';
			},500,g.resizeState);
		});
	};
})(jQuery);