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
			onClose: function(instance) {} // Callback After Overlay is hidden and content removed.
		}, options);
		
		function init(me){
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
			
			$elements = {
				pane:$c.find(">.tier > .tier > .pane"),
				hd:$elements.pane.children(".hd"),
				bd:$elements.pane.children(".bd"),
				ft:$elements.pane.children(".ft")
			};
			
			if (o.maskClick) {
				$c.bind("click", {instance:me, $pane:$elements.pane, allowPaneClick: true}, events.clickClose);
			}
			
			$c.bind("focus", {instance:me, escape:o.escape, $c:$c}, function(e) {
				$(window.document).bind("keydown.overlay", {instance:e.data.instance, escape:e.data.escape, $c:e.data.$c}, events.keydown);
			}).bind("blur", {instance:me}, function(e) {
				$(window.document).unbind("keydown.overlay", events.keydown);
			});
			
			open = false;
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
				e.preventDefault();
				if (e.data.$pane && e.data.allowPaneClick) {
					if (!$.contains(e.data.$pane[0], e.target)) {
						e.data.instance.close();
					}
				} else {
					e.data.instance.close();
				}				
			}
		};
		
		var generate = {
			overlay:function(){
				return $( '<div class="overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; overflow:auto;">\
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
		};
		
		this.open = function(options) {
			var _o;
			_o = $.extend({
				hd:null,
				bd:null,
				ft:null
			},options);
						
			if (_o.hd) { $elements.hd.empty().append(_o.hd); }
			if (_o.bd) { $elements.bd.empty().append(_o.bd); }
			if (_o.ft) { $elements.ft.empty().append(_o.ft); }
			
			if (o.closeBtn && !($elements.hd.find(".btn-close").length)) {
				$elements.hd.append(generate.closeBtn(this));
			}
			
			$m.show();
			$c.show().scrollTop(0).focus();
			
			open = true;
			
			return this;
		};
		
		this.close = function() {
			if (!open) { return this; }
			$m.fadeOut();
			$c.hide().blur();
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