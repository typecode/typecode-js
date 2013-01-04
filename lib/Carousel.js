/* ============================================================================

 >4SESz.,     _,     ,gSEE2zx.,_        .azx                    ,w.
@Sh. "QEE3.  JEE3.  &ss  `*4EEEEE2x.,_  "EEV  ,aS5^;dEEEE2x.,   VEEF  _
\E2`_,gF4EEEx.?jF   EE5L       `*4EEEEE2zpn..ZEEF ;sz.  `*EEESzw.w* '|EE.
  ,dEEF   `"?j]  _,_   ,_  _,     _,.     L.EEEF  !EEF  _,,  `"``    EE7   ,,_
 :EEE7 ,ws,`|EEL`JEEL`JEE)`JEEL zE5` E3. / [EE3  ,w.  zE2` Ek .zE5^JZE3.,6EF [3
 {EEE. VEE7.EE2  AE3. EEV  ZEEL{EEL ws. ;  [EE1  EEEt{E3. JEELEE3. JE5LJEEF ,w,
  \EEk,,>^ JEEL,@EEF ZE5L,ZE5^ "Q3. V2`.    \EEk,,J' "Q[ yE2^ VE[_zEE[,"QEL V5F
          ,ss  :EE7 ;EEF               L,szzw..            ,.,            ``
          \E5.,E5F  EE1.              /; ``*4EEEZhw._      EEEL
            ````     ``              JEEE.     `"45EEEhw.,,,]

From 2010 till ∞
typecode-js v 0.1
*/

// this carousel implementation is based on the jQuery Tools "scrollable" implementation:
// https://github.com/jquerytools/jquerytools/blob/master/src/scrollable/scrollable.js

