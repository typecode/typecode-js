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
		var raf;
		
		raf = window.requestAnimationFrame       || 
		      window.webkitRequestAnimationFrame || 
		      window.mozRequestAnimationFrame    || 
		      window.oRequestAnimationFrame      || 
		      window.msRequestAnimationFrame     || 
		      function(/* function */ callback, /* DOMElement */ element){
		      	window.setTimeout(callback, 1000 / 60);
		      };
		
		return function() {
			raf.apply(window, arguments);
		};
		
	}());
	
	function Cycler(options) {
		
		var me, o, theta, cycling;
		
		me = this;
		o = $.extend({
			speed: 0.06,
			cycling: false,
			
			// callbacks
			on_play: $.noop,
			on_pause: $.noop,
			on_before_update: $.noop, //return false to cancel an update
			on_update: $.noop,
			on_cycle_complete: $.noop
		}, options);
		
		function init() {
			cycling = false;
			theta = 0;
			me[o.cycling ? "play" : "pause"]();
		}
		
		function loop() {
			if (cycling) {
				requestAnimFrame(loop);
			} else {
				return;
			}
			if (o.on_before_update.apply(me) !== false) {
				theta += o.speed;
				if (theta >= TWO_PI) {
					theta -= TWO_PI;
					o.on_cycle_complete.apply(me);
				}
				o.on_update.apply(me, [theta]);
			}
		}
		
		this.play = function() {
			if (!cycling) {
				o.on_play.apply(me);
				cycling = true;
				loop();
			}
			return this;
		};
		
		this.pause = function() {
			cycling = false;
			o.on_pause.apply(me);
			return this;
		};
		
		this.isCycling = function() {
			return cycling;
		};
		
		this.toggle = function() {
			if (cycling) {
				return this.pause();
			}
			return this.play();
		};
		
		init();
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	NI.anim = NI.anim || {};
	NI.anim.requestAnimFrame = requestAnimFrame;
	NI.anim.Cycler = Cycler;

}(this));
