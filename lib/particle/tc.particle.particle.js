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

if(!tc){ var tc = {}; }

(function(tc) {
	if(!tc.particle){ tc.particle = {}; }
	
	tc.particle.particle = function(options){
		var _me, o, damping, color;
		_me = this;
		
		var pos,
				vel,
				frc;

		color = new NI.Color();
		
		this.options = $.extend({
			pos:{x:0,y:0},
			vel:{x:0,y:0},
			frc:{x:0,y:0},
			anchored:false,
			anchor:{x:0,y:0},
			damping:0.89,
			radius:5,
			draw:function(context){
				context.beginPath();
				context.arc(this.pos.elements[0], this.pos.elements[1], this.o.radius, 0, (2*Math.PI), false);
				context.fill();
				context.closePath();
			},
			color:"000000",
			opacity:0.65,
			attraction_coefficient: 1.0,
			data:{},
			anchor_offset:{
				x:0,
				y:0
			}
		},options);
		
		o = this.options;
		
		this.initialize = function(){
			_me.pos = Vector.create([o.pos.x, o.pos.y]);
			vel = Vector.create([o.vel.x, o.vel.y]);
			frc = Vector.create([o.frc.x, o.frc.y]);
			_me.anchor = Vector.create([
				(0+o.anchor.x+o.anchor_offset.x),
				(0+o.anchor.y+o.anchor_offset.y)
			]);
			_me.radius = o.radius;
			_me.diameter = o.radius*2;
			if(_me.options.opacity < 1.0){
				_me.fill = "rgba("+color.getRGBFromHex('r',o.color)+","+color.getRGBFromHex('g',o.color)+","+color.getRGBFromHex('b',o.color)+","+o.opacity+")";
			} else {
				_me.fill = "#"+o.color;
			}
			_me.jitter = null;
			_me.norm_dist_from_anchor = 0;
		}
		
		_me.set_anchor_offset = function(offset){
			_me.anchor.elements[0] = (0+o.anchor.x+offset.x);
			_me.anchor.elements[1] = (0+o.anchor.y+offset.y);
		}
		
		_me.worker = function(new_worker){
			if(new_worker){
				_me.worker = new_worker;
			} else {
				return _me.worker;
			}
		}
		
		_me.name = function(new_name){
			if(new_name){
				_me.options.name = new_name;
			} else {
				return _me.options.name;
			}
		}
		
		_me.pos = function(new_pos){
			if(new_pos){
				_me.pos = new_pos;
			} else {
				return _me.pos;
			}
		}
		
		_me.vel = function(new_vel){
			if(new_vel){
				vel = new_vel;
			} else {
				return vel;
			}
		}
		
		_me.frc = function(new_frc){
			if(new_frc){
				frc = new_frc;
			} else {
				return frc;
			}
		}
		
		_me.radius = function(new_radius){
			if(new_radius){
				_me.options.radius = new_radius;
			} else {
				return _me.options.radius;
			}
		}
		
		_me.reset_forces = function(){
			frc.setElements([0, 0]);
			damping = _me.options.damping;
		}
		
		_me.add_forces = function(forces){
			var distance, length, pct, normal_distance;
			for(var i = 0; i < forces.length; i++){
				distance = _me.pos.subtract(forces[i].pos);
				length = Math.sqrt(distance.dot(distance));
				if(length < forces[i].radius){
					pct = (1 - (length / forces[i].radius)) * 20/o.radius ;
					normal_distance = distance.multiply(1/length);
					frc.elements[0] = frc.elements[0] - normal_distance.elements[0] * 
						forces[i].strength * pct * o.attraction_coefficient;
					frc.elements[1] = frc.elements[1] - normal_distance.elements[1] * 
						forces[i].strength * pct * o.attraction_coefficient;
				}
			}
		}
		
		_me.bounce_off_walls = function(bounds){
			var b_did_i_collide;
			b_did_i_collide = false;
			
			if(_me.pos.elements[0] < bounds.min_x + o.radius){
				_me.pos.elements[0] = o.radius;
				b_did_i_collide = true;
				vel.elements[0] = vel.elements[0] * -1.0;
			}else if(_me.pos.elements[0] > bounds.max_x - o.radius){
				_me.pos.elements[0] = bounds.max_x - o.radius;
				b_did_i_collide = true;
				vel.elements[0] = vel.elements[0] * -1.0;
			}
			
			if(_me.pos.elements[1] < bounds.min_y + o.radius){
				_me.pos.elements[1] = o.radius;
				b_did_i_collide = true;
				vel.elements[1] = vel.elements[1] * -1.0;
			}else if(_me.pos.elements[1] > bounds.max_y - o.radius){
				_me.pos.elements[1] = bounds.max_y - o.radius;
				b_did_i_collide = true;
				vel.elements[1] = vel.elements[1] * -1.0;
			}
			
			if(b_did_i_collide){
				vel = vel.multiply(0.3);
			}
		}
		
		_me.handle_anchor = function(){
			if(!_me.anchor){ return; }
			var distance, length, pct, normal_distance;
			distance = _me.pos.subtract(_me.anchor);
			length = Math.sqrt(distance.dot(distance));
			
			if(length <= 0.5){
				return;
			}
			
			pct = (length / 1000);
			normal_distance = distance.multiply(1/length);
			_me.norm_dist_from_anchor = (length / 100);
			frc.elements[0] = frc.elements[0] - normal_distance.elements[0] * 10 * pct;
			frc.elements[1] = frc.elements[1] - normal_distance.elements[1] * 10 * pct;
		}
		
		_me.collide_with_particles = function(particles,j){
			for(var i = 0; i < particles.length; i++){
				if(i != j){
					var distance = _me.pos.subtract(particles[i].pos)
					var length = Math.sqrt(distance.dot(distance))
					if(length < (o.radius + particles[i].radius())+2){
						var pct = 1 - (length / (o.radius + particles[i].radius() + 2))
						var normal_distance = distance.multiply((1/(length/4)))
						frc.elements[0] = frc.elements[0] - normal_distance.elements[0] * -0.7// * pct
						frc.elements[1] = frc.elements[1] - normal_distance.elements[1] * -0.7// * pct
					}
				}
			}
		}
		
		_me.stop = function(){
			frc.setElements([0, 0])
			vel.setElements([0, 0])
		}
		
		_me.add_damping = function(){
			vel = vel.multiply(damping);
		}
		
		_me.update = function(){
			vel = vel.add(frc);
			_me.pos = _me.pos.add(vel);
			if(_me.jitter){
				_me.pos.elements[0] += _me.jitter.x;
				_me.pos.elements[1] += _me.jitter.y;
				_me.jitter = null;
			}
		}
		
		_me.draw = function(context){
			this.options.draw.call(_me,context);
		}
		
		return this.initialize();
	}
})(tc);
