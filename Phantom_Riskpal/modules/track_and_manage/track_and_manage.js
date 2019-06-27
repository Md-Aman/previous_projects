var config = require('../../config/jwt_secret.js'); // config
var userObj = require('./../../schema/users.js'); // include user schema file
var countryObj = require('./../../schema/country.js'); // include country schema file
var raObj = require('./../../schema/news_ra.js'); // include news_ra schema file
var countryRiskObj = require('./../../schema/country_risk.js'); // include country_risk schema file
var approvingManagerObj = require('./../../schema/approving_manager.js'); // include approving_manager schema file
var departmentObj = require('./../../schema/department'); // include department schema file
var situationLogObj = require('./../../schema/situation_log.js'); // include situation_log
var incidentReport = require('./../../schema/incident_report.js'); // include incident_report
var situationReportObj = require('./../../schema/situation_report.js'); // include situation_report.js
var sendEmailObj = require('./../../schema/send_email.js'); // include send email.js
var moment = require('moment');
var _ = require('underscore');
var async = require('async');
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google',

    // Optional depending on the providers 
    httpAdapter: 'https', // Default 
    apiKey: 'AIzaSyAFypHcoiFlsqohYuijy5pxCSihaJWqTRI', // for Mapquest, OpenCage, Google Premier 
    formatter: null // 'gpx', 'string', ... 
};

var geocoder = NodeGeocoder(options);
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, files, callback) {
        callback(null, './riskpal-client/uploads');
    },
    filename: function (req, files, callback) {
        callback(null, Date.now() + '_' + files.originalname);
    }
});
var upload = multer({
    storage: storage
}).any();



/* @function : getAllCountry
 *  @author  : MadhuriK 
 *  @created  : 19-July-17
 *  @modified :
 *  @purpose  : To get country list.
 */
exports.getAllCountry = function (req, res) {
    countryObj.find({}, function (err, countryData) {
        if (err) {
            res.json({
                'error': err,
                'code': config.error,
                'message': 'Something went wrong please try again!'
            });
        } else {
            res.json({
                'code': config.success,
                'data': countryData
            });
        }
    })
}


/* @function : getCurrentTravellerBarData
 *  @author  : MadhuriK 
 *  @created  : 19-July-17
 *  @modified :
 *  @purpose  : To get current travellers to generate bar chart.
 */
exports.getCurrentTravellerBarData = function (req, res) {
    if (req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now()
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                if (raData.startdate) {
                                    if ((currentDate > raData.startdate) && (raData.enddate > currentDate)) {
                                        dataArr.push(raData);
                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countryArr = [];
                            var arr = [];
                            dataArr.forEach(function (raObj) {
                                console.log("raObj", raObj)
                                raObj.country.forEach(function (countryObj) {
                                    if (countryArr.indexOf(countryObj.name) == -1) {
                                        countryArr.push(countryObj.name);
                                    }
                                    arr.push(countryObj.name);
                                })
                            })
                            callback(null, countryArr, arr);
                        },
                        function (countryArr, arr, callback) {
                            console.log(">>>>>>>>", countryArr, arr)
                            console.log("req.user.id", req.user.id)
                            countryRiskObj.find({
                                client_admin_id: req.user.id
                            }, function (err, countryRiskLevel) {
                                if (err) {
                                    callback(err, null, null);
                                } else {
                                    countryObj.find({
                                        name: {
                                            $in: countryArr
                                        }
                                    }, function (err, countryData) {
                                        if (err) {
                                            callback(err, null, null);
                                        } else {
                                            var arrMerge = [];
                                            countryData.forEach(function (countryObj) {
                                                var flag = "";
                                                console.log("countryRiskLevel", countryRiskLevel)
                                                countryRiskLevel.forEach(function (countryRiskLevelObj) {
                                                    console.log("countryRiskLevelObj.name", countryRiskLevelObj.name)
                                                    console.log("countryObj.name", countryObj.name)
                                                    if (countryRiskLevelObj.name == countryObj.name) {
                                                        arrMerge.push(countryRiskLevelObj);
                                                        flag = "if";
                                                    } else if (flag == "") {
                                                        flag = "else";
                                                    }
                                                })

                                                if (flag == "else") {
                                                    arrMerge.push(countryObj);
                                                }

                                            })
                                            var labelArr = ['Red', 'Amber', 'Green']
                                            var countArr = [];
                                            var count = 0,
                                                count1 = 0,
                                                count2 = 0,
                                                count3 = 0;
                                            arr.forEach(function (countryName) {
                                                arrMerge.forEach(function (countryData) {
                                                    if (countryName == countryData.name && countryData.color == "'red'") {
                                                        count++;
                                                    } else if (countryName == countryData.name && countryData.color == "'amber'") {
                                                        count1++;
                                                    } else if (countryName == countryData.name && countryData.color == "'green'") {
                                                        count2++;
                                                    } else if (countryName == countryData.name && countryData.color == undefined) {
                                                        count2++;
                                                    }
                                                })

                                            })
                                            countArr.push(count);
                                            countArr.push(count1);
                                            countArr.push(count2);
                                            if (labelArr.length > 0 && countArr.length > 0) {
                                                callback(null, countArr, labelArr);
                                            }
                                        }
                                    })
                                }
                            })
                        }

                    ], function (err, result, result1) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else if (result && result1) {
                            res.json({
                                'code': config.success,
                                'data': result,
                                'label': result1
                            })
                        }
                    });
                } else {
                    var labelArr = ['Red', 'Amber', 'Green'];
                    var data = [0, 0, 0];
                    res.json({
                        'code': config.success,
                        'data': data,
                        'label': labelArr
                    });
                }
            })
    }
}


