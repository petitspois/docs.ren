define(['petitspois'],function($){

     return {
         show:function(type, message, style){
             var me = this;
             if('alert' == type){
                 $('.mask').css('visibility:visible').on('click',function(e){
                     if(~e.target.className.indexOf('mask')){
                         if(!$('#alert').hasClass('petits-ui-window-shake')) {
                             $('#alert').addClass('petits-ui-window-shake');
                         }
                         $('#alert').on('webkitAnimationEnd',function(){
                             $('#alert').removeClass('petits-ui-window-shake');
                         });
                     }
                 });
                 $('#alert').removeClass('no-show');
                 $('#alert').children().eq(1).text(message);
                 $('#alert').addClass('alert-'+style);
                 $('body').addClass('loading ng-enter');
             }else{
                 $('.mask').css('visibility:visible;')
                 $('#load').removeClass('no-show');
                 $('body').addClass('loading ng-enter');
             }
             $('#alert').children().eq(0).on('click',function(){
                 me.hide();
             });
         },
         hide:function(time){
             time = time || 0;
             setTimeout(function(){
                 $('.mask').css('visibility:hidden');
                 $('body').removeClass('loading');
                 $('#alert').hasClass('alert-danger') && $('#alert').removeClass('alert-danger');
                 $('#alert').hasClass('alert-success') && $('#alert').removeClass('alert-success');
                 $('#alert').hasClass('alert-info') && $('#alert').removeClass('alert-info');
                 if(!$('#alert').hasClass('no-show')){
                     $('#alert').addClass('no-show');
                 }
             }, time)
         }
     }
});