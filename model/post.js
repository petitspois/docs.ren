/**
 * Created by petitspois on 15/2/25.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var post = new Schema({
    title: {
        type: String,
        required: true
    }
    , content: {
        type: String,
        required: true
    }
    , description: {
        type: String,
        required: true
    }
    , tags: {
        type: [String],
        required: false
    }
    , name: {
        type: String
    }
    , category: {
        type: String,
        required: true
    }
    , createtime: {
        type: Date,
        required: false,
        default: Date.now
    }
    , updatetime: {
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

post.static('getAvatar',function(query, name){
     return this.findOne(query).populate('author').exec();
});

module.exports = post;