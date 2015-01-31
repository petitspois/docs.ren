
var router = require('koa-router');

var parse = require('co-busboy');

var fs = require('fs');

module.exports = function(app, render){

    app.use(router(app));

    //主页
    app.get('/',function* (){
        this.body = yield render('index',{title:'首页'});
    });

    //发布文章
    app.get('/publish',function* (){
        this.body = yield render('publish',{title:'发布文章'});
    });

    //注册

    app.get('/signup',function* (){
        this.body = yield render('register',{title:'注册'});
    });

    app.post('/signup',function* (){

       console.log(this.request);



        this.body = '123';

    });

    //上传
    app.post('/upload',function* (next){
        var parts = parse(this);
        var part;

        while (part = yield parts) {
            var stream = fs.createWriteStream('assets/tmp/'+part.filename);
            part.pipe(stream);
            console.log('uploading %s -> %s', part.filename, stream.path);
        }

        this.redirect('/');
    });

}
