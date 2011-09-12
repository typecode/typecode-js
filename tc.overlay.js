/*    _____                    _____          
     /\    \                  /\    \         
    /::\    \                /::\    \        
    \:::\    \              /::::\    \       
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

(function(window, $) {
	
	var NI = window.NI;
	
	function Overlay(options) {
		var o, $c, $m, open, $elements;
		
		o = $.extend({
			context: "body", // Selector to element where overlay will be inserted.
			autoflush: true, // If true, the Overlay automatically flushes its content when it is closed.
			flavor: null, // Additional classnames for Mask and Overlay.
			maskClick: true, // Hide Overlay if Mask is Clicked.
			maskFadeOutSpeed: 100, // Delay for mask Fade Out Animation.
			escape: true, //ESC Keypress closes Overlay.
			closeBtn: false, // Appends Close Button to Overlay.
			isTouchDevice: false,
			onOpen: function(instance) {}, // Callback after Overlay is opened.
			onClose: function(instance) {} // Callback after Overlay is hidden.
		}, options);
		
		function init(me){
			var $pane;
			
			$c = generate.overlay().hide().appendTo(o.context);
			$m = generate.mask().hide();
			$c.before($m);
			
			if (typeof o.flavor === "string") {
				$c.addClass(o.flavor);
				$m.addClass(o.flavor);
			} else if ($.isArray(o.flavor)) {
				$.each(o.flavor, function(i, flavor) {
					$c.addClass(flavor);
					$m.addClass(flavor);
				});
			}
			
			$pane = $c.find(">.tier > .tier > .pane");
			$elements = {
				pane: $pane,
				hd: $pane.children(".hd"),
				bd: $pane.children(".bd"),
				ft: $pane.children(".ft")
			};
			
			if (o.maskClick) {
				$c.bind("click", {instance:me, $pane:$elements.pane, allowPaneClick: true}, events.clickClose);
			}
			
			open = false;
		}
		
		function insureMaskHeight() {
			var mheight, cheight;
			mheight = $m.height();
			cheight = $c.height();
			if (cheight > mheight) {
				$m.height(cheight);
			}
		}
		
		function resetMaskHeight() {
			$m.css({ height: "100%" });
		}
		
		var events = {
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
						e.data.$c.find(".button.ca").click();
						break;
				}
			},
			clickClose: function(e) {
				var pane;
				if (e.data.$pane && e.data.allowPaneClick) {
					pane = e.data.$pane[0];
					if (!$.contains(pane, e.target) && (pane != e.target)) {
						e.preventDefault();
						e.data.instance.close();
					}
				} else {
					e.preventDefault();
					e.data.instance.close();
				}
			}
		};
		
		var generate = {
			overlay:function(){
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
				
				if (o.isTouchDevice) {
					$overlay.css({
						position: "absolute",
						overflow: "visible"
					});
				}
				
				return $overlay;
			},
			mask:function(){
				return $( '<div class="mask" style="position:fixed; top:0; left:0; width:100%; height:100%;">\
				</div>' );
			},
			closeBtn:function(instance){
				var $btn;
				$btn = $( "<a href='#' class='btn-close'><span>Close</span></a>" );
				if (instance) {
					$btn.bind("click", {instance:instance}, events.clickClose);
				}
				return $btn;
			}
		};
		
		this.flush = function() {
			$elements.hd.empty();
			$elements.bd.empty();
			$elements.ft.empty();
			if (o.isTouchDevice) {
				resetMaskHeight();
			}
			return this;
		};
		
		this.setHeader = function($hd) {
			$elements.hd.empty().append($hd);
			return this;
		};
		
		this.setBody = function($bd) {
			$elements.bd.empty().append($bd);
			return this;
		};
		
		this.setFooter = function($ft) {
			$elements.ft.empty().append($ft);
			return this;
		};
		
		this.open = function(options) {
			var _o;
			_o = $.extend({
				hd:null,
				bd:null,
				ft:null
			},options);
						
			if (_o.hd) { this.setHeader(_o.hd); }
			if (_o.bd) { this.setBody(_o.bd); }
			if (_o.ft) { this.setFooter(_o.ft); }
			
			if (o.closeBtn && !($elements.hd.find(".btn-close").length)) {
				$elements.hd.append(generate.closeBtn(this));
			}
			
			$c.find('.btn-close').bind("click", {instance:this}, events.clickClose);
			
			$m.fadeIn();
			$c.fadeIn().scrollTop(0).focus();
			
			if (o.isTouchDevice) {
				insureMaskHeight();
			}
			
			$(window.document).bind("keydown.overlay", {instance:this, escape:o.escape, $c:$c}, events.keydown);
			
			open = true;
			if ($.isFunction(o.onOpen)) {
				o.onOpen(this);
			}			
			return this;
		};
		
		this.close = function() {
			if (!open) { return this; }
			$m.fadeOut();
			$c.hide().blur();
			
			$(window.document).unbind("keydown.overlay", events.keydown);
			
			if (o.autoflush === true) {
				this.flush();
			}
			open = false;
			if ($.isFunction(o.onClose)) {
				o.onClose(this);
			}
			return this;
		};
		
		this.destroy = function() {
			$c.blur().remove();
			$m.remove();
		};
		
		init(this);
	}
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Overlay = Overlay;
	
}(this, this.jQuery));