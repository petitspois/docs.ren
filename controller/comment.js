/**
 * Created by petitspois on 15/2/25.
 */

var model = require('../model/').post,
    userModel = require('../model/').user,
    commentModel = require('../model/').comment,
    marked = require('../assets/js/editor/marked');
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });


module.exports = function () {

    var comment = {};

    //post comment
    comment.comment = function* () {
        var body = this.request.body,
            comment = body.comment,
            pid = body.pid;

        if(!this.session.user){
            this.body = {
                msg: '未登录，登陆跳转中...',
                status: 2
            }
            return;
        }

        if (!comment) {
            this.body = {
                msg: '评论内容不能为空',
                status: 0
            }
            return;
        }

        var userId = this.session.user._id || (yield userModel.get({email: this.session.user.email}))._id;

        var commentData = {
            pid: pid,
            name: this.session.user.nickname,
            email: this.session.user.email,
            comment: comment,
            author: userId
        }

        var commented = yield commentModel.add(commentData);

        if (commented) {
            this.body = {
                msg: '发布成功',
                status: 1,
                data: {
                    name:this.session.user.nickname,
                    createtime:'即将',
                    comment:marked(comment),
                    avatar:(yield userModel.get({email:this.session.user.email}, 'avatar')).avatar
                }
            }
        }

    }


    //remove comment
    comment.remove = function* (){
        var body = this.request.body,
            cid = body.cid;
        if(cid){
            var cData = yield commentModel.byidRemove(cid);
            if(cData){
                 this.body = {
                     msg:'删除成功',
                     status:1
                 }
            }else{
                this.body = {
                    msg:'删除失败',
                    status:0
                }
            }
        }else{
            this.body = {
                msg:'cid不存在',
                status:0
            }
        }

    }

    return comment;
}