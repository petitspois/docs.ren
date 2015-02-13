define(['petitspois'],function($){
    var $aside = $('#sh-aside'),
        $app = $('#app'),
        display = false;
    $aside.on('click',function(){
        display = !display;
        display ? $app.removeClass('app-aside-folded'):$app.addClass('app-aside-folded');
    });
});