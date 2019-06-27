var config = require('../../config/jwt_secret.js'); // config 
var countryObj = require('./../../schema/country.js'); // include country schema file
var userObj = require('./../../schema/users.js'); // include user schema file
var typeOfRaObj = require('./../../schema/type_of_ra.js'); // include user schema file
var RaObj = require('./../../schema/news_ra.js'); // include news_ra schema file
var supplierObj = require('./../../schema/supplier.js'); // include supplier schema file
var countryRiskObj = require('./../../schema/country_risk.js'); // include country_risk schema file
var departmentObj = require('./../../schema/department.js'); // include department schema file
var _ = require('underscore'); // include underscore
var async = require('async');
var mongoose = require('mongoose');
var json2csv = require('json2csv');
var fs = require('fs');



/* @function : getTripsByDate
 *  @author  : MadhuriK 
 *  @created  : 23-Jun-17
 *  @modified :
 *  @purpose  : To get numbers of trip by year.
 */
exports.getTripsByDate = function (req, res) {
    if (req.user.id) {
        RaObj.find({
                is_deleted: false,
                is_approve: true
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.companyId == req.user.companyID;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var yearArr = [];
                            raArr.forEach(function (ra) {
                                if (yearArr.indexOf(ra.createdAt.getFullYear()) == -1) {
                                    yearArr.push(ra.createdAt.getFullYear());
                                }
                            })
                            callback(null, yearArr, raArr);
                        },
                        function (yearArr, raArr, callback) {
                            var countArr = [];
                            yearArr.forEach(function (year) {
                                var count = 0;
                                raArr.forEach(function (ra) {

                                    if (ra.createdAt.getFullYear() == year) {
                                        count++;
                                    }
                                })
                                countArr.push(count);
                            })
                            callback(null, yearArr, countArr);
                        }
                    ], function (err, result, result1) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'data': result1,
                                'label': result
                            })
                        }
                    });

                }
            })
    }

}



/* @function : getTripsByMonth
 *  @author  : MadhuriK 
 *  @created  : 23-Jun-17
 *  @modified :
 *  @purpose  : To get numbers of trip by month.
 */
exports.getTripsByMonth = function (req, res) {
    if (req.user.id) {
        RaObj.find({
                is_deleted: false,
                is_approve: true
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras) {
                    var currentDate = new Date();
                    var currentYear = currentDate.getFullYear();
                    var monthNames = [
                        "January", "February", "March",
                        "April", "May", "June",
                        "July", "August", "September",
                        "October", "November", "December"
                    ];
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return (raObj.traveller_id.companyId == req.user.companyID && raObj.createdAt.getFullYear() == currentYear);
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var monthArr = [];
                            raArr.forEach(function (ra) {
                                if (monthArr.indexOf(monthNames[ra.createdAt.getMonth()]) == -1) {
                                    monthArr.push(monthNames[ra.createdAt.getMonth()]);
                                }
                            })
                            callback(null, monthArr, raArr);
                        },
                        function (monthArr, raArr, callback) {
                            var countArr = [];
                            monthArr.forEach(function (month) {
                                var count = 0;
                                raArr.forEach(function (ra) {

                                    if (monthNames[ra.createdAt.getMonth()] == month) {
                                        count++;
                                    }
                                })
                                countArr.push(count);
                            })
                            callback(null, monthArr, countArr);
                        }
                    ], function (err, result, result1) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'data': result1,
                                'label': result
                            })
                        }
                    });
                }
            })
    }

}




/* @function : getWeeklyTrips
 *  @author  : MadhuriK 
 *  @created  : 26-Jun-17
 *  @modified :
 *  @purpose  : To get numbers of trip by week.
 */
