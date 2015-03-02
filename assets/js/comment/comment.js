/**
 * Created by petitspois on 15/3/2.
 */
define(['petitspois'], function ($) {
    $('#comment-btn').on('click', function () {
        var content = document.getElementById('comment-content').innerHTML || '',
            pathname = location.pathname,
            pid = pathname.slice(pathname.lastIndexOf('/')+1) || -1;
        $.ajax({url: '/comment', type: 'POST', data: {comment:content,pid:pid}}).then(function (ret) {
            var strArr = [];
            ret = JSON.parse(ret);
            strArr.push('<div class="each-comments"><a class="pull-left thumb-sm">');
            strArr.push('img');
            strArr.push('</a><div class="m-l-xxl m-b"><div>');
            strArr.push('<a href=""><strong>John smith</strong></a>');
            strArr.push('<label class="label bg-info m-l-xs">Editor</label>');
            strArr.push('<span class="text-muted text-xs block m-t-xs"></span>');
            strArr.push('</div><div class="m-t-sm"></div></div></div>');
            strArr.join();

        }, function () {})
    });
})