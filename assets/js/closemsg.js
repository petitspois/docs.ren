/**
 * Created by apple on 15/1/31.
 */
define(function(){
    var $msgNode = $('#close-msg');
    var $wrapNode = $('#wrap-msg');
    $msgNode.on('click',function(){
        $wrapNode.fadeOut();
    });

});
