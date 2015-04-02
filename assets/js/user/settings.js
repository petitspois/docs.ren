/**
 * Created by petitspois on 4/2/15.
 */
define(['jquery'], function($){
    //tab
    $('#set-tab').children(':gt(0)').on('click', function(){
        var $index = $(this).index();
        $(this).siblings().removeClass('active').end().addClass('active');
        $('.set-content').children().not('.hide').addClass('hide').end().eq($index).removeClass('hide');
    });
});