/* @function : getCurrentTravellerMapData
 *  @author  : MadhuriK 
 *  @created  : 21-July-17
 *  @modified :
 *  @purpose  : To get current travellers locations to show in map.
 */
exports.getCurrentTravellerMapData = function (req, res) {
    if (req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {

                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                if (raData.startdate) {
                                    if ((currentDate > raData.startdate) && (raData.enddate > currentDate)) {
                                        dataArr.push(raData);
                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countryArr = [];
                            var arr = [];
                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryObj) {
                                    if (countryArr.indexOf(countryObj.name) == -1) {
                                        countryArr.push(countryObj.name);
                                    }
                                    arr.push(countryObj.name);
                                })
                            })
                            callback(null, arr);

                        },
                        function (arr, callback) {
                            if (arr.length > 0) {
                                var locationArr = [];
                                arr.forEach(function (countryName) {
                                    geocoder.geocode(countryName, function (err, res) {
                                        if (res.length > 0) {
                                            locationArr.push({
                                                lat: res[0].latitude,
                                                lng: res[0].longitude
                                            })
                                            if (locationArr.length == arr.length) {
                                                callback(null, locationArr)
                                            }
                                        }
                                    });
                                })
                            } else {
                                callback(null, [])
                            }

                        }
                    ], function (err, result) {
                        res.json({
                            'code': config.success,
                            'data': result
                        })
                    });
                } else {
                    res.json({
                        'code': config.success,
                        'data': ras
                    })
                }
            })
    }
}




/* @function : getFutureTravellerBarData
 *  @author  : MadhuriK 
 *  @created  : 21-July-17
 *  @modified :
 *  @purpose  : To get future travellers to generate bar chart.
 */
