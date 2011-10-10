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
	if (backHeight > frontHeight) {/*do nothing*/} else {backHeight = frontHeight};
	
	speed = 300;
	
	// set box heights
	flipContainer.height(frontOuterHeight);
	backBox.css('height', frontHeight).show();
	
	// events
	frontTrigger.click(function(){		
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