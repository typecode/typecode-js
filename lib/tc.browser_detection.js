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

(function(window, $) {
	
	var NI = window.NI;
	    
	function BrowserDetection(options) {
		var o, elements;
		
		o = $.extend({
			addClassToBody:true,
			orientationListen:true,
			detectWebApp:true
		}, options);
		
		elements = {
			body:$('body')
		};
		
		function init(){
			if (navigator.userAgent.match(/iPad/i) != null) {
				if(o.addClassToBody){
					elements.body.addClass('browser-ipad');
				};
				if(o.orientationListen){
					listenToOrientationChange();
				};
				if(o.detectWebApp){
					if (window.navigator.standalone) { elements.body.addClass('ios-webapp') }
				}
			} else if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
				if(o.addClassToBody){
					elements.body.addClass('browser-iphone');
				};
				if(o.orientationListen){
					listenToOrientationChange();
				};
				if(o.detectWebApp){
					if (window.navigator.standalone) { elements.body.addClass('ios-webapp') }
				}
			}
		}
		
		function listenToOrientationChange() {
			
			function orientationChanged(orientation) {
				if (orientation === 0){
					elements.body.removeClass('portrait landscape').addClass('portrait');
				} else if (orientation === 180){
					elements.body.removeClass('portrait landscape').addClass('portrait');
				} else if (orientation === 90){
					elements.body.removeClass('portrait landscape').addClass('landscape');
				} else if (orientation === -90){
					elements.body.removeClass('portrait landscape').addClass('landscape');
				}
			}
			
			orientationChanged(window.orientation);
			
			window.onorientationchange = function(){
				var orientation = window.orientation;
				orientationChanged(orientation)
			};
		}
		
		init();
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.BrowserDetection = BrowserDetection;
	
}(this, this.jQuery));