exports.getFutureTravellerBarData = function (req, res) {
    if (req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now()

        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                if (raData.startdate) {
                                    if (raData.startdate) {
                                        if (currentDate < raData.startdate) {
                                            dataArr.push(raData);
                                        }
                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countryArr = [];
                            var arr = [];

                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryObj) {
                                    if (countryArr.indexOf(countryObj.name) == -1) {
                                        countryArr.push(countryObj.name);
                                    }
                                    arr.push(countryObj.name);
                                })
                            })
                            callback(null, countryArr, arr);

                        },
                        function (countryArr, arr, callback) {
                            countryRiskObj.find({
                                client_admin_id: req.user.id
                            }, function (err, countryRiskLevel) {
                                if (err) {
                                    callback(err, null, null);
                                } else {
                                    countryObj.find({
                                        name: {
                                            $in: countryArr
                                        }
                                    }, function (err, countryData) {
                                        if (err) {
                                            callback(err, null, null);
                                        } else {
                                            var arrMerge = [];
                                            countryData.forEach(function (countryObj) {
                                                var flag = "";
                                                countryRiskLevel.forEach(function (countryRiskLevelObj) {
                                                    if (countryRiskLevelObj.name == countryObj.name) {
                                                        arrMerge.push(countryRiskLevelObj);
                                                        flag = "if";
                                                    } else if (flag == "") {
                                                        flag = "else";
                                                    }
                                                })

                                                if (flag == "else") {
                                                    arrMerge.push(countryObj);
                                                }

                                            })
                                            var labelArr = ['Red', 'Amber', 'Green']
                                            var countArr = [];
                                            var count = 0,
                                                count1 = 0,
                                                count2 = 0,
                                                count3 = 0;
                                            arr.forEach(function (countryName) {
                                                arrMerge.forEach(function (countryData) {
                                                    if (countryName == countryData.name && countryData.color == "'red'") {
                                                        count++;
                                                    } else if (countryName == countryData.name && countryData.color == "'amber'") {
                                                        count1++;
                                                    } else if (countryName == countryData.name && countryData.color == "'green'") {
                                                        count2++;
                                                    } else if (countryName == countryData.name && (countryData.color == undefined || countryData.color == "")) {
                                                        count2++;
                                                    }
                                                })

                                            })
                                            countArr.push(count);
                                            countArr.push(count1);
                                            countArr.push(count2);
                                            if (labelArr.length > 0 && countArr.length > 0) {
                                                callback(null, countArr, labelArr);
                                            }
                                        }
                                    })
                                }
                            })
                        }

                    ], function (err, result, result1) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else if (result && result1) {
                            res.json({
                                'code': config.success,
                                'data': result,
                                'label': result1
                            })
                        }
                    });
                } else {
                    var labelArr = ['Red', 'Amber', 'Green'];
                    var data = [0, 0, 0];
                    res.json({
                        'code': config.success,
                        'data': data,
                        'label': labelArr
                    });
                }
            })
    }

}


/* @function : getFutureTravellerMapData
 *  @author  : MadhuriK 
 *  @created  : 21-July-17
 *  @modified :
 *  @purpose  : To get future travellers to generate bar chart.
 */
exports.getFutureTravellerMapData = function (req, res) {
    if (req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {

                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                if (raData.startdate) {
                                    if (currentDate < raData.startdate) {
                                        dataArr.push(raData);
                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countryArr = [];
                            var arr = [];

                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryObj) {
                                    if (countryArr.indexOf(countryObj.name) == -1) {
                                        countryArr.push(countryObj.name);
                                    }
                                    arr.push(countryObj.name);
                                })
                            })
                            callback(null, arr);

                        },
                        function (arr, callback) {
                            if (arr.length > 0) {
                                var locationArr = [];
                                arr.forEach(function (countryName) {
                                    geocoder.geocode(countryName, function (err, res) {
                                        locationArr.push({
                                            lat: res[0].latitude,
                                            lng: res[0].longitude
                                        })
                                        if (locationArr.length == arr.length) {
                                            callback(null, locationArr)
                                        }
                                    });
                                })
                            } else {
                                callback(null, []);
                            }

                        }
                    ], function (err, result) {
                        res.json({
                            'code': config.success,
                            'data': result
                        })
                    });
                } else {
                    res.json({
                        'code': config.success,
                        'data': ras
                    })
                }
            })
    }
}


/* @function : getSelectedCountryTraveller
 *  @author  : MadhuriK 
 *  @created  : 21-July-17
 *  @modified :
 *  @purpose  : To get all current travellers of selected country.
 */
exports.getSelectedCountryTraveller = function (req, res) {
    if (req.body && req.user.id) {
        // var currentDate = moment().utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                if (raData.startdate) {
                                    if ((currentDate >= raData.startdate) && (raData.enddate > currentDate)) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countrySpecificRaData = [];
                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryData) {
                                    if (req.body.country_name == countryData.name) {
                                        countrySpecificRaData.push(raObj);
                                    }
                                })
                            })
                            callback(null, countrySpecificRaData);
                        }
                    ], function (err, result) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'data': result
                            })
                        }
                    });

                } else {
                    res.json({
                        'code': config.success,
                        'data': []
                    });
                }
            })
    }
}


