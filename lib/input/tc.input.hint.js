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
			$e:$('<div class="tc-input-hint"></div>'),
			text:null,
			input:null
		};
		
		function init(me){
			if(!o.text){ return; }
			if(!o.input){ return; }
			
			internal.text = o.text;
			internal.input = o.input;
			
			internal.$e.css($.extend({
				position:'absolute',
				top:0,
				left:0,
				display:'none'
			},o.css));
			
			internal.$e.append(internal.text);
			internal.input.get_dom().parent().append(internal.$e);
			
			internal.input.get_dom().bind('focus',{},function(e,d){
				internal.$e.fadeOut(200);
			});
			
			internal.$e.bind('click',{},function(e,d){
				internal.input.get_dom().trigger('focus');
			});
			
			internal.input.get_dom().bind('blur keyup change',{},function(e,d){
				if($(this).val().length){
					internal.$e.fadeOut(200);
				} else {
					if(e.type == 'blur'){
						internal.$e.fadeIn(200);
					}
				}
			});
			
			if(!internal.input.get_dom().val().length){
				internal.$e.fadeIn(200);
			}
		};
		
		init(this);
		
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.InputHint = InputHint;
	
}(this, this.jQuery));