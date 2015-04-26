typeof function (window) {

    var Q = {
        init: function () {

            var me = this;

            requirejs.config({
                baseUrl: '/dest/js',
                paths: {
                    'jquery':'lib/jquery-2.1.3.min',
                    'petitspois':'lib/petitspois.min',
                    'vue':'lib/vue.min',
                    'vueValidator':'lib/vueValidator.min',
                    'msg':'effect/msg.min',
                    'nav':'effect/nav.min',
                    'loadin':'effect/loading.min',
                    'upload':'upload/upload.min',
                    'hljs':'lib/highlight.min',
                    'waypoints':'lib/waypoints.min',
                    'gf':'effect/globalflash.min',
                    'WebUploader':'lib/webuploader.html5only.min',
                    'bsm':'lib/bootstrap.min',
                    'editor':'editor/editor.min',
                    'marked':'editor/marked.min',
                    'ext':'editor/ext.min',
                    'pwatch':'profile/watch.min'
                }
            });


            //nav
            me.loadNav();

            //check notifications
            me.checkNotice();
        },
        loadNav:function(){
            require(['nav']);
        },
        checkNotice:function(){
            require(['notification/notification.min']);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        Q.init();
    }, false);

    window.onload = function () {
        document.querySelector('.butterbar').style.display = 'none';
    }


}(this);