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
	NI = window.NI,

	fullscreen = {

		request: function(dom) {
			dom = dom || document.documentElement;
			if (dom.requestFullscreen) {
				dom.requestFullscreen();
			} else if (dom.mozRequestFullScreen) {
				dom.mozRequestFullScreen();
			} else if (dom.webkitRequestFullScreen) {
				dom.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		},

		cancel: function() {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		},

		toggle: function() {
			var fs;

			if (typeof document.fullscreen === 'boolean') {
				fs = document.fullscreen;
			} else if (typeof document.mozFullScreen === 'boolean') {
				fs = document.mozFullScreen;
			} else if (typeof document.webkitIsFullScreen === 'boolean') {
				fs = document.webkitIsFullScreen;
			}

			if (typeof fs === 'boolean') {
				if (fs) {
					this.cancel();
				} else {
					this.request();
				}
			}
		},

		register_change_handler: function(handler, event_data) {
			var guid;
			if (!$.isFunction(handler)) {
				return null;
			}
			if (!event_data || typeof event_data !== 'object') {
				event_data = {};
			}
			guid = NI.fn.guid('fullscreen_');
			$(document).on('fullscreenchange.'+guid +' mozfullscreenchange.'+guid +' webkitfullscreenchange.'+guid, function(e, d) {
				var fullscreen;
				switch (e.type) {
					case 'fullscreenchange':
						fullscreen = document.fullscreen;
						break;
					case 'mozfullscreenchange':
						fullscreen = document.mozFullScreen;
						break;
					case 'webkitfullscreenchange':
						fullscreen = document.webkitIsFullScreen;
						break;
				}
				e.data = $.extend(event_data, {
					fullscreen: fullscreen
				});
				handler.apply(this, [e, d]);
			});
			return guid;
		},

		destroy_change_handler: function(id) {
			var guid = id ? '.'+ id :  '';
			$(document).off('fullscreenchange'+guid +' mozfullscreenchange'+guid +' webkitfullscreenchange'+guid);
		}
	};

	NI.fullscreen = fullscreen;

	return fullscreen;

});