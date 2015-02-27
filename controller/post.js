/**
 * Created by petitspois on 15/2/25.
 */

var model = require('../model/').post;

module.exports = function(){
    var post = {};

    //publish
    post.publish = function* (){
        var body = this.request.body,
            title = body.title,
            content = body.content,
            category = body.category,
            tags = body.tags;

        if(title.length>10){
            this.body = {
                msg:'标题字数10字以上',
                status:0
            }
        }

        if(!content){
            this.body = {
                msg:'内容为必填',
                status:0
            }
        }

        if(tags){
            var fineTags= [];
            tags.split(',').forEach(function(item,index){
                 if(item)fineTags.push(item);
            });
        }

        var newPost = {
            title:title,
            content:content,
            description:content.slice(0,80),
            tags:fineTags,
            category:category,
            name:this.session.user.nickname,
            author:this.session.user._id
        }

        var post = yield model.add(newPost);

        if(post){
            this.body = {
                msg:'发布成功',
                status:1
            }
        }

    }


    return post;
}