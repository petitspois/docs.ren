define(['petitspois', 'vue', 'vueValidator', 'gf', 'loadin'], function ($, Vue, valid, gf, loadin) {

    Vue.use(valid);

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
                email:''
            }
        },
        methods: {
            submit: function (e) {
                var user = this.$data.user;
                e.preventDefault();
                loadin.show();
                $.ajax({type:'POST',dataType:'json', url:'/resetmail',data:user}).then(function(ret){
                    ret = JSON.parse(ret);
                    if(ret.status){
                        gf('success', ret.msg);
                    }else{
                        gf('error', ret.msg);
                    }
                }, function(){});
            }

        }
    }).$mount('#smtp-forget');
});