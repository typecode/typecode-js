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


	(function requestAnimationFrame() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = 
			window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		}
	
		if(!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if(!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}());

	if(!tc.particle){ tc.particle = {}; }
	
	tc.particle.context = function(dom,options){
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
			var i;
			_me.context = _me.get(0).getContext('2d');
			_me.forces = [];
			_me.particles = [];
			_me.frame = 0;
			_me.stopped = true;
			_me.timer = null;
			_me.mouse_pos = null;
			_me.mouse_down_pos = null;

			_me.display_list = new Array(2);
			_me.n_context_drawn = 0;
			_me.n_context_rendered = 0;

			//resize the display list canvases
			for(i = 0; i < _me.display_list.length; i++){
				_me.display_list[i] = document.createElement('canvas');
			}
			
			_me.bounds = o.bounds;
			_me.net_energy = 0;
			if(o.bg_image){
				_me.bg_image = new Image();
				_me.bg_image.src = o.bg_image;
			}
			return _me;
		};
		
		_me.setSize = function(size){
			var i;
			_me.bounds = {
				min_x: 0,
				max_x: size.width,
				min_y: 0,
				max_y: size.height 
			};
			_me.css(size).attr('width',size.width).attr('height',size.height);

			//resize the display list canvases
			for(i = 0; i < _me.display_list.length; i++){
				_me.display_list[i].width = size.width;
				_me.display_list[i].height = size.height;
			}

			_me.anchor_offset = {
				x:size.width/2,
				y:size.height/3
			};
			for(i = 0; i < _me.particles.length; i++){
				_me.particles[i]['set_anchor_offset'](_me.anchor_offset);
			}
		};
		
		_me.add_particle = function(particle){
			_me.particles.push(particle);
			return _me.particles[_me.particles.length-1];
		};
		
		_me.add_global_force = function(pos, strength, radius){
			var force;
			if(pos.x && pos.y){
				force = {
					//pos:Vector.create([pos.x,pos.y]),
					pos:new tc.vector_2d([pos.x,pos.y]),
					strength:strength,
					radius:radius
				};
				_me.forces.push(force);
				return _me.forces[_me.forces.length-1];
			}
		};
		
		_me.start = function(){
			_me.mouse_pos = null;
			_me.mouse_down_pos = null;
			if(_me.stopped){
				_me.stopped = false;
				_me.update();
				window.requestAnimationFrame(_render);
			}
		};
		
		_me.stop = function(){
			_me.stopped = true;
		};

		_me.update = function context_update(){
			if(_me.stopped){
				window.cancelAnimationFrame();
			} else {
				window.requestAnimationFrame(_me.update);
			}
			
			_me.frame++;
			_me.net_energy = 0;

			for(i = 0; i < _me.forces.length; i++){
				_me.forces[i].radius = (_me.forces[i].radius * 0.98);
			}
			
			for(i = 0; i < _me.particles.length; i++){
				_me.particles[i]['reset_forces']();
				_me.particles[i]['add_forces'](_me.forces);
				//_me.particles[i]['bounce_off_walls'](_me.bounds);
				_me.particles[i]['handle_anchor']();
				//_me.particles[i]['collide_with_particles'](_me.particles,i);
				_me.particles[i]['add_damping']();
				_me.particles[i]['update']();
				_me.net_energy = _me.net_energy + _me.particles[i].norm_dist_from_anchor;
			}
			_me.net_energy = _me.net_energy / _me.particles.length / 10;
			_me.mouse_down_pos = null;
			_me.draw();
		};
		
		_me.draw = function context_draw(callback){
			var my_context, opacity, i, alpha;
			//lets get our context
			my_context = _me.display_list[_me.n_context_drawn%2].getContext('2d');
			
			//draw the background.
			my_context.globalAlpha = 1.0;
			my_context.fillStyle = 'rgba(252,252,252,0.45)';
			my_context.fillRect(0, 0, _me.bounds.max_x, _me.bounds.max_y);
			
			//draw the image if its the thing to do. ie, the particles have little enough energy
			if(_me.net_energy < 0.2 && _me.bg_image){
				opacity = (0.2/(_me.net_energy < 0.01 ? 0.01 : _me.net_energy)/20);
				my_context.globalAlpha = opacity - 0.01;
				my_context.drawImage(
					_me.bg_image,
					_me.anchor_offset.x-358,
					_me.anchor_offset.y
				);
				alpha = 1.01 - opacity;
				my_context.globalAlpha = alpha;
			}
			
			my_context.fillStyle = '#000000';
			for(i = 0; i < _me.particles.length; i++){
				_me.particles[i].draw(my_context);
			}

			_me.n_context_drawn++;
			//window.setTimeout(_me.update, 1);
			_render();
		};

		function _render(){
			

			_me.context.drawImage(_me.display_list[_me.n_context_rendered%2], 0, 0);
			_me.n_context_rendered++;
		};
		
		return this.initialize();
	}
	
})(tc);