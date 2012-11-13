/* ============================================================================

 >4SESz.,     _,     ,gSEE2zx.,_        .azx                    ,w.
@Sh. "QEE3.  JEE3.  &ss  `*4EEEEE2x.,_  "EEV  ,aS5^;dEEEE2x.,   VEEF  _
\E2`_,gF4EEEx.?jF   EE5L       `*4EEEEE2zpn..ZEEF ;sz.  `*EEESzw.w* '|EE.
  ,dEEF   `"?j]  _,_   ,_  _,     _,.     L.EEEF  !EEF  _,,  `"``    EE7   ,,_
 :EEE7 ,ws,`|EEL`JEEL`JEE)`JEEL zE5` E3. / [EE3  ,w.  zE2` Ek .zE5^JZE3.,6EF [3
 {EEE. VEE7.EE2  AE3. EEV  ZEEL{EEL ws. ;  [EE1  EEEt{E3. JEELEE3. JE5LJEEF ,w,
  \EEk,,>^ JEEL,@EEF ZE5L,ZE5^ "Q3. V2`.    \EEk,,J' "Q[ yE2^ VE[_zEE[,"QEL V5F
          ,ss  :EE7 ;EEF               L,szzw..            ,.,            ``
          \E5.,E5F  EE1.              /; ``*4EEEZhw._      EEEL
            ````     ``              JEEE.     `"45EEEhw.,,,]

From 2010 till ∞
typecode-js v 0.1
*/

define(['jquery', 'NIseed'], function($) {
	
	var window = this,
	NI = window.NI;
	
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
		};
		
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
	
});