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
					<div class='scroll' style='position:absolute;'></div>\
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
			speed: 400,
			easing: "swing",
			onMove: function(instance, info) {}
		}, options);
		
		function init() {
			if (o.container) {
				if (typeof o.container === "string") {
					o.container = $(o.container);
				}
				$c = o.container;
			} else {
				$c = generate.carousel();
			}
			
			$elements = {
				viewport: $c.find(".viewport"),
				scroll: $elements.viewport.children(".scroll")
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
					$panel.addClass(o.panelClass);
					$elements.scroll.append($panel);
				});
			}
			
			moveTo($elements.scroll.children("."+o.panelClass).first(), 0);
		}
		
		function moveTo($panel, speed) {
			$elements.scroll.animate({left: -($panel.position().left)}, 
				speed, o.easing, function() {
					var index, total;
					$panel.addClass(o.activeClass).siblings().removeClass(o.activeClass);
					
					index = me.getCurrentIndex();
					total = me.getTotal();
					
					if (index === 0) {
						$c.find(".btn-prev").addClass(o.disabledClass);
					} else {
						$c.find(".btn-prev").removeClass(o.disabledClass);
					}
					if (index === total-1) {
						$c.find(".btn-next").addClass(o.disabledClass);
					} else {
						$c.find(".btn-next").removeClass(o.disabledClass);
					}
					
					if ($.isFunction(o.onMove)) {
						o.onMove(me, {index: index, total: total});
					}
				}
			);
		}
		
		this.getTotal = function() {
			return $elements.scroll.children("."+o.panelClass).length;
		};
		
		this.getCurrentIndex = function() {
			return $elements.scroll.children("."+o.panelClass).filter("."+ o.activeClass).index();
		};
		
		this.next = function() {
			var $next;
			$next = $elements.scroll.children("."+o.panelClass).filter("."+ o.activeClass).next("."+o.panelClass);
			if ($next.length) {
				moveTo($next, o.speed);
			}
			return this;
		};
		
		this.prev = function() {
			var $prev;
			$prev = $elements.scroll.children("."+o.panelClass).filter("."+ o.activeClass).prev("."+o.panelClass);
			if ($prev.length) {
				moveTo($prev, o.speed);
			}
			return this;
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