/* @function : getSelectedCountryTraveller
 *  @author  : MadhuriK 
 *  @created  : 21-July-17
 *  @modified :
 *  @purpose  : To get all current travellers of selected country.
 */
exports.sendMailToAllTraveller = function (req, res) {
    if (req.body) {
        var smtpTransport = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.username,
                pass: config.password
            }
        });
        var mailOptions = {
            from: 'noreply.riskpal@gmail.com',
            to: req.body.email,
            subject: req.body.subject,
            html: req.body.content // html body
        };
        smtpTransport.sendMail(mailOptions, function (err) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err
                });
            } else {
                var sendMail = new sendEmailObj(req.body);
                sendMail.client_admin_id = req.user.id;
                sendMail.to = req.body.email;
                sendMail.from = 'noreply.riskpal@gmail.com';
                sendMail.save(function (err) {
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': err
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Send mail to all travellers successfully'
                        });
                    }
                })
            }
        });
    }
}



/* @function : getSelectedCountryFutureTraveller
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To get all future travellers of selected country.
 */
exports.getSelectedCountryFutureTraveller = function (req, res) {
    if (req.body && req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                // if (raData.itinearyArr) {
                                //     var i = 0;
                                //     raData.itinearyArr.forEach(function(itineary_obj) {
                                //         if (currentDate < itineary_obj.itineary.startDate && i == 0) {
                                //             dataArr.push(raData);
                                //             i++;
                                //         }

                                //     })
                                // }
                                if (raData.startdate) {
                                    if (currentDate < raData.startdate) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countrySpecificRaData = [];
                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryData) {
                                    if (req.body.country_name == countryData.name) {
                                        countrySpecificRaData.push(raObj);
                                    }
                                })
                            })
                            callback(null, countrySpecificRaData);
                        }
                    ], function (err, result) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'data': result
                            })
                        }
                    });

                } else {
                    res.json({
                        'code': config.success,
                        'data': []
                    });
                }
            })
    }
}



/* @function : getSelectedCountryallTraveller
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To get all travellers of selected country.
 */
exports.getSelectedCountryallTraveller = function (req, res) {
    if (req.body && req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                // if (raData.itinearyArr) {
                                //     var i = 0;
                                //     raData.itinearyArr.forEach(function(itineary_obj) {
                                //         if (itineary_obj.itineary.endDate > currentDate && i == 0) {
                                //             dataArr.push(raData);
                                //             i++;
                                //         }

                                //     })
                                // }
                                if (raData.startdate) {
                                    if (raData.enddate > currentDate) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countrySpecificRaData = [];
                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryData) {
                                    if (req.body.country_name == countryData.name) {
                                        countrySpecificRaData.push(raObj);
                                    }
                                })
                            })
                            callback(null, countrySpecificRaData);
                        }
                    ], function (err, result) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'data': result
                            })
                        }
                    });

                } else {
                    res.json({
                        'code': config.success,
                        'data': []
                    });
                }
            })
    }
}



/* @function : getAllTravellerList
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To get all traveller list.
 */
exports.getAllTravellerList = function (req, res) {
    if (req.user.id) {
        userObj.find({
            admin: false,
            client_admin_id: req.user.id,
            is_deleted: false,
            status: "Active"
        }, function (err, travellerArr) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': travellerArr
                });
            }
        })
    }
}


/* @function : getRiskAssessmentList
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To get all risk assessment list.
 */
exports.getRiskAssessmentList = function (req, res) {
    if (req.user.id) {
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('types_of_ra_id')
            .exec(function (err, ras) {
                console.log("ras", ras.length)
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                    ], function (err, result) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'data': result
                            })
                        }
                    });
                }
            })
    }
}



/* @function : getManagers
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To get all managers list.
 */
exports.getManagers = function (req, res) {
    if (req.user.id) {
        approvingManagerObj.find({
            client_admin_id: req.user.id,
            status: "Active",
            is_deleted: false
        }, function (err, approvingManager) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': approvingManager
                })
            }
        })
    }
}


