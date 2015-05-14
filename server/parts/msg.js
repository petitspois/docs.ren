/**
 * Created by petitspois on 14/5/15.
 */
var settingsModel = require('../../model/').settings,
	userModel = require('../../model/').user;

module.exports = function(render, app) {
	return function* msg(next) {
		var ctx = this;

		app.context.msg = function(url, val, title) {
			return ctx.render('msg', {
				url: url,
				msg: val,
				secondtitle: title,
				time: 5
			});
		};

		try {
			yield * next;
		} catch (err) {
			throw err;
		}
	}
}
