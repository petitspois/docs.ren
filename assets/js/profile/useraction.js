/**
 * Created by petitspois on 3/21/15.
 */
define(['petitspois','vue'],function($, Vue){


    Vue.config.delimiters = ['(%', '%)'];

    var vm = new Vue({
        el:'#user-action',
        data:{
            useraction:[],
            extra:{},
            page:{
                page:0
            }
        },
        ready:function(){
            this.loaddata(this.page.page);
        },
        methods:{
            loaddata:function(page){
                var me = this;
                page++;
                if($('.loader').hasClass('hide')){$('.loader').removeClass('hide')};
                $.ajax({url:'/action',type:'POST',data:{page:page}}).then(function(ret){
                    ret = JSON.parse(ret);
                    me.useraction =  me.useraction.concat(ret.data);
                    me.extra = ret;
                    me.page = ret.page;
                    if(!$('.loader').hasClass('hide')){$('.loader').addClass('hide')};
                },function(){});
            },
            eachdata:function(){
                this.loaddata(this.page.page);
            }
        }
    });


});