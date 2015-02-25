/**
 * Created by petitspois on 15/2/25.
 */

var mongoose = require('mongoose');

schema = new mongoose.Schema({
    title: {
        type: 'String',
        required: true
    }
    , content: {
        type: 'String',
        required: true
    }
    , tags: {
        type: [String],
        required: false
    }
    , creattime: {
        type: Date,
        required: false,
        default:Date.now
    }
    , updatetime: {
        type: Date,
        required: false,
        default:Date.now
    }
    , author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

module.exports = schema;