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

// Dependencies:
// NI.field

(function(window, $) {
	
	var NI = window.NI,
	    field = NI.field;
	
	field.synthesize({
		name: "Dropdown",
		
		props: {
			container_class: "tc-dropdown"
		},
		
		proto: {
			
			options: {
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
				empty_text: "",
				
				circular: true,
				filtering: true,
				
				on_open: function(instance) {},
				on_close: function(instance) {},
				on_keydown: function(e) {}
			},
			
			_init: function() {
				
				this.events.click = function(e) {
					var me = e.data.me;
					
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
					if ($.isFunction(me.internal.o.on_keydown)) {
						if (me.internal.o.on_keydown(e) === false) {
							return;
						}
					}
					prevent_default = true;
					key = e.keyCode || e.which;
					
					if (key >= 48 && key <= 90) {
						if (me.internal.o.filtering) {
							me.internal.filter_str += String.fromCharCode(key);
							me.filter(me.internal.filter_str);
						}
						
					} else if (key == NI.co.keyboard.BACKSPACE ||
						       key == NI.co.keyboard.DELETE) {
						if (me.internal.filter_str.length) {
							me.clear_filter();
						}
						
					} else {
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
					}
					if (prevent_default) {
						e.preventDefault();
					}
				};
				
				$(window.document).bind("click."+ this._name, {me: this}, this.events.click);
				
				this.internal.filter_str = "";
				this._update_display(this.get_active_item());
				this.close();
			},
			
			generate_from_dom: function(options) {
				var me, $items;
				me = this;
				this._base.generate_from_dom.apply(this, arguments);
				this.$c.addClass(field[this._name].container_class);
				this._init_elements();
				$items = this.get_items(true);
				if (typeof(this.internal.o.item_handlers) === "object") {
					$.each(this.internal.o.item_handlers, function(type, fn) {
						$items.each(function() {
							var $item, empty_val;
							$item = $(this);
							if ($item.hasClass(field.co.EMPTY_CLASS)) {
								empty_val = $item.attr(field.co.VALUE);
								if (empty_val) {
									me.internal.o.empty_val = empty_val;
								}
								me.internal.o.empty_text = field.get_display_text($item);
								$item.remove();
								return true;
							} 
							$item.bind(type, {me: me, $item: $item}, fn);
						});
					});
				}
			},
			
			generate_from_scratch: function(options) {
				this.$c = $("<div></div>")
					.addClass(field.co.BASE_CLASS+ " " +field[this._name].container_class)
					.html("<div class='"+ this.internal.o.display_class +"'></div>"+
					      "<div class='"+ this.internal.o.menu_class + "'></div>");
				this._init_elements();
				if (options.value_list) {
					this.populate(options.value_list);
				}
			},
			
			_init_elements: function() {
				this.elements.display = $("."+ this.internal.o.display_class, this.$c);
				this.elements.menu = $("."+ this.internal.o.menu_class, this.$c);
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
			
			get_items: function(include_secrets) {
				var $items = this.elements.menu.find("."+ this.internal.o.item_class);
				if ($.isFunction(include_secrets)) {
					$items = $items.filter(include_secrets);
				} else if (!include_secrets) {
					$items = $items.filter(function() {
						return !($(this).css("display") === "none");
					});
				}
				return $items;
			},
			
			get_active_item: function() {
				var $item;
				$item = this.get_items(true).filter("."+ field.co.ACTIVE_CLASS);
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
				var me, $items;
				me = this;
				$items = this.get_items(true);
				
				$items.each(function(i) {
					var $item = $(this);
					if ($item.attr(field.co.VALUE) == val) {
						$items.removeClass(field.co.ACTIVE_CLASS);
						$item.addClass(field.co.ACTIVE_CLASS);
						me._update_display($item);
						return false;
					}
				});
			},
			
			// (chainable)
			move_selection: function(direction) {
				var me, $t, $items, $active_item, index;
				me = this;
				
				$items = this.get_items();
				if (!$items.length) {
					return this;
				}
				
				$active_item = this.get_active_item();
				
				if (!$active_item) {
					if (direction === NI.co.directions.UP) {
						$t = $items.last();
					} else {
						$t = $items.first();
					}
				} else {
					index = $items.index($active_item);
					if (direction === NI.co.directions.UP) {
						$t = $items.eq(index - 1);
						if (!$t.length) {
							$t = this.internal.o.circular ? $items.last() : $items.first();
						}
					} else {
						$t = $items.eq(index + 1);
						if (!$t.length) {
							$t = this.internal.o.circular ? $items.first() : $items.last();
						}
					}
				}
				
				return this.set_val($t.attr(field.co.VALUE));
			},
			
			// (chainable)
			clear: function() {
				this.get_items(true).removeClass(field.co.ACTIVE_CLASS);
				this._update_display(false);
				return this;
			},
			
			// arguments can be:
			//
			// $ obj => the active item to display
			// OR
			// str => arbitrary message to display
			// OR
			// false => display the empty state
			_update_display: function() {
				
				if (arguments[0] instanceof $) {
					this.elements.display.html(field.get_display_text(arguments[0]));
					return;
				}
				
				if (typeof arguments[0] === "string") {
					this.elements.display.html("<span>"+ arguments[0] +"</span>");
					return;
				}
				
				if (arguments[0] === false) {
					this.elements.display.html("<span class='"+ field.co.EMPTY_CLASS +"'>"+ this.internal.o.empty_text +"</span>");	
					return;
				}
			},
			
			// (chainable)
			set_enabled: function(enabled) {
				if (enabled) {
					this.internal.enabled = true;
					this.$c.removeClass(field.co.DISABLED_CLASS);
				} else {
					this.close();
					this.internal.enabled = false;
					this.$c.addClass(field.co.DISABLED_CLASS);
				}
				return this;
			},
			
			// (chainable)
			open: function() {
				if (this.internal.enabled === false) {
					return this;
				}
				if (this.get_items()) {
					this.elements.menu.show();
					this.$c.addClass(field.co.OPEN_CLASS);
					$(window.document).bind("keydown."+ this._name, {me: this}, this.events.keydown);
					this.internal.open = true;
					if ($.isFunction(this.internal.o.on_open)) {
						this.internal.o.on_open(this);
					}
				}
				return this;
			},
			
			// (chainable)
			close: function() {
				this.elements.menu.hide();
				this.$c.removeClass(field.co.OPEN_CLASS);
				$(window.document).unbind("keydown."+ this._name, this.events.keydown);
				this.internal.open = false;
				this.clear_filter();
				if ($.isFunction(this.internal.o.on_close)) {
					this.internal.o.on_close(this);
				}
				return this;
			},
			
			// (chainable)
			filter: function(text) {
				var me, $items, s;
				me = this;
				$items = this.get_items(function() {
					var $item = $(this);
					return ($item.hasClass("state-filtered") || !($item.css("display") === "none"));
				});
				if (!$items.length) {
					return this;
				}
				if (!text) {
					$items.each(function() {
						$(this).removeClass("state-filtered").show();
					});
					return this;
				}
				s = new RegExp(text, "gi");
				$items.each(function() {
					var $item = $(this);
					if (field.get_display_text($item).search(s) === -1) {
						$item.addClass("state-filtered").hide();
					} else {
						$item.removeClass("state-filtered").show();
					}
				});
				return this;
			},
			
			// (chainable)
			clear_filter: function() {
				this.internal.filter_str = "";
				return this.filter();
			},
			
			destroy: function() {
				this.close();
				$(window.document).unbind("click."+ this._name, this.events.click);
				this._base.destroy.apply(this, arguments);
			}
		}
	});
	
}(this, this.jQuery));