exports.getWeeklyTrips = function (req, res) {
    if (req.user.id) {
        RaObj.find({
                is_deleted: false,
                is_approve: true
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras) {
                    var currentDate = new Date();
                    var currentMonth = currentDate.getMonth();
                    async.waterfall([
                            function (callback) {
                                var raArr = _.filter(ras, function (raObj) {
                                    if (raObj.traveller_id) {
                                        return (raObj.traveller_id.companyId == req.user.companyID && raObj.createdAt.getMonth() == currentMonth);
                                    }
                                });
                                callback(null, raArr);
                            },
                            function (raArr, callback) {
                                var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth());
                                var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                                var firstWeekFirstDay = firstDay.getDate();
                                var firstWeekLastDay = firstDay.getDate() + 6;

                                var secondWeekFirstDay = firstWeekLastDay + 1;
                                var secondWeekLastDay = firstWeekLastDay + 7;

                                var thirdWeekFirstDay = secondWeekLastDay + 1;
                                var thirdWeekLastDay = secondWeekLastDay + 7;

                                var fourthWeekFirstDay = thirdWeekLastDay + 1;
                                var fourthWeekLastDay = thirdWeekLastDay + 7;

                                var weekArr = ['first week', 'second week', 'third week', 'fourth week'];


                                var countArr = [];
                                var count1 = 0,
                                    count2 = 0,
                                    count3 = 0,
                                    count4 = 0;

                                raArr.forEach(function (ra) {
                                    if (ra.createdAt.getDate() >= firstWeekFirstDay && ra.createdAt.getDate() <= firstWeekLastDay) {
                                        count1++;
                                    } else if (ra.createdAt.getDate() >= secondWeekFirstDay && ra.createdAt.getDate() <= secondWeekLastDay) {
                                        count2++;
                                    } else if (ra.createdAt.getDate() >= thirdWeekFirstDay && ra.createdAt.getDate() <= thirdWeekLastDay) {
                                        count3++;
                                    } else if (ra.createdAt.getDate() >= fourthWeekFirstDay && ra.createdAt.getDate() <= fourthWeekLastDay || ra.createdAt.getDate() <= lastDay.getDate()) {
                                        count4++;
                                    }
                                })

                                countArr.push(count1);
                                countArr.push(count2);
                                countArr.push(count3);
                                countArr.push(count4);
                                callback(null, weekArr, countArr);
                            },
                        ],
                        function (err, weekArr, countArr) {
                            if (err) {
                                res.json({
                                    'error': err,
                                    'code': config.error,
                                    'message': 'Something went wrong please try again!'
                                });
                            } else {
                                res.json({
                                    'code': config.success,
                                    'data': countArr,
                                    'label': weekArr
                                })
                            }
                        });

                }
            })
    }
}




/* @function : getTodaysTrips
 *  @author  : MadhuriK 
 *  @created  : 26-Jun-17
 *  @modified :
 *  @purpose  : To get numbers of trip for today.
 */
exports.getTodaysTrips = function (req, res) {
    if (req.user.id) {
        RaObj.find({
                is_deleted: false,
                is_approve: true
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras) {
                    var currentDate = new Date();
                    var labelArr = ['today']
                    var raArr = _.filter(ras, function (raObj) {
                        if (raObj.traveller_id) {
                            return (raObj.traveller_id.companyId == req.user.companyID &&
                                raObj.createdAt.getDate() == currentDate.getDate() && raObj.createdAt.getMonth() == currentDate.getMonth() &&
                                raObj.createdAt.getFullYear() == currentDate.getFullYear()
                            );
                        }
                    });
                    var countArr = [];
                    countArr.push(raArr.length);

                    if (raArr) {
                        res.json({
                            'code': config.success,
                            'data': countArr,
                            'label': labelArr
                        })
                    } else {
                        res.json({
                            'error': err,
                            'code': config.error,
                            'message': 'Something went wrong please try again!'
                        });
                    }

                }
            })
    }
}




/* @function : getSupplierByCountries
 *  @author  : MadhuriK 
 *  @created  : 26-Jun-17
 *  @modified :
 *  @purpose  : To get numbers of suppliers according to countries.
 */
