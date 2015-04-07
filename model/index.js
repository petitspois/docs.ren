/*!
 * 模型出口
 * @author petitspois
 * @create 2015/2/9
 */

var mongoose = require('mongoose'),

    models = {
        user: require('./user'),
        post:require('./post'),
        comment:require('./comments'),
        notification:require('./notification'),
        action:require('./action'),
        settings:require('./settings'),
        category:require('./category')
    };

for (var key in models) {

    var schema = models[key];


    //create
    schema.static('add', function(data){
        return this.create(data);
    });


    //get
    schema.static('get',function(data, name, sort){
        return this.findOne(data, name).sort(sort).exec();
    });

    schema.static('getAll',function(query, sort, skip, limit, select){
        return this.find(query).select(select).skip((skip-1)*limit).limit(limit).sort(sort).lean().exec();
    });

    schema.static('getAvatar',function(query){
        return this.findOne(query).populate('author').exec();
    });

    schema.static('byId',function(id){
        return this.findById(id).exec();
    });

    //update
    schema.static('update',function(conditions,update){
        return this.findOneAndUpdate(conditions,update).exec();
    });

    schema.static('updateSelectAll',function(conditions,update,opts){
        return this.where().update(conditions,update,opts).exec();
    });


    //remove
    schema.static('byidRemove',function(id){
        return this.findByIdAndRemove(id).exec();
    });

    schema.static('removeSingle',function(query){
        return this.remove(query).exec();
    });

    //count
    schema.static('querycount',function(query){
        return this.count(query).exec();
    });


    exports[key] = mongoose.model(key, schema);

}



