/*    _____                    _____          
     /\    \                  /\    \         
    /::\    \                /::\    \        
    \:::\    \              /::::\    \       
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
                         From 2010 till ∞     
                         typecode-js v0.1       
                                                */

(function(window, $) {
	
	var NI = window.NI;
	
	//var SocialButtons = {
	//	twitter:function(options){
	//		var o, button;
	//		o = $.extend({
	//	
	//		}, options);
	//		
	//		button = $('<div class="spread-0 twitter spread-button">'+
	//			'<a href="http://twitter.com/share" class="twitter-share-button" data-url="http://itsalmo.st" data-via="typecode" data-text="Countdown to awesome:" data-related="anywhere:The Javascript API">Tweet</a>'+
	//		'</div>');
	//		
	//		return button;
	//	},
	//	facebook:function(options){
	//		
	//	},
	//	gplus:function(options){
	//		
	//	}
	//}
	    
	function SocialRotator(options) {
		var o, internal;
		
		o = $.extend({
			element:null,
			button_class:'spread-button',
			cycle_length:3000,
			fadeSpeed:600
		}, options);
		
		NI.ex.checkJQ(o.element);
		
		internal = {
			element_zIndex:o.element.css('zIndex'),
			spread_timer:null,
			spread_buttons: o.element.find('.'+o.button_class),
			cycle_counter:0,
			current_button:0,
			buttons:{}
		};
		
		this.o = o;
		this.internal = internal;
		
		internal.spread_buttons.css({
			'opacity':0.0,
			'zIndex':internal.element_zIndex + 1
		}).show();
			
		function cycleButtons() {
			internal.spread_buttons.stop(true,true).animate({
				'opacity':0.0
			},o.fadeSpeed,function(){
				internal.spread_buttons.css({
					'zIndex':internal.element_zIndex + 1
				});
			});
			internal.cycle_counter++;
			internal.current_button = (internal.cycle_counter % 3);
			internal.spread_buttons.eq(internal.current_button).stop(true, true).animate({
				opacity:1.0
			},o.fadeSpeed,function(){
				internal.spread_buttons.eq(internal.current_button).css({
					'zIndex':internal.element_zIndex + 2
				});
			});
			internal.spread_timer = setTimeout(cycleButtons, o.cycle_length);
		};
			
		o.element.hover(
			function () {
				if(internal.spread_timer){
					clearTimeout(internal.spread_timer)
				}
			},
			function () {
				if(internal.spread_timer){
					clearTimeout(internal.spread_timer);
				}
				internal.spread_timer = setTimeout(cycleButtons, (o.cycle_length/2));
			}
		);
		
		cycleButtons();
	}
	
	//SocialRotator.prototype.set_social = function(social){
	//	var i, temp_button;
	//	for(i in social){
	//		if($.isFunction(SocialButtons[i])){
	//			temp_button = SocialButtons[i](social[i]);
	//			temp_button.addClass('social-' + i).addClass(this.o.button_class);
	//			if(this.internal.spread_buttons.filter('.social-'+i).length){
	//				this.internal.spread_buttons.filter('.social-'+i).replaceWith(temp_button);
	//			} else {
	//				this.o.element.prepend(temp_button);
	//			}
	//			$(document).trigger('readystatechange');
	//		}
	//	}
	//	this.internal.spread_buttons = this.o.element.find('.'+this.o.button_class);
	//}
	
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.SocialRotator = SocialRotator;
	
}(this, this.jQuery));