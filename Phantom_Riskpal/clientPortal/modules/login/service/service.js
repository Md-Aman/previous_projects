"use strict"

angular.module('LoginService', [])

    .factory('Login', ['$http', function ($http) {
        return {

            // super login
            superAdminLogin: function (adminData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.SuperAdminLogin,
                    data: adminData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // user activation setup password
            userActivate: function (admin, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.userActivate,
                    data: admin
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            //checkverification
            checkUserstatus: function (news_agency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.checkUserstatus,
                    data: news_agency

                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // super admin logout
            superAdminLogout: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.SuperAdminLogout,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // super admin forget pass link send on email
            superAdminForgetPass: function (adminData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.SuperAdminForgetPass,
                    data: adminData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to reset password
            superAdminResetPass: function (adminData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.SuperAdminResetPass,
                    data: adminData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to reset password
            userRole: function (responseData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.userRole,
                    data: responseData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            //Authy verification
            verifyOtp: function (otp, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.VerifyOtp,
                    data: otp
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    console.log("err", err)
                    fn(err);
                });
            },

            sms: function (email, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.Sms,
                    data: email
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    console.log("err", err)
                    fn(err);
                });
            },
            verify: function (token, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.Verify,
                    data: token
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    console.log("err", err)
                    fn(err);
                });
            },
            voice: function (voicetoken, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.Voice,
                    data: voicetoken
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    console.log("err", err)
                    fn(err);
                });
            },
            onetouch: function (voicetoken, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.Onetouch,
                    data: voicetoken
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    console.log("err", err)
                    fn(err);
                });
            },
            checkonetouchstatus: function (voicetoken, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.Checkonetouchstatus,
                    data: voicetoken
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    console.log("err", err)
                    fn(err);
                });
            },

            isAuthorized: function (url) {
                var urlLast = url[url.length - 1];
                var urlSecondLast = url[url.length - 2];
                var urlThirdLast = url[url.length - 3];
                var roles = JSON.parse(localStorage.getItem('roledetails'));
                var superAdminRole = localStorage.getItem('super_admin');
                var publicUrl = ['login', 'dashboard', 'activate-account', 'forget_password', 'reset-password'];
                if (superAdminRole == 'true' || publicUrl.indexOf(urlLast) > -1 || publicUrl.indexOf(urlSecondLast) > -1)
                    return true;
                // ................... Customize template ........................
                // for risk assessment templates 
                if (urlLast == 'step1' || urlThirdLast == 'countrythreatmatrix'
                    || urlSecondLast == 'step2' || urlThirdLast == 'risk_questions' || urlSecondLast == 'supplier'
                    || urlSecondLast == 'communication' || url == 'contingency' || urlSecondLast == 'contingency' || urlSecondLast == 'step3'
                    || urlSecondLast == 'risk_assessment') {
                    if (roles.managesystem.riskassessmenttemplates == '1') {
                        return true;
                    }
                }
                // for departments
                if (urlLast == 'department' || urlSecondLast == 'add' || urlSecondLast == 'list'
                    || urlLast == ':department_id' || urlSecondLast == 'department') {
                    if (roles.managesystem.departments == '1') {
                        return true;
                    }
                }
                // for risk levels
                if (urlLast == 'categories' || urlLast == 'question' || urlLast == ':category_id'
                    || urlLast == ':questionnaire_id') {
                    if (roles.managesystem.risklabels == '1') {
                        return true;
                    }
                }
                //for edit country information
                if (urlSecondLast == 'countrylist') {
                    if (roles.managesystem.countryinfo == '1') {
                        return true;
                    }
                }
                //for edit country threat fields
                if (urlLast == 'country_risk_level' || urlLast == 'threat_matrix' || urlLast == 'risk_associated_categories') {
                    if (roles.managesystem.countrythreatcategories == '1') {
                        return true;
                    }
                }

                  // View & Edit Threat Categories
                  if (urlSecondLast == 'risk_associated_categories' && urlThirdLast == 'update') {
                    if (roles.managesystem.countrythreatcategories == '1') {
                        return true;
                    }
                }

                // for country list
                if (urlSecondLast == 'country' && urlThirdLast == 'view') {
                    if (roles.managesystem.countrylist == '1' || roles.mytravel.countrylist == 1) {
                        return true;
                    }
                }
                // for suppliers
                if (urlSecondLast == 'supplier') {
                    if (roles.managesystem.csuppliers == '1') {
                        return true;
                    }
                }
                if(urlSecondLast == 'update_supplier'){
                    if (roles.managesystem.csuppliers == '1') {
                        return true;
                    }
                }
                // ...................User Information ........................
                // for create new user
                if (urlSecondLast == 'user' && urlLast == 'add') {
                    if (roles.userinformation.createeditusers == '1') {
                        return true;
                    }
                }
                // for User List
                if (urlSecondLast == 'user' && urlLast == 'list') {
                    if (roles.userinformation.createeditusers == '1') {
                        return true;
                    }
                }
                if ((urlSecondLast == 'user' && urlLast == 'list') || urlLast == ':user_id') {
                    if (roles.userinformation.createeditusers == '1') {
                        return true;
                    }
                }

                // for User group 
                if (urlSecondLast == 'usergroup' && urlThirdLast == 'edit') {
                    if (roles.userinformation.editusergroup == '1') {
                        return true;
                    }
                }

              

                // ................... Track and Connect ........................
                if (urlLast == 'newsRaList') {
                    if (roles.trackmanage.riskassessments == '1') {
                        return true;
                    }
                }
                if (urlLast == 'newsRaallList' || urlSecondLast == 'newsRaEdit') {
                    if (roles.trackmanage.riskassessmentsoverride == '1') {
                        return true;
                    }
                }
                // ................... My Travel........................
                // ................... Risk Assessments ........................
                if (urlLast == 'ra_templates' || urlLast == ':types_of_ra_id' || urlThirdLast == ':types_of_ra_id' ||
                    urlLast == ':newsRa_id' || urlSecondLast == 'news_ra') {
                    if (roles.mytravel.riskassessment == '1') {
                        return true;
                    }
                }

                // ................... Country List ........................
                if (urlLast == ':keyword') {
                    if (roles.mytravel.countrylist == '1') {
                        return true;
                    }
                }
                // ................... Suppliers ........................
                if (urlSecondLast == 'update_supplier') {
                    if (roles.mytravel.suppliers == '1') {
                        return true;
                    }
                }

                if (urlSecondLast == 'supplier') {
                    if (roles.mytravel.suppliers == '1') {
                        return true;
                    }
                }

                if(urlLast == 'profile_detail'){
                    return true;
                }

                return false;
            }





        }


    }]);
