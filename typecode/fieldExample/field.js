(function(window, $) {
	var NI = window.NI,
		 console = NI.app.getConsole(true);
	
	console.info("NI field!!!");
	console.log(NI.field);

	$(function() {	
			var input = NI.field.new_instance({
				element: "#my-input",
				options: {
					extensions: {
						Validator: {
							validators: ["number"]
						},
						Autocomplete: {
						
						},
						Hint: {
							content: "Enter a number"/*,
							css: {
								top: 5,
								left: 5
							}*/
						}
					},
					handlers: {
						focus: function(e) {
							console.info("focus");
						},
						blur: function(e) {
							console.info("blur");
						}
					},
					val: ""
				}
			});
			console.log(input);
	
			var password = NI.field.new_instance({
				element: "#my-password"
			});
			console.log(password);
			var dropdown = NI.field.new_instance({
				element: "#my-dropdown", // This also could be $('#my-dropdown')
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
			console.log(dropdown);

			var dropdown2 = NI.field.new_instance({
				element: "#my-dropdown2",
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
				console.log(dropdown2);	
			
			var dropdown3 = NI.field.new_instance({
				element: "#my-dropdown3",
				options: {
					handlers:{
						change: function(e,d){
							if(d) {
								console.info("change from"+ d.from +" to " + d.to);
							}
						}
					}
				}
			});
				
			var headlessDropdown = new NI.field.Dropdown({
				value_list: {
					"0": "A Train",
					"1": "B Train"
				},
				empty_text: "Select a Train"
			});
			headlessDropdown.append_to("body");
			console.log(headlessDropdown);

			var textarea = NI.field.new_instance({
				element: "#my-textarea",
				options: {
					extensions: {
						Hint: {
							content: "Enter a Comment",
							css: {
								top: 5,
								left: 5
							}
						}
					}
				}
			});
			console.log(textarea);

			var select = NI.field.new_instance({
				element: "#my-select",
				options: {

				}
			});
			console.log(select);

			var checkbox = NI.field.new_instance({
				element: "#my-checkbox",
				options: {
					label: "label!"
				}
			});
			console.log(checkbox);
	});
	

}(this, this.jQuery));
