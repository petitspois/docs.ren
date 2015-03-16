/**
 * Created by petitspois on 15/3/2.
 */
define(['petitspois', 'loadin'], function ($, loadin) {

    //提交评论
    $('#comment-btn').on('click', function () {
        var content = document.getElementById('comment-content').value || '',
            pathname = location.pathname,
            pid = pathname.slice(pathname.lastIndexOf('/') + 1) || -1;
            loadin.show('load');
            pushComment({comment: content, pid: pid})
    });

    //评论删除
    var $del = $('#delete-comment');
    $del.on('click', function () {
        var $delNode = $(this).parent('each-comments'),
            cid = $delNode.attr('id') || 0;
        if (cid) {
            loadin.show('load');
            $.ajax({url: '/removecomment', type: 'POST', data: {cid: cid}}).then(function (ret) {
                ret = JSON.parse(ret);
                if(ret.status){
                    loadin.show('alert','删除成功','success');
                    $delNode.remove();
                }else{
                    loadin.show('alert',ret.msg, 'danger');
                }
            }, function () {
            })
        }
    })

    //回复
    ///展开
    $('#reply-comment').on('click',function(){
          var $reply = $(this).parent().siblings().siblings();
        if(!$reply.hasClass('ng-enter')) {
            $reply.removeClass('hide').addClass('ng-enter');
        }
    });
    ///send
    $('#reply-btn').on('click',function(){
         var $topNode = $(this).parent()[0].previousElementSibling,
             replyContent = $topNode.value,
             replyName = $topNode.previousElementSibling.getAttribute('reply-name'),
             pid = location.pathname.slice(location.pathname.lastIndexOf('/') + 1) || -1;
             pushComment({comment: replyContent,pid:pid,reply:replyName});
             setTimeout(function(){
                   $('.reply').each(function(){
                       if($(this).hasClass('ng-enter')){
                            $(this).remove('ng-enter');
                       }
                   });
             })
    });



    function pushComment(data){
        if(data){
            $.ajax({url: '/comment', type: 'POST', data: data}).then(function (ret) {
                var strArr = [];
                ret = JSON.parse(ret);
                if (ret.status) {
                    //not signin
                    if (2 === ret.status) {
                        loadin.show('alert', ret.msg, 'success');
                        setTimeout(function () {
                            location.pathname = '/signin';
                        }, 700)
                        return;
                    }

                    //插入即将
                    var wrap = document.createElement('div');
                    wrap.className = 'each-comments fade-in-up';
                    strArr.push('<a class="pull-left thumb-sm">');
                    strArr.push('<img src="' + ret.data.avatar + '" class="img-circle">');
                    strArr.push('</a><div class="m-l-xxl m-b"><div>');
                    strArr.push('<a href=""><strong>' + ret.data.name + '</strong></a>');
                    strArr.push('<span class="text-muted text-xs block m-t-xs">' + ret.data.createtime + '</span>');
                    if(ret.data.reply){
                        strArr.push('</div><div class="m-t-sm reply-wrap"><a href="">@'+ret.data.reply+'</a>&nbsp;&nbsp;' + ret.data.comment + '</div></div>');
                    }else{
                        strArr.push('</div><div class="m-t-sm">' + ret.data.comment + '</div></div>');
                    }
                    wrap.innerHTML = strArr.join(' ');
                    loadin.hide();
                    document.body.scrollTop = 77777;
                    document.getElementById('wrap-comments').appendChild(wrap);
                    $(wrap).addClass('ng-enter');
                } else {
                    loadin.show('alert', ret.msg, 'danger');
                }

            }, function () {
            })
        }
    }

})