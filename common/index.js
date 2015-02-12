/* bootstorp */

module.exports = function(){

    //引入模块
    var app = require('koa')(),

        swig = require('swig'),

        logger = require('koa-logger'),

        sC = require('koa-static-cache'),

        views = require('co-views'),

        bodyparser = require('koa-bodyparser'),

        session = require('koa-session'),
        //favicon中间件
        fav = require('./middleware/favicon'),

        router = require('./router/'),

        mongoose = require('./mongoose'),

        //获取默认配置
        conf = require('./config');

        app.context.render = render = views(conf.views, { map:{ html:'swig' } });


    //cookie key
    app.keys = [conf.secret];

    //debug
    app.use(logger());

    //parse
    app.use(bodyparser());

    //session
    app.use(session());

    //static cache
    app.use(sC(conf.static, {maxAge:0}));

    //加载favicon.ioc
    app.use(fav());

    //connection db
    mongoose(conf.mongodb);

    //routers
    router(app);

    //404
    app.use(function* (){
        this.body = yield render('404');
    });

    //监听
    app.listen(conf.port,function(){
        console.log('listening on port ' + conf.port);
    });
}
