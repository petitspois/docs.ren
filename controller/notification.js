/**
 * Created by petitspois on 15/3/4.
 */

module.exports = function(){

    var notification = {};

    notification.all = function* (){
        this.body = yield this.render('notifications',{title:'通知中心'});
    }


    return notification;

}