/**
 * Created by petitspois on 15/2/25.
 */

var model = require('../model/').post,
    userModel = require('../model/').user,
    commentModel = require('../model/').comment,
    formatDate = require('../lib/format'),
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
            tags = body.tags;

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

        var userId = this.session.user._id || (yield userModel.get({email: this.session.user.email}))._id;

        var newPost = {
            title: title,
            content: content,
            description: content.slice(0, 80),
            tags: fineTags,
            category: category,
            name: this.session.user.nickname,
            author: userId
        }

        var post = yield model.add(newPost);

        if (post) {
            this.body = {
                msg: '发布成功',
                status: 1
            }
        }

    }

    //post detail
    post.post = function* () {
        var data = {},
            id = this.params.id,
            posts = yield model.get({_id: id}),
            comments = yield commentModel.getAll({pid: id},'createtime');
        //comments data
        for (var i = 0; i < comments.length; i++) {
            comments[i].author = (yield commentModel.getAvatar({name: comments[i].name})).author;
            comments[i].createtime = formatDate(comments[i].createtime, true);
            comments[i].comment = marked(comments[i].comment);
            comments[i].cid = String(comments[i]._id);
        }

        data.comments = comments;
        data.posts = posts;
        data.user = this.session.user;
        if (data.user) {
            data.user = yield userModel.get({email: data.user.email});
        }
        this.body = yield this.render('post', data);
    }

    return post;
}