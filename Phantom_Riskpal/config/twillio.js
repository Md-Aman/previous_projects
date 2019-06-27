var config = require('./config.js');
console.log("asdfsafd",config.TWILIO_FROM_NUMBER);
var twilio = {}
twilio.sendSMS = function sendSMS(data, callback) {

    var fromNo = config.TWILIO_FROM_NUMBER  
    var toNo = data.to;
    var message = data.message;
    var client = require('twilio')(
        config.TWILIO_ACCOUNT_SID,
        config.TWILIO_AUTH_TOKEN
    );
    client.messages.create({ 
         from: fromNo,
         to: toNo,
         body: message
    }, function(err, message) {
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

module.exports = twilio;