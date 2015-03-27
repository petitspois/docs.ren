/**
 * Created by petitspois on 15/2/13.
 */

define(['petitspois','vue', 'vueValidator', 'loadin'],function($, Vue, Valid, loadin){

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
                var bindEmail = document.getElementById('bind-email').title;
                if(bindEmail && ~bindEmail.indexOf('@')){
                    user.bind = bindEmail;
                }
                loadin.show('load');
                $.ajax({type:'POST', url: '/signin', data:user}).then(function(ret){
                     ret = JSON.parse(ret);
                     if(ret.status){
                         loadin.show('alert', '登陆成功！','success');
                         setTimeout(function(){
                             location.replace('/');
                         },1200);
                     }else{
                         loadin.show('alert', ret.msg, 'danger');
                     }
                },function(){
                    loadin.show('alert','登陆失败，请重试！', 'danger');
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