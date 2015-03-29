define(['petitspois', 'vue', 'vueValidator', 'loadin'], function ($, Vue, valid, loadin) {

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
                    loadin.show('alert', '两次密码输入不一致！', 'danger');
                    return;
                }
                loadin.show();
                $.ajax({type:'POST',dataType:'json', url:'/signup',data:user}).then(function(ret){
                    if(!ret.status){
                        loadin.show('alert',ret.msg, 'danger');
                        return;
                    }
                    loadin.show('alert', '注册成功！','success');
                    setTimeout(function(){
                        location.replace('/');
                    },1200)
                },function(){
                    loadin.show('alert','注册失败，请重试！', 'danger');
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