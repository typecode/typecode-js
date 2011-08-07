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
                         From 2010 till ∞     */

(function(window, $) {
	
	var NI = window.NI;
	    
	function Animator(options) {
		var o, internal, animations, running;
		
		o = $.extend({
			preCalculate: false,
			fps:30
		}, options);
		
		internal = {
			interval:0.0
		}
		
		animations = [];
		finished_animations = [];
		
		function init(){
			internal.interval = 1000/o.fps;
		}
		
		function start(){
			running = true;
			setTimeout(run,internal.interval);
		}
		
		function run(){
			var i, n_animations;
						
			if(!animations.length){
				astop();
				return;
			}
			
			for(i in animations){
				//Check duration;
				if(!animations[i].start_time){
					animations[i].start_time = Date.now();
				} else {
					animations[i].pct = (Date.now() - animations[i].start_time) / animations[i].duration;
					if(animations[i].pct > 1){
						if(animations[i].finish){
							animations[i].finish(animations[i]);
						}
						finished_animations.push(animations[i]);
						animations.splice(i);
						continue;
					}
				}
				
				if(animations[i].func){
					animations[i].func(animations[i]);
				}
			}
			
			setTimeout(run,internal.interval);
		}
		
		function astop(){
			running = false;
		}
		
		//Public
		this.addAnimation = function(name,animation){
			animation.pct = 0;
			animation.start_time = null;
			animations.push(animation);
			if(!running){
				start();
			}
		};
		
		init();
		return this;
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Animator = Animator;
	
}(this, this.jQuery));