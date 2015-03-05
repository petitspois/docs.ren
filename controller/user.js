/**
 * Created by apple on 15/1/31.
 */

var model = require('../model/').user,

    fs =require('co-fs'),

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

        var user = yield model.get({email: email}, 'email');

        if (user) {
            this.body = {
                msg: 'Email已经存在。',
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
                imgName = 'assets/customavatar/petitspois:'+(+new Date)+(Math.random()*1000|0)+'.png';
            }

            yield fs.writeFile(imgName,imgbuffer);

        }

        var profile = {
            nickname:nickname,
            sex: sex,
            company:company,
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

    return user;
}
