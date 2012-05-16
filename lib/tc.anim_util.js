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

(function(window) {
	
	var NI = window.NI,
	    TWO_PI = 2*window.Math.PI;
	
	var requestAnimFrame = (function() {
		var fn;
		
		fn = window.requestAnimationFrame       || 
		     window.webkitRequestAnimationFrame || 
		     window.mozRequestAnimationFrame    || 
		     window.oRequestAnimationFrame      || 
		     window.msRequestAnimationFrame     || 
		     function(/* function */ callback, /* DOMElement */ element){
		     	window.setTimeout(callback, 1000 / 60);
		     };
		
		return function() {
			fn.apply(window, arguments);
		};
		
	}());
	
	function Cycler(options) {
		
		var me, o, internal;
		
		me = this;
		o = $.extend({
			speed: window.Math.PI / 600,
			cycling: false,
			
			// callbacks
			on_play: $.noop,
			on_pause: $.noop,
			on_before_update: $.noop, //return false to cancel an update
			on_update: $.noop,
			on_cycle_complete: $.noop
		}, options);
		
		function init() {
			internal = {
				cycling: false,
				theta: 0,
				speed: null
			};
			me.setSpeed(o.speed);
			me[o.cycling ? "play" : "pause"]();
		}
		
		function loop() {
			if (internal.cycling) {
				requestAnimFrame(loop);
			} else {
				return;
			}
			if (o.on_before_update.apply(me) !== false) {
				internal.theta += internal.speed;
				if (internal.theta >= TWO_PI) {
					internal.theta -= TWO_PI;
					o.on_cycle_complete.apply(me);
				}
				o.on_update.apply(me, [internal.theta]);
			}
		}
		
		this.play = function() {
			if (!internal.cycling) {
				o.on_play.apply(me);
				internal.cycling = true;
				loop();
			}
			return this;
		};
		
		this.pause = function() {
			internal.cycling = false;
			o.on_pause.apply(me);
			return this;
		};
		
		this.isCycling = function() {
			return internal.cycling;
		};
		
		this.reset = function() {
			internal.theta = 0;
			return this;
		};
		
		this.setSpeed = function(speed) {
			if (typeof speed === "number") {
				internal.speed = speed;
			}
			return this;
		};
		
		init();
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	NI.anim = NI.anim || {};
	NI.anim.requestAnimFrame = requestAnimFrame;
	NI.anim.Cycler = Cycler;

}(this));
