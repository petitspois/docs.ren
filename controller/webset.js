/**
 * Created by petitspois on 4/3/15.
 */

var settingsModel = require('../model/').settings;


module.exports = function(){

    var webset = {};

    webset.webset = function* (){
        var body = this.request.body,
            existBase = yield settingsModel.get({name:'base'});
        if(existBase){
            //update
            yield settingsModel.update({name:'base'},{$set:body});
        }else{
            //create
            body.name = 'base';
            yield settingsModel.add(body);
        }

        this.body = {
            msg:'操作成功',
            status:1
        }
    }


    return webset;

}