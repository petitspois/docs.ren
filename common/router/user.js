/**
 * Created by qingdou on 15/2/11.
 */
module.exports = function(app, control){

    //signup
    app.post('/signup', control.user.checkLogin, control.user.signup);

}