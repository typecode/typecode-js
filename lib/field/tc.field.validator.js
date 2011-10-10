/*    _____                    _____          
     /\    \                  /\    \         
    /::\    \                /::\    \        
    \:::\    f\              /::::\    \       
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

// Dependencies:
// NI.field

(function(window, $) {
	
	var NI = window.NI,
	    field = NI.field;

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	field.extensions.Validator = function(field, options) {
		var me, o;
		
		me = this;
		o = $.extend({
			validators: null,
			manager: null
		}, options);
		
		function init() {
			
			if (!o.manager || !(o.manager instanceof NI.ValidationManager)) {
				o.manager = new NI.ValidationManager();
			}
			
			field.$c.data("master", field);
			
			o.manager.addField({
				element: field.$c,
				validators: o.validators
			});
		}
		
		init();
	};

}(this, this.jQuery));