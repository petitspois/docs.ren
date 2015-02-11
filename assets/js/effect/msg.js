/**
 * Created by apple on 15/1/31.
 */
define(['petitspois'],function($){

    return function(msg, type){

        var $msg = $('.msg'),delmsg;

        if($msg.hasClass('no-show')){

            var className = 'alert-'+type+' ng-enter';

            $msg.removeClass('no-show').addClass(className);

            //$msg.children().eq(1).append(msg).end();
            //delmsg = setTimeout(function(){
            //    $msg.addClass('no-show').removeClass('ng-enter');
            //    $msg.children().eq(1).text();
            //},3000);

        }

        $msg.children().eq(0).on('click',function(){
            $msg.removeClass(className).addClass('no-show');
        }).end();

    }

});
