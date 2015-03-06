/**
 * Created by petitspois on 15/2/25.
 */
module.exports = function(app, control){

    //publish
    app.post('/publish', control.post.publish);

    //post
    app.get('/post/:id', control.post.post);


}