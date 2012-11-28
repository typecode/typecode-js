/* ============================================================================

 >4SESz.,     _,     ,gSEE2zx.,_        .azx                    ,w.
@Sh. "QEE3.  JEE3.  &ss  `*4EEEEE2x.,_  "EEV  ,aS5^;dEEEE2x.,   VEEF  _
\E2`_,gF4EEEx.?jF   EE5L       `*4EEEEE2zpn..ZEEF ;sz.  `*EEESzw.w* '|EE.
  ,dEEF   `"?j]  _,_   ,_  _,     _,.     L.EEEF  !EEF  _,,  `"``    EE7   ,,_
 :EEE7 ,ws,`|EEL`JEEL`JEE)`JEEL zE5` E3. / [EE3  ,w.  zE2` Ek .zE5^JZE3.,6EF [3
 {EEE. VEE7.EE2  AE3. EEV  ZEEL{EEL ws. ;  [EE1  EEEt{E3. JEELEE3. JE5LJEEF ,w,
  \EEk,,>^ JEEL,@EEF ZE5L,ZE5^ "Q3. V2`.    \EEk,,J' "Q[ yE2^ VE[_zEE[,"QEL V5F
          ,ss  :EE7 ;EEF               L,szzw..            ,.,            ``
          \E5.,E5F  EE1.              /; ``*4EEEZhw._      EEEL
            ````     ``              JEEE.     `"45EEEhw.,,,]

From 2010 till ∞
typecode-js v 0.1
*/

define(['jquery', 'NIseed'], function($) {

	/*	to use, the selector of the element with class .flip-panel must be passed.
		
		.flip-panel must have two direct children, .front and .back, as well as two triggers,
		.front-trigger and .back-trigger.
		
		as a direct child of both .front and .back, there must be a div with class .inner
	*/
	this.NI.flip_panel = function(eleContainer) {
		
		// variables
		var	flipContainer, frontBox, frontInner, backBox, backInner,
			frontTrigger, backTrigger, innerOuterDiff, speed, slideDelay, webkitPerspective;
		
		speed = 300;				// speed of height change when flipping
		slideDelay = 200;			// delay after flip starts before changing height
		
		applyWebkitCSSinJS = true;
		webkitPerspective = 600;


		flipContainer = $(eleContainer);
		frontBox = flipContainer.children('.front');
		frontInner = frontBox.children('.inner');
		frontTrigger = flipContainer.find('.front-trigger');
		backBox = flipContainer.children('.back');
		backInner = backBox.children('.inner');
		backTrigger = flipContainer.find('.back-trigger');
		
		innerOuterDiff = frontBox.height() - frontInner.height();
			



		// events
		frontTrigger.click(function(){
			frontBox.show();

			if(applyWebkitCSSinJS) {
				flipContainer.css('-webkit-perspective', webkitPerspective);
				frontBox.css('-webkit-transform-style','preserve-3d');
				backBox.css('-webkit-transform-style','preserve-3d');
			}

			backBox.find('.btn-edu').css('opacity','0');

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

					if(applyWebkitCSSinJS) {
						// if speed + slideDelay is less than the CSS transition // speed (400ms), additional delay should be put on this
						flipContainer.css('-webkit-perspective','none');
						frontBox.css('-webkit-transform-style','flat');
						backBox.css('-webkit-transform-style','flat');
					}

					backBox.find('.btn-edu').animate({'opacity':'1'}, 400);
				});
			});
		});



		backTrigger.click(function(){
			backBox.css('position','absolute').show();

			if(applyWebkitCSSinJS) {
				flipContainer.css('-webkit-perspective', webkitPerspective);
				frontBox.css('-webkit-transform-style','preserve-3d');
				backBox.css('-webkit-transform-style','preserve-3d');
			}

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

					if(applyWebkitCSSinJS) {
						// if speed + slideDelay is less than the CSS transition
						// speed (400ms), additional delay should be put on this
						flipContainer.css('-webkit-perspective','none');
						frontBox.css('-webkit-transform-style','flat');
						backBox.css('-webkit-transform-style','flat');
					}

					backBox.find('.btn-edu').css('opacity','0');
				});
			});
		});

		
	};

});