typeof function(window, $){

  var Q = {
      init:function(){

          var me = this;

          requirejs.config({
              baseUrl:'./js'
          });

          //左侧拦显示或隐藏
          me.showHideAside();

          //点击关闭msg
          me.closeMsg();

      },
      showHideAside:function(){
          require(['showhideaside']);
      },
      closeMsg:function(){
          require(['closemsg']);
      }
  }

  $(document).ready(function(){
      Q.init();
  });

    window.onload = function(){
        $('.butterbar').fadeOut();
    }


}(this, window.jQuery);