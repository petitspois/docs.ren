/**
 * Created by petitspois on 4/2/15.
 */
define(['jquery', 'vue', 'gf'], function ($, Vue, gf) {
    //tab
    $('#set-tab').children(':gt(0)').on('click', function () {
        var $index = $(this).index();
        $(this).siblings().removeClass('active').end().addClass('active');
        $('.set-content').children().not('.hide').addClass('hide').end().eq($index).removeClass('hide');
    });

    Vue.config.delimiters = ['<%', '%>'];

    var baseData = {
            keywords: '',
            description: '',
            statistics: ''
        },
        postData = {
            search:'',
            page:0,
            posts:[],
            extra:{}
        };


    //vue data
    ///基本设置
    var baseSet = new Vue({
        el: '#base-set',
        data: baseData,
        methods: {
            save: function (e) {
                e.preventDefault();
                $.ajax({url: '/webset', type: 'POST', data: this.$data}).then(function (ret) {
                    if (ret.status) {
                        gf('success', ret.msg);
                    }
                })
            }
        }
    });

    ///文章设置
    var setPost = new Vue({
        el: '#set-post',
        data: postData,
        ready:function(){
            this.loadmore();
        },
        methods: {
            loadmore:function(type, clear){
                var ctx = this;
                type = type || 'all';

                if('search' === type ){
                    if(!ctx.search){
                        gf('error', '搜索内容不能为空');
                        return;
                    };
                }

                !!clear && (ctx.page= 0);
                ctx.page++;
                if($('.loader').hasClass('hide')){
                    $('.loader').removeClass('hide');
                }
                $.ajax({url: '/setPost', type: 'POST', data: {page:ctx.page, type: type, search:ctx.search}}).then(function (ret) {
                    if(!$('.loader').hasClass('hide')){
                        $('.loader').addClass('hide');
                    }
                    !!clear && (ctx.posts.length = 0);
                    ctx.posts = ctx.posts.concat(ret.posts);
                    ctx.extra = ret.extra;
                })
            }
        }
    });

});