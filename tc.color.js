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
	    
	function Color(options) {
		
	}
	
	Color.prototype = {
		getRGBFromHex:function(index,hex){
			if(index.toLowerCase() == "r"){
				return parseInt((this.cutHex(hex)).substring(0,2),16);
			} else if(index.toLowerCase() == "g"){
				return parseInt((this.cutHex(hex)).substring(2,4),16);
			} else if(index.toLowerCase() == "b"){
				return parseInt((this.cutHex(hex)).substring(4,6),16);
			}
		},
		cutHex:function(h){
			return (h.charAt(0)=="#") ? h.substring(1,7) : h;
		}
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Color = Color;
	
}(this, this.jQuery));