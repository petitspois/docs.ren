/**
 * Created by petitspois on 4/3/15.
 */
var settingsModel = require('../../model/').settings;

module.exports = function(swig){
    return function* webset(next){
        var baseData = yield settingsModel.get({name:'base'});
        swig.setDefaults({ locals: { baseSettings: baseData }});
        try {
            yield *next;
        } catch (err) {
            throw err;
        }
    }
}