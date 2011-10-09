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
                         From 2010 till ∞     
                         typecode-js v0.1       
                                                */

(function(window, $) {

	var NI = window.NI,
	    console = NI.app.getConsole(true);

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// regular expressions

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
// tests
	
	var is = {
		
		empty: function(s) {
			return NI.ex.isEmpty(s);
		},
		
		alphaNumeric: function(s) {
			return regTest(s, "alphanumeric");
		},

		email: function(s) {
			return regTest(s, "email");
		},
	
		url: function(s) {
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
					if (!(year.length == 2 || year.length == 4)) {
						return false;
					}
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
// built-in validators

	var error_messages = {
		
		required: "This is a required field",
		
		alphanumeric: "This is not a valid alpha-numeeric value",
		
		email: "This is not a valid Email address",
		
		url: "This is not a valid URL",
		
		number: "This is not a valid number",
		
		date: "This is not a valid date"
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// field validation	


	//begin ValidationToken
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
	//end ValidationToken
	
	
	//begin validate
	function validate(field) {
		var value, 
		    validators, 
		    token, 
		    errors,
		    type,
		    master;
		
		master = field.data("master");
		
		if (master && $.isFunction(master.get_val)) {
			// the field is an instance of NI.Field
			value = master.get_val();
		} else {
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
								err = error_messages["required"];
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
								token.addError(error_messages["alphanumeric"]);
							}
							break;
						case "email":
							if (!is.email(value)) {
								token.addError(error_messages["email"]);
							}
							break;
						case "url":
							if (!is.url(value)) {
								token.addError(error_messages["url"]);
							}
							break;
						case "number":
							if (!is.num(value)) {
								token.addError(error_messages["number"]);
							}
							break;
						case "date":
							if (!is.date(value)) {
								token.addError(error_messages["date"]);
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
	//end validate
	
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// manager

	var events = {
		fieldValidationPass: function(e, d) {
			$(this).removeClass("state-invalid").addClass("state-valid");
			e.data.manager.internal.eventTarget.trigger("fieldValidationPass", d);
			e.data.manager.isValid();
			return false;
		},
		fieldValidationFail: function(e, d) {
			$(this).removeClass("state-valid").addClass("state-invalid");
			e.data.manager.internal.eventTarget.trigger("fieldValidationFail", d);
			e.data.manager.isValid();
			return false;
		},
		fieldValidationReset: function(e, d) {
			$(this).removeClass("state-valid state-invalid");
			return false;
		},
		watchEventHandler: function(e, d){
			validate($(this));
		},
		managerValidationPass: function(e, d){
			e.data.manager.internal.eventTarget.removeClass("state-invalid").addClass("state-valid");
		},
		managerValidationFail: function(e, d){
			e.data.manager.internal.eventTarget.removeClass("state-valid").addClass("state-invalid");
		}
	};

	function ValidationManager(options) {
		var me = this;
				
		this.o = $.extend({
			$mother: null,
			spec: [],
			watchEvents:['keyup', 'change']
		}, options);
		
		this.internal = {
			eventTarget: this.o.$mother || $({})
		};
		
		this.fields = [];
		
		$.each(this.o.spec, function(i, item) {
			me.addField(item);
		});
		
		this.internal.eventTarget.bind("managerValidationFail", { manager:this }, events.managerValidationFail)
			.bind("managerValidationPass", { manager:this }, events.managerValidationPass);
		
		//this.internal.eventTarget.bind("validationPass", { manager:this }, events.managedFieldPass)
		//	.bind("validationFail", { manager:this }, events.managedFieldFail);
	}
	ValidationManager.prototype = {
		addField: function(item) {
			var field, i;
			field = typeof item.element === "string" ? $(item.element) : item.element;
			if (!field.length || !item.validators) {
				return true;
			}
			
			field.data("validators", item.validators);
			field.data("vtoken", new ValidationToken());
			
			field.bind("validationPass", { manager:this }, events.fieldValidationPass)
			     .bind("validationFail", { manager:this }, events.fieldValidationFail)
			     .bind("validationReset", { manager:this }, events.fieldValidationReset);
			
			for (i in this.o.watchEvents){
				field.bind(this.o.watchEvents[i], { manager:this }, events.watchEventHandler);
			}
			
			this.fields.push(field);
			validate(field);
		},
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
			var i, errors;
			errors = [];
			for (i = 0; i < this.fields.length; i += 1) {
				if (this.fields[i].data("vtoken").errors()) {
					errors.push({
						field:this.fields[i],
						token:this.fields[i].data("vtoken")
					});
				}
			}
			if(errors.length){
				this.internal.eventTarget.trigger('managerValidationFail', {errors:errors});
				return false;
			}
			this.internal.eventTarget.trigger('managerValidationPass', {errors:errors});
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
	
	ValidationManager.validators = {};
	
	ValidationManager.registerValidator = function(key, fn) {
		NI.ex.checkStr(key);
		NI.ex.checkFn(fn);
		key = key.toLowerCase();
		if (error_messages[key]) {
			console.warn("Warning: you are overriding the built-in validator: "+ key);
			//console.warn("Cannot override the built-in validator: "+ key);
			//return;
		}
		ValidationManager.validators[key] = fn;
	};
	
	ValidationManager.registerErrorMessage = function(key, note) {
		NI.ex.checkStr(key);
		NI.ex.checkStr(note);
		if (error_messages[key]) {
			error_messages[key] = note;
		} else {
			
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