/**
 * Created by petitspois on 15/3/13.
 */
module.exports = function(app, control){

    //comments
    app.post('/comment', control.comment.comment);


}