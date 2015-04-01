/**
 * Created by petitspois on 15/2/25.
 */
module.exports = function(app, control){

    //publish
    app.post('/publish', control.user.checkNotLogin, control.post.publish);

    //post
    app.get('/post/:id', control.post.post);

    //edit
    app.get('/post/:id/edit', control.user.checkNotLogin, control.post.edit);

    //edit post
    app.post('/postedit', control.user.checkNotLogin, control.post.postedit);

    //qn_upload images
    app.post('/qnupload', control.user.checkNotLogin, control.post.qnupload);

}