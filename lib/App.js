define(['jquery'], function($) {

	var App = function(options) {
		var self = this, o;

		o = $.extend({
			page: {
				_features: [],
				add_feature: function(feature) {
					this._features.push(feature);
				}
			}
		}, options);

		this.page = o.page;
		this.events = $({});
		this.runtime = {};

		this.invoke_feature_set(this.page._features);
		
		this.page.add_feature = function() {
			self.invoke_feature.apply(self, arguments);
		};
	};

	App.prototype.invoke_feature = function(feature) {
		var self = this;
		if ($.isFunction(feature)) {
			feature(self);
		} else if (typeof feature === "string") {
			require([feature]);
		} else if (typeof feature === "object" && feature && $.isArray(feature.require)) {
			require(feature.require, function() {
				var args;
				if ($.isFunction(feature.callback)) {
					args = [self];
					$.each(arguments, function(i, arg) {
						args.push(arg);
					});
					feature.callback.apply(this, args);
				}
			});
		}
	};

	App.prototype.invoke_feature_set = function(feature_set) {
		var self = this;
		if (!feature_set || typeof feature_set !== "object") {
			return false;
		}
		$.each(feature_set, function(i, feature) {
			self.invoke_feature(feature);
		});
	};

	return App;

});