
var router = require('koa-router');

var control = require('../../controller/');

module.exports = function(app){

    var ctrl = control();

    app.use(router(app));

    require('./fusion')(app, ctrl);

    require('./user')(app, ctrl);



}
