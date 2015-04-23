/**
 * Created by petitsposi on 4/11/15.
 */
define(['petitspois','vue','gf'], function($, Vue, gf){

    var vm = new Vue({
        el:'#useredit-form',
        data:{
            email:'',
            level:-1,
            role:0
        },
        methods:{
            submit:function(e){
                e.preventDefault();
                $.ajax({url:'/saveUser',type:'POST',data:this.$data}).then(function(ret){
                     ret = JSON.parse(ret);
                    gf('success', ret.msg);
                    setTimeout(function(){
                        location.href='/settings';
                    },2000);
                },function(){});
            }
        }
    });


});
