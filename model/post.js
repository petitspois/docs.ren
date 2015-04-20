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
    //标题
    title: {
        type: String,
        required: true
    },
    //类型？'post' or 'doc'
    type:{
        type:String,
        required: false,
        default: 'post'
    }
    //内容
    , content: {
        type: String,
        required: true
    }
    //简介
    , description: {
        type: String,
        required: true
    }
    //标签
    , tags: {
        type: [String],
        required: false
    }
    //发布者名字
    , name: {
        type: String
    }
    //分类
    , category: {
        type: String,
        required: false,
        default :'未分类'
    }
    //封面
    , cover:{
        type:String,
        required:false
    }
    //创建时间
    , createtime: {
        type: Date,
        required: false,
        default: Date.now
    }
    //更新时间
    , updatetime: {
        type: Date,
        required: false,
        default: Date.now
    },
    //是否支持评论
    iscomment:{
        type:Boolean,
        require:true,
        default:true
    },
    //是否置顶
    istop:{
        type:Boolean,
        require:true,
        default:false
    },
    //是否为精华文章
    isgood:{
        type:Boolean,
        require:true,
        default:false
    },
    //状态? 默认发布
    status:{
        type:Boolean,
        required:false,
        default :true
    },
    //文档推荐
    recommend:{
        type:Boolean,
        required:false,
        default :false
    },
    //项目链接
    projectLink:{
        type:String,
        required:false
    },
    //主题
    theme:{
        type:String,
        required:false
    },
    viewByCount: {
        type: Number,
        default: 0
    },
    //审核状态
    audit:{
        type:Boolean,
        required:false,
        default :false
    }
    //作者相关
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


module.exports = post;
