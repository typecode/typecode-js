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
			return $("<div class='carousel' style=''><div class='scroll' style=''></div></div>");
		}
	};
	
	function Carousel(options) {
		var o, $c, $elements;
		
		o = $.extend({
			container: null,
			panelSelector: ".panel",
			activeClass: "state-active",
			o.speed: 400
		}, options);
		
		function init(me) {
			if (o.container) {
				if (typeof o.container === "string") {
					o.container = $(o.container);
				}
				$c = o.container;
			} else {
				$c = generate.carousel();
			}
			$elements = {
				scroll: $c.find(".scroll")
			};
			moveTo($elements.scroll.children(o.panelSelector).first(), 0);
		}
		
		function moveTo($panel, speed) {
			$elements.scroll.animate({left: -($panel.position().left)}, 
				speed, "swing", function() {
					$panel.addClass(o.activeClass).siblings().removeClass(o.activeClass);
				}
			);
		}
		
		this.add = function($panel) {
			$elements.scroll.append($panel.addClass(o.panelSelector));
			return this;
		};
		
		this.next = function() {
			var $current, $next;
			$current = $elements.scroll.children(o.panelSelector).filter("."+ o.activeClass);
			$next = $current.next(o.panelSelector);
			if ($next.length) {
				moveTo($next, o.speed);
			}
			return this;
		};
		
		this.prev = function() {
			var $current, $prev;
			$current = $elements.scroll.children(o.panelSelector).filter("."+ o.activeClass);
			$prev = $current.prev(o.panelSelector);
			if ($prev.length) {
				moveTo($prev, o.speed);
			}
			return this;
		};
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Carousel = Carousel;
	
}(this, this.jQuery));