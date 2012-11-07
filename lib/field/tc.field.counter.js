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
	'./../tc.field'
], function($) {
	
	var NI = window.NI;

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	NI.field.extensions.Counter = function(field, options) {
		var me, o, internal, elements, event_handlers;
		
		me = this;
		o = $.extend({
			max:100,
			difference:0,
			updated:function(e,d){},
			count_element:'.count',
			total_element:'.total'

		}, options);

		internal = {
			name:'TC.field Extension.SimpleTooltip',
			$e:null
		};

		elements = {
			count:(o.count_element instanceof $ ? o.count_element : field.$e.find(o.count_element)),
			total:(o.total_element instanceof $ ? o.total_element : field.$e.find(o.total_element))
		};

		function init(){
			field.event_receiver.bind('focus keyup change', {field:field}, event_handlers.updated);
		};

		event_handlers = {
			updated:function(e,d){
				o.difference = o.max - field.get_val().length;
				
				elements.count.text(o.difference);
				//elements.total.text(o.max);
				
				if (o.difference < 0) {
					elements.count.parent().addClass('too-many')
				} else {
					elements.count.parent().removeClass('too-many')
				};
			}	
		};


		init();

	};

	return NI.field.extensions.Counter;

});