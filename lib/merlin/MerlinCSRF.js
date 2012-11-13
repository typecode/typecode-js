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

define(['jquery', 'NIseed', 'NIMerlin'], function($) {
	
	var window = this,
	NI = window.NI;
	
	function MerlinCSRF(options){
		
		var o, internal;
		
		o = $.extend({
			csrf_input_name:'csrfmiddlewaretoken'
		},options);
		
		internal = {
			data:{}
		};


		this.init = function(me){
			var csrf_input;
			
			csrf_input = me.internal.current_step.$e.find('input[name="'+o.csrf_input_name+'"]');

			if(csrf_input.length){
				internal.data[o.csrf_input_name] = csrf_input.val();
				me.set_val(o.csrf_input_name,csrf_input.val());
			}
			
		};

		this.get_data = function(){
			return internal.data;
		};

	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.MerlinCSRF = MerlinCSRF;
	
});