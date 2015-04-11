/**
 * Created by petitspois on 15/2/25.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var settings = new Schema({
    name:{
        type: String,
        required: true
    },
    keywords: {
        type: String
    },
    description: {
        type: String
    },
    //帮助链接
    helplink:{
        type: String
    }
    //统计
    ,statistics: {
        type: String
    }

}, {
    toObject: {getters: true, virtuals: true},
    toJSON: {getters: true, virtuals: true}
});


module.exports = settings;
