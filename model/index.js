/*!
 * 模型出口
 * @author petitspois
 * @create 2015/2/9
 */

var models = {
    user: require('./user')
}, model;

for (var key in models) {

    model = models[key];

    exports[key] = {};

    exports[key].createOne = function (data, callback) {
        model.create(data, function(err, data){
            console.log(data)
             callback(err, data);
        });
    }
}

