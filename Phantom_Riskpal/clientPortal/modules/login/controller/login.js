'use strict';

angular.module('login', ['ui.router', 'ngCookies'])
    .config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
        //================================================ 
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push(function ($q, $location, $window) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if ($window.localStorage && $window.localStorage.superAdmintoken) {
                        config.headers.Authorization = $window.localStorage.superAdmintoken;
                    }
                    var $cookies;
                    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
                        $cookies = _$cookies_;
                    }]);
                   config.headers['xsrf-token'] = $cookies['csrf-token'];
                //    config.headers['X-CSRF-Token'] = $cookies._csrf;
                    return config;
                },
                response: function (response) {
                    if (response.status !== 200) {
                        // handle the case where the user is not authenticated
                        //$location.path('/');
                    }
                    return response || $q.when(response);
                }
            };
        });
        // ************************ End ***************************
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/login/views/login.html',
                controller: 'LoginCtrl',
                authenticate: false
            })
            .state('registration', {
                url: '/registration',
                templateUrl: 'modules/login/views/registration.html',
                controller: 'LoginCtrl',
                authenticate: false
            })
            .state('activate-account', {
                url: '/activate-account/:hashcode',
                templateUrl: 'modules/login/views/activate-account.html',
                controller: 'LoginCtrl',
                authenticate: false
            })
            .state('forget_password', {
                url: '/forget_password',
                templateUrl: 'modules/login/views/forget_password.html',
                controller: 'LoginCtrl',
                authenticate: false
            })
            .state('reset-password', {
                url: '/reset-password/:id',
                templateUrl: 'modules/login/views/reset_password.html',
                controller: 'LoginCtrl',
                authenticate: false
            })
            .state('password_update', {
                url: '/password_update',
                templateUrl: 'modules/login/views/reset_password.html',
                controller: 'LoginCtrl',
                authenticate: false
            })

            .state("error-not-found", {
                url: "/login",
                // redirectTo:"login"
            });

        $urlRouterProvider.when('/', '/login');





    })
    .run(function ($rootScope, $state, $window, $http, $location) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {




            if (!$window.localStorage.superAdmintoken && toState.authenticate) {
                event.preventDefault();
                $state.go('login');
            }
            else if (toState.url == '/login' && $window.localStorage.superAdmintoken) {
                $state.go('main.dashboard');
            } else if ($window.localStorage.superAdmintoken) {
                $rootScope.superAdminUserData = $window.localStorage.superAdminUserData !== undefined ? JSON.parse($window.localStorage.superAdminUserData) : "";
                $rootScope.roledetails = $window.localStorage.roledetails !== undefined ? JSON.parse($window.localStorage.roledetails) : "";
                // $rootScope.logclient_id = $window.localStorage.logclient_id !== undefined ? $window.localStorage.logclient_id : "";

            }
            if (toState.name !== "forget_password" && toState.name !== "reset-password" && toState.name !== "activate-account") {
                var checklogin = window.location.origin + '/super_admin/checkLogin';
                /*TO authenticate states on state change*/
                $http.get(checklogin)
                    .success(function (data) {
                        if (data.code === 200) {
                            // if (!toState.authenticate) {
                            //     event.preventDefault();
                            //     $state.go('main.dashboard');
                            // } 
                            if (toState.url == '/login') {
                                $state.go('main.dashboard');
                            }
                            $rootScope.superAdminUserLoggedin = true;
                        } else {
                            $rootScope.superAdminUserLoggedin = false;
                            event.preventDefault();
                            delete $window.localStorage.superAdmintoken;
                            delete $window.localStorage.superAdminUserData;
                            delete $window.localStorage.roledetails;
                            delete $window.localStorage.super_admin;
                            delete $window.localStorage.manageclients;
                            delete $window.localStorage.logclient_id;
                            $state.go('login');
                        }
                    });

            }

        })
    })
    .controller('LoginCtrl', ['$scope', '$location', '$modal', 'Login', 'ngTableParams', '$state', 'toaster', '$timeout', '$rootScope', '$window', function ($scope, $location, $modal, Login, ngTableParams, $state, toaster, $timeout, $rootScope, $window) {


        $scope.login_start = function () {
            $state.go('login');

        }

        /* @function : superAdminLoginLogin
         *  @author  : MadhuriK 
         *  @created  : 18-May-17
         *  @modified :
         *  @purpose  : To super admin login.
         */
        $scope.superAdminLogin = function (adminData) {
            Login.superAdminLogin(adminData, function (response) {
                if (response.code === 200) {
                    var key = "hashcode";
                    var keypass = "password";
                    var keyauthy = "authyID";

                    delete response.data[key];
                    delete response.data[keypass];
                    delete response.data[keyauthy];


                    console.log(response);
                    toaster.pop('success', "", "2FA initialized");
                    $timeout(function () {
                        $modal.open({
                            templateUrl: 'myModalContent.html',
                            controller: 'ModalInstanceCtrl',
                            backdrop: false,
                            resolve: {
                                data: function () {
                                    return response;
                                },
                            }
                        });
                    }, 500);


                } else {
                    $scope.toasters.splice(toaster.id, 1);
                    toaster.pop('error', "", response.err);
                }

            })
        }



        /* @function : userActivate
        *  @author  : Siroi 
        *  @created  : 28-Mar-18
        *  @modified :
        *  @purpose  : To activate the user details
        */
        $scope.userActivate = function (admin) {

            admin.hashcode = $state.params.hashcode;
            var confirmpassword = admin.cpassword;
            var password = admin.password;
            console.log(confirmpassword);
            if (admin) {

                if (password != confirmpassword) {

                    $scope.toasters.splice(toaster.id, 1);
                    toaster.pop('error', "Password does not match");

                } else {

                    Login.userActivate(admin, function (response) {
                        if (response.code === 200) {
                            toaster.pop('success', "", response.message);
                            $scope.userform = response.data;
                            $timeout(function () {
                                $state.go('login');
                            }, 500);

                        } else {
                            $scope.toasters.splice(toaster.id, 1);
                            toaster.pop('error', "", response.message);
                        }
                    })

                }


            }
        }



        /* @function : checkUserstatus
            *  @author  : Siroi 
            *  @created  : 28-Mar-18
            *  @modified :
            *  @purpose  : To activate the user details
            */
        $scope.checkUserstatus = function () {


            var news_agency = {};
            news_agency.id = $state.params.hashcode;

            if (news_agency) {

                Login.checkUserstatus(news_agency, function (response) {
                    if (response.code === 200) {

                        if (response.data.length != 1) {
                            $timeout(function () {
                                $state.go('login');
                            }, 500);

                        }


                    } else {
                        console.log("Fdfd");

                    }
                })
            }
        }





        /* @function : checkVerified
      *  @author  : Siroi 
      *  @created  : 28-Mar-18
      *  @modified :
      *  @purpose  : To check user activated or not
      */
        $scope.checkVerifieds = function () {



            var news_agency = {};
            news_agency.id = $state.params.hashcode;

            if (news_agency) {

                Login.checkVerifieds(news_agency, function (response) {

                    if (response.code === 200) {

                        //      $scope.userform = response.data;
                        //      $timeout(function () {
                        //        $state.go('login');
                        //    }, 500);

                    } else {
                        $scope.toasters.splice(toaster.id, 1);
                        console.log("error");
                        toaster.pop('error', "", response.err);
                    }
                })
            }
        }



        /* @function : adminLogout
         *  @author  : MadhuriK 
         *  @created  : 18-May-17
         *  @modified :
         *  @purpose  : To super admin logout.
         */
        $rootScope.superAdminLogout = function () {
            Login.superAdminLogout(function (response) {
                if (response.code === 200) {
                    toaster.pop('success', "", response.message);
                    $timeout(function () {
                        $state.go('login');
                    }, 500);
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }



        /* @function : superAdminForgetPass
        *  @author  : MadhuriK 
        *  @created  : 18-May-17
        *  @modified :
        *  @purpose  : To send password reset link on email.
        */
        $scope.superAdminForgetPass = function (adminEmail) {
            Login.superAdminForgetPass(adminEmail, function (response) {
                if (response.code === 200) {
                    $scope.toasters.splice(toaster.id, 1);
                    toaster.pop('success', "", response.message);
                } else {
                    $scope.toasters.splice(toaster.id, 1);
                    toaster.pop('error', "", response.err);
                }
            })

        }



        /* @function : superAdminResetPass
         *  @author  : MadhuriK 
         *  @created  : 18-May-17
         *  @modified :
         *  @purpose  : To reset password.
         */
        $scope.superAdminResetPass = function (adminData) {
            if (adminData.password !== adminData.c_password) {
                toaster.pop('error', "", "password and confirm password does not match");
            } else {
                adminData.userId = $state.params.id;
                Login.superAdminResetPass(adminData, function (response) {
                    if (response.code === 200) {
                        $scope.toasters.splice(toaster.id, 1);
                        toaster.pop('success', "", response.message);
                        $timeout(function () {
                            $state.go('login');
                        }, 500);
                    } else {
                        $scope.toasters.splice(toaster.id, 1);
                        toaster.pop('error', "", response.err);
                    }
                })
            }

        }

        /* @function : Nav active controller
        *  @author  :  
        *  @created  : 
        *  @modified :
        *  @purpose  : 
        */


        //Navigational Controller
        $scope.isActive = function (viewLocation) {

            return viewLocation === $location.path();
        };





    }]).controller('ModalInstanceCtrl', ['$scope', '$location', '$modal', 'Login', 'ngTableParams', '$state', 'toaster', '$timeout', '$rootScope', '$window', '$modalInstance', 'data', '$interval', function ($scope, $location, $modal, Login, ngTableParams, $state, toaster, $timeout, $rootScope, $window, $modalInstance, data, $interval) {


        var pollingID;
        $scope.setup = {};
        $scope.authyobj = data;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            if (pollingID != undefined) {
                $interval.cancel(pollingID);
            }
        };
        var count = 0;

        /* @function : userRole
        *  @author  : Siroi 
        *  @created  : 21-Mar-18
        *  @modified :
        *  @purpose  : To get loggedid user role permisions
        */


        $scope.userRole = function (responseData) {


            Login.userRole(responseData, function (response) {
                if (response.code === 200) {
                        $window.localStorage.roledetails = JSON.stringify(response.data);
                        $state.go('main.dashboard');
                } else {
                    $scope.toasters.splice(toaster.id, 1);
                    toaster.pop('error', "", response.err);
                }

            })

        }


        /**
         * Request a OneTouch transaction
         */

        $scope.onetouch = function () {
            $scope.showLoader = true;
            $scope.oneTch = true;
            var authydata = {}
            authydata.email = data.data.email;

            Login.onetouch(authydata, function (response) {
                if (response.code === 200) {
                    $scope.onetouch = false;
                    /**
                     * Poll for the status change.  Every 5 seconds for 12 times.  1 minute.
                     */
                    toaster.pop('success', "", response.message);
                    pollingID = $interval(checkonetouchstatus, 5000, 12);
                } else {
                    $scope.oneTch = false;
                    toaster.pop('error', "", response.err);
                }
            })
        }

        /**
         * Request the OneTouch status.
         */
        function checkonetouchstatus() {
            count++;
            if (count == 12) {
                toaster.pop('error', "Timeout");
                $scope.showLoader = false;
                $interval.cancel(pollingID);
                $scope.cancel();
            }
            var authydata = {}
            authydata.email = data.data.email;
            Login.checkonetouchstatus(authydata, function (response) {
                if (response.status === "approved") {
                    $interval.cancel(pollingID);
                    var key = "hashcode";
                    var keypass = "password";
                    var keyauthy = "authyID";

                    delete response.data[key];
                    delete response.data[keypass];
                    delete response.data[keyauthy];

                    $window.localStorage.superAdminUserData = JSON.stringify(response.data);

                    $window.localStorage.superAdmintoken = response.data.duoToken;
                    $window.localStorage.superAdminUserLoggedin = true;
                    $window.localStorage.super_admin = response.data.super_admin;
                    $window.localStorage.logclient_id = response.data.client_id;
                    $scope.userRole(response);
                    toaster.pop('success', "", response.message);
                    $scope.showLoader = false;
                    $scope.cancel();
                    $scope.oneTch = false;
                    // $timeout(function () {

                    //     $state.go('main.dashboard');

                    // }, 500);

                } else if (response.status === "pending") {
                    toaster.pop('warning', "", response.err);
                } else {

                    $scope.cancel();
                    $scope.oneTch = false;
                    $scope.showLoader = false;
                    $interval.cancel(pollingID);
                    $state.go('login');
                }
            })
        }

        /**
         * Verify a SMS, Voice or SoftToken
         */
        $scope.sms = function () {
            $scope.showLoader = true;
            var authydata = {}
            authydata.email = data.data.email;
            Login.sms(authydata, function (response) {
                if (response.code === 200) {
                    $timeout(function () {
                        $scope.showLoader = false;
                        toaster.pop('success', "", response.message);
                        // $state.go('dashboard');
                    }, 500);
                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', "", response.err);
                }
            })
        };

        /**
         * Request a Voice delivered token
         */
        $scope.voiceset = false;
        $scope.voice = function () {
            $scope.showLoader = true;

            var authydata = {}
            authydata.email = data.data.email;
            Login.voice(authydata, function (response) {
                if (response.code === 200) {
                    $scope.showLoader = false;
                    $scope.voiceset = false;
                    $timeout(function () {
                        toaster.pop('success', "", response.message);
                    }, 500);
                } else {
                    $scope.voiceset = false;
                    $scope.showLoader = false;
                    toaster.pop('error', "", response.err);
                }
            })
        };

        /**
         * varifi sms token
         */

        $scope.verify = function () {
            if ($scope.setup.token) {
                var token = {}
                token.email = data.data.email;
                token.smstoken = $scope.setup.token
                Login.verify(token, function (response) {
                    if (response.code === 200) {
                        var key = "hashcode";
                        var keypass = "password";
                        var keyauthy = "authyID";

                        delete response.data[key];
                        delete response.data[keypass];
                        delete response.data[keyauthy];
                        $window.localStorage.superAdminUserData = JSON.stringify(response.data);
                        $window.localStorage.superAdmintoken = response.data.duoToken;
                        $window.localStorage.superAdminUserLoggedin = true;
                        $window.localStorage.super_admin = response.data.super_admin;
                        $window.localStorage.logclient_id = response.data.client_id;
                        $scope.userRole(response);
                        toaster.pop('success', "", response.message);
                        $scope.cancel();
                        // $timeout(function () {

                        //     $state.go('main.dashboard');

                        // }, 500);

                    } else {
                        toaster.pop('error', "", response.err);
                    }
                })
            } else {
                toaster.pop('error', "Please insert your token!");
            }
        };


        $scope.verifyOtp = function (otp) {
            if (otp == undefined) {
                toaster.pop('error', "", 'Please enter your otp!');
            } else {
                var logindata = {}
                logindata.Id = data.id;
                logindata.authy = data.authy;
                Login.verifyOtp(logindata, function (response) {
                    if (response.code === 200) {

                        var key = "hashcode";
                        var keypass = "password";
                        var keyauthy = "authyID";

                        delete response.data[key];
                        delete response.data[keypass];
                        delete response.data[keyauthy];
                        $window.localStorage.superAdminUserData = JSON.stringify(response.data);
                        $window.localStorage.superAdmintoken = response.data.duoToken;
                        $window.localStorage.superAdminUserLoggedin = true;
                        $window.localStorage.super_admin = response.data.super_admin;
                        $window.localStorage.logclient_id = response.data.client_id;
                        $scope.userRole(response);
                        toaster.pop('success', "Successfull login");
                        $scope.cancel();
                        // $timeout(function () {

                        //     $state.go('main.dashboard');

                        // }, 500);

                    } else {
                        toaster.pop('error', "", response.message);
                    }

                })
            }
        }

    }]);
