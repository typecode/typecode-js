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
			saved_delay:1500
		},options);
		
		internal = {
			save_timeout:null,
			$saving:null,
			$saved:null
		};
		
		function render_state(state){
			switch(state){
				case 'unsaved':
					internal.$saving.hide();
					internal.$saved.hide();
					break;
				case 'saving':
					internal.$saving.show();
					internal.$saved.hide();
					break;
				case 'saved':
					internal.$saving.hide();
					internal.$saved.show();
					break;
			}
		}
		
		this.init = function(me,functions){
			
			internal.$saving = me.internal.current_step.$e.find('.state-saving');
			internal.$saved = me.internal.current_step.$e.find('.state-saved');
			
			for(i in me.internal.current_step.inputs){
				
				me.internal.current_step.inputs[i].component.get_dom().bind('change keyup',{},function(e,d){
				
					if(internal.save_timeout){ clearTimeout(internal.save_timeout); }
				
					if(me.internal.current_step.$e.hasClass('state-invalid')){
						return;
					}
				
					if(me.internal.data.input0 == me.internal.steps.edit.inputs['input0'].component.get_val()){
						return;
					}
				
					function saved(){
						render_state('saved');
					}
				
					render_state('unsaved');
					internal.save_timeout = setTimeout(function(){
						render_state('saving');
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
			me.internal.current_step.$e.find('.state-saved').hide();
			me.internal.current_step.$e.find('.state-saving').hide();
		};
		
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.MerlinAutosave = MerlinAutosave;
	
}(this, this.jQuery));