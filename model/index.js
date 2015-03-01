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

    'post' == key && schema.static('getAll',function(query){
        return this.find(query).sort('-createtime').exec();
    });

    'post' == key && schema.static('getAvatar',function(query){
        return this.findOne(query).populate('author').exec();
    });

    schema.static('update',function(conditions,update){
        return this.findOneAndUpdate(conditions,update).exec();
    });


    exports[key] = mongoose.model(key, schema);

}



