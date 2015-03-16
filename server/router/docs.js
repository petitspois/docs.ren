/**
 * Created by petitspois on 15/3/13.
 */
module.exports = function(app, control){

    //comments
    app.get('/doc/:id', control.docs.detail);


    //upload cover
    app.post('/docscover', control.docs.cover);

    //doc preview
    app.post('/preview', control.docs.preview);


}