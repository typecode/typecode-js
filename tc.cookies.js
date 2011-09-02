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
                         From 2010 till ∞     */

(function(window, $) {
	
	var NI = window.NI;
	    
	function Cookies(options) {
		var o, internal_functions;
		
		o = $.extend({
			namespace:'',
			default_expires:new Date(((new Date()).getTime() + ((7)*24*60*60*1000)))
		}, options);
		
		internal_functions = {
			handleNamespace:function(key){
				if(o.namespace && o.namespace.length){
					key = o.namespace + '|' + key;
				}
				return key;
			},
			constructCookieString:function(key, value, expires){
				var string;
				string = this.handleNamespace(key) + '=' + value+'; expires=' + expires.toUTCString() + '; path=/';
				return string;
			},
			extractCookiesForRegex:function(regex){
				var ca, i, cookies;
				ca = document.cookie.split(';');
				cookies = [];
				for(i=0; i<ca.length ; i++) {
					ca[i] = $.trim(ca[i]);
					matches = ca[i].match(regex);
					if(matches){
						cookies.push({
							key:ca[i].split('=')[0].substring(o.namespace.length+1,ca[i].split('=')[0].length),
							value:ca[i].split('=')[1]
						});
					}
				}
				return cookies;
			}
		}
		
		this.o = o;
		this.internal_functions = internal_functions;
	}
	
	Cookies.prototype = {
		setCookie:function(key, value, expires){
			document.cookie = this.internal_functions.constructCookieString(key, (value ? value : ''), (expires ? expires : this.o.default_expires));
		},
		getCookie:function(key){
			return this.internal_functions.extractCookiesForRegex(new RegExp(this.internal_functions.handleNamespace(key)));
		},
		getAllCookies:function(){
			return this.internal_functions.extractCookiesForRegex(new RegExp(this.internal_functions.handleNamespace('')));
		},
		deleteCookie:function(key){
			this.setCookie(key,'',(new Date(-1)));
		}
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Cookies = Cookies;
	
}(this, this.jQuery));