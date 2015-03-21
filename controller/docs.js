/**
 * Created by petitspois on 15/2/25.
 */

var fs =require('co-fs'),
    formatDate = require('../lib/format'),
    model = require('../model/').post,
    userModel = require('../model/').user,
    actionModel = require('../model/').action,
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

    docs.create = function* (){

        var body = this.request.body,
            title = body.title,
            content = body.content,
            category = body.category,
            tags = body.tags,
            description=body.description,
            github = body.github,
            cover = body.cover,
            istop = body.istop,
            iscomment = body.iscomment,
            cstatus = body.cstatus;

        if (title.length < 10) {
            this.body = {
                msg: '标题字数10字以上',
                status: 0
            }
        }

        if (!content) {
            this.body = {
                msg: '内容为必填',
                status: 0
            }
        }

        if (tags) {
            var fineTags = [];
            tags.split(',').forEach(function (item, index) {
                if (item)fineTags.push(item);
            });
        }

        var userId = this.session.user._id || (yield userModel.get({email: this.session.user.email},'-password'))._id;

        var newDocs = {
            type:'doc',
            title: title,
            content: content,
            description: (description? description : content.slice(0, 120) ),
            tags: fineTags,
            category: category,
            name: this.session.user.nickname,
            github:github,
            cover :cover,
            istop :istop,
            iscomment :iscomment,
            status:cstatus,
            author: userId
        }

        var doctable = yield model.add(newDocs);

        //动态
        yield actionModel.add({
            pid:doctable._id,
            type:'doc',
            title:title,
            description:newDocs.description,
            name:newDocs.name,
            uid:newDocs.author
        });

        this.body = {
            msg: '发布成功',
            status: 1
        }

    }


    docs.detail = function* (){
        var data = {},
            id = this.params.id,
            docs = yield model.get({_id: id}),
            comments = yield commentModel.getAll({pid: id},'createtime');
        //comments data
        for (var i = 0; i < comments.length; i++) {
            comments[i].author = (yield commentModel.getAvatar({name: comments[i].name})).author;
            comments[i].createtime = formatDate(comments[i].createtime, true);
            comments[i].comment = marked(comments[i].comment);
            comments[i].cid = String(comments[i]._id);
        }

        docs.role = (yield userModel.byId(docs.author)).role;
        data.comments = comments;
        data.docs = docs;
        data.user = this.session.user;

        if (data.user) {
            data.user = yield userModel.get({email: data.user.email},'-password');
        }

        this.body = yield this.render('doc', data);

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
                imguri:imgName.slice(6)
            }

        }

    }


    docs.preview = function* (){

        var body = this.request.body,
            title = body.title,
            content = body.content;

        this.body = yield this.render('doc',{docs:{
            title:title,
            content:marked(content),
            preview:true
        }});

    }


    //edit
    docs.edit = function* (){
        var id = this.params.id,
            docs = yield model.byId(id),
            user = yield userModel.byId(this.session.user._id);
            user.password = '';
        this.body = yield this.render('create', {docs:docs,user:user,edit:docs.id});
    }

    //post edit
    docs.docedit = function* (){
        var body = this.request.body,
            title = body.title,
            content = body.content,
            category = body.category,
            tags = body.tags,
            description=body.description,
            github = body.github,
            cover = body.cover,
            istop = body.istop,
            iscomment = body.iscomment,
            cstatus = body.cstatus,
            edit = body.edit;

        if(edit){

            var fineTags = [];

            if (tags) {
                tags.split(',').forEach(function (item, index) {
                    if (item)fineTags.push(item);
                });
            }

            var alterDocs = {
                title: title,
                content: content,
                description: (description? description : content.slice(0, 120) ),
                tags: fineTags,
                category: category,
                name: this.session.user.nickname,
                github:github,
                cover :cover,
                istop :istop,
                iscomment :iscomment,
                status:cstatus,
                updatetime:Date.now()
            }


            yield model.update({_id:edit},{$set:alterDocs});
            this.body = {
                msg: '更改成功',
                status: 1
            }
        }else{
            this.body = {
                msg:'更新失败',
                status:0
            }
        }
    }





    return docs;
}
