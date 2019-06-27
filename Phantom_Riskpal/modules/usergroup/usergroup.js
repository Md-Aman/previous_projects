var usergroupObj = require('./../../schema/roles.js'); // include roles schema 
var clientObj= require('./../../schema/clients.js');  //Clients schema 
var config = require('../../config/jwt_secret.js');
var createError = require('http-errors');

var _ = require('underscore');


/* @function : saveussergroup
 *  @author  : Siroi 
 *  @created  : 21-Mar-18
 *  @modified :
 *  @purpose  : To save usergroup details.
 */
exports.saveUsergroup = function (req, res, next) {
    if (req.body) {
        usergroupObj.findOne({
            group_name: req.body.groupname,
            is_deleted: false,
        }, function (err, usergroup) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (usergroup) {
                res.json({
                    'error': 'Group Name already exists',
                    'code': config.error,
                    'message': 'Group Name already exists'
                });
            } else {
                    var client_id = undefined;
                    if(req.body.typeof_group == 'client' && req.user.super_admin){
                        client_id = req.body.clients;
                        // var client_name=JSON.parse(req.body.client).company_name;
                    } else {
                        client_id = req.user.client_id;
                    }

                    var usergroupData = new usergroupObj({

                        group_name: req.body.groupname,
                        type:req.body.typeof_group,
                        trackmanage:{
                            parentId:req.body.trackmanage || false,
                            riskassessments:req.body.riskassessments || false,
                            riskassessmentsoverride:req.body.riskassessmentsoverride || false ,
                            currenttravel:req.body.currenttravel || false,
                            communicate:req.body.communicate || false,
                            taccidents:req.body.taccidents || false,
                            medicalinfo:req.body.medical || false,

                           
                        },

                        mytravel:{
                            parentId:req.body.mytravel || false,
                            riskassessment:req.body.riskassessment || false,
                            riskassessmentothers:req.body.riskassessmentothers || false,
                            checkinlog:req.body.checkinlog || false,
                            contact:req.body.contact || false,
                            accidents:req.body.accidents || false,
                            countrylist:req.body.countrylist || false,
                            suppliers:req.body.suppliers || false,
                            reports:req.body.reports || false,


                           
                        },

                        analytics:{
                            parentId:req.body.analytics || false,
                            traveldata:req.body.traveldata || false,
                            supplierdata:req.body.supplierdata || false,
                            accidentdata:req.body.accidentdata || false,
                            managementdata:req.body.managementdata || false,
                            analyticsresoucre:req.body.analyticsresoucre || false,
                            training:req.body.training || false,
                            appusage:req.body.appusage || false,
                            userdata:req.body.userdata || false,



                           
                        },


                        resourcelib:{
                            parentId:req.body.resourcelib || false,
                            resourcelibview:req.body.resourcelibview || false,
                            resourcelibedit:req.body.resourcelibedit || false,
                           
                           
                        },

                        userinformation:{
                            parentId:req.body.userinfo || false,
                            createeditusers:req.body.createusers || false,
                            editusergroup:req.body.editusergroup || false,
                            bulkupload:req.body.bulkupload || false,
                            emergencyRecordApproval: req.body.emergencyRecordApproval || false,
                           
                        },

                        managesystem:{
                            parentId:req.body.managesystem || false,
                            departments:req.body.departments || false,
                            riskassessmenttemplates:req.body.riskassessmenttemplates || false,
                            risklabels:req.body.labels || false,
                            //risktimer:req.body.timer || false,
                            //riskcontent:req.body.countryrisk || false,
                           // activitytype:req.body.activitytype || false,
                            csuppliers:req.body.csuppliers || false,
                           // resourcelib:req.body.resourcelib || false,
                            emailtemplates:req.body.emailtemplates || false,
                            editcontent:req.body.editcontent || false,
                            countryinfo:req.body.countryinfo || false,
                            countrythreatcategories:req.body.countrythreatcategories || false,
                      
                        },

                        myprofile:{
                            myprofileemrgncy:req.body.myprofileemrgncy || false,
                            myprofilemedical:req.body.myprofilemedical || false,
                            myprofiletraining:req.body.myprofiletraining || false,
                            parentId:req.body.myprofile || false,
                        },


                       
                        client_id:client_id,
                        // client_name:client_name 
                });
                usergroupData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Usergroup added successfully'
                        });
                    }
                })
            }
        })
    }
   
 
    
}



/* @function : getAllusergroup
 *  @author  : Siroi 
 *  @created  : 21-Mar-18
 *  @modified :
 *  @purpose  : To get all user groups.
 */
exports.getAllusergroup = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = '';
   console.log('reqqqqq', req.user);
    if(req.user.super_admin == true){
        query = {
            is_deleted: false,
        }
       }else{
        query = {
            is_deleted: false,
            client_id:req.user.client_id
        }
       }
    if (req.body.keyword)
        query['$or'] = [{ group_name: { $regex: req.body.keyword, $options: "$i" } }, { type: { $regex: req.body.keyword, $options: "$i" } }, { client_name: { $regex: req.body.keyword, $options: "$i" } }];
     
        usergroupObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('client_id')
        .exec(function (err, data) {
            if (data) {
                usergroupObj.count(query, function (err, count) {
                    res.json({
                        'code': config.success,
                        'data': data,
                        'count': count
                    });
                })
            } else {
                next(createError(config.serverError, err));
            }
        });
}

