// -> app
// --> core/App.js
		(function ($) {
	"use strict";

	var App = function () {
		var o = this; // Create reference to this instance
		$(document).ready(function () {
			o.initialize();
		}); // Initialize app when document is ready

	};
	var p = App.prototype;

	// =========================================================================
	// MEMBERS
	// =========================================================================

	// Constant
	App.SCREEN_XS = 480;
	App.SCREEN_SM = 768;
	App.SCREEN_MD = 992;
	App.SCREEN_LG = 1200;

	// Private
	p._callFunctions = null;
	p._resizeTimer = null;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		// Init events
		this._enableEvents();

		// Init base
		this._initBreakpoints();

		// Init components
		this._initInk();

		// Init accordion
		//this._initAccordion();
		//
		$('body').addClass('loaded');
	};

	// =========================================================================
	// EVENTS
	// =========================================================================

	// events
	p._enableEvents = function () {
		var o = this;

		// Window events
		$(window).on('scroll', function (e) {
			//o._handleScreenSize(e);
			console.log('scroll');
		});

		$(window).on('resize', function (e) {
			clearTimeout(o._resizeTimer);
			o._resizeTimer = setTimeout(function () {
				o._handleFunctionCalls(e);
			}, 300);
		});
	};

	// =========================================================================
	// JQUERY-KNOB
	// =========================================================================

	p.getKnobStyle = function (knob) {
		var holder = knob.closest('.knob');
		var options = {
			width: Math.floor(holder.outerWidth()),
			height: Math.floor(holder.outerHeight()),
			fgColor: holder.css('color'),
			bgColor: holder.css('border-top-color'),
			draw: function () {
				if (knob.data('percentage')) {
					$(this.i).val(this.cv + '%');
				}
			}
		};
		return options;
	};

	// =========================================================================
	// ACCORDION
	// =========================================================================

	p._initAccordion = function () {
		$('.panel-group .card .in').each(function () {
			var card = $(this).parent();
			card.addClass('expanded');
		});


		$('.panel-group').on('hide.bs.collapse', function (e) {
			var content = $(e.target);
			var card = content.parent();
			card.removeClass('expanded');
		});

		$('.panel-group').on('show.bs.collapse', function (e) {
			var content = $(e.target);
			var card = content.parent();
			var group = card.closest('.panel-group');

			group.find('.card.expanded').removeClass('expanded');
			card.addClass('expanded');
		});
	};

	// =========================================================================
	// INK EFFECT
	// =========================================================================

	p._initInk = function () {
		var o = this;

		$('.ink-reaction').on('click', function (e) {
			var bound = $(this).get(0).getBoundingClientRect();
			var x = e.clientX - bound.left;
			var y = e.clientY - bound.top;

			var color = o.getBackground($(this));
			var inverse = (o.getLuma(color) > 183) ? ' inverse' : '';
			
			var ink = $('<div class="ink' + inverse + '"></div>');
			var btnOffset = $(this).offset();
			var xPos = e.pageX - btnOffset.left;
			var yPos = e.pageY - btnOffset.top;

			ink.css({
				top: yPos,
				left: xPos
			}).appendTo($(this));

			window.setTimeout(function () {
				ink.remove();
			}, 1500);
		});
	};

	p.getBackground = function (item) {
		// Is current element's background color set?
		var color = item.css("background-color");
		var alpha = parseFloat(color.split(',')[3], 10);

		if ((isNaN(alpha) || alpha > 0.8) && color !== 'transparent') {
			// if so then return that color if it isn't transparent
			return color;
		}

		// if not: are you at the body element?
		if (item.is("body")) {
			// return known 'false' value
			return false;
		} else {
			// call getBackground with parent item
			return this.getBackground(item.parent());
		}
	};

	p.getLuma = function (color) {
		var rgba = color.substring(4, color.length - 1).split(',');
		var r = rgba[0];
		var g = rgba[1];
		var b = rgba[2];
		var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
		return luma;
	};

	// =========================================================================
	// DETECT BREAKPOINTS
	// =========================================================================

	p._initBreakpoints = function (alias) {
		var html = '';
		html += '<div id="device-breakpoints">';
		html += '<div class="device-xs visible-xs" data-breakpoint="xs"></div>';
		html += '<div class="device-sm visible-sm" data-breakpoint="sm"></div>';
		html += '<div class="device-md visible-md" data-breakpoint="md"></div>';
		html += '<div class="device-lg visible-lg" data-breakpoint="lg"></div>';
		html += '</div>';
		$('body').append(html);
	};

	p.isBreakpoint = function (alias) {
		return $('.device-' + alias).is(':visible');
	};
	p.minBreakpoint = function (alias) {
		var breakpoints = ['xs', 'sm', 'md', 'lg'];
		var breakpoint = $('#device-breakpoints div:visible').data('breakpoint');
		return $.inArray(alias, breakpoints) < $.inArray(breakpoint, breakpoints);
	};

	// =========================================================================
	// UTILS
	// =========================================================================

	p.callOnResize = function (func) {
		if (this._callFunctions === null) {
			this._callFunctions = [];
		}
		this._callFunctions.push(func);
		func.call();
	};

	p._handleFunctionCalls = function (e) {
		if (this._callFunctions === null) {
			return;
		}
		for (var i = 0; i < this._callFunctions.length; i++) {
			this._callFunctions[i].call();
			console.log('callFunctions = '+this._callFunctions)
		}
	};

	// =========================================================================
	// DEFINE NAMESPACE
	// =========================================================================

	window.glavsnab = window.glavsnab || {};
	window.glavsnab.App = new App;
}(jQuery)); // pass in (jQuery):

