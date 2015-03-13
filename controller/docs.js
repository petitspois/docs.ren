/**
 * Created by petitspois on 15/2/25.
 */

var model = require('../model/').post,
    userModel = require('../model/').user,
    commentModel = require('../model/').comment,
    notificationModel = require('../model/').notification,
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

    var docs = {};

    docs.detail = function* (){
        this.body = yield this.render('doc',{title:'文档',user:this.session.user});
    }

    return docs;
}
