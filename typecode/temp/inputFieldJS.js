//
var input = NI.field.new_instance({
	element: "#my-input",
	options: {
//This is where you get to include extentions/functionalities that you may
//want to include in your input field. For the example, there are Validator and Hint.
//For more explanations on Validators check Validators tab.
		extensions: {
			Validator: {
//Here, we are indicating that the input kind will be number and nothing else.
				validators: ["number"]
			},
			Hint: {
//This is where you get to tweak hint messages. and placement according to your
//field size with css.
				content: "Enter a number",
				css: {
					top: 5,
					left: 5
				}
			}
		},
		handlers: {
//These handlers are included for you to perhaps in future bind functionalities,
//in each handling functions.
			focus: function(e) {
				console.info("focus");
			},
			blur: function(e) {
				console.info("blur");
			}
		},
//You can put in explicit values if you wish. We left this blank to display the hint.
		val: ""
	}
});