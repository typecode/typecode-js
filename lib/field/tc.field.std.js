
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
	    field = NI.field;

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// standard field type

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
			
			options: {
				sexy: true
			},
			
			_init: function() {
				this.event_receiver = //this.elements.input;
				this.event_receiver = this.$e;
				this._init_label();
				this._init_sexy();
			},
			
			// looks for a nearby label for this control
			// if there is a label whose "for" attribute
			// corresponds to the control's "id" attribute
			// that's the label regardless of where it is in the DOM,
			// otherwise, we will for the label that is a sibling
			// of the control element
			_init_label: function() {
				var me, label_set, $label;
				
				me = this;
				label_set = false;
				
				function try_to_set_label() {
					if (($label instanceof $) && $label.length) {
						if ($label.attr("for") == me.elements.input.attr("id")) {
							$label = $label.detach();
							if (me.internal.o.label) {
								$label.text(me.internal.o.label);
							}
							label_set = true;
							return true;
						}
					}
					return false;
				}

				if (this.elements.input.attr("id")) {
					$label = $("label[for='"+ this.elements.input.attr("id") +"']");
				}
				if (!try_to_set_label()) {
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
				}
				
				if (!label_set && this.internal.o.label) {
					$label = $("<label for='"+ (this.elements.input.attr("id") || "") +"'>"+ this.internal.o.label +"</label>");
					label_set = true;
				}
				
				if (label_set) {
					$label.bind("click", {me: this}, function(e) {
						e.preventDefault();
						if(e.data.me.internal.o.set){
							e.data.me.internal.o.set.set_val(e.data.me.elements.input.attr('value'));
						} else {
							e.data.me.set_val(e.data.me.get_val() !== "true");
						}
					});
					this.elements.input.after($label);
				}
			},

			//if we have sexyboxes enabled, we will get them setup here.
			_init_sexy: function(){
				if (this.internal.o.sexy) {
					this.elements.sexy_input = $("<div class='sexy-control sexy-"+ this._name.toLowerCase() +"'></div>");
					this.elements.sexy_input.bind("click", {me: this}, function(e) {
						if(e.data.me.internal.o.set){
							e.data.me.internal.o.set.set_val(e.data.me.elements.input.attr('value'));
						} else {
							e.data.me.set_val(e.data.me.get_val() !== "true");
						}
					});
					this.event_receiver.bind("change " + field.co.SET_VAL_EVENT, {me: this}, function(e) {
						e.data.me._sexy_update();
					});
					this._sexy_update();
					this.elements.input.hide().before(this.elements.sexy_input);
				}
			},
			
			_sexy_update: function() {
				if (!this.elements.sexy_input) {
					return;
				}
				this.elements.sexy_input[this.get_val() === "true" ? "addClass" : "removeClass"](field.co.ACTIVE_CLASS);
			},
			
			get_val: function() {
				return this.elements.input.prop("checked") ? "true" : "false";
			},

			_set_val: function(val) {
				if (val) {
					this.elements.input.prop("checked", true);
				} else {
					this.elements.input.prop("checked", false);
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
				this.event_receiver = $({});
			},
			
			generate_from_dom: function(options) {
				var me;
				me = this;
				
				field._Base.prototype.generate_from_dom.apply(this, arguments);
				this.$e.addClass(field[this._name].CONTAINER_CLASS);
				this.elements.inputs = $("input[type='"+ field[this._name].INPUT_TYPE.toLowerCase() +"']", this.$e);

				this.internal.fields = [];
				this.elements.inputs.each(function() {

					var $f, my_subfield_options, my_options;
					$f = $(this);
					my_subfield_options = {};
					
					if(options.subfield_options){
						$.each(options.subfield_options,function(i, j){
							if($f.filter(j.selector).length){
								$.extend(my_subfield_options, j.options);
							}
						});
					}

					my_options = $.extend({}, options, my_subfield_options,
						{$e: field.prep_element($f).$e, set:me}
					);

					me.internal.fields.push( new field[field[me._name].INPUT_TYPE](my_options) );
				});
			},
			
			_set_val: function(val) {
				$.each(this.internal.fields, function(i, f) {
					f.set_val(false);
					if (f.elements.input.attr("value") == val) {
						f.set_val(true);
					}
				});
			},
			
			_sexy_update: function(val) {
				$.each(this.internal.fields, function(i, f) {
					if (!f.elements.sexy_input) {
						return true;
					}
					if (f.elements.input.attr("value") == val) {
						f.elements.sexy_input.addClass(field.co.ACTIVE_CLASS);
					} else {
						f.elements.sexy_input.removeClass(field.co.ACTIVE_CLASS);
					}
				});
			},
			
			set_enabled: function(enabled) {
				$.each(this.internal.fields, function(i, f) {
					f.set_enabled(enabled);
				});
				return field._BaseText.prototype.set_enabled.apply(this, arguments);
			}
		}
	});

	field.synthesize({
		name: "RadioSet",
		
		props: {
			CONTAINER_CLASS: "tc-radio-set",
			INPUT_TYPE: "Radio"
		},
		
		base: field._BaseControlSet,
		proto: {
			generate_from_scratch: function(options) {
				//TODO
				console.warn('RadioSet.generate_from_scratch is not yet implemented');
			},
			
			get_val: function() {
				var val;
				
				$.each(this.internal.fields, function(i, f) {
					if (f.get_val() === "true") {
						val = f.elements.input.attr("value");
						return false;
					}
				});

				if (val === false || typeof val === "undefined") {
					val = "-1";
				}
				
				return val;
			},

			_set_val: function(val) {
				$.each(this.internal.fields, function(i, f) {
					f.set_val(false);
					if (f.elements.input.attr("value") == val) {
						f.set_val(true);
					}
				});
			}
		}
	});

	field.synthesize({
		name: "CheckboxSet",
		
		props: {
			CONTAINER_CLASS: "tc-checkbox-set",
			INPUT_TYPE: "Checkbox"
		},
		
		base: field._BaseControlSet,
		proto: {
			generate_from_scratch: function(options) {
				// TODO
				console.warn('CheckboxSet.generate_from_scratch is not fully implemented');
			},

			get_val: function() {
				var i, val;
				val = [];
				
				$.each(this.internal.fields, function(i, f) {
					if (f.get_val() == "true") {
						val.push(f.elements.input.attr("value"));
					}
				});

				return val;
			},
			
			_set_val: function(val) {
				var me;
				me = this;

				if ($.isArray(val)) {
					$.each(this.internal.fields, function(i, f) {
						f.set_val(false);
					});
					
					$.each(val, function(i, v) {
						$.each(me.internal.fields, function(j, f) {
							if (f.elements.input.attr("value") == v) {
								f.set_val(true);
							}
						});
					});
				} else {
					$.each(me.internal.fields, function(j, f) {
						if (f.elements.input.attr("value") == val) {
							f.set_val(f.get_val() !== 'true');
						}
					});
				}
				
				
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
	
	field.synthesize({
		name: "Upload",
		
		proto: {
			
			options: {
				url:null
			},
			
			_init: function() {
				
			},
			
			generate_from_dom: function(options) {
				var me, random, i;

				me = this;

				this._base.generate_from_dom.apply(this, arguments);

				random = NI.math.round(NI.math.random(10000,99999),0);

				this.internal.iframe_id = 'upload_iframe'+random;
				this.internal.form_id = 'upload_form'+random;

				this.elements.input = this.$e.find('input[type=file]');

				if(this.internal.o.loader){
					this.elements.loader = $(this.internal.o.loader);
				} else {
					this.elements.loader = $('<p>Loading...</p>');
				}

				this.elements.loader.css({
					display:'none'
				}).appendTo(this.$e);

				if(this.internal.o.trigger){
					this.elements.trigger = $(this.internal.o.trigger);

					this.elements.input.css({
						position: 'absolute',
						// in Opera only 'browse' button
						// is clickable and it is located at
						// the right side of the input
						right: 0,
						top: 0,
						fontFamily: 'Arial',
						// 4 persons reported this, the max values that worked for them were 243, 236, 236, 118
						fontSize: '118px',
						margin: 0,
						padding: 0,
						cursor: 'pointer',
						opacity: 0
					});

					this.elements.input.bind('mouseover', {trigger:this.elements.trigger}, function(e,d){
						e.data.trigger.addClass('hover');
					});
					this.elements.input.bind('mouseout', {trigger:this.elements.trigger}, function(e,d){
						e.data.trigger.removeClass('hover');
					});
					this.elements.input.bind('mousedown', {trigger:this.elements.trigger}, function(e,d){
						e.data.trigger.addClass('down');
					});
					this.elements.input.bind('mouseup', {trigger:this.elements.trigger}, function(e,d){
						e.data.trigger.removeClass('down');
					});
					this.$e.append(this.elements.trigger);
				}

				this.elements.iframe = $('<iframe></iframe>')
					.attr({
						id:this.internal.iframe_id,
						name:this.internal.iframe_id,
						src:''
					}).css({
						display:'none'
					});
				
				this.elements.form = $('<form action="'+this.internal.url+'"></form>')
					.attr({
						id:this.internal.form_id,
						name:this.internal.form_id,
						action:this.internal.o.url,
						method:'POST',
						enctype:'multipart/form-data',
						target:this.internal.iframe_id
					});
				
				this.elements.input.wrap(this.elements.form);
				this.elements.form = this.elements.input.parent();
				this.event_receiver = this.elements.form;

				if(this.internal.o.additional_values){
					for(i in this.internal.o.additional_values){
						this.elements.form.append('<input type="hidden" name="'+i+'" value="'+this.internal.o.additional_values[i]+'"></input>');
					}
				}

				//window.file_input = this.elements.input.get(0);

				//console.log(this.elements.input);

				this.elements.input.bind('change',{},function(e,d){
					
					e.stopPropagation();
					e.stopImmediatePropagation();

					if(me.internal.o.trigger){
						me.elements.trigger.hide();
					} else {
						//me.elements.input.hide();
					}
					me.elements.loader.show();
					
					me.elements.iframe.bind('load',{},function(e,d){
						var mydoc, mycontent, mytext;

						window.onbeforeunload = null;
						me.elements.loader.hide();
						if(me.internal.o.trigger){
							me.elements.trigger.show();
						} else {
							me.elements.input.show();
						}
						me.elements.iframe.unbind('load');
						
						if (this.contentDocument) { // DOM
							mydoc = this.contentDocument;
						} else if (iframeObject.contentWindow) { // IE win
							mydoc = this.contentWindow.document;
						}
						if (mydoc) {
							mycontent = mydoc.getElementsByTagName('body')[0];
							if(typeof mycontent.textContent != 'undefined'){
								mytext = mycontent.textContent;
							} else if(typeof mycontent.innerText != 'sundefined'){
								mytext = mycontent.innerText;
							}
						}

						me.event_receiver.trigger('change',{data:$.parseJSON(mytext)});
					});

					window.onbeforeunload = me.window_unload_handler;
					document.getElementById(me.internal.form_id).submit();
				});

				

				this.$e.append(this.elements.iframe);

			},

			window_unload_handler: function(e){
				e = e || window.event;
				// For IE and Firefox prior to version 4
				if (e) {
					e.returnValue = false;
				}
				// For Safari
				return false;
			}
		}
	});
	
	
}(this, this.jQuery));