/**
 * Created by petitspois on 3/30/15.
 */
define(['petitspois'], function($){

    var gflash = {}, handlingLeave = false, autoclose;

    gflash = function(type, content){

        handlingLeave = true;

        //添加内容
        $('.f-outer span').text(content);
        //颜色样式
        $('.g-msg').removeClass('success');
        $('.g-msg').removeClass('error');
        $('.g-msg').addClass(type);
        //表情
        $('.g-msg i')[0].className = 'success' == type ? 'fa fa-smile-o' : 'fa fa-frown-o';
        //显示信息
        !$('#global-flash').hasClass('active') && $('#global-flash').addClass('active');

        //自动消失
        clearTimeout(autoclose);
        autoclose = setTimeout(function(){
            $('.gclose').trigger('click');
        },7000);

    }


    //划过显示close btn
    $('#global-flash').on('mouseenter', function(){
        clearTimeout(autoclose);
        $(this)[0].className = 'show-close';
    });

    $('#global-flash').on('mouseleave', function(){
        handlingLeave && ($(this)[0].className = 'active');
        autoclose = setTimeout(function(){
            $('.gclose').trigger('click');
        },7000);
    });

    //关闭提示
    $('.gclose').on('click', function(){
        handlingLeave = false;
        $('#global-flash')[0].className ='';
    });


    return gflash;

});