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

	function Favicon(options) {
		var o;
		
		o = $.extend({
			fps:5
		}, options);
		
		internal = {
			interval:0.0
		};
		
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
	
});