/**
 * Created by petitspos on 3/30/15.
 */
define(['petitspois','vue', 'vueValidator', 'gf'],function($, Vue, valid, gf){

    Vue.use(valid);

    new Vue({
        el:'#security-valid',
        data:{
            pwds:{
                resetemail:'',
                old:'',
                now:'',
                repeat:''
            }
        },
        methods:{
            submit:function(e, resetpwd){
                e.preventDefault();
                var pwds = this.$data.pwds;

                //new and old
                if(!pwds.resetemail && (pwds.now === pwds.old)){
                    gf('error','新密码与旧密码相同');
                    return;
                }

                //输入是否相等
                if(pwds.now !== pwds.repeat){
                    gf('error','两次密码输入不一致');
                    return;
                }

                //数据提交
                $.ajax({url:'/securityPwds', type:'POST', data:pwds}).then(function(ret){
                    ret = JSON.parse(ret);

                    if(ret.status){
                        gf('success', ret.msg);
                        setTimeout(function(){
                            location.href = '/signin';
                        }, 2000)
                    }else{
                        gf('error', ret.msg);
                        return;
                    }
                },function(){});
            }
        }
    });
});