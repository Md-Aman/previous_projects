var config = require('../config/jwt_secret.js');
var countryObj = require('./../schema/country.js'); // include country schema file
var countryMatrixObj = require('./../schema/country_matrix'); // include country schema file
var CountryMatrixLogObj = require('./../schema/country_matrix_log');
var url = 'https://itravelsecure.com/webscr/ws_hr.php';
var curl = require('curl');
var xmlJs = require("xml-js")
var sanitizeHtml = require('sanitize-html');
var Promise = require("bluebird");
function saveLogs(obj) {
    // save it to log table
    var CountryMatrixLog = new CountryMatrixLogObj({
        code: obj.code,
        country_id: obj.country_id,
        success: obj.success,
        error: obj.error    
    });
    CountryMatrixLog.save(function (err, data) {
        console.log('data', data);
    });
}
/* @function : getCountryThreatMatrix
 *  @author  : salman 
 *  @created  : 19-11-2018
 *  @modified :
 *  @purpose  : To get country threat matrix using cron job.
 */


function doRequest(country, url, body, options) {
    var Cname = country.code.toLowerCase();
    console.log('country inn', Cname);
    var objHistoryLog = {
        code: Cname,
        country_id: country._id,
    };
    
    return new Promise(function (resolve, reject) {

        curl.post(url, body, options, function(err, response, result) {
            var s = sanitizeHtml(result, {
                allowedTags: ['description', 'security', 'data', 'risk', 'content']
            });
            console.log('ssss', s);
            if (err || s.trim() == 'Your IP is not set up in our system.  Please contact e-Travel.') {
                saveToDb = true;
                objHistoryLog.success = false;
                objHistoryLog.error = s;
                saveLogs(objHistoryLog);
                reject(err);
            }
            try {
                var tr = xmlJs.xml2json(s, {
                    compact: true,
                    spaces: 4
                });
                var finalcountry = JSON.parse(tr);
                var countryData = finalcountry.data.risk.content;
                var find = /\\n/g;
                // save to logs table
                saveLogs(objHistoryLog);
                // save data to db
                countryMatrixObj.findOne({
                    code: Cname
                }, function( err, data) {
                    var security = '';
                    var description = '';
                    try {
                        security = typeof countryData == 'object'? countryData.security._text.replace(new RegExp(find, 'g'), ''): '';
                    } catch ( e ) {
                        security = '';
                    }

                    try {
                        description = typeof countryData == 'object'? countryData.description._text.replace(new RegExp(find, 'g'), ''): '';
                    } catch ( e ) {
                        description = '';
                    }
                   
                    var matched = [
                            'DO NOT TRAVEL', 
                            'RECONSIDER YOUR NEED TO TRAVEL', 
                            'EXERCISE A HIGH DEGREE OF CAUTION', 
                            'BE ALERT TO YOUR OWN SECURITY'
                        ];
                    var descriptionData = '';
                    matched.forEach(function (data) {
                        var index = description.search(data);
                        if (index > 0) {
                            descriptionData = description.slice(0, index);
                            return;
                        }
                    });
                    var obj = {
                        code: Cname,
                        security: security,
                        country_id: country._id,
                        description: descriptionData, 

                    };
                    
                    // check if update or save
                    var countryArr = new countryMatrixObj(obj);
                    if ( data == null || data.code != Cname ) {
                        
                        countryArr.save(function (err, res) {
                            resolve(result);
                        });
                    } else {
                        countryMatrixObj.update({
                            _id: data._id,
                        }, {
                                $set: obj
                            }, function ( err, res) {
                                console.log('ressssss', res);
                                resolve(res);
                            })
                    }
                })
                
            } catch(error) {
                // save to log table
                objHistoryLog.success = false;
                objHistoryLog.error = error;
                saveLogs(objHistoryLog);
                reject(error);
                saveToDb = false;
            }
            
        });
    });
}
exports.getCountryThreatMatrixCron =  function() {
    var saveToDb = false;
        countryObj.find({}, async function(err, countries) {
            if ( err ) {
                saveToDb = true;
            }
            var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/xml'
            }
            var options = {
                headers: headers
            }
            for(const country of countries) {
                var Cname = country.code.toLowerCase();
                var body = `<?xml version="1.0" encoding="UTF-8"?>
                <rec xmlns="http://itravelsecure.com/schema/DestPush.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                   <recInfo>
                      <custID>1039</custID>
                      <country>
                         <CountryCode>` + Cname + `</CountryCode>
                      </country>
                   </recInfo>
                </rec>`;
               
                 // call another function for request
                var res = await doRequest(country, url, body, options)
                    .catch(error => {
                        console.log('error in catch', error);
                    });
                //  console.log('resss', res);
            };
            
           
        });
       
    
}

exports.getCountryThreatMatrixRealTime =  function(countryArray, cb) {
        countryObj.find({_id: countryArray}, async function(err, countries) {
            if ( err ) {
                saveToDb = true;
            }
            var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/xml'
            }
            var options = {
                headers: headers
            }
            var dataReturn = [];
            for(const country of countries) {
                var Cname = country.code.toLowerCase();
                var body = `<?xml version="1.0" encoding="UTF-8"?>
                <rec xmlns="http://itravelsecure.com/schema/DestPush.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                   <recInfo>
                      <custID>1039</custID>
                      <country>
                         <CountryCode>` + Cname + `</CountryCode>
                      </country>
                   </recInfo>
                </rec>`;
               
                 // call another function for request
                var res = await doRequest(country, url, body, options)
                    .then(data => {
                        dataReturn.push(data);
                        console.log('hi', data);
                    })
                    .catch(error => {
                        dataReturn.push({success: false, Cname: Cname, error: error});
                        console.log('error in catch', error);
                    });
                  console.log('resss', res);
            }
            if ( dataReturn.length == countries.length ) {
                cb(null, dataReturn);
            }
            console.log('dataaaaa', dataReturn);
            
           
        });
       
    
}