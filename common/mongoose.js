/**
 * Created by petitspois on 15/2/10.
 */
var mongoose = require('mongoose');


module.exports = function(uri){

        mongoose.connect(uri);

        mongoose.connection.on('connected', function () {
            console.log('Mongoose connected to ' + uri.slice(uri.indexOf('@')+1));
        });
        mongoose.connection.on('error',function (err) {
            console.log('Mongoose connection error: ' + err);
        });
        mongoose.connection.on('disconnected', function () {
            console.log('Mongoose disconnected');
        });

}