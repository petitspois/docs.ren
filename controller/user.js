/**
 * Created by apple on 15/1/31.
 */

var md5 = require('../lib/md5');

module.exports = function () {
    var user = {};

    //signup
    user.signup = function* () {
        var body = this.request.body,
            name = body.username,
            email = body.email,
            password = body.password,
            password_re = body.password_re;

        if(password!=password_re){

        }
        //model.createOne({
        //    email: '4039293@qq.com',
        //    nickname: 'petitspois',
        //    password: 'abcd1234'
        //}, function (err, data) {
        //    console.log(err,data);
        //});
        //this.body = {
        //    msg:'创建成功！',
        //    status:1
        //};
    }

    return user;
}