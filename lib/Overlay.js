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
	NI = window.NI;
	
	function Overlay(options) {
		var o, $e, $m, open, $elements, handlers, generate;
		
		o = $.extend({
			context: 'body', // Selector to element where overlay will be inserted.
			autoflush: true, // If true, the Overlay automatically flushes its content when it is closed.
			flavor: null, // Additional classnames for Mask and Overlay.
			mask_click: true, // Hide Overlay if Mask is Clicked.
			mask_fadeout_speed: 100, // Delay for mask Fade Out Animation.
			escape: true, //ESC Keypress closes Overlay.
			close_btn: false, // Appends Close Button to Overlay.

			// if true, the Overlay adjusts its behavior
			// to be appropriate for touch devices
			// (primarily by not using fixed positioning)
			touch: false,

			open_transition: null,
			on_open: function(instance) {}, // Callback after Overlay is opened.
			on_close: function(instance) {} // Callback after Overlay is hidden.
		}, options);
		
		function init(me) {
			var $pane;
			
			$e = generate.overlay().hide().appendTo(o.context);
			$m = generate.mask().hide();
			$e.before($m);
			
			if (typeof o.flavor === 'string') {
				$e.addClass(o.flavor);
				$m.addClass(o.flavor);
			} else if ($.isArray(o.flavor)) {
				$.each(o.flavor, function(i, flavor) {
					$e.addClass(flavor);
					$m.addClass(flavor);
				});
			}
			
			$pane = $e.find('>.tier > .tier > .pane');
			$elements = {
				pane: $pane,
				hd: $pane.children('.hd'),
				bd: $pane.children('.bd'),
				ft: $pane.children('.ft')
			};
			
			if (o.mask_click) {
				$e.on('click', {instance:me, $pane:$elements.pane, allowPaneClick: true}, handlers.click_close);
				if (o.touch) {
					$m.on('click', {instance: me}, handlers.click_close);
				}
			}
			
			open = false;
		}
		
		handlers = {
			keydown: function(e) {
				var key;
				key = e.keyCode || e.which;
				switch (key) {
					case NI.co.keyboard.ESCAPE:
						if (e.data.escape === true) {
							e.data.instance.close();
						}
						break;
					case NI.co.keyboard.ENTER:
						e.data.$e.find(".button.ca").click();
						break;
				}
			},
			click_close: function(e) {
				var pane;
				if (e.data.$pane && e.data.allowPaneClick) {
					pane = e.data.$pane[0];
					if (!$.contains(pane, e.target) && (pane != e.target) && $.contains(document.body, e.target)) {
						e.preventDefault();
						e.data.instance.close();
					}
				} else {
					e.preventDefault();
					e.data.instance.close();
				}
			}
		};
		
		generate = {
			overlay: function() {
				var $overlay = $( '<div class="overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; overflow:auto;">\
					<div class="tier" style="display:table; margin:0 auto; height:100%;">\
						<div class="tier" style="display:table-cell;">\
							<div class="pane" style="position:relative;">\
								<div class="hd"></div>\
								<div class="bd"></div>\
								<div class="ft"></div>\
								<div style="clear:both;"></div>\
							</div>\
						</div>\
					</div>\
				</div>' );
				
				if (o.touch) {
					$overlay.css({
						position: 'absolute',
						overflow: 'visible'
					});
				}
				
				return $overlay;
			},
			mask: function() {
				var $mask = $( '<div class="mask" style="position:fixed; top:0; left:0; width:100%; height:100%;">\
				</div>' );
				
				if (o.touch) {
					$mask.css({
						position: 'absolute'
					});
				}
				
				return $mask;
			},
			close_btn: function(instance) {
				var $btn;
				$btn = $('<a href="#" class="btn-close"><span>Close</span></a>');
				if (instance) {
					$btn.on('click', {instance:instance}, handlers.click_close);
				}
				return $btn;
			}
		};
		
		this.flush = function() {
			$elements.hd.empty();
			$elements.bd.empty();
			$elements.ft.empty();
			if (o.touch) {
				$m.css({ height: '100%' });
			}
			return this;
		};

		this.get$e = function(){
			return $e;
		};
		
		this.set_header = function($hd) {
			$elements.hd.empty().append($hd);
			return this;
		};

		this.get_header = function(){
			return $elements.hd;
		};
		
		this.set_body = function($bd) {
			$elements.bd.empty().append($bd);
			return this;
		};

		this.get_body = function(){
			return $elements.bd;
		};
		
		this.set_footer = function($ft) {
			$elements.ft.empty().append($ft);
			return this;
		};

		this.get_footer = function(){
			return $elements.ft;
		};
		
		this.open = function(options) {
			var _o;
			_o = $.extend({
				hd: null,
				bd: null,
				ft: null
			}, options);
						
			if (_o.hd) { this.set_header(_o.hd); }
			if (_o.bd) { this.set_body(_o.bd); }
			if (_o.ft) { this.set_footer(_o.ft); }
			
			if (o.close_btn && !($elements.hd.find('.btn-close').length)) {
				$elements.hd.append(generate.close_btn(this));
			}
			
			$e.find('.btn-close').on('click', {instance:this}, handlers.click_close);
			

			if (o.open_transition && $.isFunction(o.open_transition)) {
				o.open_transition($e, $m);
			} else {
				$m.fadeIn();
				$e.fadeIn().scrollTop(0).focus();
			}
			
			if (o.touch) {
				$m.height( $(document).height() );
			}
			
			$(window.document).on('keydown.overlay', {instance:this, escape:o.escape, $e:$e}, handlers.keydown);
			
			open = true;
			if ($.isFunction(o.on_open)) {
				o.on_open(this);
			}
			return this;
		};
		
		this.close = function() {
			if (!open) { return this; }

			if (o.closeTransition && $.isFunction(o.closeTransition)) {
				o.closeTransition($e, $m);
			} else {
				$m.fadeOut();
				$e.hide().blur();
			}
			
			$(window.document).off('keydown.overlay', handlers.keydown);
			
			if (o.autoflush === true) {
				this.flush();
			}
			open = false;
			if ($.isFunction(o.on_close)) {
				o.on_close(this);
			}
			return this;
		};
		
		this.destroy = function() {
			$e.blur().remove();
			$m.remove();
		};
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Overlay = Overlay;
	
});