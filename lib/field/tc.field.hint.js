/*    _____                    _____          
     /\    \                  /\    \         
    /::\    \                /::\    \        
    \:::\    f\              /::::\    \       
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

// Dependencies:
// NI.field

(function(window, $) {
	
	var NI = window.NI;

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	NI.field.extensions.Hint = function(field, options) {
		var me, o, $e;
		
		me = this;
		o = $.extend({
			content: null,
			css: {},
			fx: {
				in: 200,
				out: 200
			},
			watch_events: {
				in: ['blur', 'keyup', 'change', NI.field.co.SET_VAL_EVENT, NI.field.co.RESET_EVENT].join(' '),
				out: "focus"
			}
		}, options);
		
		function init() {
			$e = $("<div class='"+ NI.field.co.HINT_CLASS +"'></div>");
			$e.css($.extend({
				position: "absolute",
				top: 0,
				left: 0,
				display: "none"
			}, o.css));
			$e.prependTo(field.$e);
			
			$e.click(events.hint_click);
			field.event_receiver.bind(o.watch_events.in, events.in);
			field.event_receiver.bind(o.watch_events.out, events.out);
			
			me.set(o.content);
			
			if (NI.ex.isEmpty(field.get_val())) {
				$e.show();
			}
		}
		
		var events = {
			hint_click: function(e, d) {
				field.event_receiver.trigger('focus');
			},
			in: function(e, d) {
				if (NI.ex.isEmpty(field.get_val())) {
					if (e.type === "blur" || e.type == NI.field.co.RESET_EVENT) {
						$e.fadeIn(o.fx.in);
					}
				} else {
					$e.fadeOut(o.fx.out);
				}
			},
			out: function(e, d) {
				$e.fadeOut(o.fx.out);
			}
		};
		
		// (chainable)
		this.set = function(content) {
			if (content instanceof $) {
				$e.empty().append(content);
			} else if (typeof content === "string") {
				if (!NI.ex.isEmpty(content)) {
					$e.empty().text(content);
				}
			}
			return this;
		};
		
		this.destroy = function() {
			$e.remove();
			field.event_receiver.unbind(o.watch_events.in, events.in);
			field.event_receiver.unbind(o.watch_events.out, events.out);
		};
		
		init();
	};

}(this, this.jQuery));