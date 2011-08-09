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
			panelSelector: ".panel",
			activeClass: "state-active",
			disabledClass: "state-disabled",
			speed: 400,
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
				scroll: $elements.viewport.find(".scroll")
			};
			moveTo($elements.scroll.children(o.panelSelector).first(), 0);
		}
		
		function moveTo($panel, speed) {
			$elements.scroll.animate({left: -($panel.position().left)}, 
				speed, "swing", function() {
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
			return $elements.scroll.children(o.panelSelector).length;
		};
		
		this.getCurrentIndex = function() {
			return $elements.scroll.children(o.panelSelector).filter("."+ o.activeClass).index();
		};
		
		this.next = function() {
			var $next;
			$next = $elements.scroll.children(o.panelSelector).filter("."+ o.activeClass).next(o.panelSelector);
			if ($next.length) {
				moveTo($next, o.speed);
			}
			return this;
		};
		
		this.prev = function() {
			var $prev;
			$prev = $elements.scroll.children(o.panelSelector).filter("."+ o.activeClass).prev(o.panelSelector);
			if ($prev.length) {
				moveTo($prev, o.speed);
			}
			return this;
		};
		
		init();
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Carousel = Carousel;
	
}(this, this.jQuery));