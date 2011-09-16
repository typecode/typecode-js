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
	
	function Input(options) {
		var o, internal;
		
		o = $.extend({
			$e:null,
			data:{},
			hint:null,
			handlers:{
				focus:null,
				keyup:null,
				change:null,
				blur:null
			},
			validation:null
		}, options);
		
		internal = {
			$e:null,
			wrapper:$('<div class="tc-input">')
		};
		
		function init(me){
			if(!o.$e){ return; }
			
			internal.$e = o.$e;
			internal.wrapper.css({
				position:'relative'
			});
			internal.$e.wrap(internal.wrapper);
			internal.data = $.extend({},o.data,{input:me});
			handle_handlers(me);
			handle_hint(me);
			handle_counter(me);
			handle_validator(me);
		};
		
		function handle_handlers(me){
			var i;
			if(!o.handlers){ return; }
			for(i in o.handlers){
				if($.isFunction(o.handlers[i])){
					internal.$e.bind(i,internal.data,o.handlers[i]);
				}
			}
		};
		
		function handle_hint(me){
			if(!NI.InputHint){ return; }
			if(!o.hint){ return; }
			
			internal.hint = new NI.InputHint({
				text:o.hint,
				input:me
			});
			
		}
		
		function handle_validator(me){
			if(!NI.InputValidator){ return; }
			if(!o.validation){ return; }
			
			internal.validator = new NI.InputValidator({
				input:me,
				validationManager:(o.validation.validationManager ? o.validation.validationManager : null),
				validators:o.validation.validators
			});
			
		}
		
		function handle_counter(me){
			if(!NI.InputCounter){ return; }
			if(!o.counter){ return; }
			
		}
		
		this.get_dom = function(){
			return internal.$e;
		};
		
		this.get_val = function(){
			switch (internal.$e.get(0).nodeName.toLowerCase()) {
				case "input":
					switch (internal.$e.attr("type")) {
						case "radio":
						case "checkbox":
							type = "bool";
							if (internal.$e.attr("checked")) {
								value = "true";
							} else {
								value = "false";
							}
							break;
						default:
							value = internal.$e.val();
							break;
					}
					break;
				case "textarea":
					value = internal.$e.val();
					break;
				case "select":
					type = "select";
					value = internal.$e.find("option:selected").attr("value");
					break;
				default:
					value = false;
					break;
			}
			return value;
		}
		
		this.set_val = function(new_val){
			switch (internal.$e.get(0).nodeName.toLowerCase()) {
				case "input":
					switch (internal.$e.attr("type")) {
						case "radio":
						case "checkbox":
							if(new_val){
								internal.$e.attr("checked",true);
							} else {
								internal.$e.removeAttr("checked")
							}
							break;
						default:
							if(new_val){
								internal.$e.val(new_val);
							} else {
								internal.$e.get(0).value = '';
							}
							break;
					}
					break;
				case "textarea":
					if(new_val){
						internal.$e.val(new_val);
					} else {
						internal.$e.get(0).value = '';
					}
					break;
				case "select":
					internal.$e.find("option[value=-1]").attr('selected',true).siblings().removeAttr('selected');
					break;
				default:
					break;
			}
			internal.$e.trigger('change');
			return new_val;
		}
		
		init(this);
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Input = Input;
	
}(this, this.jQuery));