exports.getSupplierByCountries = function (req, res) {
    if (req.user.id) {
        supplierObj.aggregate([{
                $match: {
                    companyId: mongoose.Types.ObjectId(req.user.companyID),
                    is_deleted: false,
                    status: 'Active'

                }
            },
            {
                $group: {
                    _id: '$country',
                    count: {
                        $sum: 1
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else if (result) {
                var supplierCountArr = [];
                var costArr = [];
                result.forEach(function (data) {
                    supplierCountArr.push(data.count);
                    costArr.push(data._id);
                })

                if (supplierCountArr.length > 0 && costArr.length > 0) {
                    res.json({
                        'code': config.success,
                        'data': supplierCountArr,
                        'label': costArr
                    })
                } else {
                    res.json({
                        'code': config.success,
                        'data': supplierCountArr,
                        'label': costArr
                    })
                }

            }

        })
    }
}



/* @function : getSupplierByCost
 *  @author  : MadhuriK 
 *  @created  : 26-Jun-17
 *  @modified :
 *  @purpose  : To get numbers of suppliers according to countries.
 */
exports.getSupplierByCost = function (req, res) {
    if (req.user.id) {
        supplierObj.aggregate([{
                $match: {
                    companyId: mongoose.Types.ObjectId(req.user.companyID),
                    is_deleted: false,
                    status: 'Active'

                }
            },
            {
                $group: {
                    _id: '$cost',
                    count: {
                        $sum: 1
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else if (result) {
                var supplierCountArr = [];
                var countryArr = [];
                result.forEach(function (data) {
                    supplierCountArr.push(data.count);
                    countryArr.push(data._id);
                })

                if (supplierCountArr.length > 0 && countryArr.length > 0) {
                    res.json({
                        'code': config.success,
                        'data': supplierCountArr,
                        'label': countryArr
                    })
                } else {
                    res.json({
                        'code': config.success,
                        'data': supplierCountArr,
                        'label': countryArr
                    })
                }

            }

        })
    }
}


/* @function : getSupplierByRating
 *  @author  : MadhuriK 
 *  @created  : 27-Jun-17
 *  @modified :
 *  @purpose  : To get numbers of suppliers according to ratings.
 */
exports.getSupplierByRating = function (req, res) {
    if (req.user.id) {
        supplierObj.aggregate([{
                $match: {
                    companyId: mongoose.Types.ObjectId(req.user.companyID),
                    is_deleted: false,
                    status: 'Active'

                }
            },
            {
                $group: {
                    _id: '$rate',
                    count: {
                        $sum: 1
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else if (result) {
                var supplierCountArr = [];
                var countryArr = [];
                result.forEach(function (data) {
                    supplierCountArr.push(data.count);
                    countryArr.push(data._id);
                })

                if (supplierCountArr.length > 0 && countryArr.length > 0) {
                    res.json({
                        'code': config.success,
                        'data': supplierCountArr,
                        'label': countryArr
                    })
                } else {
                    res.json({
                        'code': config.success,
                        'data': supplierCountArr,
                        'label': countryArr
                    })
                }

            }

        })
    }
}


/* @function : getTripsByCountry
 *  @author  : MadhuriK 
 *  @created  : 28-Jun-17
 *  @modified :
 *  @purpose  : To get numbers trips by country.
 */
exports.getTripsByCountry = function (req, res) {
    if (req.user.id) {
        RaObj.find({
                is_deleted: false,
                is_approve: true
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras) {
                    async.waterfall([
                        function (callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return raObj.traveller_id.companyId == req.user.companyID;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var countryObj = [];
                            var raDataArr = [];

                            raArr.forEach(function (raObj) {
                                raObj.country.forEach(function (country) {
                                    if (countryObj.indexOf(country.name) == -1) {
                                        countryObj.push(country.name);
                                    }
                                    raDataArr.push(country);
                                })
                            })

                            callback(null, countryObj, raDataArr);
                        },
                        function (countryObj, raDataArr, callback) {
                            var countArr = [];
                            countryObj.forEach(function (countryName) {
                                var count = 0;
                                raDataArr.forEach(function (country) {
                                    if (countryName == country.name) {
                                        count++;
                                    }
                                })
                                countArr.push(count);
                            })

                            callback(null, countryObj, countArr);
                        }
                    ], function (err, result, result1) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'data': result1,
                                'label': result
                            })
                        }
                    });
                }
            })
    }
}



/* @function : getCountryRiskReport
 *  @author  : MadhuriK 
 *  @created  : 28-Jun-17
 *  @modified :
 *  @purpose  : To get numbers trips by country risk level.
 */
exports.getCountryRiskReport = function (req, res) {
    if (req.user.id) {
        RaObj.find({
                is_deleted: false,
                is_approve: true
            })
            .populate('traveller_id')
            .exec(function (err, ras) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else if (ras) {
                    var raArr = _.filter(ras, function (raObj) {
                        if (raObj.traveller_id) {
                            return raObj.traveller_id.companyId == req.user.companyID;
                        }
                    });
                    var countryArr = [];
                    var arr = [];

                    raArr.forEach(function (raObj) {
                        raObj.country.forEach(function (countryObj) {
                            if (countryArr.indexOf(countryObj.name) == -1) {
                                countryArr.push(countryObj.name);
                            }
                            arr.push(countryObj.name);
                        })
                    })
                    countryRiskObj.find({
                        companyId: req.user.companyID
                    }, function (err, countryRiskLevel) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            countryObj.find({
                                name: {
                                    $in: countryArr
                                }
                            }, function (err, countryData) {
                                if (err) {
                                    res.json({
                                        'error': err,
                                        'code': config.error,
                                        'message': 'Something went wrong please try again!'
                                    });
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
                                            } else if (countryName == countryData.name && countryData.color == undefined) {
                                                count2++;
                                            }
                                        })

                                    })
                                    countArr.push(count);
                                    countArr.push(count1);
                                    countArr.push(count2);
                                    if (labelArr.length > 0 && countArr.length > 0) {
                                        res.json({
                                            'code': config.success,
                                            'data': countArr,
                                            'label': labelArr
                                        })
                                    }
                                }
                            })
                        }
                    })

                }
            })
    }

}



