/**
 * Created by apple on 15/1/31.
 */
define(['petitspois'],function($){

    return function(msg, type){

        var $msg = $('.msg'),delmsg;

        if($msg.hasClass('no-show')){

            var className = 'alert-'+type+' ng-enter';

            clearTimeout(delmsg);

            $msg.removeClass('no-show').addClass(className);

            $msg.children().eq(1).text(msg).end();

            delmsg = setTimeout(function(){
                $msg.children().eq(0).trigger('click').end();
            },3000);

        }

        $msg.children().eq(0).on('click',function(){
            var $closeNode = $(this).parent();
            if(!$closeNode.hasClass('no-show')){
                $closeNode.removeClass(className).addClass('no-show');
            }
        });

    }

});
