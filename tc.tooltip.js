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
			offset_top:0
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
			visible:false
		}
		
		function init(me){
			internal.triggers.bind('mouseover',{me:this},handlers.trigger_mouseover);
			internal.triggers.bind('mouseout',{me:this},handlers.trigger_mouseout);
			internal.tooltip.bind('mouseover',{me:this},handlers.tooltip_mouseover);
			internal.tooltip.bind('mouseout',{me:this},handlers.tooltip_mouseout);
		};
		
		function markup_generator(data){
			var output;
			output = $((data ? data : '<p>No Data.</p>'));
			return $('<div>').append(output).html();
		};
		
		function show(data){
			if(internal.current_trigger.attr('id') != internal.current_trigger_id){
				internal.current_trigger_id = internal.current_trigger.attr('id');
			}
			
			if(!internal.cache[internal.current_trigger_id]){
				internal.cache[internal.current_trigger_id] = ($.isFunction(o.markup_generator) ? o.markup_generator(data) : markup_generator(data));
			}
			internal.tooltip.html(internal.cache[internal.current_trigger_id]);
			
			move_to_target((function(){
				var target_position;
				target_position = {
					tooltip_orientation:'top',
					top:0,
					left:0
				};
				target_position.left = (internal.current_trigger.offset().left
					+ ((internal.current_trigger.get(0).getBoundingClientRect().right - internal.current_trigger.get(0).getBoundingClientRect().left) / 2) - (internal.tooltip.width()/2)
					+ o.offset_left
				);
				
				if((internal.current_trigger.offset().top - internal.window.scrollTop()) < internal.tooltip.height()){
					target_position.tooltip_orientation = 'bottom';
					target_position.top = (	internal.current_trigger.offset().top
						+ (internal.current_trigger.get(0).getBoundingClientRect().bottom - internal.current_trigger.get(0).getBoundingClientRect().top)
						- o.offset_top
					);
				} else {
					target_position.tooltip_orientation = 'top';
					target_position.top = (internal.current_trigger.offset().top
						- internal.tooltip.height()
						+ o.offset_top
					);
				}
				
				return target_position;
			})());
		};
		
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
					var t, rt;
					t = e.target;
					rt = (e.relatedTarget) ? e.relatedTarget : e.toElement;
					if(rt){
						while(rt != t && rt.nodeName != 'BODY'){
							rt = rt.parentNode;
							if(!rt || rt == t){
								return;
							}
						}
					}
					hide();
				},
				tooltip_mouseover:function(e){
					if(internal.current_trigger && !internal.visible){
						show();
					}
				},
				tooltip_mouseout:function(e){
					console.log('tooltip_mouseout');
					var t, rt;
					t = e.target;
					rt = (e.relatedTarget) ? e.relatedTarget : e.toElement;
					if(rt){
						while(rt != t && rt.nodeName != 'BODY'){
							rt = rt.parentNode;
							if(!rt || rt == t){
								return;
							}
						}
					}
					hide();
				}
		};
		
		this.add_trigger = function(trigger){
			trigger.bind('mouseover', {me:this}, this.handlers.trigger_mouseover);
			trigger.bind('mouseout', {me:this}, this.handlers.trigger_mouseout);
			tc.util.dump(trigger);
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
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Tooltip = Tooltip;
	
}(this, this.jQuery));