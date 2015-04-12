
var root = require('../app');

module.exports = {

    //域名
    docsdomian:'http://127.0.0.1:4000',

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
        id:'f1a0b9f63b83c392f360',
        secret:'f138d2f6a74812e4d6ff9d809354ccdd2a3fe9b7'
    },
    oauthState:'^1986petits25pois12$',

    //mongodb contection
    mongodb: 'mongodb://petitspois:123456@127.0.0.1:27017/pp',

    //session secrect
    secret:'petits*&$^*&@!#$@%((()*()^#$%$#%@#$#pois',

    //supervisor port
    port:4000,

    //七牛上传设置
    qn_access: {
        accessKey: '2BHS8-Hmb9HcsWp4O7NBfsM1vyhduBDcVI8RGSSX',
        secretKey: 'SaBg18BkjYzWcAZHT9HTMKWk2f5n4aZ5Rd_MwCB5',
        bucket: 'deepblue',
        domain: 'http://deepblue.qiniudn.com'
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
    }
}


