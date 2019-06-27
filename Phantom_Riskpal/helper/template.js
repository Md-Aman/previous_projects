
var emailTemplateObj = require('./../schema/EmailTemplates.js'); // to include department file

var header = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]-->
<!--[if !IE]><!-->
<html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml">
<!--<![endif]-->

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title></title>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta name="viewport" content="width=device-width">
  <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
  <style type="text/css">
    .heading {
      color: #087483;
    }
    ._bold {
      font-weight: bold;
    }
    ._block {
      display: block;
    }
    .mg-top-35 {
      margin-top: 35px;
    }
    .mg-btm-20 {
      margin-bottom: 20px;
    }
    p{
      color: #202124;
    }
    p span {
      color: #202124;
    }
  </style>
  <meta name="robots" content="noindex,nofollow"></meta>
  <meta property="og:title" content="Riskpal Notifications"></meta>
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->

<body class="no-padding" style=" width: 100%;padding-top: 40px;padding-bottom:40px;-webkit-text-size-adjust: 100%;background-color:#e5e5e5; margin:0;">
  <div style="border-bottom: 10px solid #087483;background-color:white;padding:35px; width:60%; margin:40px auto;">
    
  <div style="border-bottom: 1px solid #f5f5f5;padding-bottom:20px;text-align: center;">
    <img src="https://s3.eu-west-2.amazonaws.com/riskapl-images/public/logo.png" />
  </div>`;
var footer = `</body></html>`;
var footerLink = `<div class="heading _bold mg-top-35">
<a href="{{url}}" style="color: #087483;text-decoration: none;">{{urlText}}<i style="margin-left:5px;" class="fa fa-external-link"></i></a>
</div>`;
var inlineUrl = `<a href="{{url}}" style="color: #087483;text-decoration: none;">{{urlText}}</a>`
var closingTag = `<div>
  <span class="_block" style="color: #202124;">Thank You,</span>
  
  <span class="_block" style="color: #202124;margin-top: 5px;">RiskPal Team</span></div>`;
var newNotification = `<h4 style="color:#e5e5e5">New Notification</h4>`;

var disclaimer = `<div style="padding: 0 15px;text-align: justify;font-size: 10px;"><p>
<span style="font-weight: bold">DISCLAIMER: </span>
RiskPal Limited is registered in England and Wales under company number 11119665 with 
its registered office at whose registered office is at Salcot Lodge, Worthy Road, Winchester, Hampshire, SO23 7AG.</p>

<p>Any information contained within this email or associated attachments is advisory in nature and any actions taken 
by clients or third parties is their own responsibility. We accept no liability for any loss 
(direct or indirect) or damage suffered as a result of reliance on the information provided save as 
may otherwise be set out in any terms of business or terms of use agreed with our clients.</p>

<p>This email and any attachments are confidential and protected by copyright. If you are not the intended recipient, 
dissemination or copying of this email is prohibited. If you have received this in error, please notify the sender by 
replying by email and then delete the email completely from your system.</p>

<p>Where the content of this email is personal or otherwise unconnected with its or its clients' business, we accept no 
responsibility or liability for such content.</p>

<p>We have taken precautions to minimise the risk of transmitting software viruses, but accept no liability for any loss or 
damage caused by software viruses. Internet email may be susceptible to data corruption, interception and unauthorised 
amendment over which we have no control.</p></div>`;


exports.raTemplate = `${header}
  <div>
  ${newNotification}
    <div>
      <h3 class="heading">Dear {{name}}</h3>
      <p>{{firstParagraph}}</p>
      <p style="color: #202124;>{{secondParagraph}}</p>
      ${closingTag}
    </div>
  </div>
  ${footerLink}
  </div>
${footer}`;

exports.getBodyData = function(type, replacementData) {
  return new Promise((resolve, reject) => {
    emailTemplateObj.findOne({unique_keyword: type}).lean().exec(function (err , data) {
      if ( err || data == null ) {
        return reject(err);
      }
      console.log('data', data);
      const html = data.description;
      
      const subject = data.subject;
      const body = exports.replaceArray(html, replacementData);
      return resolve({error: false, subject, html: exports.attachHtml(body)});
    })
  }).catch(e => console.log('in getbody data', e));
  
}
exports.attachHtml = function(html) {
  return `
  ${header}
    <div>
        <div>
          ${html}
          ${closingTag}
        </div>
      </div>
    </div>
    ${disclaimer}
  ${footer}`;
}
exports.replaceArray = function(html, data) {
  if ( typeof data === 'object') {
    Object.keys(data).map((item, key) => {
      html = html.replace('{{' + item + '}}', data[item]);
    });
    console.log("htmll in", html);
    return html;
  } else {
    
  }
}

