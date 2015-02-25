/**
 * Created by petitspois on 15/2/13.
 */

define(['petitspois','vue', 'vueValidator', 'loadin'],function($, Vue, Valid, loadin){

    Vue.use(Valid);

    var loginForm = new Vue({
        validator: {
            validates: {
                email: function (val) {
                    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
                }
            }
        },
        data: {
            user:{
                email: '',
                pwd: ''
            }
        },
        methods: {
            submit: function (e) {
                var user = this.$data.user;
                e.preventDefault();
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
            }
        }
    }).$mount('#loginForm');

});