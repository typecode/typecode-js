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
	
	function InputValidator(options) {
		var o, internal;
		
		o = $.extend({
			input:null,
			validators:null,
			validationManager:null
		}, options);
		
		internal = {
			input:null,
			validators:null,
			validationManager:null
		};
		
		function init(me){
			if(!o.input){ return; }
			
			internal.input = o.input;
			internal.validators = o.validators;
			internal.validationManager = o.validationManager;
			
			if(!internal.validationManager){
				//we dont already have a manager for this input, so we will create one just for this input
				internal.validationManager = new NI.ValidationManager();
			}
			
			internal.validationManager.addField({
				element:internal.input.$e,
				validators:internal.validators
			});
			
		};
		
		init(this);
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.InputValidator = InputValidator;
	
}(this, this.jQuery));