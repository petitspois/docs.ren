/**
 * Created by apple on 15/1/31.
 */

var qs = require('querystring'),

    valid = require('validator'),

    request = require('co-request'),

    model = require('../model/').user,

    actionModel = require('../model/').action,

    postModel = require('../model/').post,

    settingsModel = require('../model/').settings,

    formatDate = require('../lib/format'),

    smtpMail = require('../lib/smtp'),

    fs = require('co-fs'),

    conf = require('../server/config'),

    md5 = require('../lib/md5');

module.exports = function () {

    var user = {};

    //signup
    user.signup = function* () {
        var body = this.request.body,
            name = body.name,
            email = body.email,
            password = body.pwd,
            password_re = body.pwd_re,
            gavatar = body.avatar || '';


        if (!valid.equals(password, password_re)) {
            this.body = {
                msg: '两次密码输入不一致。',
                status: 0
            };
            return;
        }

        if(!valid.isAlpha(name)){
            this.body = {
                msg:'个性域名为“A-Z”或“a-z”',
                status:0
            }
            return;
        }

        if(!valid.isLength(name, 6, 12)){
            this.body = {
                msg:'个性域名为6-12位',
                status:0
            }
            return;
        }

        var userEmail = yield model.get({email: email}, 'email'),
            userNickname = yield model.get({nickname: name}, 'name');

        if (userEmail) {
            this.body = {
                msg: 'Email已经存在。',
                status: 0
            };
            return;
        } else if (userNickname) {
            this.body = {
                msg: '个性域名已存在',
                status: 0
            };
            return;
        }

        var rander = Math.random() * 31 + 1 | 0,
            avatar = '/avatar/' + rander + '.jpg';

        var newUser = {
            email: String(email),
            nickname: String(name),
            password: md5(String(password)),
            avatar: gavatar ? gavatar : avatar,
            cover: '/img/cover.jpg'
        };

        //更新绑定关系


        var nowData = yield model.add(newUser);

        gavatar && (yield model.update({email: email}, {$set: {oauth: email}}));

        delete newUser.password;
        this.session.user = newUser;

        this.body = {
            msg: '注册成功。',
            status: 1
        }
    }
    //signin
    user.signin = function* () {
        var body = this.request.body,
            email = body.email,
            password = body.pwd,
            bindEmail = body.bind;

        var getData = yield model.get({"$or": [{email: email}, {nickname: email}]});

        //用户不存在
        if (!getData) {
            this.body = {
                msg: '用户名或密码输入错误',
                status: 0
            }
            return;
        }
        var getPwd = getData.password;

        //密码错误
        if (getPwd) {
            if (getPwd !== md5(password)) {
                this.body = {
                    msg: '用户名或密码输入错误',
                    status: 0
                }
                return;
            }
        }

        //绑定处理
        if (bindEmail) {
            var oauth = getData.oauth;
            if (oauth) {
                this.body = {
                    msg: '该账号已经绑定了其他github账号',
                    status: 0
                }
                return;
            }
            yield model.update({email: getData.email}, {$set: {oauth: bindEmail}});
        }

        getData = getData.toObject();
        delete getData.password;

        yield model.update({email: email}, {$set: {oauth: bindEmail}});

        this.session.user = getData;

        this.body = {
            msg: bindEmail ? '绑定成功' : '登陆成功',
            status: 1
        }

    }

    //checklogin
    user.checkLogin = function* (next) {
        if (this.session.user) {
            this.body = yield this.msg('/', '您已经登陆', '已登陆');
        } else {
            yield next;
        }
    }

    //checklogin
    user.checkNotLogin = function* (next) {
        if (!this.session.user) {
            this.body = yield this.msg('/signin', '未登陆', '未登陆');
        } else {
            yield next;
        }
    }

    //profile
    user.profile = function* () {
        var body = this.request.body,
            nickname = body.nickname,
            sex = body.sex,
            company = body.company,
            locationp = body.location,
            avatar = body.avatar,
            description = body.description,
            github = body.github,
            weibo = body.weibo;


        if (avatar) {
            var imgbuffer = new Buffer(avatar, 'base64');
            var imgName = yield model.get({email: this.session.user.email}, 'avatar');

            if (/custom/.test(imgName.avatar)) {
                imgName = 'assets' + imgName.avatar;
            } else {
                imgName = 'assets/customavatar/petitspois' + (+new Date) + (Math.random() * 1000 | 0) + '.png';
            }

            yield fs.writeFile(imgName, imgbuffer);

        }

        var profile = {
            nickname: nickname,
            sex: sex,
            company: company,
            location: locationp,
            description: description,
            github: github,
            weibo: weibo
        }

        avatar && (profile.avatar = imgName.slice(6));

        var update = yield model.update({email: this.session.user.email}, {$set: profile});

        if (update) {
            this.body = {
                msg: '更新成功',
                status: 1
            }
        }


    }

    user.cover = function* () {
        var body = this.request.body,
            coverData = body.coverData || '';
        if (coverData) {

            var imgbuffer = new Buffer(coverData, 'base64');

            var imgName = yield model.get({email: this.session.user.email}, 'cover');

            if (/assets/.test(imgName.cover)) {
                imgName = 'assets' + imgName.cover;
            } else {
                imgName = 'assets/cover/petitspois' + (+new Date) + (Math.random() * 1000 | 0) + '.png';
            }

            yield fs.writeFile(imgName, imgbuffer);
        }


        var update = yield model.update({email: this.session.user.email}, {$set: {cover: imgName.slice(6)}});

        update && (this.body = {
            msg: '上传成功',
            status: 1
        });

    }

    user.watch = function* () {
        var body = this.request.body,
            type = body.type,
            oid = body.oid,
            nid = this.session.user._id || (yield model.get({email: this.session.user.email}))._id;

        if ('true' === type) {
            //取消关注
            /// youwatch 删除 对方id
            yield  model.update({_id: nid}, {$pull: {youwatch: oid}});
            /// watchyou 删除 我的id
            yield model.update({_id: oid}, {$pull: {watchyou: nid}});

            this.body = {
                msg: '关注',
                status: 1
            }

        } else {
            //关注
            ///youwatch 添加 对方id
            yield model.update({_id: nid}, {$addToSet: {youwatch: oid}});
            ///watchyou 在对方添加自己id
            yield model.update({_id: oid}, {$addToSet: {watchyou: nid}});

            this.body = {
                msg: '已关注',
                status: 1
            }

        }
    }

    user.action = function* () {

        if (this.session.user) {
            var page = this.request.body.page || 1;
            var youwatch = (yield model.get({email: this.session.user.email}, 'youwatch')).youwatch;

            if (youwatch.length) {

                var watchlist = yield actionModel.getAll({uid: {$in: youwatch}}, '-createtime', page, 10),
                    total = yield actionModel.querycount({uid: {$in: youwatch}});


                yield watchlist.map(function* (item) {
                    item.avatar = (yield model.get({_id: item.uid}, 'avatar')).avatar;
                    item.createtime = formatDate(item.createtime, true);
                    item.pid = String(item.pid);
                    if ('comment' == item.type) {
                        var postdata = yield postModel.get({_id: item.rid});
                        if(postdata) {
                            item.title = postdata.title;
                            item.articleType = postdata.type;
                        }
                    }
                    if ('reply' == item.type) {
                        item.atuser = (yield model.get({_id: item.rid}, 'nickname')).nickname;
                    }
                    return item;
                })


                if (watchlist.length) {
                    this.body = {
                        msg: '成功',
                        status: 1,
                        data: watchlist,
                        page: {
                            page: parseInt(page),
                            total: total
                        }
                    };
                } else {
                    this.body = {
                        msg: '无数据',
                        status: 0
                    }
                }

            } else {
                this.body = {
                    msg: '您还没有关注的人',
                    status: 0
                }
            }

        } else {

        }
    }

    user.watchlist = function* () {
        var type = this.request.body.type,
            alldata = (yield model.get({email: this.session.user.email}, 'watchyou youwatch'));

        if ('watchyou' == type) {
            data = alldata.watchyou;
        } else if ('youwatch' == type) {
            data = alldata.youwatch;
        }

        if (data.length && null !== data[0]) {
            var userdata = yield model.getAll({_id: {$in: data}}, '', 0, 0, '-password -role');
            yield userdata.map(function* (item) {
                item.iswatch = ~alldata.youwatch.indexOf(item._id);
                return item;
            });
            this.body = {
                msg: '成功',
                status: 1,
                data: userdata
            }
        } else {
            var msg = 'watchyou' != type ? '您还没有关注任何人' : '还没有任何人关注你';
            this.body = {
                msg: msg,
                status: 0
            }
        }

    }

    user.oauth = function* () {
        var params = this.params;
        if ('login' == params.type) {
            var requestUrl = 'https://github.com/login/oauth/authorize',
                urlparams = {
                    client_id: conf.oauth.id,
                    scope: 'user:email',
                    redirect_uri: conf.docsdomian + '/oauth/github/callback',
                    response_type: 'code',
                    state: md5(conf.oauthState)
                };

            this.body = requestUrl + '?' + qs.stringify(urlparams);

        } else if ('callback' == params.type) {

            var query = this.query,
                code = query.code,
                state = query.state,
                accessToken,
                pE;

            //当刷新页面直接skip
            if (code == this.session.$status) {
                this.redirect('/signin');
                return;
            }

            //state diff handling
            if (state !== md5(conf.oauthState)) {
                this.throw(403, '非法授权操作');
            }

            //request access_token
            var codeParams = {
                client_id: conf.oauth.id,
                client_secret: conf.oauth.secret,
                code: code
            }

            var result = yield request({
                uri: 'https://github.com/login/oauth/access_token' + '?' + qs.stringify(codeParams),
                method: 'POST'
            });

            //request profile
            accessToken = qs.parse(result.body).access_token || 0;

            var gituser = accessToken && (yield request({
                    url: 'https://api.github.com/user?access_token=' + accessToken,
                    headers: {
                        'User-Agent': 'docs.ren'
                    }
                }));

            //获取数据失败
            if (!gituser || !gituser.body) {
                this.body = yield this.msg('/signin', 'github数据解析失败');
            }

            var gUser = JSON.parse(gituser.body);

            //require primary email
            var primaryEmail = (yield request({
                url: 'https://api.github.com/user/emails?access_token=' + accessToken,
                headers: {
                    'User-Agent': 'docs.ren'
                }
            })).body;

            primaryEmail = JSON.parse(primaryEmail);

            if (primaryEmail && primaryEmail.length) {
                primaryEmail.forEach(function (item, key) {
                    if (item.primary) {
                        pE = item.email;
                    }
                });
            }


            //gituser.body content
            //{
            //    login: 'petitspois',
            //    id: 3362033,
            //    avatar_url: 'https://avatars.githubusercontent.com/u/3362033?v=3',
            //    gravatar_id: '',
            //    url: 'https://api.github.com/users/cloudcome',
            //    html_url: 'https://github.com/cloudcome',
            //    followers_url: 'https://api.github.com/users/cloudcome/followers',
            //    following_url: 'https://api.github.com/users/cloudcome/following{/other_user}',
            //    gists_url: 'https://api.github.com/users/cloudcome/gists{/gist_id}',
            //    starred_url: 'https://api.github.com/users/cloudcome/starred{/owner}{/repo}',
            //    subscriptions_url: 'https://api.github.com/users/cloudcome/subscriptions',
            //    organizations_url: 'https://api.github.com/users/cloudcome/orgs',
            //    repos_url: 'https://api.github.com/users/cloudcome/repos',
            //    events_url: 'https://api.github.com/users/cloudcome/events{/privacy}',
            //    received_events_url: 'https://api.github.com/users/cloudcome/received_events',
            //    type: 'User',
            //    site_admin: false,
            //    name: '云淡然',
            //    company: 'netease',
            //    blog: 'http://ydr.me',
            //    location: 'hangzhou',
            //    email: 'cloudcome@163.com',
            //    hireable: true,
            //    bio: null,
            //    public_repos: 41,
            //    public_gists: 0,
            //    followers: 18,
            //    following: 4,
            //    created_at: '2013-01-24T01:59:23Z',
            //    updated_at: '2014-11-22T16:26:16Z'
            // }


            //三种情况
            var ret = {
                email: pE,
                nickname: gUser.login,
                avatar: gUser.avatar_url
            };

            var userInfo = yield model.get({oauth: ret.email});

            ///第一种 数据库无email and login, 直接注册登陆

            ///第二种 数据库无email 有login, 返回到dom操作，进行更改login操作

            ///第三种 数据库无login 有email, 返回到dom操作，进行绑定处理


            this.session.$status = code;

            //oauth 是否绑定
            if (!userInfo) {

                var user = yield model.get({email: ret.email});

                //是否存在用户
                if (user) {
                    //存在进行绑定
                    this.body = yield this.render('login', {
                        title: '账号绑定',
                        secondtitle: '"github" 账号 与 "docs.ren" 账号绑定',
                        gitEmail: ret.email
                    });
                    return;
                } else {
                    //不存在，新建
                    this.body = yield this.render('register', {
                        title: '用户注册',
                        secondtitle: '感谢您使用"GitHub"账号登录"docs.ren"请完成一下内容',
                        gData: ret
                    });
                    return;
                }

            }

            ret.email = userInfo.email;
            ret.nickname = userInfo.nickname;
            this.session.user = ret;
            this.redirect('/profile');

        }
    }


    user.security = function* () {
        var ctx = this,
            body = ctx.query,
            email = body.email || '',
            key = body.key || '';

        if(ctx.session.user){
            ctx.body = yield ctx.render('security', {
                title: '密码修改',
                secondtitle: '密码修改',
                user: ctx.session.user
            });
            return;
        }else if(email === ctx.session.sendemail && key === ctx.session.pwdKey){
            ctx.body = yield ctx.render('security', {
                title: '重置密码',
                secondtitle: '重置密码',
                resetpwd: email
            });
            return;
        }else{
            this.body = yield this.render('404');
            return;
        }
    }

    user.securityp = function* () {
        var body = this.request.body,
            old = body.old,
            now = body.now,
            resetemail = body.resetemail,
            repeatPwd = body.repeat;
           email = resetemail || (yield model.get({email: this.session.user.email}));


        if(!resetemail || !this.session.user){
            this.body = yield this.render('404');
        }

        if (!resetemail && (now === old)) {
            this.body = {
                msg: '新密码与旧密码相同',
                status: 0
            };
            return;
        }

        if (now !== repeatPwd) {
            this.body = {
                msg: '两次密码输入不一致',
                status: 0
            };
            return;
        }


        if(!resetemail) {
            var pwd = email.password || (yield model.get({email: email}, 'password')).password;

            if (pwd !== md5(old)) {
                this.body = {
                    msg: '原密码输入错误',
                    status: 0
                }
                return;
            }
        }

        if (typeof email === 'object') {
            email = email.email;
        }

        yield model.update({email: email}, {$set: {password: md5(now)}});

        //清楚重置密码session
        if(resetemail){
            this.session.pwdKey = null;
            this.session.sendemail = null;
        }

        this.session.user = null;
        this.body = {
            msg: '密码修改成功',
            status: 1
        }

    }

    user.resetmail = function* () {
        var ctx = this,
            body = this.request.body,
            email = body.email || '';

        var isExistEmail = yield  model.get({email:email},'email');

        if(!isExistEmail){
            ctx.body = {
                msg:'用户不存在',
                status:0
            }
            return;
        }

        if (email) {

            var content = {
                    host:conf.docsdomian,
                    email:email,
                    key:md5('docs.ren'+Date.now()+'$$#@@#!@#')
                };

            try{
                yield smtpMail({to: email, html: yield ctx.render('smtp', content)});
                ctx.session.pwdKey = content.key;
                ctx.session.sendemail = content.email;
                ctx.body = {
                    msg:'邮件发送成功，请尽快查收，更改密码',
                    status:1
                }
            }catch(e){
                ctx.body = {
                    msg:'邮件发送失败，检查网络并重试',
                    status:0
                }
            }

        }

    }

    user.settings = function* (){
        var settings = yield settingsModel.get({name:'base'}),
            role = (yield model.get({nickname:this.session.user.nickname})).role;
        this.body  = yield this.render('settings', {
            title:'用户中心',
            user:this.session.user,
            role:role,
            settings:settings
        });
    }


    return user;
}
