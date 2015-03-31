define(['petitspois', 'vue', 'vueValidator', 'loadin', 'gf'], function ($, Vue, valid, loadin, gf) {

    Vue.use(valid);

    Vue.config.delimiters = ['(%', '%)'];

    var registerForm = new Vue({
        validator: {
            validates: {
                email: function (val) {
                    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
                }
            }
        },
        data: {
            user:{
                avatar:'',
                name: '',
                email: '',
                pwd: '',
                pwd_re: ''
            }
        },
        methods: {
            submit: function (e) {
                var user = this.$data.user;
                e.preventDefault();

                if (user.pwd != user.pwd_re) {
                    gf('error', '两次密码输入不一致！');
                    return;
                }
                loadin.show();
                $.ajax({type:'POST',dataType:'json', url:'/signup',data:user}).then(function(ret){
                    loadin.hide();
                    if(!ret.status){
                        gf('error', ret.msg);
                        return;
                    }
                    gf('success', '注册成功！');
                    setTimeout(function(){
                        location.replace('/');
                    },1200)
                },function(){
                    loadin.hide();
                    gf('error','注册失败，请重试！');
                });
            },
            oauth:function(){
                $.ajax({type:'GET', url: '/oauth/github/login'}).then(function(ret){
                    self.location.href = ret;
                },function(){});
            }
        }
    }).$mount('#registerForm');
});