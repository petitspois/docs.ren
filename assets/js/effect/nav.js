/**
 * Created by petitspois on 15/2/13.
 */

define(['petitspois'],function($){

    try{

        //nav右侧user切换
        var display = false;
        $('#user-right').on('click',function(){
            display = !display;
            display ? $(this).addClass('open'): $(this).removeClass('open');
            return false;
        });

        $(document).on('click',function(){
            if($('#user-right').hasClass('open')){
                display = !display;
                $('#user-right').removeClass('open');
            }
        });


        //退出
        $('#logout').on('click',function(){
             $.ajax({url:'/logout',type:'POST'}).then(function(ret){
                 ret = JSON.parse(ret);
                 if(ret.status)location.replace('/');
             },function(){});
        });

    }catch(e){}

});