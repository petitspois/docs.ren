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
                post:{
                    title: '',
                    tags: '',
                    category: '',
                    content: ''
                }
            },
            methods: {
                submit: function (e) {
                    e.preventDefault();
                    //get editor value
                    if(!!editor.codemirror.getValue()){
                        this.post.content = editor.codemirror.getValue();
                    }else{
                        loadin.show('alert', '文章内容不能为空', 'danger');
                    }
                    loadin.show('load');
                    $.ajax({type:'POST',url:'/publish',data:this.$data.post}).then(function(ret){
                        ret = JSON.parse(ret);
                        if(ret.status){
                            location.href = '/';
                        }else{
                            loadin.show('alert', ret.msg, 'danger');
                        }
                    },function(){});
                }
            }
        }).$mount('#publish-form');


});