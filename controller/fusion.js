/**
 * Created by qingdou on 15/2/11.
 */

module.exports = function(){
    var fusion = {};

    //index
    fusion.getHome = function* (){
        this.body = yield this.render('index',{title:'首页',secondtitle:'最新文章'});
    }
    fusion.getSignup = function* (){
        this.body = yield this.render('register',{title:'注册',secondtitle:'新用户注册'});
    }






    return fusion;

}