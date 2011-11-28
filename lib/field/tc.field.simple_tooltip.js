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