define(['jquery', 'NIseed'], function($) {

	var window = this,
	NI = window.NI,
	generate,
	focussed;

	generate = {
		carousel: function() {
			return $('<div class="carousel">\
				<div class="viewport" style="overflow:hidden; position:relative;"">\
					<div class="scroll" style="position:absolute; width:20000em;"></div>\
				</div>\
			</div>');
		},
		prev_btn: function(instance) {
			var $btn;
			$btn = $('<a href="#" class="btn btn-prev"><span>Previous</span></a>');
			if (instance) {
				$btn.on('click.carousel', function(e) {
					e.preventDefault();
					instance.prev();
				});
			}
			return $btn;
		},
		next_btn: function(instance) {
			var $btn;
			$btn = $('<a href="#" class="btn btn-next"><span>Next</span></a>');
			if (instance) {
				$btn.on('click.carousel', function(e) {
					e.preventDefault();
					instance.next();
				});
			}
			return $btn;
		}
	};

	function Carousel(options) {
		var me, o, $e, selectors, $elements, handlers, touch_info;

		me = this;
		o = $.extend({
			$e: null,
			viewport_dimensions: null, // { width: null, height: null },
			viewport: '.viewport',
			scroll: '.scroll',
			panels: [],
			panel_class: 'panel',
			active_class: 'state-active',
			disabled_class: 'state-disabled',
			clone_class: 'clone',
			speed: 400,
			easing: 'swing',
			vertical: false,
			circular: true,
			elastic: false,
			elastic_delay: 100,
			keyboard: true,
			touch: true,
			on_before_move: function(instance, info) {},
			on_move: function(instance, info) {}
		}, options);

		function init() {
			var $viewport;

			if (o.$e) {
				if (typeof o.$e === 'string') {
					o.$e = $(o.$e);
				}
				$e = o.$e;
			} else {
				$e = generate.carousel();
			}

			selectors = {
				panel: '.' + o.panel_class,
				active: '.' + o.active_class,
				clone: '.' + o.clone_class
			};

			$viewport = $e.find(o.viewport);

			$elements = {
				viewport: $viewport,
				scroll: $viewport.children(o.scroll),
				current_target: null,
				prev_btn: null,
				next_btn: null
			};

			if (o.viewport_dimensions) {
				if (o.elastic) {
					o.viewport_dimensions = null;
				} else {
					if (typeof o.viewport_dimensions.width === 'number') {
						$elements.viewport.width(o.viewport_dimensions.width);

					}
					if (typeof o.viewport_dimensions.height === 'number') {
						$elements.viewport.height(o.viewport_dimensions.height);
					}
				}
			}

			if (o.keyboard) {
				$(window.document).on('keydown.carousel', handlers.keydown);
			}

			if (o.touch) {
				touch_info = {};
				$elements.scroll[0].ontouchstart = handlers.touchstart;
				$elements.scroll[0].ontouchmove = handlers.touchmove;
			}

			if (o.elastic) {
				elastic_panel_sync();
				$(window).on('resize', handlers.elastic_resize);
			}

			if (o.panels && o.panels.length) {
				$.each(o.panels, function(i, $panel) {
					me.add($panel);
				});
			}

			me.set_orientation(o.vertical);
			me.begin(true);
		}

		function current() {
			return $elements.scroll.children(selectors.panel + selectors.active);
		}

		function target_position($panel) {
			if (o.vertical) {
				if (o.viewport_dimensions && typeof o.viewport_dimensions.height === 'number') {
					return {top: -($panel.index()*o.viewport_dimensions.height)};
				}
				return {top: -($panel.position().top)};
			}
			if (o.viewport_dimensions && typeof o.viewport_dimensions.width === 'number') {
				return {left: -($panel.index()*o.viewport_dimensions.width)};
			}
			return {left: -($panel.position().left)};
		}

		function move_to($panel, no_anim) {
			var $clone_target = false, info;

			if (!$panel.length) {
				return me;
			}

			$elements.current_target = $panel;

			// Determine if the target panel is a clone.
			// If it is, keep track of the real panel as $clone_target
			if ($panel.hasClass(o.clone_class)) {
				$clone_target = $elements.scroll.children(selectors.panel).not(selectors.clone)[$panel.hasClass('head') ? 'last' : 'first']();
				$clone_target.addClass(o.active_class).siblings().removeClass(o.active_class);
			} else {
				$panel.addClass(o.active_class).siblings().removeClass(o.active_class);
			}

			info = me.info();

			if ($.isFunction(o.on_before_move)) {
				if (o.on_before_move(me, info) === false) {
					return me;
				}
			}

			$elements.scroll.stop(true, false).animate(target_position($panel), (no_anim ? 0 : o.speed), o.easing, function() {

					$elements.current_target = null;

					if ($clone_target) {
						$elements.scroll.css(target_position($clone_target));
					}

					if (!o.circular) {
						if ($elements.prev_btn.length) {
							$elements.prev_btn[info.index === 0 ? 'addClass' : 'removeClass'](o.disabled_class);
						}
						if ($elements.next_btn.length) {
							$elements.next_btn[info.index === info.total-1 ? 'addClass' : 'removeClass'](o.disabled_class);
						}
					}

					if ($.isFunction(o.on_move)) {
						o.on_move(me, info);
					}
				}
			);

			return me;
		}

		function elastic_panel_sync($panel) {
			var w, h;
			w = $e.width();
			h = $e.height();
			if (!$panel) {
				$panel = $elements.scroll.children(selectors.panel);
			}
			$panel.width(w).height(h);
		}


		function sync_current_animation() {
			if ($elements.current_target) {
				move_to($elements.current_target, true);
			} else {
				move_to(current(), true);
			}
			return me;
		}

		function register_btn(key) {
			var $btn;
			$btn = generate[key](me);

			if ($elements[key]) {
				$elements[key].add($btn);
			} else {
				$elements[key] = $btn;
			}

			return $btn;
		}

		handlers = {
			keydown: function(e) {
				if (focussed != me) {
					return;
				}
				if (me.info().total < 2) {
					return;
				}

				switch (e.which) {
					case NI.co.keyboard.LEFT:
						e.preventDefault();
						me.prev();
						break;
					case NI.co.keyboard.RIGHT:
						e.preventDefault();
						me.next();
						break;
				}
			},
			touchstart: function(e) {
				touch_info.x = e.touches[0].clientX;
				touch_info.y = e.touches[0].clientY;
			},
			touchmove: function(e) {
				var dx, dy;
				if (e.touches.length === 1 && !$elements.scroll.is(':animated')) {
					e.preventDefault();
					dx = touch_info.x - e.touches[0].clientX;
					dy = touch_info.y - e.touches[0].clientY;
					me[o.vertical && dy > 0 || !o.vertical && dx > 0 ? 'next' : 'prev']();
				}
			},
			elastic_resize: NI.fn.debounce(function(e) {
				elastic_panel_sync();
				sync_current_animation();
			}, o.elastic_delay)
		};

		// return an object with a reference to the currently active panel,
		// the current index, and the total number of panels
		this.info = function() {
			var $panels, $current, index;
			$panels = $elements.scroll.children(selectors.panel).not(selectors.clone);
			$panels.each(function(i, panel) {
				var $p = $(panel);
				if ($p.hasClass(o.active_class)) {
					$current = $p;
					index = i;
					return false;
				}
			});
			return {
				$current: $current,
				index: index,
				total: $panels.length
			};
		};

		// add a panel to the end of the carousel
		// (chainable)
		this.add = function($panel) {
			$panel.addClass(o.panel_class);
			//if (!o.vertical) {
			//	$panel.css('float', 'left');
			//}
			if (o.elastic) {
				elastic_panel_sync($panel);
			} else if (o.viewport_dimensions) {
				if (typeof o.viewport_dimensions.width === 'number') {
					$panel.width(o.viewport_dimensions.width);
				}
				if (typeof o.viewport_dimensions.height === 'number') {
					$panel.height(o.viewport_dimensions.height);
				}
			}
			$elements.scroll.append($panel);
			return this;
		};

		// remove a panel from the carousel,
		// (return the removed panel)
		this.remove = function($panel) {
			var info, panel_index, current_index;

			if (!($.contains($elements.scroll[0], $panel[0])) || $panel.hasClass(o.clone_class)) {
				return false;
			}

			info = this.info();

			if (info.total === 1) {
				$elements.scroll.children(selectors.clone).remove();
				return $panel.detach();
			}

			panel_index = $panel.index();
			current_index = info.$current.index();

			$panel.detach();

			// if the removed panel came before the currently active panel,
			// update the offset of the scroll element
			if (panel_index < current_index) {
				move_to(info.$current, true);
			}
			// if the removed panel was the currently active panel,
			// activate the previous sibling panel
			else if (panel_index === current_index) {
				this.to_index(current_index - 1, true);
			}

			return $panel;
		};

		// generate a 'previous' button bound to this instance
		// return a headless jQuery element representing the button
		this.register_prev_btn = function() {
			return register_btn('prev_btn');
		};

		// generate a 'next' button bound to this instance
		// return a headless jQuery element representing the button
		this.register_next_btn = function() {
			return register_btn('next_btn');
		};

		// return the jQuery element that represents the carousel
		this.get$e = function() {
			return $e;
		};

		// Tell the Carousel to check itself before it wr-wr-wrecks itself.
		// If the Carousel is circular, generate its secret clone elements.
		// The Carousel should be refreshed after panels have been added to or removed from it.
		// add() and remove() do not automatically call refresh() (to allow for simultaneous calls
		// to manipulate the Carousel in row, without consecutively refreshing).
		// (chainable)
		this.refresh = function() {
			var $panels;
			if (o.circular) {
				$elements.scroll.children(selectors.clone).remove();
				$panels = $elements.scroll.children(selectors.panel);
				$panels.last().clone(false).addClass(o.clone_class +' head').prependTo($elements.scroll);
				$panels.first().clone(false).addClass(o.clone_class +' tail').appendTo($elements.scroll);
			}
			return this;
		};


		// move to the first panel and automatically refresh
		// (unless no_refresh is true)
		// (chainable)
		this.begin = function(no_anim, no_refresh) {
			if (!no_refresh) {
				this.refresh();
			}
			return move_to($elements.scroll.children(selectors.panel).not(selectors.clone).first(), no_anim);
		};

		// move to the last panel
		// (chainable)
		this.end = function(no_anim) {
			return move_to($elements.scroll.children(selectors.panel).not(selectors.clone).last(), no_anim);
		};

		// move to the panel at the specified index
		// (chainable)
		this.to_index = function(index, no_anim) {
			$elements.scroll.children(selectors.panel).not(selectors.clone).each(function(i, panel) {
				if (i === index) {
					move_to($(panel), no_anim);
					return false;
				}
			});
			return this;
		};

		// move to the next panel
		// (chainable)
		this.next = function(no_anim) {
			return move_to(current().next(selectors.panel), no_anim);
		};

		// move to the previous panel
		// (chainable)
		this.prev = function(no_anim) {
			return move_to(current().prev(selectors.panel), no_anim);
		};

		// set focus on this carousel
		// (chainable)
		this.focus = function() {
			focussed = me;
			return me;
		};

		// remove focus from this carousel
		// (chainable)
		this.blur = function() {
			if (focussed == me) {
				focussed = null;
			}
			return me;
		};

		// set the carousel to vertical or horizontal
		// (chainable)
		this.set_orientation = function(vertical) {
			if (vertical === true) {
				o.vertical = true;
				$e.addClass('orientation-vertical');
				$e.removeClass('orientation-horizontal');
			} else {
				o.vertical = false;
				$e.removeClass('orientation-vertical');
				$e.addClass('orientation-horizontal');
			}
			return me;
		};

		// destroy this instance
		// (the carousel element is automatically removed from the DOM)
		this.destroy = function() {
			me.blur();
			if (o.elastic) {
				$(window).off('resize', handlers.elastic_resize);
			}
			if (o.keyboard) {
				$(window.document).off('keydown.carousel', handlers.keydown);
			}
			if ($elements.prev_btn && $elements.prev_btn.length) {
				$elements.prev_btn.off('click.carousel');
			}
			if ($elements.next_btn && $elements.next_btn.length) {
				$elements.next_btn.off('click.carousel');
			}
			$e.remove();
		};

		init();
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	NI.Carousel = Carousel;
	NI.Carousel.Generator = generate;

});
