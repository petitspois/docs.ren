/**
 * Created by petitspois on 15/2/15.
 */
define(['petitspois', 'vue','upload','loadin'],function($, Vue, upload, loadin){

    var urlHash = location.hash;

    //tab
    $('#profile-tab').children().each(function(k ,v){
         $(this).on('click', function(){
             $('.profile-sh').each(function(){
                 if($(this).hasClass('show')){
                     $(this).removeClass('show');
                 }else if($(this).hasClass('ng-enter')){
                     $(this).removeClass('ng-enter');
                 }
             });
             $('#profile-tab').children().each(function(){
                 $(this).removeClass('active');
             });
             $(this).addClass('active');
             $('.profile-sh').eq(k).addClass('show ng-enter');
         })
    });

    if(urlHash=='#settings'){
        $('#profile-tab').children().eq(1).trigger('click');
    }

    //cover
    upload.preview('cover','',function(data){
       var coverData = coverData.replace(/^data:image\/\w+;base64,/,'') || '';

        coverData && $.ajax({url:'/cover', type:'POST',data:{coverData:coverData}}).then(function(ret){

        },function(){});
    });


    //profile settings
    var avatarData = '';
    upload.preview('avatar','preview-avatar',function(data){
        avatarData = data;//base64
    });

    new Vue({
        el:'#profile-form',
        data:{
            profile:{
                nickname:'',
                sex:profileSex,
                company:'',
                location:'',
                avatar:'',
                description:'',
                github:'',
                weibo:''
            }
        },
        methods:{
            submit:function(e){
                e.preventDefault();
                loadin.show('load');
                var profileData = this.$data.profile;
                if(avatarData){
                    avatarData = avatarData.replace(/^data:image\/\w+;base64,/,'') || '';
                }
                profileData.avatar = avatarData;
                $.ajax({type:'POST',url:'/profile',data:profileData}).then(function(ret){
                    ret = JSON.parse(ret);
                    if(ret.status){
                        loadin.show('alert',ret.msg,'success');
                        setTimeout(function(){
                            location.reload();
                        },1000);
                    }
                },function(){});
            }
        }
    });


});