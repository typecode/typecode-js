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
		
		ACTIVE_CLASS: "state-active",
		DISABLED_CLASS: "state-disabled",
		EMPTY_CLASS: "state-empty",
		OPEN_CLASS: "state-open",
		
		VALUE: "data-value",
		TEXT: "data-text",
		
		SET_VAL_EVENT: "tc-field-event-set-val",
		RESET_EVENT: "tc-field-reset",
		VALIDATE_EVENT:"tc-field-validate",
		
		
		STANDARD_NODES: ["input", "textarea", "select"]
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// utils, factories, etc

	field.get_display_text = function($f) {
		return $f.attr(field.co.TEXT) ? 
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
			
			if (o.base && o.base.prototype && o.base.prototype.options) {
				this.internal = {
					o: $.extend({}, (o.base.prototype.options || {}), 
						(this.options || {}), 
						user_options)
				};
			} else {
				throw new Error("invalid base object");
			}
			
			this[this.internal.o.$e ? "generate_from_dom" : "generate_from_scratch"](this.internal.o);
			
			this._init();
			
			if (!this.event_receiver) {
				this.event_receiver = this.$e;
			}
			
			if (this.internal.o.handlers) {
				this.add_handlers(this.internal.o.handlers, $.extend(this.internal.o.event_data, {me: this}));
			}
			
			if (this.internal.o.val) {
				this.set_val(this.internal.o.val, true);
			}
			
			if (this.internal.o.extensions) {
				this.apply_extensions(this.internal.o.extensions);
			}
			
			return this;
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
		var $f, $e, is_std, is_fset;
		
		$f = element instanceof $ ? element : $(element);

		if ($.isFunction(preprocess)) {
			$f = preprocess($f) || $f;
		}
		
		if (!($f instanceof $) || !$f.length) {
			//throw new Error("Missing field element");
			console.warn("error preparing field element");
			return;
		}
		
		// if the element is not a generic field container
		// assume it's a "standard" field (see tc.field.std.js)
		// (this approach is questionable)
		//is_std = !($f.hasClass(field.co.BASE_CLASS));
		
		is_std = ($.inArray($f[0].nodeName.toLowerCase(), field.co.STANDARD_NODES));
		
		
		// if the jQuery collection contains multiple DOM elements
		// it is a field "set"
		is_fset = $f.length > 1;

		if (!is_std) {
			$e = $f;
		} else {
			$f.each(function(i) {
				if (!($f.eq(i).parent().hasClass(field.co.BASE_CLASS))) {
					$f.eq(i).wrap("<div class='"+ field.co.BASE_CLASS +"'>");
				}
			});
			$e = $f.parent();	
		}
		
		console.log(is_std);

		return {
			$e: $e,
			$f: $f,
			is_std: is_std,
			is_fset: is_fset
		};
	};
	
	// field factory
	field.new_instance = function(options) {
		var o, field_info, field_type,
		
		o = $.extend({
			element: null, // ($ obj or selector)
			preprocess: null,
			options: {} // gets passed through to the field instance
		}, options);
		
		field_info = field.prep_element(o.element, o.preprocess);

		if(!field_info){
			console.warn('field not found');
			console.log(o);
			return;
		}
		
		if (!field_info.is_std) {
			if (field_info.$e.hasClass(field.Dropdown.CONTAINER_CLASS)) {
				if (field_info.$e.hasClass(field.co.MULTI_CLASS)) {
					field_type = "MultiDropdown";
				} else {
					field_type = "Dropdown";
				}
			}
		} else {
			
			switch (field_info.$f[0].nodeName.toLowerCase()) {
				case "input":
					switch (field_info.$f.attr("type") ? field_info.$f.attr("type").toLowerCase() : "text") {
						case "text":
							field_type = "TextInput";
							break;
						case "password":
							field_type = "Password";
							break;
						case "radio":
							field_type = field_info.is_fset ? "RadioSet" : "Radio";
							break;
						case "checkbox":
							field_type = field_info.is_fset ? "CheckboxSet" : "Checkbox";
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
		}

		if (!field_type) {
			//throw new Error("field.new_instance: failed to determine field type");
			field_type = "_Base";
		}
		return new field[field_type]($.extend(o.options, {$e: field_info.$e}));
	};
	
	
	
	
	
	
	
		
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// base field

// all field types inherit from _Base
	
	field.synthesize({
		name: "_Base",
		
		base: {},
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
				var me = this;
				$.each(extensions, function(extension, options) {
					if ($.isFunction(field.extensions[extension])) {
						me.internal[extension] = new field.extensions[extension](me, options);
					}
				});
				return this;
			},

			generate_from_dom: function(options) {
				this.$e = options.$e.addClass(field.co.BASE_CLASS);
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

				if (this._set_val(val) !== false) {
					if (!prevent_change) {
						to = this.get_val();
						if (from !== to) {
							this.event_receiver.trigger("change", {
								from: from,
								to: to
							});
						}
					}
				}
				
				this.event_receiver.trigger(field.co.SET_VAL_EVENT);

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
				this.$e.remove();
			}
		}
	});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	NI.field = field;
	
}(this, this.jQuery));