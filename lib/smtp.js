/**
 * Created by petitspois on 3/30/15.
 */

var nodemailer = require("nodemailer");

var smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(mailOptions){

        var transporter = nodemailer.createTransport(smtpTransport({
            host:'smtp.163.com',
            port:465,
            secure: true,
            debug: true,
            auth:{
                user:'petitspois@163.com',
                pass:'love521424'
            }
        }));

        mailOptions && (mailOptions.sender = 'petitspois@163.com');

        mailOptions && (mailOptions.subject = '[通知]Docs.ren提醒邮件');

       var smtp = new Promise(function(resolve, reject){
            transporter.sendMail(mailOptions, function(err, info){
                 if(err){
                    reject(err);
                 }else{
                    resolve(info);
                 }
            });
        });

        return smtp;

}