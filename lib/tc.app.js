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

if(!window.NI){
	window.NI = {
		constants: {}
	};
	window.console = (function() {
		if (typeof window.console !== "undefined" && typeof window.console.debug !== "undefined") {
			return window.console;
		}
		window.console = {};
		$.each(("assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn").split(","), function() {
			window.console[this] = $.noop;
		});
	})();
}

window.page = {
	classes:{},
	features:[]
};

//window.console = NI.app.getConsole(true);

(function(window, $) {
	
	var NI = window.NI;
	
	function App(options) {
		var o, i;
		
		o = $.extend({
			name:'',
			page:{
				classes: {},
				features: []
			},
			inner_page: {
				classes: {},
				features: []
			}
		}, options);
		
		this.classes = o.page.classes;
		this.events = $({});
		this.runtime = {};

		this.initialize_features(o.page.features);
		this.initialize_features(o.inner_page.features);
		o.page.initialized = true;
		
		this.events.trigger('app.featuresInitialized');
	}

	App.prototype.initialize_features = function(features) {
		var i;

		if(features.length){
			for(i = 0; i < features.length; i += 1){
				if($.isFunction(features[i])){
					if(features[i](this) === false){
						break;
					}
				}
			}
		}
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.App = App;
	
}(this, this.jQuery));