/* @function : downloadSupplierCostReport
 *  @author  : MadhuriK 
 *  @created  : 01-July-17
 *  @modified :
 *  @purpose  : To download supplier list by cost 
 */
exports.downloadSupplierCostReport = function (req, res) {
    if (req.user.id) {
        supplierObj.find({
            companyId: req.user.companyID,
            is_deleted: false,
            status: 'Active'
        }, function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else if (result) {
                json2csv({
                    data: result,
                    fields: ['supplier_name', 'country', 'city', 'currency', 'cost'],
                    fieldNames: ['Supplier Name', 'Country', 'City', 'Currency', 'Cost']
                }, function (err, csv) {
                    if (err) {
                        throw err;
                    } else {
                        var path = './riskpal-client/uploads/supplier_cost_report.csv';
                        fs.writeFile(path, csv, function (err) {
                            if (err) {
                                throw err;
                            } else {
                                res.download(path);
                            }
                        })
                    }
                })
            }
        })
    }
}


/* @function : downloadSupplierCostReport
 *  @author  : MadhuriK 
 *  @created  : 01-July-17
 *  @modified :
 *  @purpose  : To download supplier list by cost 
 */
exports.downloadSupplierRatingReport = function (req, res) {
    if (req.user.id) {
        supplierObj.find({
            companyId: req.user.companyID,
            is_deleted: false,
            status: 'Active'
        }, function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else if (result) {
                json2csv({
                    data: result,
                    fields: ['supplier_name', 'country', 'city', 'currency', 'rate'],
                    fieldNames: ['Supplier Name', 'Country', 'City', 'Currency', 'Rate']
                }, function (err, csv) {
                    if (err) {
                        throw err;
                    } else {
                        var path = './riskpal-client/uploads/supplier_rating_report.csv';
                        fs.writeFile(path, csv, function (err) {
                            if (err) {
                                throw err;
                            } else {
                                res.download(path);
                            }
                        })
                    }
                })
            }
        })
    }
}


/* @function : downloadSupplierCostReport
 *  @author  : MadhuriK 
 *  @created  : 01-July-17
 *  @modified :
 *  @purpose  : To download supplier list by cost 
 */