/* @function : createSituationLog
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To save Situation log.
 */
exports.createSituationLog = function (req, res) {
    if (req.body && req.user.id) {
        req.body.client_super_admin = req.user.id;
        var situation_log = new situationLogObj(req.body);
        situation_log.save(function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                raObj.update({
                    _id: {
                        $in: req.body.situationlog
                    }
                }, {
                    $push: {
                        situationlog_report: result._id
                    }
                }, {
                    multi: true
                }, function (err) {
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': err
                        });

                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Situation report created successfully'
                        });
                    }
                })
            }
        })
    }
}

/* @function : getAllSituationLog
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To get all Situation log.
 */
exports.getAllSituationLog = function (req, res) {
    if (req.user.id) {
        var limit = req.body.count ? req.body.count : 10;
        var sortby = req.body.sortby ? req.body.sortby : {
            order: "asc"
        };
        var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
        var query = {
            is_deleted: false,
            status: "Active",
            client_super_admin: req.user.id
        }

        if (req.body.keyword)
            query.log_name = {
                $regex: req.body.keyword,
                $options: "$i"
            };

        situationLogObj.find(query)
            .sort(sortby)
            .limit(limit)
            .skip(skip)
            .populate('traveller')
            .populate('riskAssessment')
            .populate('manager')
            .exec(function (err, data) {
                if (data) {
                    situationLogObj.count(query, function (err, count) {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': count
                        });
                    })
                } else {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                }
            });
    }
}


/* @function : getAllSituationLog
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To get all Situation log.
 */
exports.getDepartment = function (req, res) {
    if (req.user.id) {
        departmentObj.find({
            client_admin_id: req.user.id,
            is_deleted: false,
            status: "Active"
        }, function (err, departmentArr) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': departmentArr
                })
            }
        })
    }
}




/* @function : createIncidentReport
 *  @author  : MadhuriK 
 *  @created  : 12-Aug-17
 *  @modified :
 *  @purpose  : To get all Situation log.
 */
exports.createIncidentReport = function (req, res) {
    if (req.body && req.user.id) {
        req.body.client_super_admin = req.user.id;
        var incident_report = new incidentReport(req.body);
        incident_report.save(function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                raObj.update({
                    _id: {
                        $in: req.body.incident
                    }
                }, {
                    $push: {
                        incident_report: result._id
                    }
                }, {
                    multi: true
                }, function (err) {
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': err
                        });

                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Situation report created successfully'
                        });
                    }
                })
            }
        })
    }
}

/* @function : getAllIncidentReport
 *  @author  : MadhuriK 
 *  @created  : 16-Aug-17
 *  @modified :
 *  @purpose  : To get all Incident report.
 */
exports.getAllIncidentReport = function (req, res) {
    if (req.user.id) {
        var limit = req.body.count ? req.body.count : 10;
        var sortby = req.body.sortby ? req.body.sortby : {
            order: "asc"
        };
        var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
        var query = {
            is_deleted: false,
            status: "Active",
            client_super_admin: req.user.id
        }

        if (req.body.keyword)
            query['$or'] = [{
                    incident_type: {
                        $regex: req.body.keyword,
                        $options: "$i"
                    }
                },
                {
                    label: {
                        $regex: req.body.keyword,
                        $options: "$i"
                    }
                },
                {
                    country: {
                        $regex: req.body.keyword,
                        $options: "$i"
                    }
                }
            ]

        incidentReport.find(query)
            .sort(sortby)
            .limit(limit)
            .skip(skip)
            .populate('traveller')
            .populate('department')
            .populate('manager')
            .exec(function (err, data) {
                if (data) {
                    incidentReport.count(query, function (err, count) {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': count
                        });
                    })
                } else {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                }
            });
    }
}



/* @function : createSituationReport
 *  @author  : MadhuriK 
 *  @created  : 16-Aug-17
 *  @modified :
 *  @purpose  : To create situation report.
 */
