/**
 * Created by petitspois on 15/2/26.
 */

var moment = require('moment');

    moment.locale('zh-cn');

module.exports = function(date, friendly){
    date = moment(date);
    if(friendly){
        return date.fromNow();
    }else{
        return date.format('YYYY-MM-DD HH:mm');
    }
}