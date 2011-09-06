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

if(!tc){ var tc = {}; }

(function(tc) {
	if(!tc.particle){ tc.particle = {}; }
	
	
	tc.particle.context = function(app,dom,options){
		var _me, o;
		_me = dom;
		
		o = $.extend({
			fps:30,
			bounds: {
				min_x: 0,
				max_x: 1000,
				min_y: 0,
				max_y: 1000
			},
			bg_image:null
		},options);
		
		this.initialize = function(){
			_me.context = _me.get(0).getContext('2d');
			_me.forces = [];
			_me.particles = [];
			_me.frame = 0;
			_me.stopped = true;
			_me.paused = false;
			_me.timer = null;
			_me.mouse_pos = null;
			_me.mouse_down_pos = null;
			
			_me.bounds = o.bounds;
			_me.net_energy = 0;
			if(o.bg_image){
				_me.bg_image = new Image();
				_me.bg_image.src = o.bg_image;
			}
			return _me;
		}
		
		_me.setSize = function(size){
			_me.bounds = {
				min_x: 0,
				max_x: size.width,
				min_y: 0,
				max_y: size.height 
			};
			_me.css(size).attr('width',size.width).attr('height',size.height);
			_me.anchor_offset = {
				x:size.width/2,
				y:90
			}
			for(i = 0; i < _me.particles.length; i++){
				_me.particles[i]['set_anchor_offset'](_me.anchor_offset);
			}
		}
		
		_me.add_particle = function(particle){
			_me.particles.push(particle);
			return _me.particles[_me.particles.length-1];
		}
		
		_me.add_global_force = function(pos, strength, radius){
			var force;
			if(pos.x && pos.y){
				force = {
					pos:Vector.create([pos.x,pos.y]),
					strength:strength,
					radius:radius
				};
				_me.forces.push(force);
				return _me.forces[_me.forces.length-1];
			}
		}
		
		_me.update = function(){
			_me.frame++;
			_me.net_energy = 0;
			for(i = 0; i < _me.forces.length; i++){
				_me.forces[i].radius = (_me.forces[i].radius * 0.98);
			}
			_me.timer = setTimeout(_me.update,(1000/o.fps));
			if(!_me.stopped){
				for(i = 0; i < _me.particles.length; i++){
					_me.particles[i]['reset_forces']();
					_me.particles[i]['add_forces'](_me.forces);
					_me.particles[i]['bounce_off_walls'](_me.bounds);
					_me.particles[i]['handle_anchor']();
					//_me.particles[i]['collide_with_particles'](_me.particles,i);
					_me.particles[i]['add_damping']();
					_me.particles[i]['update']();
					_me.net_energy = _me.net_energy + _me.particles[i].norm_dist_from_anchor;
				}
			}
			_me.net_energy = _me.net_energy / _me.particles.length;
			_me.mouse_down_pos = null;
			_draw();
		}
		
		_me.isPaused = function(){
			return _paused;
		}
		
		_me.start = function(){
			_me.paused = false;
			_me.mouse_pos = null;
			_me.mouse_down_pos = null;
			if(_me.stopped){
				_me.stopped = false;
				_me.timer = setTimeout(_me.update,(1000/o.fps));
			}
		}
		
		_me.pause = function(){
			_me.paused = true;
		}
		
		_me.stop = function(){
			_me.stopped = true;
			//_me.timer.cancel();
			clearTimeout(_me.timer);
		}
		
		function _draw(){
			var opacity, i, alpha;
			
			_me.context.globalAlpha = 1;
			_me.context.fillStyle = 'rgba(252,252,252,0.45)';
			_me.context.fillRect(
				0,
				0,
				_me.bounds.max_x,
				_me.bounds.max_y
			);
			
			if(_me.net_energy < 0.2 && _me.bg_image){
				opacity = (0.2/(_me.net_energy < 0.01 ? 0.01 : _me.net_energy)/20);
				_me.context.globalAlpha = opacity - 0.01;
				_me.context.drawImage(
					_me.bg_image,
					_me.anchor_offset.x-358,
					_me.anchor_offset.y
				);
			}
			
			if(opacity){
				alpha = 1 - opacity + 0.01;
			} else {
				alpha = 1;
			}
			
			_me.context.globalAlpha = alpha;
			
			for(i = 0; i < _me.particles.length; i++){
				_me.particles[i].draw(_me.context);
			}
		}
		
		return this.initialize();
	}
	
})(tc);