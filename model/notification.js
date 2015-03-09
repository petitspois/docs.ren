/**
 * Created by petitspois on 15/2/25.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var notification = new Schema({
    //类型 位置 类型  comment
    type: {
        type: String,
        required: true
    },
    // 来源
    source: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    // 目标
    target: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    // 被操作 object
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    //定位object
    location:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    //是否已读
    hasReply:{
        type:Boolean,
        default:false
    },
    //是否已读
    hasRead:{
        type:Boolean,
        default:false
    },
    // 激活时间
    noticeAt: {
        type: Date,
        default: Date.now
    }

}, {
    toObject: {getters: true, virtuals: true},
    toJSON: {getters: true, virtuals: true}
});


module.exports = notification;
