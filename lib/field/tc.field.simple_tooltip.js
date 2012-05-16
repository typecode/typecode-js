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
	
	var NI = window.NI;

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	NI.field.co.SIMPLE_TOOLTIP_CLASS = 'tc-field-simple-toolip';

	NI.field.extensions.SimpleTooltip = function(field, options) {
		var me, o, internal, event_handlers;
		
		me = this;
		o = $.extend({
			content: null,
			orientation:'left',
			css: {},
			fx: {
				in: 200,
				out: 50
			},
			watch_events: {
				in: "focus",
				out: "blur"
			}
		}, options);

		internal = {
			name:'TC.field Extension.SimpleTooltip',
			$e:$("<div class='"+ NI.field.co.SIMPLE_TOOLTIP_CLASS +"'></div>")
		};
		
		function init() {

			internal.$e.addClass(o.orientation);
			internal.$e.css($.extend({
				
			}, o.css));
			internal.$e.prependTo(field.$e);
			
			internal.$e.html(o.content);

			field.event_receiver.bind(o.watch_events.in, event_handlers.in);
			field.event_receiver.bind(o.watch_events.out, event_handlers.out);

			field.set_tooltip_content = function(new_content){
				internal.$e.html(new_content);
			};

			field.get_tooltip_content = function(new_content){
				return internal.$e;
			};

		};

		event_handlers = {
			in: function(e,d){
				internal.$e.fadeIn(o.fx.in);
			},
			out: function(e,d){
				internal.$e.fadeOut(o.fx.out);
			}
		};
		
		
		init();
	};

}(this, this.jQuery));