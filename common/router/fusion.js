/**
 * Created by petitspois on 15/2/11.
 */

module.exports = function(app, control){

    //index
    app.get('/', control.fusion.getHome);
    //signup
    app.get('/signup', control.user.checkLogin, control.fusion.getSignup);
    //signin
    app.get('/signin', control.user.checkLogin, control.fusion.getSignin);
    //logout
    app.post('/logout', control.fusion.logout);
    //profile
    app.get('/profile',control.fusion.profile);
    //publish
    app.get('/publish', control.fusion.publish);


}