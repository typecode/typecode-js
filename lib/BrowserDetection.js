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

From 2010 till infinity
typecode-js v 0.1
*/

define(['jquery', 'NIseed'], function($) {

	var window = this,
	NI = window.NI;

	function BrowserDetection(options) {
		var o, elements;

		o = $.extend({
			orientation_listen: false,
			detect_touch:       true
		}, options);

		elements = {
			body:$('body')
		};

		function init(){
			var userAgent = navigator.userAgent;
			var appVersion = navigator.appVersion;
			var browser = {};

			browser.mozilla = /mozilla/.test(userAgent.toLowerCase()) && !/webkit/.test(userAgent.toLowerCase());
			browser.webkit = /webkit/.test(userAgent.toLowerCase());
			browser.opera = /opera/.test(userAgent.toLowerCase());
			browser.msie = /msie/.test(userAgent.toLowerCase());

			// check if browser is webkit...
			if (browser.webkit) {
				if(o.add_class_to_body){
					elements.body.addClass('browser-webkit');
				}

				// check if it's chrome, safari, or an iOS browser
				if (userAgent.match(/iPad/i) !== null) {
					elements.body.addClass('browser-ipad os-ios');
					if (window.navigator.standalone) {
						elements.body.addClass('ios-webapp');
					}
					if(o.orientation_listen){
						listenToOrientationChange();
					}
				} else if(userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
					elements.body.addClass('browser-iphone os-ios');
					if (window.navigator.standalone) {
						elements.body.addClass('ios-webapp');
					}
					if(o.orientation_listen){
						listenToOrientationChange();
					}
				} else if(userAgent.match(/Chrome/i)) {
					elements.body.addClass('browser-chrome');
				} else if(userAgent.match(/Safari/i)) {
					elements.body.addClass('browser-safari');
				}

			// ...if browser is NOT webkit, run through the other browsers
			} else {
				if (browser.msie) {
					elements.body.addClass('browser-ie');
				} else if (browser.mozilla) {
					elements.body.addClass('browser-firefox');
				} else if (browser.opera) {
					elements.body.addClass('browser-opera');
				}
			}

			// detect operating systems
			if (appVersion.indexOf("Mac")!=-1) {
				elements.body.addClass('os-mac');
			} else if (appVersion.indexOf("Win")!=-1) {
				elements.body.addClass('os-win');
			} else if (appVersion.indexOf("X11")!=-1) {
				elements.body.addClass('os-unix');
			} else if (appVersion.indexOf("Linux")!=-1) {
				elements.body.addClass('os-linux');
			} else {
				elements.body.addClass('os-unknown');
			}

			// detect touch
			if (o.detect_touch) {
				if (!!('ontouchstart' in window) || !!('onmsgesturechange' in window)) {
					elements.body.addClass('feature-touch');
				}
			}


		}


		function listenToOrientationChange() {

			function changed(orientation) {
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

			changed(window.orientation);

			window.onorientationchange = function(){
				var orientation = window.orientation;
				changed(orientation);
			};
		}

		init();
	}

	NI.BrowserDetection = BrowserDetection;

	return BrowserDetection;

});