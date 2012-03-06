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
	
	var NI = window.NI,
	    field = { extensions: {} };
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// constants
	
	field.co = {
		
		BASE_CLASS: "tc-field",
		LABEL_CLASS: "tc-field-label",
		HINT_CLASS: "tc-field-hint",
		MSG_CLASS: "tc-field-message",
		
		MULTI_CLASS: "tc-multiple",
		NESTED_CLASS: "tc-nested",
		
		ACTIVE_CLASS: "state-active",
		DISABLED_CLASS: "state-disabled",
		EMPTY_CLASS: "state-empty",
		OPEN_CLASS: "state-open",
		
		VALUE: "data-value",
		TEXT: "data-text",
		
		SET_VAL_EVENT: "tc-field-event-set-val",
		RESET_EVENT: "tc-field-reset",
		VALIDATE_EVENT:"tc-field-validate"

	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// utils, factories, etc

	field.get_display_text = function($f) {
		return $f.attr(field.co.TEXT) ? 					// TEXT = data-text
			$f.attr(field.co.TEXT) : $f.text();
	};
	
	// synthesize a new field type
	field.synthesize = function(options) {
		var o = $.extend({
			name: null,
			props: null, // static
			base: field._Base,
			proto: {}
		}, options);
		
		field[o.name] = function(user_options) {
			this._name = o.name;
			this._base = o.base.prototype;
			this.$e = null;
			this.elements = {};
			this.events = {};
			this.internal = {
				o: $.extend({}, (o.base.prototype.options || {}), 
					(this.options || {}), 
					user_options)
			};
			
			this[this.internal.o.$e ? "generate_from_dom" : "generate_from_scratch"](this.internal.o);
			
			this._init();
			
			if (!this.event_receiver) {
				this.event_receiver = this.$e;
			}
			// I feel like this if statement is unneccessary that it's checking to see 
			// if there's any event_receiver, meaning that some field would be injecting event_receiver or not,
			// either case, even if we make this explicit, whatever it is injected, it will overwrite this value.
			
			if (this.internal.o.handlers) {
				this.add_handlers(this.internal.o.handlers, $.extend(this.internal.o.event_data, {me: this}));
			}
			// Adding handlers if user specifies any handlers, if not don't add anything.
			
			if (this.internal.o.val) {
				this.set_val(this.internal.o.val, true);
			}
			// Checking if there is a val option. 	
			
			if (this.internal.o.extensions) {
				this.apply_extensions(this.internal.o.extensions);
			}
			// Checking if there are extensions option.
			
			return;
		};
		field[o.name].prototype = $.extend({}, o.base.prototype, o.proto);

		if (o.props && typeof o.props === "object") {
			$.each(o.props, function(k, v) {
				field[o.name][k] = v;
			});
		}

		return field[o.name];
	};

	field.prep_element = function(element, preprocess) {
		var $f, $e, is_std, is_fset, field_type, $f_nodeName;
		
		$f = (element instanceof $) ? element : $(element); //This means, if first condition satisfies then use the first or second.
		// Checking to see if $f is a jquery object. If it isn't, 
		// wrap it with $() so it will get treated as jQuery object.

		if ($.isFunction(preprocess)) {
			$f = preprocess($f) || $f;
		}
		// Checking to see if preprocess is a function
		// If true then preprocess $f.
		// But, where is function preprocess... No where....
		
		if (!($f instanceof $) || !$f.length) {
			//throw new Error("Missing field element");
			console.warn("error preparing field element");
			return;
		}
		// This one is saying that if $f still isn't instance of jQuery object 
		// or $f is UND then spit out an error message and return UND.
		
		// if the element is not a generic field container
		// assume it's a "standard" field (see tc.field.std.js)
		// (this approach is questionable)
		//is_std = !($f.hasClass(field.co.BASE_CLASS));
		$f_nodeName = $f[0].nodeName.toLowerCase();
		if (($f_nodeName == "input") || ($f_nodeName == "textarea") || ($f_nodeName == "select")) {
			// The three conditions that makes something a field.
			is_std = true;
		} else {
			is_std = false;
		}
		
		// If $f does not have a class name as "tc-field", 
		// then it is considered as a standard field.
		// But I think it should be more critical before determining it's "standard".
		
		// if the jQuery collection contains multiple DOM elements
		// it is a field "set"
		is_fset = $f.length > 1;
		// If there are more than one 
		// In what kind of circumstances that this would be considered as a set?
		// Wouldn't $f.length always be equal to 1?
		// Because $("#my-dropdown") could only exist as a single thing.

		if (is_std) {
			
			$f.each(function(i) {
				if (!($f.eq(i).parent().hasClass(field.co.BASE_CLASS))) {
					$f.eq(i).wrap("<div class='"+ field.co.BASE_CLASS +"'>");
				}
			});
			$e = $f.parent(); // Making $f parent to $e so that we have access to it.
			
			switch ($f_nodeName) { // Checking which type the standard field it would be.
				case "input":
					switch ($f.attr("type") ? $f.attr("type").toLowerCase() : "text") {
						case "text":
							field_type = "TextInput";
							break;
						case "password":
							field_type = "Password";
							break;
						case "radio":
							field_type = is_fset ? "RadioSet" : "Radio";
							break;
						case "checkbox":
							field_type = is_fset ? "CheckboxSet" : "Checkbox";
							break;
						case "file":
							field_type = "Upload";
							break;
						case "hidden":
							field_type = "TextInput";
							break;
					}
					break;
				case "textarea":
					field_type = "TextArea";
					break;
				case "select":
					field_type = "Select";
					break;
			}			
		} else {
			//It's not a standard field.
			
			$e = $f; // So $e is $f. Which means, potentially could use just $f 
						// instead of making new variable.(Something to keep in mind)
			if ($e.hasClass(field.Dropdown.CONTAINER_CLASS)) { 	// CONTAINER_CLASS: tc-dropdown
				if ($e.hasClass(field.co.MULTI_CLASS)) {				// MULTI_CLASS: tc-multiple
					field_type = "MultiDropdown";
				} else if ($e.hasClass(field.co.NESTED_CLASS)){		// NESTED_CLASS: tc-nested
					field_type = "NestedDropdown";
				} else {
					field_type = "Dropdown";
				}
			} else {
				console.warn(""+ element +" requires tc-dropdown class to create the dropdown if it's a multi dropdown then include tc-multiple as well.");		
				field_type = "_Base";
				//$e.remove();		
				//return;
			}
		}

		if (!field_type) {
			//throw new Error("field.new_instance: failed to determine field type");
			
			//console.error("Could not determine the field_type, falling back to generic implementation");
			
			field_type = "_Base";
			
		}
		
		return {
			$e: $e,
			$f: $f,
			field_type: field_type
		};
		// After preparing everything, return few options.
	};
	
	// field factory
	field.new_instance = function(options) {
		var o, field_info;
		
		var defaults = {
			element: null, // ($ obj or selector)
			preprocess: null,
			options: {} // gets passed through to the field instance
		};
		
		o = $.extend(defaults, options);
		// Whatever the user has designated what options will be inserted into defaults settings,
		// which will be stored in o object.
		// so to reach element, shouldn't it be o.defaults.element? little confused.
		
		field_info = field.prep_element(o.element, o.preprocess);
		
		// field_info is stored with, $e, $f, is_std, is_set.
		// field_info is stored with UND if user incorrectly input the id.
		
		if(!field_info){
			console.warn('field not found');
			console.log(o);
			return;
		}
		// This is seeing if $f was named correctly 
			
		return new field[field_info.field_type]($.extend(o.options, {$e: field_info.$e}));
		
	};
		
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// base field

// all field types inherit from _Base
	
	field.synthesize({
		name: "_Base",
		base: {
			prototype: {
				options: {}
			}
		},
		proto: {		
			options: {
				$e: null,
				val: null,
				label: null,
				handlers: null,
				event_data: null,
				extensions: null
			},
			
			_init: function() {},

			// (chainable)
			apply_extensions: function(extensions) {
				console.log('old.apply_extensions');
				var me = this;		// What is this?
				$.each(extensions, function(extension, options) {
					if ($.isFunction(field.extensions[extension])) {
						me.internal[extension] = new field.extensions[extension](me, options);
					}
				});
				return this;
			},

			generate_from_dom: function(options) {
				this.$e = options.$e.addClass(field.co.BASE_CLASS);	// BASE_CLASS: tc-field.
			},

			generate_from_scratch: function(options) {},

			// (chainable)
			append_to: function() {
				if (!NI.ex.isHeadless(this.$e)) {
					this.$e = this.$e.detach();
				}

				if (typeof arguments[0] === "string") {
					$(arguments[0]).append(this.$e);
				} else if (arguments[0] instanceof $) {
					arguments[0].append(this.$e);
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

				if (this._set_val(val) !== false) {		// Execute this if statement when _set_val() function does not return false.
					if (!prevent_change) {				// Also checking if prevent_change parameter is passed.
						to = this.get_val();
						if (from !== to) {
							this.event_receiver.trigger("change", {
								from: from,
								to: to
							});
						}
					}
				}
			
				this.event_receiver.trigger(field.co.SET_VAL_EVENT);	// SET_VAL_EVENT = tc-field-event-set-val

				return this;
			},

			_set_val: function(val) {},

			reset: function(){
				this.set_val('');
				this.event_receiver.trigger(field.co.RESET_EVENT);
			},

			// (chainable)
			bind: function(type, data, fn, replace) {
				if (replace) {
					this.event_receiver.unbind(type);
				}
				this.event_receiver.bind(type, data, fn);
				return this;
			},

			// (chainable)
			add_handlers: function(handlers, data, replace) {
				for (var i in handlers) {
					this.bind(i, data, handlers[i], replace);
				}
				return this;
			},

			// (chainable)
			set_enabled: function(enabled) {
				return this;
			},

			destroy: function() {
				this.$e.remove();
			}
		}
	});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	NI.field = field;
	
}(this, this.jQuery));