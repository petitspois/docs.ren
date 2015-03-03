/**
 * Created by petitspois on 15/3/2.
 */
define(['petitspois','loadin'], function ($, loadin) {
    $('#comment-btn').on('click', function () {
        var content = document.getElementById('comment-content').value || '',
            pathname = location.pathname,
            pid = pathname.slice(pathname.lastIndexOf('/')+1) || -1;
            loadin.show('load');
        $.ajax({url: '/comment', type: 'POST', data: {comment:content,pid:pid}}).then(function (ret) {
            var strArr = [];
            ret = JSON.parse(ret);
            if(ret.status){
                var wrap = document.createElement('div');
                wrap.className = 'each-comments';
                strArr.push('<a class="pull-left thumb-sm">');
                strArr.push('<img src="'+ret.data.avatar+'" class="img-circle">');
                strArr.push('</a><div class="m-l-xxl m-b"><div>');
                strArr.push('<a href=""><strong>'+ret.data.name+'</strong></a>');
                strArr.push('<label class="label bg-info m-l-xs">Editor</label>');
                strArr.push('<span class="text-muted text-xs block m-t-xs">'+ret.data.createtime+'</span>');
                strArr.push('</div><div class="m-t-sm">'+ret.data.comment+'</div></div>');
                wrap.innerHTML = strArr.join(' ');
                loadin.hide();
                document.getElementById('wrap-comments').appendChild(wrap);
            }else{
                loadin.show('alert',ret.msg,'danger');
            }

        }, function () {})
    });

    var $del = $('#delete-comment');
    $del.on('click',function(){
         console.log($(this).parent().parent().parent().attr())
    })
})