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
	
	function Animator(options) {
		var o, internal, animations, finished_animations, running;
		
		o = $.extend({
			preCalculate: false,
			fps:30
		}, options);
		
		internal = {
			interval:0.0
		};
		
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
		
		this.addAnimation = function(name,animation){
			animation.pct = 0;
			animation.start_time = null;
			animations.push(animation);
			if(!running){
				start();
			}
		};
		
		init();
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Animator = Animator;
	
});