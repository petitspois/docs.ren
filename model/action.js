/**
 * Created by petitspois on 15/2/25.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var action = new Schema({
    //用户
    uid: {
        type: Schema.Types.ObjectId,
        required: true
    }
    ///用户名
    , name: {
        type: String,
        required: true
    }
    ///回复id
    , rid: {
        type: String,
        required: false
    }
    //评论相关
    , comment: {
        type: String,
        required: false
    }
    //文章相关
    ,title:{
        type:String,
        required:false
    }
    ,description:{
        type:String,
        required:false
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


module.exports = action;
