
$(document).ready(function() {
	//preloader 

	// Background sliders 
	var backImages = $('#backgrounds').data('backgrounds').split(',');
	
	$.backstretch(backImages, {
		fade: 500,
		duration: 4000
	});
	
	// colour overlay of background slider
	if(!$('#color-overlay').length) {
		$('body').addClass('no-overlay');
	}
	
	// scroll main-navigation header animation
	if ($(window).scrollTop() === 0) {
		$('#main-nav').removeClass('scrolled');
	} else {
		$('#main-nav').addClass('scrolled');    
	}
	
	$(window).scroll(function() {
		if ($(window).scrollTop() === 0) {
			$('#main-nav').removeClass('scrolled');
		} else {
			$('#main-nav').addClass('scrolled');    
		}
	});
		
	$(window).load(function() {
		$('#main-nav').delay(500).animate( { 'top':0,'opacity':1 }, 500);
	});	

	// Background Text Animation Slider 
	$('.jumbotron').height($(window).height()*0.25);
	$('.header-logo').css({'marginTop':$(window).height()*0.10});
	$('.jumbotron .container').addClass('scale-in');
	
	$('.home-slider').flexslider({
		animation: "slide",
		directionNav: false,
		controlNav: false,
		direction: "vertical",
		slideshowSpeed: 3000,
		animationSpeed: 500,
		pauseOnHover:false,
		pauseOnAction:false,
		smoothHeight: true
	});
	
	$(window).scroll( function() {
	   var st = $(this).scrollTop();
	   $('.jumbotron').css({ 'opacity' : (1 - st/250) });

		scrollSpyRefresh();
		waypointsRefresh();
	});
		
	$(window).load(function() {
		$('.jumbotron').delay(500).animate({ 'height' : $(window).height()-2650 }, 500);
		
		setTimeout(function(){
			$('.jumbotron .container').addClass('in');
		},1000);
	});	

	// Scroll To Links
	$('a.scrollto').click(function(e){
		$('html,body').scrollTo(this.hash, this.hash, {gap:{y:-120}});
		e.preventDefault();

		if ($('.navbar-collapse').hasClass('in')){
			$('.navbar-collapse').removeClass('in').addClass('collapse');
		}
	});
	
	// Masonry 

	$(window).load(function(){

		$('#projects-container').css({visibility:'visible'});

		$('#projects-container').masonry({
			itemSelector: '.project-item:not(.filtered)',
			columnWidth:350,
			isFitWidth: true,
			isResizable: true,
			isAnimated: !Modernizr.csstransitions,
			gutterWidth: 20
		});

		scrollSpyRefresh();
		waypointsRefresh();
	});

	// Filter projcets
	var filters = [];
	
	$('#filter-works ul').each(function(i){
		filters[i] = {
			name:$(this).data('filter'),
			val : '*'
		};
	});
	
	$('#filter-works a').click(function(e){
		e.preventDefault();
		
		closePreview();
		
		$(this).parents('ul').find('li').removeClass('active');
			
		$(this).parent('li').addClass('active');
			
		for (var i=0; i<filters.length; i++){
			if($(this).data(filters[i].name)){filters[i].val = $(this).data(filters[i].name);}
		}
		
		$('.project-item').each(function(){
			
			var match;
			
			for (var i=0; i<filters.length; i++){
				if($(this).is(filters[i].val)){match = true;}
				else{match = false;break;}
			}	
			
			if(match){
				$(this).removeClass('filtered');
			}
			else{
				$(this).addClass('filtered');
			}
			
		});
		
		$('#projects-container').masonry('reload');
	
		var results = $('.project-item').not('.filtered').length;
		$('.filter-results span').html(results+'');
		$('.filter-results').slideDown();
		

		scrollSpyRefresh();
		waypointsRefresh();
	});
	// Project previews

	$('.project-item').click(function(e){

		e.preventDefault();
		
		if($(this).hasClass('active')){return false;}
		$('.project-item').removeClass('active');
		
		
		var elem =$(this);
		
		$.scrollTo('#preview-scroll', 600,
			{
				gap:{y:-120}
		});
			
		$('#preview-loader').addClass('show');
		
		if($('#project-preview').hasClass('open')){
			closePreview();
			elem.addClass('active');
			setTimeout(function(){
				buildPreview(elem);
			},1000);
		}else{
			elem.addClass('active');
			buildPreview(elem);
		}
	
	});
	
	$('.close-preview').click(function(e){
		e.preventDefault();
		
		closePreview();
	});
	
	function buildPreview(elem){
	
		var previewElem = $('#project-preview'),
			title = elem.find('.project-title').text(),
			descr = elem.find('.project-description').html();
			
		previewElem.find('.preview-title').text(title);

		previewElem.find('#preview-details ul').empty();
		elem.find('.project-attributes .newline').each(function(){
			previewElem.find('#preview-details ul').append('<li>'+$(this).html()+'</li>')
		});
		
		previewElem.find('#preview-content').html(descr);
		
		/*----Project with Image-----*/
		if(elem.find('.project-media').data('images')){
			
			var slidesHtml = '<ul class="slides">',
				slides = elem.find('.project-media').data('images').split(',');

			for (var i = 0; i < slides.length; ++i) {
				slidesHtml = slidesHtml + '<li><img src='+slides[i]+' alt=""></li>';
			}
		
			slidesHtml = slidesHtml + '</ul>';
			previewElem.find('#preview-media').addClass('flexslider').html(slidesHtml);

			$('#preview-media img').load(function(){

				$('#preview-media.flexslider').flexslider({
					slideshowSpeed: 3000,
					animation: 'slide',
					pauseOnHover:true,
					pauseOnAction:false,

					start: function(){
						setTimeout(function(){
							openPreview();
							$('#preview-loader').removeClass('show');
							$(window).trigger('resize');
						},1000);
					}
				});
				
			});
			
		}
		
		/*----Project with Video-----*/
		if(elem.find('.project-media').data('video')){
		
			var media = elem.find('.project-media').data('video');
			
			previewElem.find('#preview-media').html(media);
			
			$('#preview-media iframe').load(function(){
				$('#preview-media').fitVids();
				
				setTimeout(function(){
					openPreview();
					$('#preview-loader').removeClass('show');
				},1000);
				
			});	
		}
	}
	
	function openPreview() {

		$('#project-preview-wrapper').slideDown(600,function(){
			scrollSpyRefresh();
			waypointsRefresh();		
		});
		$('#project-preview').addClass('open');
		
	}
	
	function closePreview() {
		$('#project-preview-wrapper').slideUp(600,function(e){
			if($('#preview-media').hasClass('flexslider')){
				$('#preview-media').removeClass('flexslider')
					.flexslider('destroy');
			}
			
			$('#preview-media').html('');
			scrollSpyRefresh();
			waypointsRefresh();
		});
		$('#project-preview').removeClass('open');
		$('.project-item').removeClass('active');
	}
	// project thumbnails

	// Twitter functions

	// Resize functions
	$(window).resize(function(){
		// $.scrollTo('#preview-media', 0,
		// 	{
		// 		gap:{y:-120}
		// });
		// $('.header-logo').css({'marginTop':$(window).height()*0.25});
		scrollSpyRefresh();
		waypointsRefresh();
	});

	// remove css for IE
	$('.no-cssanimations #preview-loader').html('<div class="loader-gif"></div>');

	// tooltips
	$("[data-toggle='tooltip']").tooltip();

	//scrolling animations
	$('.scrollimation').waypoint(function() {
		$(this).addClass('in');
	}, { offset:function() {
			var h = $(window).height();
			if ($('body').height() - $(this).offset().top > h*0.3) {
				return h*0.7;
			} else {
				return h;
			}
		}
	});

	// refresh scroll spy

	function scrollSpyRefresh(){
		setTimeout(function(){
			$('body').scrollspy('refresh');
		},1000);
	}

	//refresh waypoints

	function waypointsRefresh(){
		setTimeout(function(){
			$.waypoints('refresh');
		},1000);
	}

	// Contact 

});
