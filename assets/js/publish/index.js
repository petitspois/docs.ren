/**
 * Created by petitspois on 15/2/25.
 */
define(['petitspois', 'vue', 'vueValidator','loadin', 'editor/editor'], function ($, Vue, valid, loadin) {

    //editor
    var editor = new Editor();
    editor.render($('#editor')[0]);


        //init validate
        Vue.use(valid);

        var publishForm = new Vue({
            data: {
                title: '',
                tags: '',
                category: '默认',
                content: ''
            },
            methods: {
                submit: function (e) {
                    e.preventDefault();
                    //get editor value
                    if(!!editor.codemirror.getValue()){
                        this.content = editor.codemirror.getValue();
                    }else{
                        loadin.show('alert', '文章内容不能为空', 'danger');
                    }

                }
            }
        }).$mount('#publish-form');


});