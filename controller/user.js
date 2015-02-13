/**
 * Created by apple on 15/1/31.
 */

var model = require('../model/').user;

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

        var user = yield model.get({email: email}, email);
        if (user) {
            this.body = {
                msg: 'Email已经存在。',
                status: 0
            };
            return;
        }

        var newUser = {
            email: String(email),
            nickname: String(name),
            password: md5(String(password))
        };

        yield model.add(newUser);
        delete newUser.password;
        this.session.user = newUser;

        this.body = {
            msg: '注册成功。',
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

    return user;
}
