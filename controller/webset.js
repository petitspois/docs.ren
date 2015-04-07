/**
 * Created by petitspois on 4/3/15.
 */

var settingsModel = require('../model/').settings,
    userModel = require('../model/').user,
    postModel = require('../model/').post,
    commentModel = require('../model').comment,
    categoryModel = require('../model').category,
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
            role = (yield userModel.get({email:this.session.user.email},'role')).role,
            query = [],
            title;
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

        if(role<2){
            query[0].name = this.session.user.nickname;
        }

        var total = yield postModel.querycount.call(postModel, query[0]);

        var posts = yield postModel.getAll.apply(postModel, query);


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


    webset.addCategory = function* (){
        var body = this.request.body,
            name = body.name;
        var exist = yield categoryModel.get({name:name});

        if(exist){
            this.body = {
                msg:'分类已经存在',
                status:0
            }
            return;
        }

        var addCategory = yield categoryModel.add({name:name});

        this.body  = {
            msg:'添加分类成功',
            status:1,
            data:addCategory
        }
    }

    webset.categoryList = function* (){
        this.body = {
            categories: yield categoryModel.getAll({},'-createtime')
        }
    }

    webset.removeCategory = function* (){
        var body = this.request.body,
            name = body.name;
        if(name){
            yield categoryModel.removeSingle({name:name})
            this.body = {
                msg:'删除分类成功',
                status:1
            }
        }
    }

    return webset;

}