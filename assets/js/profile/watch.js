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
            },
            watch:function(e, uid){
                var watchNode = e.currentTarget;
                if(!$(watchNode).hasClass('disabled')){$(watchNode).addClass('disabled')};
                $.ajax({url:'/watch',type:'POST',data:{type:'false', oid:uid}}).then(function(ret){
                    ret = JSON.parse(ret);
                    if(ret.status){
                        watchNode.innerHTML = '已关注';
                    }
                },function(){});
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
            },
            watch:function(e, uid){
                var watchNode = e.currentTarget;
                if(!$(watchNode).hasClass('disabled')){$(watchNode).addClass('disabled')};
                $.ajax({url:'/watch',type:'POST',data:{type:'true', oid:uid}}).then(function(ret){
                    ret = JSON.parse(ret);
                    if(ret.status){
                        $(watchNode).parent('list-group-item').remove();
                    }
                },function(){});
            }
        }
    }).$mount('#you-watch');


    return {
        mewatch:mewatch,
        watchme:watchme
    }



});