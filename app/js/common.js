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

	let mainWindowSlider = $('.main-window-slider'),
			mainWindowSliderIntervar,
			mainWindowSliderIntervarTime = 5000;

	mainWindowSlider.on('init', function() {
		$('.main-window-slider-block .slider-next svg circle').css('animation-duration', `${mainWindowSliderIntervarTime - 10}ms`);
		startAutoPlayMainSlider();
	});

	mainWindowSlider.slick({
		slidesToShow: 1,
		arrows: false,
		dots: false,
		loop: true,
		fade: true,
		touchMove: false,
		draggable: false,
		swipe: false,
		swipeToSlide: false,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 0,
				settings: {
					touchMove: true,
					draggable: true,
					swipe: true,
					swipeToSlide: true,
				}
			},
			{
				breakpoint: 576,
				settings: {
					touchMove: true,
					draggable: true,
					swipe: true,
					swipeToSlide: true,
				}
			},
			{
				breakpoint: 768,
				settings: {
					touchMove: false,
					draggable: false,
					swipe: false,
					swipeToSlide: false,
				}
			}
		]
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

	$('.main-window-slider-block .slider-next').on('click', function() {
		if ( cantNextVideo ) {
			cantNextVideo = false;
			clearInterval(mainWindowSliderIntervar);
			$('.main-window-slider-block .slider-next').removeClass('ring-animate');
			startAutoPlayMainSlider();
			mainWindowSlider.slick('slickNext');
			setTimeout(() => {
				cantNextVideo = true
			}, 800)
		}
	});

	$('.main-window-slider-block .slider-prev').on('click', function() {
		if ( cantNextVideo ) {
			cantNextVideo = false;
			clearInterval(mainWindowSliderIntervar);
			$('.main-window-slider-block .slider-next').removeClass('ring-animate');
			startAutoPlayMainSlider();
			mainWindowSlider.slick('slickPrev');
			setTimeout(() => {
				cantNextVideo = true
			}, 800)
		}
	});

	mainWindowSlider.on('beforeChange', function(e, s, c, n) {
		nextVideoSlide(n);
	});

	function startAutoPlayMainSlider() {
		$('.main-window-slider-block .slider-next').removeClass('ring-animate');
		setTimeout(() => {
			$('.main-window-slider-block .slider-next').addClass('ring-animate')
		}, 10);
		mainWindowSliderIntervar = setInterval(() => {
			mainWindowSlider.slick('slickNext');
			if ( $('.main-window-slider-block .slider-next').hasClass('ring-animate') ) {
				$('.main-window-slider-block .slider-next').removeClass('ring-animate');
				setTimeout(() => {
					$('.main-window-slider-block .slider-next').addClass('ring-animate')
				}, 10);
			}
		}, mainWindowSliderIntervarTime);
	}

	$('.phone-mask').inputmask({
  	mask: "+7 999 999 99 99",
  	showMaskOnHover: false
  });

  $('.decimal').inputmask('decimal', {
    rightAlign: false
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

		if ( range ) {

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

		}

	});

	$('.select-style').select2({
		minimumResultsForSearch: -1,
		width: '100%',
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

	let newsSlider = $('.news-slider').slick({
		slidesToShow: 3,
		arrows: true,
		dots: false,
		infinite: false,
		prevArrow: $('.news-slider-arrow-prev'),
		nextArrow: $('.news-slider-arrow-next'),
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					variableWidth: true,
					contain: true,
					infinite: true
				}
			}
		]
	});

	newsSlider.on('beforeChange', function(e, s, c, n) {
		newsSlider.find('.slick-slide').removeClass('prev-slide').eq(n - 1).addClass('prev-slide')
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

  $('.popup-wrapper').on('click', function(e) {
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

  // function scrollText(slider) {
  // 	if ( canTextAnimate && $(window).scrollTop() > slider.offset().top - $(window).height() ) {
  // 		canTextAnimate = false;
  // 		slider.css({
	 //  		'transform': `translate3d(${-slider.find('.text-slider-item').eq(0).outerWidth()}px, 0, 0)`
	 //  	})
	 //  	setTimeout(() => {
	 //  		slider.css({
	 //  			'transition': 'all 0s ease',
	 //  			'transform': `translate3d(0, 0, 0)`
	 //  		})
	 //  	}, 2500)
	 //  	setTimeout(() => {
	 //  		slider.attr('style', '')
	 //  		canTextAnimate = true
	 //  	}, 2550)
  // 	}
  // }

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
  }projectHelpInfoPosition();

  function advantageHeight() {
  	$('.advantages-item.type-2').each(function() {
  		let ths = $(this),
  				thsBody = ths.find('.advantages-body'),
  				translateHeight = thsBody.outerHeight() - thsBody.find('.h4').outerHeight(true);
  		thsBody.css('transform', `translateY(${translateHeight}px)`);
  	});
  }advantageHeight();

  let layoutImages = $('.layout-image');
  layoutImages.slick({
  	slidesToShow: 1,
		arrows: false,
		dots: false,
		loop: true,
		fade: true,
		adaptiveHeight: true,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 0,
				settings: {
					fade: false
				}
			},
			{
				breakpoint: 575,
				settings: {
					fade: true
				}
			}
		]
  });

 

  $('.layouts-body-tab').each(function() {

  	let thsTab = $(this);

  	let layoutInfo = thsTab.find('.layout-info-slider');
	  layoutInfo.slick({
	  	slidesToShow: 1,
			arrows: false,
			dots: false,
			loop: true,
			fade: true,
			adaptiveHeight: true
	  });

	  thsTab.find('.select-layout-item').on('click', function() {
	  	let ths = $(this);
	  	if ( !ths.hasClass('active') ) {
	  		let dataAttr = ths.data('for'),
	  				i = parseInt(thsTab.find(`.layout-image img[data-img=${dataAttr}]`).parents('.slick-slide').data('slick-index'));
	  		thsTab.find('.select-layout-item').removeClass('active');
	  		ths.addClass('active');
	  		thsTab.find('.select-layout-border').css('transform', `translate(${ths.position().left}px, ${ths.position().top}px)`);
	  		layoutImages.slick('slickGoTo', i);
	  		layoutInfo.slick('slickGoTo', i);
	  	}
	  });

	  layoutImages.on('swipe', function(e, i, a) {
	  	if ( $(window).width() < 576 ) {
	  		layoutInfo.slick('slickGoTo', i.currentSlide)
	  	}
	  });

	  layoutInfo.on('swipe', function(e, i, a) {
	  	if ( $(window).width() < 576 ) {
	  		layoutImages.slick('slickGoTo', i.currentSlide)
	  	}
	  })

  });

  $('.layouts-filter-nav-link').on('click', function(e) {
  	e.preventDefault();
  	let thsTab = $(`.layouts-body-tab[data-tab=${$(this).data('tab')}]`);
  	if ( thsTab.is(':hidden') ) {
  		$('.layouts-filter-nav-link').removeClass('active');
  		$(this).addClass('active');
  		$('.layouts-body-tab').hide();
  		thsTab.fadeIn(400);
  		thsTab.find('.layout-image').slick('refresh');
  		thsTab.find('.layout-info-slider').slick('refresh');
  	}
  });

  let calcLoaderTimeout;

	function calculatorLoader() {
		clearTimeout(calcLoaderTimeout);
		$('.calcultator-total-price').addClass('loading');
		calcLoaderTimeout = setTimeout(() => {
			$('.calcultator-total-price').removeClass('loading');
		}, 1500);
	}

  $('.filter-range-solo').each(function() {
		let ths = $(this),
				inp = ths.find('.form-control'),
				val = inp.val(),
				range = ths.find('.filter-range-slider')[0],
				rangeStepData = ths.find('.filter-range-slider').data('step'),
				min = ths.find('.filter-range-slider').data('min'),
				max = ths.find('.filter-range-slider').data('max'),
				options = {
					start: parseFloat(val),
					connect: [true, false],
					range: {
						min: parseFloat(min),
						max: parseFloat(max)
					}
				};

		rangeStepData !== undefined ? options.step = parseFloat(rangeStepData) : options = options;

		noUiSlider.create(range, options);

		range.noUiSlider.on('update', function (values, handle) {
			parseFloat(values[0]) == parseInt(values[0]) ? values[0] = parseInt(values[0]) : values[0] = parseFloat(values[0]);
			inp.val(values[0]);
			inp.parents('.calculator-form').length > 0 ? calculatorLoader() : '';
		});

		inp.on('input', function() {
			range.noUiSlider.setHandle(null, parseFloat($(this).val()))
		});

	});

	$('.calculator-form input').on('input', calculatorLoader);
	$('.calculator-form select').on('change', calculatorLoader);

	const convertImages = (query, callback) => {
	  const images = document.querySelectorAll(query);

	  images.forEach(image => {
	    fetch(image.src)
	    .then(res => res.text())
	    .then(data => {
	      const parser = new DOMParser();
	      const svg = parser.parseFromString(data, 'image/svg+xml').querySelector('svg');

	      if (image.id) svg.id = image.id;
	      if (image.className) svg.classList = image.classList;

	      image.parentNode.replaceChild(svg, image);
	    })
	    .then(callback)
	    .catch(error => console.error(error))
	  });
	}

	$('.switch-checkbox-input').on('change', function() {
		if ( $(this).is(':checked') ) {
			$('.mortgage-form').slideDown(400)
		}
		else {
			$('.mortgage-form').slideUp(400)
		}
	});

	$('.burger-icon').on('click', function(e) {
		e.preventDefault();
		$('.header-menu').addClass('opened')
	});

	$('.header-mob-close').on('click', function() {
		$('.header-menu').removeClass('opened')
	});

	$('.main-window-search-group').on('click', function() {
		openPopup('#select-apps-filter')
	});

	function checkMobBanners() {
		$('.main-banner-video-item').each(function() {
			let ths = $(this),
					thsSrc = ths.data('mob-bg');
			ths.css('background-image', `url(${thsSrc})`);
			ths.find('video').remove()
		});
	}

	if ( $(window).width() < 576 ) {
		checkMobBanners()
	}

	function animate() {
		$('.animate').each(function() {
			let ths = $(this),
					thsTop = ths.offset().top;
			if ( $(window).scrollTop() > thsTop - $(window).height() / 1.15 ) {
				ths.addClass('fade-in')
			}
		});
	}

	$(document).on('click', function(e) {
		if ( !$(e.target).closest('.header-menu').length && !$(e.target).closest('.header-burger').length ) {
			$('.header-menu').removeClass('opened')
		}
	});

	let pageLoad = false;

	animate();

	let filterInputs = [],
			filterSelects = [];

	function getCurrentFilterValues() {
		$('.full-filters-block').find('input').each(function() {
			let ths = $(this);
			filterInputs.push({
				item: ths,
				value: ths.attr('type') == 'checkbox' || ths.attr('type') == 'radio' ? ths.prop('checked') : ths.val()
			});
		});
		$('.full-filters-block').find('select').each(function() {
			let ths = $(this);
			filterSelects.push({
				item: ths,
				value: ths.val()
			});
		});
	}getCurrentFilterValues();

	$('.full-filter-btns .clear-filter').on('click', function(e) {
		e.preventDefault();
		let currInputs = [],
				currSelect = [];
		$('.full-filters-block').find('input').each(function() {
			let ths = $(this);
			currInputs.push(ths);
		})
		$('.full-filters-block').find('select').each(function() {
			let ths = $(this);
			currSelect.push(ths);
		})
		currInputs.forEach((item, index) => {
			if ( item.attr('type') == 'checkbox' || item.attr('type') == 'radio' ) {
				item.val(filterInputs[index].item.prop('checked', filterInputs[index].value));
			}
			else {
				item.val(filterInputs[index].value);
			}
			filterInputs[index].item.trigger('change input blur click');
			$('.mortgage-form').slideUp(400);
			$('.full-filters-block .filter-range').each(function() {
				if ( $(this).find('.filter-range-slider')[0] != undefined ) {
					$(this).find('.filter-range-slider')[0].noUiSlider.reset()
				}
			});
			$('.full-filters-block .filter-range-solo').each(function() {
				if ( $(this).find('.filter-range-slider')[0] != undefined ) {
					$(this).find('.filter-range-slider')[0].noUiSlider.reset()
				}
			});
		});
		currSelect.forEach((item, index) => {
			item.val(filterSelects[index].value).trigger('change');
		})
	});

	let canLocationScroll = true;

	$('.location-nav-link a').on('click', function(e) {
		e.preventDefault();
		canLocationScroll = false;
		let thsId = $(this).attr('href');
		$('.location-nav-link a').removeClass('active');
		$(this).addClass('active');
		$('html, body').animate({
			scrollTop: $(thsId).offset().top - 40
		}, 1000)
		setTimeout(() => {
			canLocationScroll = true
		}, 1000)
	});

	let cityMap = $('.s-projects-wrapper .s-city-map'),
			locNav = $('.location-nav'),
			locNavH = locNav.outerHeight(),
			secNumb = $('.s-projects-wrapper .section-nmb');

	function locationScroll() {

		let scrTop = $(window).scrollTop();

		$('.location-nav-link a').each(function() {
			let ths = $(this),
					thsId = $(this).attr('href');
			if ( scrTop > $(thsId).offset().top - 40 ) {
				$('.location-nav-link a').each(function(i) {
					if ( i !== ths.index('.location-nav-link a') ) {
						$(this).removeClass('active');
					}
				});
				$(this).addClass('active');
			}
		});

		cityMap.each(function() {
			let thsCityMap = $(this);
			if ( scrTop > thsCityMap.offset().top - locNavH / 2 &&
					 scrTop < thsCityMap.offset().top + thsCityMap.outerHeight() - locNavH ) {
				locNav.addClass('light')
			}
			else {
				locNav.removeClass('light')
			}
		});

		secNumb.each(function() {
			let thsSecNumb = $(this);
			if ( scrTop > thsSecNumb.offset().top - locNavH ) {
				thsSecNumb.addClass('fade-out')
			}
			else {
				thsSecNumb.removeClass('fade-out')
			}
		});

	}

	function closeContactMapItems() {
		$('.contacts-map-objects-list-item').each(function(i) {
			if ( i > 5 ) {
				$(this).hide()
			}
		});
	}closeContactMapItems();

	$('.contacts-map-objects-all a').on('click', function(e) {
		e.preventDefault();
		if ( $(this).hasClass('active') ) {
			closeContactMapItems();
			$(this).removeClass('active')
		}
		else {
			$(this).addClass('active');
			$('.contacts-map-objects-list-item').fadeIn(400)
		}
	});

  $(window)
  .on('scroll', function() {
  	// $('.text-slider-wrapper').each(function() {
  	// 	scrollText($(this))
  	// })
  	if ( pageLoad ) {
  		animate()
  	};
  	if ( canLocationScroll &&  $(window).width() >= 1200 ) {
  		locationScroll();
  	}
  })
  .on('load', function() {
  	cityMap = $('.s-projects-wrapper .s-city-map');
		locNav = $('.location-nav');
		locNavH = locNav.outerHeight();
		secNumb = $('.s-projects-wrapper .section-nmb');
  	projectHelpInfoPosition();
  	convertImages('.img-to-svg');
  	advantageHeight();
  	setTimeout(() => {
  		pageLoad = true
  	}, 400)
  	if ( $(window).width() > 576 ) {
  		let currTop = $(window).scrollTop();
  		setTimeout(() => {
  			$(window).scrollTop(currTop - 40);
  		}, 10)
  	}
  	$(window).trigger('resize');
  })
  .on('resize', function() {
  	projectHelpInfoPosition();
  	advantageHeight();
  	cityMap = $('.s-projects-wrapper .s-city-map');
		locNav = $('.location-nav');
		locNavH = locNav.outerHeight();
		secNumb = $('.s-projects-wrapper .section-nmb');
  });

});
