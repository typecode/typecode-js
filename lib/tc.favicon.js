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
	    
	function Favicon(options) {
		var o;
		
		o = $.extend({
			fps:5
		}, options);
		
		internal = {
			interval:0.0
		}
		
		function init(){
			internal.interval = 1000/o.fps;
		}
		
		var elements = {
			head:document.getElementsByTagName("head")[0]
		};
		
		//following is from http://softwareas.com/dynamic-favicons
		var functions = {
			change: function(iconURL) {
				if (arguments.length==2) {
					document.title = optionalDocTitle;
				}
				this.addLink(iconURL, "icon");
				this.addLink(iconURL, "shortcut icon");
			},
			addLink: function(iconURL, relValue) {
				var link = document.createElement("link");
				link.type = "image/x-icon";
				link.rel = relValue;
				link.href = iconURL;
				this.removeLinkIfExists(relValue);
				elements.head.appendChild(link);
			},
			removeLinkIfExists: function(relValue) {
				var links = elements.head.getElementsByTagName("link");
				for (var i=0; i<links .length; i++) {
					var link = links[i];
					if (link.type=="image/x-icon" && link.rel==relValue) {
						elements.head.removeChild(link);
						return; // Assuming only one match at most.
					}
				}
			}
		};
		
		//Public
		this.setFavicon = function(path){
			functions.change(path);
		};
		
		init();
		return this;
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Favicon = Favicon;
	
}(this, this.jQuery));