/* @function : getAllClients
 *  @author  : Siroi 
 *  @created  : 21-Mar-18
 *  @modified :
 *  @purpose  : To get all clients for creating user group
 */
exports.getAllClients = function (req, res, next) {
    clientObj.find({
        is_deleted: false,
        status: "Active"
    }, function (err, clients) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': clients
            });
        }
    })
}


/* @function : getUsergroupDetails
 *  @author  : Siroi 
 *  @created  : 22-Mar-18
 *  @modified :
 *  @purpose  : To get getUsergroupDetails
 */
exports.getUsergroupDetails = function (req, res, next) {
    usergroupObj.findOne({
        _id:req.params.usergroup_id,
        is_deleted: false
        
    }, function (err, usergroup) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': usergroup
            });
        }
    })
}



/* @function : updateUsergroup
 *  @author  : Siroi 
 *  @created  : 22-Mar-18
 *  @modified :
 *  @purpose  : To get getUsergroupDetails
 */
exports.updateUsergroup = function (req, res, next) {
    var usergroup_id = req.body._id;
    console.log(req.body.riskassessmentothers);
    var client_id = undefined;
    if(req.body.typeof_group == 'client' && req.user.super_admin){
        client_id = req.body.clients;
        // var client_name=JSON.parse(req.body.client).company_name;
    } else {
        client_id = req.user.client_id;
    }
    usergroupObj.update({
        _id: usergroup_id,
        is_deleted: false
    }, {
        $set: {
            group_name: req.body.groupname,
            type:req.body.typeof_group,
            trackmanage:{
                            parentId:req.body.trackmanage || false,
                            riskassessments:req.body.riskassessments || false,
                            riskassessmentsoverride:req.body.riskassessmentsoverride || false,
                            currenttravel:req.body.currenttravel || false,
                            communicate:req.body.communicate || false,
                            taccidents:req.body.taccidents || false,
                            medicalinfo:req.body.medical || false,

                           
                        },

                        mytravel:{
                            parentId:req.body.mytravel || false,
                            riskassessment:req.body.riskassessment || false,
                            riskassessmentothers:req.body.riskassessmentothers || false,
                            checkinlog:req.body.checkinlog || false,
                            contact:req.body.contact || false,
                            accidents:req.body.accidents || false,
                            countrylist:req.body.countrylist || false,
                            suppliers:req.body.suppliers || false,
                            reports:req.body.reports || false,


                           
                        },

                        analytics:{
                            parentId:req.body.analytics || false,
                            traveldata:req.body.traveldata || false,
                            supplierdata:req.body.supplierdata || false,
                            accidentdata:req.body.accidentdata || false,
                            managementdata:req.body.managementdata || false,
                            analyticsresoucre:req.body.analyticsresoucre || false,
                            training:req.body.training || false,
                            appusage:req.body.appusage || false,
                            userdata:req.body.userdata || false,
                        },


                        resourcelib:{
                            parentId:req.body.resourcelib || false,
                            resourcelibview:req.body.resourcelibview || false,
                            resourcelibedit:req.body.resourcelibedit || false, 
                        },

                        userinformation:{
                            parentId:req.body.userinfo || false,
                            createeditusers:req.body.createusers || false,
                            editusergroup:req.body.editusergroup || false,
                            bulkupload:req.body.bulkupload || false,
                            emergencyRecordApproval: req.body.emergencyRecordApproval || false,
                        },

                        managesystem:{
                            parentId:req.body.managesystem || false,
                            departments:req.body.departments || false,
                            riskassessmenttemplates:req.body.riskassessmenttemplates || false,
                            risklabels:req.body.labels || false,
                            //risktimer:req.body.timer || false,
                            //riskcontent:req.body.countryrisk || false,
                           // activitytype:req.body.activitytype || false,
                            csuppliers:req.body.csuppliers || false,
                           // resourcelib:req.body.resourcelib || false,
                            emailtemplates:req.body.emailtemplates || false,
                            editcontent:req.body.editcontent || false,
                            countryinfo:req.body.countryinfo || false,
                            countrythreatcategories:req.body.countrythreatcategories || false,
                      
                        },

                        myprofile:{
                            parentId: req.body.myprofile ? req.body.myprofile : false,
                            myprofileemrgncy: req.body.myprofileemrgncy ? req.body.myprofileemrgncy : false ,
                            myprofilemedical: req.body.myprofilemedical ? req.body.myprofilemedical : false,
                            myprofiletraining: req.body.myprofiletraining ? req.body.myprofiletraining : false,

                        },
            client_id:client_id,
            // client_name:client_name 
        }
    }, function (err, data) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'Usergroup updated successfully'
            });
        }

    })
}


/* @function : deleteUsergroup
 *  @author  : MadhuriK 
 *  @created  : 19-May-17
 *  @modified :
 *  @purpose  : To delete news agency.
 */
exports.deleteUsergroup = function (req, res, next) {
    if (req.params.usergroup_id) {
        usergroupObj.update({
            _id: req.params.usergroup_id,
            is_deleted: false
        }, {
            $set: {
                is_deleted: true
            }
        }, function (err) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err
                });

            } else {
                res.json({
                    'code': config.success,
                    'message': 'Usergroup deleted successfully'
                });
            }
        })
    }
}




