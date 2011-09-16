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
		
		init(this);
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Input = Input;
	
}(this, this.jQuery));