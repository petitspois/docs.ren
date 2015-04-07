/**
 * Created by petitspois on 15/2/25.
 */
module.exports = function(app, control){

    //unread
    app.post('/unread', control.notification.unread);

    //already
    app.post('/already',control.notification.already);

    //all
    app.post('/notification',control.notification.all);

    //flag
    app.post('/flagall',control.notification.flagall);

}