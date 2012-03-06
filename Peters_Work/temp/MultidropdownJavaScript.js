//Nothing changed from the JavaScript set up for regular typecode dropdown.
var multiDropdown = NI.field.new_instance({
	element: "#my-multidropdown",
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