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
            helplink:'',
            statistics: ''
        },
        userData = {
            type:'',
            search:'',
            page:0,
            users:[],
            extra:{}
        },
        postData = {
            type:'',
            search:'',
            page:0,
            posts:[],
            extra:{}
        },
        categoryData = {
            categoryName:'',
            categories:[]
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

    ///用户设置
    var baseSet = new Vue({
        el: '#set-user',
        data: userData,
        ready:function(){
            this.userList();
        },
        methods: {
            userList:function(type, clear){
                var ctx = this;

                type && (ctx.type = type);

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
                $.ajax({url: '/userManagement', type: 'POST', data: {page:ctx.page, type: ctx.type, search:ctx.search}}).then(function (ret) {
                    if(!$('.loader').hasClass('hide')){
                        $('.loader').addClass('hide');
                    }
                    !!clear && (ctx.users.length = 0);
                    ctx.users = ctx.users.concat(ret.users);
                    ctx.extra = ret.extra;
                })
            },
            delUser:function(e){
                var isdel = confirm('确定删除此用户吗？'),
                    again  = isdel && confirm('删除用户将会删除此用户相关，动态、通知、文章以及评论，请谨慎操作'),
                    id = e.target.dataset.id;
                again && $.ajax({url:'/delUser',type:'POST',data:{id:id}}).then(function(ret){
                    if(ret.status){
                        gf('success', ret.msg);
                        $(e.target).closest('tr').remove();
                    }else{
                        gf('error', ret.msg);
                    }
                },function(){})
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

                type && (ctx.type = type);

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
                $.ajax({url: '/setPost', type: 'POST', data: {page:ctx.page, type: ctx.type, search:ctx.search}}).then(function (ret) {
                    if(!$('.loader').hasClass('hide')){
                        $('.loader').addClass('hide');
                    }
                    !!clear && (ctx.posts.length = 0);
                    ctx.posts = ctx.posts.concat(ret.posts);
                    ctx.extra = ret.extra;
                })
            },
            del:function(e){
                var isdel = confirm('确定删除文章吗？'),
                    id = e.target.dataset.id;
                isdel && $.ajax({url:'/del',type:'POST',data:{id:id}}).then(function(ret){
                    if(ret.status){
                        gf('success', ret.msg);
                        $(e.target).closest('tr').remove();
                    }else{
                        gf('error', ret.msg);
                    }
                },function(){})
            }
        }
    });

    ///分类设置
    var setCategory = new Vue({
        el:'#set-category',
        data:categoryData,
        ready:function(){
            this.categorylist();
        },
        methods:{
            categorylist:function(){
                var ctx = this;
                $.ajax({url:'/categoryList', type:'POST'}).then(function(ret){
                    ctx.categories = ret.categories;
                });
            },
            addCategory:function(){
                var ctx = this;
                if(!ctx.categoryName){
                    gf('error', '分类名不能为空');
                    return;
                }
                $.ajax({url:'/addCategory', type:'POST', data:{name:ctx.categoryName}}).then(function(ret){
                     if(ret.status){
                         gf('success', ret.msg);
                         var adddom = [
                                 '<tr class="fade-in-up ng-enter">',
                                 '<td class="v-middle"><a href="javascript:;">'+ret.data.name+'</a></td>',
                                 '<td style="white-space: nowrap">',
                                 '<div class="buttons">',
                                 '<button class="btn btn-sm btn-danger" disabled>删除</button>',
                                 '</div>',
                                 '</td>',
                                 '</tr>'
                         ].join(' ');

                         $('#category-tr').after(adddom);

                     }else{
                         gf('error', ret.msg);
                     }
                });
            },
            removeCategory:function(e, categoryName){
                 var isdel = confirm("您确定要删除"+categoryName+'分类吗？'),
                     ctx = this;
                 if(isdel){
                     $.ajax({url:'/removeCategory', type:'POST', data:{name:categoryName}}).then(function(ret){
                          if(ret.status){
                              gf('success', ret.msg);
                              $(e.target).closest('tr').remove();
                          }
                     });
                 }
            }
        }
    });


});