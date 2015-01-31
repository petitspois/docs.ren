
var router = require('koa-router');

var parse = require('co-body');

module.exports = function(app, render){

    app.use(router(app));

    //主页
    app.get('/',function* (){
        this.body = yield render('index',{title:'首页',secondtitle:'最新文章'});
    });

    //发布文章
    app.get('/publish',function* (){
        this.body = yield render('publish',{title:'发布文章'});
    });

    //注册

    app.get('/signup',function* (){
        this.body = yield render('register',{title:'注册',secondtitle:'新用户注册'});
    });

    app.post('/signup',function* (){
        var body = yield parse(this),
            name = body.username,
            password = body.password,
            password_re = body.password_re;
        if(password != password_re){

        }

    });

    app.use(function* (){
        this.body = yield render('404');
    });


}
