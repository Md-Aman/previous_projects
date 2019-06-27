/**
 * Created by olyjosh on 29/06/2017.
 */
var config = require('../config/jwt_secret.js');

var nodeMailer = require("nodemailer");
var EmailTemplate = require('email-templates').EmailTemplate;
var template = require('./template');


// var transporter = nodeMailer.createTransport({
//     service: config.service,
//     auth: {
//         user: config.username,
//         pass: config.password
//     }});

var aws = require('aws-sdk');
aws.config.loadFromPath('./helper/ses.config.json');
var ses = new aws.SES({apiVersion: '2010-12-01'});
var transporter = nodeMailer.createTransport({
    SES: ses
});

// create template based sender function
// assumes text.{ext} and html.{ext} in template/directory

exports.sendEmailNodeMailer = function ( email, subject, html, attachments = '') {
    var mailOptions = {
        to: email,
        from: config.username,
        subject: subject,
        html: html,
        attachments: attachments
    };
    return new Promise( (resolve, reject) => { 
         transporter.sendMail(mailOptions, function (err) {
            
            if (err) {
                console.log('errrrr', err);
                 reject(err);
            } else {
                console.log('ffff');
                 resolve(true);
            }
        });
    });
}

// send email to user
exports.sendEmailToUser = async function (data, fn) {
    var url = data.baseUrl + config.emailRALinkList;
    var submitting = data.reSubmitting + 'submitting';
    var firstParagraph = `Thank you for ${submitting} the risk assessment for ${data.project_name}. The risk assessment is now with ${data.approvingManagerName}.`;
    var secondParagraph = `To request further amendments or access the document please contact them or your system administrator.`;
    var html = template.raTemplate.replace('{{name}}', data.authorName );
    html = html.replace('{{firstParagraph}}', firstParagraph);
    html = html.replace('{{secondParagraph}}', secondParagraph);
    html = html.replace('{{urlText}}', 'View Risk Assement');
    html = html.replace('{{url}}', url);
    try {
        const email = await exports.sendEmailNodeMailer(data.toEmail, data.subject, html, data.attachments); // to user
        fn(null, email);
    } catch(err) {
        fn(err);
    }
    
}
// sent for approving
// send email to user
exports.sendEmailToUserAboutApproving = async function (data, fn) {
    var url = data.baseUrl + config.emailRALinkList;
    var firstParagraph = `${data.submittedBy} has submitted a new risk assessment "${data.project_name}".`;
    var secondParagraph = `Please Review the Risk Assessment in order to approve or reject
    the submission.`;
    var html = template.raTemplate.replace('{{name}}', data.authorName );
    html = html.replace('{{firstParagraph}}', firstParagraph);
    html = html.replace('{{secondParagraph}}', secondParagraph);
    html = html.replace('{{urlText}}', 'View Update On RiskPal');
    html = html.replace('{{url}}', url);
    try {
        const email = await exports.sendEmailNodeMailer(data.toEmail, data.subject, html, data.attachments); // to user
        fn(null, email);
    } catch(err) {
        fn(err);
    }
    
}
exports.sendEmailToUserOnBehalf = async function(data, fn) {
    var url = data.baseUrl + config.emailRALinkList;
    `${data.submittedBy} has submitted risk assessment ${data.project_name} on your behalf. <br> <br> The risk assessment is now with ${data.approvingManagerName} and you will receive additional updates or requests for information via email`
    var firstParagraph = `Thank you for submitting the risk assessment for ${data.project_name}. The risk assessment is now with ${data.approvingManagerName}.`;
    var secondParagraph = `To request further amendments or access the document please contact them or your system administrator.`;
    var html = template.raTemplate.replace('{{name}}', data.authorName );
    html = html.replace('{{firstParagraph}}', firstParagraph);
    html = html.replace('{{secondParagraph}}', secondParagraph);
    html = html.replace('{{urlText}}', 'View Risk Assement');
    html = html.replace('{{url}}', url);
    try {
        const email = await exports.sendEmailNodeMailer(data.toEmail, data.subject, html, data.attachments); // to user
        fn(null, email);
    } catch(err) {
        fn(err);
    }
}
// send email after approved ra
exports.sendEmailToUserAboutApprovedRa = async function (data, fn) {
    var url = data.baseUrl + config.emailRALinkList;
    var firstParagraph = `Your risk assessment "${data.project_name}" has been approved.
     Approving manager ${data.approvingManagerName} provided the additional comment <br> ${data.comment}`;
    var secondParagraph = `Please Review the Risk Assessment, please click the link below.`;
    var html = template.raTemplate.replace('{{name}}', data.authorName );
    html = html.replace('{{firstParagraph}}', firstParagraph);
    html = html.replace('{{secondParagraph}}', secondParagraph);
    html = html.replace('{{urlText}}', 'View Update On RiskPal');
    html = html.replace('{{url}}', url);
    try {
        
        const email = await exports.sendEmailNodeMailer(data.toEmail, data.subject, html, data.attachments); // to user
        console.log('email', email);
        fn(null, email);
    } catch(err) {
        console.log('errro', err);
        fn(err);
    }
    
}


exports.sendEmail = function (email, subject, data = {}, template) {
    var sendResetPasswordLink = transporter.templateSender(
        new EmailTemplate(template), {
            from:  config.username,
        });
    // transporter.template
    return new Promise( (resolve, reject) => {
        sendResetPasswordLink({
            to: email,
            subject: subject
        }, data, function (err, info) {
            if (err) {
                reject(err);
            } else {
                console.log('Link sent\n' + JSON.stringify(info));
                resolve(info);
            }
        });
    });
    
};