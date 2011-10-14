/*	to use, the selector of the element with class .flip-panel must be passed.
	
	.flip-panel must have two direct children, .front and .back, as well as two triggers,
	.front-trigger and .back-trigger.
	
	as a direct child of both .front and .back, there must be a div with class .inner
*/
function flipPanel(eleContainer) {
	// variables
	var	flipContainer, frontBox, frontInner, backBox, backInner, 
		frontTrigger, backTrigger, innerOuterDiff, speed, slideDelay;
	
	flipContainer = $(eleContainer);
	frontBox = flipContainer.children('.front');
	frontInner = frontBox.children('.inner');
	frontTrigger = flipContainer.find('.front-trigger');
	backBox = flipContainer.children('.back');
	backInner = backBox.children('.inner');
	backTrigger = flipContainer.find('.back-trigger');
	
	innerOuterDiff = frontBox.height() - frontInner.height();
	
	speed = 300;
	slideDelay = 200;
		
	// events
	frontTrigger.click(function(){		
		frontBox.show();
		backBox.css({
			'height': frontBox.height(),
			'position': 'absolute',
			'overflow': 'hidden'
		}).show(0, function(){
			flipContainer.addClass('flip'); 
		});
		frontBox.delay(slideDelay).hide(0, function(){
			frontBox.css('display','none'); 
			backBox.css('position','relative').animate({
				height: backInner.height() + innerOuterDiff
			}, speed, function(){
				backBox.css({'height':'auto', 'overflow':'visible'});
			});
		});
	});
	backTrigger.click(function(){
		backBox.css('position','absolute').show();
		frontBox.css({
			'height': backBox.height(),
			'overflow': 'hidden'
		}).show(0, function(){
			flipContainer.removeClass('flip'); 
		});
		backBox.delay(slideDelay).hide(0, function(){
			frontBox.animate({
				height: frontInner.height() + innerOuterDiff
			}, speed, function(){
				frontBox.css({'height':'auto', 'overflow':'visible'});
			});
		});
	});
};