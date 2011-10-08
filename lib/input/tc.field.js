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
	    field;
	
	field = {
		extensions: {} // hint, validation, autocomplete, etc (TODO)
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// constants
	
	field.co = {
		
		BASE_CLASS: "tc-field",
		ACTIVE_CLASS: "state-active",
		DISABLED_CLASS: "state-disabled",
		OPEN_CLASS: "state-open",
		
		VALUE: "data-value",
		TEXT: "data-text"
	};
		
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// base
	
// all field modules inherit from _Base
	
	field._Base = function() {};
	field._Base.prototype = {
		
		_init: function(options) {
			var o;
			o = this.internal.o ? 
				this.internal.o :
				$.extend({
					$c: null,
					val: null,
					handlers: null,
					event_data: null,
					extensions: null
				}, options);
			
			this[o.$c ? "generate_from_dom" : "generate_from_scratch"](o);
			
			if (o.handlers) {
				this.add_handlers(o.handlers, o.event_data || {me: this});
			}
			
			if (o.extensions) {
				this.apply_extensions(o.extensions);
			}
			
			if (o.value) {
				this.set_val(o.value, true);
			}
		},
		
		// (chainable)
		apply_extensions: function(extensions) {
			var me = this;
			$.each(extensions, function(extension, config) {
				if ($.isFunction(field.extensions[extension])) {
					me.internal[extension] = new field.extensions[extension](me, config);
				}
			});
			return this;
		},
		
		generate_from_dom: function(options) {
			this.$c = options.$c.addClass(field.co.BASE_CLASS);
		},
		
		generate_from_scratch: function(options) {},
		
		// (chainable)
		append_to: function() {
			if (!NI.ex.isHeadless(this.$c)) {
				this.$c = this.$c.detach();
			}
			
			if (typeof arguments[0] === "string") {
				$(arguments[0]).append(this.$c);
			} else if (arguments[0] instanceof $) {
				arguments[0].append(this.$c);
			}
			
			return this;
		},
		
		get_val: function() {
			return null;
		},
		
		// (chainable)
		set_val: function(val, prevent_change) {
			var from, to;
			from = this.get_val();
			
			if (this._set_val(val) !== false) {
				if (!prevent_change) {
					to = this.get_val();
					if (from !== to) {
						this.$c.trigger("change", {
							from: from,
							to: to
						});
					}
				}
			}
			
			return this;
		},
		
		_set_val: function(val) {},
		
		// (chainable)
		bind: function(type, data, fn, replace) {
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
				this.bind(i, data, handlers[i], replace);
			}
			return this;
		},
		
		// (chainable)
		set_enabled: function(enabled) {
			return this;
		},
		
		destroy: function() {
			this.$c.remove();
		}
		
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// utils and factories

	field.module = function(options) {
		var o;
		
		o = $.extend({
			name: null,
			base: field._Base,
			proto: {}
		}, options);
		
		field[o.name] = function(config) {
			this._name = o.name;
			this._base = o.base.prototype;
			this.$c = null;
			this.elements = {};
			this.events = {};
			this.internal = {};
			this._init(config);
			return this;
		};
		field[o.name].prototype = $.extend({}, o.base.prototype, o.proto);
		
		return field[o.name];
	};
	
	field.factory = function(options) {
		
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// modules

// modules with names starting with "_Base" are abstract

	field.module({
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
	
	field.module({
		name: "TextInput",
		
		base: field._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='text']", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><input type='text'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='text']", this.$c);
			}
		}
	});
	
	field.module({
		name: "Date",
		
		base: field._BaseText,
		proto: {}
	});
	
	field.module({
		name: "Password",
		
		base: field._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='password']", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><input type='password'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='password']", this.$c);
			}
		}
	});
	
	field.module({
		name: "TextArea",
		
		base: field._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("textarea", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><textarea></textarea></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("textarea", this.$c);
			}
		}
	});
	
	field.module({
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
					this.elements.input.removeAttr("checked");
				}
			},
		
			set_enabled: function(enabled) {
				return field._BaseText.prototype.set_enabled.apply(this, arguments);
			}
		}
	});
	
	field.module({
		name: "Radio",
		
		base: field._BaseControl,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='radio']", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><input type='radio'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='radio']", this.$c);
			}
		}
	});
	
	field.module({
		name: "Checkbox",
		
		base: field._BaseControl,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='checkbox']", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><input type='checkbox'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='checkbox']", this.$c);
			}
		}
	});
	
	field.module({
		name: "SingleSelect",
		
		proto: {
			
			_init: function(options) {
				this._base._init.apply(this, arguments);
				this.internal.o = $.extend({
					empty_val: "-1"
				}, options);
			},
			
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.select = $("select", this.$c);
			},

			generate_from_scratch: function(options) {
				this.$c = $("<div><select></select></div>").addClass(field.co.BASE_CLASS);
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
				return this.internal.o.empty_val;
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
	
	field.module({
		name: "Dropdown",
		
		proto: {
			
			_init: function(options) {
				
				this.internal.o = $.extend({
					container_class: "tc-dropdown",
					display_class: "display",
					menu_class: "menu",
					item_generator: null,
					item_handlers: {
						click: function(e) {
							e.data.me.set_val(e.data.$item.attr(field.co.VALUE)).close();
						}
					},
					item_class: "tc-dropdown-item",
					empty_val: "-1",
					circular: true
				}, options);
				
				this._base._init.apply(this, arguments);
				
				this.events.click = function(e) {
					var me, $t, $item;
					me = e.data.me;
					
					if (me.$c[0] === e.target || $.contains(me.$c[0], e.target)) {
						// clicked somewhere on the dropdown
						
						if (me.elements.display[0] === e.target || $.contains(me.elements.display[0], e.target)) {
							// clicked somewhere on the dropdown display area
							me[me.internal.open ? "close" : "open"]();
						}
						
					} else {
						// clicked somewhere off the dropdown
						if (me.internal.open) {
							me.close();
						}
					}
				};
				
				this.events.keydown = function(e) {
					var me, prevent_default, key;
					me = e.data.me;
					prevent_default = true;
					key = e.keyCode || e.which;
					switch (key) {
						case NI.co.keyboard.LEFT:
						case NI.co.keyboard.UP:
							me.move_selection(NI.co.directions.UP);
							break;
						
						case NI.co.keyboard.RIGHT:
						case NI.co.keyboard.DOWN:
							me.move_selection(NI.co.directions.DOWN);
							break;
							
						case NI.co.keyboard.ENTER:
						case NI.co.keyboard.ESCAPE:
							me.close();
							break;
						
						default:
							prevent_default = false;
							break;
					}
					if (prevent_default) {
						e.preventDefault();
					}
				};
				
				$(window.document).bind("click."+ this._name, {me: this}, this.events.click);
				
				this._update_display(this.get_active_item());
			},
			
			generate_from_dom: function(options) {
				var me, $items;
				me = this;
				this._base.generate_from_dom.apply(this, arguments);
				this.$c.addClass(this.internal.o.container_class);
				this.elements.display = $("."+ this.internal.o.display_class, this.$c);
				this.elements.menu = $("."+ this.internal.o.menu_class, this.$c);
				$items = this.elements.menu.find("."+ this.internal.o.item_class);
				if (typeof(this.internal.o.item_handlers) === "object") {
					$.each(this.internal.o.item_handlers, function(type, fn) {
						$items.each(function() {
							var $item = $(this);
							$item.bind(type, {me: me, $item: $item}, fn);
						});
					});
				}
			},
			
			generate_from_scratch: function(options) {
				this.$c = $("<div></div>")
					.addClass(field.co.BASE_CLASS+ " " +this.internal.o.container_class)
					.html("<div class='"+ this.internal.o.display_class +"'></div>"+
					      "<div class='"+ this.internal.o.menu_class + "'></div>");
				this.elements.display = $("."+ this.internal.o.display_class, this.$c);
				this.elements.menu = $("."+ this.internal.o.menu_class, this.$c);
				if (options.value_list) {
					this.populate(options.value_list);
				}
			},
			
			get_active_item: function() {
				var $item;
				$item = this.elements.menu.find("."+ this.internal.o.item_class +"."+ field.co.ACTIVE_CLASS);
				return $item.length ? $item : false;
			},
			
			get_val: function() {
				var $item;
				$item = this.get_active_item();
				if ($item) {
					return $item.attr(field.co.VALUE);
				}
				return this.internal.o.empty_val;
			},
			
			_set_val: function(val) {
				var me = this;
				
				this.elements.menu.find("."+ this.internal.o.item_class).each(function(i) {
					var $item = $(this);
					if ($item.attr(field.co.VALUE) == val) {
						$item.addClass(field.co.ACTIVE_CLASS)
							.siblings("."+ me.internal.o.item_class).removeClass(field.co.ACTIVE_CLASS);
						me._update_display($item);
						return false;
					}
				});
			},
			
			_update_display: function() {
				if (arguments[0] instanceof $) {
					this.elements.display.html(arguments[0].attr(field.co.TEXT) ? 
						arguments[0].attr(field.co.TEXT) : arguments[0].text());
					return;
				}
			},
			
			// (chainable)
			move_selection: function(direction) {
				var $t, $items, $active_item;
				$items = this.elements.menu.find("."+ this.internal.o.item_class);
				if (!$items.length) {
					return this;
				}
				$active_item = this.get_active_item();
				switch (direction) {
					case NI.co.directions.UP:
						if ($active_item) {
							$t = $active_item.prevAll().eq(0);
							if (!$t.length) {
								$t = this.internal.o.circular ? $items.last() : $items.first();
							}
						} else {
							$t = $items.last();
						}
						break;
					case NI.co.directions.DOWN:
					default:
						if ($active_item) {
							$t = $active_item.nextAll().eq(0);
							if (!$t.length) {
								$t = this.internal.o.circular ? $items.first() : $items.last();
							}
						} else {
							$t = $items.first();
						}
						break;
				}
				
				return this.set_val($t.attr(field.co.VALUE));
			},
			
			// (chainable)
			set_enabled: function(enabled) {
				if (enabled) {
					this.$c.removeClass(field.co.DISABLED_CLASS);
				} else {
					this.close();
					this.$c.addClass(field.co.DISABLED_CLASS);
				}
				return this;
			},
			
			// (chainable)
			populate: function(value_list) {
				var me;
				me = this;
				this.elements.menu.empty();
				
				if ($.isFunction(value_list)) {
					this.elements.menu.append(value_list());
					return this;
				}
				
				if (value_list instanceof $) {
					this.add_item(value_list);
					return this;
				}
				
				$.each(value_list, function(value, text) {
					me.add_item(value, text);
				});
				
				return this;
			},
			
			// (chainable)
			// arguments can be:
			//
			// 1 arg => jQuery object
			// OR
			// arguments for an item_generator
			// OR
			// 2 args => value, text
			add_item: function() {
				var me, $item;
				me = this;
				
				if (arguments[0] instanceof $) {
					$item = arguments[0];
					
				} else if ($.isFunction(this.internal.o.item_generator)) {
					$item = this.internal.o.item_generator(arguments);
					
				} else {
					$item = $("<div "+ field.co.VALUE +"='"+ arguments[0] +"'>"+ arguments[1] +"</div>");
				}
				
				$item.addClass(this.internal.o.item_class);
				
				if (typeof(this.internal.o.item_handlers) === "object") {
					$.each(this.internal.o.item_handlers, function(type, fn) {
						$item.bind(type, {me: me, $item: $item}, fn);
					});
				}
				
				this.elements.menu.append($item);
				return this;
			},
			
			// (chainable)
			open: function() {
				if (this.$c.hasClass(field.co.DISABLED_CLASS)) {
					return this;
				}
				if (this.elements.menu.find("."+ this.internal.o.item_class).length) {
					this.elements.menu.show();
					this.$c.addClass(field.co.OPEN_CLASS);
					$(window.document).bind("keydown."+ this._name, {me: this}, this.events.keydown);
					this.internal.open = true;
				}
				return this;
			},
			
			// (chainable)
			close: function() {
				this.elements.menu.hide();
				this.$c.removeClass(field.co.OPEN_CLASS);
				$(window.document).unbind("keydown."+ this._name, this.events.keydown);
				this.internal.open = false;
				return this;
			},
			
			find: function(val) {
				var $t;
				$t = false;
				this.elememts.menu.find("."+ this.internal.o.item_class).each(function() {
					var $item = $(this);
					if ($item.attr(field.co.VALUE) == val) {
						$t = $item;
						return false;
					}
				});
				return $t;
			},
			
			// (chainable)
			filter: function(text) {
				return this;
			},
			
			destroy: function() {
				this.close();
				$(window.document).unbind("click."+ this._name, this.events.click);
				this._base.destroy.apply(this, arguments);
			}
		}
	});
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	NI.field = field;
	
}(this, this.jQuery));