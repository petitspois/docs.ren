/**
 * Created by petitspois on 15/3/8.
 */
define(['petitspois','vue'],function($, Vue){
    //already
    $('.already').on('click',function(){
        var nid = $(this).parent().attr('notice_id') || -1,
            skip = $(this).attr('pp-href');
        $.ajax({url:'/already',type:'POST',data:{nid:nid}}).then(function(){
            location.href = decodeURIComponent(skip);
        },function(){
            location.href = decodeURIComponent(skip);
        });
    });
})