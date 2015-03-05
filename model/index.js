/*!
 * 模型出口
 * @author petitspois
 * @create 2015/2/9
 */

var mongoose = require('mongoose'),

    models = {
        user: require('./user'),
        post:require('./post'),
        comment:require('./comments')
    };

for (var key in models) {

    var schema = models[key];


    //create
    schema.static('add', function(data){
        return this.create(data);
    });


    //get
    schema.static('get',function(data, name){
        return this.findOne(data, name).exec();
    });

    schema.static('getAll',function(query, sort){
        return this.find(query).sort(sort).lean().exec();
    });

    schema.static('getAvatar',function(query){
        return this.findOne(query).populate('author').exec();
    });

    schema.static('getAvatar',function(query){
        return this.findOne(query).populate('author').exec();
    });


    //update
    schema.static('update',function(conditions,update){
        return this.findOneAndUpdate(conditions,update).exec();
    });


    //remove
    schema.static('findByIdAndRemove',function(query){
        return this.findOne(query).populate('author').exec();
    });


    exports[key] = mongoose.model(key, schema);

}



