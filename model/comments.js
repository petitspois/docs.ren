/**
 * Created by petitspois on 15/2/25.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var comments = new Schema({
    pid: {
        type: Schema.Types.ObjectId,
        required: true
    }
    , name: {
        type: String,
        required: true
    }
    , email: {
        type: String,
        required: true
    }
    , comment: {
        type: String,
        required: false
    }
    , createtime: {
        type: Date,
        required: false,
        default: Date.now
    }
    , author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }

}, {
    toObject: {getters: true, virtuals: true},
    toJSON: {getters: true, virtuals: true}
});

comments.virtual('mdRenderComments').get(function(){
    return marked(this.comment);
});

module.exports = comments;
