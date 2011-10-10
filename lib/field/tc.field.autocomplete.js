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
	    field = NI.field,
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
		var me, o;
		
		me = this;
		o = $.extend({
			menu_class: "menu",
			
			item_generator: null,
			on_item_pick: function(e, d) {},
			item_class: "tc-menu-item",
			
			data_source: null,
			request_filter_param: "term"
		}, options);
		
		function init() {
			field.elements.menu = $("<div class='"+ o.menu_class +"'></div>").hide();
			field.$e.append(field.elements.menu);
			field.event_receiver.bind("keyup", {field: field}, events.keyup)
			                    .bind("blur", {field: field}, events.blur);
		}
		
		var events = {
			keyup: function(e) {
				var val = e.data.field.get_val();
				if (NI.ex.isEmpty(val)) {
					return;
				}
				if (typeof o.data_source === "string") {
					request_data(val);
				}
			},
			blur: function(e) {
				e.data.field.elements.menu.hide();
			}
		};
		
		function request_data(val) {
			var data = {};
			data[o.request_filter_param] = val;
			$.get(o.data_source, data, function(d) {
				populate_menu(d);
				field.elements.menu.show();
			});
		}
		
		function populate_menu(d) {
			field.elements.menu.empty();
			$.each(d, function(i, item) {
				var $item;
				if ($.isFunction(o.item_generator)) {
					$item = o.item_generator(item);
				} else {
					
				}
				field.elements.menu.append($item.addClass(o.item_class));
			});
			field.elements.menu.find("."+ o.item_class).bind("click", {field: field}, function(e, d) {
				if (o.on_item_pick.apply(this, arguments) !== false) {
					field.elements.menu.hide();
				}
			});
		}
		
		init();
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	field.extensions.Autocomplete = function(field, options) {
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