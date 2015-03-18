/**
 * Created by petitspois on 15/3/18.
 */
define(['petitspois','loadin'], function($, loadin){

    var signing = !!USER,
        iswatch = !!parseInt($('#watch')[0].dataset.iswatch);

    //点击关注
    $('#watch').on('click', function(){

        var me = this;

        $(me).addClass('disabled');

        //是否登陆
        if(signing){

            var oppositeuid = $(this)[0].dataset.oppositeuid;

            $.ajax({url:'/watch',type:'POST',data:{type:iswatch,oid:oppositeuid}}).then(function(ret){
                ret = JSON.parse(ret);
                if(ret.status){
                    $(me).text(ret.msg);
                    if($(me).hasClass('disabled')){
                        $(me).removeClass('disabled');
                    }
                    iswatch = !iswatch;
                }else{
                    loadin.show('alert',ret.msg,'danger');
                }
            },function(){});

        }else{
            location.href = '/signin';
        }
    });


});