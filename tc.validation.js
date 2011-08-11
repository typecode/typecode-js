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
	    console = NI.app.getConsole(true);

	var regex = {
		email: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
		
		url: /^((ht|f)tps?:\/\/)?[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\%"\,\{\}\\|\\\^\[\]`]+)?$/,
		
		alphanumeric:  /^\s*[a-z\d\.]+([a-z\d\.]*\.|\s*\-\s*[a-z\d\.]+)?(\s+[a-z\d\.]+(\.|\s*\-\s*[a-z\d\.]+)?)*\s*$/i,
		
		number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/
	};
	
	function regTest(s, key) {
		return regex[key].test(s);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	var is = {
		
		alphaNumeric: function(s) {
			return regTest(s, "alphanumeric");
		},

		email: function(s) {
			return regTest(s, "email");
		},
	
		URL: function(s) {
			return regTest(s, "url");
		},
	
		num: function(s) {
			return regTest(s, "number");
		},
	
		numNonNegative: function(s) {
			return isNum(s) && Number(s) >= 0;
		},
	
		numPositive: function(s) {
			return isNum(s) && Number(s) > 0;
		},
	
		date: function(s) {
			var day, month, year, buf, date;
			if (s) {
				buf = s.split("/");
				if (buf.length == 3) {
					month = buf[0].replace(/^0+/,'');
					day = buf[1].replace(/^0+/,'');
					year = buf[2].replace(/^0+/,'');
					try {
						date = new Date();
						month = (month*1) - 1;
						date.setFullYear(year, month, day);					
						if (date.getMonth() == month && 
						    date.getDate() == day && 
						    date.getFullYear() == year) {
								return true;
							}
					} catch(err) {
						// ignore
					}
				}
				return false;
			}
			return true;
		}
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	function ValidationToken() {
		this.clean();
	}
	ValidationToken.prototype = {
		errors: function() {
			return this.errs.length ?
				this.errs : false;
		},
		addError: function(str) {
			this.errs.push(str);
			return this;
		},
		clean: function() {
			this.errs = [];
			return this;
		}
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	var events = {
		fieldValidationPass: function(e, d) {
			$(e.target).removeClass("state-invalid").addClass("state-valid");
			if (e.data.manager.o.$mother instanceof $) {
				e.data.manager.o.$mother.trigger("validationPass", d);
			}
			return false;
		},
		fieldValidationFail: function(e, d) {
			$(e.target).removeClass("state-valid").addClass("state-invalid");
			if (e.data.manager.o.$mother instanceof $) {
				e.data.manager.o.$mother.trigger("validationFail", d);
			}
			return false;
		},
		fieldValidationReset: function(e, d) {
			$(e.target).removeClass("state-valid state-invalid");
			return false;
		},
		fieldChange: function(e, d) {
			validate($(e.target));
		},
		fieldKeyup: function(e, d) {
			validate($(e.target));
		},
		managedFieldPass: function(e, d) {
			if (e.data.manager.isValid()) {
				$(e.target).removeClass("state-invalid").addClass("state-valid");
			}
			return false;
		},
		managedFieldFail: function(e, d) {
			$(e.target).removeClass("state-valid").addClass("state-invalid");
			return false;
		}
	};
	
	function validate(field) {
		var value, 
		    validators, 
		    token, 
		    errors,
		    type;
		
		switch (field[0].nodeName.toLowerCase()) {
			case "input":
				switch (field.attr("type")) {
					case "radio":
					case "checkbox":
						type = "bool";
						if (field.attr("checked")) {
							value = "true";
						} else {
							value = "false";
						}
						break;
					default:
						value = field.val();
						break;
				}
				break;
			case "textarea":
				value = field.val();
				break;
			case "select":
				type = "select";
				value = field.find("option:selected").attr("value");
				break;
			default:
				value = false;
				break;
		}
		NI.ex.checkStr(value);
		
		validators = field.data("validators");
		token = field.data("vtoken");
		
		if (!validators || !token) {
			throw new Error("Field not prepared for validation");
		}
		token.clean();

		$.each(validators, function(j, v) {
			var t, validation;
			t = typeof v;
			if (t === "string") {
				v = v.toLowerCase();
				if ($.isFunction(ValidationManager.validators[v])) {
					validation = ValidationManager.validators[v](value);
					if (validation && validation.errors && validation.errors.length) {
						$.each(validation.errors, function(k, err) {
							token.addError(err);
						});
					}
				} else if (v.indexOf("maxlen") === 0) {
					(function(max) {
						if (value.length > max) {
							token.addError("This cannot exceed "+ max +" characters");
						}
					}(v.split("=")[1]));
				} else if (v.indexOf("minlen") === 0) {
					(function(min) {
						if (value.length < min) {
							token.addError("This must be at least "+ min +" characters");
						}
					}(v.split("=")[1]));
				} else {
					switch (v) {
						case "required":
							(function() {
								var err;
								err = "This is a required field";
								if (type === "bool") {
									if (value === "false") {
										token.addError(err);
									}
								} else if (type === "select") {
									if (value === "-1") {
										token.addError(err);
									}
								} else {
									if (NI.ex.isEmpty(value)) {
										token.addError(err);
									}
								}
							}());
							break;
						case "alphanumeric":
							if (!is.alphaNumeric(value)) {
								token.addError("This is not a valid alpha-numeric value");
							}
							break;
						case "email":
							if (!is.email(value)) {
								token.addError("This is not a valid Email address");
							}
							break;
						case "url":
							if (!is.URL(value)) {
								token.addError("This is not a valid URL");
							}
							break;
						case "number":
							if (!is.num(value)) {
								token.addError("This is not a valid number");
							}
							break;
						case "date":
							if (!is.date(value)) {
								token.addError("This is not a valid date");
							}
							break;
						default:
							break;
					}
				}
			} else if (t === "function") {
				validation = v(value);
				if (validation.errors && validation.errors.length) {
					$.each(validation.errors, function(k, err) {
						token.addError(err);
					});
				}
			}
		});
		
		errors = token.errors();
		if (errors) {
			field.trigger("validationFail", { errors: errors });
			return { valid: false, errors: errors };
		}
		field.trigger("validationPass");
		return { valid: true };
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	function ValidationManager(options) {
		var me = this;
				
		this.o = $.extend({
			$mother: null,
			spec: [],
			watchKeypress: false
		}, options);
		
		this.fields = [];
		$.each(this.o.spec, function(i, item) {
			var field;
			field = typeof item.element === "string" ? $(item.element) : item.element;
			if (!field.length || !item.validators) {
				return true;
			}
			
			field.data("validators", item.validators);
			field.data("vtoken", new ValidationToken());
			
			field.bind("validationPass", { manager:me }, events.fieldValidationPass)
			     .bind("validationFail", { manager:me }, events.fieldValidationFail)
			     .bind("validationReset", { manager:me }, events.fieldValidationReset)
			     .bind("change", { manager:me }, events.fieldChange);
			if (me.o.watchKeypress) {
				field.bind("keyup", { manager:me }, events.fieldKeyup);
			}
			
			me.fields.push(field);
		});
		
		if (this.o.$mother instanceof $) {	
			this.o.$mother.bind("validationPass", { manager:this }, events.managedFieldPass)
			  .bind("validationFail", { manager:this }, events.managedFieldFail);
		}		
	}
	ValidationManager.prototype = {
		validate: function() {
			var errorCount = 0;
			 
			$.each(this.fields, function(i, field) {
				var validation = validate(field);
				if (!validation.valid) {
					errorCount += validation.errors.length;
				}
			});
			
			return errorCount === 0;
		},
		isValid: function() {
			var i;
			for (i = 0; i < this.fields.length; i += 1) {
				if (this.fields[i].data("vtoken").errors()) {
					return false;
				}
			}
			return true;
		},
		reset: function() {
			$.each(this.fields, function(i, field) {
				field.data("vtoken").clean();
				field.trigger("validationReset");
			});
			if (this.o.$mother instanceof $) {
				this.$c.removeClass("state-valid state-invalid");
			}
			this.invalidFieldCount = 0;
			return this;
		}
	};
	
	var RESERVED_KEYS =
		["required",
		"alphanumeric",
		"email",
		"url",
		"number",
		"date"];
	
	ValidationManager.validators = {};
	
	ValidationManager.registerValidator = function(key, fn) {
		NI.ex.checkStr(key);
		NI.ex.checkFn(fn);
		key = key.toLowerCase();
		if (RESERVED_KEYS.indexOf(key) === -1) {
			ValidationManager.validators[key] = fn;
		} else {
			console.warn("Cannot override the built-in validator: "+ key);
		}
	};
	
	ValidationManager.makeRangeValidator = function(low, high, note) {
		note = note || "This must be between "+ low +" and "+ high;
		return function(value) {
			value = Number(value);
			if (value < low || value > high) {
				return { valid: false, errors: [note] };
			}
			return { valid: true };
		};
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	NI.ValidationManager = ValidationManager;
	NI.is = $.extend(NI.is || {}, is);
	
}(this, this.jQuery));