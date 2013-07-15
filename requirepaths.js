require = {
	paths: {
		'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min',
		'jquery_migrate': 'http://code.jquery.com/jquery-migrate-1.2.1.js',
		'hashchange': 'thirdparty/jquery-migrate-1.2.1.min',

		'NIanim': 'lib/anim',
		'NIAnimator': 'lib/Animator',
		'NIApp': 'lib/App',
		'NIBrowserDetection': 'lib/BrowserDetection',
		'NICarousel': 'lib/Carousel',
		'NIcolor': 'lib/color',
		'NICookies': 'lib/Cookies',
		'NIFavicon': 'lib/Favicon',
		'NIfeaturedetection': 'lib/featuredetection',

		'NIfield': 'lib/field',
		'NIfield.Autocomplete': 'lib/field/Autocomplete',
		'NIfield.Counter': 'lib/field/Counter',
		'NIfield.Dropdown': 'lib/field/Dropdown',
		'NIfield.Hint': 'lib/field/Hint',
		'NIfield.SimpleTooltip': 'lib/field/SimpleTooltip',
		'NIfield.std': 'lib/field/std',
		'NIfield.Validator': 'lib/field/Validator',

		'NIflippanel': 'lib/flippanel',
		'NIfullscreen': 'lib/fullscreen',
		'NIGoogleAnalytics': 'lib/GoogleAnalytics',
		'NIgoogleanalyticsheader': 'lib/googleanalyticsheader',

		'NIMerlin': 'lib/Merlin',
		'NIMerlin.Autosave': 'lib/merlin/MerlinAutosave',
		'NIMerlin.CSRF': 'lib/merlin/MerlinCSRF',
		'NIMerlin.Data': 'lib/merlin/MerlinData',

		'NIOverlay': 'lib/Overlay',
		'NIseed': 'lib/seed',
		'NISocialRotator': 'lib/SocialRotator',
		'NITooltip': 'lib/Tooltip',
		'NIvalidation': 'lib/validation',

		'NIPushstateHelper': 'lib/PushstateHelper'
	},
	shim: {
		jquery_migrate: ['jquery'],
		hashchange: ['jquery', 'jquery_migrate']
	}
};