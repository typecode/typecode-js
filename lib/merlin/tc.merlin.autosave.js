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
	
	function MerlinAutosave(options){
		
		var o, internal;
		
		o = $.extend({
			keyup_delay:300,
			change_delay:0,
			saved_delay:1500,
			prevent_invalid:false
		},options);
		
		internal = {
			save_timeout:null
		};
		
		this.init = function(me,functions){
			
			for(i in me.internal.current_step.fields){
				
				me.internal.current_step.fields[i].component.event_receiver.bind('change keyup',{ name:i },function(e,d){
				
					if(internal.save_timeout){ clearTimeout(internal.save_timeout); }
				
					if(o.prevent_invalid){
						if(me.internal.current_step.$e.hasClass('state-invalid')){
							return;
						}
					}

					if( (!me.get_data()[e.data.name] && (me.get_data()[e.data.name].length !== 0) ) || (me.get_data()[e.data.name] == me.internal.current_step.fields[e.data.name].component.get_val()) ){
						return;
					}
				
					function saved(){
						me.internal.current_step.$e.addClass('merlin-autosave-state-saved')
							.removeClass('merlin-autosave-state-unsaved')
							.removeClass('merlin-autosave-state-saving');
					}
				
					me.internal.current_step.$e.addClass('merlin-autosave-state-unsaved')
						.removeClass('merlin-autosave-state-unsaved')
						.removeClass('merlin-autosave-state-saved');

					internal.save_timeout = setTimeout(function(){
						me.internal.current_step.$e.addClass('merlin-autosave-state-saving')
							.removeClass('merlin-autosave-state-unsaved')
							.removeClass('merlin-autosave-state-saved');

						if($.isFunction(functions.save)){
							functions.save(saved);
						} else {
							saved();
						}
					},((e.type == 'keyup') ? o.keyup_delay : o.change_delay));
				});
			}
			
		};
		
		this.visible = function(me){
			
		};
		
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.MerlinAutosave = MerlinAutosave;
	
}(this, this.jQuery));