// var config = require('./../config/config.js');
// console.log("asdfsafd",config.TWILIO_FROM_NUMBER);
// var accountSid = 'AC9a603e7bad9862b769917565fa111b92';
// var authToken = 'c6644cac22d8513c1c733975ec6a315a';
// var twilio = {};
// twilio.sendSMS = function sendSMS(data, callback) {
//     var fromNo = "+14243611363"; 
//     var toNo =   data.mobilenumber;
//     var message = data.message;
//     var client = require('twilio')(
//         'AC9a603e7bad9862b769917565fa111b92',
//         'c6644cac22d8513c1c733975ec6a315a'
//     );
//     client.messages.create({ 
//          from: fromNo, 
//          to: toNo,
//          body: message
//     }, function(err, message) {
//         var smsObj = {}  
//         if (err) {
//             smsObj.status = '400';
//             smsObj.message = err;
//             callback(smsObj);  
//         } else {
//             smsObj.status = '200';
//             smsObj.message = message;
//             callback(smsObj);
//         }
//     });
// }

// module.exports = twilio;


var AWS= {};
var AWS = require('aws-sdk');
AWS.sendSMS = function sendSMS(data, callback) {
AWS.config.update({
    accessKeyId: 'AKIAJXV4PEJWAS4ZRCEQ',
    secretAccessKey: '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',
    region: 'eu-west-1'
});
var toNo =   data.mobilenumber;
var message = data.message;
var sns = new AWS.SNS();
var params = {
    Message: 'This is your one-time password' + ' ' + message + '\n' +'\n'+ 'Thank you,' + '\n' + 'Riskpal',
    PhoneNumber: toNo,
    Subject: 'Login Verify',

};

sns.setSMSAttributes({attributes: {DefaultSMSType: "Transactional"}
    }, function (error) {
        if (error) {
            console.log(error);
        } else {
            sns.publish(params, function (err, message) {
                var smsObj = {}  
                if (err) {
                smsObj.status = '400';
                smsObj.message = err;
                callback(smsObj);  
                } else {
                 smsObj.status = '200';
                 smsObj.message = message;
                 callback(smsObj);
                }
            });
        }
    });
}
module.exports = AWS;

