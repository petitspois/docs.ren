module.exports = function(root){
    return {
        model:root + '/model/',
        views:root + '/views/',
        controller:root + '/controller/',
        static:{
            tmp:root + '/assets/tmp/',
            img:root + '/assets/img/'
        },
        port:4000
    }
}
