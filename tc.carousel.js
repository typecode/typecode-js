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
		var me, o, $c, $elements;
		
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
			circular: true,
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
			
			if (o.panels && o.panels.length) {
				$.each(o.panels, function(i, $panel) {
					me.add($panel);
				});
			}
			
			$(window.document).bind("keydown.carousel", {instance:me}, events.keydown);
			
			me.begin(true);
		}
		
		var events = {
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
			}
		};
		
		function moveTo($panel, speed) {
			
			if (!$panel.length) {
				return me;
			}
			
			$elements.scroll.animate({left: -($panel.position().left)}, 
				speed, o.easing, function() {
					var info;
					
					if ($panel.hasClass(o.cloneClass)) {
						if ($panel.hasClass("beginning")) {
							$panel = $elements.scroll.children("."+o.panelClass).not("."+o.cloneClass).last();
						} else {
							$panel = $elements.scroll.children("."+o.panelClass).not("."+o.cloneClass).first();
						}
						$elements.scroll.css("left", -($panel.position().left));
					}
					
					$panel.addClass(o.activeClass).siblings().removeClass(o.activeClass);
					
					info = me.getInfo();
					
					if ($elements.prevBtn.length) {
						$elements.prevBtn[info.index === 0 ? "addClass" : "removeClass"](o.disabledClass);
					}
					if ($elements.nextBtn.length) {
						$elements.nextBtn[info.index === info.total-1 ? "addClass" : "removeClass"](o.disabledClass);
					}
										
					if ($.isFunction(o.onMove)) {
						o.onMove(me, info);
					}
				}
			);
			return me;
		}
		
		function current() {
			return $elements.scroll.children("."+o.panelClass + "."+ o.activeClass);
		}
		
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
		
		this.registerPrevBtn = function() {
			return registerBtn("prevBtn");
		};

		this.registerNextBtn = function() {
			return registerBtn("nextBtn");
		};
		
		this.get = function() {
			return $c;
		};
		
		this.add = function($panel) {
			$panel.css("float", "left").addClass(o.panelClass);
			if (o.viewportDimensions) {
				if (typeof o.viewportDimensions.width === "number") {
					$panel.width(o.viewportDimensions.width);
				}
				if (typeof o.viewportDimensions.height === "number") {
					$panel.height(o.viewportDimensions.height);
				}
			}
			$elements.scroll.append($panel);
		};
		
		this.getInfo = function() {
			var $panels, index;
			$panels = $elements.scroll.children("."+o.panelClass).not("."+o.cloneClass);
			$panels.each(function(i, panel) {
				if ($(panel).hasClass(o.activeClass)) {
					index = i;
					return false;
				}
			});
			return {
				index: index,
				total: $panels.length
			};
		};
		
		this.refresh = function() {
			var $panels;
			if (o.circular) {
				$elements.scroll.children("."+o.cloneClass).remove();
				$panels = $elements.scroll.children("."+o.panelClass);
				$panels.last().clone(false).addClass(o.cloneClass +" beginning").prependTo($elements.scroll);
				$panels.first().clone(false).addClass(o.cloneClass +" end").appendTo($elements.scroll);
			}
			return this;
		};
			
		this.begin = function(no_animate) {
			this.refresh();
			return moveTo($elements.scroll.children("."+o.panelClass).not("."+o.cloneClass).first(), no_animate ? 0 : o.speed);
		};
		
		this.next = function(no_animate) {
			return moveTo(current().next("."+o.panelClass), no_animate ? 0 : o.speed);
		};
		
		this.prev = function(no_animate) {
			return moveTo(current().prev("."+o.panelClass), no_animate ? 0 : o.speed);
		};
		
		//TODO
		this.destroy = function() {
			
		};
		
		init();
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Carousel = Carousel;
	
}(this, this.jQuery));