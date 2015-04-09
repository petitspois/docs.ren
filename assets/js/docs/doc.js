/**
 * Created by petitspois on 15/2/25.
 */
define(['petitspois', 'vue', 'vueValidator', 'upload', 'loadin', 'editor/editor'], function ($, Vue, valid, upload, loadin) {

    //editor
    var editor = new Editor();
    editor.render($('#editor')[0]);


    //upload cover
    //cover
    upload.preview('docs-cover', '', function (data) {
        var coverData = data.replace(/^data:image\/\w+;base64,/, '') || '';
        loadin.show('load');
        coverData && $.ajax({url: '/docscover', type: 'POST', data: {coverData: coverData}}).then(function (ret) {
            loadin.show('alert', '上传成功', 'success');
            ret = JSON.parse(ret);
            if (ret.status) {
                document.getElementById('docs-uri').placeholder = ret.imguri;
            }
        }, function () {
        });
    });

    //init validate
    Vue.use(valid);

    var publishForm = new Vue({
        data: {
            docs: {
                title: '',
                tags: '',
                category: '',
                github: '',
                cover: '',
                description: '',
                content: '',
                istop:istop,
                recommend:recommend,
                iscomment: iscomment,
                cstatus: cstatus,
                edit: ''
            }
        },
        methods: {
            submit: function (e) {

                e.preventDefault();

                //get editor value
                if (!!editor.codemirror.getValue()) {
                    this.docs.content = editor.codemirror.getValue();
                } else {
                    loadin.show('alert', '文档内容不能为空', 'danger');
                }

                //cover url
                var coverUri = document.getElementById('docs-uri').placeholder;

                coverUri = /docscover/.test(coverUri) ? coverUri : '';

                this.docs.cover = coverUri;

                //request url
                var url = this.docs.edit ? '/docedit' : '/create';

                loadin.show('load');
                $.ajax({type: 'POST', url: url, data: this.$data.docs}).then(function (ret) {
                    ret = JSON.parse(ret);
                    if (ret.status) {
                        loadin.show('alert', ret.msg, 'success');
                        setTimeout(function(){
                            location.href = '/';
                        },500)
                    } else {
                        loadin.show('alert', ret.msg, 'danger');
                    }
                }, function () {
                });
            }
        }
    }).$mount('#docs-wrap');


});