// exports.createSituationReport = function (req, res) {
//     console.log("req.body",req.body)
//     if (req.body && req.user.id) {
//         req.body.client_super_admin = req.user.id;
//         var situation_report = new situationReportObj(req.body);
//         situation_report.save(function (err) {
//             if (err) {
//                 res.json({
//                     'error': err,
//                     'code': config.error,
//                     'message': 'Something went wrong please try again!'
//                 });
//             } else {
//                 res.json({
//                     'code': config.success,
//                     'message': 'Situation report created successfully'
//                 })
//             }
//         })
//     }
// }

exports.createSituationReport = function (req, res) {
    console.log("req.body", req.body)
    if (req.body && req.user.id) {
        console.log("req.body.riskAssessment", req.body.newsra)
        req.body.client_super_admin = req.user.id;
        var situation_report = new situationReportObj(req.body);
        situation_report.save(function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                raObj.update({
                    _id: {
                        $in: req.body.newsra
                    }
                }, {
                    $push: {
                        situation_report: result._id
                    }
                }, {
                    multi: true
                }, function (err) {
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': err
                        });

                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Situation report created successfully'
                        });
                    }
                })
            }
        })
    }
}

/* @function : getAllSituationReport
 *  @author  : MadhuriK 
 *  @created  : 16-Aug-17
 *  @modified :
 *  @purpose  : To get all situation report.
 */
exports.getAllSituationReport = function (req, res) {
    if (req.user.id) {
        var limit = req.body.count ? req.body.count : 10;
        var sortby = req.body.sortby ? req.body.sortby : {
            order: "asc"
        };
        var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
        var query = {
            is_deleted: false,
            status: "Active",
            client_super_admin: req.user.id
        }

        if (req.body.keyword)
            query['$or'] = [{
                    report_name: {
                        $regex: req.body.keyword,
                        $options: "$i"
                    }
                },
                {
                    tags: {
                        $regex: req.body.keyword,
                        $options: "$i"
                    }
                },
                {
                    country: {
                        $regex: req.body.keyword,
                        $options: "$i"
                    }
                }
            ]

        situationReportObj.find(query)
            .sort(sortby)
            .limit(limit)
            .skip(skip)
            .populate('traveller')
            .populate('riskAssessment')
            .populate('manager')
            .exec(function (err, data) {
                if (data) {
                    situationReportObj.count(query, function (err, count) {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': count
                        });
                    })
                } else {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                }
            });
    }
}


/* @function : attachment_supporting_docs
 *  @author  : MadhuriK 
 *  @created  : 16-Aug-17
 *  @modified :
 *  @purpose  : To upload multiple supporting docs with situation report.
 */
exports.attachment_supporting_docs = function (req, res) {
    pathArr = [];
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else if (req.files !== undefined) {
            req.files.forEach(function (file) {
                var filePath = file.path.split("/");
                var dbPath = '/' + filePath[1] + '/' + filePath[2];
                pathArr.push(dbPath);
            })
            res.json({
                status: "Sucess",
                data: pathArr
            });
        } else {
            return res.end("Error uploading file.");
        }
    });
}




/* @function : getSelectedCountryCurrentTraveller
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  : To get current travellers of a country.
 */
function getSelectedCountryCurrentTraveller(req, fn) {
    if (req.body && req.user.id) {
        // var currentDate = moment().utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    fn(err, []);
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                // if (raData.itinearyArr) {
                                //     var i = 0;
                                //     raData.itinearyArr.forEach(function(itineary_obj) {
                                //         if (currentDate >= itineary_obj.itineary.startDate && i == 0 && itineary_obj.itineary.endDate > currentDate) {
                                //             dataArr.push(raData);
                                //             i++;
                                //         }

                                //     })
                                // }
                                if (raData.startdate) {
                                    if ((currentDate >= raData.startdate) && (raData.enddate > currentDate)) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countrySpecificRaData = [];
                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryData) {
                                    if (req.body.country_name == countryData.name) {
                                        countrySpecificRaData.push(raObj);
                                    }
                                })
                            })
                            callback(null, countrySpecificRaData);
                        }
                    ], function (err, result) {
                        if (err) {
                            fn(err, []);
                        } else {
                            fn("", result);
                        }
                    });

                } else {
                    fn("", []);
                }
            })
    }
}


/* @function : getSelectedCountryFutureTraveller
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  : To get future travellers of a country.
 */
