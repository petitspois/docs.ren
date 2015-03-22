/**
 * Created by petitspois on 3/22/15.
 */
define(['petitspois', 'vue', 'loadin'], function ($, Vue, loadin) {

    Vue.config.delimiters = ['(%', '%)'];

    var watchme = new Vue({
        data: {
            watchyouusers:[],
            extra:{}
        },
        methods: {
            loadwatchyou: function () {
                var me = this;

                $.ajax({url: '/watchlist', type: 'POST', data: {type: 'watchyou'}}).then(function (ret) {
                    ret = JSON.parse(ret);
                    if (ret.status) {
                        me.watchyouusers = ret.data;
                    } else {
                        me.extra = ret;
                    }
                    $('.watchyouloader').addClass('hide');
                }, function () {
                });
            }
        }
    }).$mount('#watch-you');

    var mewatch = new Vue({
        data: {
            watchyouusers:[],
            extra:{}
        },
        methods: {
            loadyouwatch: function () {
                var me = this;
                $.ajax({url: '/watchlist', type: 'POST', data: {type: 'youwatch'}}).then(function (ret) {
                    ret = JSON.parse(ret);
                    if (ret.status) {
                        me.watchyouusers = ret.data;
                    } else {
                        me.extra = ret;
                    }
                }, function () {
                });
            }
        }
    }).$mount('#you-watch');


    return {
        mewatch:mewatch,
        watchme:watchme
    }



});