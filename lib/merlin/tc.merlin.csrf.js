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
	
	function MerlinCSRF(options){
		
		var o, internal;
		
		o = $.extend({
			csrf_input_name:'csrfmiddlewaretoken'
		},options);
		
		internal = {
			
		};


		this.init = function(me){

			var csrf_input;
			
			csrf_input = me.internal.current_step.$e.find('input[name="'+o.csrf_input_name+'"]');
			if(csrf_input.length){
				me.set_val(o.csrf_input_name,csrf_input.val());
			}

			console.log(me.get_data());
			
		}

	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.MerlinCSRF = MerlinCSRF;
	
}(this, this.jQuery));