/**
 * Created by petitspois on 15/2/25.
 */
define(['petitspois', 'vue', 'vueValidator', 'upload','loadin'], function ($, Vue, valid, upload,loadin) {


    //upload cover
    //cover
    upload.preview('docs-cover','',function(data){
        var coverData = data.replace(/^data:image\/\w+;base64,/,'') || '';
        loadin.show('load');
        coverData && $.ajax({url:'/docscover', type:'POST',data:{coverData:coverData}}).then(function(ret){
            loadin.show('alert','上传成功','success');
            ret = JSON.parse(ret);
            if(ret.status){
                document.getElementById('docs-uri').placeholder = ret.imguri;
            }
        },function(){});
    });

    //init validate
    Vue.use(valid);

    var publishForm = new Vue({
        data: {
            docs:{
                title: '',
                tags: '',
                category: '',
                github:'',
                description:'',
                content: '',
                edit:''
            }
        },
        methods: {
            submit: function (e) {
                e.preventDefault();
                //get editor value
                if(!!editor.codemirror.getValue()){
                    this.post.content = editor.codemirror.getValue();
                }else{
                    loadin.show('alert', '文档内容不能为空', 'danger');
                }

                var url = this.post.edit ? '/docedit':'/create';

                loadin.show('load');
                $.ajax({type:'POST',url: url,data:this.$data.post}).then(function(ret){
                    ret = JSON.parse(ret);
                    if(ret.status){
                        location.href = '/';
                    }else{
                        loadin.show('alert', ret.msg, 'danger');
                    }
                },function(){});
            }
        }
    }).$mount('#docs-wrap');


});