/**
 * Created by qingdou on 15/2/11.
 */
module.exports = function(app, control){

    //signup
    app.post('/signup', control.user.checkLogin, control.user.signup);

    //signin
    app.post('/signin',control.user.signin);

    //profile
    app.post('/profile', control.user.profile);
    ///prefile cover
    app.post('/cover', control.user.cover);

    //user
    app.post('/user/:name', control.fusion.user);

    //user reply
    app.post('/user/:name/reply', control.fusion.reply);

    //watch
    app.post('/watch', control.user.checkNotLogin, control.user.watch);

    //action
    app.post('/action', control.user.action);

}