/**
 * Created by petitspois on 15/3/17.
 */
define(['jquery'],function($){
    var $collectionH1 = $('#doc-content').find('h1').eq(0).text() || 'docs.ren',
        $collectionH2 = $('#doc-content').find('h2'),
        cH2Len = $collectionH2.length;



    //push h1
    $('#nav-title').text($collectionH1);

    //h2 add id
    $.each($collectionH2, function(k,v){

        //set id
        $(this)[0].id = 'petitspois'+setTimeout('1');

        //nav add h2 node
        $('#nav-docs > .nav').append('<li class="l-h-2x bg b-b"><a  class="text-info text-ellipsis" href="#'+$(this)[0].id+'">'+$(this).text()+'</a></li>');

        //h3 node handling
        if(++k < cH2Len){
            $(this).nextUntil('h2','h3').each(function(){
                $(this)[0].id = 'petitspois'+setTimeout('1');
                $('#nav-docs > .nav').append('<li><a class="text-ellipsis" href="#'+$(this)[0].id+'">'+$(this).text()+'</a></li>');
            })
        }

    });


    //footer
    $('.app-footer').css('left','200px');


});