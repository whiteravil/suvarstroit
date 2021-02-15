$(function() {

	const touchPrevent = e => {
		e.preventDefault();
	}

	function bodyNoScroll() {
		$('body').addClass('no-scroll');
  	document.addEventListener('touchmove', touchPrevent, { passive: true });
	}

	function bodyHasScroll() {
		$('body').removeClass('no-scroll');
  	document.removeEventListener('touchmove', touchPrevent, { passive: true });
	}

	let prevArrow = '<div class="slider-nav-arrow slider-prev"><span class="icon-angle-left"></span></div>',
			nextArrow = '<div class="slider-nav-arrow slider-next"><span class="icon-angle-right"></span><svg class="progress-ring" width="39" height="39"><circle class="progress-ring-circle" stroke-width="1" stroke="#171723" cx="19.5" cy="19.5" r="19" fill="transparent" /></svg></div>';

	let mainWindowSlider = $('.main-window-slider');

	mainWindowSlider.slick({
		slidesToShow: 1,
		arrows: false,
		dots: false,
		loop: true,
		fade: true,
	});

	let cantNextVideo = true;

	function nextVideoSlide(nextSlide) {
		let nextVideo = $('.main-banner-video-item').eq(nextSlide);
		$('.main-banner-video-item').each(function(i) {
			let ths = $(this);
			if ( i !== nextSlide ) {
				ths.removeClass('current-slide');
				setTimeout(() => {
					ths.hide().removeClass('active');
				}, 800);
			}
		});
		nextVideo.show();
		setTimeout(() => {
			nextVideo.addClass('active current-slide');
		}, 10);
	}

	$('.phone-mask').inputmask({
  	mask: "+7 999 999 99 99",
  	showMaskOnHover: false
  });

  $('.decimal').inputmask('decimal', {
    rightAlign: false
  });

	$('.main-window-slider-block .slider-next').on('click', function() {
		let currentSlide = mainWindowSlider.find('.slick-current').data('slick-index');
		if ( cantNextVideo ) {
			cantNextVideo = false;
			if ( currentSlide != mainWindowSlider.find('.slick-slide').length - 1 ) {
				currentSlide++;
				mainWindowSlider.slick('slickGoTo', currentSlide);
				nextVideoSlide(currentSlide)
			}
			else {
				mainWindowSlider.slick('slickGoTo', 0);
				nextVideoSlide(0)
			}
			setTimeout(() => {
				cantNextVideo = true
			}, 800)
		}
	});

	$('.main-window-slider-block .slider-prev').on('click', function() {
		let currentSlide = mainWindowSlider.find('.slick-current').data('slick-index');
		if ( cantNextVideo ) {
			cantNextVideo = false;
			if ( currentSlide != 0 ) {
				currentSlide--;
				mainWindowSlider.slick('slickGoTo', currentSlide);
				nextVideoSlide(currentSlide)
			}
			else {
				let lg = mainWindowSlider.find('.slick-slide').length - 1;
				mainWindowSlider.slick('slickGoTo', lg);
				nextVideoSlide(lg)
			}
			setTimeout(() => {
				cantNextVideo = true
			}, 800)
		}
	});

	$('.filter-range').each(function() {
		let ths = $(this),
				inpFrom = ths.find('.filter-range-input.from'),
				inpTo = ths.find('.filter-range-input.to'),
				fromVal = inpFrom.val(),
				toVal = inpTo.val(),
				min = inpFrom.data('min'),
				max = inpTo.data('max'),
				range = ths.find('.filter-range-slider')[0],
				rangeStepData = ths.find('.filter-range-slider').data('step'),
				inputs = [inpFrom[0], inpTo[0]],
				options = {
					start: [parseFloat(fromVal), parseFloat(toVal)],
					connect: true,
					range: {
						min: parseFloat(min),
						max: parseFloat(max)
					}
				};

		rangeStepData !== undefined ? options.step = parseFloat(rangeStepData) : options = options;

		noUiSlider.create(range, options);

		range.noUiSlider.on('update', function (values, handle) {
			parseFloat(values[handle]) == parseInt(values[handle]) ? values[handle] = parseInt(values[handle]) : values[handle] = parseFloat(values[handle]);
			inputs[handle].value = values[handle];
		});

		inpFrom.on('change', function() {
			range.noUiSlider.setHandle(0, parseFloat($(this).val()))
		});

		inpTo.on('change', function() {
			range.noUiSlider.setHandle(1, parseFloat($(this).val()))
		});

	});

	$('.select-style').select2({
		minimumResultsForSearch: -1,
		width: '100%'
	});

	let unhoverBannerTimeout;

	$('.main-window-projects-nav a').hover(function() {
		let thsId = $(this).data('tab-id'),
				notCurrTab = $(`.main-window-projects-item:not(${thsId})`);
		notCurrTab.removeClass('active');
		$(thsId).addClass('active');
		$('.main-window').addClass('overlay-darkness');
		clearTimeout(unhoverBannerTimeout)
	}, function() {
		$('.main-window-projects-item').removeClass('active');
		unhoverBannerTimeout = setTimeout(() => {
			$('.main-window').removeClass('overlay-darkness')
		}, 300)
	});

	$('.news-slider').slick({
		slidesToShow: 3,
		arrows: true,
		dots: false,
		infinite: false,
		prevArrow: $('.news-slider-arrow-prev'),
		nextArrow: $('.news-slider-arrow-next')
	});

	function openPopup(id) {
  	let notCurrentPopups = $(`.popup-wrapper:not(${id})`);
  	notCurrentPopups.removeClass('opened');
  	setTimeout(() => {
  		notCurrentPopups.hide()
  	}, 400);
  	$(id).show();
  	setTimeout(() => {
  		$(id).addClass('opened')
  	}, 50);
  	bodyNoScroll();
  }

  function closePopup(e) {
  	e !== undefined ? e.preventDefault() : '';
  	$('.popup-wrapper').removeClass('opened');
  	setTimeout(() => {
  		$('.popup-wrapper').hide();
  		$('.video-popup-block').html('');
  	}, 400);
  	bodyHasScroll();
  }

  $('.open-popup').on('click', function(e) {
  	e.preventDefault();
  	let id = $(this).attr('href');
  	openPopup(id);
  });

  $('.popup-close').on('click', closePopup);

  $('.popup-wrapper.opened').on('click', function(e) {
  	let clickTarget = $(e.target);
  	if ( clickTarget.hasClass('popup-flex') ) {
  		closePopup();
  	}
  });

  $('.video-block').each(function() {
  	let ths = $(this),
  			src = ths.data('video-src');
  	ths.find('.video-play').on('click', function() {
  		$('.video-popup-block').html(`<iframe width="560" height="315" src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
  		openPopup('#video-popup');
  	});
  });

  let scrollTextArr = [];

  $('.s-text-slider').each(function() {
  	scrollTextArr.push(0);
  });

  $('.text-slider').slick({
  	infinite: true,
  	arrows: false,
  	dots: false,
  	draggable: false,
  	autoplay: true,
  	autoplaySpeed: 0,
  	cssEase: 'linear',
  	variableWidth: true,
  	speed: 6000
  });

  let canTextAnimate = true;

  function scrollText() {
  	if ( canTextAnimate ) {
  		canTextAnimate = false;
  		$('.text-slider-wrapper').each(function() {
  			let ths = $(this);
	  			ths.css({
		  		'transform': `translate3d(${-ths.find('.text-slider-item').eq(0).outerWidth()}px, 0, 0)`
		  	})
		  	setTimeout(() => {
		  		ths.css({
		  			'transition': 'all 0s ease',
		  			'transform': `translate3d(0, 0, 0)`
		  		})
		  	}, 2500)
		  	setTimeout(() => {
		  		ths.attr('style', '')
		  		canTextAnimate = true
		  	}, 2550)
  		})
  	}
  }

  function projectHelpInfoPosition() {
  	$('.project-price-info-dropdown').each(function() {
  		let ths = $(this);
  		if ( ths.offset().left + ths.outerWidth() > $(window).width() ) {
  			ths.addClass('right-position')
  		}
  		else {
  			ths.removeClass('right-position')
  		}
  	});
  }

  $(window)
  .on('scroll', function() {
  	scrollText()
  })
  .on('load', function() {
  	projectHelpInfoPosition()
  })
  .on('resize', function() {
  	projectHelpInfoPosition()
  });

});
