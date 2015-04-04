/**
 * Created by petitspois on 4/3/15.
 */

var settingsModel = require('../model/').settings,
    postModel = require('../model/').post,
    commentModel = require('../model').comment,
    formatDate = require('../lib/format');


module.exports = function(){

    var webset = {};

    webset.webset = function* (){
        var body = this.request.body,
            existBase = yield settingsModel.get({name:'base'});
        if(existBase){
            //update
            yield settingsModel.update({name:'base'},{$set:body});
        }else{
            //create
            body.name = 'base';
            yield settingsModel.add(body);
        }

        this.body = {
            msg:'操作成功',
            status:1
        }
    }

    webset.setPost = function* (){
        var body = this.request.body,
            postType = body.type || 'all',
            page = body.page || 1,
            search = body.search,
            query = [],
            title;
        console.log(search)
        switch(postType){
            case 'already':
                query = [{status:true}, '-createtime', page, 10, '-content -description -cover'];
                title = '已发布';
                break;
            case 'top':
                query = [{istop:true}, '-createtime', page, 10, '-content -description -cover'];
                title='置顶';
                break;
            case 'draft':
                query = [{status:false}, '-createtime', page, 10, '-content -description -cover'];
                title='草稿';
                break;
            case 'search':
                query = [{title:eval('/'+search+'+/i')}, '-createtime', page, 10, '-content -description -cover'];
                title='草稿';
                break;
            default:
                query = [{}, '-createtime', page, 10, '-content -description -cover'];
                title = '全部';
        }

        var total = yield postModel.querycount.call(postModel, query[0]);

        var posts = yield postModel.getAll.apply(postModel, query);

        console.log(posts)

        yield posts.map(function* (item){
            item.commentCount = yield commentModel.querycount({pid:item._id});
            item.createtimeformat = formatDate(item.createtime, true);
            item.createtime = formatDate(item.createtime);
            return item;
        });


        this.body = {
            extra:{
                total:total,
                title:title
            },
            posts:posts
        }


    }


    return webset;

}