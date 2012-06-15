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

	NI.co.Merlin = {
		NEXT_STEP:'next',
		PREVIOUS_STEP:'prev',
		CURRENT_STEP:'current'
	};
	
	function Merlin(options) {
		var me, o, internal, control_handlers, step_input_handlers;
		
		me = this;
		
		o = $.extend({},{
			name:null,
			
			$e:null,
			progress_element:null,
			controls:{
				next:null,
				prev:null
			},
			
			extensions:{},
			data:{},
			
			watch_keypress:true,
			allow_hash_override_onload:false,
			use_hashchange:false,
			return_triggers_next:true,
			
			transition:'none', // fade, slide, horiz_slide, or none
			transition_speed:400,
			viewport:null, // for horiz_slide
			
			first_step:null,
			steps:{}
		}, options);

		internal = {
			$e:o.$e,
			steps:o.steps,
			data:{},
			current_step:null,
			last_step:null,
			progress_element:null,
			counters:{
				n_times_step_rendered:0
			}
		};
		
		this.extensions = o.extensions;
		this.internal = internal;
		this.events = $({});
		this.runtime = (o.runtime ? o.runtime : {});
		this.o = o;
		
		function init(me){
			internal.data = o.data;
			internal.progress_element = o.progress_element;
			internal.first_step = o.first_step;
			if(o.use_hashchange){
				initialize_hashchange(me);
			}
			initialize_controls(me);
			initialize_steps(me);
			if(internal.first_step){
				show_step(internal.first_step);
			}
		};
		
		function initialize_hashchange(me){
			if(!$.fn.hashchange){
				//cannot use hashchange if it is not present. GHETTO-dep-checking!
				o.use_hashchange = false;
				return;
			}
			//$(window)
			//	.unbind('hashchange', {merlin:me}, window_event_handlers.hashchange)
			//	.bind('hashchange', {merlin:me}, window_event_handlers.hashchange);
		};
		
		function initialize_controls(me){
			var i;
			if(!o.controls){ return; }
			for(i in o.controls){
				if(!o.controls[i]){ continue; }
				if(!control_handlers[i]){ continue; }
				if(typeof o.controls[i] == 'string' ){
					o.controls[i] = o.$e.find(o.controls[i]);
				}
				o.controls[i].bind('click', {merlin:me}, control_handlers[i]);
			}
		}
		
		function initialize_steps(me){
			var i, j, e_data;
			$.each(o.steps,function(i,j){
				var k;
				if(o.steps[i].selector && o.$e){
					o.steps[i].name = i;
					o.steps[i].n_times_shown = 0;
					o.steps[i].$e = o.$e.find(o.steps[i].selector);
					o.steps[i].$e.hide();

					o.steps[i].initialize_fields = function(){
						if(o.steps[i].fields){
							
							o.steps[i].validationManager = new NI.ValidationManager({
								$mother:o.steps[i].$e,
								//watchEvents:['keyup', 'change', NI.field.co.SET_VAL_EVENT]
								watchEvents:['keyup', 'change']
							});
							
							o.steps[i].$e.bind('managerValidationPass', {merlin:me}, step_event_handlers.managerValidationPass)
								.bind('managerValidationFail', {merlin:me}, step_event_handlers.managerValidationFail);
							
							o.steps[i].valid = true;
							
							for(j in o.steps[i].fields){
								if (o.steps[i].fields[j].options && o.steps[i].fields[j].options.extensions && o.steps[i].fields[j].options.extensions.Validator) {
									o.steps[i].fields[j].options.extensions.Validator.manager = o.steps[i].validationManager;
								}
								o.steps[i].fields[j].component = NI.field.new_instance({
									element: o.steps[i].$e.find(o.steps[i].fields[j].selector),
									preprocess: $.isFunction(o.steps[i].fields[j].preprocess) ? o.steps[i].fields[j].preprocess : null,
									options: $.extend({
										handlers: {
											focus: step_input_handlers.focus,
											keyup: step_input_handlers.modify,
											change: step_input_handlers.modify,
											//keypress: step_input_handlers.keypress,
											keydown: step_input_handlers.keydown,
											blur: step_input_handlers.blur
										},
										event_data:{
											merlin:me
										}
									}, o.steps[i].fields[j].options)
								});

								if(o.steps[i].fields[j].value || (o.steps[i].fields[j].value === '')){
									o.steps[i].fields[j].component.set_val(o.steps[i].fields[j].value);
								}
							}
						}
					};
					o.steps[i].initialize_fields();
					
					o.steps[i].validate = function(){
						var k;
						if(o.steps[i].fields){
							for(k in o.steps[i].fields){
								if(o.steps[i].fields[k].component){
									o.steps[i].fields[k].component.event_receiver.trigger('tc-field-validate');
								}
							}
						}
					};

					o.steps[i].set_valid = function(state){
						o.steps[i].valid = state;
					}

				}
			});
			for(i in o.steps){
				
			}
		}
		
		function show_step(step, nav_data){

			var i;

			if(internal.current_step && $.isFunction(internal.current_step.validate)){
				internal.current_step.validate();
			}

			if(step == NI.co.Merlin.NEXT_STEP){
				if(internal.current_step.valid === false){
					return false;
				}
				if(internal.current_step.next){
					show_step(internal.current_step.next);
				}
				return;
			} else if(step == NI.co.Merlin.PREVIOUS_STEP){
				if(internal.current_step.prev){
					show_step(internal.current_step.prev);
				}
				return;
			} else if(step == NI.co.Merlin.CURRENT_STEP){
				if(internal.current_step){
					show_step(internal.current_step.name);
				}
				return;
			}

			if(typeof step == 'string' && !(o.steps[step])){
				if(o.use_hashchange){
					set_location(internal.current_step.name);
				}
				return false;
			}

			if(internal.current_step && (step == internal.current_step.name)){
				if($.isFunction(internal.current_step.visible)){
					internal.current_step.visible(me);
				}
				return true;
			}
			
			if(internal.current_step && $.isFunction(internal.current_step.finish)){
				if(internal.current_step.finish(me) === false){
					return false;
				}
			}
			
			if($.isFunction(step)){
				step = step(me);
			}
			
			if(internal.current_step && (step == internal.current_step.name)){
				if($.isFunction(internal.current_step.visible)){
					internal.current_step.visible(me);
				}
				return true;
			}
			
			if(!o.steps[step]){
				if(o.use_hashchange){
					set_location(internal.current_step.name);
				}
				return false;
			}

			if ( internal.current_step ) {
				internal.last_step = internal.current_step;
			}
			internal.current_step = o.steps[step];
			
			// begin transition handling
			if (o.transition=='fade') {
				if (internal.counters.n_times_step_rendered !== 0) {
					o.$e.find(internal.current_step.selector).fadeIn(o.transition_speed).siblings('.step').hide();
				} else {
					o.$e.find(internal.current_step.selector).show().siblings('.step').hide();
				}
			} else if (o.transition=='slide') {
				if (internal.counters.n_times_step_rendered !== 0) {
					o.$e.find(internal.current_step.selector).siblings('.step').slideUp(o.transition_speed/2);
					o.$e.find(internal.current_step.selector).delay(o.transition_speed/2).slideDown(o.transition_speed);
				} else {
					o.$e.find(internal.current_step.selector).show().siblings('.step').hide();
				}
			} else if (o.transition=='horiz_slide') {
			
				strip = o.$e;
				viewport = o.viewport;
				step_width = viewport.width();
				
				strip.children('.step').width( step_width );
			
				if (internal.counters.n_times_step_rendered !== 0) {
				
					strip.width( step_width * 2);
					strip.find(internal.current_step.selector).show();

					if ( internal.current_step.step_number > internal.last_step.step_number ) {
						strip.animate({ 'margin-left' : -step_width }, o.transition_speed, 'easeInOutQuad', 
							function(){
								strip.find(internal.last_step.selector).hide();
								strip.css({ 'margin-left' : 0, 'width' : step_width });
							}
						);
					} else if ( internal.current_step.step_number < internal.last_step.step_number ) {
						strip.css({ 'margin-left' : -step_width });
						strip.animate({ 'margin-left' : 0 }, o.transition_speed, 'easeInOutQuad', 
							function(){
								strip.find(internal.last_step.selector).hide();
								strip.css({ 'width' : step_width });
							}
						);	
					}

				} else {

					o.$e.find(internal.current_step.selector).show().siblings('.step').hide();

				}
				
			} else {
				o.$e.find(internal.current_step.selector).show().siblings('.step').hide();
			}
			// end transition handling
			
			if(internal.current_step.n_times_shown === 0 && !internal.current_step.init_forced && $.isFunction(internal.current_step.init)){
				internal.current_step.init(me);
			}
			
			// begin controls handling
			if(o.controls.prev){
				if(internal.current_step.prev){
					o.controls.prev.removeClass('disabled');
				} else {
					o.controls.prev.addClass('disabled');
				}
			}
			
			if(o.controls.next){
				if(internal.current_step.next){
					o.controls.next.removeClass('disabled');
				} else {
					o.controls.next.addClass('disabled');
				}
			}
			// end controls handling

			
			//begin progress indicator
			if(internal.current_step.progress_selector){
				internal.progress_element.find('.progress-unit')
					.removeClass('current')
					.filter(internal.current_step.progress_selector)
					.addClass('current');
			}
			//end progress indicator

			internal.current_step.nav_data = nav_data;
			
			if($.isFunction(internal.current_step.visible)){
				internal.counters.n_times_step_rendered++;
				internal.current_step.visible(me);
			}

			if (o.use_hashchange && !internal.current_step.supress_hash && internal.current_step.name) {
				set_location(internal.current_step.name);
			}

			//if(internal.current_step.fields){
			//	for(i in internal.current_step.fields){
			//		internal.current_step.fields[i].component.event_receiver.trigger('change');
			//	}
			//}
			
			internal.current_step.n_times_shown++;
		};
		
		function set_location(step){
			window.location.hash = (o.name ? o.name + ':' : '') + step;
		}
		
		control_handlers = {
			next:function(e,d){
				if(e){
					e.preventDefault();
				}
				if(internal.current_step.valid === false){
					return false;
				}

				if($(this).hasClass('disabled')){
					return false;
				}
				show_step(NI.co.Merlin.NEXT_STEP);
			},
			prev:function(e,d){
				if(e){
					e.preventDefault();
				}
				if($(this).hasClass('disabled')){
					return false;
				}
				show_step(NI.co.Merlin.PREVIOUS_STEP);
			},
			refresh:function(e,d){
				if(e){
					e.preventDefault();
				}
				show_step(NI.co.Merlin.CURRENT_STEP);
			}
		};
		
		step_input_handlers = {
			focus:function(e,d){
				
			},
			modify:function(e,d){
				
			},
			keypress:function(e,d){
				if(e.data.merlin.o.return_triggers_next){
					if(e.which && (e.which == NI.co.keyboard.ENTER)){
						control_handlers.next(e,d);
					}
				}
			},
			keydown:function(e,d){
				if(e.data.merlin.o.return_triggers_next){
					if(e.which && (e.which == NI.co.keyboard.ENTER)){
						control_handlers.next(e,d);
					}
				}
			},
			blur:function(e,d){
				
			}
		};
		
		step_event_handlers = {
			managerValidationPass:function(e,d){
				if(e.data.merlin.internal.current_step){
					e.data.merlin.internal.current_step.valid = true;
				}
			},
			managerValidationFail:function(e,d){
				if(e.data.merlin.internal.current_step){
					e.data.merlin.internal.current_step.valid = false;
				}
			}
		};
		
		this.show_step = function(step, nav_data){
			show_step(step, nav_data);
		};

		this.set_data = function(data){
			internal.data = data;
		};

		this.get_data = function(){
			return internal.data;
		};

		this.get_val = function(id){
			return internal.data[id];
		};
		
		this.set_val = function(id,new_val){
			internal.data[id] = new_val;
		};
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Merlin = Merlin;
	
}(this, this.jQuery));