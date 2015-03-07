/**
 * Created by petitspois on 15/3/7.
 */
define(['petitspois'],function($){
    USER && setTimeout(function(){
        $.ajax({url:'/unread',type:'POST'}).then(function(ret){
            ret = JSON.parse(ret);
            try{
                if(ret.status && ret.data.hasRead){
                    if($('.not-icon-msg').hasClass('hide')){
                        $('.not-icon-msg').removeClass('hide');
                    }
                }
            }catch(e){}
        },function(){});
    },200);
});