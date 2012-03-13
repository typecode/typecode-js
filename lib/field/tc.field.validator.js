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
			manager: null,
			on_valid:function(e,d){},
			on_invalid:function(e,d){}
		}, options);
		
		function init() {

			
			if (!o.manager || !(o.manager instanceof NI.ValidationManager)) {
				o.manager = new NI.ValidationManager({
					watchEvents:['keyup', 'change', NI.field.co.SET_VAL_EVENT]
				});
			}

			field.event_receiver.bind(NI.field.co.RESET_EVENT, {}, function(e,d){
				field.event_receiver.trigger('validationReset');
			});

			field.event_receiver.bind(NI.field.co.VALIDATE_EVENT, {}, function(e,d){
				field.event_receiver.trigger('validate');
			});

			field.$e.bind('validationPass', {}, o.on_valid);
			field.$e.bind('validationFail', {}, o.on_invalid);
			
			field.$e.data("master", field);

			o.manager.addField({
				element: field.$e,
				validators: o.validators
			});
			
		}
		
		init();
	};

	field.extensions.ValidatorError = function(field, options) {
		var me, o, internal;
		
		me = this;
		o = $.extend({

		}, options);

		internal = {
			$e: $('<div class="tc-field-validator-error"></div>')
		};
		
		function init() {
			field.$e.append(internal.$e);
		}

		field.event_receiver.bind(NI.field.co.RESET_EVENT, {}, function(e,d){
			internal.$e.empty();
		});
		
		init();
	};

}(this, this.jQuery));