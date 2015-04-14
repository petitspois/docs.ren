/**
 * Created by petitspois on 15/2/25.
 */

var model = require('../model/').post,
    userModel = require('../model/').user,
    commentModel = require('../model/').comment,
    actionModel = require('../model/').action,
    categoryModel = require('../model/').category,
    formatDate = require('../lib/format'),
    parse = require('co-busboy'),
    store = require('../lib/store'),
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
    var post = {};

    //publish
    post.publish = function* () {
        var body = this.request.body,
            title = body.title,
            content = body.content,
            category = body.category,
            tags = body.tags,
            istop= body.istop,
            isgood= body.isgood,
            iscomment = body.iscomment,
            theme = body.theme;

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

        var userId = this.session.user._id || (yield userModel.get({email: this.session.user.email}))._id,
            cfilter = function(str) {
                return str.replace(/[^\u4e00-\u9fa5a-zA-Z]|（|）/g,'');
            },
            description = cfilter(content);

        var newPost = {
            title: title,
            content: content,
            description:description.slice(0, 100),
            tags: fineTags,
            category: category,
            name: this.session.user.nickname,
            author: userId,
            istop: istop,
            isgood: isgood,
            iscomment: iscomment,
            theme:theme
        }

        //文章表
        var posttable = yield model.add(newPost);

        //添加分类计数
        yield categoryModel.update({name:category},{'$inc':{'ccount':1}});

        //动态
        yield actionModel.add({
            pid:posttable._id,
            type:'post',
            title:title,
            description:newPost.description,
            name:newPost.name,
            uid:newPost.author
        });

        this.body = {
            msg: '发布成功',
            status: 1,
            data:{
               id:posttable.id
            }
        }

    }

    //post detail
    post.post = function* () {
        var data = {},
            id = this.params.id,
            posts = yield model.get({_id: id}),
            comments = yield commentModel.getAll({pid: id},'createtime'),
            categories = yield categoryModel.getAll({});
        //阅读+1
        yield model.update({_id:id},{'$inc':{'viewByCount':1}});

        //comments data
        for (var i = 0; i < comments.length; i++) {
            comments[i].author = yield userModel.get({nickname: comments[i].name},'-password');
            comments[i].createtime = formatDate(comments[i].createtime, true);
            comments[i].comment = marked(comments[i].comment);
            comments[i].cid = String(comments[i]._id);
        }

        posts.role = (yield userModel.byId(posts.author)).role;
        data.comments = comments;
        data.posts = posts;
        data.user = this.session.user;
        data.categories = categories;

        if (data.user) {
            data.user = yield userModel.get({email: data.user.email});
        }
        this.body = yield this.render('post', data);
    }

    //edit
    post.edit = function* (){
        var id = this.params.id,
            post = yield model.byId(id),
            user = yield userModel.byId(this.session.user._id),
            categories = yield categoryModel.getAll({});
        this.body = yield this.render('publish', {post:post, user:user, categories:categories, edit:post.id});
    }

    //post edit
    post.postedit = function* (){
        var body = this.request.body,
            title = body.title,
            content = body.content,
            category = body.category,
            tags = body.tags,
            edit = body.edit,
            istop= body.istop,
            isgood= body.isgood,
            iscomment= body.iscomment,
            theme=body.theme;

        if(edit){

            var fineTags = [],
                cfilter = function(str) {
                    return str.replace(/[^\u4e00-\u9fa5a-zA-Z]|（|）/g,'');
                },
                description = cfilter(content);

            if (tags) {
                tags.split(',').forEach(function (item, index) {
                    if (item)fineTags.push(item);
                });
            }

            var alterPost = {
                title: title,
                content: content,
                description: description.slice(0, 100),
                tags: fineTags,
                category: category,
                istop: istop,
                isgood: isgood,
                iscomment: iscomment,
                theme:theme,
                updatetime:Date.now()
            }
            var alterSucess = yield model.update({_id:edit},{$set:alterPost});
            this.body = {
                msg: '更改成功',
                status: 1,
                data:{
                    id:alterSucess.id
                }
            }
        }else{
            this.body = {
                msg:'更新失败',
                status:0
            }
        }
    }


    post.qnupload = function* (){

        var ctx = this;

        if ('POST' != this.method) return yield next;

        // multipart upload
        var parts = parse(this,{autoFields: true});
        var part = yield parts;

        var upRet = yield store.upload.bind(store, part, {filename:part.filename, contentType:part.mimeType});

        this.body = {
            success:true,
            url:upRet[0].url
        }

    }

    return post;
}