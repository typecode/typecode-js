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
		
		this.pause = function(reset) {
			internal.cycling = false;
			o.on_pause.apply(me);
			if (reset) {
				internal.theta = 0;
			}
			return this;
		};
		
		this.isCycling = function() {
			return internal.cycling;
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
