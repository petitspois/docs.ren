/**
 * Created by petitspois on 15/2/25.
 */
module.exports = function(app, control){

    //comments
    app.post('/comment', control.comment.comment);

    //remove comment
    app.post('/removecomment', control.comment.remove);

}