exports.downloadSupplierCountryReport = function (req, res) {
    if (req.user.id) {
        supplierObj.find({
            companyId: req.user.companyID,
            is_deleted: false,
            status: 'Active'
        }, function (err, result) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else if (result) {
                json2csv({
                    data: result,
                    fields: ['supplier_name', 'country', 'city', 'currency', 'rate', 'cost'],
                    fieldNames: ['Supplier Name', 'Country', 'City', 'Currency', 'Rate', 'Cost']
                }, function (err, csv) {
                    if (err) {
                        throw err;
                    } else {
                        var path = './riskpal-client/uploads/supplier_country_report.csv';
                        fs.writeFile(path, csv, function (err) {
                            if (err) {
                                throw err;
                            } else {
                                res.download(path);
                            }
                        })
                    }
                })
            }
        })
    }
}


/* @function : downloadTripsByCountryReport
 *  @author  : MadhuriK 
 *  @created  : 06-July-17
 *  @modified :
 *  @purpose  : To download trips report of all the travellers by country for client admin 
 */
exports.downloadTripsByCountryReport = function (req, res) {
    if (req.user.id) {
        RaObj.find({
                is_deleted: false,
                is_approve: true
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
                                    return raObj.traveller_id.companyId == req.user.companyID;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var countryObj = [];
                            var raDataArr = [];

                            raArr.forEach(function (raObj) {
                                raObj.country.forEach(function (country) {
                                    if (countryObj.indexOf(country.name) == -1) {
                                        countryObj.push(country.name);
                                    }
                                    raDataArr.push(country);
                                })
                            })

                            callback(null, countryObj, raDataArr);
                        },
                        function (countryObj, raDataArr, callback) {
                            var countArr = [];
                            countryObj.forEach(function (countryName) {
                                var count = 0;
                                raDataArr.forEach(function (country) {
                                    if (countryName == country.name) {
                                        count++;
                                    }
                                })
                                countArr.push({
                                    count: count,
                                    country: countryName
                                });
                            })

                            callback(null, countArr);
                        }
                    ], function (err, result) {
                        if (result) {
                            json2csv({
                                data: result,
                                fields: ['country', 'count'],
                                fieldNames: ['country', 'count']
                            }, function (err, csv) {
                                if (err) {
                                    throw err;
                                } else {
                                    var path = './riskpal-client/uploads/traveller_trip_report_by_country.csv';
                                    fs.writeFile(path, csv, function (err) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            res.download(path);
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
            })
    }
}


/* @function : downloadCountryRiskReport
 *  @author  : MadhuriK 
 *  @created  : 06-July-17
 *  @modified :
 *  @purpose  : To get download report of trips by country risk levels. 
 */
exports.downloadCountryRiskReport = function (req, res) {
    if (req.user.id) {
        RaObj.find({
                is_deleted: false,
                is_approve: true
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
                    var raArr = _.filter(ras, function (raObj) {
                        if (raObj.traveller_id) {
                            return raObj.traveller_id.companyId == req.user.companyID;
                        }
                    });
                    var countryArr = [];
                    var arr = [];

                    raArr.forEach(function (raObj) {
                        raObj.country.forEach(function (countryObj) {
                            if (countryArr.indexOf(countryObj.name) == -1) {
                                countryArr.push(countryObj.name);
                            }
                            arr.push(countryObj.name);
                        })
                    })

                    countryRiskObj.find({
                        companyId: req.user.companyID
                    }, function (err, countryRiskLevel) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else {
                            countryObj.find({
                                name: {
                                    $in: countryArr
                                }
                            }, function (err, countryData) {
                                if (err) {
                                    res.json({
                                        'error': err,
                                        'code': config.error,
                                        'message': 'Something went wrong please try again!'
                                    });
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
                                            } else if (countryName == countryData.name && countryData.color == undefined) {
                                                count2++;
                                            }
                                        })

                                    })
                                    countArr.push({
                                        count: count,
                                        color: 'Red'
                                    });
                                    countArr.push({
                                        count: count1,
                                        color: 'Amber'
                                    });
                                    countArr.push({
                                        count: count2,
                                        color: 'Green'
                                    });
                                    if (countArr.length > 0) {
                                        json2csv({
                                            data: countArr,
                                            fields: ['color', 'count'],
                                            fieldNames: ['Rate', 'Number of trips']
                                        }, function (err, csv) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                var path = './riskpal-client/uploads/traveller_trip_report_by_country_risk.csv';
                                                fs.writeFile(path, csv, function (err) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        res.download(path);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })

                }
            })
    }
}


/* @function : downloadTripsReport
 *  @author  : MadhuriK 
 *  @created  : 06-July-17
 *  @modified :
 *  @purpose  : To get download report of travellers trips on yearly monthly weekly and daily basis. 
 */
exports.downloadTripsReport = function (req, res) {
    if (req.user.id) {
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];
        RaObj.find({
                is_deleted: false,
                is_approve: true
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
                                    return raObj.traveller_id.companyId == req.user.companyID;
                                }
                            });
                            callback(null, raArr);
                        },
                        function (raArr, callback) {
                            var yearArr = [];
                            raArr.forEach(function (ra) {
                                if (yearArr.indexOf(ra.createdAt.getFullYear()) == -1) {
                                    yearArr.push(ra.createdAt.getFullYear());
                                }
                            })
                            callback(null, yearArr, raArr);
                        },
                        function (yearArr, raArr, callback) {
                            var countArr = [];
                            var dataArr = [];
                            yearArr.forEach(function (year) {
                                var count = 0;
                                raArr.forEach(function (ra) {

                                    if (ra.createdAt.getFullYear() == year) {
                                        count++;
                                    }
                                })
                                dataArr.push( // push yearly report data
                                    {
                                        duration: year,
                                        count: count
                                    }
                                )
                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {

                                    return (raObj.traveller_id.companyId == req.user.companyID && raObj.createdAt.getFullYear() == currentYear);
                                }
                            });
                            callback(null, raArr, dataArr);
                        },
                        function (raArr, dataArr, callback) {
                            var monthArr = [];
                            raArr.forEach(function (ra) {
                                if (monthArr.indexOf(monthNames[ra.createdAt.getMonth()]) == -1) {
                                    monthArr.push(monthNames[ra.createdAt.getMonth()]);
                                }
                            })
                            callback(null, monthArr, raArr, dataArr);
                        },
                        function (monthArr, raArr, dataArr, callback) {
                            var countArr = [];
                            monthArr.forEach(function (month) {
                                var count = 0;
                                raArr.forEach(function (ra) {

                                    if (monthNames[ra.createdAt.getMonth()] == month) {
                                        count++;
                                    }
                                })
                                dataArr.push( // push monthly report data
                                    {
                                        duration: month,
                                        count: count
                                    }
                                )

                            })
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return (raObj.traveller_id.companyId == req.user.companyID && raObj.createdAt.getMonth() == currentMonth);
                                }
                            });
                            callback(null, raArr, dataArr);
                        },
                        function (raArr, dataArr, callback) {
                            var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth());
                            var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                            var firstWeekFirstDay = firstDay.getDate();
                            var firstWeekLastDay = firstDay.getDate() + 6;

                            var secondWeekFirstDay = firstWeekLastDay + 1;
                            var secondWeekLastDay = firstWeekLastDay + 7;

                            var thirdWeekFirstDay = secondWeekLastDay + 1;
                            var thirdWeekLastDay = secondWeekLastDay + 7;

                            var fourthWeekFirstDay = thirdWeekLastDay + 1;
                            var fourthWeekLastDay = thirdWeekLastDay + 7;

                            var weekArr = ['first week', 'second week', 'third week', 'fourth week'];
                            var count1 = 0,
                                count2 = 0,
                                count3 = 0,
                                count4 = 0;
                            raArr.forEach(function (ra) {
                                if (ra.createdAt.getDate() >= firstWeekFirstDay && ra.createdAt.getDate() <= firstWeekLastDay) {
                                    count1++;
                                } else if (ra.createdAt.getDate() >= secondWeekFirstDay && ra.createdAt.getDate() <= secondWeekLastDay) {
                                    count2++;
                                } else if (ra.createdAt.getDate() >= thirdWeekFirstDay && ra.createdAt.getDate() <= thirdWeekLastDay) {
                                    count3++;
                                } else if (ra.createdAt.getDate() >= fourthWeekFirstDay && ra.createdAt.getDate() <= fourthWeekLastDay || ra.createdAt.getDate() <= lastDay.getDate()) {
                                    count4++;
                                }
                            })

                            dataArr.push({ // push weekly report data
                                duration: 'first week',
                                count: count1
                            });
                            dataArr.push({
                                duration: 'second week',
                                count: count2
                            });
                            dataArr.push({
                                duration: 'third week',
                                count: count3
                            });
                            dataArr.push({
                                duration: 'fourth week',
                                count: count4
                            });
                            callback(null, dataArr);
                        },
                        function (dataArr, callback) {
                            var raArr = _.filter(ras, function (raObj) {
                                if (raObj.traveller_id) {
                                    return (raObj.traveller_id.companyId == req.user.companyID &&
                                        raObj.createdAt.getDate() == currentDate.getDate() && raObj.createdAt.getMonth() == currentDate.getMonth() &&
                                        raObj.createdAt.getFullYear() == currentDate.getFullYear()
                                    );
                                }
                            });

                            dataArr.push({ // push today's report data
                                duration: 'today',
                                count: raArr.length
                            })

                            callback(null, dataArr);
                        },

                    ], function (err, result) {
                        if (err) {
                            res.json({
                                'error': err,
                                'code': config.error,
                                'message': 'Something went wrong please try again!'
                            });
                        } else if (result.length > 0) {
                            json2csv({
                                data: result,
                                fields: ['duration', 'count'],
                                fieldNames: ['Duration', 'Number of trips']
                            }, function (err, csv) {
                                if (err) {
                                    throw err;
                                } else {
                                    var path = './riskpal-client/uploads/travellers_trip_report_yearly_monthly_weekly_daily.csv';
                                    fs.writeFile(path, csv, function (err) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            res.download(path);
                                        }
                                    })
                                }
                            })
                        }
                    });

                }
            })
    }
}



