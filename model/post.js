/**
 * Created by petitspois on 15/2/25.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    marked = require('../assets/js/editor/marked');
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });

var formatDate = require('../lib/format');

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

post.virtual('ctime').get(function(){
    return formatDate(this.createtime, true);
});
post.virtual('utime').get(function(){
    return formatDate(this.updatetime, true);
});

post.virtual('mdRender').get(function(){
    return marked(this.content);
});

post.static('getAvatar',function(query, name){
     return this.findOne(query).populate('author').exec();
});

module.exports = post;