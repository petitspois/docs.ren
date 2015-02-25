/**
 * Created by qingdou on 15/2/11.
 */

module.exports = function () {
    return {
        fusion:require('./fusion')(),
        user: require('./user')(),
        post:require('./post')()
    };
};