function getSelectedCountryFutureTraveller(req, fn) {
    if (req.body && req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    fn(err, []);
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                // if (raData.itinearyArr) {
                                //     var i = 0;
                                //     raData.itinearyArr.forEach(function(itineary_obj) {
                                //         if (currentDate < itineary_obj.itineary.startDate && i == 0) {
                                //             dataArr.push(raData);
                                //             i++;
                                //         }

                                //     })
                                // }
                                if (raData.startdate) {
                                    if (currentDate < raData.startdate) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countrySpecificRaData = [];
                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryData) {
                                    if (req.body.country_name == countryData.name) {
                                        countrySpecificRaData.push(raObj);
                                    }
                                })
                            })
                            callback(null, countrySpecificRaData);
                        }
                    ], function (err, result) {
                        if (err) {
                            fn(err, []);
                        } else {
                            fn(null, result);
                        }
                    });

                } else {
                    fn(null, result);
                }
            })
    }
}


/* @function : getSelectedCountryallTraveller
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  : To get all travellers of a country.
 */
function getSelectedCountryallTraveller(req, fn) {
    if (req.body && req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    fn(err, []);
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                // if (raData.itinearyArr) {
                                //     var i = 0;
                                //     raData.itinearyArr.forEach(function(itineary_obj) {
                                //         if (itineary_obj.itineary.endDate > currentDate && i == 0) {
                                //             dataArr.push(raData);
                                //             i++;
                                //         }

                                //     })
                                // }
                                if (raData.startdate) {
                                    if (raData.enddate > currentDate) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var countrySpecificRaData = [];
                            dataArr.forEach(function (raObj) {
                                raObj.country.forEach(function (countryData) {
                                    if (req.body.country_name == countryData.name) {
                                        countrySpecificRaData.push(raObj);
                                    }
                                })
                            })
                            callback(null, countrySpecificRaData);
                        }
                    ], function (err, result) {
                        if (err) {
                            fn(err, []);
                        } else {
                            fn(null, result);
                        }
                    });

                } else {
                    fn(null, []);
                }
            })
    }
}



/* @function : getCurrentTravellerAllCountry
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  : To get current traveller of all countries
 */
function getCurrentTravellerAllCountry(req, fn) {
    if (req.body && req.user.id) {
        // var currentDate = moment().utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    fn(err, []);
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                // if (raData.itinearyArr) {
                                //     var i = 0;
                                //     raData.itinearyArr.forEach(function(itineary_obj) {
                                //         if (currentDate >= itineary_obj.itineary.startDate && i == 0 && itineary_obj.itineary.endDate > currentDate) {
                                //             dataArr.push(raData);
                                //             i++;
                                //         }

                                //     })
                                // }
                                if (raData.startdate) {
                                    if ((currentDate >= raData.startdate) && (raData.enddate > currentDate)) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        }
                    ], function (err, result) {
                        if (err) {
                            fn(err, []);
                        } else {
                            fn(null, result);
                        }
                    });

                } else {
                    fn(null, []);
                }
            })
    }
}



/* @function : getFutureTravellerAllCountry
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  : To get future traveller of all countries
 */
function getFutureTravellerAllCountry(req, fn) {
    if (req.body && req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    fn(err, []);
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                if (raData.startdate) {
                                    if (currentDate < raData.startdate) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        }
                    ], function (err, result) {
                        if (err) {
                            fn(err, []);
                        } else {
                            fn(null, result);
                        }
                    });

                } else {
                    fn(null, []);
                }
            })
    }
}



/* @function : getAllTravellerAllCountry
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  : To get all traveller of all countries
 */
function getAllTravellerAllCountry(req, fn) {
    if (req.body && req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    fn(err, []);
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                // if (raData.itinearyArr) {
                                //     var i = 0;
                                //     raData.itinearyArr.forEach(function(itineary_obj) {
                                //         if (itineary_obj.itineary.endDate > currentDate && i == 0) {
                                //             dataArr.push(raData);
                                //             i++;
                                //         }

                                //     })
                                // }
                                if (raData.startdate) {
                                    if (raData.enddate > currentDate) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        }
                    ], function (err, result) {
                        if (err) {
                            fn(err, []);
                        } else {
                            fn(null, result);
                        }
                    });

                } else {
                    fn(null, result);
                }
            })
    }
}


