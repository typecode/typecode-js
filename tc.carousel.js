/*    _____                    _____          
     /\    \                  /\    \         
    /::\    \                /::\    \        
    \:::\    f\              /::::\    \       
     \:::\    \            /::::::\    \      
      \:::\    \          /:::/\:::\    \     
       \:::\    \        /:::/  \:::\    \    
       /::::\    \      /:::/    \:::\    \   
      /::::::\    \    /:::/    / \:::\    \  
     /:::/\:::\    \  /:::/    /   \:::\    \ 
    /:::/  \:::\____\/:::/____/     \:::\____\
   /:::/    \::/    /\:::\    \      \::/    /
  /:::/    / \/____/  \:::\    \      \/____/ 
 /:::/    /            \:::\    \             
/:::/    /              \:::\    \            
\::/    /                \:::\    \           
 \/____/                  \:::\    \          
                           \:::\    \         
                            \:::\____\        
                             \::/    /        
                              \/____/         
                             TYPE/CODE        
                         From 2010 till ∞     */

// this carousel implementation is based on the jQuery Tools "scrollable" implementation:
// https://github.com/jquerytools/jquerytools/blob/master/src/scrollable/scrollable.js

(function(window, $) {
	
	var NI = window.NI,
	    generate;
	
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
		var me, o, $c, selectors, $elements, events, touchInfo;
		
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
			keyboard: true,
			onMove: function(instance, info) {}
		}, options);
		
		function init() {
			var $viewport;
			
			if (o.container) {
				if (typeof o.container === "string") {
					o.container = $(o.container);
				}
				$c = o.container;
			} else {
				$c = generate.carousel();
			}
			
			selectors = {
				panel: "."+o.panelClass,
				active: "."+o.activeClass,
				clone: "."+o.cloneClass
			};
			
			$viewport = $c.find(".viewport");
			$elements = {
				viewport: $viewport,
				scroll: $viewport.children(".scroll"),
				prevBtn: null,
				nextBtn: null
			};
			
			if (o.viewportDimensions) {
				if (typeof o.viewportDimensions.width === "number") {
					$elements.viewport.width(o.viewportDimensions.width);
					
				}
				if (typeof o.viewportDimensions.height === "number") {
					$elements.viewport.height(o.viewportDimensions.height);
				}
			}
			
			if (o.keyboard) {
				$(window.document).bind("keydown.carousel", {instance:me}, events.keydown);
			}
			
			touchInfo = {};
			$elements.scroll[0].ontouchstart = events.touchstart;
			$elements.scroll[0].ontouchmove = events.touchmove;
			
			if (o.panels && o.panels.length) {
				$.each(o.panels, function(i, $panel) {
					me.add($panel);
				});
			}
			
			me.begin(true);
		}
		
		function current() {
			return $elements.scroll.children(selectors.panel + selectors.active);
		}
		
		function targetPosition($panel) {
			if (o.vertical) {
				if (o.viewportDimensions && typeof o.viewportDimensions.height === "number") {
					return {top: -($panel.index()*o.viewportDimensions.height)};
				} else {
					return {top: -($panel.position().top)};
				}
			}
			if (o.viewportDimensions && typeof o.viewportDimensions.width === "number") {
				return {left: -($panel.index()*o.viewportDimensions.width)};
			} else {
				return {left: -($panel.position().left)};
			}
		}
		
		function moveTo($panel, noAnimate) {
			
			if (!$panel.length) {
				return me;
			}
			
			$elements.scroll.animate(targetPosition($panel), (noAnimate ? 0 : o.speed), o.easing, function() {
					var info;
					
					if ($panel.hasClass(o.cloneClass)) {
						$panel = $elements.scroll.children(selectors.panel).not(selectors.clone)[$panel.hasClass("head") ? "last" : "first"]();
						$elements.scroll.css(targetPosition($panel));
					}
					
					$panel.addClass(o.activeClass).siblings().removeClass(o.activeClass);
					
					info = me.info();
					
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
		
		events = {
			keydown: function(e) {
				var key;
				key = e.keyCode || e.which;
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
			}
		};
		
		function registerBtn(key) {
			var $btn;
			$btn = generate[key](me);
			$elements[key] ? $elements[key].add($btn) : $elements[key] = $btn;
			return $btn;
		}
		
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
		
		this.add = function($panel) {
			$panel.addClass(o.panelClass);
			if (!o.vertical) {
				$panel.css("float", "left");
			}
			if (o.viewportDimensions) {
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
				
			// if the removed panel was the currently active panel,
			// activate the previous sibling panel
			} else if (panelIndex === currentIndex) {
				this.toIndex(currentIndex-1, true);
			}
			
			return $panel;
		};
		
		this.registerPrevBtn = function() {
			return registerBtn("prevBtn");
		};

		this.registerNextBtn = function() {
			return registerBtn("nextBtn");
		};
		
		
		this.get = function() {
			return $c;
		};	
		
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
		
			
		this.begin = function(noAnimate) {
			this.refresh();
			return moveTo($elements.scroll.children(selectors.panel).not(selectors.clone).first(), noAnimate);
		};
		
		this.end = function(noAnimate) {
			return moveTo($elements.scroll.children(selectors.panel).not(selectors.clone).last(), noAnimate);
		};
		
		this.toIndex = function(index, noAnimate) {
			$elements.scroll.children(selectors.panel).not(selectors.clone).each(function(i, panel) {
				if (i === index) {
					moveTo($(panel), noAnimate);
					return false;
				}
			});
			return this;
		};
		
		this.next = function(noAnimate) {
			return moveTo(current().next(selectors.panel), noAnimate);
		};
		
		this.prev = function(noAnimate) {
			return moveTo(current().prev(selectors.panel), noAnimate);
		};
		
		
		this.destroy = function() {
			if (o.keyboard) {
				$(window.document).unbind("keydown.carousel", events.keydown);
			}
			if ($elements.prevBtn.length) {
				$elements.prevBtn.unbind("click");
			}
			if ($elements.nextBtn.length) {
				$elements.nextBtn.unbind("click");
			}
			$c.remove();
		};
		
		init();
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Carousel = Carousel;
	NI.Carousel.Generator = generate;
	
}(this, this.jQuery));