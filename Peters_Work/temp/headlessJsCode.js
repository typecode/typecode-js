
//This one is pretty self explanatory, you would increment
//numeric values along with matching order of text values.
//So, as an example, if you wish to add third element to your
//drop down, in the value_list, you would add "2": "C Train".
//Remember to add commas to previous elements.
var headlessDropdown = new NI.field.Dropdown({
	value_list: {
		"0": "A Train",
		"1": "B Train"
	},
//Also, you can tweak this empty_text value as well.
	empty_text: "Select a Train"
});
//".headless" is a class name in HTML. You can create a div 
//with a specific class name to designate your Dropdown or 
//you don't have to make one and just append to the DOM.
headlessDropdown.append_to(".headless");