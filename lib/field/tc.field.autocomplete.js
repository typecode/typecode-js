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

define([
	'jquery',
	'lib/typecode-js/lib/tc.field'
], function($) {
	
	var NI = window.NI, delegates = {};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	// TODO
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
			on_populate: function(d, val) {},
			item_class: "tc-menu-item",
			
			auto_match: {
				key: "value",
				allow_different: false,
				value_transform: null
			},
			
			data_source: null,
			request_filter_param: "term",
			
			circular: true,
			highlight: true,
			activate_after_highlight_n: false,
			
			delay: 100,
			animation: 'slide',
			speed: 100
		}, options);
		
		internal = {
			menu_open: false,
			menu_engaged: false,
			data_source: o.data_source,
			request: null,
			timeout: null
		};
		
		function init() {

			field.elements.menu = $((o.menu_markup ? o.menu_markup : "<div class='"+ o.menu_class +" item-wrapper'></div>"));
			if(!field.elements.menu.hasClass(o.menu_class)){
				field.elements.menu.addClass(o.menu_class);
			}
			field.elements.item_wrapper = (field.elements.menu.hasClass('item-wrapper') ? field.elements.menu : field.elements.menu.find('.item-wrapper'));
			
			hide();
			field.$e.append(field.elements.menu);
			
			field.add_handlers({
				"keyup.autocomplete": events.keyup,
				"keydown.autocomplete": events.keydown,
				"focus.autocomplete": events.focus,
				"blur.autocomplete": events.blur,
				"change.autocomplete": events.change
			}, $.extend({field: field}, o.event_data));
			
			field.elements.menu.bind("mouseover.autocomplete", function() {
				internal.menu_engaged = true;
			}).bind("mouseout.autocomplete", function() {
				internal.menu_engaged = false;
			});
		}
				
		var events = {
			keyup: function(e) {
				var key, val;
				
				key = e.which;
				val = e.data.field.get_val();
				
				if (NI.ex.isEmpty(val)) {
					hide();
					return;
				}
				if (!(key >= 48 && key <= 90)) {
					if (key != NI.co.keyboard.BACKSPACE && key != NI.co.keyboard.DELETE) {
						return;
					}
				}
				
				dispatch(val);
			},
			keydown: function(e) {
				var prevent_default, key;
				
				prevent_default = true;
				key = e.which;
				
				switch (key) {
					case NI.co.keyboard.UP:
					case NI.co.keyboard.LEFT:
						if (internal.menu_open) {
							move_selection(NI.co.directions.UP);
						}
						break;
				
					case NI.co.keyboard.DOWN:
					case NI.co.keyboard.RIGHT:
					case NI.co.keyboard.TAB:
						if (internal.menu_open) {
							move_selection(NI.co.directions.DOWN);
						}
						break;
					
					case NI.co.keyboard.ENTER:
						if (e.data.field.select_active_item() === true) {
							// don't let the enter keydown trip up
							// other handlers (namely, from Merlin)
							e.stopImmediatePropagation();
						}
						break;
					
					case NI.co.keyboard.ESCAPE:
						if (internal.menu_open) {
							hide();
						}
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
				dispatch(val);
			},
			blur: function(e) {
				if (!internal.menu_engaged) {
					hide();
				}
			},
			change: function(e){
				if ($.isFunction(o.on_change) && o.on_change.apply(this, arguments) !== false) {
					
				}
			},
			// callback when the menu is shown
			visible: function() {
				
			}
		};
		
		function dispatch(val) {
			if (internal.timeout) {
				window.clearTimeout(internal.timeout);
				internal.timeout = null;
			}
			internal.timeout = window.setTimeout(function() {
				if (typeof internal.data_source === "string") { //URL
					request_data(val);
				} else if ($.isArray(internal.data_source)) {
					filter_array(val);
				}
			}, o.delay);
		}
		
		function request_data(val) {
			var data = {};
			
			if (internal.request) {
				internal.request.abort();
			}
			
			data[o.request_filter_param] = val;
			internal.request = $.getJSON(internal.data_source, data, function(d) {
				internal.request = null;
				if(populate_menu(d, val)){
					show();
				} else {
					hide();
				}
			});
		}

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
			
			if(populate_menu(data, val)){
				show();
			} else {
				hide();
			}
		}
		
		function populate_menu(d, val) {
			var wrap, items_added, $auto_match_item;
			items_added = 0;
			$auto_match_item = false;

			wrap = field.elements.item_wrapper;
			wrap.empty();
			
			$.each(d, function(i, item) {
				var $item;
				if ($.isFunction(o.item_generator)) {
					$item = o.item_generator(item, field.get_val());
				} else {
					$item = (function(my_item){
						return $('<div data-value="'+my_item.value+'" data-label="'+ my_item.label +'">'+my_item.label+'</div>');
					})(item);
				}
				if(!$item){
					return;
				}
				if(!$item.hasClass(o.item_class) && !$item.find('.'+o.item_class).length){
					$item.addClass(o.item_class);
				}
				
				if (o.highlight && val) {
					highlight($item, val);
				}
				
				wrap.append($item);
				items_added++;
				
				if (o.auto_match && !$auto_match_item) {
					$auto_match_item = auto_match($item, val);
				}
			});

			if (o.auto_match && $auto_match_item !== false) {
				wrap.append($auto_match_item);
			}
			
			wrap.find("."+ o.item_class).
				bind("click", $.extend({field: field}, o.event_data), function(e, d) {
					if (o.on_item_pick.apply(this, arguments) !== false) {
						hide();
						internal.menu_engaged = false;
					}
				}). // auto-activate the first highlighted item, if it exists
				filter(".auto-activate").first().addClass(NI.field.co.ACTIVE_CLASS);
				
			o.on_populate.apply(field, [d, val]);

			if (items_added > 0) {
				return true;
			} else {
				return false;
			}
		}
		
		function highlight($item, val) {
			if (!val) {
				return;
			}
			$item.each(function() {
				innerHighlight($item, this, val.toUpperCase());
			});
		}
		
		// HTML node highlighting routine based on Johann Burkard's jQuery highlight v3:
		// http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
		
		function innerHighlight($item, node, pat) {
			var skip = 0;
			if (node.nodeType == NI.co.nodeTypes.TEXT_NODE) {
				var pos = node.data.toUpperCase().indexOf(pat);
				if (pos >= 0) {
					var spannode = document.createElement('span');
					spannode.className = 'hili';
					var middlebit = node.splitText(pos);
					var endbit = middlebit.splitText(pat.length);
					var middleclone = middlebit.cloneNode(true);
					spannode.appendChild(middleclone);
					middlebit.parentNode.replaceChild(spannode, middlebit);
					skip = 1;

					if (o.activate_after_highlight_n && pat.length >= o.activate_after_highlight_n) {
						$item.addClass("auto-activate");
					}

				}
			} else if (node.nodeType == NI.co.nodeTypes.ELEMENT_NODE && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				for (var i = 0; i < node.childNodes.length; ++i) {
					i += innerHighlight($item, node.childNodes[i], pat);
				}
			}
			return skip;
		}
		
		// if an element is "auto matched", return a $ object
		// representing an 'Add a different ...' control,
		// otherwise, return false
		function auto_match($item, val) {
			var item_val, $diff_item;
			
			item_val = $item.attr("data-"+ o.auto_match.key);
			if (!item_val || !val) {
				return;
			}

			if ($.isFunction(o.auto_match.value_transform)) {
				item_val = o.auto_match.value_transform(item_val);
				if (!item_val) {
					return;
				}
			}

			if (!$item.hasClass(NI.field.co.ACTIVE_CLASS) && item_val.toLowerCase() == val.toLowerCase()) {
				
				$item.addClass(NI.field.co.ACTIVE_CLASS);

				if (o.auto_match.allow_different !== false) {
					$diff_item = $("<div>Add a different "+ item_val +"</div>").addClass(o.item_class +" "+ o.item_class+"-diff");
					$diff_item.attr("data-"+ o.auto_match.key, item_val);
					return $diff_item;
				}
			}

			return false;
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
		
		function show(callback) {
			if (internal.menu_open) {
				events.visible();
				return;
			}
			if (o.animation == 'slide') {
				field.elements.menu.slideDown(o.speed, function() {
					events.visible();
				});
			} else {
				field.elements.menu.show();
				events.visible();
			}
			internal.menu_open = true;
		}
		
		function hide() {
			/*if (o.animation == 'slide') {
				field.elements.menu.slideUp(o.speed);
			} else {
				field.elements.menu.hide();
			};*/
			
			if (internal.request) {
				internal.request.abort();
			}
			
			field.elements.menu.hide();
			internal.menu_open = false;
		}

		field.set_data_source = function(data_source){
			internal.data_source = data_source;
		};

		field.has_active_item = function(){
			if(field.elements.item_wrapper.find("."+ o.item_class).filter("."+ NI.field.co.ACTIVE_CLASS).length){
				return true;
			}
			return false;
		};

		field.select_active_item = function() {
			// return true if an active item exists,
			// otherwise return false
			
			var $items, $active_item;
			
			$items = field.elements.item_wrapper.find("."+ o.item_class);
			if (!$items.length) {
				return false;
			}
			$active_item = $items.filter("."+ NI.field.co.ACTIVE_CLASS);
			if (!$active_item.length) {
				return false;
			}
			$active_item.last().trigger("click");
			return true;
		};

		field.is_open = function(){
			return internal.menu_open;
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

});