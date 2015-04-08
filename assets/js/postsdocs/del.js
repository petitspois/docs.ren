/**
 * Created by petitspois on 4/8/15.
 */
define(['petitspois','gf'],function($, gf){
    //posts del
    $('#post-del').on('click', function(){
        var isdel = confirm('确定删除文章吗？'),
            id = this.dataset.id;
        isdel && $.ajax({url:'/del',type:'POST',data:{id:id}}).then(function(ret){
            ret = JSON.parse(ret);
            if(ret.status){
                gf('success', ret.msg);
                setTimeout(function(){
                    location.href = '/';
                },1000);
            }else{
                gf('error', ret.msg);
            }
        },function(){})

    });
});