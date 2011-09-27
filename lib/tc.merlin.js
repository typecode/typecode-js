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
			
			data:{},
			
			watch_keypress:true,
			allow_hash_override_onload:false,
			use_hashchange:true,
			
			first_step:null,
			steps:{}
		}, options);
		
		internal = {
			data:{},
			current_step:null,
			progress_element:null
		};
		this.internal = internal;
		
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
		}
		
		function initialize_controls(me){
			var i;
			if(!o.controls){ return; }
			for(i in o.controls){
				if(!o.controls[i]){ continue; }
				if(!control_handlers[i]){ continue; }
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
					
					if(o.steps[i].inputs){
						
						o.steps[i].validationManager = new NI.ValidationManager({
							$mother:o.steps[i].$e
						});
						
						o.steps[i].$e.bind('managerValidationPass', {merlin:me}, step_event_handlers.managerValidationPass)
							.bind('managerValidationFail', {merlin:me}, step_event_handlers.managerValidationFail);
						
						o.steps[i].valid = false;
						
						for(j in o.steps[i].inputs){
							o.steps[i].inputs[j].component = new NI.Input({
								$e:o.steps[i].$e.find(o.steps[i].inputs[j].selector),
								hint:(o.steps[i].inputs[j].hint ? o.steps[i].inputs[j].hint : null),
								data:{merlin:me},
								handlers:{
									focus:step_input_handlers.focus,
									keyup:step_input_handlers.modify,
									change:step_input_handlers.modify,
									blur:step_input_handlers.blur
								},
								validation:{
									validationManager:o.steps[i].validationManager,
									validators:o.steps[i].inputs[j].validators
								}
							});
						}
					}
					
				}
			}
		}
		
		function show_step(step){
			
			console.log(step);
			
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
				return true;
			}
			
			if(internal.current_step && $.isFunction(internal.current_step.finish)){
				internal.current_step.finish(me);
			}
			
			if($.isFunction(step)){
				step = step(me);
			}
			
			if(internal.current_step && (step == internal.current_step.name)){
				return true;
			}
			
			if(!o.steps[step]){
				if(o.use_hashchange){
					set_location(internal.current_step.name);
				}
				return false;
			}
		
			internal.current_step = o.steps[step];
			
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
			
			internal.current_step.n_times_shown++;
		};
		
		function set_location(step){
			window.location.hash = (o.name ? o.name + ',' : '') + step;
		};
		
		function show_step_old(step,force){
			//var i, j, temp_e_data;
			var i;
	
	
			if(this.current_step.inputs && !this.current_step.has_been_initialized){
				for(i in this.current_step.inputs){
					temp_e_data = tc.jQ.extend({},this.event_data,{input:this.current_step.inputs[i]});
					if(!this.current_step.inputs[i].$e && this.current_step.inputs[i].selector){
						this.current_step.inputs[i].$e = this.current_step.$e.find(this.current_step.inputs[i].selector);
						if(!this.current_step.inputs[i].$e.length){
							tc.util.dump(this.current_step.inputs[i].selector);
						}
					}
					if(this.current_step.inputs[i].counter && !this.current_step.inputs[i].counter.$e){
						this.current_step.inputs[i].counter.$e = this.current_step.$e.find(this.current_step.inputs[i].counter.selector)
						this.current_step.inputs[i].counter.$e.text('0/'+this.current_step.inputs[i].counter.limit);
					}
					this.current_step.inputs[i].$e
						.bind('focus',temp_e_data,this.handlers.focus)
						.bind('keyup change',temp_e_data,this.handlers.keypress)
						.bind('blur',temp_e_data,this.handlers.blur)
						.data({merlin:this,input:this.current_step.inputs[i]})
						.each(function(i,j){
							var $j;
							$j = tc.jQ(j);
							if($j.data().input.hint || ($j.data().input.hint === "")){
								j.value = $j.data().input.hint;
							}
						});
					if(this.current_step.inputs[i].handlers){
						for(j in this.current_step.inputs[i].handlers){
							this.current_step.inputs[i].$e.bind(j,this.event_data,this.current_step.inputs[i].handlers[j]);
						}
					}
					if(this.current_step.inputs[i].focus_first){
						//this.current_step.inputs[i].$e.focus();
					}
				}
			}
	
			if (this.options.use_hashchange && !this.current_step.supress_hash) {
				if(this.options.name){
					window.location.hash = this.options.name+','+step;
				} else {
					window.location.hash = step;
				}
			}
	
			if(tc.jQ.isFunction(this.current_step.init)){
				this.current_step.init(me);
			}
			this.validate(false);
			this.current_step.has_been_initialized = true;
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
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Merlin = Merlin;
	
}(this, this.jQuery));