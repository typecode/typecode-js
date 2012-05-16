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

(function(window, $) {
	
	var NI = window.NI,
	    delegates = {};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	delegates.DropdownAutocomplete = function(field, options) {
		var me, o;
		
		me = this;
		o = $.extend({
			
		}, options);
		
		function init() {
			
		}
		
		init();
	};
	
	delegates.TextInputAutocomplete = function(field, options) {
		var me, o, internal;
		
		me = this;
		o = $.extend({
			menu_class: "autocomplete menu",
			menu_markup: null,
			
			item_generator: null,
			event_data: {},
			on_item_pick: function(e, d) {},
			item_class: "tc-menu-item",
			
			data_source: null,
			request_filter_param: "term",
			
			circular: true
		}, options);
		
		internal = {
			menu_open: false,
			menu_engaged: false,
			data_source:o.data_source
		};
		
		function init() {
			field.elements.menu = $((o.menu_markup ? o.menu_markup : "<div class='"+ o.menu_class +" item-wrapper'></div>"));
			if(!field.elements.menu.hasClass(o.menu_class)){ field.elements.menu.addClass(o.menu_class); }
			field.elements.item_wrapper = (field.elements.menu.hasClass('item-wrapper') ? field.elements.menu : field.elements.menu.find('.item-wrapper'));
			hide();
			field.$e.append(field.elements.menu);
			
			field.event_receiver.bind("keyup", $.extend({field: field}, o.event_data), events.keyup)
			                    .bind("focus", $.extend({field: field}, o.event_data), events.focus)
			                    .bind("blur", $.extend({field: field}, o.event_data), events.blur)
			                    .bind("change", $.extend({field: field}, o.event_data), events.change);
			
			field.elements.menu.bind("mouseover", function() {
				internal.menu_engaged = true;
			}).bind("mouseout", function() {
				internal.menu_engaged = false;
			});
		}
		
		var events = {
			keyup: function(e) {
				var key, val;
				
				key = e.keyCode || e.which;
				val = e.data.field.get_val();
				
				if (NI.ex.isEmpty(val)) {
					hide();
					return;
				}
				if (!(key >= 48 && key <= 90)) {
					return;
				}
				if (typeof internal.data_source === "string") { //URL
					request_data(val);
				} else if($.isArray(internal.data_source)){
					filter_array(val);
				}
			},
			keydown: function(e) {
				var prevent_default, key;
				
				prevent_default = true;
				key = e.keyCode || e.which;
				
				switch (key) {
					case NI.co.keyboard.UP:
						move_selection(NI.co.directions.UP);
						break;
				
					case NI.co.keyboard.DOWN:
						move_selection(NI.co.directions.DOWN);
						break;
					
					case NI.co.keyboard.ENTER:
						
						// don't let the enter keypress trip up
						// other handlers
						e.stopImmediatePropagation();
						
						(function() {
							var $items, $active_item;
							
							$items = field.elements.item_wrapper.find("."+ o.item_class);
							if (!$items.length) {
								return;
							}
							$active_item = $items.filter("."+ NI.field.co.ACTIVE_CLASS);
							if ($active_item.length) {
								$active_item.last().trigger("click");
							}
						}());
						break;
					
					case NI.co.keyboard.ESCAPE:
						hide();
						break;
				
					default:
						prevent_default = false;
						break;
				}
				
				if (prevent_default) {
					e.preventDefault();
				}
			},
			focus: function(e) {
				var val;
				val = e.data.field.get_val();
				if (NI.ex.isEmpty(val)) {
					hide();
					return;
				}
				if (typeof internal.data_source === "string") { //URL
					request_data(val);
				} else if($.isArray(internal.data_source)){
					filter_array(val);
				}
			},
			blur: function(e) {
				if (!internal.menu_engaged) {
					hide();
				}
			},
			change: function(e){
				if ($.isFunction(o.on_change) && o.on_change.apply(this, arguments) !== false) {
					
				}
			}
		};
		
		function request_data(val) {
			var data = {};
			data[o.request_filter_param] = val;
			$.getJSON(internal.data_source, data, function(d) {
				populate_menu(d);
				show();
			});
		};

		function filter_array(val) {
			var data, filter, t_start;
			data = [];
			filter = new RegExp(val,"gi");

			$.each(internal.data_source,function(i,j){
				var my_start;
				my_start = j.label.search(filter);
				if(my_start == -1){
					return;
				}
				data.push(j);
			});
			
			populate_menu(data);
			show();
		};
		
		function populate_menu(d) {
			field.elements.item_wrapper.empty();
			$.each(d, function(i, item) {
				var $item;
				if ($.isFunction(o.item_generator)) {
					$item = o.item_generator(item,field.get_val());
				} else {
					$item = (function(my_item){
						return $('<div data-value="'+my_item.value+'">'+my_item.label+'</div>');
					})(item);
				}
				if(!$item){
					return;
				}
				if(!$item.hasClass(o.item_class) && !$item.find('.'+o.item_class).length){
					$item.addClass(o.item_class)
				}
				field.elements.item_wrapper.append($item);
			});
			field.elements.item_wrapper.find("."+ o.item_class).bind("click", $.extend({field: field}, o.event_data), function(e, d) {
				if (o.on_item_pick.apply(this, arguments) !== false) {
					hide();
					internal.menu_engaged = false;
				}
			});
		}
		
		function move_selection(direction) {
			var $t, $items, $active_item, index;
			
			$items = field.elements.item_wrapper.find("."+ o.item_class);
			if (!$items.length) {
				return;
			}
			$active_item = $items.filter("."+ NI.field.co.ACTIVE_CLASS);
			
			if (!$active_item.length) {
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
						$t = o.circular ? $items.last() : $items.first();
					}
				} else {
					$t = $items.eq(index + 1);
					if (!$t.length) {
						$t = o.circular ? $items.first() : $items.last();
					}
				}
			}
			
			$items.removeClass(NI.field.co.ACTIVE_CLASS);
			$t.addClass(NI.field.co.ACTIVE_CLASS);
		}
		
		function show() {
			field.elements.menu.show();
			internal.menu_open = true;
			field.event_receiver.bind("keydown.autocomplete_"+ field._name, {me: this}, events.keydown);
		}
		
		function hide() {
			field.elements.menu.hide();
			internal.menu_open = false;
			field.event_receiver.unbind("keydown.autocomplete_"+ field._name, events.keydown);
		}

		field.set_data_source = function(data_source){
			internal.data_source = data_source;
		};
		
		init();
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	NI.field.extensions.Autocomplete = function(field, options) {
		var me, o, delegate;
		
		me = this;
		o = $.extend({
			
		}, options);
		
		function init() {
			
			if ($.isFunction(delegates[field._name + "Autocomplete"])) {
				delegate = new delegates[field._name + "Autocomplete"](field, o);
			} else {
				throw new Error("Autocomplete does not support field type: "+ field._name);
			}
			
		}
		
		init();
	};

}(this, this.jQuery));