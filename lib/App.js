define(['jquery', 'NIseed'], function($) {

	var window = this,
	NI = window.NI,

	App = function(options) {
		var self = this, o;

		o = $.extend({
			page: {
				_features: [],
				add_feature: function(feature) {
					this._features.push(feature);
				}
			},
			debug: true
		}, options);

		window.console = NI.fn.get_console(o.debug);

		this.page = o.page;
		this.events = $({});
		this.runtime = {};

		this.contexts = {};

		this.invoke_feature_set(this.page._features);
		this.page.add_feature = function() {
			self.invoke_feature.apply(self, arguments);
		};

		this.get_state = function(){
			console.log('App.get_state');
		};
	};

	App.prototype.invoke_feature = function(feature, callback) {
		var self = this;

		if (!$.isFunction(callback)) {
			callback = $.noop;
		}

		if ($.isFunction(feature)) {
			feature(self);
			callback();
		} else if (typeof feature === 'string') {
			require([feature], function() {
				callback();
			});
		} else if (typeof feature === 'object' && feature && $.isArray(feature.require)) {
			require(feature.require, function() {
				var args;
				if ($.isFunction(feature.callback)) {
					args = [self];
					$.each(arguments, function(i, arg) {
						args.push(arg);
					});
					feature.callback.apply(this, args);
				}
				callback();
			});
		}
	};

	App.prototype.invoke_feature_set = function(feature_set, callback) {
		var self = this,
		n_features,
		n_initialized,
		feature_init_callback;

		if (!feature_set || typeof feature_set !== 'object' || !feature_set.length) {
			return false;
		}

		n_features = feature_set.length;
		n_initialized = 0;

		feature_init_callback = function() {
			n_initialized += 1;
			if (n_initialized === n_features) {
				self.events.trigger('app.featuresInitialized');
				if ($.isFunction(callback)) {
					callback();
				}
			}
		};

		$.each(feature_set, function(i, feature) {
			self.invoke_feature(feature, feature_init_callback);
		});
	};

	App.prototype.new_context = function(name){
		var self = this, context_runtime;
		if(self.contexts[name]){
			for(context_runtime in self.contexts[name]){
				if($.isFunction(self.contexts[name][context_runtime].destroy)){
					self.contexts[name][context_runtime].destroy();
				}
			}
		}
		self.contexts[name] = {};
		return self.contexts[name];
	};

	NI.App = App;

	return App;

});