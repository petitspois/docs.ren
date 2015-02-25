/**
 * Created by petitspois on 15/2/15.
 */
define(['petitspois','loadin'],function($, loadin){
    return {
        preview:function(node, preNode, cb){
            var $node = $('#'+node),
                $preNode = $('#'+preNode);

            $node.on('change',function(event){
                var file = event.target.files[0],
                    reader = new FileReader();

                if(!file.type.match('image.*')){
                    loadin.show('alert','请选择正确的图片格式','danger')
                    return;
                };

                if(file.size>=1024*2*1024){
                    loadin.show('alert','图片大小过大，应小于2M','danger')
                    return;
                }

                reader.onload = function(){
                    var img = document.createElement('img');
                    img.id = 'preview-avatar-img';
                    $preNode[0].innerHTML = '';
                    $preNode[0].appendChild(img);
                    $('#wrap-progress').removeClass('no-show');
                    img.src= reader.result;
                    cb(reader.result);
                 }

                reader.onprogress = function(event){
                    if(event.lengthComputable){
                        var progress = parseInt( ((event.loaded / event.total) * 100), 10 );
                        $('#show-precent').text(progress+'%');
                    }
                }

                reader.readAsDataURL(file);

            });

        }
    }
});