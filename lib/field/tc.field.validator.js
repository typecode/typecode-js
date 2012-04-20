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

	field.extensions.Validator = function(field, options) {
		var me, o;
		
		me = this;
		o = $.extend({
			validators: null,
			manager: null,
			on_valid:function(e,d){},
			on_invalid:function(e,d){}
		}, options);
		
		function init() {
			
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

			field.$e.bind('validationPass', {}, o.on_valid);
			field.$e.bind('validationFail', {}, o.on_invalid);
			
			field.$e.data("master", field);

			o.manager.addField({
				element: field.$e,
				validators: o.validators
			});
			
		}
		
		init();
	};

	field.extensions.ValidatorError = function(field, options) {
		var me, o, internal;
		
		me = this;
		o = $.extend({

		}, options);

		internal = {
			$e: $('<div class="tc-field-validator-error"></div>')
		};
		
		function init() {
			field.$e.append(internal.$e);
		}

		field.event_receiver.bind(NI.field.co.RESET_EVENT, {}, function(e,d){
			internal.$e.empty();
		});
		
		init();
	};

}(this, this.jQuery));