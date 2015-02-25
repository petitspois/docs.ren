/**
 * Created by apple on 15/1/13.
 */

var mongoose = require('mongoose'),

    schema = new mongoose.Schema({
        email:{
            type:String,
            required:true,
            unique:true
        },
        nickname:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        sex:{
            type:String
        },
        company:{
            type:String
        },
        description:{
            type:String
        },
        github:{
            type:String
        },
        weibo:{
            type:String
        },
        avatar:{
            type:String,
            required:true
        },
        cover:{
            type:String,
            required:true
        },
        role: {
            type: Number,
            required: true,
            unique: false,
            min: 1,
            max: 3,
            default: 1
        }
    });

module.exports = schema;