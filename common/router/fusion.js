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
    //forgot
    app.get('/forgat',control.fusion.forgat);
    //profile
    app.get('/profile',control.user.checkNotLogin, control.fusion.profile);
    //publish
    app.get('/publish',control.user.checkNotLogin, control.fusion.publish);
    //notifications
    app.get('/notifications', control.user.checkNotLogin, control.notification.all);


}