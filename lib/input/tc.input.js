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
			dom:null,
			data:{},
			hint:null,
			handlers:{
				focus:null,
				keyup:null,
				change:null,
				blur:null
			}
		}, options);
		
		internal = {
			
		};
		
		function init(me){
			if(!o.dom){ return; }
			
			console.log(o.dom);
			
			o.dom.wrap('<div class="tc-input">');
			internal.data = $.extend({},o.data,{input:me});
			handle_handlers();
			handle_hint();
			handle_counter();
		};
		
		function handle_handlers(){
			var i;
			if(!o.handlers){ return; }
			for(i in o.handlers){
				if($.isFunction(o.handlers[i])){
					o.dom.bind(i,internal.data,o.handlers[i]);
				}
			}
		};
		
		function handle_hint(){
			if(!NI.InputHint){ return; }
			if(!o.hint){ return; }
			
			internal.hint = new NI.InputHint({
				text:o.hint
			});
			
		}
		
		function handle_counter(){
			if(!NI.InputCounter){ return; }
			if(!o.counter){ return; }
		}
		
		init(this);
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Input = Input;
	
}(this, this.jQuery));