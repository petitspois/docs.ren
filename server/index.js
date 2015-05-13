/* bootstorp */

module.exports = function() {

	//引入模块
	var app = require('koa')(),

		render = require('koa-swig'),

		ksc = require('koa-static-cache'),

		bodyparser = require('koa-bodyparser'),

		session = require('koa-session'),
		//favicon中间件
		fav = require('./parts/favicon'),

		webset = require('./parts/webset'),

		router = require('./router/'),

		mongoose = require('./mongoose'),

		//获取默认配置
		conf = require('./config');



	//cookie key
	app.keys = [conf.secret];

	//debug
	conf.debug && app.use(require('koa-logger')());

	//parse
	app.use(bodyparser({
		formLimit: '2mb'
	}));

	//session
	app.use(session({
		maxAge: 7 * 24 * 60 * 60 * 1000
	}, app));

	//static cache
	conf.enableStatic && app.use(ksc(conf.static, {
		maxAge: 0,
		dynamic: true
	}));

	//加载favicon.ioc
	app.use(fav());

	//webset
	app.use(webset(render.swig));

	//connection db
	mongoose(conf.mongodb);

	//init methods
	app.context.render = render({
		root: conf.views,
		autoescape: true,
		cache: 'memory', // disable, set to false
		ext: 'html'
	});


	app.context.msg = function(url, val, title) {
		return render('msg', {
			url: url,
			msg: val,
			secondtitle: title,
			time: 5
		});
	};


	//Error Handling
	app.use(function*(next) {
		try {
			yield next;
		} catch (err) {
			this.redirect('/404');
		}
	});

	//routers
	router(app);

	//监听
	app.listen(conf.port, function() {
		console.log('listening on port ' + conf.port);
	});
}
