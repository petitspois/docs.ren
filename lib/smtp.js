/**
 * Created by petitspois on 3/30/15.
 */

var cSmtp = require('../server/config').smtp,

    nodemailer = require("nodemailer"),

    smtpTransport = require('nodemailer-smtp-transport');


module.exports = function (mailOptions) {

    cSmtp.secure = true;
    cSmtp.debug = true;
    var transporter = nodemailer.createTransport(smtpTransport(cSmtp));

    mailOptions && (mailOptions.sender = cSmtp.auth.user);

    mailOptions && (mailOptions.subject = '[通知]Docs.ren提醒邮件');

    var smtp = new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });

    return smtp;

}