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

// Dependencies:
// NI.field

define(['jquery', 'NIseed', 'NIfield'], function($) {
	
	var window = this,
	NI = window.NI,
	field = NI.field;
	
	field.synthesize({
		name: "Dropdown",
		
		props: {
			CONTAINER_CLASS: "tc-dropdown",
			DISPLAY_CLASS: "display",
			TRIGGER_ARROW_CLASS: "trigarr",
			MENU_CLASS: "menu",
			ITEM_CLASS: "item",

			morph_native_select: function($f) {
				var $e, buf;

				if(!$f[0]){
					return $f;
				}

				if ($f[0].nodeName.toLowerCase() != "select") {
					return $f;
				}

				$e = $("<div></div>")
						.addClass(field.co.BASE_CLASS+ " " +field.Dropdown.CONTAINER_CLASS)
						.html("<div class='"+ field.Dropdown.DISPLAY_CLASS +"'></div>"+
							"<div class='"+ field.Dropdown.MENU_CLASS +"'></div>");
				
				buf = "";
				$f.find("option").each(function() {
					var $option = $(this);
					buf += "<div data-value='"+ $option.attr("value") +"' class='"+ field.Dropdown.ITEM_CLASS +"'>"+
						field.get_display_text($option) +"</div>";
				});
				$e.find("."+ field.Dropdown.MENU_CLASS).html(buf);

				if (!NI.ex.isHeadless($f)) {
					$f.replaceWith($e);
				}

				return $e;
			}
			
		},
		
		proto: {
			
			options: {
				item_generator: null,
				item_handlers: {
					click: function(e) {
						e.data.me.set_val(e.data.$item.attr(field.co.VALUE)).close();
					}
				},
				
				empty_val: "-1",
				empty_text: "&nbsp;",
				
				circular: true,
				filtering: true,
				rolling: false,
				enable_update_display: true,
				
				on_open: function(instance) {},
				on_close: function(instance) {},
				on_keydown: function(e) {},
				
				fx: {
					open: function($menu, callback) {
						$menu.slideDown(100, function() {
							if ($.isFunction(callback)) {
								callback();
							}
						});
					},
					close: function($menu) {
						$menu.slideUp(100);
					}
				}
			},
			
			_init: function() {
				
				this.events.click = function(e) {
					var me = e.data.me;
					
					if (me.$e[0] === e.target || $.contains(me.$e[0], e.target)) {
						// clicked somewhere on the dropdown
						
						if (me.elements.display[0] === e.target ||
							$.contains(me.elements.display[0], e.target) ||
							(me.elements.trigarr && me.elements.trigarr[0] === e.target)) {
							
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

				if (options.$e[0].nodeName.toLowerCase() == "select") {
					this.$e = field.Dropdown.morph_native_select(options.$e);
				} else {
					this.$e = options.$e;
				}

				this.$e.addClass(field.co.BASE_CLASS);
				this.$e.addClass(field.Dropdown.CONTAINER_CLASS);

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
				this.$e = $("<div></div>")
					.addClass(field.co.BASE_CLASS+ " " +field.Dropdown.CONTAINER_CLASS)
					.html("<div class='"+ field.Dropdown.DISPLAY_CLASS +"'></div>"+
						"<div class='"+ field.Dropdown.MENU_CLASS + "'></div>");
				this._init_elements();
				if (options.value_list) {
					this.populate(options.value_list);
				}
			},
			
			_init_elements: function() {
				var trigarr;
				this.elements.display = $("."+ field.Dropdown.DISPLAY_CLASS, this.$e);
				this.elements.menu = $("."+ field.Dropdown.MENU_CLASS, this.$e);
				trigarr = $("."+field.Dropdown.TRIGGER_ARROW_CLASS , this.$e);
				if (trigarr.length) {
					this.elements.trigarr = trigarr;
				}
				this.events.visible = function() {

				};
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

				$item.addClass(field.Dropdown.ITEM_CLASS);

				if (typeof(this.internal.o.item_handlers) === "object") {
					$.each(this.internal.o.item_handlers, function(type, fn) {
						$item.bind(type, {me: me, $item: $item}, fn);
					});
				}

				this.elements.menu.append($item);
				return this;
			},
			
			get_items: function(include_secrets) {
				var $items = this.elements.menu.find("."+ field.Dropdown.ITEM_CLASS);
				if ($.isFunction(include_secrets)) {
					$items = $items.filter(include_secrets);
				} else if (!include_secrets) {
					$items = $items.filter(function() {
						return ($(this).css("display") !== "none");
					});
				}
				return $items;
			},
			
			get_active_item: function() {
				var $item;
				$item = this.get_items(true).filter("."+ field.co.ACTIVE_CLASS);
				return $item.length ? $item : false;
			},

			reset: function(){
				this.set_val('-1');
				this.event_receiver.trigger(field.co.RESET_EVENT);
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
				
				if (val === this.internal.o.empty_val) {
					this.clear();
					return;
				}
				
				$items = this.get_items(true);
				
				$items.each(function(i) {
					var $item = $(this);
					if ($item.attr(field.co.VALUE) == val) {
						if (!me.internal.multi) {
							$items.removeClass(field.co.ACTIVE_CLASS);
						} else {
							$item.children("input").attr("checked", true);
						}
						$item.addClass(field.co.ACTIVE_CLASS);
						if(me.internal.o.enable_update_display){
							me._update_display($item);
						}
						return false;
					}
				});
			},
			
			// (chainable)
			move_selection: function(direction) {
				var me, $t, $items, $active_item, index;
				me = this;
				
				$items = this.get_items(this.internal.o.rolling ? true : false);
				if (!$items.length) {
					return this;
				}
				
				$active_item = this.get_active_item();
				
				if (!$active_item || $active_item === this.internal.o.empty_val) {
					if (direction === NI.co.directions.UP) {
						$t = $items.last();
					} else {
						$t = $items.first();
					}
				} else {
					index = $items.index($active_item.last());
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
				
				return this.internal.multi ? this.toggle_item($t) : this.set_val($t.attr(field.co.VALUE));
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
					this.elements.display.html("<span class='"+ field.co.MSG_CLASS +"'>"+ arguments[0] +"</span>");
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
					this.$e.removeClass(field.co.DISABLED_CLASS);
				} else {
					this.close();
					this.internal.enabled = false;
					this.$e.addClass(field.co.DISABLED_CLASS);
				}
				return this;
			},
			
			// (chainable)
			open: function() {
				if (this.internal.enabled === false) {
					return this;
				}
				if (this.get_items()) {
					if (this.internal.o.fx && $.isFunction(this.internal.o.fx.open)) {
						this.internal.o.fx.open(this.elements.menu, this.events.visible);
					} else {
						this.elements.menu.show();
						this.events.visible();
					}
					this.$e.addClass(field.co.OPEN_CLASS);
					$(window.document).bind("keydown."+ this._name, {me: this}, this.events.keydown);
					this.internal.open = true;
					this.$e.trigger('tc-field-dropdown-open');
					if ($.isFunction(this.internal.o.on_open)) {
						this.internal.o.on_open(this);
					}
				}
				return this;
			},
			
			// (chainable)
			close: function() {
				if (this.internal.o.fx && $.isFunction(this.internal.o.fx.close)) {
					this.internal.o.fx.close(this.elements.menu);
				} else {
					this.elements.menu.hide();
				}
				this.$e.removeClass(field.co.OPEN_CLASS);
				$(window.document).unbind("keydown."+ this._name, this.events.keydown);
				this.internal.open = false;
				this.clear_filter();
				this.$e.trigger('tc-field-dropdown-close');
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
					return ($item.hasClass("state-filtered") || ($item.css("display") !== "none"));
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
	
	field.synthesize({
		name: "MultiDropdown",
		
		base: field.Dropdown,
		proto: {
			
			options: {
				item_handlers: {
					click: function(e) {
						e.data.me.toggle_item(e.data.$item);
					}
				},
				
				empty_val: [],
				
				circular: false,
				filtering: false
			},
			
			_init: function() {
				this.internal.multi = true;
				this._base._init.apply(this, arguments);
				this.get_items(true).each(function() {
					var $item = $(this);
					if ($item.hasClass(field.co.ACTIVE_CLASS)) {
						$item.children("input").attr("checked", true);
					} else {
						$item.children("input").removeAttr("checked");
					}
				});
			},
			
			get_val: function() {
				var $active, value_list;
				$active = this.get_active_item();
				if ($active) {
					value_list = [];
					$active.each(function() {
						value_list.push($(this).attr(field.co.VALUE));
					});
					return value_list;
				}
				return this.internal.o.empty_val;
			},
			
			// (chainable)
			toggle_item: function($item) {
				var value_list, val, index;
				
				value_list = this.get_val();
				val = $item.attr(field.co.VALUE);
				if (value_list === this.internal.o.empty_val) {
					return this.set_val(val);
				}
				index = $.inArray(val, value_list);
				if (index > -1) {
					value_list.splice(index, 1);
				} else {
					value_list.push(val);
				}
				return this.set_val(value_list);
			},
			
			_set_val: function(val) {
				var me = this, $items;
				
				if (!$.isArray(val)) {
					this._base._set_val.apply(this, arguments);
					return;
				}
				
				$items = this.get_items(true);
				
				$items.each(function() {
					var $item = $(this);
					$item.removeClass(field.co.ACTIVE_CLASS);
					$item.children("input").removeAttr("checked");
				});
				
				$.each(val, function(i, v) {
					$items.each(function(i) {
						var $item = $(this);
						if ($item.attr(field.co.VALUE) == v) {
							$item.addClass(field.co.ACTIVE_CLASS);
							$item.children("input").attr("checked", true);
							return false;
						}
					});
				});
				
				if(me.internal.o.enable_update_display){
					this._update_display();
				}
			},
			
			clear: function() {
				this.get_items(true).removeClass(field.co.ACTIVE_CLASS).children("input").removeAttr("checked");
				this._update_display(false);
				return this;
			},
			
			_update_display: function() {
				var display_list, $active, buf, i;
				
				if (arguments[0] instanceof $ && arguments[0].length > 1) {
					display_list = [];
					$.each(arguments[0], function() {
						display_list.push(field.get_display_text($(this)));
					});
					
				} else if (arguments[0] !== false && !arguments[0]) {
					$active = this.get_active_item();
					if ($active) {
						display_list = [];
						$active.each(function() {
							display_list.push(field.get_display_text($(this)));
						});
						
					} else {
						this._base._update_display.apply(this, [false]);
						return;
					}
					
				} else {
					this._base._update_display.apply(this, arguments);
					return;
				}
				
				buf = "";
				for (i = 0; i < display_list.length; i += 1) {
					buf += "<span>"+ display_list[i] +"</span>";
					if (i < display_list.length - 1) {
						buf += ", ";
					}
				}
				this.elements.display.html(buf);
			}
			
		}
	});
	
});