/* @function : getCountryTraveller
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  : To get traveller (current, future, all)
 */
exports.getCountryTraveller = function (req, res) {
    if (req.body.email_traveller == 'future' && req.body.country_name == 'all_countries') {
        getFutureTravellerAllCountry(req, function (err, data) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': data
                })
            }
        })

    } else if (req.body.email_traveller == 'all' && req.body.country_name == 'all_countries') {
        getAllTravellerAllCountry(req, function (err, data) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': data
                })
            }
        })

    } else if (req.body.email_traveller == 'current' && req.body.country_name == 'all_countries') {
        getCurrentTravellerAllCountry(req, function (err, data) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': data
                })
            }
        })
    } else if (req.body.email_traveller == 'current') {
        getSelectedCountryCurrentTraveller(req, function (err, data) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': data
                })
            }

        });
    } else if (req.body.email_traveller == 'future') {
        getSelectedCountryFutureTraveller(req, function (err, data) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': data
                })
            }
        })

    } else if (req.body.email_traveller == 'all') {
        getSelectedCountryallTraveller(req, function (err, data) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': data
                })
            }
        })
    }
}



/* @function : getAllCountryAllTraveller
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  : To get all travellers of all countries
 */
exports.getAllCountryAllTraveller = function (req, res) {
    if (req.body && req.user.id) {
        // var currentDate = moment.utc().format('YYYY-MM-DD');
        var currentDate = Date.now();
        raObj.find({
                is_deleted: false
            })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras.length > 0) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.client_admin_id == req.user.id;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var dataArr = [];
                            raArr.forEach(function (raData) {
                                // if (raData.itinearyArr) {
                                //     var i = 0;
                                //     raData.itinearyArr.forEach(function(itineary_obj) {
                                //         if (itineary_obj.itineary.endDate > currentDate && i == 0) {
                                //             dataArr.push(raData);
                                //             i++;
                                //         }

                                //     })
                                // }
                                if (raData.startdate) {
                                    if (raData.enddate > currentDate) {
                                        dataArr.push(raData);

                                    }
                                }
                            })
                            callback(null, dataArr);
                        }
                    ], function (err, result) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'data': result
                            })
                        }
                    });

                } else {
                    res.json({
                        'code': config.success,
                        'data': []
                    });
                }
            })
    }
}


/* @function : getAllCountryAllTraveller
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get ra details
 */
exports.getRiskAssessmentDetails = function (req, res) {
    if (req.params.ra_id) {
        raObj.findOne({
                _id: req.params.ra_id,
                is_deleted: false
            })
            .populate('types_of_ra_id')
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .exec(function (err, raData) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else {
                    res.json({
                        'code': config.success,
                        'data': raData
                    })
                }
            })
    }
}


/* @function : getAllSentMail
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get all sent mails
 */
exports.getAllSentMail = function (req, res) {
    if (req.body && req.user.id) {
        var limit = req.body.count ? req.body.count : 10;
        var sortby = req.body.sortby ? req.body.sortby : {
            order: "asc"
        };
        var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
        var query = {
            is_deleted: false,
            client_admin_id: req.user.id
        }

        // if (req.body.keyword)
        //     query['$or'] = [{ incident_type: { $regex: req.body.keyword, $options: "$i" } },
        //     { label: { $regex: req.body.keyword, $options: "$i" } },
        //     { country: { $regex: req.body.keyword, $options: "$i" } }]

        sendEmailObj.find(query)
            .sort(sortby)
            .limit(limit)
            .skip(skip)
            .exec(function (err, data) {
                if (data) {
                    sendEmailObj.count(query, function (err, count) {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': count
                        });
                    })
                } else {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                }
            });
    }
}



/* @function : getEmailDetails
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get mail details
 */
exports.getEmailDetails = function (req, res) {
    if (req.user.id && req.params.mail_id) {
        sendEmailObj.findOne({
            _id: req.params.mail_id,
            client_admin_id: req.user.id
        }, function (err, emailData) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': emailData
                })
            }
        })
    }
}