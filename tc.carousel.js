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
			return $("<div class='carousel'><div class='scroll'></div></div>");
		}
	};
	
	function Carousel(options) {
		var o, $c, $elements;
		
		o = $.extend({
			
		}, options);
		
		function init(me) {
			$c = generate.carousel();
			$elements = {
				scroll: $c.find(".scroll")
			};
		}
		
		this.toIndex = function(index) {
			
			return this;
		};
		
		this.next = function() {
			
			return this;
		};
		
		this.prev = function() {
			
			return this;
		};
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Carousel = Carousel;
	
}(this, this.jQuery));