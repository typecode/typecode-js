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
	
	function Tooltip(options) {
		
		var o = $.extend({
			triggers: $('.tooltip_trigger'),
			trigger_class:null,
			tooltip:null,
			markup_generator:null,
			animate_slide:false,
			animate_opacity:true,
			offset_left:0,
			offset_top:10,
			use_mousepos:true,
			positions:['top','right','bottom','left'],
			container:$(window)
		}, options);
		
		var internal = {
			window:$(window),
			tooltip:o.tooltip,
			triggers:o.triggers,
			has_been_shown:false,
			current_trigger:null,
			current_trigger_id:null,
			cache:{},
			animating:false,
			visible:false,
			mousepos:null,
		}
		
		function init(me){
			internal.triggers.bind('mouseover',{me:this},handlers.trigger_mouseover);
			internal.triggers.bind('mouseout',{me:this},handlers.trigger_mouseout);
			internal.tooltip.bind('mouseover',{me:this},handlers.tooltip_mouseover);
			internal.tooltip.bind('mouseout',{me:this},handlers.tooltip_mouseout);
			if(o.use_mousepos){
				$(document).bind('mousemove',function(e,d){
					if(d && d.mousepos){
						internal.mousepos = d.mousepos;
					} else {
						internal.mousepos = {
							x:e.pageX,
							y:e.pageY
						};
					}
				});
			}
		};
		
		function markup_generator(data){
			var output;
			output = $((data ? data : '<p>No Data.</p>'));
			return $('<div>').append(output).html();
		};
		
		function show(data){
			internal.tooltip.html(($.isFunction(o.markup_generator) ? o.markup_generator(data) : markup_generator(data)));
			move_to_target(calculate_target_position());
		};
		
		function get_source_position(){
			if(o.use_mousepos){
				return {
					top: internal.mousepos.y,
					left: internal.mousepos.x
				};
			} else {
				return {
					left: internal.current_trigger.offset().left,
					top: internal.current_trigger.offset().top
				};
			}
		}
		
		function get_trigger_size(){
			if(o.use_mousepos){
				return {
					width:0,
					height:0
				};
			} else {
				return {
					left: internal.current_trigger.width(),
					top: internal.current_trigger.heigh()
				};
			}
		}
		
		function get_tooltip_size(){
			return {
				height:internal.tooltip.height(),
				width:internal.tooltip.width()
			}
		}
		
		var calculate_position = {
			top:function(sp,trs,tts){
				return {
					top:(sp.top - (tts.height) - o.offset_top),
					left:((sp.left + (trs.width/2)) - (tts.width/2) + o.offset_left)
				};
			},
			bottom:function(sp,trs,tts){
				return {
					top:(sp.top + trs.height + o.offset_top),
					left:((sp.left + (trs.width/2)) - (tts.width/2) + o.offset_left)
				};
			},
			right:function(sp,trs,tts){
				var pos;
				pos = {
					top: (sp.top + (trs.height/2) - (tts.height/2)),
					left: (sp.left + (trs.width) + o.offset_top)
				}
				return pos;
			},
			left:function(sp,trs,tts){
				var pos;
				pos = {
					top: (sp.top + (trs.height/2) - (tts.height/2)),
					left: (sp.left - (tts.width) - o.offset_top)
				}
				return pos;
			}
		}
		
		function get_edge_collisions(tp, tts){
			var collisions;
			collisions = [];
			
			//check top
			if((tp.top - internal.window.scrollTop()) < 0){
				collisions.push('top');
			}
			
			//check bottom
			if((tp.top + tts.height) > internal.window.height()){
				collisions.push('bottom');
			}
			
			//check left
			if((tp.left - internal.window.scrollLeft()) < 0){
				collisions.push('left');
			}
			
			//check right
			if((tp.left + tts.width) > internal.window.width()){
				collisions.push('right');
			}
			
			return collisions;
		}
		
		function calculate_target_position(){
			var source_position, trigger_size, tooltip_size, i, target_position;
			source_position = get_source_position();
			trigger_size = get_trigger_size();
			tooltip_size = get_tooltip_size();
			for(i in o.positions){
				if($.isFunction(calculate_position[o.positions[i]])){
					target_position = calculate_position[o.positions[i]](source_position, trigger_size, tooltip_size);
				}
				if(!get_edge_collisions(target_position, tooltip_size).length){
					return target_position;
				}
			}
			return target_position;
		}
		
		function move_to_target(target_pos){
			var me, css_change, animate_change;
			me = this;
			switch(target_pos.tooltip_orientation){
				case 'top':
					internal.tooltip.removeClass('flipped');
					break;
				case 'left':
					
					break;
				case 'bottom':
				default:	
					internal.tooltip.addClass('flipped');
					break;
				case 'right':
					
					break;
			}
			
			css_change = {};
			animate_change = {};
			
			if(o.animate_slide){
				animate_change.top = target_pos.top;
				animate_change.left = target_pos.left;
			} else {
				css_change.top = target_pos.top;
				css_change.left = target_pos.left;
			}
			
			if(o.animate_opacity){
				if(!internal.has_been_shown){
					css_change.opacity = '0.0';
				}
				animate_change.opacity = '1.0';
			} else {
				css_change.opacity = '1.0';
			}
			
			internal.animating = true;
			internal.tooltip.stop().show().css(css_change).animate(animate_change,500,'easeOutCubic',function(){
				internal.animating = false;
				internal.visible = true;
			});
			internal.has_been_shown = true;
		};

		function hide(){
			internal.animating = true;
			internal.visible = false;
			internal.tooltip.stop().animate({
				'opacity':0.0
			},200,'easeOutCirc',function(){
				$(this).hide();
				internal.animating = false;
				internal.current_trigger = null;
			});
		};
		
		var handlers = {
				trigger_mouseover:function(e){
					internal.current_trigger = $(this);
					show();
				},
				trigger_mouseout:function(e){
					if(!$.contains(this,e.target)){
						hide();
					}
				},
				tooltip_mouseover:function(e){
					if(!o.use_mousepos && internal.current_trigger && !internal.visible){
						show();
					}
				},
				tooltip_mouseout:function(e,d){
					
					if(!((this == e.target) && (this == e.relatedTarget))){
						if((!$.contains(this,e.target) && $.contains(this,e.relatedTarget)) ||
								($.contains(this,e.target) && !$.contains(this,e.relatedTarget))){
							hide();	
						}
					}
						
				}
		};
		
		this.add_trigger = function(trigger){
			trigger.bind('mouseover', {me:this}, this.handlers.trigger_mouseover);
			trigger.bind('mouseout', {me:this}, this.handlers.trigger_mouseout);
			if(!internal.triggers.length){
				internal.triggers = trigger;
			} else {
				internal.triggers.add(trigger);
			}
		};
		
		this.clear_triggers = function(trigger){
			internal.triggers.each(function(i,j){
				$(j).unbind('mouseover').unbind('mouseout');
			});
			internal.triggers = $({});
		};
		
		this.show_tooltip = function(_options){
			var _o = $.extend({
				trigger:null,
				data:null
			},_options);
			
			if(!_o.trigger){
				return false;
			}
			
			internal.current_trigger = _o.trigger;
			internal.tooltip.stop();
			show(_o.data);
		}
		
		this.hide_tooltip = function(){
			internal.tooltip.stop();
			hide();
		}
		
		this.get_tooltip = function(){
			return internal.tooltip;
		}
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Tooltip = Tooltip;
	
}(this, this.jQuery));