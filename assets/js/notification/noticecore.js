/**
 * Created by petitspois on 15/3/8.
 */
define(['petitspois','vue','loadin'],function($, Vue, loadin){


    Vue.config.delimiters = ['(%', '%)'];

    new Vue({
        el:'#notice',
        data:{
            notices:[]
        },
        methods:{
            noticedata:function(type, e){

                var me = this;

                //tab effect
                $('#notice-content').children().each(function(){
                     $(this).removeClass('active');
                });

                $(e.currentTarget).addClass('active');

                loadin.show('load');
                //load notice
                $.ajax({url:'/notification',type:'POST',data:{type:type}}).then(function(ret){
                    ret = JSON.parse(ret);
                    me.notices = ret.notices;
                    loadin.hide();
                },function(){})
            }
        }
    });


       //token already
       $('#notice-wrap').on('click',function(e){
           if(e.target){
               alert(13)
           }
       //    var nid = $(this).parent().attr('notice_id') || -1,
       //        skip = $(this).attr('pp-href');
       //    $.ajax({url:'/already',type:'POST',data:{nid:nid}}).then(function(){
       //        location.href = decodeURIComponent(skip);
       //    },function(){
       //        location.href = decodeURIComponent(skip);
       //    });
       });




})