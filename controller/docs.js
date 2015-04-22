/**
 * Created by petitspois on 15/2/25.
 */

var level = require('../server/config').level,
    fs =require('co-fs'),
    formatDate = require('../lib/format'),
    model = require('../model/').post,
    userModel = require('../model/').user,
    actionModel = require('../model/').action,
    commentModel = require('../model/').comment,
    categoryModel = require('../model/').category,
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
            isgood = body.isgood,
            iscomment = body.iscomment,
            cstatus = body.cstatus,
            recommend = body.recommend;

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

        var userId = this.session.user._id || (yield userModel.get({email: this.session.user.email},'-password'))._id,
            cfilter = function(str) {
                return str.replace(/[^\u4e00-\u9fa5a-zA-Z]|（|）/g,'');
            },
            description = cfilter(description || content);


        var newDocs = {
            type:'doc',
            title: title,
            content: content,
            description: description.slice(0, 100),
            tags: fineTags,
            category: category,
            name: this.session.user.nickname,
            projectLink:github,
            cover :cover,
            istop :istop,
            isgood:isgood,
            iscomment :iscomment,
            status:cstatus,
            author: userId,
            recommend:recommend
        }

        var doctable = yield model.add(newDocs),
            backUser = null;

        //添加分类计数
        //yield categoryModel.update({name:category},{'$inc':{'ccount':1}});


        //increase level
        'true' == cstatus && (backUser = yield userModel.update({_id:userId},{$inc:{level:level.cd}}));

        if('true' == cstatus && !backUser.role && backUser.level>1000){
            yield userModel.update({_id:userId},{$set:{role:1}});
        }

        //docsTotal
        'true' == cstatus && (yield userModel.update({_id:userId},{$inc:{docsTotal:1}}));

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
            status: 1,
            data:{
                id:doctable.id
            }
        }

    }


    docs.detail = function* (){
        var data = {},
            id = this.params.id,
            docs = yield model.get({_id: id}),
            comments = yield commentModel.getAll({pid: id},'createtime');

        //viewBycount
        yield model.update({_id:id},{'$inc':{'viewByCount':1}});

        //comments data
        for (var i = 0; i < comments.length; i++) {
            comments[i].author = yield userModel.get({nickname: comments[i].name});
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
            user = yield userModel.get({email:this.session.user.email}),
            categories = yield categoryModel.getAll({});
            user.password = '';

        this.body = yield this.render('create', {docs:docs,user:user,categories:categories,edit:docs.id});
    }

    //post edit
    docs.docedit = function* (){
        var body = this.request.body,
            title = body.title,
            content = body.content,
            category = body.category,
            tags = body.tags,
            description=body.description,
            githublink = body.github,
            cover = body.cover,
            istop = body.istop,
            isgood = body.isgood,
            iscomment = body.iscomment,
            cstatus = body.cstatus,
            edit = body.edit,
            recommend = body.recommend;

        if(edit){

            var fineTags = [],
                cfilter = function(str) {
                    return str.replace(/[^\u4e00-\u9fa5a-zA-Z]|（|）/g,'');
                },
                description = cfilter(description || content);

            if (tags) {
                tags.split(',').forEach(function (item, index) {
                    if (item)fineTags.push(item);
                });
            }

            var alterDocs = {
                title: title,
                content: content,
                description: description.slice(0, 100),
                tags: fineTags,
                category: category,
                projectLink:githublink,
                cover :cover,
                istop :istop,
                isgood:isgood,
                iscomment :iscomment,
                status:cstatus,
                recommend:recommend,
                updatetime:Date.now()
            },
                alterSuccess = yield model.update({_id:edit},{$set:alterDocs}),
                backUser = null;
            //good level handling
            if('true'==isgood){
                //increase level
                'true' == cstatus && (backUser = yield userModel.update({nickname:alterSuccess.name},{$inc:{level:level.cg}}));
                if('true' == cstatus && !backUser.role && backUser.level>1000){
                    yield userModel.update({nickname:alterSuccess.name},{$set:{role:1}});
                }
            }

            this.body = {
                msg: '更改成功',
                status: 1,
                data:{
                    id:alterSuccess.id
                }
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
