
var textarea = NI.field.new_instance({
	element: "#my-textarea",
	options: {
		extensions: {
//As exaplained in input field, you can tweak the hint message here and placement of the message with css top and left property.
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