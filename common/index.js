/* bootstorp */

module.exports = function(root){

    //当前目录
    const DIR = __dirname;

    //引入模块
    var app = require('koa')(),

        path = require('path'),

        swig = require('swig'),

        fs = require('fs'),

        session = require('koa-session'),

        logger = require('koa-logger'),

        sC = require('koa-static-cache'),

        co = require('co'),

        views = require('co-views'),



        //favicon中间件
        fav = require('./middleware/favicon'),

        router = require('./router/'),

        //获取默认配置
        conf = require('./config')(root),

        //favicon.ico路径
        favUrl = path.join(conf.static.img,'favicon.ico'),

        render = views(conf.views, { map:{ html:'swig' } });

    //debug
    app.use(logger());


    //static cache
    app.use(sC(path.join(root, 'assets'),{maxAge:0}));

    //加载favicon.ioc
    app.use(fav(favUrl));

    //routers
    router(app, render);

    //监听
    app.listen(conf.port,function(){
        console.log('listening on port ' + conf.port);
    });
}
