/**
 * Created by petitspois on 15/3/7.
 */
define(['petitspois'],function($){
    USER && setTimeout(function(){
        $.ajax({url:'/unread',type:'POST'}).then(function(ret){
            ret = JSON.parse(ret);
            try{
                if(ret.status){
                    if($('.not-icon-msg').hasClass('forcehide')){
                        $('.not-icon-msg').removeClass('forcehide');
                    }
                }
            }catch(e){}
        },function(){});
    },200);
});