/* @function : getTripsByDepartment
 *  @author  : MadhuriK 
 *  @created  : 12-July-17
 *  @modified :
 *  @purpose  : To create trip report for client super admin by department
 */
exports.getTripsByDepartment = function (req, res) {
    if (req.user.id) {
        departmentObj.find({
            is_deleted: false,
            status: "Active",
            companyId: req.user.companyID
        }, function (err, departments) {

            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else if (departments.length > 0) {

                var departmentArr = [];

                departments.forEach(function (dept) {
                    departmentArr.push(dept.department_name);
                })

                var labelArr = departmentArr;

                RaObj.find({
                        is_deleted: false
                    })
                    .populate('traveller_id')
                    .populate('department')
                    .exec(function (err, ras) {
                        async.waterfall([
                            function (callback) {
                                var raArr = _.filter(ras, function (raObj) {
                                    if (raObj.traveller_id) {
                                        return raObj.traveller_id.companyId == req.user.companyID;
                                    }
                                });
                                callback(null, raArr);
                            },
                            function (raArr, callback) {
                                var raDepartArr = [];
                                raArr.forEach(function (ra) {
                                    ra.department.forEach(function (depart) {
                                        raDepartArr.push(depart);
                                    })
                                })
                                callback(null, raDepartArr);
                            },
                            function (raDepartArr, callback) {
                                var countArr = [];
                                departmentArr.forEach(function (departmentName) {
                                    var count = 0;
                                    raDepartArr.forEach(function (ra) {
                                        if (ra.department_name == departmentName) {
                                            count++;
                                        }
                                    })
                                    countArr.push(count);
                                })

                                callback(null, labelArr, countArr);
                            },
                        ], function (err, result, result1) {
                            if (err) {
                                res.json({
                                    'error': err,
                                    'code': config.error,
                                    'message': 'Something went wrong please try again!'
                                });
                            } else {
                                res.json({
                                    'code': config.success,
                                    'data': result1,
                                    'label': result
                                })
                            }
                        });

                    });
            } else {
                res.json({
                    'code': config.success,
                    'data': [],
                    'label': []
                })
            }
        })
    }
}