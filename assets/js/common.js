typeof function($){

  var Q = {
      init:function(){
          requirejs.config({
              baseUrl:'./js'
          });

          //左侧拦显示或隐藏
          this.showHideAside();
      },
      showHideAside:function(){
          require(['showhideaside']);
      }
  }

  $(document).ready(function(){
      Q.init();
  });


}(window.jQuery);