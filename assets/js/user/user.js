/**
 * Created by petitspois on 15/3/11.
 */
define(['petitspois'],function($){

    //tab
    $('#tab-user').children().on('click',function(){
        $('#tab-user').children().each(function(){
            $(this).removeClass('active');
        });
        $(this).addClass('active');
    });

});