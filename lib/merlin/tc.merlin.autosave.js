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
	
	var NI = window.NI;
	
	function MerlinAutosave(options){
		
		var o, internal, _me;
		
		o = $.extend({
			keyup_delay:300,
			change_delay:200,
			saved_delay:1500,
			prevent_invalid:false
		},options);
		
		internal = {
			save_timeout:null,
			functions:null
		};

		_me = this;
		
		this.init = function(me, functions){

			internal.functions = functions;
			
			for(i in me.internal.current_step.fields){

				if(!me.internal.current_step.fields[i].component){
					continue;
				}

				me.internal.current_step.fields[i].component.event_receiver.bind('change keyup',{ name:i,  },function(e,d){

					if(internal.save_timeout){ clearTimeout(internal.save_timeout); }
				
					if(o.prevent_invalid){
						if(me.internal.current_step.$e.hasClass('state-invalid')){
							return;
						}
					}

					me.internal.current_step.$e.addClass('merlin-autosave-state-unsaved')
						.removeClass('merlin-autosave-state-unsaved')
						.removeClass('merlin-autosave-state-saved');

					internal.save_timeout = setTimeout(function(){
						_me.save(me, functions);
					},((e.type == 'keyup') ? o.keyup_delay : o.change_delay));
				});
			}
			
		};

		this.save = function(me){
			if(internal.save_timeout){ clearTimeout(internal.save_timeout); }

			function saved(){
				me.internal.current_step.$e.addClass('merlin-autosave-state-saved')
					.removeClass('merlin-autosave-state-unsaved')
					.removeClass('merlin-autosave-state-saving');
				if($.isFunction(internal.functions.saved)){
					internal.functions.saved();
				}
			}
			
			me.internal.current_step.$e.addClass('merlin-autosave-state-saving')
				.removeClass('merlin-autosave-state-unsaved')
				.removeClass('merlin-autosave-state-saved');
				
			if($.isFunction(internal.functions.save)){
				internal.functions.save(saved);
			} else {
				saved();
			}
		};
		
		this.visible = function(me){
			
		};
		
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.MerlinAutosave = MerlinAutosave;
	
}(this, this.jQuery));