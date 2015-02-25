/**
 * Created by petitspois on 15/2/25.
 */
module.exports = function(app, control){

    //publish
    app.post('/publish', control.post.publish);


}