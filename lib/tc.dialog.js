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
                         From 2010 till ∞     
                         typecode-js v0.1       
                                                */

// Dependencies:
// NI.Overlay

(function(window, $) {
	
	var NI = window.NI;
	
	function Dialog(options) {
		var overlay, o;
		
		o = $.extend({
			context: null,
			escape: true
		}, options);
		
		overlay = new NI.Overlay({
			context: o.context,
			flavor: "dialog",
			maskClick: false,
			escape: o.escape
		});
		
		var generate = {
			button:function(label, flavor) {
				if (!flavor) { flavor = ""; }
				return $( "<a class='button "+ flavor +"' href='#'><span>"+ label + "</span></a>" );
			},
			dialogControls:function($yesBtn, $noBtn) {
				var $dom = $("<div class='controls'></div>");
				$dom.prepend($yesBtn).prepend($noBtn);
				return $dom;
			},
			fields:function(){
				var $dom = $("<div class='input-pane'></div>");
				$.each(fields, function(i, field) {
					$dom.append(field.$f);
				});
				return $dom;
			}
		};
		
		function open(message, action, yes, no) {
			var $yesBtn, $noBtn;

			$yesBtn = generate.button(action, "ca");
			$yesBtn.bind("click", {overlay:overlay}, function(e) {
				e.preventDefault();
				if ($.isFunction(yes)) {
					if (yes() !== false) {
						e.data.overlay.close();
					}
				} else {
					e.data.overlay.close();
				}
			});
			
			if (no !== false) {
				$noBtn = generate.button("Cancel");
				$noBtn.bind("click", {overlay:overlay}, function(e) {
					e.preventDefault();
					if ($.isFunction(no)) {
						no();
					}
					e.data.overlay.close();
				});
			}
			
			overlay.open({
				bd: "<p>"+ message +"</p>",
				ft: generate.dialogControls($yesBtn, $noBtn)
			});
			
			return this;
		};
		
		this.confirm = function(message, action, yes, no) {
			return open(message, action, yes, no);
		};
		
		this.alert = function(message) {
			return open(message, "Okay", null, false);
		};
		
		this.prompt = function(message, action, fields, fn) {
			var $submitBtn, submit, keyHandler;
			
			submit = function() {
				var m = fn(fields, overlay);
				if (m) {
					$(window.document).unbind("keydown", keyHandler);
					overlay.close();
				}
			};
			
			keyHandler = function(e) {
				var key;
				key = e.keyCode || e.which;
				switch (key) {
					case NI.co.keyboard.ENTER:
						submit();
						break;
				}
			};
			
			if (!action) { action = "Submit"; }
			
			$submitBtn = generate.button(action, "ca");
			$submitBtn.bind("click", {fn:submit}, function(e) {
				e.preventDefault();
				e.data.fn();
			});
			
			$(window.document).bind("keydown", keyHandler);
			
			overlay.open({
				hd: "<h1>"+ message +"</h1>",
				bd: generate.fields(fields),
				ft: generate.dialogControls($submitBtn)
			});
			
			if ($.isArray(fields)) {
				fields[0].focus();
			}
			
			return this;
		};
		
		this.destroy = function() {
			overlay.destroy();
		};
		
		return this;
	}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.Dialog = Dialog;
	
}(this, this.jQuery));