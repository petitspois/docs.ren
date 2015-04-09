/**
 * Created by petitspois on 15/2/11.
 */
module.exports = function(app, control){

    //signup
    app.post('/webset', control.user.checkNotLogin, control.webset.webset);

    app.post('/setPost', control.user.checkNotLogin, control.webset.setPost);

    app.post('/userManagement', control.user.checkNotLogin, control.webset.userManagement);


}
