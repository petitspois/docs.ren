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
            comments[i].avatar = (yield commentModel.getAvatar({name: comments[i].name})).author.avatar;
            comments[i].createtime = formatDate(comments[i].createtime, true);
            comments[i].comment = marked(comments[i].comment);
            comments[i].cid = String(comments[i]._id);
        }
        console.log(comments)
        data.comments = comments;
        data.posts = posts;
        data.user = this.session.user;
        if (this.session.user) {
            data.user = yield userModel.get({email: this.session.user.email}) || this.session.user;
        }
        this.body = yield this.render('post', data);
    }

    //post comment
    post.comment = function* () {
        var body = this.request.body,
            comment = body.comment,
            pid = body.pid;

        if (!comment) {
            this.body = {
                msg: '评论内容不能为空',
                status: 0
            }
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


    return post;
}