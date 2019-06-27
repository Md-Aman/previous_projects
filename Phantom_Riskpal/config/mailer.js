var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    constant = require('./constants'),
    async = require("async"),
    nodemailer = require('nodemailer'),
    ejs = require('ejs'),
    moment = require('moment'),
    path = require('path');
// EmailTemplate = mongoose.model('EmailTemplates');
var EmailTemplateObj = require('./../schema/EmailTemplates.js');
module.exports = {
    sendMail: sendMail,
    sendAttachmentMail: sendAttachmentMail,
};

var transporter = nodemailer.createTransport({
    service: constant.smtpConfig.service,
    auth: {
        user: constant.smtpConfig.username,
        pass: constant.smtpConfig.password
    },
    tls: {
        rejectUnauthorized: false
    }
});



function sendMail(to, keyword, userData, callbackMail) {
    console.log("email");
    EmailTemplateObj.findOne({ 'unique_keyword': keyword, is_deleted: false }, function(err, template) {
        if (err) {
            callbackMail(err, null);
            console.log("email01");
        } else {
            console.log("email02");
            replacePlaceholders(userData, template.description, template.subject, function(mailContent, subject) {
                var options = { mailbody: mailContent }
                generateTemplate(options, function(mailContent) {
                    var mailOptions = {
                        from: constant.smtpConfig.username, // sender address
                        to: to, // list of receivers
                        subject: subject, // Subject line
                        html: mailContent // Mail content body 
                    };
                    //console.log("mailOptions",mailOptions);                    
                    transporter.sendMail(mailOptions, function(error, info) { // send mail with defined transport object
                        if (error) {
                            // var EmailHistoryData = {
                            //     userId: userData.userId,
                            //     from: mailOptions.from,
                            //     to: mailOptions.to,
                            //     subject: mailOptions.subject,
                            //     html: mailOptions.html,
                            //     status: '1'
                            // };
                            // var EmailHistoryRecord = new EmailHistory(EmailHistoryData);
                            // EmailHistoryRecord.save(function(err, data) {
                            //     if (err) {
                            //         console.log('err save:- ', err)
                            //             // callback(err, false);
                            //         callbackMail(err, null);
                            //     } else {
                            //         // finalResponse = data;
                            //         callbackMail(null, { message: "Mail faild EmailHistory saved successfully" });
                            //     }
                            // });
                            callbackMail(err, null);
                            console.log("email1");
                        } else {
                            console.log('Email(' + keyword + ') send to:- ', to);
                            // var EmailHistoryData = {
                            //     userId: userData.userId,
                            //     from: mailOptions.from,
                            //     to: mailOptions.to,
                            //     subject: mailOptions.subject,
                            //     html: mailOptions.html,
                            //     status: '0'
                            // };
                            // var EmailHistoryRecord = new EmailHistory(EmailHistoryData);
                            // EmailHistoryRecord.save(function(err, data) {
                            //     if (err) {
                            //         // console.log('err save:- ',err)
                            //         // callback(err, false);
                            //         callbackMail(err, null);
                            //     } else {
                            //         // finalResponse = data;
                            //         callbackMail(null, { message: "Mail sent successfully" });
                            //     }
                            // });
                            callbackMail(null, { message: "Mail sent successfully" })
                            console.log("email1");
                        }
                    });
                });
            })
        }
    })
}


