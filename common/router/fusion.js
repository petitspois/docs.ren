/**
 * Created by petitspois on 15/2/11.
 */

module.exports = function(app, control){

    //index
    app.get('/', control.fusion.getHome);
    //signup
    app.get('/signup',control.fusion.getSignup);

}