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
        fav = require('./parts/favicon'),

        router = require('./router/'),

        mongoose = require('./mongoose'),

        //获取默认配置
        conf = require('./config');



    //cookie key
    app.keys = [conf.secret];

    //debug
    app.use(logger());

    //parse
    app.use(bodyparser({formLimit:'2mb'}));

    //session
    app.use(session({maxAge:7* 24 * 60 * 60 * 1000},app));

    //static cache
    app.use(sC(conf.static, {maxAge:0}));

    //加载favicon.ioc
    app.use(fav());

    //connection db
    mongoose(conf.mongodb);

    //init methods
    app.context.render = render = views(conf.views, { map:{ html:'swig' } });

    app.context.msg = function(url, val, title){
        return render('msg',{url:url,msg:val,secondtitle:title,time:5});
    };

    //routers
    router(app);

    app.use(function* (){
        this.body = render('404');
    });

    //监听
    app.listen(conf.port,function(){
        console.log('listening on port ' + conf.port);
    });
}
