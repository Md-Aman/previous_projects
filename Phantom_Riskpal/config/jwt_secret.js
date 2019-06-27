module.exports = {
    'secret': 'riskPal@123$###',
    'error': 400,
    'serverError': 500,
    'forbidden': 401,
    'success': 200,
    'methodNotAllowed': 405,
    'notFound': 404,
    'notAcceptable': 406,
    "service": "Gmail",
    "host": "smtp.gmail.com",
    // "username": "noreplyriskpal@hpriskmanagement.com",
    "username": "no-reply@riskpal.co.uk",
    "password": "SouqBoxDev@2018",
    "security": "TLS",
    "port": 587,
    "icon_png_attachment": 'https://s3.eu-west-2.amazonaws.com/riskapl-images/public/icon-png-attachment.svg',
    "icon_pdf_attachment": 'https://s3.eu-west-2.amazonaws.com/riskapl-images/public/icon-pdf-attachment.svg',
    // "baseUrl": "http://0.0.0.0:3000/",
    "baseUrl": "http://dev.riskpal.co.uk/",
    randomToken: randomToken,
    'emailRALinkPending': '/secure/ra/pending',
    'emailRALinkList': '/secure/ra',
    'emailTemplate': {
        'urlText': 'here',
        'resetPassword': 'en2',
        'newRiskPalAccount': 'en1',
        'approvingManager': 'en3',
        'approvingManagerResubmitted': 'en7',
        'traveller': 'en4',
        'otherTraveller': 'en5',
        'behalfOfOtherTraveller': 'en15',
        'travellerResubmitted': 'en16',
        'forwardToOtherApprovingManager': 'en11',
        'confirmationToForwardToOtherApprovingManager': 'en12',
        'forwardChangeForTraveller': 'en13',
        'approvedByManager': 'en8',
        'toOtherTravellerAfterApproved': 'en9',
        'shareRAWithTravellerAuthor': 'en14',
        'approvedShareRAWithApprovingManager': 'en18',
        'requestForMoreInfo': 'en6',
        'earlierManagerNotification': 'en10',
        'behalfOfOtherTravellerAuthorCheck1': 'en17',
        'emgInfoApprover': 'en19',
        'emgInfoApproved': 'en20',
        'emgInfoRejected': 'en21',
        'emgInfoTraveller': 'en22'
    },
    'generalErrorMessage': 'Something went wrong. Please try again later.',
    accessEmergencyInfo: {
        expireTime: 72,
        approvingManagerExpireTime: 24
    }
};

/*
 * return random number between max min
 */ 
function randomToken(length) {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}
