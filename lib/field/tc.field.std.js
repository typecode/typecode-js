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

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// standard field types

// field type names starting with "_Base" are abstract

	field.synthesize({
		name: "_BaseText",
		
		proto: {
			_init: function() {
				this.event_receiver = this.elements.input;
			},
			
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
	
	field.synthesize({
		name: "TextInput",
		
		base: field._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				//this.elements.input = $("input[type='text']", this.$e);
				this.elements.input = $("input", this.$e);
			},

			generate_from_scratch: function(options) {
				this.$e = $("<div><input type='text'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='text']", this.$e);
			}
		}
	});

	field.synthesize({
		name: "Password",
		
		base: field._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='password']", this.$e);
			},

			generate_from_scratch: function(options) {
				this.$e = $("<div><input type='password'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='password']", this.$e);
			}
		}
	});
	
	field.synthesize({
		name: "TextArea",
		
		base: field._BaseText,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("textarea", this.$e);
			},

			generate_from_scratch: function(options) {
				this.$e = $("<div><textarea></textarea></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("textarea", this.$e);
			}
		}
	});
	
	field.synthesize({
		name: "_BaseControl",
		
		proto: {
			_init: function() {
				this.event_receiver = this.elements.input;
				this._init_label();
			},
			
			_init_label: function() {
				var me, label_set, $label;
				
				me = this;
				label_set = false;
				
				function try_to_set_label() {
					if ($label.length) {
						if ($label.attr("for") == me.elements.input.attr("name")) {
							$label = $label.detach();
							if (me.internal.o.label) {
								$label.text(me.internal.o.label);
							}
							me.elements.input.after($label);
							label_set = true;
							return true;
						}
					}
					return false;
				}
				
				$label = this.$e.next("label");
				if (!$label.length) {
					$label = this.$e.prev("label");
				}
				if (!try_to_set_label()) {
					$label = this.elements.input.next("label");
					if (!$label.length) {
						$label = this.elements.input.prev("label");
					}
					try_to_set_label();
				}
				
				if (!label_set && this.internal.o.label) {
					$label = $("<label for='"+ (this.elements.input.attr("name") || "") +"'>"+ this.internal.o.label +"</label>");
					this.elements.input.after($label);
				}
				
			},
			
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
	
	field.synthesize({
		name: "Radio",
		
		base: field._BaseControl,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='radio']", this.$e);
			},

			generate_from_scratch: function(options) {
				this.$e = $("<div><input type='radio'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='radio']", this.$e);
			}
		}
	});
	
	field.synthesize({
		name: "Checkbox",
		
		base: field._BaseControl,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='checkbox']", this.$e);
			},

			generate_from_scratch: function(options) {
				this.$e = $("<div><input type='checkbox'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='checkbox']", this.$e);
			}
		}
	});

	field.synthesize({
		name: "_BaseControlSet",
		
		proto: {
			_init: function() {
				this.event_receiver = this.elements.input;
			},
			
			get_val: function() {
				var i, val;
				this.elements.input.each(function(i,j){
					if($(j).attr('checked')){
						val = $(j).attr('value');
					}
				});

				return val;
			},

			_set_val: function(val) {
				var i, val;

				this.elements.input.removeAttr('checked').each(function(i,j){
					if( $(j).attr('value') == val ){
						$(j).attr('checked',true);	
					}
				});
			},
		
			set_enabled: function(enabled) {
				return field._BaseText.prototype.set_enabled.apply(this, arguments);
			}
		}
	});

	field.synthesize({
		name: "RadioSet",
		
		base: field._BaseControlSet,
		proto: {
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.input = $("input[type='radio']", this.$e);
			},

			generate_from_scratch: function(options) {
				this.$e = $("<div><input type='radio'></div>").addClass(field.co.BASE_CLASS);
				this.elements.input = $("input[type='radio']", this.$e);
			}
		}
	});

	
	field.synthesize({
		name: "Select",
		
		proto: {
			
			options: {
				empty_val: "-1",
				value_list: {}
			},
			
			_init: function() {
				this.event_receiver = this.elements.select;
			},
			
			generate_from_dom: function(options) {
				this._base.generate_from_dom.apply(this, arguments);
				this.elements.select = $("select", this.$e);
			},

			generate_from_scratch: function(options) {
				this.$e = $("<div><select></select></div>").addClass(field.co.BASE_CLASS);
				this.elements.select = $("select", this.$e);
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
				$option = this.elements.select.find("option:selected");
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

}(this, this.jQuery));