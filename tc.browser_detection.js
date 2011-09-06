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
	    
	function BrowserDetection(options) {
		var o;
		
		o = $.extend({
			addClassToBody:true,
			orientationListen:true,
			detectWebApp:true
		}, options);
		
		elements = {
			body:$('body')
		}
		
		function init(){
			if (navigator.userAgent.match(/iPad/i) != null) {
				if(o.addClassToBody){
					elements.body.addClass('browser-ipad');
				};
				if(o.orientationListen){
					listenToOrientationChange();
				};
				if(o.detectWebApp){
					if (window.navigator.standalone) { elements.body.addClass('ios-webapp') }
				}
			} else if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
				if(o.addClassToBody){
					elements.body.addClass('browser-iphone');
				};
				if(o.orientationListen){
					listenToOrientationChange();
				};
				if(o.detectWebApp){
					if (window.navigator.standalone) { elements.body.addClass('ios-webapp') }
				}
			}
		};
		
		function listenToOrientationChange() {
			window.onorientationchange = function(){
				var orientation = window.orientation;
				orientationChanged(orientation)
			};	
			function orientationChanged(orientation) {
				if (orientation === 0){
					elements.body.removeClass('portrait landscape').addClass('portrait');
				} else if (orientation === 180){
					elements.body.removeClass('portrait landscape').addClass('portrait');
				} else if (orientation === 90){
					elements.body.removeClass('portrait landscape').addClass('landscape');
				} else if (orientation === -90){
					elements.body.removeClass('portrait landscape').addClass('landscape');
				}
			};
			orientationChanged(window.orientation);
		};
		
		init();
		return this;
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.BrowserDetection = BrowserDetection;
	
}(this, this.jQuery));