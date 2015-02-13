
var fs = require('co-fs'),

    conf = require('../config');

module.exports = function(){

    var icon;

    return function *favicon(next){
        //非fav直接下一个
        if(this.path != '/favicon.ico') return yield next;
        if ('GET' !== this.method && 'HEAD' !== this.method) {
            this.status = 'OPTIONS' == this.method ? 200 : 405;
            this.set('Allow', 'GET, HEAD, OPTIONS');
            return;
        }
        icon = yield fs.readFile(conf.static+'/img/favicon.ico');
        this.set('Cache-Control','no-cache');
        this.type = 'image/x-icon';
        this.body = icon;
    }

}
