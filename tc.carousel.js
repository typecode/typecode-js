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
				scroll: $viewport.children(".scroll")
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
					var index, total;
					
					if ($panel.hasClass(o.cloneClass)) {
						if ($panel.hasClass("beginning")) {
							$panel = $elements.scroll.children("."+o.panelClass).not("."+o.cloneClass).last();
							$elements.scroll.css("left", -($panel.position().left));
						} else {
							$panel = $elements.scroll.children("."+o.panelClass).not("."+o.cloneClass).first();
							$elements.scroll.css("left", 0);
						}
					}
					
					$panel.addClass(o.activeClass).siblings().removeClass(o.activeClass);
					
					index = me.getCurrentIndex();
					total = me.getTotal();
					
					$c.find(".btn-prev")[index === 0 ? "addClass" : "removeClass"](o.disabledClass);
					$c.find(".btn-next")[index === total-1 ? "addClass" : "removeClass"](o.disabledClass);
										
					if ($.isFunction(o.onMove)) {
						o.onMove(me, {index: index, total: total});
					}
				}
			);
			return me;
		}
		
		function current() {
			return $elements.scroll.children("."+o.panelClass).filter("."+ o.activeClass);
		}
		
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
		
		this.getTotal = function() {
			return $elements.scroll.children("."+o.panelClass).not("."+o.cloneClass).length;
		};
		
		this.getCurrentIndex = function() {
			return $elements.scroll.children("."+o.panelClass).filter("."+ o.activeClass).not("."+o.cloneClass).index();
		};
		
		this.refreshClones = function() {
			var $panels;
			$elements.scroll.children("."+o.cloneClass).remove();
			$panels = $elements.scroll.children("."+o.panelClass);
			$panels.first().clone(false).addClass(o.cloneClass +" beginning").prependTo($elements.scroll);
			$panels.last().clone(false).addClass(o.cloneClass +" end").appendTo($elements.scroll);
			return this;
		};
				
		this.begin = function(no_animate) {
			if (o.circular) {
				this.refreshClones();
			}
			return moveTo($elements.scroll.children("."+o.panelClass).first(), no_animate ? 0 : o.speed);
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
		
	Carousel.generatePrevBtn = function(instance) {
		return generate.prevBtn(instance);
	};
	
	Carousel.generateNextBtn = function(instance) {
		return generate.nextBtn(instance);
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Carousel = Carousel;
	
}(this, this.jQuery));