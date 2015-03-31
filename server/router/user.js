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

    //profile watchyou
    app.post('/watchlist', control.user.checkNotLogin, control.user.watchlist);

    //oauth github
    app.get('/oauth/github/:type', control.user.oauth);

    //security
    app.get('/security', control.user.security);

    app.post('/securityPwds', control.user.securityp);

    //smtp reset pwd
    app.post('/resetmail', control.user.resetmail);

}