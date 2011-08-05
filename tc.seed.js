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

	var NI = {},
	    fakeConsole;

	NI.ex = {
		
		checkStr: function(s) {
			var t = typeof s;
			if (t === "string") { return true; }
			throw new TypeError("Expected string, but found "+ t +" instead");
		},

		checkFn: function(fn) {
			if ($.isFunction(fn)) { return true; }
			throw new TypeError("Expected function, but found "+ typeof fn +" instead");
		},

		checkJQ: function(o) {
			if (o instanceof $) { return true; }
			throw new TypeError("Expected jQuery object, but found"+ typeof o +" instead");
		},
		
		checkJQNode: function($c, type) {
			NI.ex.checkJQ($c);
			type = type.toLowerCase();
			if ($c.length === 1) {
				if ($c[0].nodeName.toLowerCase() === type) {
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
		
		isHeadless: function($c) {
			var node = $c[0];
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
			app.instances = {};
			app.events = $({});
			
			$.ajaxSetup({
				cache: false,
				error: function(xhr, status, error) {
					app.console.warn(status);
					if (error) {
						throw new Error(error);
					}
				}
			});
			
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
				fakeConsole = {
					info: $.noop,
					warn: $.noop,
					error: $.noop,
					log: $.noop
				};
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
			if (!app.instances) {
				app.instances = {};
			}
			if ($.isArray(env.features)) {
				$.each(env.features, function(i, o) {
					if (app.instances[o.feature]) {
						NI.app.getConsole(true).warn(o.feature +" already initialized");
					} else if ($.isFunction(app[o.feature])) {
						app.instances[o.feature] = app[o.feature].call(app, o.options);
					}
				});
			}
		},
		
		eventPool: function() {
			var handlers;
			handlers = [];
			
			this.bind = function(fn) {
				if ($.isFunction(fn)) {
					handlers.push(fn);
				}
			};
			
			this.trigger = function(e, d) {
				$.each(handlers, function(i, handler) {
					if (e) {
						handler.call(e.target, e, d);
					} else {
						handler(d);
					}
				});
			};
			
			return this;
		}
	};

	NI.fn = {

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