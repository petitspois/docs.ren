/**
 * Created by qingdou on 15/2/11.
 */

var userModel = require('../model/').user,

    postModel = require('../model/').post,

    commentModel = require('../model/').comment,

    categoryModel = require('../model/').category,

    formatDate = require('../lib/format');

//get request

module.exports = function(){

    var fusion = {};

    //index
    fusion.getHome = function* (){
        var page = parseInt(this.query.p) ? Math.abs(parseInt(this.query.p)) : 1,
            posts = yield postModel.getAll({status:1},'-istop -createtime',page, 10),
            total = Math.ceil((yield postModel.querycount({status:1}))/10),
            categories = yield categoryModel.getAll({}, '-ccount',1,6);

        for(var i = 0;i<posts.length;i++){
            posts[i].avatar = (yield postModel.getAvatar({name:posts[i].name})).author.avatar;
            posts[i].createtime = formatDate(posts[i].createtime, true);
            posts[i].updatetime = formatDate(posts[i].updatetime, true);
            posts[i].flag = posts[i]['_id'].toString();
        }


        //signed
        if(this.session.user){
            this.body = yield this.render('index',{
                title:'首页',
                user:yield userModel.get({email:this.session.user.email}),
                posts:posts,
                page:{
                    total:total,
                    page:page
                },
                categories:categories
            });
        }else{
            this.body = yield this.render('index',{
                title:'首页',
                posts:posts,
                page:{
                    total:total,
                    page:page
                },
                categories:categories
            });
        }

    }
    //signup
    fusion.getSignup = function* (){
        this.body = yield this.render('register',{title:'注册',secondtitle:'新用户注册'});
    }
    //signin
    fusion.getSignin = function* (){
        this.body = yield this.render('login',{title:'登陆',secondtitle:'立即登陆'});
    }
    //logout
    fusion.logout = function* (){
        if(this.session.user){
            this.session.user = null;
        }
        this.body = {
            msg:'退出成功',
            status:1
        }
    }
    //forgot
    fusion.forgat = function* (){
        this.body = yield this.render('forgat',{title:'忘记密码',secondtitle:'找回密码？'});
    }
    //profile
    fusion.profile = function* (){
        if(this.session.user){
            this.body = yield this.render('profile',{
                title:'个人中心',
                user:yield userModel.get({email:this.session.user.email},'-password')
            });
        }
    }
    //publish
    fusion.publish = function* (){
        var categories = yield categoryModel.getAll({});
        if(this.session.user){
            this.body = yield this.render('publish',{
                title:'发布文章',
                secondtitle:'发布文章',
                user:yield userModel.get({email:this.session.user.email}),
                categories:categories
            });
        }
    }

    fusion.user = function* (){
        var data = {},
            username = this.params.name,
            oppositeUser = yield userModel.get({nickname:username},'-password'),
            page = parseInt(this.request.body && this.request.body.page) ? Math.abs(parseInt(this.request.body.page)) : 1,
            posts = yield postModel.getAll({name:username},'-createtime',page, 10),
            poststotal = yield postModel.querycount({name:username}),
            remain = poststotal-page*10;

            //title
            data.title = username;

            //user
            if(this.session.user){
                data.user = yield userModel.get({email:this.session.user.email}, '-password');
                //是否已经关注
                data.iswatch = ~data.user.youwatch.indexOf(oppositeUser._id);

            }

            data.opposite = oppositeUser;


             //posts
            for(var i = 0;i<posts.length;i++){
                posts[i].avatar = (yield postModel.getAvatar({name:posts[i].name})).author.avatar;
                posts[i].createtime = formatDate(posts[i].createtime, true);
                posts[i].url = '/'+(posts[i].type ||'post')+'/'+posts[i]._id;
            }

            //data.iswatch =
            data.poststotal = poststotal;
            data.oppositeposts = posts;


        if(this.request.body && this.request.body.page){
            this.body = {
                data:data.oppositeposts,
                extra:remain
            };
        }else{
            this.body = yield this.render('user',data);
        }

    }

    fusion.reply = function* (){

        var data = {},
            username = this.params.name,
            oppositeUser = yield userModel.get({nickname:username},'-password'),
            page = parseInt(this.request.body && this.request.body.page) ? Math.abs(parseInt(this.request.body.page)) : 1,
            comments = yield commentModel.getAll({author:oppositeUser._id},'-createtime',page, 10),
            poststotal = yield commentModel.querycount({author:oppositeUser._id}),
            remain = poststotal-page*10;

        //title
        data.title = username;


        //user
        if(this.session.user){
            data.user = yield userModel.get({email:this.session.user.email}, '-password');
        }

        data.opposite = oppositeUser;


        //posts
        for(var i = 0;i<comments.length;i++){
            if(comments[i].reply){
                comments[i].avatar = (yield userModel.get({nickname:comments[i].reply},'avatar')).avatar;
                comments[i].obj = comments[i].reply;
                comments[i].url = ('/'+(yield postModel.get({_id:comments[i].pid})).type ||'/post')+ '/'+comments[i].pid+'/#'+comments[i]._id;
            }else{
                comments[i].avatar = (yield postModel.getAvatar({_id:comments[i].pid})).author.avatar;
                comments[i].obj = (yield postModel.get({_id:comments[i].pid})).title;
                comments[i].url = ('/'+(yield postModel.get({_id:comments[i].pid})).type ||'/post')+ '/'+comments[i].pid;
            }
            comments[i].description = comments[i].comment;
            comments[i].createtime = formatDate(comments[i].createtime, true);
        }

        data.poststotal = poststotal;
        data.oppositeposts = comments;


        if(this.request.body && this.request.body.page){
            this.body = {
                data:data.oppositeposts,
                extra:remain
            };
        }else{
            this.body = yield this.render('userreply',data);
        }
    }


    //user follow
    fusion.follow = function* (){

        var data = {},
            username = this.params.name,
            oppositeUser = yield userModel.get({nickname:username},'-password'),
            page = parseInt(this.request.body && this.request.body.page) ? Math.abs(parseInt(this.request.body.page)) : 1,
            watchs = yield postModel.getAll({'author':{'$in':oppositeUser.youwatch}},'-createtime',page, 10),
            poststotal = yield postModel.querycount({'author':{'$in':oppositeUser.youwatch}}),
            remain = poststotal-page*10;


        //title
        data.title = username;


        //user
        if(this.session.user){
            data.user = yield userModel.get({email:this.session.user.email}, '-password');
        }

        data.opposite = oppositeUser;

        //posts
        for(var i = 0;i<watchs.length;i++){
            watchs[i].avatar = (yield postModel.getAvatar({name:watchs[i].name})).author.avatar;
            watchs[i].createtime = formatDate(watchs[i].createtime, true);
            watchs[i].url = '/'+(watchs[i].type ||'post')+'/'+watchs[i]._id;
        }

        //data.iswatch =
        data.poststotal = poststotal;
        data.oppositeposts = watchs;


        if(this.request.body && this.request.body.page){
            this.body = {
                data:data.oppositeposts,
                extra:remain
            };
        }else{
            this.body = yield this.render('userwatch',data);
        }
    }


    //docs
    fusion.docs = function* (){

        //new data
        //类型为文档，状态为已发布，按时间倒序
        var newData = yield postModel.getAll({type:'doc',status:true},'-createtime',1,8);

        newData.map(function(item){
            item.id = item._id + '';
            return item;
        });


        //return
        this.body = yield this.render('docs',
            {
                title:'文档专辑',
                user:this.session.user,
                docsNew:newData
            }
        );
    }
    //docs create
    fusion.create = function* (){
        var categories = yield categoryModel.getAll({});
        this.body = yield this.render('create',{title:'创建文档',secondtitle:'创建文档',user:this.session.user,categories:categories});
    }

    return fusion;

}