/**
 * Created by petitspois on 15/3/13.
 */
module.exports = function(app, control){

    //comments
    app.get('/doc/:id', control.docs.detail);


    //upload cover
    app.post('/docscover', control.docs.cover);

    //new
    app.post('/create', control.docs.create);

    //doc preview
    app.post('/preview', control.docs.preview);

    //doc edit
    app.get('/doc/:id/edit', control.user.checkNotLogin, control.docs.edit);

    //edit update
    app.post('/docedit', control.docs.docedit);


}