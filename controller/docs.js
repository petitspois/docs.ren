/**
 * Created by petitspois on 15/2/25.
 */

var fs =require('co-fs'),
    model = require('../model/').post,
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

    docs.cover = function* (){

        var body =this.request.body,
            coverData = body.coverData || '';
        if(coverData){

            var imgbuffer = new Buffer(coverData,'base64');

            var imgName = 'assets/docscover/petitspois'+(+new Date)+(Math.random()*1000|0)+'.png';

            yield fs.writeFile(imgName, imgbuffer);

            this.body = {
                msg:'上传成功',
                status:1,
                imguri:imgName
            }

        }

    }

    return docs;
}
