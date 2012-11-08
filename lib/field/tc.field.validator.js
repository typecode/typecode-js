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
	'require',
	'jquery',
	'lib/typecode-js/lib/tc.validation',
	'lib/typecode-js/lib/tc.field'
], function(require, $) {
	
	var NI = window.NI,
		field = NI.field;

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	

	function Validator(field, options) {
		var me, o, internal;
		
		me = this;
		o = $.extend({
			validators: null,
			manager: null,
			on_valid:function(e,d){},
			on_invalid:function(e,d){}
		}, options);
		
		internal = {
			managed_field:null
		};

		console.log('Validator');
		console.log(o.manager);
			
		if (!o.manager || !(o.manager instanceof NI.ValidationManager)) {
			o.manager = new NI.ValidationManager({
				watchEvents:['keyup', 'change', NI.field.co.SET_VAL_EVENT]
			});
		}

		field.event_receiver.bind(NI.field.co.RESET_EVENT, {}, function(e,d){
			field.event_receiver.trigger('validationReset');
		});

		field.event_receiver.bind(NI.field.co.VALIDATE_EVENT, {}, function(e,d){
			field.event_receiver.trigger('validate');
		});

		field.event_receiver.bind('validationPass', {}, o.on_valid);
		field.event_receiver.bind('validationFail', {field: field}, o.on_invalid);
		field.event_receiver.data("master", field);

		internal.managed_field = o.manager.addField({
			element: field.event_receiver,
			master: field,
			validators: o.validators
		});

		this.get_managed_field = function(){
			return internal.managed_field;
		};

		this.add_validator = function(validator){
			var i, validators;
			if($.isArray(validator)){
				for(i = 0; i < validator.length; i++){
					this.add_validator(validator[i]);
				}
			} else {
				validators = internal.managed_field.data("validators");
				if($.inArray(validator, validators) == -1){
					validators.push(validator);
					internal.managed_field.data("validators", validators);
				}
			}
			
		};

		this.remove_validator = function(validator) {
			var validators, index;
			validators = internal.managed_field.data("validators");
			index = $.inArray(validator, validators);
			if (index > -1) {
				validators.splice(index, 1);
				internal.managed_field.data("validators", validators);
			}
		};

	}


	function SimpleTooltipValidatorError(field, options){
		return new ValidatorError(field,$.extend({
				append_to: '.'+NI.field.co.SIMPLE_TOOLTIP_CLASS
			}, options, {
				hide_parent:true,
				hide_siblings:true,
				class_target: '.'+NI.field.co.SIMPLE_TOOLTIP_CLASS,
				invalid_class:'invalid'
			})
		);
	}

	function ValidatorError(field, options) {
		var me, o, internal;
		
		me = this;
		o = $.extend({
			append_to: field.$e,
			hide_parent:false,
			hide_siblings: false,
			class_target:null,
			invalid_class:'tc-field-validator-error-invalid'
		}, options);

		internal = {
			parent: null,
			class_target:null,
			$e: $('<div class="tc-field-validator-error"></div>'),
			parent_was_hidden:null
		};

		internal.$e.hide();

		function construct(){
			if(!internal.parent && o.append_to){
				internal.parent = (o.append_to instanceof $ ? o.append_to : field.$e.find(o.append_to));
				if(!$.contains(internal.parent.get(0), internal.$e.get(0))){
					internal.$e.appendTo(internal.parent);
				}
			}
			if(!internal.class_target && o.class_target){
				internal.class_target = ( o.class_target instanceof $) ? o.class_target : field.$e.find(o.class_target);
			}
		}

		field.event_receiver.bind('validationPass validationReset', {field: field}, function(e, d){
			
			if(internal.$e.parent().length){
				internal.$e.hide();

				if(o.hide_parent && internal.parent_was_hidden === true){
					internal.parent.hide();
				}
				internal.parent_was_hidden = null;
				if(o.hide_siblings){
					internal.$e.siblings().show();
				}
			}

			if(internal.class_target){
				internal.class_target.removeClass(o.invalid_class);
			}
		});

		field.event_receiver.bind('validationFail', {field: field}, function(e, d){
			construct();

			if(internal.$e.parent().length){
				internal.$e.text(d.errors.join(', '));
				internal.$e.show();

				if(o.hide_parent && internal.parent.filter(':visible').length === 0){
					internal.parent_was_hidden = true;
					internal.parent.show();
				}
				
				if(o.hide_siblings){
					internal.$e.siblings().hide();
				}
			}

			if(internal.class_target){
				internal.class_target.addClass(o.invalid_class);
			}
		});
		
		field.event_receiver.bind(NI.field.co.RESET_EVENT, {}, function(e,d){
			internal.$e.empty();
		});
		
	}


	field.extensions.Validator = Validator;
	field.extensions.SimpleTooltipValidatorError = SimpleTooltipValidatorError;
	field.extensions.ValidatorError = ValidatorError;

	return Validator;

});