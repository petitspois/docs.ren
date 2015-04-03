/**
 * Created by petitspois on 4/2/15.
 */
define(['jquery', 'vue', 'gf'], function($, Vue, gf){
    //tab
    $('#set-tab').children(':gt(0)').on('click', function(){
        var $index = $(this).index();
        $(this).siblings().removeClass('active').end().addClass('active');
        $('.set-content').children().not('.hide').addClass('hide').end().eq($index).removeClass('hide');
    });

    var baseData = {
        keywords:'',
        description:'',
        statistics:''
    };


    //vue data
    ///基本设置
    var baseSet = new Vue({
        el:'#base-set',
        data:baseData,
        methods:{
            save:function(e){
                e.preventDefault();
                $.ajax({url:'/webset',type:'POST',data:this.$data}).then(function(ret){
                    if(ret.status){
                        gf('success', ret.msg);
                    }
                })
            }
        }
    });

});