/**
 * Created by petitspois on 15/3/4.
 */

var userModel = require('../model/').user,
    notificationModel = require('../model/').notification,
    postModel = require('../model/').post,
    formatDate = require('../lib/format'),
    filter = require('co-filter');

module.exports = function(){

    var notification = {};

    notification.all = function* (){

        var type = this.request.body && (this.request.body.type || 'all'),

            sortNotice = 'hasRead -noticeAt',

            data = {},

            query = {};

        //title
        data.title = '通知中心';
        //user
        if(this.session.user){
            data.user = yield userModel.get({email:this.session.user.email},'-password');
        }

        switch (type){
            case 'all':
                query.target = this.session.user._id;
                break;
            case 'unread':
                query.target = this.session.user._id;
                query.hasRead = false;
                sortNotice = '-noticeAt';
                break;
            case 'at':
                query.target = this.session.user._id;
                query.hasReply = true;
                break;
            case 'comment':
                query.target = this.session.user._id;
                query.hasReply = false;
                break;
            case 'system':
                query.target = this.session.user._id;
                break;
        }


        //notice
        var notice = yield notificationModel.getAll(query, sortNotice),
            noticeLen = notice.length;

        if(noticeLen){

            yield notice.map(function* (item){
                item.noticeAt = formatDate(item.noticeAt, true);
                item.source = (yield userModel.byId(item.source)).nickname;
                item.rid = String(item.resource);
                item.id = String(item._id);
                item.location = String(item.location);
                if('post' == item.type ) {
                    item.operate = (yield postModel.byId(item.resource)).title;
                }
                return item;
            });

            if('system' == type){
                notice = yield filter(notice, function* (item){
                    return  (yield userModel.get({nickname:item.source},'role')).role>1;
                })
            }

            data.notices = notice;

        }


        if(type){
            this.body = data;
        }else{
            this.body = yield this.render('notifications',data);
        }

    }

    notification.unread = function* (){
        if(this.session.user){
            var msg = yield notificationModel.get({target:this.session.user._id,hasRead:false});
            if(msg){
                this.body = {
                    msg:'返回成功',
                    status:1
                }
            }else{
                this.body = {
                    msg:'通知不存在',
                    status:0
                }
            }
        }
    }

    notification.already = function* (){
        var body = this.request.body,
            sign = yield notificationModel.update({_id:body.nid},{$set:{hasRead:true}});
        if(sign){
            this.body = {
                msg:'标记成功',
                status:1
            }
        }else{
            this.body = {
                msg:'标记失败',
                status:1
            }
        }

    }


    return notification;

}