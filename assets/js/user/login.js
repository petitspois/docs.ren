/**
 * Created by petitspois on 15/2/13.
 */

define(['petitspois','vue', 'vueValidator', 'loadin', 'gf'],function($, Vue, Valid, loadin, gf){

    Vue.use(Valid);

    var loginForm = new Vue({
        data: {
            user:{
                bind:'',
                email: '',
                pwd: ''
            }
        },
        methods: {
            submit: function (e) {
                var user = this.$data.user;
                e.preventDefault();
                var bindEmail = document.getElementById('bind-email') && document.getElementById('bind-email').title || '';
                if(bindEmail && ~bindEmail.indexOf('@')){
                    user.bind = bindEmail;
                }
                loadin.show('load');
                $.ajax({type:'POST', url: '/signin', data:user}).then(function(ret){
                     ret = JSON.parse(ret);
                     loadin.hide();
                     if(ret.status){
                         gf('success', '登陆成功');
                         setTimeout(function(){
                             location.replace('/');
                         },1200);
                     }else{
                         gf('error', ret.msg);
                     }
                },function(){
                    gf('error', '登陆失败，请重试');
                });
            },
            oauth:function(){
                $.ajax({type:'GET', url: '/oauth/github/login'}).then(function(ret){
                    self.location.href = ret;
                },function(){});
            }
        }
    }).$mount('#login');

});