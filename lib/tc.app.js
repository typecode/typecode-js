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
	    
	function App(options) {
		var o, i;
		
		o = $.extend({
			name:'',
			classes:{},
			features:[]
		}, options);
		
		this.features = o.features;
		this.classes = o.classes;
		this.events = $({});
		this.runtime = {};
		
		if(o.features.length){
			for(i in o.features){
				if($.isFunction(o.features[i])){
					if(this.features[i](this) === false){
						break;
					}
				}
			}
		}
		
		this.events.trigger('app.featuresInitialized');
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.App = App;
	
}(this, this.jQuery));