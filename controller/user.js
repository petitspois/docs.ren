/**
 * Created by apple on 15/1/31.
 */

var model = require('../model/').user,

    actionModel = require('../model/').action,

    postModel = require('../model/').post,

    formatDate = require('../lib/format'),

    fs =require('co-fs'),

    conf = require('../server/config'),

    md5 = require('../lib/md5');

module.exports = function () {

    var user = {};

    //signup
    user.signup = function* () {
        var body = this.request.body,
            name = body.name,
            email = body.email,
            password = body.pwd,
            password_re = body.pwd_re;

        if (password != password_re) {
            this.body = {
                msg: '两次密码输入不一致。',
                status: 0
            };
            return;
        }

        var userEmail = yield model.get({email: email},'email'),
            userNickname = yield model.get({nickname: name},'name');

        if (userEmail) {
            this.body = {
                msg: 'Email已经存在。',
                status: 0
            };
            return;
        }else if(userNickname){
            this.body = {
                msg: '用户名已经存在。',
                status: 0
            };
            return;
        }

        var rander = Math.random()*31+1|0,
            avatar = '/avatar/'+ rander +'.jpg';

        var newUser = {
            email: String(email),
            nickname: String(name),
            password: md5(String(password)),
            avatar:avatar,
            cover:'/img/cover.jpg'
        };

        yield model.add(newUser);
        delete newUser.password;
        this.session.user = newUser;

        this.body = {
            msg: '注册成功。',
            status: 1
        }
    }
    //signin
    user.signin = function* (){
        var body = this.request.body,
            email = body.email,
            password = body.pwd;

        var getData = yield model.get({email:email});
        if(!getData){
            this.body = {
                msg:'用户名或密码输入错误',
                status:0
            }
            return;
        }
        var getPwd = getData.password;
        if(getPwd){
            if(getPwd!==md5(password)){
                this.body = {
                    msg:'用户名或密码输入错误',
                    status:0
                }
                return;
            }
        }
        getData = getData.toObject();
        delete getData.password;
        this.session.user = getData;
        this.body = {
            msg: '登陆成功',
            status: 1
        }

    }

    //checklogin
    user.checkLogin = function* (next) {
        if (this.session.user) {
            this.body = yield this.msg('您已经登陆','已登陆');
        }else{
            yield next;
        }
    }

    //checklogin
    user.checkNotLogin = function* (next) {
        if (!this.session.user) {
            this.body = yield this.msg('/signin','未登陆','未登陆');
        }else{
            yield next;
        }
    }

    //profile
    user.profile = function* (){
        var body = this.request.body,
            nickname = body.nickname,
            sex = body.sex,
            company=body.company,
            locationp =body.location,
            avatar = body.avatar,
            description= body.description,
            github=body.github,
            weibo = body.weibo;


        if(avatar){
            var imgbuffer = new Buffer(avatar,'base64');
            var imgName = yield model.get({email:this.session.user.email},'avatar');

            if(/custom/.test(imgName.avatar)){
                imgName = 'assets'+imgName.avatar;
            }else{
                imgName = 'assets/customavatar/petitspois'+(+new Date)+(Math.random()*1000|0)+'.png';
            }

            yield fs.writeFile(imgName,imgbuffer);

        }

        var profile = {
            nickname:nickname,
            sex: sex,
            company:company,
            location:locationp,
            description:description,
            github:github,
            weibo:weibo
        }

        avatar && (profile.avatar = imgName.slice(6));

        var update =  yield model.update({email:this.session.user.email},{$set:profile});

        if(update){
            this.body = {
                msg:'更新成功',
                status:1
            }
        }


    }

    user.cover = function* (){
        var body =this.request.body,
            coverData = body.coverData || '';
        if(coverData){

            var imgbuffer = new Buffer(coverData,'base64');

            var imgName = yield model.get({email:this.session.user.email},'cover');

            if(/assets/.test(imgName.cover)){
                imgName = 'assets'+imgName.cover;
            }else{
                imgName = 'assets/cover/petitspois'+(+new Date)+(Math.random()*1000|0)+'.png';
            }

            yield fs.writeFile(imgName, imgbuffer);
        }


        var update =  yield model.update({email:this.session.user.email},{$set:{cover:imgName.slice(6)}});

        update && (this.body = {
            msg:'上传成功',
            status:1
        });

    }

    user.watch = function* (){
        var body = this.request.body,
            type = body.type,
            oid = body.oid,
            nid = this.session.user._id || (yield model.get({email: this.session.user.email}))._id;

        if('true' === type){
            //取消关注
            /// youwatch 删除 对方id
            yield  model.update({_id:nid},{$pull:{youwatch:oid}});
            /// watchyou 删除 我的id
            yield model.update({_id:oid},{$pull:{watchyou:nid}});

            this.body = {
                msg:'关注',
                status:1
            }

        }else{
            //关注
            ///youwatch 添加 对方id
            yield model.update({_id:nid},{$addToSet:{youwatch:oid}});
            ///watchyou 在对方添加自己id
            yield model.update({_id:oid},{$addToSet:{watchyou:nid}});

            this.body = {
                msg:'已关注',
                status:1
            }

        }
    }

    user.action = function* (){

         if(this.session.user){
              var page = this.request.body.page || 1;
              var youwatch = (yield model.get({email:this.session.user.email},'youwatch')).youwatch;

              if(youwatch.length){

                  var watchlist = yield actionModel.getAll({uid:{$in:youwatch}},'-createtime',page, 10),
                      total = yield actionModel.querycount({uid:{$in:youwatch}});


                  yield watchlist.map(function* (item){
                      item.avatar = (yield model.get({_id:item.uid},'avatar')).avatar;
                      item.createtime = formatDate(item.createtime, true);
                      item.pid = String(item.pid);
                      if('comment'==item.type){
                          var postdata = yield postModel.get({_id:item.rid});
                          item.title = postdata.title;
                          item.articleType = postdata.type;
                      }
                      if('reply'==item.type){
                          item.atuser = (yield model.get({_id:item.rid},'nickname')).nickname;
                      }
                      return item;
                  })


                  if(watchlist.length){
                      this.body = {
                          msg:'成功',
                          status:1,
                          data:watchlist,
                          page:{
                              page:parseInt(page),
                              total:total
                          }
                      };
                  }else{
                      this.body={
                          msg:'无数据',
                          status:0
                      }
                  }

              }else{
                  this.body={
                      msg:'您还没有关注的人',
                      status:0
                  }
              }

         }else{

         }
    }

    user.watchlist = function* (){
        var type = this.request.body.type,
            alldata = (yield model.get({email:this.session.user.email},'watchyou youwatch'));

        if('watchyou' == type){
            data = alldata.watchyou;
        }else if('youwatch' == type){
            data = alldata.youwatch;
        }

        if(data.length && null!==data[0]){
            var userdata = yield model.getAll({_id:{$in:data}},'',0,0,'-password -role');
            yield userdata.map(function* (item){
                item.iswatch = ~alldata.youwatch.indexOf(item._id);
                return item;
            });
            this.body = {
                msg:'成功',
                status:1,
                data:userdata
            }
        }else{
            var msg = 'watchyou' != type ? '您还没有关注任何人' : '还没有任何人关注你';
            this.body = {
                msg:msg,
                status:0
            }
        }

    }

    user.oauth = function* (){
        var params = this.params;
        if('login' == params.type){
            var state = Date.now();
            var path = 'https://github.com/login/oauth/authorize';
            path += '?client_id=' + conf.oauth.id;
            path += '&redirect_uri='+ conf.docsdomian +'/oauth/github/callback&response_type=code';
            path += '&state=' + state;
            this.redirect(path);
        }else if('callback' == params.type){
            console.log(this.search)
        }
    }

    return user;
}
