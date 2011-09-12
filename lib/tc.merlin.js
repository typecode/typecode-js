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
		
		var o = $.extend({
			name:null,
			
			dom:null,
			progress_element:null,
			controls:{
				next:null,
				prev:null
			},
			
			watch_keypress:true,
			allow_hash_override_onload:false,
			use_hashchange:true,
			
			first_step:null,
			steps:{}
		}, options);
		
		var internal = {
			current_step:null
		};
		this.internal = internal;
		
		function init(me){
			console.log('merlin starting');
			console.log(o);
			
			initialize_controls();
			initialize_steps();
			
			show_step(o.first_step)
		};
		
		function initialize_controls(){
			var i;
			if(!o.controls){ return; }
			for(i in o.controls){
				if(!control_handlers[i]){ continue; }
				o.controls[i].bind('click',internal,control_handlers[i]);
			}
		}
		
		function initialize_steps(){
			var i, j, e_data;
			for(i in o.steps){
				if(o.steps[i].selector && o.dom){
					o.steps[i].name = i;
					o.steps[i].n_times_shown = 0;
					o.steps[i].dom = o.dom.find(o.steps[i].selector);
					o.steps[i].dom.hide();
					
					if(o.steps[i].inputs){
						for(j in o.steps[i].inputs){
							
							o.steps[i].inputs[j].component = new NI.Input({
								dom:o.steps[i].dom.find(o.steps[i].inputs[j].selector),
								hint:(o.steps[i].inputs[j].hint ? o.steps[i].inputs[j].hint : null),
								data:{merlin:this},
								handlers:{
									focus:input_handlers.focus,
									keyup:input_handlers.modify,
									change:input_handlers.modify,
									blur:input_handlers.blur
								}
							});
							
						}
					}
					
					console.log(o.steps[i]);
				}
			}
		}
		
		function show_step(step){
			if(!o.steps[step]){
				return;
			}
		
			if(internal.current_step && $.isFunction(internal.current_step.finish)){
				internal.current_step.finish(this);
			}
		
			internal.current_step = o.steps[step];
			
			o.dom.find(internal.current_step.selector).show().siblings('.step').hide();
			
			if(internal.current_step.n_times_shown == 0 && $.isFunction(internal.current_step.init)){
				internal.current_step.init(this);
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
			
			
			if (o.use_hashchange && !internal.current_step.supress_hash) {
				window.location.hash = (o.name ? o.name + ',' : '') + step;
			}
			
			
		
			
			if($.isFunction(internal.current_step.visible)){
				internal.current_step.visible(this);
			}
			
			internal.current_step.n_times_shown++;
		};
		
		function show_step_old(step,force){
			//var i, j, temp_e_data;
			var i;
	
	
			if(this.current_step.inputs && !this.current_step.has_been_initialized){
				for(i in this.current_step.inputs){
					temp_e_data = tc.jQ.extend({},this.event_data,{input:this.current_step.inputs[i]});
					if(!this.current_step.inputs[i].dom && this.current_step.inputs[i].selector){
						this.current_step.inputs[i].dom = this.current_step.dom.find(this.current_step.inputs[i].selector);
						if(!this.current_step.inputs[i].dom.length){
							tc.util.dump(this.current_step.inputs[i].selector);
						}
					}
					if(this.current_step.inputs[i].counter && !this.current_step.inputs[i].counter.dom){
						this.current_step.inputs[i].counter.dom = this.current_step.dom.find(this.current_step.inputs[i].counter.selector)
						this.current_step.inputs[i].counter.dom.text('0/'+this.current_step.inputs[i].counter.limit);
					}
					this.current_step.inputs[i].dom
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
							this.current_step.inputs[i].dom.bind(j,this.event_data,this.current_step.inputs[i].handlers[j]);
						}
					}
					if(this.current_step.inputs[i].focus_first){
						//this.current_step.inputs[i].dom.focus();
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
				this.current_step.init(this,this.current_step.dom);
			}
			this.validate(false);
			this.current_step.has_been_initialized = true;
		}
		
		var control_handlers = {
			next:function(e,d){
				e.preventDefault();
				if($(this).hasClass('disabled')){
					return;
				}
				if(internal.current_step.next){
					show_step(internal.current_step.next);
				}
			},
			prev:function(e,d){
				e.preventDefault();
				if($(this).hasClass('disabled')){
					return;
				}
				if(internal.current_step.prev){
					show_step(internal.current_step.prev);
				}
			}
		}
		
		var input_handlers = {
			focus:function(e,d){
				console.log(e.type);
				console.log(e.data);
			},
			modify:function(e,d){
				console.log(e.type);
				console.log(e.data);
			},
			blur:function(e,d){
				console.log(e.type);
				console.log(e.data);
			}
		}
		
		var handlers = {
			
		};
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Merlin = Merlin;
	
}(this, this.jQuery));