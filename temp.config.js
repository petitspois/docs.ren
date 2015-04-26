
var root = require('../app');

module.exports = {

    //域名
    docsdomian:'http://****',

    //model
    model:root + '/model',

    //views
    views:root + '/views',

    //control
    controller:root + '/controller',

    //static
    static:root + '/assets',

    //github oauth
    oauth:{
        id:'****',
        secret:'****'
    },

    oauthState:'****',

    //mongodb contection
    mongodb: 'mongodb://****',

    //session secrect
    secret:'****',

    //supervisor port
    port:****,

    //七牛上传设置
    qn_access: {
        accessKey: '****',
        secretKey: '****',
        bucket: '****',
        domain: '****'
    },

    //邮件设置
    smtp:{
        host:'****',
        port:****,
        auth:{
            user:'****',
            pass:'****'
        }
    },

    //积分设置
    level:{
        //发布 create post or docs or comment or good
        ///发布文章
        cp:5,
        ///发布文档
        cd:7,
        ///评论
        cc:2,
        ///精华
        cg:5
    },

    enableStatic:true,

    debug:true

}


