
var router = require('koa-router');

var control = require('../../controller/');

module.exports = function(app){

    var ctrl = control();

    app.use(router(app));

    require('./fusion')(app, ctrl);

    require('./user')(app, ctrl);

    require('./post')(app, ctrl);

    require('./comment')(app, ctrl);

    require('./notification')(app, ctrl);

    require('./docs')(app, ctrl);

    require('./webset')(app, ctrl);

    require('./category')(app, ctrl);

    ctrl = null;
    //404
    app.use(function* (){
        var data;
        if(this.session.user) data = {user:this.session.user};
        this.body = yield render('404', data);
    });

}
