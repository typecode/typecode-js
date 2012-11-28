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

define(['jquery', 'NIseed'], function($) {
	
	var window = this,
	NI = window.NI;
	
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
			fade_speed:600
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
			},o.fade_speed,function(){
				internal.spread_buttons.css({
					'zIndex':internal.element_zIndex + 1
				});
			});
			internal.cycle_counter++;
			internal.current_button = (internal.cycle_counter % 3);
			internal.spread_buttons.eq(internal.current_button).stop(true, true).animate({
				opacity:1.0
			},o.fade_speed,function(){
				internal.spread_buttons.eq(internal.current_button).css({
					'zIndex':internal.element_zIndex + 2
				});
			});
			internal.spread_timer = setTimeout(cycleButtons, o.cycle_length);
		}
			
		o.element.hover(
			function () {
				if(internal.spread_timer){
					clearTimeout(internal.spread_timer);
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
	
});