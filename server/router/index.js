
var router = require('koa-router');

var control = require('../../controller/');

module.exports = function(app){

    var ctrl = control();

    app.use(router(app));

    require('./fusion')(app, ctrl);

    require('./user')(app, ctrl);

    require('./post')(app, ctrl);

    require('./comment')(app, ctrl);

    //404
    app.use(function* (){
        var data;
        if(this.session.user) data = {user:this.session.user};
        this.body = yield render('404', data);
    });

}
