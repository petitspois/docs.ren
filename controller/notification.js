/**
 * Created by petitspois on 15/3/4.
 */

var userModel = require('../model/').user,
    notificationModel = require('../model/').notification,
    postModel = require('../model/').post;

module.exports = function(){

    var notification = {};

    notification.all = function* (){
        var data = {};
        data.title = '通知中心';
        if(this.session.user){
            data.user = yield userModel.get({email:this.session.user.email});
        }
        data.notice = yield notificationModel.getAll({target:this.session.user._id});
        console.log(data.notice)
        console.log(data.notice.type)
        //console.log(yield (data.notice.type+'Model').byId('54f3be42effaf9340621d776'))
        this.body = yield this.render('notifications',data);
    }

    notification.unread = function* (){
        if(this.session.user){
            var msg = yield notificationModel.get({target:this.session.user._id});
            if(msg){
                this.body = {
                    msg:'返回成功',
                    status:1,
                    data:{
                        hasRead:!msg.hasRead
                    }
                }
            }else{
                this.body = {
                    msg:'通知不存在',
                    status:1
                }
            }
        }
    }


    return notification;

}