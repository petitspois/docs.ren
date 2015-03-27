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
            type:String,
            default:'man'
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
        location:{
            type:String,
            required:false
        },
        avatar:{
            type:String,
            required:false
        },
        cover:{
            type:String,
            required:true
        },
        youwatch:{
            type:[],
            required:false,
            default :[]
        },
        watchyou:{
            type:[],
            required:false,
            default :[]
        },
        oauth:{
            type:String,
            required:false,
            default :''
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