function sendAttachmentMail(to, keyword, userData, callbackMail) {
    EmailTemplateObj.findOne({ 'unique_keyword': keyword, is_deleted: false }, function(err, template) {
        if (err) {
            callbackMail(err, null);
        } else {
            replacePlaceholders(userData, template.description, template.subject, function(mailContent, subject) {
                var options = { mailbody: mailContent }
                generateTemplate(options, function(mailContent) {
                    var mailOptions = {
                        from: constant.smtpConfig.username, // sender address
                        to: to, // list of receivers
                        subject: subject, // Subject line
                        html: mailContent, // Mail content body 
                        attachments: userData.attachments // Mail attachments
                    };
                    transporter.sendMail(mailOptions, function(error, info) { // send mail with defined transport object
                        if (error) {
                            // var EmailHistoryData = {
                            //     userId: userData.userId,
                            //     from: mailOptions.from,
                            //     to: mailOptions.to,
                            //     subject: mailOptions.subject,
                            //     html: mailOptions.html,
                            //     status: '1'
                            // };
                            // var EmailHistoryRecord = new EmailHistory(EmailHistoryData);
                            // EmailHistoryRecord.save(function(err, data) {
                            //     if (err) {
                            //         console.log('err save:- ', err)
                            //             // callback(err, false);
                            //         callbackMail(err, null);
                            //     } else {
                            //         // finalResponse = data;
                            //         callbackMail(null, { message: "Mail faild EmailHistory saved successfully" });
                            //     }
                            // });
                            callbackMail(err, null);
                        } else {
                            console.log('Email(' + keyword + ') send to:- ', to);
                            // var EmailHistoryData = {
                            //     userId: userData.userId,
                            //     from: mailOptions.from,
                            //     to: mailOptions.to,
                            //     subject: mailOptions.subject,
                            //     html: mailOptions.html,
                            //     status: '0'
                            // };
                            // var EmailHistoryRecord = new EmailHistory(EmailHistoryData);
                            // EmailHistoryRecord.save(function(err, data) {
                            //     if (err) {
                            //         // console.log('err save:- ',err)
                            //         // callback(err, false);
                            //         callbackMail(err, null);
                            //     } else {
                            //         // finalResponse = data;
                            //         callbackMail(null, { message: "Mail sent successfully" });
                            //     }
                            // });
                            callbackMail(null, { message: "Mail sent successfully" })
                        }
                    });
                });
            })
        }
    })
}


/* @function : generateTemplate
 *  @created  : 10072015
 *  @modified :
 *  @purpose  : Create layout for emails header and footer
 */
var generateTemplate = function(options, callbackg) {
    var recepient = options.recepient || '',
        mailbody = options.mailbody;

    var fileName = path.resolve('./config/mailTemplate.html');
    ejs.renderFile(fileName, { recepient: recepient, mailbody: mailbody }, {}, function(err, str) {
        if (err) {
            callbackg(mailbody);
        } else {
            callbackg(str || mailbody);
        }
    });
}


var replacePlaceholders = function(data, mailbody, subj, callbackr) {
    var content = mailbody.replace(/\[\[(.*?)\]\]/g, function(match, token) {
        switch (token) {
            case 'BASEURL':
                return data.baseUrl;
                break;
            case 'ProjectName':
                return data.projectname;
                break;
            case 'Link':
                return data.link;
                break;
            case 'ReceiverFname':
                return data.firstname;
                break;
            case 'ReceiverLname':
                return data.lastname;
                break;
            case 'Password':
                return data.password;
                break;
            case 'Email':
                return data.email;
                break;
            case 'UserType':
                return data.usertype;
                break;
            case 'CreatedBy':
                return data.createdby;
                break;
            case 'userId':
                return data.userId;
                break;
            case 'Link':
                return "<a href='" + data.link + "' target='_blank'><img src='" + constant.config.baseUrl + "assets/images/reset_password.png' alt='Reset Password'/></a>";
                break;
            case 'startDate':
                return moment(data.orderData.startDate).format('DD-MM-YYYY hh:mm A');
                break;
            case 'endDate':
                return moment(data.orderData.endDate).format('DD-MM-YYYY hh:mm A');
                break;
        }
    })
    var subject = subj.replace(/\[\[(.*?)\]\]/g, function(match1, token1) {
        switch (token1) {
            case 'ReceiverFname':
                return data.first_name;
                break;
            case 'ReceiverLname':
                return data.last_name
                break;
        }
    })
    if (content && subject) {
        callbackr(content, subject);
    }
}




function capitalize(str) {
    return str.toLowerCase().replace(/\b\w/g, function(m) {
        return m.toUpperCase();
    });
}