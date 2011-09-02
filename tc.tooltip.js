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
			animate_slide:true,
			animate_opacity:true,
			offset_left:0,
			offset_top:0,
			use_mousepos:true,
			positions:['top','right','bottom','left'],
			container:$('body'),
			hide_delay:200
		}, options);
		
		var internal = {
			window:$(window),
			tooltip:(o.tooltip ? o.tooltip : $('<div class="tooltip"></div>').appendTo($('body'))),
			tooltip_content:null,
			tails:null,
			triggers:o.triggers,
			has_been_shown:false,
			current_trigger:null,
			current_trigger_id:null,
			cache:{},
			animating:false,
			visible:false,
			mousepos:null,
			visibility_timer:null
		};
		
		function init(me){
			internal.triggers.bind('mouseover', {me:me}, handlers.trigger_mouseover);
			internal.triggers.bind('mouseout', {me:me}, handlers.trigger_mouseout);
			internal.tooltip.bind('mouseover', {me:me}, handlers.tooltip_mouseover);
			internal.tooltip.bind('mouseout', {me:me}, handlers.tooltip_mouseout);
			internal.tooltip.css({
				'overflow':'visible'
			});
			generate_tails();
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
		
		function generate_tails(){
			var i, my_tail;
			
			var css_fn = {
				top:function(container){
					return {
						//'border':'1px solid red',
						'width':'100%',
						//'bottom': '-' + (container.children('.tooltip-tail').css('height')),
						'bottom' : (0) + 'px',
						'left': (0) + 'px'
					};
				},
				right:function(container){
					return {
						//'border':'1px solid green',
						'height':'100%',
						'top': (0) + 'px',
						'left': '-' + (container.children('.tooltip-tail').css('width'))
						//'left' : (0) + 'px'
					};
				},
				bottom:function(container){
					return {
						//'border':'1px solid yellow',
						'width':'100%',
						'top': '-' + (container.children('.tooltip-tail').css('height')),
						//'top' : (0) + 'px',
						'left': (0) + 'px'
					};
				},
				left:function(container){
					return {
						//'border':'1px solid blue',
						'height':'100%',
						'top': (0) + 'px',
						//'right': '-' + (container.children('.tooltip-tail').css('width'))
						'right' : (0) + 'px'
					};
				}
			}
			
			for(i in o.positions){
				my_tail = $('<div class="tooltip-tail-container ' + o.positions[i] + '"><div class="tooltip-tail" style="display:block;position:absolute;"></div></div>');
				internal.tooltip.append(my_tail);
				my_tail.css($.extend(css_fn[o.positions[i]](my_tail),{
					'position':'absolute',
					'zIndex':100
				}));
			}
			internal.tails = internal.tooltip.find('.tooltip-tail-container');
			
			internal.tooltip_content = $('<div></div>');
			internal.tooltip.append(internal.tooltip_content);
		}
		
		function markup_generator(data){
			var output;
			output = $((data ? data : '<p>No Data.</p>'));
			return $('<div>').append(output).html();
		};
		
		function show(data){
			//internal.tooltip.html(($.isFunction(o.markup_generator) ? o.markup_generator(data) : markup_generator(data)));
			internal.tooltip_content.html(($.isFunction(o.markup_generator) ? o.markup_generator(data) : markup_generator(data)));
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
					top: internal.current_trigger.height()
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
					className:'top',
					top:(sp.top - (tts.height) - o.offset_top - (get_tail('top') ? get_tail('top').height() : 0)),
					left:((sp.left + (trs.width/2)) - (tts.width/2) + o.offset_left)
				};
			},
			bottom:function(sp,trs,tts){
				return {
					className:'bottom',
					top:(sp.top + trs.height + o.offset_top + (get_tail('bottom') ? get_tail('bottom').height() : 0) ),
					left:((sp.left + (trs.width/2)) - (tts.width/2) + o.offset_left)
				};
			},
			right:function(sp,trs,tts){
				return {
					className:'right',
					top: (sp.top + (trs.height/2) - (tts.height/2)),
					left: (sp.left + (trs.width) + o.offset_top + (get_tail('right') ? get_tail('right').width() : 0))
				};
			},
			left:function(sp,trs,tts){
				return {
					className:'left',
					top: (sp.top + (trs.height/2) - (tts.height/2)),
					left: (sp.left - (tts.width) - o.offset_top - (get_tail('left') ? get_tail('left').width() : 0))
				};
			}
		}
		
		function get_tail(position){
			var tail;
			tail = internal.tails.filter('.'+position).children('.tooltip-tail');
			if(tail.length){
				return tail;
			}
			return null;
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
			tail = get_tail();
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
			
			internal.tooltip.removeClass('position-top position-right position-bottom position-left').addClass('position-' + target_pos.className);
			internal.tails.css('visibility','hidden').filter('.' + target_pos.className).css('visibility','visible');
			
			css_change = {};
			animate_change = {};
			
			tail_css_change = {};
			tail_animate_change = {};
			
			if(o.animate_slide){
				animate_change.top = target_pos.top;
				animate_change.left = target_pos.left;
				switch(target_pos.className){
					case 'top':
					case 'bottom':
						tail_animate_change.left = (internal.tooltip.width()/2) - o.offset_left - (get_tail(target_pos.className).width()/2);
						break;
					case 'left':
					case 'right':
						tail_animate_change.top = (internal.tooltip.height()/2) + o.offset_top - (get_tail(target_pos.className).height()/2);
						break;
				}
			} else {
				css_change.top = target_pos.top;
				css_change.left = target_pos.left;
				switch(target_pos.className){
					case 'top':
					case 'bottom':
						tail_css_change.left = (internal.tooltip.width()/2) - o.offset_left - (get_tail(target_pos.className).width()/2);
						break;
					case 'left':
					case 'right':
						tail_css_change.top = (internal.tooltip.height()/2) + o.offset_top - (get_tail(target_pos.className).height()/2);
						break;
				}
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
			get_tail(target_pos.className).css(tail_css_change).stop(true).show().animate(tail_animate_change,500,'easeOutCubic',function(){});
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
					if(internal.visibility_timer){
						clearTimeout(internal.visibility_timer);
					};
					internal.current_trigger = $(this);
					show();
				},
				trigger_mouseout:function(e){
					if(internal.visibility_timer){
						clearTimeout(internal.visibility_timer);
					};
					if(!$.contains(this,e.target)){
						internal.visibility_timer = setTimeout(hide,o.hide_delay);
						//hide();
					}
				},
				tooltip_mouseover:function(e){
					if(internal.visibility_timer){
						clearTimeout(internal.visibility_timer);
					};
					if(!o.use_mousepos && internal.current_trigger && !internal.visible){
						show();
					}
				},
				tooltip_mouseout:function(e,d){
					if(internal.animating){
						return;
					}
					if(internal.visibility_timer){
						clearTimeout(internal.visibility_timer);
					};
					if(!((this == e.target) && (this == e.relatedTarget))){
						if((!$.contains(this,e.target) && $.contains(this,e.relatedTarget)) ||
								($.contains(this,e.target) && !$.contains(this,e.relatedTarget))){
							internal.visibility_timer = setTimeout(hide,o.hide_delay);
							//hide();	
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
			
			if(internal.visibility_timer){
				clearTimeout(internal.visibility_timer);
			};
			
			internal.current_trigger = _o.trigger;
			internal.tooltip.stop();
			show(_o.data);
		}
		
		this.hide_tooltip = function(delay){
			if(internal.visibility_timer){
				clearTimeout(internal.visibility_timer);
			};
			internal.visibility_timer = setTimeout(hide,(delay ? delay : o.hide_delay));
		}
		
		this.get_tooltip = function(){
			return internal.tooltip;
		}
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Tooltip = Tooltip;
	
}(this, this.jQuery));