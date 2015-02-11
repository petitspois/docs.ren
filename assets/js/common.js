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
                    'loadin':'effect/loading'
                },
                urlArgs: "bust=" +  (new Date()).getTime()
            });
            //左侧拦显示或隐藏
            me.showHideAside();

        },
        showHideAside: function () {
            require(['effect/showhideaside']);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        Q.init();
    }, false);

    window.onload = function () {
        document.querySelector('.butterbar').style.display = 'none';
    }


}(this);