/*    _____                    _____          
     /\    \                  /\    \         
    /::\    \                /::\    \        
    \:::\    f\              /::::\    \       
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
	
	var NI = window.NI,
	    in;
	
	in = {
		extensions: {}
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// constants
	
	in.co = {
		
		BASE_CLASS: "tc-input",
		ACTIVE_CLASS: "state-active",
		DISABLED_CLASS: "state-disabled"
	};
		
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// base
	
	in._Base = function() {};
	in._Base.prototype = {
		
		_init: function(options) {
			var o;
			o = $.extend({
				$c: null,
				val: null,
				handlers: null,
				event_data: null,
				extensions: null
			}, options);
			
			this.$c = null;
			this.elements = {};
			this.internal = {};
			
			this[o.$c ? "generate_from_dom" : "generate_from_scratch"](o);
			
			if (o.handlers) {
				this.add_handlers(o.handlers, o.event_data || {});
			}
			
			if (o.extensions) {
				this.apply_extensions(o.extensions);
			}
			
			if (o.value) {
				this.set_val(val, true);
			}
		},
		
		// (chainable)
		apply_extensions: function(extensions) {
			var me = this;
			$.each(o.extensions, function(extension, config) {
				if ($.isFunction(in.extensions[extension])) {
					me.internal[extension] = new in.extensions[extension](me, config);
				}
			});
			return this;
		},
		
		generate_from_dom: function(options) {
			this.$c = options.$c.addClass(in.co.BASE_CLASS);
		},
		
		generate_from_scratch: function(options) {},
		
		get_val: function() {
			return null;
		},
		
		// (chainable)
		set_val: function(val, prevent_change) {
			var from;
			from = this.get_val();
			
			this._set_val(val);
			
			if (!prevent_change) {
				this.$c.trigger("change", {
					from: from,
					to: val
				});
			}
			
			return this;
		},
		
		_set_val: function(val) {},
		
		// (chainable)
		add_handler: function(type, data, fn, replace) {
			if (replace) {
				this.$c.unbind(type);
			}
			this.$c.bind(type, data, fn);
			return this;
		},
		
		// (chainable)
		add_handlers: function(handlers, data, replace) {
			var i;
			for (i in handlers) {
				this.add_handler(i, data, handlers[i], replace);
			}
			return this;
		},
		
		// (chainable)
		set_enabled: function(enabled) {
			return this;
		},
		
		destroy: function() {
			
		}
		
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// utils and factories

	in.module = function(options) {
		var o;
		
		o = $.extend({
			name: null,
			base: in._Base,
			proto: {}
		}, options);
		
		in[o.name] = function(config) {
			this._base = o.base.prototype;
			this._init(config);
			return this;
		};
		in[o.name].prototype = $.extend({}, o.base.prototype, o.proto);
		
		return in[o.name];
	};
	
	in.factory = function(options) {
		
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// modules

// modules with names starting with "_Base" are abstract

	in.module({
		name: "_BaseText",
		
		proto: {
			get_val: function() {
				return this.elements.input.val();
			},

			_set_val: function(val) {
				this.elements.input.val(val ? val : "");
			},
			
			set_enabled: function(enabled) {
				if (enabled) {
					this.elements.input.attr("disabled", true);
				} else {
					this.elements.input.removeAttr("disabled");
				}
				return this;
			}
		}
	});
	
	in.module({
		name: "TextInput",
		
		base: in._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='text']", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><input type='text'></div>").addClass(in.co.BASE_CLASS);
				this.elements.input = $("input[type='text']", this.$c);
			}
		}
	});
	
	in.module({
		name: "Password",
		
		base: in._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='password']", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><input type='password'></div>").addClass(in.co.BASE_CLASS);
				this.elements.input = $("input[type='password']", this.$c);
			}
		}
	});
	
	in.module({
		name: "TextArea",
		
		base: in._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("textarea", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><textarea></textarea></div>").addClass(in.co.BASE_CLASS);
				this.elements.input = $("textarea", this.$c);
			}
		}
	});
	
	in.module({
		name: "_BaseControl",
		
		proto: {
			get_val: function() {
				return this.elements.input.attr("checked") ? 
					"true" : "false";
			},

			_set_val: function(val) {
				if (val) {
					this.elements.input.attr("checked", true);
				} else {
					this.elements.removeAttr("checked");
				}
			},
		
			set_enabled: function(enabled) {
				return in._BaseText.prototype.set_enabled.apply(this, arguments);
			}
		}
	});
	
	in.module({
		name: "Radio",
		
		base: in._BaseControl,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='radio']", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><input type='radio'></div>").addClass(in.co.BASE_CLASS);
				this.elements.input = $("input[type='radio']", this.$c);
			}
		}
	});
	
	in.module({
		name: "Checkbox",
		
		base: in._BaseControl,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='checkbox']", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><input type='radio'></div>").addClass(in.co.BASE_CLASS);
				this.elements.input = $("input[type='checkbox']", this.$c);
			}
		}
	});
	
	in.module({
		name: "SingleSelect",
		
		proto: {
			
			_init: function(options) {
				var o;
				this._base._init.apply(this, arguments);
				o = $.extend({
					empty_val: "-1"
				}, options);
				this.internal.empty_val = options.empty_val;
			},
			
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.select = $("select", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><select></select></div>").addClass(in.co.BASE_CLASS);
				this.elements.select = $("select", this.$c);
				if (options.value_list) {
					this.populate(options.value_list);
				}
			},
			
			// (chainable)
			populate: function(value_list) {
				var buf;
				this.elements.select.empty();
				
				if ($.isFunction(value_list)) {
					this.elements.select.append(value_list());
					return this;
				}
				
				buf = "";
				$.each(value_list, function(value, text) {
					buf += "<option value='"+ value +"'>"+ text +"</option>";
				});
				this.elements.select.append(buf);
				return this;
			},
			
			get_val: function() {
				var $option;
				$option = this.elements.find("option:selected");
				if ($option.length) {
					return $option.attr("value");
				}
				return this.internal.empty_val;
			},
			
			_set_val: function(val) {
				if (val) {
					this.elements.select.find("option[value="+ val +"]").attr("selected", true);
				} else {
					this.elements.select.find("option").attr("selected", false);
				}
			},
		
			set_enabled: function(enabled) {
				if (enabled) {
					this.elements.select.attr("disabled", true);
				} else {
					this.elements.select.removeAttr("disabled");
				}
				return this;
			}
		}
	});
	
	in.module({
		name: "Dropdown",
		
		proto: {
			
			_init: function(options) {
				var o;
				
				this._base._init.apply(this, arguments);
				o = $.extend({
					empty_val: "-1"
				}, options);
				
				this.internal.empty_val = options.empty_val;
				
				this.elements.display = $(".display", this.$c);
				this.elements.menu = $(".menu", this.$c);
			},
			
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.$c.addClass("tc-dropdown");
			},
			
			generate_from_scratch: function(options) {
				this.$c = $("<div></div>").addClass(in.co.BASE_CLASS);
				this.$c.addClass("tc-dropdown");
				if (options.value_list) {
					this.populate(options.value_list);
				}
			},
			
			set_enabled: function(enabled) {
				if (enabled) {
					this.$c.removeClass(in.co.DISABLED_CLASS);
				} else {
					this.close();
					this.$c.addClass(in.co.DISABLED_CLASS);
				}
				return this;
			},
			
			// (chainable)
			populate: function(value_list) {
				return this;
			},
			
			// (chainable)
			open: function() {
				if (this.$c.hasClass(in.co.DISABLED_CLASS)) {
					return this;
				}
				if (this.elements.menu.children().length) {
					this.elements.menu.show();
				}
				return this;
			},
			
			// (chainable)
			close: functiono() {
				this.elements.menu.hide();
				return this;
			}
			
		}
	});
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.input = $.extend(NI.in || {}, in);
	
}(this, this.jQuery));