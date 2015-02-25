typeof function (window) {

    var Q = {
        init: function () {

            var me = this;

            requirejs.config({
                baseUrl: './js',
                paths: {
                    'jquery':'lib/jquery-2.1.3',
                    'petitspois':'lib/petitspois',
                    'vue':'lib/vue.min',
                    'vueValidator':'lib/vueValidator',
                    'msg':'effect/msg',
                    'nav':'effect/nav',
                    'loadin':'effect/loading',
                    'profile':'profile/index',
                    'upload':'upload/upload'
                },
                urlArgs: "petitspois=" +  (new Date()).getTime()
            });

            //左侧拦显示或隐藏
            me.showHideAside();

            //nav
            me.loadNav();
        },
        showHideAside: function () {
            require(['effect/showhideaside']);
        },
        loadNav:function(){
            require(['nav']);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        Q.init();
    }, false);

    window.onload = function () {
        document.querySelector('.butterbar').style.display = 'none';
    }


}(this);