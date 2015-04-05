/**
 * Created by petitspois on 15/2/25.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var category = new Schema({
    name: {
        type: String,
        required: true
    },
    ccount:{
        type:Number,
        required: false,
        default: 0
    }
    , createtime: {
        type: Date,
        required: false,
        default: Date.now
    }

}, {
    toObject: {getters: true, virtuals: true},
    toJSON: {getters: true, virtuals: true}
});


module.exports = category;
