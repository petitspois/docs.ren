/**
 * Created by petitspois on 15/2/13.
 */

define(['petitspois'],function($){

    try{

        //nav右侧user切换
        $('.nav-dropdown-toggle,.dropdown').on('click',function(){
            $(this).addClass('open');
        }).on('mouseleave',function(){
            $(this).removeClass('open');
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