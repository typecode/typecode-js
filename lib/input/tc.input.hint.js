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
	
	function InputHint(options) {
		var o, internal;
		
		o = $.extend({
			text:null,
			input:null,
			css:{
				top:0,
				left:0
			}
		}, options);
		
		internal = {
			dom:$('<div class="tc-input-hint"></div>'),
			text:null,
			input:null
		};
		
		function init(me){
			if(!o.text){ return; }
			if(!o.input){ return; }
			
			internal.text = o.text;
			internal.input = o.input;
			
			internal.dom.css($.extend({
				position:'absolute',
				top:0,
				left:0,
				display:'none'
			},o.css));
			
			internal.dom.append(internal.text);
			internal.input.get_dom().parent().append(internal.dom);
			
			internal.input.get_dom().bind('focus',{},function(e,d){
				internal.dom.hide();
			});
			
			internal.input.get_dom().bind('blur keyup change',{},function(e,d){
				if($(this).val().length){
					internal.dom.hide();
				} else {
					if(e.type == 'blur'){
						internal.dom.show();
					}
				}
			});
			
			if(!internal.input.get_dom().val().length){
				internal.dom.show();
			}
		};
		
		init(this);
		
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.InputHint = InputHint;
	
}(this, this.jQuery));