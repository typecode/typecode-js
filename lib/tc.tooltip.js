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

(function(window, $) {
	
	var NI = window.NI;

	// remove "px" from a string representing a css pixel dimension
	// and cast as a Number (i.e. trimpx("10px") returns 10)
	// Used to parse px dimension values from CSS properties,
	// such as "width" and "height"
	function trimPX(s) {
		if (s) {
			return Number(s.substring(0, s.length - 2));
		}
		return 0;
	}
	
	function Tooltip(options) {

		var me, o, internal, handlers, calculate_position;
		
		me = this;
		o = $.extend({
			triggers: $('.tooltip_trigger'),
			tooltip:null,
			reactive_tooltip: true,
			modal_tooltip: false,
			markup_generator:null,
			animate_slide:true,
			animate_opacity:true,
			offset_top: 0,
			offset_left: 0,
			tail_offset_top: 0,
			tail_offset_left: 0,
			use_mousepos:true,
			positions:['top','right','bottom','left'],
			container:$('body'),
			hide_delay:200,
			resize_response_delay: 50
		}, options);
		
		internal = {
			guid: NI.fn.guid("tooltip"),
			window:$(window),
			tooltip:(o.tooltip ? o.tooltip.appendTo(o.container) : $('<div class="tooltip"></div>').appendTo(o.container)),
			tooltip_content:null,
			tails:null,
			triggers:o.triggers,
			has_been_shown:false,
			current_trigger:null,
			animating:false,
			visible:false,
			mousepos:null,
			visibility_timer:null,
			resize_timer: null
		};
		
		function init(){
			var event_data = {me: me};

			if (o.modal_tooltip) {
				internal.triggers.bind('click.'+internal.guid, event_data, handlers.trigger_click);
			} else {
				internal.triggers.bind('mouseenter.'+internal.guid, event_data, handlers.trigger_mouseenter);
				internal.triggers.bind('mouseleave.'+internal.guid, event_data, handlers.trigger_mouseleave);
			}

			if (o.reactive_tooltip) {
				internal.tooltip.bind('mouseenter.'+internal.guid, event_data, handlers.tooltip_mouseenter);
				internal.tooltip.bind('mouseleave.'+internal.guid, event_data, handlers.tooltip_mouseleave);
			}

			generate_tails();

			internal.tooltip_content = $('<div class="tooltip-content"></div>');
			internal.tooltip.append(internal.tooltip_content);

			if(o.use_mousepos){
				$(document).bind('mousemove.'+internal.guid,function(e,d){
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
		}
		
		function generate_tails(){
			var i, my_tail;
			
			var css_fn = {
				top:function(container){
					var h = container.children('.tooltip-tail').css('height');
					return {
						//border: '1px solid red',
						width:'100%',
						height: h,
						bottom: '-' + h,
						left: '0px'
					};
				},
				right:function(container){
					var w = container.children(".tooltip-tail").css("width");
					return {
						//border: '1px solid green',
						width: w,
						height: '100%',
						top: '0px',
						left: '-' + w
					};
				},
				bottom:function(container){
					var h = container.children('.tooltip-tail').css('height');
					return {
						//border: '1px solid yellow',
						width: '100%',
						height: h,
						top: '-' + h,
						left: '0px'
					};
				},
				left:function(container){
					var w = container.children(".tooltip-tail").css("width");
					return {
						//border: '1px solid blue',
						width: w,
						height: '100%',
						top: '0px',
						right: '-' + w
					};
				}
			};
			
			for (i = 0; i < o.positions.length; i += 1) {
				my_tail = $('<div class="tooltip-tail-container ' + o.positions[i] + '"><div class="tooltip-tail" style="position:absolute;"></div></div>');
				internal.tooltip.append(my_tail);
				if ($.isFunction(css_fn[o.positions[i]])) {
					my_tail.css($.extend(css_fn[o.positions[i]](my_tail),{
						position: 'absolute',
						zIndex: 100
					}));
				}
			}

			internal.tails = internal.tooltip.find('.tooltip-tail-container');
		}
		
		// the default markup generator
		// (if none is provided by the user)
		function markup_generator(markup) {
			var output;
			if (markup instanceof $) {
				output = markup;
			} else if (typeof markup === "string") {
				output = $(markup);
			} else {
				output = $("<p>No Data.</p>");
			}
			return output;
		}
		
		function show(data) {
			internal.tooltip_content.empty().append(
				($.isFunction(o.markup_generator) ? o.markup_generator(data) : markup_generator(data))
			);
			move_to_target( calculate_target_position() );
		}

		function reposition() {
			if (!internal.animating) {
				move_to_target( calculate_target_position() );
			}
		}
		
		function get_source_position(){
			var offset;
			if(o.use_mousepos){
				return {
					left: internal.mousepos.x,
					top: internal.mousepos.y
				};
			} else {
				offset = internal.current_trigger.offset();
				return {
					left: offset.left + o.container.scrollLeft(),
					top: offset.top + o.container.scrollTop()
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
				// current_trigger must be rendered
				return {
					width: internal.current_trigger.outerWidth(),
					height: internal.current_trigger.outerHeight()
				};
			}
		}
		
		function get_tooltip_size(){
			return {
				width:internal.tooltip.outerWidth(),
				height:internal.tooltip.outerHeight()
			};
		}
		
		calculate_position = {
			// sp -- source_position
			// trs -- trigger_size
			// tts -- tooltip_size

			top:function(sp,trs,tts){
				var tail = get_tail("top");
				return {
					className:'top',
					top:(sp.top - (tts.height) - o.tail_offset_top - (tail ? trimPX(tail.css("height")) : 0)) + o.offset_top,
					left:((sp.left + (trs.width/2)) - (tts.width/2) + o.tail_offset_left) + o.offset_left
				};
			},
			bottom:function(sp,trs,tts){
				var tail = get_tail("bottom");
				return {
					className:'bottom',
					top:(sp.top + trs.height + o.tail_offset_top + (tail ? trimPX(tail.css("height")) : 0) ) - o.offset_top,
					left:((sp.left + (trs.width/2)) - (tts.width/2) + o.tail_offset_left) + o.offset_left
				};
			},
			right:function(sp,trs,tts){
				var tail = get_tail("right");
				return {
					className:'right',
					top: (sp.top + (trs.height/2) - (tts.height/2)) + o.offset_top,
					left: (sp.left + (trs.width) + o.tail_offset_top + (tail ? trimPX(tail.css("width")) : 0)) + o.offset_left
				};
			},
			left:function(sp,trs,tts){
				var tail = get_tail("left");
				return {
					className:'left',
					top: (sp.top + (trs.height/2) - (tts.height/2)) + o.offset_top,
					left: (sp.left - (tts.width) - o.tail_offset_top - (tail ? trimPX(tail.css("width")) : 0)) - o.offset_left
				};
			}
		};
		
		function get_tail(position){
			var tail = internal.tails.filter('.'+position).children('.tooltip-tail');
			return tail.length ? tail : null;
		}
		
		function get_edge_collisions(tp, tts){
			// tp -- target_position
			// tts -- tooltip_size

			var collisions = [];
			
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
			var source_position, trigger_size, tooltip_size, target_position, i;

			source_position = get_source_position();
			trigger_size = get_trigger_size();
			tooltip_size = get_tooltip_size();

			for (i = 0; i < o.positions.length; i += 1) {
				if($.isFunction(calculate_position[o.positions[i]])){
					target_position = calculate_position[o.positions[i]](source_position, trigger_size, tooltip_size);
				}
				if (!get_edge_collisions(target_position, tooltip_size).length) {
					return target_position;
				}
			}

			return null;
		}
		
		function move_to_target(target_pos){
			var me = this, css_change, animate_change, tail, tail_css_change, tail_animate_change;

			if (!target_pos) {
				return;
			}
			
			internal.tooltip.removeClass('position-top position-right position-bottom position-left').addClass('position-' + target_pos.className);
			internal.tails.css('visibility','hidden').filter('.' + target_pos.className).css('visibility','visible');
			
			css_change = {};
			animate_change = {};
			
			tail = get_tail(target_pos.className);
			tail_css_change = {};
			tail_animate_change = {};
			
			if(o.animate_slide){
				animate_change.top = target_pos.top;
				animate_change.left = target_pos.left;
				switch(target_pos.className){
					case 'top':
					case 'bottom':
						tail_animate_change.left = (internal.tooltip.width()/2) - o.tail_offset_left - (trimPX(tail.css("width"))/2);
						break;
					case 'left':
					case 'right':
						tail_animate_change.top = (internal.tooltip.height()/2) + o.tail_offset_top - (trimPX(tail.css("height"))/2);
						break;
				}
			} else {
				css_change.top = target_pos.top;
				css_change.left = target_pos.left;

				switch(target_pos.className){
					case 'top':
					case 'bottom':
						tail_css_change.left = (internal.tooltip.width()/2) - o.tail_offset_left - (trimPX(tail.css("width"))/2);
						break;
					case 'left':
					case 'right':
						tail_css_change.top = (internal.tooltip.height()/2) + o.tail_offset_top - (trimPX(tail.css("height"))/2);
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

			tail.css(tail_css_change).stop(true).show().animate(tail_animate_change,500,'easeOutCubic',function(){});
			
			internal.tooltip.stop().show().css(css_change).animate(animate_change,500,'easeOutCubic',function(){
				internal.animating = false;
				internal.visible = true;
			});

			$(window).bind("resize."+ internal.guid, handlers.window_resize);
			if (o.modal_tooltip) {
				$(document).bind("click."+ internal.guid, handlers.doc_click);
			}
			
			internal.has_been_shown = true;
		}

		function hide(){
			internal.animating = true;
			internal.visible = false;
			internal.tooltip.stop().animate({
				'opacity':0.0
			},200,'easeOutCirc',function(){
				internal.tooltip.hide();
				internal.animating = false;
				internal.current_trigger = null;
			});
			$(window).unbind('resize.'+internal.guid);
			if (o.modal_tooltip) {
				$(document).unbind("click."+ internal.guid);
			}
		}
		
		handlers = {
			trigger_mouseenter:function(e){
				if(internal.visibility_timer){
					clearTimeout(internal.visibility_timer);
					internal.visibility_timer = null;
				}
				internal.current_trigger = $(this);
				show();
			},
			trigger_mouseleave:function(e){
				if(internal.visibility_timer){
					clearTimeout(internal.visibility_timer);
					internal.visibility_timer = null;
				}
				internal.visibility_timer = setTimeout(hide,o.hide_delay);
			},
			trigger_click: function(e) {
				if (internal.visible) {
					hide();
				} else {
					internal.current_trigger = $(this);
					show();
				}
			},
			tooltip_mouseenter:function(e){
				if(internal.visibility_timer){
					clearTimeout(internal.visibility_timer);
					internal.visibility_timer = null;
				}
				if(!o.use_mousepos && internal.current_trigger && !internal.visible){
					show();
				}
			},
			tooltip_mouseleave:function(e,d){
				if(internal.animating){
					return;
				}
				if(internal.visibility_timer){
					clearTimeout(internal.visibility_timer);
					internal.visibility_timer = null;
				}
				internal.visibility_timer = setTimeout(hide,o.hide_delay);
			},
			window_resize: function(e) {
				if (internal.resize_timer) {
					clearTimeout(internal.resize_timer);
					internal.resize_timer = null;
				}
				internal.resize_timer = setTimeout(reposition, o.resize_response_delay);
			},
			doc_click: function(e) {
				if (internal.tooltip[0] === e.target || $.contains(internal.tooltip[0], e.target)) {
					return;
				}
				if (internal.current_trigger &&
					(internal.current_trigger[0] === e.target || $.contains(internal.current_trigger[0], e.target))) {
					return;
				}
				// if the click didn't occur on the tooltip or the current trigger --> hide
				hide();
			}
		};
		
		this.add_trigger = function(trigger){
			var event_data = {me: this};

			if (o.modal_tooltip) {
				trigger.bind('click.'+internal.guid, event_data, handlers.trigger_click);
			} else {
				trigger.bind('mouseenter.'+internal.guid, event_data, this.handlers.trigger_mouseenter);
				trigger.bind('mouseleave.'+internal.guid, event_data, this.handlers.trigger_mouseleave);
			}

			if(!internal.triggers.length){
				internal.triggers = trigger;
			} else {
				internal.triggers.add(trigger);
			}
		};
		
		this.clear_triggers = function() {
			internal.triggers.each(function(i,j){
				$(j).unbind('mouseenter.'+internal.guid).unbind('mouseleave.'+internal.guid).unbind('click.'+internal.guid);
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
				internal.visibility_timer = null;
			}
			
			internal.current_trigger = _o.trigger;
			internal.tooltip.stop(true);

			show(_o.data);
		};
		
		this.hide_tooltip = function(delay){
			if(internal.visibility_timer){
				clearTimeout(internal.visibility_timer);
				internal.visibility_timer = null;
			}
			internal.visibility_timer = setTimeout(hide,(delay ? delay : o.hide_delay));
		};
		
		this.get_tooltip = function(){
			return internal.tooltip;
		};

		this.destroy = function() {
			if(internal.visibility_timer){
				clearTimeout(internal.visibility_timer);
				internal.visibility_timer = null;
			}
			internal.tooltip.remove();
			this.clear_triggers();
			if (o.use_mousepos) {
				$(document).unbind('mousemove.'+internal.guid);
			}
			$(window).unbind('resize.'+internal.guid);
			if (o.modal_tooltip) {
				$(document).unbind("click."+ internal.guid);
			}
		};
		
		init();
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Tooltip = Tooltip;
	
}(this, this.jQuery));