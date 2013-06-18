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

define(['jquery', 'NIseed'], function($) {
	
	var window = this,
	NI = window.NI,

	color = {
		get_rgb_from_hex:function(index,hex){
			if(index.toLowerCase() == 'r'){
				return parseInt((this.cut_hex(hex)).substring(0,2),16);
			} else if(index.toLowerCase() == 'g'){
				return parseInt((this.cut_hex(hex)).substring(2,4),16);
			} else if(index.toLowerCase() == 'b'){
				return parseInt((this.cut_hex(hex)).substring(4,6),16);
			}
		},
		cut_hex:function(h){
			return (h.charAt(0)=='#') ? h.substring(1,7) : h;
		}
	};

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.color = color;
	
});