// --> core/AppVendor.js
		(function(namespace, $) {
  "use strict";

  var AppVendor = function() {
    // Create reference to this instance
    var o = this;
    // Initialize app when document is ready
    $(document).ready(function() {
      o.initialize();
    });

  };
  var p = AppVendor.prototype;

  // =========================================================================
  // INIT
  // =========================================================================

  p.initialize = function() {
    this._initAjaxModals();
    this._initScroller();
    this._initTabs();
    this._initTooltips();
    this._initPopover();
    this._initSortables();
    //this._initFotorama();
  };

  // =========================================================================
  // MODAL
  // =========================================================================

  p._initAjaxModals = function () {
    var ll = '<div class="loading-spinner"><div class="ps_loader"><span class="p">+</span><span>ps</span></div></div>';
    $.fn.modal.defaults.spinner = $.fn.modalmanager.defaults.spinner = ll;


    $('.ajmodal').click(function (e) {
      var url = $(this).attr('href');
      var wth = $(this).attr('data-wth');
      $.fn.modal.defaults.width = wth;
      //console.log($.fn.modal.defaults.width);

      $(this).data('bs.modal', null);
      $('body').modalmanager('loading');
      
      setTimeout(function(){
        $.get(url, function (data) {
          var $modal = 
            $('<div id="ajm_' + Math.floor(Math.random()*100000) + 
              '" class="modal fade ' + ( wth ? '' : 'container' ) + '" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog">' + data + '</div>');
              //'" class="modal fade ' + (wth?'':'container') + '" tabindex="-1" role="dialog">' + data + '</div>');

          //var modal = $('<div id="ajm" class="modal fade container" tabindex="-1" role="dialog">' + data + '</div>');
          $modal.modal();
          console.log('open', url);

            ModalAnim('zoomIn');

            glavsnab.DemoTableDynamic._zaya_offers_postav('#offers_list2');
            glavsnab.DemoTableDynamic._zaya_offers_inwork('#offers_list2_inwork');
            glavsnab.DemoTableDynamic._zaya_offers_postconditions();
            
            glavsnab.AppOffcanvas.initialize();
            glavsnab.FormComponents.initialize();
            glavsnab.AppVendor._initScroller();
            glavsnab.AppVendor._initTabs();
            glavsnab.AppVendor._initFotorama();
            glavsnab.Zayavka._enableEvents();
            //glavsnab.AppVendor._initAjaxModals();

          function ModalAnim(x) {
              var th = $('.modal .modal-dialog');
              th.attr('class', th.attr('class') + ' ' + x + ' animated');
          };


          $modal.on("hidden.bs.modal", function () {
            console.log('close',$(this));
            ModalAnim('zoomOut');
            $(this).removeData('bs.modal');
            glavsnab.AppOffcanvas.initialize();
          });

          $modal.on('click', '.update', function(){
            //$modal.modal('loading');
            setTimeout(function(){
              $modal
                //.modal('loading')
                .find('.modal-body')
                .prepend('<div class="alert alert-info fade in">' +
                  'Updated!<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '</div>');
            }, 10000);
          });

      $('button[data-target="myModalZ"]').click(function(){
        $('#myModalZ').modal('show');
       });


          }); //get

      }, 1000);
      return false;
      //e.preventDefault();

   });

  };

  p._initAjaxModals__ = function () {
      var $modal = $('#ajax-modal');

        var ll = 
          '<div class="loading-spinner" style="width: 200px; margin-left: -100px;">' +
            '<div class="progress progress-striped active">' +
              '<div class="progress-bar" style="width: 100%;"></div>' +
            '</div>' +
          '</div>';

        var ll = '<div class="loading-spinner" style=""><div class="ps_loader"><span class="p">+</span><span>ps</span></div></div>';
        $.fn.modal.defaults.spinner = $.fn.modalmanager.defaults.spinner = ll;

        $.fn.modalmanager.defaults.resize = true;
           
          $('body').on('click', '.ajax .btn, .ajmodal', function(){
            // create the backdrop and wait for next modal to be triggered
            $('body').modalmanager('loading');
            var page = $(this).data('page');
            setTimeout(function(){
               $modal.load(page, '', function(){
                  $modal.modal();

                    glavsnab.AppOffcanvas.initialize();
                    glavsnab.AppVendor.initialize();
                    glavsnab.FormComponents.initialize();
                    glavsnab.DemoTableDynamic._zaya_offers('#offers_list2');
                  var tables = $.fn.dataTable();

                  tables.fnClearTable();
                  tables.fnDraw();
                  tables.fnDestroy();

                  console.log($.fn.dataTable.fnTables(true));


                  $modal.on('show.bs.modal', function (e) {


                  });
                  $modal.on('hidden.bs.modal', function (e) {
                    //$('.modal-scrollable').remove();
                    //console.log('modal close');

                    //glavsnab.AppOffcanvas.initialize();
                    //glavsnab.AppVendor.initialize();
                    $(this).removeData('bs.modal');
                    console.log(this);

                    // var tables = $.fn.dataTable.fnTables(true);

                    // $(tables).each(function () {
                    //     $(this).dataTable().fnDestroy(true);
                    // });


                    });

              });
             }, 1000);
          });
           
          $modal.on('click', '.update', function(){
            $modal.modal('loading');
            setTimeout(function(){
              console.log('prepend');
              console.log($modal.length);

              $modal
              .modal('loading')
              .find('.modal-body')
              .prepend('<div class="alert alert-info fade in">' +
                'UPD!<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '</div>');
            }, 1000);
          });


          // $('.ajmodal').on('click', function(){
          //  var modal =$(this).data('target');
          //  var hr = $(this).attr("href");
          //  //var $modal = $('#ajax-modal');

          //   // create the backdrop and wait for next modal to be triggered
          //   $('body').modalmanager('loading');

          //   $(modal).on('shown.bs.modal', function (e) {
          //    console.log('Модальное окно успешно показано!');
          //   });

          //   setTimeout(function(){
          //    $(modal).load(hr, '', function(){
          //      $(modal).modal();
          //      glavsnab.AppOffcanvas.initialize();
          //      glavsnab.AppVendor.initialize();
          //      glavsnab.FormComponents.initialize();
          //          //console.log(glavsnab.FormComponents.initialize);
          //          //glavsnab.AppVendor._initTabs();
          //        });
          //   }, 100);
          // });
  };
  // =========================================================================
  // SCROLLER
  // =========================================================================

  p._initScroller = function () {
    if (!$.isFunction($.fn.nanoScroller)) {
      return;
    }

    $.each($('.scroll'), function (e) {
      var holder = $(this);
      console.log(holder);
      //if(!holder.is(":visible")) return;
      glavsnab.AppVendor.removeScroller(holder);
      glavsnab.AppVendor.addScroller(holder);
    });

    glavsnab.App.callOnResize(function () {
      $.each($('.scroll-xs'), function (e) {
        var holder = $(this);
        if(!holder.is(":visible")) return;
        
        if (glavsnab.App.minBreakpoint('xs')) {
          glavsnab.AppVendor.removeScroller(holder);
        }
        else {
          glavsnab.AppVendor.addScroller(holder);
        }
      });

      $.each($('.scroll-sm'), function (e) {
        var holder = $(this);
        if(!holder.is(":visible")) return;
        
        if (glavsnab.App.minBreakpoint('sm')) {
          glavsnab.AppVendor.removeScroller(holder);
        }
        else {
          glavsnab.AppVendor.addScroller(holder);
        }
      });

      $.each($('.scroll-md'), function (e) {
        var holder = $(this);
        if(!holder.is(":visible")) return;
        
        if (glavsnab.App.minBreakpoint('md')) {
          glavsnab.AppVendor.removeScroller(holder);
        }
        else {
          glavsnab.AppVendor.addScroller(holder);
        }
      });

      $.each($('.scroll-lg'), function (e) {
        var holder = $(this);
        if(!holder.is(":visible")) return;
        
        if (glavsnab.App.minBreakpoint('lg')) {
          glavsnab.AppVendor.removeScroller(holder);
        }
        else {
          glavsnab.AppVendor.addScroller(holder);
        }
      });
    });
};

p.addScroller = function (holder) {
  holder.wrap('<div class="nano"><div class="nano-content"></div></div>');

  var scroller = holder.closest('.nano');
  scroller.css({height: holder.outerHeight()});
  // Add the nanoscroller
  scroller.nanoScroller({preventPageScrolling: true});
  console.log(holder.outerHeight());

  holder.css({height: 'auto'});
};

p.removeScroller = function (holder) {
  if (holder.parent().parent().hasClass('nano') === false) {
    return;
  }

  holder.parent().parent().nanoScroller({destroy: true});

  holder.parent('.nano-content').replaceWith(holder);
  holder.parent('.nano').replaceWith(holder);
  holder.attr('style', '');
};

  // =========================================================================
  // SORTABLE
  // =========================================================================

  p._initSortables = function () {
    if (!$.isFunction($.fn.sortable)) {
      return;
    }

    $('[data-sortable="true"]').sortable({
      placeholder: "ui-state-highlight",
      delay: 100,
      start: function (e, ui) {
        ui.placeholder.height(ui.item.outerHeight() - 1);
      }
    });

  };
  
  // =========================================================================
  // TABS
  // =========================================================================

  p._initTabs = function () {
    if (!$.isFunction($.fn.tab)) {
      return;
    }
    $('[data-toggle="tabs"] a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    $('.showtab').click(function(e){
      e.preventDefault();
      $('a[href="' + $(this).attr("href") + '"]').tab('show');
        //$('a[href="#login"]').tab('show');
    })

      // Открытие таба из урл-хеша
      // var hash = document.location.hash;
      // var prefix = "tab_";
      // if (hash) {
      //     $('.nav-tabs a[href='+hash.replace(prefix,"")+']').tab('show');
      // } 

      // // Change hash for page-reload
      // $('.nav-tabs a').on('shown.bs.tab', function (e) {
      //     window.location.hash = e.target.hash.replace("#", "#" + prefix);
      // });


  };

  // =========================================================================
  // FOTORAMA
  // =========================================================================

  p._initFotorama = function () {
    if (!$.isFunction($.fn.tab)) {
      return;
    }
    var $fotoramaDiv = $('.fotorama').fotorama();
    var fotorama = $fotoramaDiv.data('fotorama');
    ['left', 'right'].forEach(function (value, key) {
      var $win = $('.fotorama__stage.fotorama__pointer');
      $win.append(
        $('<div>')
        .addClass('fa fa-fw fa-2x fa-chevron-' + value)
        .addClass('gallery-' + value)
      );
    });
  };
  
  // =========================================================================
  // TOOLTIPS
  // =========================================================================

  p._initTooltips = function () {
    if (!$.isFunction($.fn.tooltip)) {
      return;
    }
    $('[data-toggle="tooltip"]').tooltip({container: 'body'});
  };

  // =========================================================================
  // POPOVER
  // =========================================================================

  p._initPopover = function () {
    if (!$.isFunction($.fn.popover)) {
      return;
    }
    $('[data-toggle="popover"]').popover({container: 'body'});
  };
  
  // =========================================================================
  // DEFINE NAMESPACE
  // =========================================================================

  window.glavsnab.AppVendor = new AppVendor;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):

// --> core/AppNavigation.js
		(function (namespace, $) {
	"use strict";

	var AppNavigation = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = AppNavigation.prototype;

	// =========================================================================
	// MEMBERS
	// =========================================================================

	// Constant
	AppNavigation.MENU_MAXIMIZED = 1;
	AppNavigation.MENU_COLLAPSED = 2;
	AppNavigation.MENU_HIDDEN = 3;

	// Private
	p._lastOpened = null;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		this._enableEvents();
		
		this._invalidateMenu();
		this._evalMenuScrollbar();
	};

	// =========================================================================
	// EVENTS
	// =========================================================================

	// events
	p._enableEvents = function () {
		var o = this;

		// Window events
		$(window).on('resize', function (e) {
			o._handleScreenSize(e);
		});
		
		// Menu events
		$('[data-toggle="menubar"]').on('click', function (e) {
			o._handleMenuToggleClick(e);
		});
		$('[data-dismiss="menubar"]').on('click', function (e) {
			o._handleMenubarLeave();
		});
		$('#main-menu').on('click', 'li', function (e) {
			o._handleMenuItemClick(e);
		});
		$('#main-menu').on('click', 'a', function (e) {
			o._handleMenuLinkClick(e);
		});
		$('body.menubar-hoverable').on('mouseenter', '#menubar', function (e) {
			setTimeout(function () {
				o._handleMenubarEnter();
			}, 1);
		});
		$('.header-nav-profile .dropdown > a').on('click', function (e) {
			o._handleMenubarLeave();
		});

	};

	// handlers
	p._handleScreenSize = function (e) {
		this._invalidateMenu();
		this._evalMenuScrollbar(e);
	};

	// =========================================================================
	// MENU TOGGLER
	// =========================================================================

	p._handleMenuToggleClick = function (e) {
		if (!glavsnab.App.isBreakpoint('xs')) {
			$('body').toggleClass('menubar-pin');
		}

		var state = this.getMenuState();

		if (state === AppNavigation.MENU_COLLAPSED) {
			this._handleMenubarEnter();
		}
		else if (state === AppNavigation.MENU_MAXIMIZED) {
			this._handleMenubarLeave();
		}
		else if (state === AppNavigation.MENU_HIDDEN) {
			this._handleMenubarEnter();
		}
	};

	// =========================================================================
	// MAIN BAR
	// =========================================================================

	p._handleMenuItemClick = function (e) {
		e.stopPropagation();

		var item = $(e.currentTarget);
		var submenu = item.find('> ul');
		var parentmenu = item.closest('ul');

		this._handleMenubarEnter(item);
		
		if (submenu.children().length !== 0) {
			this._closeSubMenu(parentmenu);
			
			var menuIsCollapsed = this.getMenuState() === AppNavigation.MENU_COLLAPSED;
			if(menuIsCollapsed || item.hasClass('expanded') === false) {
				this._openSubMenu(item);
			}
		}
	};

	p._handleMenubarEnter = function (menuItem) {
		var o = this;
		var offcanvasVisible = $('body').hasClass('offcanvas-left-expanded');
		var menubarExpanded = $('#menubar').data('expanded');
		var menuItemClicked = (menuItem !== undefined);

		// Check if the menu should open
		if ((menuItemClicked === true || offcanvasVisible === false) && menubarExpanded !== true) {
			// Add listener to close the menubar
			$('#content').one('mouseover', function (e) {
				o._handleMenubarLeave();
			});

			// Add open variables
			$('body').addClass('menubar-visible');
			$('#menubar').data('expanded', true);

			// Triger enter event
			$('#menubar').triggerHandler('enter');


			if (menuItemClicked === false) {
				// If there is a previous opened item, open it and all of its parents
				if (this._lastOpened) {
					var o = this;
					this._openSubMenu(this._lastOpened, 0);
					this._lastOpened.parents('.gui-folder').each(function () {
						o._openSubMenu($(this), 0);
					});
				}
				else {
					// Else open the active item
					var item = $('#main-menu > li.active');
					this._openSubMenu(item, 0);
				}
			}
		}
	};

	p._handleMenubarLeave = function () {
		$('body').removeClass('menubar-visible');
		
		// Don't close the menus when it is pinned on large viewports
		if (glavsnab.App.minBreakpoint('md')) {
			if ($('body').hasClass('menubar-pin')) {
				return;
			}
		}
		$('#menubar').data('expanded', false);


		// Never close the menu on extra small viewports
		if (glavsnab.App.isBreakpoint('xs') === false) {
			this._closeSubMenu($('#main-menu'));
		}
	};


	p._handleMenuLinkClick = function (e) {
		// Prevent the link from firing when the menubar isn't visible
		if (this.getMenuState() !== AppNavigation.MENU_MAXIMIZED) {
			e.preventDefault();
		}
	};

	// =========================================================================
	// OPEN / CLOSE MENU
	// =========================================================================

	p._closeSubMenu = function (menu) {
		var o = this;
		menu.find('> li > ul').stop().slideUp(170, function () {
			$(this).closest('li').removeClass('expanded');
			o._evalMenuScrollbar();
		});
	};

	p._openSubMenu = function (item, duration) {
		var o = this;
		if (typeof (duration) === 'undefined') {
			duration = 170;
		}
		
		// Remember the last opened item
		this._lastOpened = item;

		// Expand the menu
		item.addClass('expanding');
		item.find('> ul').stop().slideDown(duration, function () {
			item.addClass('expanded');
			item.removeClass('expanding');

			// Check scrollbars
			o._evalMenuScrollbar();

			// Manually remove the style, jQuery sometimes failes to remove it
			$('#main-menu ul').removeAttr('style');
		});
	};

	// =========================================================================
	// UTILS
	// =========================================================================

	p._invalidateMenu = function () {
		// Retrieve active link
		var selectedLink = $('#main-menu a.active');

		// Expand all parent submenu's of the active link so it will be visible on startup
		selectedLink.parentsUntil($('#main-menu')).each(function () {
			if ($(this).is('li')) {
				$(this).addClass('active');
				$(this).addClass('expanded');
			}
		});

		// When invalidating, dont expand the first submenu when the menu is collapsed
		if (this.getMenuState() === AppNavigation.MENU_COLLAPSED) {
			$('#main-menu').find('> li').removeClass('expanded');
		}

		// Check if the menu is visible
		if ($('body').hasClass('menubar-visible')) {
			this._handleMenubarEnter();
		}

		// Trigger event
		$('#main-menu').triggerHandler('ready');

		// Add the animate class for CSS transitions.
		// It solves the slow initiation bug in IE, 
		// wich makes the collapse visible on startup
		$('#menubar').addClass('animate');
	};

	p.getMenuState = function () {
		// By using the CSS properties, we can attach 
		// states to CSS properties and therefor control states in CSS
		var matrix = $('#menubar').css("transform");
		var values = (matrix) ? matrix.match(/-?[\d\.]+/g) : null;
			
		var menuState = AppNavigation.MENU_MAXIMIZED;
		if (values === null) {
			if ($('#menubar').width() <= 100) {
				menuState = AppNavigation.MENU_COLLAPSED;
			}
			else {
				menuState = AppNavigation.MENU_MAXIMIZED;
			}
		}
		else {
			if (values[4] === '0') {
				menuState = AppNavigation.MENU_MAXIMIZED;
			}
			else {
				menuState = AppNavigation.MENU_HIDDEN;
			}
		}

		return menuState;
	};

	p._evalMenuScrollbar = function () {
		if (!$.isFunction($.fn.nanoScroller)) {
			return;
		}
		
		// First calculate the footer height
		var footerHeight = $('#menubar .menubar-foot-panel').outerHeight();
		footerHeight = Math.max(footerHeight, 1);
		$('.menubar-scroll-panel').css({'padding-bottom': footerHeight});
		
		
		// Check if there is a menu
		var menu = $('#menubar');
		if (menu.length === 0)
			return;
		
		// Get scrollbar elements
		var menuScroller = $('.menubar-scroll-panel');
		var parent = menuScroller.parent();

		// Add the scroller wrapper
		if (parent.hasClass('nano-content') === false) {
		menuScroller.wrap('<div class="nano"><div class="nano-content"></div></div>');
		}

		// Set the correct height
		var height = $(window).height() - menu.position().top - menu.find('.nano').position().top;
		var scroller = menuScroller.closest('.nano');
		scroller.css({height: height});

		// Add the nanoscroller
		scroller.nanoScroller({preventPageScrolling: true, iOSNativeScrolling: true});
	};


	// =========================================================================
	// DEFINE NAMESPACE
	// =========================================================================

	window.glavsnab.AppNavigation = new AppNavigation;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):

// --> core/AppOffcanvas.js
		(function (namespace, $) {
	"use strict";

	var AppOffcanvas = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = AppOffcanvas.prototype;
	// =========================================================================
	// MEMBERS
	// =========================================================================

	p._timer = null;
	p._useBackdrop = null;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		this._enableEvents();
	};

	// =========================================================================
	// EVENTS
	// =========================================================================

	p._enableEvents = function () {
		var o = this;

		// Window events
		$(window).on('resize', function (e) {
			o._handleScreenSize(e);
		});

		// Offcanvas events
		$('.offcanvas').on('refresh', function (e) {
			o.evalScrollbar(e);
		});
		$('[data-toggle="offcanvas"]').on('click', function (e) {
			e.preventDefault();
			o._handleOffcanvasOpen($(e.currentTarget));
		});$('[data-dismiss="offcanvas"]').on('click', function (e) {
			o._handleOffcanvasClose();
		});
		$('#wrapper').on('click', '> .backdrop', function (e) {
			o._handleOffcanvasClose();
		});

		// Open active offcanvas buttons
		$('[data-toggle="offcanvas-left"].active').each(function () {
			o._handleOffcanvasOpen($(this));
		});
		$('[data-toggle="offcanvas-right"].active').each(function () {
			o._handleOffcanvasOpen($(this));
		});
	};

	// handlers
	p._handleScreenSize = function (e) {
		this.evalScrollbar(e);
	};

	// =========================================================================
	// HANDLERS
	// =========================================================================

	p._handleOffcanvasOpen = function (btn) {
		// When the button is active, the off-canvas is already open and sould be closed
		if (btn.hasClass('active')) {
			this._handleOffcanvasClose();
			return;
		}

		var id = btn.attr('href');

		// Set data variables
		this._useBackdrop = (btn.data('backdrop') === undefined) ? true : btn.data('backdrop');

		// Open off-canvas
		this.openOffcanvas(id);
		this.invalidate();
	};

	p._handleOffcanvasClose = function (e) {
		this.closeOffcanvas();
		this.invalidate();
	};

	// =========================================================================
	// OPEN OFFCANVAS
	// =========================================================================

	p.openOffcanvas = function (id) {
		// First close all offcanvas panes
		this.closeOffcanvas();
		console.log('open');

		// Activate selected offcanvas pane
		$(id).addClass('active');

		// Check if the offcanvas is on the left
		var leftOffcanvas = ($(id).closest('.offcanvas:first').length > 0);

		// Remove offcanvas-expanded to enable body scrollbar
		if (this._useBackdrop)
			$('body').addClass('offcanvas-expanded');

		// Define the width
		var width = $(id).width();
		if (width > $(document).width()) {
			width = $(document).width() - 8;
			$(id + '.active').css({'width': width});
		}
		width = (leftOffcanvas) ? width : '-' + width;

		// Translate position offcanvas pane
		var translate = 'translate(' + width + 'px, 0)';
		$(id + '.active').css({
			'-webkit-transform': translate,
			'-ms-transform': translate,
			'-o-transform': translate,
			'transform': translate
		});
	};

	// =========================================================================
	// CLOSE OFFCANVAS
	// =========================================================================

	p.closeOffcanvas = function () {
		// Remove expanded on all offcanvas buttons
		$('[data-toggle="offcanvas"]').removeClass('expanded');

		// Remove offcanvas active state
		$('.offcanvas-pane').removeClass('active');//.removeAttr('style');
		$('.offcanvas-pane').css({
			'-webkit-transform': '',
			'-ms-transform': '',
			'-o-transform': '',
			'transform': ''
		});
	};

	// =========================================================================
	// OFFCANVAS BUTTONS
	// =========================================================================

	p.toggleButtonState = function () {
		// Activate the active offcanvas pane
		var id = $('.offcanvas-pane.active').attr('id');
		$('[data-toggle="offcanvas"]').removeClass('active');
		$('[href="#' + id + '"]').addClass('active');
	};

	// =========================================================================
	// BACKDROP
	// =========================================================================

	p.toggleBackdropState = function () {
		// Clear the timer that removes the keyword
		if ($('.offcanvas-pane.active').length > 0 && this._useBackdrop) {
			this._addBackdrop();
		}
		else {
			this._removeBackdrop();
		}
	};

	p._addBackdrop = function () {
		if ($('#wrapper > .backdrop').length === 0 && $('#wrapper').data('backdrop') !== 'hidden') {
			$('<div class="backdrop"></div>').hide().appendTo('#wrapper').fadeIn();
		}
	};

	p._removeBackdrop = function () {
		$('#wrapper > .backdrop').fadeOut(function () {
			$(this).remove();
		});
	};

	// =========================================================================
	// BODY SCROLLING
	// =========================================================================

	p.toggleBodyScrolling = function () {
		clearTimeout(this._timer);
		if ($('.offcanvas-pane.active').length > 0 && this._useBackdrop) {
			// Add body padding to prevent visual jumping
			var scrollbarWidth = this.measureScrollbar();
			var bodyPad = parseInt(($('body').css('padding-right') || 0), 10);
			if (scrollbarWidth !== bodyPad) {
				//$('body').css('padding-right', bodyPad + scrollbarWidth);
				//$('.headerbar').css('padding-right', bodyPad + scrollbarWidth);
			}
		}
		else {
			this._timer = setTimeout(function () {
				// Remove offcanvas-expanded to enable body scrollbar
				$('body').removeClass('offcanvas-expanded');
				$('body').css('padding-right', '');
				$('.headerbar').removeClass('offcanvas-expanded');
				$('.headerbar').css('padding-right', '');
			}, 330);
		}
	};

	// =========================================================================
	// INVALIDATE
	// =========================================================================

	p.invalidate = function () {
		this.toggleButtonState();
		this.toggleBackdropState();
		this.toggleBodyScrolling();
		this.evalScrollbar();
	};

	// =========================================================================
	// SCROLLBAR
	// =========================================================================

	p.evalScrollbar = function () {
		if (!$.isFunction($.fn.nanoScroller)) {
			return;
		}
		
		// Check if there is a menu
		var menu = $('.offcanvas-pane.active');
		if (menu.length === 0)
			return;

		// Get scrollbar elements
		var menuScroller = $('.offcanvas-pane.active .offcanvas-body');
		var parent = menuScroller.parent();


		// Add the scroller wrapper
		if (parent.hasClass('nano-content') === false) {
			menuScroller.wrap('<div class="nano"><div class="nano-content"></div></div>');
		}
		
		// Set the correct height
		var height = $(window).height() - menu.find('.nano').position().top - 85;
		var scroller = menuScroller.closest('.nano');
		scroller.css({height: height});

		// Add the nanoscroller
		scroller.nanoScroller({preventPageScrolling: true});
	};

	// =========================================================================
	// UTILS
	// =========================================================================

	p.measureScrollbar = function () {
		var scrollDiv = document.createElement('div');
		scrollDiv.className = 'modal-scrollbar-measure';
		$('body').append(scrollDiv);
		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		$('body')[0].removeChild(scrollDiv);
		return scrollbarWidth;
	};

	// =========================================================================
	// DEFINE NAMESPACE
	// =========================================================================

	window.glavsnab.AppOffcanvas = new AppOffcanvas;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):


// --> core/AppForm.js
		(function(namespace, $) {
	"use strict";

	var AppForm = function() {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function() {
			o.initialize();
		});

	};
	var p = AppForm.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function() {
		// Init events
		this._enableEvents();
		
		this._initRadioAndCheckbox();
		this._initFloatingLabels();
		this._initValidation();
		this._initShowPassword();
		this._initKladr();
	};
	
	// =========================================================================
	// EVENTS
	// =========================================================================

	// events
	p._enableEvents = function () {
		var o = this;

		// Link submit function
		$('[data-submit="form"]').on('click', function (e) {
			e.preventDefault();
			var formId = $(e.currentTarget).attr('href');
			$(formId).submit();
		});
		
		// Init textarea autosize
		$('textarea.autosize').on('focus', function () {
			$(this).autosize({append: ''});
		});
	
		// Add rows
    $(document)
    .on('click', '.btn-add', function(e){
        e.preventDefault();
        var controlForm = $('.controls form:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    })
    .on('click', '.btn-remove', function(e) {
			$(this).parents('.entry:first').remove();
			e.preventDefault();
			return false;
		});


	};
	
	// =========================================================================
	// RADIO AND CHECKBOX LISTENERS
	// =========================================================================

	p._initRadioAndCheckbox = function () {
		// Add a span class the styled checkboxes and radio buttons for correct styling
		$('.checkbox-styled input, .radio-styled input').each(function () {
			if ($(this).next('span').length === 0) {
				$(this).after('<span></span>');
			}
		});
	};
	
	// =========================================================================
	// FLOATING LABELS
	// =========================================================================

	p._initFloatingLabels = function () {
		var o = this;

		$('.floating-label .form-control').on('keyup change', function (e) {
			var input = $(e.currentTarget);

			if ($.trim(input.val()) !== '') {
				input.addClass('dirty').removeClass('static');
			} else {
				input.removeClass('dirty').removeClass('static');
			}
		});

		$('.floating-label .form-control').each(function () {
			var input = $(this);

			if ($.trim(input.val()) !== '') {
				input.addClass('static').addClass('dirty');
			}
		});

		$('.form-horizontal .form-control').each(function () {
			$(this).after('<div class="form-control-line"></div>');
		});
	};
	
	// =========================================================================
	// VALIDATION
	// =========================================================================

	p._initValidation = function () {
		if (!$.isFunction($.fn.validate)) {
			return;
		}
		$.validator.setDefaults({
			highlight: function (element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			unhighlight: function (element) {
				$(element).closest('.form-group').removeClass('has-error');
			},
			success: function (element) {
				$(element).closest('.form-group').addClass('has-success');
			},
			errorElement: 'span',
			errorClass: 'help-block',
			errorPlacement: function (error, element) {
				if (element.parent('.input-group').length) {
					error.insertAfter(element.parent());
				}
				else if (element.parent('label').length) {
					error.insertAfter(element.parent());
				}
				else {
					error.insertAfter(element);
				}
			}
		});

		$('.form-validate').each(function () {
			var validator = $(this).validate({
				lang: 'ru'
			});
			$(this).data('validator', validator);
			});


			$('.form-validate').bind('change keyup', function() {
				if ($(this).valid()) {
					$('.form-validate').find('.btn').prop('disabled', false);  
				} else {
					$('.form-validate').find('.btn').prop('disabled', 'disabled');
				}


		});
	};
	// =========================================================================
	// toggleShowPassword
	// =========================================================================
    p._initShowPassword = function (options) {
        $('.pwd .btn').bind('click', function () {
					var $pwd = $('.pwd input');
					$(this).parent().find('input').focus();
					$(this).closest('form').find('.pwd .btn').toggleClass('glyphicon-eye-close');
					if ($pwd.attr('type') === 'password') {
						$pwd.attr('type', 'text');
					} else {
						$pwd.attr('type', 'password');
					}
        })
    };


    p._initKladr = function (options) {
    	//console.log('kladr')

			var $city = $('[name="city"]');
			var $region = $('[name="region"]');
			var $tooltip = $('.tooltip');

				$.kladr.setDefault({
					parentInput: '.form',
					limit: 5,
					verify: true,
					select: function (obj) {
						setLabel($(this), obj.type);
						$tooltip.hide();
					},
					check: function (obj) {
						var $input = $(this);

						if (obj) {
							setLabel($input, obj.type);
							$tooltip.hide();
						}
						else {
							showError($input, 'Введено неверно');
						}
					},
					checkBefore: function () {
						var $input = $(this);

						if (!$.trim($input.val())) {
							$tooltip.hide();
							return false;
						}
					}
				});

			$city.kladr('type', $.kladr.type.city);
			$region.kladr('type', $.kladr.type.region);


				function setLabel($input, text) {
					text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
					$input.parent().find('label').text(text);
				}
				function showError($input, message) {
					$tooltip.find('span').text(message);

					var inputOffset = $input.offset(),
						inputWidth = $input.outerWidth(),
						inputHeight = $input.outerHeight();

					var tooltipHeight = $tooltip.outerHeight();

					$tooltip.css({
						left: (inputOffset.left + inputWidth + 10) + 'px',
						top: (inputOffset.top + (inputHeight - tooltipHeight) / 2 - 1) + 'px'
					});

					$tooltip.show();
				}

    }

	
	// =========================================================================
	// DEFINE NAMESPACE
	// =========================================================================

	window.glavsnab.AppForm = new AppForm;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):

// --> core/AppNavSearch.js
		(function (namespace, $) {
	"use strict";

	var AppNavSearch = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = AppNavSearch.prototype;

	// =========================================================================
	// MEMBERS
	// =========================================================================

	p._clearSearchTimer = null;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		this._enableEvents();
	};

	// =========================================================================
	// EVENTS
	// =========================================================================

	// events
	p._enableEvents = function () {
		var o = this;

		// Listen for the nav search button click
		$('.navbar-search .btn').on('click', function (e) {
			o._handleButtonClick(e);
		});

		// When the search field loses focus
		$('.navbar-search input').on('blur', function (e) {
			o._handleFieldBlur(e);
		});
	};

	// =========================================================================
	// NAV SEARCH
	// =========================================================================

	p._handleButtonClick = function (e) {
		e.preventDefault();

		var form = $(e.currentTarget).closest('form');
		var input = form.find('input');
		var keyword = input.val();

		if ($.trim(keyword) === '') {
			// When there is no keyword, just open the bar
			form.addClass('expanded');
			input.focus();
		}
		else {
			// When there is a keyword, submit the keyword
			form.addClass('expanded');
			form.submit();

			// Clear the timer that removes the keyword
			clearTimeout(this._clearSearchTimer);
		}
	};

	// =========================================================================
	// FIELD BLUR
	// =========================================================================

	p._handleFieldBlur = function (e) {
		// When the search field loses focus
		var input = $(e.currentTarget);
		var form = input.closest('form');

		// Collapse the search field
		//form.removeClass('expanded');

		// Clear the textfield after 300 seconds (the time it takes to collapse the field)
		clearTimeout(this._clearSearchTimer);
		this._clearSearchTimer = setTimeout(function () {
			input.val('');
		}, 300);
	};

	// =========================================================================
	// DEFINE NAMESPACE
	// =========================================================================

	window.glavsnab.AppNavSearch = new AppNavSearch;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):


// -> core/demo/DemoTableDynamic.js
		(function(namespace, $) {
	"use strict";

	var DemoTableDynamic = function() {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function() {
			o.initialize();
		});

	};
	var p = DemoTableDynamic.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function() {
		this._initDataTables();
	};

	p.destroyDataTable = function(id) {
		if (!$.isFunction($.fn.dataTable)) {
			return;
		}
		var tables = $.fn.dataTable.fnTables(true);

		$(tables).each(function () {
		    $(this).dataTable().fnDestroy();
		});
	};


	// =========================================================================
	// DATATABLES
	// =========================================================================

	p._initDataTables = function() {
		if (!$.isFunction($.fn.dataTable)) {
			return;
		}

		// Init the demo DataTables
		this._zaya_offers_postav();
		this._zaya_offers_postconditions();
		this._zaya_offers_inwork();
		this._profile_userlist();
		this._createDataTable3();


	};
	p._zaya_offers_postconditions = function() {
    var table = $('#postconditions').DataTable({
			"bPaginate": false,
	    "bFilter": false,
	    "bInfo": false,
	    "info": false,
	    
    });
    console.log(table);
		function myCallbackFunction(updatedCell, updatedRow, oldValue) {
		    console.log("The new value for the cell is: " + updatedCell.data());
		    console.log("The old value for that cell was: " + oldValue);
		    console.log("The values for each cell in that row are: " + updatedRow.data());
		}

    table.MakeCellsEditable({
        "onUpdate": myCallbackFunction,
        "confirmationButton": { 
            "confirmCss": 'btn btn-success btn-xs',
            "cancelCss": 'btn btn-danger btn-xs'
        }        
    });

	};

	p._zaya_offers_postav = function() {
		var table = $('#offers_postav').DataTable({
			"dom": 'lCfrtip',
			"ajax": $('#offers_postav').data('source'),
			"bLengthChange" : false,
			"bInfo":false,
			//"iDisplayLength": 10,
			  //"scrollY":        "465px",  //line 262, zayavka.less
			  "scrollY":        "315px",  //line 262, zayavka.less
        "scrollCollapse": true,
        "paging":         false,
			"columns": [
				{"data": "name"},
				{"data": "name"},
				{"data": "unit"},
				{"data": "qnt"},
				{"data": "price"},
			],
			
			"bSort" : false,
				// "order": [],
				// "columnDefs": [{ 
				// 	targets: "no-sort", orderable: false 
				// }],

			"colVis": {
				"buttonText": "<i class='fa fa-filter'></i>",
				"overlayFade": 0,
				"align": "right",
				"exclude": [ 0 ],
			},
			"tableTools": {
				"sSwfPath": "/js/libs/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
			},
      "language": {
          "url": "/data/dt_russian.json",
      },
	    "fnCreatedRow": function(nRow,aData,iDataIndex ) {
				$(nRow).children("td:eq(0)").addClass('t_idx')
				$(nRow).children("td:eq(1)").addClass('t_name').wrapInner( "<div></div>");
				$(nRow).children("td:gt(2)").addClass('t_suppl');
   			var rand = Math.floor(2 + Math.random() * (5 + 1 - 2));
   			
		    $('td:eq('+rand+')', nRow).addClass('style-primary-bright');
	      // if ( aData.name == "КИСТЬ КФ 50" ){
	      //   //$('td:eq(4)', nRow).html( '<b>A</b>' );
	      //   $('td:eq(2)', nRow).addClass('style-primary-bright');
	      // }
	    }
		});

    function CellModif (updatedCell, updatedRow, oldValue) {
        console.log("The new value for the cell is: " + updatedCell.data());
        console.log("The values for each cell in that row are: " + updatedRow.data());
        $('.zaya_actions_btn .btn').removeClass('disabled')
    }

    table.MakeCellsEditable({
        "onUpdate": CellModif,
        "columns":[3,4,5],
        "confirmationButton": { 
	        "confirmCss": 'btn btn-success btn-xs',
	        "cancelCss": 'btn btn-danger btn-xs'
        },
    });

    table.on( 'order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    }).draw();


    $('#offers_postav tbody')
    		.on( 'mouseenter', 'td', function () {
            var colIdx = table.cell(this).index().column;
			      if ( colIdx > 1 ){
		            $( table.cells().nodes() ).removeClass( 'highlight' );
		            $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
		        }
        })
    		.on( 'mouseleave', 'td', function () {
            $( table.cells().nodes() ).removeClass( 'highlight' );
        });



		$( "#offers_postav thead th" ).each(function(i) {
		  var tt = $(this).text();
		  if (i > 3) {
		  	$(this).popover({
			    html : true,
			    content:
			    '<dl class="offers_list__suppl">'
			    + '<dt>Статус</dt><dd>В ожидании ответа &nbsp;<i class="fa fa-refresh text-warning"></i></dd>'
			    + '<dt>Рейтинг</dt><dd><div class="rating text-warning"><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star-empty"></span></div></dd>'
			    + '<dt>Характеристика поставщика</dt><dd>посредник</dd>'
					+ '<dt>Время существования поставщика на рынке</dt><dd>нет данных</dd>'
					+ '<dt>Продолжительность работы с поставщиком</dt><dd>нет данных</dd>'
					+ '<dt>Надежность поставщика</dt><dd>нет данных</dd>'
			    +'</dl>',
			    trigger:'hover',
			    placement:'bottom',
			    container: 'body'
				});
		  }
		});

		$('#offers_postav tbody').on('click', 'tr', function() {
			//$(this).toggleClass('selected');
		});
	};

	p._zaya_offers_inwork = function() {
		var $h = $(window).height() > 990 ? '505px' : '100px';
		console.log($h);

		$(window).on('resize', function (e) {
			var $h = glavsnab.App.minBreakpoint('sm') ? '505px' : '100px';
			console.log($h);
		});
		
		var table = $('#offers_list2_inwork').DataTable({
			"dom": 'lCfrtip',
			"ajax": $('#offers_list2_inwork').data('source'),
			"bLengthChange" : false,
			"bInfo":false,
			//"iDisplayLength": 10,
			  "scrollY":        $(window).height() > 990 ? '455px' : '355px', //line 262, zayavka.less
        "scrollCollapse": true,
        "paging":         false,
			"columns": [
				{"data": "name"},
				{"data": "name"},
				{"data": "unit", "visible": false },
				{"data": "qnt", "visible": false },
				{"data": "price"},
				{"data": "price"},
				{"data": "price"},
				{"data": "price"}
			],
			
			"bSort" : false,
				// "order": [],
				// "columnDefs": [{ 
				// 	targets: "no-sort", orderable: false 
				// }],

			"colVis": {
				"buttonText": "<i class='fa fa-filter'></i>",
				"overlayFade": 0,
				"align": "right",
				"exclude": [ 0 ],
			},
			"tableTools": {
				"sSwfPath": "/js/libs/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
			},
      "language": {
          "url": "/data/dt_russian.json",
      },
	    "fnCreatedRow": function(nRow,aData,iDataIndex ) {
				$(nRow).children("td:eq(0)").addClass('t_idx')
				$(nRow).children("td:eq(1)").addClass('t_name').wrapInner( "<div></div>");
				$(nRow).children("td:gt(2)").addClass('t_suppl');
   			var rand = Math.floor(2 + Math.random() * (5 + 1 - 2));
   			
		    $('td:eq('+rand+')', nRow).addClass('style-primary-bright');
	      // if ( aData.name == "КИСТЬ КФ 50" ){
	      //   //$('td:eq(4)', nRow).html( '<b>A</b>' );
	      //   $('td:eq(2)', nRow).addClass('style-primary-bright');
	      // }

	    }
		});
 		//table tools



    table
    	.on( 'order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    	}).draw();


    table
  		.on( 'mouseenter', 'td', function () {
          var colIdx = table.cell(this).index().column;
		      if ( colIdx > 1 ){
	            $( table.cells().nodes() ).removeClass( 'highlight' );
	            $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
	        }
      })
  		.on( 'mouseleave', 'td', function () {
          $( table.cells().nodes() ).removeClass( 'highlight' );
      });



		$( "#offers_list2_inwork thead th" ).each(function(i) {
		  var tt = $(this).text();
		  if (i > 3) {
		  	$(this).popover({
			    html : true,
			    content:
			    '<dl class="offers_list__suppl">'
			    + '<dt>Статус</dt><dd>В ожидании ответа &nbsp;<i class="fa fa-refresh text-warning"></i></dd>'
			    + '<dt>Рейтинг</dt><dd><div class="rating text-warning"><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star-empty"></span></div></dd>'
			    + '<dt>Характеристика поставщика</dt><dd>посредник</dd>'
					+ '<dt>Время существования поставщика на рынке</dt><dd>нет данных</dd>'
					+ '<dt>Продолжительность работы с поставщиком</dt><dd>нет данных</dd>'
					+ '<dt>Надежность поставщика</dt><dd>нет данных</dd>'
			    +'</dl>',
			    trigger:'hover',
			    placement:'bottom',
			    container: 'body'
				});
		  }
		});

		$('#offers_list2_inwork tbody').on('click', 'tr', function() {
			//$(this).toggleClass('selected');
		});
	};


/// Пример2 - список пользователей

p._profile_userlist = function() {
	var table = $('#users_list').DataTable({
			//"dom": 'T<"clear">lfrtip',
			"dom": 'lCfrtip',
			"ajax": $('#users_list').data('source'),
			"colVis": {
				"buttonText": "<i class='fa fa-filter'></i>",
				"overlayFade": 0,
				"align": "right",
				"activate": "mouseover"
			},
			//"bLengthChange" : false,
			"bInfo":false,
			"iDisplayLength": 10,

			"columns": [
				{
					"class": 'details-control',
					"orderable": false,
					"data": null,
					"defaultContent": ''
				},
				{"data": "name"},
				{"data": "position"},
				{"data": "office"},
				//{"data": "salary"}
			],
			"tableTools": {
				"sSwfPath": "/js/libs/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
			},
			"order": [[1, 'asc']],
			"language": {
				"url": "/data/dt_russian.json",
			},
	    "fnCreatedRow": function(nRow,aData,iDataIndex ) {
				$(nRow).children("td:eq(2)").wrapInner( "<a href='#'></a>");
	    }			
		});

		$.fn.editable.defaults.mode = 'inline';
		//debugger;
		$('#users_list td:gt(2)').editable({
		    type: 'select',
		    name: 'Type',
		    title: 'Type',
		    source: [
		      {value: 0, text: 'Nothing'},
		      {value: 1, text: 'Everything'},
		      {value: 2, text: 'Something'},
		      {value: 3, text: 'That Thing'},
		      {value: 4, text: 'This Thing'},
		      {value: 5, text: 'Things'}
		    ]
		});
		//Add event listener for opening and closing details
		var o = this;
		$('#users_list tbody').on('click', 'td.details-control', function() {
			var tr = $(this).closest('tr');
			var row = table.row(tr);

			if (row.child.isShown()) {
				// This row is already open - close it
				row.child.hide();
				tr.removeClass('shown');
			}
			else {
				// Open this row
				row.child(o._UserlistDetails(row.data())).show();
				tr.addClass('shown');
			}
		});
	};

	// =========================================================================
	// DETAILS
	// =========================================================================

	p._UserlistDetails = function(d) {
		// `d` is the original data object for the row
		return '<div style="position:relative;"><table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
		'<tr>' +
		'<td class="text-right" >Полное имя:</td>' +
		'<td>' + d.name + '</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="text-right" >Дата:</td>' +
		'<td>' + d.start_date + '</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="text-right" >Extension number:</td>' +
		'<td>' + d.extn + '</td>' +
		'</tr>' +
		'</table><img src="'+d.pic+'" style="position:absolute; top:0; right:5%"/></div>';
	};


	p._createDataTable3 = function() {
		var table = $('#datatable1').DataTable({
			"dom": 'lCfrtip',
			"ajax": $('#datatable1').data('source'),

			//"iDisplayLength": 5,

			//"bLengthChange" : false,
			"bInfo":false,

			"colVis": {
				"buttonText": "<i class='fa fa-filter'></i>",
				"overlayFade": 0,
				"align": "right",
				"exclude": [ 0 ],
				"activate": "mouseover"
			},
			"order": [[1, 'asc']],

			"columns": [
			{
				"class": 'details-control',
				"orderable": false,
				"data": null,
				"defaultContent": ''
			},
			{"data": "name"},
			{"data": "position"},
			{"data": "office"},
			{"data": "salary"}

			],
			"language": {
				"url": "/data/dt_russian.json",
			}
		});
		
		//Add event listener for opening and closing details
		var o = this;
		$('#datatable1 tbody').on('click', 'td.details-control', function() {
			var tr = $(this).closest('tr');
			var row = table.row(tr);

			if (row.child.isShown()) {
				// This row is already open - close it
				row.child.hide();
				tr.removeClass('shown');
			}
			else {
				// Open this row
				row.child(o._formatDetails2(row.data())).show();
				tr.addClass('shown');
			}
		});
	};

	// =========================================================================
	// DETAILS
	// =========================================================================

	p._formatDetails2 = function(d) {
		// `d` is the original data object for the row
		return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
		'<tr>' +
		'<td>Полное имя:</td>' +
		'<td>' + d.name + '</td>' +
		'</tr>' +
		'<tr>' +
		'<td>Номер:</td>' +
		'<td>' + d.extn + '</td>' +
		'</tr>' +
		'<tr>' +
		'<td>Полная информация:</td>' +
		'<td>And any further details here (images etc)...</td>' +
		'</tr>' +
		'</table>';
	};



	// =========================================================================
	namespace.DemoTableDynamic = new DemoTableDynamic;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):

// --> core/AppCard.js
		(function(namespace, $) {
	"use strict";

	var AppCard = function() {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function() {
			o.initialize();
		});

	};
	var p = AppCard.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function() {};

	// =========================================================================
	// CARD LOADER
	// =========================================================================

	p.addCardLoader = function (card) {
		var container = $('<div class="card-loader"></div>').appendTo(card);
		container.hide().fadeIn();
		var opts = {
			lines: 17, // The number of lines to draw
			length: 0, // The length of each line
			width: 3, // The line thickness
			radius: 6, // The radius of the inner circle
			corners: 1, // Corner roundness (0..1)
			rotate: 13, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			color: '#000', // #rgb or #rrggbb or array of colors
			speed: 2, // Rounds per second
			trail: 76, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			className: 'spinner', // The CSS class to assign to the spinner
			zIndex: 2e9 // The z-index (defaults to 2000000000)
		};
		var spinner = new Spinner(opts).spin(container.get(0));
		card.data('card-spinner', spinner);
	};

	p.removeCardLoader = function (card) {
		var spinner = card.data('card-spinner');
		var loader = card.find('.card-loader');
		loader.fadeOut(function () {
			spinner.stop();
			loader.remove();
		});
	};
	
	// =========================================================================
	// CARD COLLAPSE
	// =========================================================================

	p.toggleCardCollapse = function (card, duration) {
		duration = typeof duration !== 'undefined' ? duration : 400;
		var dispatched = false;
		card.find('.nano').slideToggle(duration);
		card.find('.card-body').slideToggle(duration, function () {
			if (dispatched === false) {
				$('#COLLAPSER').triggerHandler('card.bb.collapse', [!$(this).is(":visible")]);
				dispatched = true;
			}
		});
		card.toggleClass('card-collapsed');
	};

	// =========================================================================
	// CARD REMOVE
	// =========================================================================

	p.removeCard = function (card) {
		card.fadeOut(function () {
			card.remove();
		});
	};
	
	// =========================================================================
	// DEFINE NAMESPACE
	// =========================================================================

	window.glavsnab.AppCard = new AppCard;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):


// --> core/FormComponents.js
		(function (namespace, $) {
	"use strict";

	var FormComponents = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = FormComponents.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		this._initTypeahead();
		this._initAutocomplete();
		this._initSelect2();
		this._initMultiSelect();
		this._initInputMask();
		this._initDatePicker();
		this._initSliders();
		this._initSpinners();
		this._initColorPickers();
	};

	// =========================================================================
	// TYPEAHEAD
	// =========================================================================

	p._initTypeahead = function () {
		if (!$.isFunction($.fn.typeahead)) {
			return;
		}
		var countries = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			limit: 10,
			prefetch: {
				// url points to a json file that contains an array of country names, see
				// https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
				url: $('#autocomplete1').data('source'),
				// the json file contains an array of strings, but the Bloodhound
				// suggestion engine expects JavaScript objects so this converts all of
				// those strings
				filter: function (list) {
					return $.map(list, function (country) {
						return {name: country};
					});
				}
			}
		});
		countries.initialize();
		$('#autocomplete1').typeahead(null, {
			name: 'countries',
			displayKey: 'name',
			// `ttAdapter` wraps the suggestion engine in an adapter that
			// is compatible with the typeahead jQuery plugin
			source: countries.ttAdapter()
		});
	};
	
	// =========================================================================
	// AUTOCOMPLETE
	// =========================================================================

	p._initAutocomplete = function () {
		if (!$.isFunction($.fn.autocomplete)) {
			return;
		}

		$.ajax({
			url: $('#autocomplete2').data('source'),
			dataType: "json",
			success: function (countries) {
				$("#autocomplete2").autocomplete({
					source: function (request, response) {
						var results = $.ui.autocomplete.filter(countries, request.term);
						response(results.slice(0, 10));
					}
				});
			}
		});
	};

	// =========================================================================
	// COLORPICKER
	// =========================================================================

	p._initColorPickers = function () {
		if (!$.isFunction($.fn.colorpicker)) {
			return;
		}
		$('#cp1').colorpicker();
		$('#cp2').colorpicker();
		$('#cp3').colorpicker().on('changeColor', function (ev) {
			$(ev.currentTarget).closest('.card-body').css('background', ev.color.toHex());
		});
	};

	// =========================================================================
	// SPINNERS
	// =========================================================================

	p._initSpinners = function () {
		if (!$.isFunction($.fn.spinner)) {
			return;
		}
		$("#spinner").spinner({min: 16});
		$("#spinner-decimal").spinner({step: 0.01, numberFormat: "n", max: 1});
	};

	// =========================================================================
	// SLIDERS
	// =========================================================================

	p._initSliders = function () {
		if (!$.isFunction($.fn.slider)) {
			return;
		}
		$("#slider").slider({range: "min", value: 50, min: 0, max: 100,
			slide: function (event, ui) {
				$('#slider-value').empty().append(ui.value);
			}
		});
		$("#slider-step").slider({value: 100, min: 0, max: 500, step: 50,
			slide: function (event, ui) {
				$('#step-value').empty().append(ui.value);
			}
		});
		$("#slider-range").slider({range: true, min: 0, max: 100, values: [25, 75],
			slide: function (event, ui) {
				$('#range-value1').empty().append(ui.values[ 0 ]);
				$('#range-value2').empty().append(ui.values[ 1 ]);
			}
		});

		$("#eq > span").each(function () {
			var value = parseInt($(this).text(), 10);
			$(this).empty().slider({value: value, range: "min", animate: true, orientation: "vertical"});
			$(this).css('height', '100px');
			$(this).css('margin-right', '30px');
			$(this).css('float', 'left');
		});
	};

	// =========================================================================
	// SELECT2
	// =========================================================================

	p._initSelect2 = function () {
		if (!$.isFunction($.fn.select2)) {
			return;
		}
		$(".select2-list").select2({
			allowClear: true
		});
	};

	// =========================================================================
	// MultiSelect
	// =========================================================================

	p._initMultiSelect = function () {
		if (!$.isFunction($.fn.multiSelect)) {
			return;
		}
		$('#optgroup').multiSelect({selectableOptgroup: true});
	};

	// =========================================================================
	// InputMask
	// =========================================================================

	p._initInputMask = function () {
		if (!$.isFunction($.fn.inputmask)) {
			return;
		}
		$(":input").inputmask();
		$(".form-control.dollar-mask").inputmask('$ 999,999,999.99', {numericInput: true, rightAlignNumerics: false});
		$(".form-control.euro-mask").inputmask('€ 999.999.999,99', {numericInput: true, rightAlignNumerics: false});
		$(".form-control.time-mask").inputmask('h:s', {placeholder: 'hh:mm'});
		$(".form-control.time12-mask").inputmask('hh:mm t', {placeholder: 'hh:mm xm', alias: 'time12', hourFormat: '12'});

		$(".form-control.email input").inputmask({ mask: "9[-9999]", greedy: false });

	};

	// =========================================================================
	// Date Picker
	// =========================================================================

	p._initDatePicker = function () {
		if (!$.isFunction($.fn.datepicker)) {
			return;
		}

		$('#demo-date').datepicker({autoclose: true, todayHighlight: true, format: "dd/mm/yyyy", language: "ru"});
		$('#demo-date-month').datepicker({autoclose: true, todayHighlight: true, minViewMode: 1});
		$('#demo-date-format').datepicker({autoclose: true, todayHighlight: true, format: "dd/mm/yyyy", });
		$('#demo-date-range').datepicker({todayHighlight: true});
		$('#demo-date-inline').datepicker({todayHighlight: true});
	};

	// =========================================================================
	// DATATABLES
	// =========================================================================

	p.initDataTables = function (grid) {
		if (!$.isFunction($.fn.dataTable)) {
			return;
		}

		$.extend(jQuery.fn.dataTableExt.oSort, {
			"numeric-comma-pre": function (a) {
				var x = (a == "-") ? 0 : a.replace(/,/, ".");
				return parseFloat(x);
			},
			"numeric-comma-asc": function (a, b) {
				return ((a < b) ? -1 : ((a > b) ? 1 : 0));
			},
			"numeric-comma-desc": function (a, b) {
				return ((a < b) ? 1 : ((a > b) ? -1 : 0));
			}
		});
		grid.dataTable({
			"sDom": 'lCfrtip',
			"sPaginationType": "full_numbers",
			"aaSorting": [],
			"aoColumns": [
				null,
				null,
				null,
				{"sType": "numeric-comma"},
				null
			],
			"oColVis": {
				"buttonText": "Columns",
				"iOverlayFade": 0,
				"sAlign": "right"
			},
			"oLanguage": {
				"sLengthMenu": '_MENU_ entries per page',
				"sSearch": '<i class="icon-search"></i>',
				"oPaginate": {
					"sPrevious": '<i class="fa fa-angle-left"></i>',
					"sNext": '<i class="fa fa-angle-right"></i>'
				}
			}
		});
	};

	// =========================================================================
	namespace.FormComponents = new FormComponents;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):


		(function (namespace, $) {
	"use strict";

	var DemoUIMessages = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = DemoUIMessages.prototype;

	// =========================================================================
	// MEMBER
	// =========================================================================

	p.messageTimer = null;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		this._initToastr();
		
		$('#toast-info').trigger('click');
	};

	// =========================================================================
	// INIT TOASTR
	// =========================================================================

	// events
	p._initToastr = function () {
		this._initStateToastr();
		this._initCustomToastr();
		this._initPositionToastr();
		this._initActionToastr();
	};

	// =========================================================================
	// CUSTOM TOASTS
	// =========================================================================
	
	p._initCustomToastr = function () {
		var o = this;
		$('#toast-custom').on('click', function (e) {
			toastr.options.hideDuration = 0;
			toastr.clear();
			
			toastr.options.closeButton = ($('select[name="closeButton"]').val() === 'true');
			toastr.options.progressBar = ($('select[name="progressBar"]').val() === 'true');
			toastr.options.debug = ($('select[name="debug"]').val() === 'true');
			toastr.options.positionClass = $('select[name="positionClass"]').val();
			toastr.options.showDuration = parseInt($('select[name="showDuration"]').val());
			toastr.options.hideDuration = parseInt($('select[name="hideDuration"]').val());
			toastr.options.timeOut = parseInt($('select[name="timeOut"]').val());
			toastr.options.extendedTimeOut = parseInt($('select[name="extendedTimeOut"]').val());
			toastr.options.showEasing = $('select[name="showEasing"]').val();
			toastr.options.hideEasing = $('select[name="hideEasing"]').val();
			toastr.options.showMethod = $('select[name="showMethod"]').val();
			toastr.options.hideMethod = $('select[name="hideMethod"]').val();

			toastr[$('#state').val()]($('#message').val(), '');
		});
	};
	p._showCustomMessage = function () {
		toastr.options.closeButton = ($('select[name="closeButton"]').val() === 'true');
		toastr.options.progressBar = ($('select[name="progressBar"]').val() === 'true');
		toastr.options.debug = ($('select[name="debug"]').val() === 'true');
		toastr.options.positionClass = $('select[name="positionClass"]').val();
		toastr.options.showDuration = parseInt($('select[name="showDuration"]').val());
		toastr.options.hideDuration = parseInt($('select[name="hideDuration"]').val());
		toastr.options.timeOut = parseInt($('select[name="timeOut"]').val());
		toastr.options.extendedTimeOut = parseInt($('select[name="extendedTimeOut"]').val());
		toastr.options.showEasing = $('select[name="showEasing"]').val();
		toastr.options.hideEasing = $('select[name="hideEasing"]').val();
		toastr.options.showMethod = $('select[name="showMethod"]').val();
		toastr.options.hideMethod = $('select[name="hideMethod"]').val();

		toastr[$('#state').val()]($('#message').val(), '');
	};

	// =========================================================================
	// STATE TOASTS
	// =========================================================================

	p._initStateToastr = function () {
		var o = this;
		$('#toast-info').on('click', function (e) {
			o._toastrStateConfig();
			toastr.info('Welcome to the messages section', '');
		});
		$('#toast-warning').on('click', function (e) {
			o._toastrStateConfig();
			toastr.warning('This name is already added', '');
		});
		$('#toast-error').on('click', function (e) {
			o._toastrStateConfig();
			toastr.error('Duplicate item', '');
		});





	};

	// =========================================================================
	// POSITION TOASTS
	// =========================================================================

	p._initPositionToastr = function () {
		var o = this;
		$('.position-toast').on('click', function (e) {
			toastr.options.hideDuration = 0;
			toastr.clear();
			o._toastrStateConfig();
			toastr.options.timeOut = 0;
			toastr.options.positionClass = $(e.currentTarget).data('position');
			toastr.info('Position message', '');
		});
	};
	
	// =========================================================================
	// ACTION TOASTS
	// =========================================================================

	p._initActionToastr = function () {
		var o = this;
		$('#toast-info-progress').on('click', function (e) {
			toastr.clear();

			o._toastrStateConfig();
			toastr.options.progressBar = true;
			toastr.info('Message with a progressbar', '');
		});
		$('#toast-info-close').on('click', function (e) {
			toastr.clear();

			o._toastrStateConfig();
			toastr.options.closeButton = true;
			toastr.info('Message with a close button', '');
		});

		$('#toast-action').on('click', function (e) {
			toastr.clear();

			toastr.options.closeButton = false;
			toastr.options.progressBar = false;
			toastr.options.debug = false;
			toastr.options.positionClass = 'toast-top-left';
			toastr.options.showDuration = 333;
			toastr.options.hideDuration = 333;
			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 1000;
			toastr.options.showEasing = 'swing';
			toastr.options.hideEasing = 'swing';
			toastr.options.showMethod = 'slideDown';
			toastr.options.hideMethod = 'slideUp';

			var message = 'Marked as read. <button type="button" id="okBtn" class="btn btn-flat btn-success toastr-action">Undo</button>';

			toastr.info(message, '');
		});

		$('#toast-long-action').on('click', function (e) {
			toastr.clear();

			toastr.options.closeButton = false;
			toastr.options.progressBar = false;
			toastr.options.debug = false;
			toastr.options.positionClass = 'toast-bottom-left';
			toastr.options.showDuration = 333;
			toastr.options.hideDuration = 333;
			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 1000;
			toastr.options.showEasing = 'swing';
			toastr.options.hideEasing = 'swing';
			toastr.options.showMethod = 'slideDown';
			toastr.options.hideMethod = 'slideUp';

			var message = 'Connection timed out due to firewall setup. Showing limited. <button type="button" id="okBtn" class="btn btn-flat btn-warning toastr-action">Retry</button>';
			toastr.info(message, '');
		});
	};

	// =========================================================================
	// TOAST CONFIG
	// =========================================================================

	p._toastrStateConfig = function () {
		toastr.options.closeButton = false;
		toastr.options.progressBar = false;
		toastr.options.debug = false;
		toastr.options.positionClass = 'toast-bottom-left';
		toastr.options.showDuration = 333;
		toastr.options.hideDuration = 333;
		toastr.options.timeOut = 2000;
		toastr.options.extendedTimeOut = 2000;
		toastr.options.showEasing = 'swing';
		toastr.options.hideEasing = 'swing';
		toastr.options.showMethod = 'slideDown';
		toastr.options.hideMethod = 'slideUp';
	};

	// =========================================================================
	namespace.DemoUIMessages = new DemoUIMessages;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):


		(function (namespace, $) {
	"use strict";

	var Demo = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = Demo.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		this._enableEvents();

		this._initButtonStates();
		this._initIconSearch();
		this._initInversedTogglers();
		
		this._initMessages();
		this._initEItem();

		this._initChatMessage();
	
			this._initEditable();
			this._initFlipCard();
	};

	// =========================================================================
	// EVENTS
	// =========================================================================

	// events
	p._enableEvents = function () {
		var o = this;

		$('.card-head .tools .btn-refresh').on('click', function (e) {
			o._handleCardRefresh(e);
		});
		$('.card-head .tools .btn-collapse').on('click', function (e) {
			o._handleCardCollapse(e);
		});
		$('.card-head .tools .btn-close').on('click', function (e) {
			o._handleCardClose(e);
		});
		$('.card-head .tools .menu-card-styling a').on('click', function (e) {
			o._handleCardStyling(e);
		});
		$('.theme-selector a').on('click', function (e) {
			o._handleThemeSwitch(e);
		});




    $('.catalog-actions #list').click(function(event){
    		event.preventDefault();
    		$('#products .item').addClass('list-group-item');
    	});
    $('.catalog-actions #grid').click(function(event){
	    	event.preventDefault();
	    	$('#products .item').removeClass('list-group-item');
	    	$('#products .item').addClass('grid-group-item');
    	});



	};

	// =========================================================================
	// CARD ACTIONS
	// =========================================================================

	p._handleCardRefresh = function (e) {
		var o = this;
		var card = $(e.currentTarget).closest('.card');
		glavsnab.AppCard.addCardLoader(card);
		setTimeout(function () {
			glavsnab.AppCard.removeCardLoader(card);
		}, 1500);
	};

	p._handleCardCollapse = function (e) {
		var card = $(e.currentTarget).closest('.card');
		glavsnab.AppCard.toggleCardCollapse(card);
	};

	p._handleCardClose = function (e) {
		var card = $(e.currentTarget).closest('.card');
		glavsnab.AppCard.removeCard(card);
	};

	p._handleCardStyling = function (e) {
		// Get selected style and active card
		var newStyle = $(e.currentTarget).data('style');
		var card = $(e.currentTarget).closest('.card');

		// Display the selected style in the dropdown menu
		$(e.currentTarget).closest('ul').find('li').removeClass('active');
		$(e.currentTarget).closest('li').addClass('active');

		// Find all cards with a 'style-' class
		var styledCard = card.closest('[class*="style-"]');

		if (styledCard.length > 0 && (!styledCard.hasClass('style-white') && !styledCard.hasClass('style-transparent'))) {
			// If a styled card is found, replace the style with the selected style
			// Exclude style-white and style-transparent
			styledCard.attr('class', function (i, c) {
				return c.replace(/\bstyle-\S+/g, newStyle);
			});
		}
		else {
			// Create variable to check if a style is switched
			var styleSwitched = false;

			// When no cards are found with a style, look inside the card for styled headers or body
			card.find('[class*="style-"]').each(function () {
				// Replace the style with the selected style
				// Exclude style-white and style-transparent
				if (!$(this).hasClass('style-white') && !$(this).hasClass('style-transparent')) {
					$(this).attr('class', function (i, c) {
						return c.replace(/\bstyle-\S+/g, newStyle);
					});
					styleSwitched = true;
				}
			});

			// If no style is switched, add 1 to the main Card
			if (styleSwitched === false) {
				card.addClass(newStyle);
			}
		}
	};

	// =========================================================================
	// COLOR SWITCHER
	// =========================================================================
	
	p._handleThemeSwitch = function (e) {
		e.preventDefault();
		var newTheme = $(e.currentTarget).attr('href');
		this.switchTheme(newTheme);
	};
	
	p.switchTheme = function (theme) {
		$('link').each(function () {
			var href = $(this).attr('href');
			href = href.replace(/(assets\/css\/)(.*)(\/)/g, 'assets/css/' + theme + '/');
			$(this).attr('href', href);
		});
	};

	// =========================================================================
	// ECOMMERCE ITEM
	// =========================================================================
	// Init
	p._initEItem = function () {
		var o = this;
		$('#products .item-pic > a').on('click', function () {
			//$('#messages').addClass('open');
			o.getItemById('eItem');
			//console.log('ddd');
			return false;
		});


	};
	p.returnCat = function (id) {
		var o = this;
		var click = $('#products .breadcrumb a');
		click.on('click', function () {
			o.getItemById(id);
			glavsnab.AppVendor._initTabs();
			glavsnab.AppVendor._initAjaxModals();
			o.returnCat('eCatalog');

			return false;
		});
	};
	p.getItemById = function (id) {
		var o = this;

		// Define neccessary elements
		var $messages = $('.company-content').find('#products'),
				$messageSendContainer = $('.company-content'),
				$mobileBack = $('.mobile-back');

		// Adding Loading Bar
		$messageSendContainer.addClass('loading').prepend('<div class="loading-bar indeterminate"></div>');

		// For demo purposes, 1 second delay
		setTimeout( function () {
			var jqxhr = $.ajax({
				url: 'data/ajax/' + id +'.html',
				beforeSend: function() {
					$messages.html('');
					o.resetSendMessage();
				}
			}).done(function(data) {
				console.log('click!');
				$messages.html(data);
				glavsnab.AppVendor._initTabs();
				glavsnab.AppVendor._initFotorama();
				o.returnCat('eCatalog');
				
				$messages.scrollTop( $messages.prop('scrollHeight') );
				$messageSendContainer.removeClass('loading').find('.loading-bar').remove();
			}).fail(function(jqXHR, textStatus) {
				$messageSendContainer.removeClass('loading').find('.loading-bar').remove();
				$messages.html(jqXHR.statusText+'<br/>'+jqXHR.responseText);
				//console.log(textStatus);
			});
		}, 1e3);

		// If Layout is mobile then return button should come to screen
		if( $('body').hasClass('layout-device') )
			$mobileBack.addClass('active');
		};
	// p.getEItemById = function (id) {
	// 	var o = this;

	// 	// Define neccessary elements
	// 	var $eItems = $('#business').find('.company-content'),
	// 			$messageSendContainer = $('.company-content'),

	// 	// Adding Loading Bar
	// 	$messageSendContainer.addClass('loading').prepend('<div class="loading-bar indeterminate"></div>');

	// 	// For demo purposes, 1 second delay
	// 	setTimeout( function () {
	// 		var jqxhr = $.ajax({
	// 			url: 'data/ajax/eitem__'+id+'.html',
	// 			beforeSend: function() {
	// 				$eItems.html('');
	// 				o.resetSendMessage();
	// 			}
	// 		}).done(function(data) {
	// 			console.log('click!');
	// 			$eItems.html(data);
	// 			$eItems.scrollTop( $eItems.prop('scrollHeight') );
	// 			$messageSendContainer.removeClass('loading').find('.loading-bar').remove();
	// 		}).fail(function(jqXHR, textStatus) {
	// 			$messageSendContainer.removeClass('loading').find('.loading-bar').remove();
	// 		});
	// 	}, 1000);

	// 	// If Layout is mobile then return button should come to screen
	// 	if( $('body').hasClass('layout-device') )
	// 		$mobileBack.addClass('active');
	// };

	// =========================================================================
	// CONTACTS
	// =========================================================================

	// Init
	p._initMessages = function () {
		var o = this;

		// Open Single Message
		$('.message-list > li').on('click', function () {
			var $check = $(this).find('a').data('type') == 'checkbox';

			if (!$check) {
				$(this).parent().find('.selected').removeClass('selected');
				$(this).addClass('selected');
				$('#messages').addClass('open');
				o.getMessageById( $(this).find('a').data('message-id') );
			}

			if ($check) {
	      var $checkbox = $(this).find(':checkbox');
	      $checkbox.prop('checked', !$checkbox[0].checked);
	    }

		});

		// When mobile close message overlay
		$('.message-list-overlay').on('click', function () {
			$('#messages').removeClass('open');
			$('.message-list').find('.selected').removeClass('selected');
		});

		$('.mobile-back-button').on('click', function () {
			$('.message-list-overlay').trigger('click');
			$(this).parent().removeClass('active');
		});
	};

	p.getMessageById = function (id) {
		var o = this;

		// Define neccessary elements
		var $messages = $('#messages').find('.messages'),
				$messageSendContainer = $('.message-send-container'),
				$mobileBack = $('.mobile-back');

		// Adding Loading Bar
		$messageSendContainer.addClass('loading').prepend('<div class="loading-bar indeterminate"></div>');

		// For demo purposes, 1 second delay
		setTimeout( function () {
			var jqxhr = $.ajax({
				url: 'data/ajax/messages__tab'+id+'.html',
				beforeSend: function() {
					$messages.html('');
					o.resetSendMessage();
				}
			}).done(function(data) {
				$messages.html(data);
				$messages.scrollTop( $messages.prop('scrollHeight') );
				$messageSendContainer.removeClass('loading').find('.loading-bar').remove();
			}).fail(function(jqXHR, textStatus) {
				$messageSendContainer.removeClass('loading').find('.loading-bar').remove();
				$messages.html(jqXHR.statusText+'<br/>'+jqXHR.responseText);
				//console.log(textStatus);
			});
		}, 1000);

		// If Layout is mobile then return button should come to screen
		if( $('body').hasClass('layout-device') )
			$mobileBack.addClass('active');
	};

	p.resetSendMessage = function () {
		// Define neccessary elements
		var $sendMessageInput = $('#send-message-input');

		$sendMessageInput.val('').trigger('input');
		$sendMessageInput.trigger('change');
	};


	// =========================================================================
	// CHAT MESSAGE
	// =========================================================================
	
	p._initChatMessage = function (e) {
		var o = this;
		$('#sidebarChatMessage').keydown(function (e) {
			o._handleChatMessage(e);
		});
	};
	
	p._handleChatMessage = function (e) {
		var input = $(e.currentTarget);
		
		// Detect enter
		if (e.keyCode === 13) {
			e.preventDefault();
			
			// Get chat message
			var demoTime = new Date().getHours() + ':' + new Date().getMinutes();
			var demoImage = $('.list-chats li img').attr('src');
			
			// Create html
			var html = '';
			html += '<li>';
			html += '	<div class="chat">';
			html += '		<div class="chat-avatar"><img class="img-circle" src="' + demoImage + '" alt=""></div>';
			html += '		<div class="chat-body">';
			html += '			' + input.val();
			html += '			<small>' + demoTime + '</small>';
			html += '		</div>';
			html += '	</div>';
			html += '</li>';
			var $new = $(html).hide();
			
			// Add to chat list
			$('.list-chats').prepend($new);
			
			// Animate new inserts
			$new.show('fast');
			
			// Reset chat input
			input.val('').trigger('autosize.resize');
			
			// Refresh for correct scroller size
			$('.offcanvas').trigger('refresh');
		}
	};

	// =========================================================================
	// INVERSE UI TOGGLERS
	// =========================================================================
	
	p._initInversedTogglers = function () {
		var o = this;

		
		$('input[name="menubarInversed"]').on('change', function (e) {
			o._handleMenubarInversed(e);
		});
		$('input[name="headerInversed"]').on('change', function (e) {
			o._handleHeaderInversed(e);
		});
	};
	
	p._handleMenubarInversed = function (e) {
		if($(e.currentTarget).val() === '1') {
			$('#menubar').addClass('menubar-inverse');
		}
		else {
			$('#menubar').removeClass('menubar-inverse');
		}
	};
	p._handleHeaderInversed = function (e) {
		if($(e.currentTarget).val() === '1') {
			$('#header').addClass('header-inverse');
		}
		else {
			$('#header').removeClass('header-inverse');
		}
	};
	
	// =========================================================================
	// BUTTON STATES (LOADING)
	// =========================================================================

	p._initEditable = function () {

		  $('.editable')
			.wrapInner('<span></span>')
			.append('<i class="fa fa-pencil"></>')
		  .editable({
		    //type: tt,
		    //mode: 'inline',
		    placement: 'bottom',
		    url: '/post',
		  });


			$('.edit').click(function(e){    
			       e.stopPropagation();
			       $('#publicname-change').editable('toggle');
			       $('.edit').hide();
			});
			    $(document).on('click', '.editable-cancel, .editable-submit', function(){
			        $('.edit').show();
			    })        
			//ajax emulation. Type "err" to see error message
			// $.mockjax({
			//     url: '/post',
			//     responseTime: 100,
			//     response: function(settings) {
			//         if(settings.data.value == 'err') {
			//            this.status = 500;  
			//            this.responseText = 'Validation error!'; 
			//         } else {
			//            this.responseText = '';  
			//         }
			//     }
			// }); 
	};

	// =========================================================================
	// CARD FLIP
	// =========================================================================

	p._initFlipCard = function () {
    $('.flipControl').click(function(){
        $(this).closest('.card').toggleClass('flipped');

    });
	};

	// =========================================================================
	// BUTTON STATES (LOADING)
	// =========================================================================

	p._initButtonStates = function () {
		$('.btn-loading-state').click(function () {
			var btn = $(this);
			btn.button('loading');
			setTimeout(function () {
				btn.button('reset');
			}, 3000);
		});
	};

	// =========================================================================
	// ICON SEARCH
	// =========================================================================

	p._initIconSearch = function () {
		if($('#iconsearch').length === 0) {
			return;
		}

		$('#iconsearch').focus();
		$('#iconsearch').on('keyup', function () {
			var val = $('#iconsearch').val();
			$('.col-md-3').hide();
			$('.col-md-3:contains("' + val + '")').each(function (e) {
				$(this).show();
			});

			$('.card').hide();
			$('.card:contains("' + val + '")').each(function (e) {
				$(this).show();
			});
		});
	};
		
	// =========================================================================
	namespace.Demo = new Demo;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):


		(function (namespace, $) {
	"use strict";

	var Zayavka = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = Zayavka.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		this._enableEvents();

	};

	// =========================================================================
	// EVENTS
	// =========================================================================

	// events
	p._enableEvents = function () {
		this._initToastrBtn();
		this._initZayaButtonStates();
	};


	p._initToastrBtn = function() {
		var o = this;
		var UImsg = glavsnab.DemoUIMessages;

		// $('#zaya_sendinvite').on('click', function (e) {
		// 	var msg = $(this).data('toastmsg') || 'Приглашение отправлено';
		// 	UImsg._toastrStateConfig();
		// 	toastr.options.positionClass = 'toast-top-left';

		// 	setTimeout( function () {
		// 		glavsnab.AppOffcanvas._handleOffcanvasClose();
		// 	}, 1e3);
		// 	toastr.success(msg, '');
		// });

		// $('#zaya_send').on('click', function (e) {
		// 	console.log('hahah');
		// 	var msg = $(this).data('toastmsg') || 'Сообщение ';
		// 	UImsg._toastrStateConfig();
		// 	toastr.options.positionClass = 'toast-top-left';

		// 	setTimeout( function () {
		// 		glavsnab.AppOffcanvas._handleOffcanvasClose();
		// 	}, 1e3);
		// 	toastr.success(msg, '');
		// });

	};


	// =========================================================================
	// BUTTON STATES (LOADING)
	// =========================================================================

	p._initZayaButtonStates = function () {

	  $('#btn__newzaya').on('click', function () {
			var msg = $(this).data('msg').split('|');
			var title = msg[0] || 'Hi!';
			var text = msg[1] || '';
			var style = $(this).data('style') || 'success'; 
			console.log(title);
			swal(
		    title,
		    text,
		    style
		  ).then(function () {
				$('.modal').modal('hide');
		  });
	  });


		//
		// ПОСТАВЩИК - newest
		// -----------
		// 
	  $('.btn__zaya').on('click', function () {
			var msg = $(this).data('msg').split('|');
			var title = msg[0] || 'Hi!';
			var text = msg[1] || '';
			var style = $(this).data('style') || 'success'; 
			console.log(title);
			swal(
		    title,
		    text,
		    style
		  ).then(function () {
				$('.modal').modal('hide');
		  });
	  });

	  $('#zaya_sendinvite').on('click', function () {
			var title = $(this).data('msg') || 'Hi!';
			var style = $(this).data('style') || 'success'; 
			console.log(title);
			swal(
		    title,
		    '',
		    style
		  ).then(function () {
				
		  });
	  });
	  $('#zaya_sendagree').on('click', function () {
			var msg = $(this).data('msg').split('|');
			var title = msg[0] || 'Hi!';
			var text = msg[1] || '';
			var style = $(this).data('style') || 'success'; 
			console.log(msg);
			swal(
		    title,
				text,
		    style
		  ).then(function () {
				p._showAgreelist();
		  });
	  });

	  $('#zaya_send2').on('click', function () {
			swal({
			  title: 'Вы уверены?',
			  text: "Я проверил всю заявку и хочу отправить предложения",
	      html: `
           <ul class="list-material message-list" id="list_u">
              <li class="has-action-left has-action-right message-list__users"><a href="#m0" data-message-id="0" data-type="checkbox" class="visible">
                  <div class="list-action-left"><img src="/img/avatar6.jpg" alt="Арслан Мубаряков" class="face-radius"/></div>
                  <div class="list-content"><span class="title">Арслан Мубаряков</span><span class="caption">ООО «Универсалстрой»</span></div>
                  <div class="list-action-right"><span class="top"> 
                      <div class="checkbox checkbox-styled tile-text">
                        <label>
                          <input type="checkbox" checked />
                          <!--span=item['name']small=item['work']
                          -->
                        </label>
                      </div></span></div>
                  <!--a.opacity-75(href='#')--></a>
                <div class="contain-xs pull-left"></div>
              </li>
              <!-- end .col-->
              <li class="has-action-left has-action-right message-list__users"><a href="#m1" data-message-id="1" data-type="checkbox" class="visible">
                  <div class="list-action-left"><img src="/img/avatar8.jpg" alt="Зайтуна Настретдинова" class="face-radius"/></div>
                  <div class="list-content"><span class="title">Зайтуна Настретдинова</span><span class="caption">Менеджер по снабжению</span></div>
                  <div class="list-action-right"><span class="top"> 
                      <div class="checkbox checkbox-styled tile-text">
                        <label>
                          <input type="checkbox"/>
                          <!--span=item['name']small=item['work']
                          -->
                        </label>
                      </div></span></div>
                  <!--a.opacity-75(href='#')--></a>
                <div class="contain-xs pull-left"></div>
              </li>
            </ul>
           <ul class="list-material message-list" id="list_u">
              <li class="has-action-left has-action-right message-list__users"><a href="#m0" data-message-id="0" data-type="checkbox" class="visible">
                  <div class="list-action-left"><img src="/img/avatar6.jpg" alt="Арслан Мубаряков" class="face-radius"/></div>
                  <div class="list-content"><span class="title">Арслан Мубаряков</span><span class="caption">ООО «Универсалстрой»</span></div>
                  <div class="list-action-right"><span class="top"> 
                      <div class="checkbox checkbox-styled tile-text">
                        <label>
                          <input type="checkbox" checked />
                          <!--span=item['name']small=item['work']
                          -->
                        </label>
                      </div></span></div>
                  <!--a.opacity-75(href='#')--></a>
                <div class="contain-xs pull-left"></div>
              </li>
              <!-- end .col-->
              <li class="has-action-left has-action-right message-list__users"><a href="#m1" data-message-id="1" data-type="checkbox" class="visible">
                  <div class="list-action-left"><img src="/img/avatar8.jpg" alt="Зайтуна Настретдинова" class="face-radius"/></div>
                  <div class="list-content"><span class="title">Зайтуна Настретдинова</span><span class="caption">Менеджер по снабжению</span></div>
                  <div class="list-action-right"><span class="top"> 
                      <div class="checkbox checkbox-styled tile-text">
                        <label>
                          <input type="checkbox"/>
                          <!--span=item['name']small=item['work']
                          -->
                        </label>
                      </div></span></div>
                  <!--a.opacity-75(href='#')--></a>
                <div class="contain-xs pull-left"></div>
              </li>
            </ul>
						`,
        preConfirm: function() {
             return new Promise(function(resolve) {
                  resolve([
                      $('#list_u input:checked').val(),
                   ]);
              });
        },
			  showCancelButton: true,
	      buttonsStyling: false,
		      cancelButtonClass: 'btn btn-danger',
		      confirmButtonClass: 'btn btn-success',
				  confirmButtonText: '<i class="fa fa-thumbs-up"></i> Отправить',
				  cancelButtonText: '<i class="fa fa-thumbs-down"></i> Отменить'
			}).then(function (result) {
				  console.log(result);
				  swal.resetDefaults()
				  swal({
				    title: 'All done!',
				    html:
				      'Your answers: <pre>' +
				        JSON.stringify(result) +
				      '</pre>',
				    confirmButtonText: 'Lovely!',
				    showCancelButton: false
				  });
			  $('.modal').modal('hide');
			  p._showSuppl();
			  
			}).catch(swal.noop)
	  });

	  $('#zaya_senddecline').on('click', function () {
			var msg = $(this).data('msg').split('|');
			var title = msg[0] || 'Hi!';
			var text = msg[1] || '';
			var style = $(this).data('style') || 'success'; 

			swal({
			  title: 'Отклонение заявки',
			  text: 'Введите причину',
			  type: 'question',
			  input: 'text',
			  showCancelButton: true,
	      buttonsStyling: false,
		      confirmButtonClass:  'btn btn-success',
				  confirmButtonText:   'ОК <i class="fa fa-arrow-right"></i>',
		      cancelButtonClass:   'btn btn-danger',
				  cancelButtonText:    '<i class="fa fa-close"></i> Отменить',
			  showLoaderOnConfirm: true,
			  preConfirm: function (reason) {
			    return new Promise(function (resolve, reject) {
			      setTimeout(function() {
			         resolve()
			      }, 2e3)
			    })
			  },
			  allowOutsideClick: false
			}).then(function (reason) {
			  swal({
			    type: 'error',
			    title: 'Заявка отклонена',
			    html: 'причина: ' + reason
			  })
			}).catch(swal.noop)

	  });



	  // СОГЛАСОВАНИЕ
	  // ----------------------
	  $('#zaya_agreeyes').on('click', function () {
			swal.setDefaults({
			  input: 'text',
			  showCancelButton: true,
	      buttonsStyling: false,
		      confirmButtonClass:  'btn btn-success',
				  confirmButtonText:   'Дальше <i class="fa fa-arrow-right"></i>',
		      cancelButtonClass:   'btn btn-danger',
				  cancelButtonText:    '<i class="fa fa-close"></i> Отменить',
			  progressSteps: ['1', '2']
			})

			var inputOptions = new Promise(function(resolve) {
				resolve({
				  'byECP': 'По ЭЦП',
				  'byPass': 'По паролю'
				});
			});

			var steps = [
			  {
					title: 'Выберите метод согласования',
				  type: null,
				  html: 'Константиновский Альберт Мансурович <br/><span class="badge style-primary-light">АО "Уралэлектромедь"</span>',
				  input: 'radio',
				  inputOptions: inputOptions,
				  inputValidator: function(value) {
				    return new Promise(function(resolve, reject) {
				      if (value === 'byECP') {
				        swal.insertQueueStep({
				        	title: 'Загрузите свой ключ ЭЦП', 
				        	input: 'file'
				        	})
				        resolve();
				      } 
				      if (value === 'byPass') {
				        swal.insertQueueStep({
				        	title: 'Введите свой пароль', 
				        	input: 'password'
				        	})
				        resolve();
				      } else {
				        reject('Выберите метод согласования');
				      }
				    });
				  }
			  }
			]

			swal.queue(steps).then(function (result) {
			  swal.resetDefaults()
			  swal({
			    title: 'Заявка согласована!',
			    type: 'success',
			    html:
			      '<pre>' +
			        JSON.stringify(result) +
			      '</pre>',
			    confirmButtonText: 'OK',
			    showCancelButton: false,
					//timer: 3000
			  })
			  $('.modal').modal('hide');
			  p._showSuppl();

			}, function () {
			  swal.resetDefaults();

			})

	  });
	  

	  $('#zaya_agreeno').on('click', function () {
			swal({
			  title: 'Отклонение заявки',
			  text: 'Введите причину',
			  type: 'question',
			  input: 'text',
			  showCancelButton: true,
	      buttonsStyling: false,
		      confirmButtonClass:  'btn btn-success',
				  confirmButtonText:   'Дальше <i class="fa fa-arrow-right"></i>',
		      cancelButtonClass:   'btn btn-danger',
				  cancelButtonText:    '<i class="fa fa-close"></i> Отменить',
			  showLoaderOnConfirm: true,
			  preConfirm: function (reason) {
			    return new Promise(function (resolve, reject) {
			         resolve()
			    })
			  },
			  allowOutsideClick: false
			}).then(function (reason) {
			  swal({
			    type: 'error',
			    title: 'Заявка несогласована',
			    html: 'причина: ' + reason
			  })
			}).catch(swal.noop)

	  });
	  $('#zaya_agreefreeze').on('click', function () {
			swal({
			  title: 'Вы уверены?',
			  text: "Я посмотрел заявку о решил её заморозить",
			  type: 'warning',
			  showCancelButton: true,
	      buttonsStyling: false,
		      cancelButtonClass: 'btn btn-danger',
		      confirmButtonClass: 'btn btn-success',
				  confirmButtonText: '<i class="fa fa-snowflake-o"></i> Заморозить',
				  cancelButtonText: '<i class="fa fa-close"></i> Отказаться'
			}).then(function () {
			  swal(
			    'Ваша заявка заморожена',
			    '',
			    'success'
			  );
			  $('.modal').modal('hide');
			  p._showSuppl();
			  
			}).catch(swal.noop)
		})






	};

	p._showSuppl = function () {
		$('.zaya-desc .nav-tabs li').removeClass('hide')
	};

	p._showAgreelist = function () {
		$('.zaya_actions_btn .btn').removeClass('disabled')
		$('.zaya_actions_btn .btn:first').addClass('disabled')
	};



	// =========================================================================
	// COLOR SWITCHER
	// =========================================================================
	
	p._handleThemeSwitch = function (e) {
		e.preventDefault();
		var newTheme = $(e.currentTarget).attr('href');
		this.switchTheme(newTheme);
	};
	
	p.switchTheme = function (theme) {
		$('link').each(function () {
			var href = $(this).attr('href');
			href = href.replace(/(assets\/css\/)(.*)(\/)/g, 'assets/css/' + theme + '/');
			$(this).attr('href', href);
		});
	};


	// =========================================================================
	// ICON SEARCH
	// =========================================================================

	p._initIconSearch = function () {
		if($('#iconsearch').length === 0) {
			return;
		}

		$('#iconsearch').focus();
		$('#iconsearch').on('keyup', function () {
			var val = $('#iconsearch').val();
			$('.col-md-3').hide();
			$('.col-md-3:contains("' + val + '")').each(function (e) {
				$(this).show();
			});

			$('.card').hide();
			$('.card:contains("' + val + '")').each(function (e) {
				$(this).show();
			});
		});
	};
		
	// =========================================================================
	namespace.Zayavka = new Zayavka;
}(this.glavsnab, jQuery)); // pass in (namespace, jQuery):



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2NoYS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAtPiBhcHBcbi8vIC0tPiBjb3JlL0FwcC5qc1xuXHRcdEBAaW5jbHVkZSgnY29yZS9BcHAuanMnKVxuLy8gLS0+IGNvcmUvQXBwVmVuZG9yLmpzXG5cdFx0QEBpbmNsdWRlKCdjb3JlL0FwcFZlbmRvci5qcycpXG5cbi8vIC0tPiBjb3JlL0FwcE5hdmlnYXRpb24uanNcblx0XHRAQGluY2x1ZGUoJ2NvcmUvQXBwTmF2aWdhdGlvbi5qcycpXG4vLyAtLT4gY29yZS9BcHBPZmZjYW52YXMuanNcblx0XHRAQGluY2x1ZGUoJ2NvcmUvQXBwT2ZmY2FudmFzLmpzJylcblxuLy8gLS0+IGNvcmUvQXBwRm9ybS5qc1xuXHRcdEBAaW5jbHVkZSgnY29yZS9BcHBGb3JtLmpzJylcbi8vIC0tPiBjb3JlL0FwcE5hdlNlYXJjaC5qc1xuXHRcdEBAaW5jbHVkZSgnY29yZS9BcHBOYXZTZWFyY2guanMnKVxuXG4vLyAtPiBjb3JlL2RlbW8vRGVtb1RhYmxlRHluYW1pYy5qc1xuXHRcdEBAaW5jbHVkZSgnY29yZS9UYWJsZUR5bmFtaWMuanMnKVxuXG4vLyAtLT4gY29yZS9BcHBDYXJkLmpzXG5cdFx0QEBpbmNsdWRlKCdjb3JlL0FwcENhcmQuanMnKVxuXG4vLyAtLT4gY29yZS9Gb3JtQ29tcG9uZW50cy5qc1xuXHRcdEBAaW5jbHVkZSgnY29yZS9Gb3JtQ29tcG9uZW50cy5qcycpXG5cblx0XHRAQGluY2x1ZGUoJ2NvcmUvZGVtby9EZW1vVUlNZXNzYWdlcy5qcycpXG5cblx0XHRAQGluY2x1ZGUoJ2NvcmUvRGVtby5qcycpXG5cblx0XHRAQGluY2x1ZGUoJ2NvcmUvRGVtb1pheWEuanMnKVxuXG4iXSwiZmlsZSI6Im1vY2hhLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
