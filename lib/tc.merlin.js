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

(function(window, $) {
	
	var NI = window.NI;
	
	function Merlin(options) {
		var me, o, internal, control_handlers, step_input_handlers;
		
		me = this;
		
		o = $.extend({
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
			
			first_step:null,
			steps:{}
		}, options);
		
		internal = {
			steps:o.steps,
			data:{},
			current_step:null,
			progress_element:null
		};
		
		this.extensions = o.extensions;
		this.internal = internal;
		this.events = $({});
		this.runtime = {};
		
		function init(me){
			internal.data = o.data;
			internal.progress_element = o.progress_element;
			internal.first_step = o.first_step;
			if(o.use_hashchange){
				initialize_hashchange(me);
			}
			initialize_controls(me);
			initialize_steps(me);
			show_step(internal.first_step);
		};
		
		function initialize_hashchange(me){
			if(!$.fn.hashchange){
				//cannot use hashchange if it is not present. GHETTO-dep-checking!
				o.use_hashchange = false;
				return;
			}
			$(window)
				.unbind('hashchange', {merlin:me}, window_event_handlers.hashchange)
				.bind('hashchange', {merlin:me}, window_event_handlers.hashchange);
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
			for(i in o.steps){
				if(o.steps[i].selector && o.$e){
					o.steps[i].name = i;
					o.steps[i].n_times_shown = 0;
					o.steps[i].$e = o.$e.find(o.steps[i].selector);
					o.steps[i].$e.hide();
					
					if(o.steps[i].fields){
						
						o.steps[i].validationManager = new NI.ValidationManager({
							$mother:o.steps[i].$e
						});
						
						o.steps[i].$e.bind('managerValidationPass', {merlin:me}, step_event_handlers.managerValidationPass)
							.bind('managerValidationFail', {merlin:me}, step_event_handlers.managerValidationFail);
						
						o.steps[i].valid = true;
						
						for(j in o.steps[i].fields){
							/*o.steps[i].inputs[j].component = new NI.Input({
								$e:o.steps[i].$e.find(o.steps[i].inputs[j].selector),
								hint:(o.steps[i].inputs[j].hint ? o.steps[i].inputs[j].hint : null),
								data:{merlin:me},
								handlers:{
									focus:step_input_handlers.focus,
									keyup:step_input_handlers.modify,
									change:step_input_handlers.modify,
									keypress:step_input_handlers.keypress,
									blur:step_input_handlers.blur
								},
								validation:{
									validationManager:o.steps[i].validationManager,
									validators:o.steps[i].inputs[j].validators
								}
							});*/
							
							if (o.steps[i].fields[j].options && o.steps[i].fields[j].options.extensions && o.steps[i].fields[j].options.extensions.Validator) {
								o.steps[i].fields[j].options.extensions.Validator.manager = o.steps[i].validationManager;
							}
							
							console.log(o.steps[i].$e.find(o.steps[i].fields[j].selector));

							o.steps[i].fields[j].component = NI.field.new_instance({
								element: o.steps[i].$e.find(o.steps[i].fields[j].selector),
								options: $.extend({
									handlers: {
										focus: step_input_handlers.focus,
										keyup: step_input_handlers.modify,
										change: step_input_handlers.modify,
										keypress: step_input_handlers.keypress,
										blur: step_input_handlers.blur
									}
								}, o.steps[i].fields[j].options)
							});

							if(o.steps[i].fields[j].value || (o.steps[i].fields[j].value === '')){
								o.steps[i].fields[j].component.set_val(o.steps[i].fields[j].value);
							}
						}
					}
					
				}
			}
		}
		
		function show_step(step){

			var i;

			if(step == 'next'){
				if(control_handlers.next() === false){
					if(o.use_hashchange){
						set_location(internal.current_step.name);
					}
					return false
				};
			} else if(step == 'prev'){
				if(control_handlers.prev() === false){
					if(o.use_hashchange){
						set_location(internal.current_step.name);
					}
					return false;
				};
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
				internal.current_step.finish(me);
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
		
			internal.current_step = o.steps[step];
			

			console.log(o.$e.find(internal.current_step.selector));
			o.$e.find(internal.current_step.selector).show().siblings('.step').hide();
			
			if(internal.current_step.n_times_shown == 0 && $.isFunction(internal.current_step.init)){
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

			
			if (o.use_hashchange && !internal.current_step.supress_hash) {
				set_location(step);
			}
			
			if($.isFunction(internal.current_step.visible)){
				internal.current_step.visible(me);
			}

			if(internal.current_step.fields){
				for(i in internal.current_step.fields){
					internal.current_step.fields[i].component.event_receiver.trigger('change');
				}
			}
			
			internal.current_step.n_times_shown++;
		};
		
		function set_location(step){
			window.location.hash = (o.name ? o.name + ',' : '') + step;
		};
		
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
				if(internal.current_step.next){
					show_step(internal.current_step.next);
				}
			},
			prev:function(e,d){
				if(e){
					e.preventDefault();
				}
				if($(this).hasClass('disabled')){
					return false;
				}
				if(internal.current_step.prev){
					show_step(internal.current_step.prev);
				}
			}
		};
		
		step_input_handlers = {
			focus:function(e,d){
				
			},
			modify:function(e,d){
				
			},
			keypress:function(e,d){
				if(o.return_triggers_next){
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
		
		window_event_handlers = {
			hashchange:function(e,d){
				var hash;
				hash = window.location.hash.substring(1,window.location.hash.length).split(',');
				if(o.name){
					if(o.name == hash[0] && hash[1]){
						show_step(hash[1]);
					}
				} else {
					show_step(hash[0]);
				}
			}
		};
		
		this.show_step = function(step){
			if(o.use_hashchange){
				set_location(step);
			} else {
				show_step(step);
			}
		}

		this.set_data = function(data){
			internal.data = data;
		}

		this.get_data = function(){
			return internal.data;
		}

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