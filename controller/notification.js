/**
 * Created by petitspois on 15/3/4.
 */

var userModel = require('../model/').user;

module.exports = function(){

    var notification = {};

    notification.all = function* (){
        var data = {};
        data.title = '通知中心';
        if(this.session.user){
            data.user = yield userModel.get({email:this.session.user.email});
        }
        this.body = yield this.render('notifications',data);
    }


    return notification;

}