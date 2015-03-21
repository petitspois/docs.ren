/**
 * Created by petitspois on 3/21/15.
 */
define(['petitspois','vue'],function($, Vue){


    Vue.config.delimiters = ['(%', '%)'];

    var vm = new Vue({
        el:'#user-action',
        data:{useraction:[],extra:{}}
    });

    (loadAction = function(){

        //loading

        $.ajax({url:'/action',type:'POST'}).then(function(ret){
            ret = JSON.parse(ret);
            vm.$data.useraction = ret.data;
            vm.$data.extra = ret;
            if(!$('.loader').hasClass('hide')){$('.loader').addClass('hide')};
        },function(){});

    })();

});