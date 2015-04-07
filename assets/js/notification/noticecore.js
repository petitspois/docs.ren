/**
 * Created by petitspois on 15/3/8.
 */
define(['petitspois', 'vue', 'loadin', 'gf'], function ($, Vue, loadin, gf) {


    Vue.config.delimiters = ['(%', '%)'];

    new Vue({
        el: '#notice',
        data: {
            notices: []
        },
        ready: function() {
            $('#triggle-all').trigger('click');
        },
        methods: {
            noticedata: function (type, e) {

                var me = this;
                //tab effect
                $('#notice-content').children().each(function () {
                    $(this).removeClass('active');
                });

                $(e.currentTarget).addClass('active');

                loadin.show('load');
                //load notice
                $.ajax({url: '/notification', type: 'POST', data: {type: type}}).then(function (ret) {
                    ret = JSON.parse(ret);
                    me.notices = ret.notices;
                    loadin.hide();
                }, function () {
                })
            },
            already: function (e) {
                var me = e.currentTarget,
                    nid = me.parentNode.getAttribute('notice_id') || -1,
                    skip = me.getAttribute('pp-href');
                $.ajax({url: '/already', type: 'POST', data: {nid: nid}}).then(function () {
                    location.href = decodeURIComponent(skip);
                }, function () {
                    location.href = decodeURIComponent(skip);
                });

            },
            flagAll:function(){
                loadin.show('load');
                $.ajax({url: '/flagall', type: 'POST'}).then(function (ret) {
                    ret = JSON.parse(ret);
                    loadin.hide();
                    if(ret.status){
                        gf('success', ret.msg);
                        $('#triggle-all').trigger('click');
                    }else{
                        gf('error', ret.msg);
                    }
                }, function () {});
            }

        }
    });


})