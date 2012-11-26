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

(function(window, $) {
	
	var NI = window.NI,
	generate,
	focussed;
	
	generate = {
		carousel: function() {
			return $("<div class='carousel' style=''>\
				<div class='viewport' style='overflow:hidden; position:relative;'>\
					<div class='scroll' style='position:absolute; width:20000em;'></div>\
				</div>\
			</div>");
		},
		prevBtn: function(instance) {
			var $btn;
			$btn = $("<a href='#' class='btn btn-prev'><span>Previous</span></a>");
			if (instance) {
				$btn.click(function(e) {
					e.preventDefault();
					instance.prev();
				});
			}
			return $btn;
		},
		nextBtn: function(instance) {
			var $btn;
			$btn = $("<a href='#' class='btn btn-next'><span>Next</span></a>");
			if (instance) {
				$btn.click(function(e) {
					e.preventDefault();
					instance.next();
				});
			}
			return $btn;
		}
	};
	
	function Carousel(options) {
		var me, o, $e, selectors, $elements, events, touchInfo;
		
		me = this;
		o = $.extend({
			container: null,
			viewportDimensions: null, // { width: null, height: null },
			panels: [],
			panelClass: "panel",
			activeClass: "state-active",
			disabledClass: "state-disabled",
			cloneClass: "clone",
			speed: 400,
			easing: "swing",
			vertical: false,
			circular: true,
			elastic: false,
			keyboard: true,
			touch: true,
			onBeforeMove: function(instance, info) {},
			onMove: function(instance, info) {}
		}, options);
		
		function init() {
			var $viewport;
			
			if (o.container) {
				if (typeof o.container === "string") {
					o.container = $(o.container);
				}
				$e = o.container;
			} else {
				$e = generate.carousel();
			}
			
			selectors = {
				panel: "."+o.panelClass,
				active: "."+o.activeClass,
				clone: "."+o.cloneClass
			};
			
			$viewport = $e.find(".viewport");
			$elements = {
				viewport: $viewport,
				scroll: $viewport.children(".scroll"),
				currentTarget: null,
				prevBtn: null,
				nextBtn: null
			};
			
			if (o.viewportDimensions) {
				if (o.elastic) {
					o.viewportDimensions = null;
				} else {
					if (typeof o.viewportDimensions.width === "number") {
						$elements.viewport.width(o.viewportDimensions.width);
						
					}
					if (typeof o.viewportDimensions.height === "number") {
						$elements.viewport.height(o.viewportDimensions.height);
					}
				}
			}

			if (o.keyboard) {
				$(window.document).bind("keydown.carousel", {instance:me}, events.keydown);
			}
			
			if (o.touch) {
				touchInfo = {};
				$elements.scroll[0].ontouchstart = events.touchstart;
				$elements.scroll[0].ontouchmove = events.touchmove;
			}

			if (o.elastic) {
				syncElasticPanels();
				$(window).bind("resize", {instance: me}, events.elasticResize);
			}
			
			if (o.panels && o.panels.length) {
				$.each(o.panels, function(i, $panel) {
					me.add($panel);
				});
			}

			me.setOrientation(o.vertical);
			me.begin(true);
		}
		
		function current() {
			return $elements.scroll.children(selectors.panel + selectors.active);
		}
		
		function targetPosition($panel) {
			if (o.vertical) {
				if (o.viewportDimensions && typeof o.viewportDimensions.height === "number") {
					return {top: -($panel.index()*o.viewportDimensions.height)};
				}
				return {top: -($panel.position().top)};
			}
			if (o.viewportDimensions && typeof o.viewportDimensions.width === "number") {
				return {left: -($panel.index()*o.viewportDimensions.width)};
			}
			return {left: -($panel.position().left)};
		}
		
		function moveTo($panel, noAnimate) {
			var $cloneTarget = false, info;
			
			if (!$panel.length) {
				return me;
			}

			$elements.currentTarget = $panel;
			
			// Determine if the target panel is a clone.
			// If it is, keep track of the real panel as $cloneTarget
			if ($panel.hasClass(o.cloneClass)) {
				$cloneTarget = $elements.scroll.children(selectors.panel).not(selectors.clone)[$panel.hasClass("head") ? "last" : "first"]();
				$cloneTarget.addClass(o.activeClass).siblings().removeClass(o.activeClass);
			} else {
				$panel.addClass(o.activeClass).siblings().removeClass(o.activeClass);
			}
			
			info = me.info();
			
			if ($.isFunction(o.onBeforeMove)) {
				if (o.onBeforeMove(me, info) === false) {
					return me;
				}
			}
			
			$elements.scroll.stop(true, false).animate(targetPosition($panel), (noAnimate ? 0 : o.speed), o.easing, function() {

					$elements.currentTarget = null;
					
					if ($cloneTarget) {
						$elements.scroll.css(targetPosition($cloneTarget));
					}
					
					if (!o.circular) {
						if ($elements.prevBtn.length) {
							$elements.prevBtn[info.index === 0 ? "addClass" : "removeClass"](o.disabledClass);
						}
						if ($elements.nextBtn.length) {
							$elements.nextBtn[info.index === info.total-1 ? "addClass" : "removeClass"](o.disabledClass);
						}
					}
										
					if ($.isFunction(o.onMove)) {
						o.onMove(me, info);
					}
				}
			);
			
			return me;
		}

		function syncElasticPanels($panel) {
			var w, h;
			w = $e.width();
			h = $e.height();
			if (!$panel) {
				$panel = $elements.scroll.children(selectors.panel);
			}
			$panel.width(w).height(h);
		}
		
		events = {
			keydown: function(e) {
				var key;

				if (focussed != me) {
					return;
				}

				if (me.info().total < 2) {
					return;
				}

				key = e.which;

				switch (key) {
					case NI.co.keyboard.LEFT:
						e.preventDefault();
						e.data.instance.prev();
						break;
					case NI.co.keyboard.RIGHT:
						e.preventDefault();
						e.data.instance.next();
						break;
				}
			},
			touchstart: function(e) {
				touchInfo.x = e.touches[0].clientX;
				touchInfo.y = e.touches[0].clientY;
			},
			touchmove: function(e) {
				var dx, dy;
				if (e.touches.length === 1 && !$elements.scroll.is(":animated")) {
					e.preventDefault();
					dx = touchInfo.x - e.touches[0].clientX;
					dy = touchInfo.y - e.touches[0].clientY;
					me[o.vertical && dy > 0 || !o.vertical && dx > 0 ? "next" : "prev"]();
				}
			},
			elasticResize: NI.fn.debounce(function(e) {
				syncElasticPanels();
				e.data.instance.syncCurrentAnimation();
			}, 100)
		};
		
		function registerBtn(key) {
			var $btn;
			$btn = generate[key](me);

			if ($elements[key]) {
				$elements[key].add($btn);
			} else {
				$elements[key] = $btn;
			}

			return $btn;
		}
		
		// return an object with a reference to the currently active panel,
		// the current index, and the total number of panels
		this.info = function() {
			var $panels, $current, index;
			$panels = $elements.scroll.children(selectors.panel).not(selectors.clone);
			$panels.each(function(i, panel) {
				var $p = $(panel);
				if ($p.hasClass(o.activeClass)) {
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
			$panel.addClass(o.panelClass);
			if (!o.vertical) {
				$panel.css("float", "left");
			}
			if (o.elastic) {
				syncElasticPanels($panel);
			} else if (o.viewportDimensions) {
				if (typeof o.viewportDimensions.width === "number") {
					$panel.width(o.viewportDimensions.width);
				}
				if (typeof o.viewportDimensions.height === "number") {
					$panel.height(o.viewportDimensions.height);
				}
			}
			$elements.scroll.append($panel);
			return this;
		};
		
		// remove a panel from the carousel,
		// (return the removed panel)
		this.remove = function($panel) {
			var info, panelIndex, currentIndex;
			
			if (!($.contains($elements.scroll[0], $panel[0])) || $panel.hasClass(o.cloneClass)) {
				return false;
			}
			
			info = this.info();
			
			if (info.total === 1) {
				$elements.scroll.children(selectors.clone).remove();
				return $panel.detach();
			}
			
			panelIndex = $panel.index();
			currentIndex = info.$current.index();
			
			$panel.detach();
			
			// if the removed panel came before the currently active panel,
			// update the offset of the scroll element
			if (panelIndex < currentIndex) {
				moveTo(info.$current, true);
			}
			// if the removed panel was the currently active panel,
			// activate the previous sibling panel
			else if (panelIndex === currentIndex) {
				this.toIndex(currentIndex-1, true);
			}
			
			return $panel;
		};
		
		// generate a "previous" button bound to this instance
		// return a headless jQuery element representing the button
		this.registerPrevBtn = function() {
			return registerBtn("prevBtn");
		};

		// generate a "next" button bound to this instance
		// return a headless jQuery element representing the button
		this.registerNextBtn = function() {
			return registerBtn("nextBtn");
		};
		
		// return the jQuery container element that represents the carousel
		this.get = function() {
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
				$panels.last().clone(false).addClass(o.cloneClass +" head").prependTo($elements.scroll);
				$panels.first().clone(false).addClass(o.cloneClass +" tail").appendTo($elements.scroll);
			}
			return this;
		};
		
		
		// move to the first panel and automatically refresh
		// (unless noRefresh is true)
		// (chainable)
		this.begin = function(noAnimate, noRefresh) {
			if (!noRefresh) {
				this.refresh();
			}
			return moveTo($elements.scroll.children(selectors.panel).not(selectors.clone).first(), noAnimate);
		};
		
		// move to the last panel
		// (chainable)
		this.end = function(noAnimate) {
			return moveTo($elements.scroll.children(selectors.panel).not(selectors.clone).last(), noAnimate);
		};
		
		// move to the panel at the specified index
		// (chainable)
		this.toIndex = function(index, noAnimate) {
			$elements.scroll.children(selectors.panel).not(selectors.clone).each(function(i, panel) {
				if (i === index) {
					moveTo($(panel), noAnimate);
					return false;
				}
			});
			return this;
		};
		
		// move to the next panel
		// (chainable)
		this.next = function(noAnimate) {
			return moveTo(current().next(selectors.panel), noAnimate);
		};
		
		// move to the previous panel
		// (chainable)
		this.prev = function(noAnimate) {
			return moveTo(current().prev(selectors.panel), noAnimate);
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
		this.setOrientation = function(vertical) {
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

		this.syncCurrentAnimation = function() {
			if ($elements.currentTarget) {
				moveTo($elements.currentTarget, true);
			} else {
				moveTo(current(), true);
			}
		};
		
		// destroy this instance
		// (the carousel element is automatically removed from the DOM)
		this.destroy = function() {
			me.blur();
			if (o.elastic) {
				$(window).unbind("resize", events.elasticResize);
			}
			if (o.keyboard) {
				$(window.document).unbind("keydown.carousel", events.keydown);
			}
			if ($elements.prevBtn && $elements.prevBtn.length) {
				$elements.prevBtn.unbind("click");
			}
			if ($elements.nextBtn && $elements.nextBtn.length) {
				$elements.nextBtn.unbind("click");
			}
			$e.remove();
		};
		
		init();
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Carousel = Carousel;
	NI.Carousel.Generator = generate;
	
}(this, this.jQuery));