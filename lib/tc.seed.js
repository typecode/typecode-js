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

(function(window, $) {

	var NI = {},
	    fakeConsole;

	NI.ex = {
		
		checkStr: function(s) {
			var t = typeof s;
			if (t === "string") { return true; }
			//throw new TypeError("Expected string, but found "+ t +" instead");
			console.error("Expected string, but found '"+ String(t) +"' instead");
		},

		checkFn: function(fn) {
			if ($.isFunction(fn)) { return true; }
			//throw new TypeError("Expected function, but found "+ typeof fn +" instead");
			console.error("Expected function, but found '"+ typeof fn +"' instead");
		},

		checkJQ: function(o) {
			if (o instanceof $) { return true; }
			//throw new TypeError("Expected jQuery object, but found"+ typeof o +" instead");
			console.error("Expected jQuery object, but found '"+ typeof o +"' instead");
		},
		
		checkJQNode: function($e, type) {
			NI.ex.checkJQ($e);
			type = type.toLowerCase();
			if ($e.length === 1) {
				if ($e[0].nodeName.toLowerCase() === type) {
					return true;
				}
			}
			throw new TypeError("Expected jQuery object holding single "+ type +" element");
		},
		
		typeOf: function(v) {
			var s = typeof v;
			if (s === "object") {
				if (v) {
					if (typeof v.length === "number" &&
					    !(v.propertyIsEnumerable("length")) &&
					    typeof v.splice === "function") {
						s = "array";
					}
				} else {
					s = "null";
				}
			}
			return s;
		},
		
		isEmpty: function(v) {
			NI.ex.checkStr(v);
			return $.trim(v) ?
				false : true;
		},
		
		isHeadless: function($e) {
			var node = $e[0];
			if (!node.parentNode) {
				return true;
			}
			if (node.parentNode === NI.co.nodeTypes.DOCUMENT_NODE) {
				return true;
			}
			return false;
		}
	};

	NI.app = {
		
		bootstrap: function(app, options) {
			var o;
			o = $.extend({
				debug: false
			}, options);
			
			app.console = NI.app.getConsole(o.debug);
			app.classes = {};
			app.runtime = {};
			NI.fn.eventPool(app);
			
			app.console.info("::::::::::::: Starting application :::::::::::::");
			app.console.info((app.name || "") + " " + (app.version || ""));
			app.console.info("::::::::::::::::::::::::::::::::::::::::::::::::");
			
			return app;
		},
		
		getConsole: function(debug) {
			if (debug && typeof window.console !== "undefined" && 
			    typeof window.console.debug !== "undefined") {
				
				return window.console;
			}
			if (!fakeConsole) {
				fakeConsole = {};
				$.each(("assert,count,debug,dir,dirxml,error,exception,\
				group,groupCollapsed,groupEnd,info,log,markTimeline,\
				profile,profileEnd,time,timeEnd,trace,warn").split(","), function() {
					fakeConsole[this] = $.noop;
				});
			}
			return fakeConsole;
		},
	
		/**
		 * Initialize environment-specific components
		 * from an array of "feature" objects, each one
		 * of the form { feature: "foo", options: {} },
		 * which invokes app[foo](options)
		 */
		initAppFeatures: function(app, env) {
			if (!app.runtime) {
				app.runtime = {};
			}
			if ($.isArray(env.features)) {
				$.each(env.features, function(i, o) {
					if (app.runtime[o.feature]) {
						NI.app.getConsole(true).warn(o.feature +" already initialized");
					} else if ($.isFunction(app[o.feature])) {
						app.runtime[o.feature] = app[o.feature].call(app, o.options);
					}
				});
			}
		}
	};

	NI.fn = {

		// via http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
		loadScript: function(url, callback) {
			var script = window.document.createElement("script");
			script.type = "text/javascript";
			if (script.readyState) {
				script.onreadystatechange = function() {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						if ($.isFunction(callback)) {
							callback();
						}
					}
				};
			} else {
				script.onload = function() {
					if ($.isFunction(callback)) {
						callback();
					}
				};
			}
			script.src = url;
			window.document.getElementsByTagName("head")[0].appendChild(script);
		},

		extend: function(sub, base) {
			var F = function() {};
			F.prototype = base.prototype;
			sub.prototype = new F();
			sub.prototype.constructor = sub;
			sub.base = base.prototype;
			if (base.prototype.constructor === Object.prototype.constructor) {
				base.prototype.constructor = base;
			}
		},
	
		clone: function(o) {
			var F = function() {};
			F.prototype = o;
			return new F();
		},
		
		augment: function(dest, src) {
			var i;
			if (arguments[2]) {
				for (i = 2; i < arguments.length; i += 1) {
					dest.prototype[arguments[i]] = src.prototype[arguments[i]];
				}
			} else {
				for (i in src.prototype) {
					if (!dest.prototype[i]) {
						dest.prototype[i] = src.prototype[i];
					}
				}
			}
		},
		
		eventPool: function(target) {
			var events = $({});
			target.bind = function() {
				events.bind.apply(events, arguments);
			};
			target.unbind = function() {
				events.unbind.apply(events, arguments);
			};
			target.trigger = function() {
				events.trigger.apply(events, arguments);
			};
			return target;
		},
		
		guid: function(prefix) {
			return (prefix || "obj_")+ new Date().getTime();
		},
		
		randomElement: function(array) {
			if (NI.ex.typeOf(array) === "array" && array.length > 0) {
				return array[window.Math.floor(NI.math.random(array.length))];
			}
		}
	};

	NI.co = {
		
		keyboard: {
		
			BACKSPACE: 8,
			CAPS_LOCK: 20,
			COMMA: 188,
			CONTROL: 17,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			INSERT: 45,
			LEFT: 37,
			NUMPAD_ADD: 107,
			NUMPAD_DECIMAL: 110,
			NUMPAD_DIVIDE: 111,
			NUMPAD_ENTER: 108,
			NUMPAD_MULTIPLY: 106,
			NUMPAD_SUBTRACT: 109,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SHIFT: 16,
			SPACE: 32,
			TAB: 9,
			UP: 38
		},
		
		nodeTypes: {
			
			ELEMENT_NODE: 1,
			ATTRIBUTE_NODE: 2,
			TEXT_NODE: 3,
			CDATA_SECTION_NODE: 4,
			ENTITY_REFERENCE_NODE: 5,
			ENTITY_NODE: 6,
			PROCESSING_INSTRUCTION_NODE: 7,
			COMMENT_NODE: 8,
			DOCUMENT_NODE: 9,
			DOCUMENT_TYPE_NODE: 10,
			DOCUMENT_FRAGMENT_NODE: 11,
			NOTATION_NODE: 12
		},
		
		directions: {
			UP: 0,
			RIGHT: 1,
			DOWN: 2,
			LEFT: 3
		}
	};
	
	NI.math = {
		
		random: function() {
			if (arguments.length === 0) {
				return window.Math.random();
			} else if (arguments.length === 1) {
				return window.Math.random()*arguments[0];
			}
			return window.Math.random()*(arguments[1] - arguments[0]) + arguments[0];
		},
		
		round: function(n, places) {
			var p = window.Math.pow(10, places);
			return window.Math.round(n*p)/p;
		}
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	window.NI = NI;

}(this, this.jQuery));