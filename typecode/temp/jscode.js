// The element: takes the id of the dropdown you have set up.
// Instead of "#my-dropdown" you can also write, $('#my-dropdown').
// We are using jQuery to fetch html elements.

var dropdown = NI.field.new_instance({
	element: "#my-dropdown", 
	options: {
		handlers: {
			change: function(e, d) {
				if (d) { 
					console.info("change from "+ d.from +" to "+ d.to);
				}
			}
		}
	}
});