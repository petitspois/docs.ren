/**
 * Created by petitspois on 15/2/25.
 */
module.exports = function(app, control){

    app.post('/addCategory', control.user.checkNotLogin, control.webset.addCategory);

    app.post('/categoryList', control.user.checkNotLogin, control.webset.categoryList);

    app.post('/removeCategory', control.user.checkNotLogin, control.webset.removeCategory);

}
