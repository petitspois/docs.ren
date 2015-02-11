define(['petitspois'],function($){
     return {
         show:function(){
             $('.mask').css('visibility:visible');
             $('body').addClass('loading ng-enter');
         },
         hide:function(time){
             time = time || 0;
             setTimeout(function(){
                 $('.mask').css('visibility:hidden');
                 $('body').removeClass('loading');
             }, time)
         }
     }
});