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

    //user
    app.post('/user/:name', control.fusion.user);

}