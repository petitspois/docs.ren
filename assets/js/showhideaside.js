define(function(){
    var $aside = $('#sh-aside');
    var $app = $('#app');
    var display = false;
    $aside.on('click',function(){
        display = !display;
        display ? $app.addClass('app-aside-folded'):$app.removeClass('app-aside-folded');
    });
});