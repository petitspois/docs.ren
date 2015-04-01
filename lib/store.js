/**
 * Created by petitspois on 4/1/15.
 */

var qn = require('qn'),
    conf = require('../server/config');

var qnClient = null;
if (conf.qn_access && conf.qn_access.secretKey) {
    qnClient = qn.create(conf.qn_access);
}

module.exports = qnClient;