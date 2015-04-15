/**
 * Created by petitspois on 4/3/15.
 */
var settingsModel = require('../../model/').settings,
    userModel = require('../../model/').user;

module.exports = function(swig){
    return function* webset(next){
        var baseData = yield settingsModel.get({name:'base'}),
            level = this.session.user ? (yield userModel.get({email:this.session.user.email}, '-password')):'';

        swig.setDefaults({ locals: { baseSettings: baseData, level: level}});

        try {
            yield *next;
        } catch (err) {
            throw err;
        }
    }
}