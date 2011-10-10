/*	to use, the selector of the element with class .flip-panel must be passed.
	.flip-panel must have two children, .front and .back, as well as two triggers,
	.front-trigger and .back-trigger.
	
	the second item passed to the function is the height of the .back; for now, 
	the back height must be greater than or equal to the front height. if not,
	the height will default to the front height.	
*/
function flipPanel(eleContainer, backHeight) {
	// variables
	var	flipContainer, frontBox, backBox, frontTrigger, backTrigger, speed,
		frontHeight, frontOuterHeight, frontOuterHeightDifference;
	
	flipContainer = $(eleContainer);
	frontBox = flipContainer.find('.front');
	backBox = flipContainer.find('.back');
	frontTrigger = flipContainer.find('.front-trigger');
	backTrigger = flipContainer.find('.back-trigger');
	
	frontHeight = frontBox.height();
	frontOuterHeight = frontBox.outerHeight();
	frontOuterHeightDifference = frontOuterHeight - frontHeight;
	if (!backHeight>frontHeight) {backHeight = frontHeight};
	
	speed = 300;
	
	// set heights
	flipContainer.height(frontOuterHeight);
	backBox.css('height', frontHeight).show();
	
	// events
	frontTrigger.click(function(){		
		// calculate heights if height of .front has changed from when first loaded
		if (frontHeight != frontBox.height()) {
			frontHeight = frontBox.height();
			frontOuterHeight = frontBox.outerHeight();
			frontOuterHeightDifference = frontOuterHeight - frontHeight;
			if (!backHeight>frontHeight) {backHeight = frontHeight};
			backBox.css('height', frontHeight);
		};
		flipContainer.toggleClass('flip'); 
		if (frontHeight < backHeight) {
			flipContainer.delay(400).animate({height: backHeight + frontOuterHeightDifference}, speed);
			backBox.delay(400).animate({height: backHeight}, speed);
		}
	});
	backTrigger.click(function(){
		if (frontHeight < backHeight) {
			flipContainer.animate({height: frontOuterHeight}, speed);
			backBox.animate({height: frontHeight}, speed, function(){
				flipContainer.toggleClass('flip'); 
			});
		} else {
			flipContainer.toggleClass('flip'); 
		}
	});
};

function flipPanel_resetHeights(eleContainer) {
	var flipContainer, frontBox, backBox, frontHeight, frontOuterHeight, heightsArray;
	
	flipContainer = $(eleContainer);
	frontBox = flipContainer.find('.front');
	backBox = flipContainer.find('.back');

	frontHeight = frontBox.height();
	frontOuterHeight = frontBox.outerHeight();
	frontOuterHeightDifference = frontOuterHeight - frontHeight;
		
	flipContainer.height(frontOuterHeight);
	backBox.css('height', frontHeight).show();
};