/*!
 * 模型出口
 * @author petitspois
 * @create 2015/2/9
 */

var mongoose = require('mongoose'),

    models = {
        user: require('./user'),
        post:require('./post')
    };

for (var key in models) {

    var schema = models[key];

    schema.static('add', function(data){
        return this.create(data);
    });

    schema.static('get',function(data, name){
        return this.findOne(data, name).exec();
    });

    schema.static('update',function(conditions,update){
        return this.findOneAndUpdate(conditions,update).exec();
    });



    exports[key] = mongoose.model(key, schema);

}

