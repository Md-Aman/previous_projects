'use strict';

angular.module('department', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.add_department', {
                url: '/add/department',
                templateUrl: 'modules/department/views/add_department.html',
                controller: 'DepartmentCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.list_department', {
                url: '/list/department',
                templateUrl: 'modules/department/views/list_department.html',
                controller: 'DepartmentCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.update_department', {
                url: '/update/department/:department_id',
                templateUrl: 'modules/department/views/update_department.html',
                controller: 'DepartmentCtrl',
                parent: 'main',
                authenticate: true
            })

    })
    .controller('DepartmentCtrl', ['$scope', '$location', 'Department', 'ngTableParams', '$state', 'toaster', '$timeout', 'Upload', '$window', '$sce', function ($scope, $location, Department, ngTableParams,  $state, toaster, $timeout, Upload, $window, $sce) {


        $scope.super_admin =  $window.localStorage.super_admin;
        $scope.getClient = function () {
          // get clients if super admin / RPStaff
          if ( $scope.super_admin == 'true' ) {
            Department.getClients(function (response) {
                if (response.code === 200) {
                    $scope.clients = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            });
          }
        }
        /* @function : getAllApprovingManagers
        *  @author  : MadhuriK
        *  @created  : 01-Jun-17
        *  @modified :
        *  @purpose  : To get all the approving manager.
        */
        $scope.getUsers = function () {
            var client_id = $window.localStorage.logclient_id;
            var super_admin = $window.localStorage.super_admin;
            $scope.super_admin = super_admin;
            if ( super_admin != 'true' ) {
                console.log(client_id);
                Department.getUsers(client_id, function (response) {
                    if (response.code === 200) {
                        $scope.userlist = response.data;
                    } else {
                        toaster.pop('error', "", response.err);
                    }
                })
            } else {
                // get clients if super admin / RPStaff
                $scope.getClient();
            }

        }

        $scope.getAllOtherData = function (client_id) {
            $scope.client = client_id;
            Department.getUsers(client_id, function (response) {
                if (response.code === 200) {
                    $scope.userlist = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            });
            Department.getUsers_trackconnect(client_id, function (response) {
                if (response.code === 200) {
                    var filterData = _.filter(response.data, function (obj) {
                        if (obj.roleId) {
                            return (obj.roleId.trackmanage.parentId == 1  ||  obj.roleId.trackmanage.riskassessments ==1);
                        }
                    });
                    $scope.userlist_trackconnect = filterData;
                } else {
                    toaster.pop('error', "", response.err);
                }
            });

            Department.getTemplates(client_id, function (response) {
                console.log(response)

                if (response.code === 200) {
                    $scope.templatelist = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            });
        }


        /* @function : getUsers_trackconnect
         *  @author  :  Souqbox
         *  @created  : 05-Sep-18
         *  @modified :
         *  @purpose  : To get all user wha are all having track & Connection menu .
         */
        $scope.getUsers_trackconnect = function () {
            var client_id = $window.localStorage.logclient_id;
            var super_admin = $window.localStorage.super_admin;
            if ( super_admin != 'true' ) {
                Department.getUsers_trackconnect(client_id, function (response) {
                    if (response.code === 200) {
                        var filterData = _.filter(response.data, function (obj) {
                            if (obj.roleId) {
                                return (obj.roleId.trackmanage.parentId == 1  ||  obj.roleId.trackmanage.riskassessments ==1);
                            }
                        });
                        $scope.userlist_trackconnect = filterData;
                    } else {
                        toaster.pop('error', "", response.err);
                    }
                });
            }
        }

        /* @function : getUsers_trackconnect
         *  @author  :  Souqbox
         *  @created  : 05-Sep-18
         *  @modified :
         *  @purpose  : To get all user wha are all having track & Connection menu .
         */
        $scope.getTemplates = function () {
            var client_id = $window.localStorage.logclient_id;
            var super_admin = $window.localStorage.super_admin;
            if ( super_admin != 'true' ) {
                Department.getTemplates(client_id, function (response) {
                    console.log(response)

                    if (response.code === 200) {
                        $scope.templatelist = response.data;
                    } else {
                        toaster.pop('error', "", response.err);
                    }
                });
            }
        }




        /* @function : getAllApprovingManagers
          *  @author  : MadhuriK
          *  @created  : 01-Jun-17
          *  @modified :
          *  @purpose  : To get all the approving manager.
          */
        $scope.getAllApprovingManagers = function () {
            Department.getAllApprovingManagers(function (response) {
                if (response.code === 200) {
                    $scope.final_approving_manager = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }

        $scope.getAllApprovingManagersfinal = function () {
            Department.getAllApprovingManagers(function (response) {
                if (response.code === 200) {
                    $scope.alternative_final_approving_manager = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }

        $scope.getAllApprovingManagersintermediate = function () {
            Department.getAllApprovingManagers(function (response) {
                if (response.code === 200) {
                    $scope.intermediate_approving_manager = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }

        $scope.getAllBasicAdmin = function () {
            Department.getBasicAdminforDepartment(function (response) {
                if (response.code === 200) {
                    $scope.basic_admin = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }

        // $scope.getTravellersForDepartment = function () {
        //      Department.getTravellersForDepartment(function (response) {
        //          if (response.code === 200) {
        //              $scope.TravellersForDepartment = response.data;
        //          } else {
        //              toaster.pop('error', "", response.err);
        //          }
        //      })
        //  }
        /* @function : saveDepartment
          *  @author  : MadhuriK
          *  @created  : 01-Jun-17
          *  @modified :
          *  @purpose  : To create department.
          */
        $scope.saveDepartment = function (departmentData, client) {
            $scope.showLoader = true;

            var super_admin = $window.localStorage.super_admin;
            console.log('departmenttt', departmentData);
            if ( super_admin == 'true' || super_admin == true ) {
                console.log('innn', client);
                departmentData.client_id = client;
            } else {
                departmentData.client_id = $window.localStorage.logclient_id;
            }
            console.log('department', departmentData);
            Department.saveDepartment(departmentData, function (response) {
                if (response.code === 200) {

                    $scope.showLoader = false;
                    toaster.pop('success', "", response.message);
                    $timeout(function () {
                        $state.go('main.list_department');
                    }, 500);
                } else {
                    $scope.showLoader = false;
                    $scope.showErrors(response.message);
                    toaster.pop('error', "", response.err);
                }
            })
        }





        /* @function : getAllDepartment
         *  @author  : MadhuriK
         *  @created  : 01-Jun-17
         *  @modified :
         *  @purpose  : To get all department.
         */
        $scope.getAllDepartment = function (keyword) {
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10,
                sorting: {
                    createdAt: 'desc' // initial sorting
                }
            }, {
                    getData: function ($defer, params) {
                        var page = params.page();
                        var count = params.count();
                        var sorting = params.sorting();
                        var client_id = $window.localStorage.logclient_id;
                        Department.getAllDepartment({ page: page, count: count, sortby: sorting, keyword: keyword, client_id: client_id, super_admin: $window.localStorage.super_admin }, function (response) {
                            if (response.code === 200) {

                                params.total(response.count);
                                $defer.resolve(response.data);
                                $scope.departmentData = response.data;
                            } else {
                                toaster.pop('error', "", response.err);
                            }
                        });
                    }
                });
        }


        /* @function : deleteDepartment
         *  @author  : MadhuriK
         *  @created  : 01-Jun-17
         *  @modified :
         *  @purpose  : To delete department.
         */
        $scope.deleteDepartment = function (department_id) {
            if (department_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to delete selected department?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        Department.deleteDepartment(department_id, function (response) {
                            if (response.code === 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                                $scope.getAllDepartment();
                            } else {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('error', "", response.err);
                            }

                        });
                    });
            }
        }

        $scope.showErrors = function (errorArray) {
            let msg = '';
            var re = new RegExp('_', 'g');
            if (errorArray.length > 0 ) {
                errorArray.forEach(item => {
                msg += "<span style='font-weight:bold;'>" + item.param.replace(re, ' ') + ': </span>' + item.msg + "<br>";
                });
            }
            $scope.messageError = $sce.trustAsHtml(msg);
            setTimeout(() => {
                $scope.messageError = '';
            }, 5000)
        }
        /* @function : changeStatus
        *  @author  : MadhuriK
        *  @created  : 01-Jun-17
        *  @modified :
        *  @purpose  : To change status of department.
        */
        $scope.changeStatus = function (department_status, department_id) {
            var departmentStatus = department_status == 'Active' ? 'Inactive' : 'Active';
            if (department_status && department_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to " + departmentStatus + " selected question?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        var department = {};
                        department.id = department_id;
                        department.status = departmentStatus;
                        Department.changeDepartmentStatus(department, function (response) {
                            if (response.code === 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                                $scope.getAllDepartment();
                            } else {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('error', "", response.err);
                            }

                        });
                    });
            }
        }


        /* @function : getDepartmentDetail
       *  @author  : MadhuriK
       *  @created  : 01-Jun-17
       *  @modified :
       *  @purpose  : To get department details.
       */
        $scope.getDepartmentDetail = function () {
            var department_id = $state.params.department_id;
            if (department_id) {
                Department.getDepartmentDetail(department_id, function (response) {
                    if (response.code === 200) {
                        var client_id = $window.localStorage.logclient_id;
                        var super_admin = $window.localStorage.super_admin;
                        if ( super_admin == 'true' ) {
                            client_id = response.data.client_id;
                        }

                        Department.getUsers_trackconnect(client_id, function (response1) {
                            if (response1.code === 200) {
                                 var filterData = _.filter(response1.data, function (obj) {
                                     if (obj.roleId) {
                                         return (obj.roleId.trackmanage.parentId == 1  ||  obj.roleId.trackmanage.riskassessments ==1);
                                     }
                                 });
                                 $scope.userlist_trackconnect = filterData;

                                 $scope.userlist_trackconnect.forEach(function (userlist) {
                                    response.data.alternative_final_approving_manager.forEach(function (final_ap) {
                                        if (userlist._id == final_ap) {
                                            userlist.ticked = true;
                                        }
                                    })

                                })

                            }
                        })

                           //Get realted templates to current department



                            Department.getTemplates(client_id, function (response2) {

                                if (response2.code === 200) {
                                    $scope.templatelist = response2.data;

                                    Department.getRelatedTemplate(department_id, function(relatedtemplates){

                                        $scope.templatelist.forEach(function (templatelist) {
                                            relatedtemplates.data.forEach(function (final_ap) {
                                                if (templatelist._id == final_ap._id) {
                                                    templatelist.ticked = true;
                                                }
                                            })

                                        })

                                    })

                                }
                            })

                            Department.getUsers(client_id, function (response3) {
                                if (response3.code === 200) {
                                    $scope.userlist = response3.data;

                                    Department.getRelatedUser(department_id, function(relatedusers){

                                        $scope.userlist.forEach(function (userlist) {
                                            relatedusers.data.forEach(function (final_ap) {
                                                if (userlist._id == final_ap._id) {
                                                    userlist.ticked = true;
                                                }
                                            })

                                        })

                                    })




                                }
                            })
                        $scope.client = response.data.client_id;
                        $scope.department = response.data;
                        $scope.department.department_name = $scope.htmlDecode(response.data.department_name);
                    } else {
                        $scope.department = {};
                    }
                })
            }

        }
        $scope.htmlDecode = function (input)
        {
          var doc = new DOMParser().parseFromString(input, "text/html");
          return doc.documentElement.textContent;
        }
        /* @function : updateDepartment
      *  @author  : MadhuriK
      *  @created  : 02-Jun-17
      *  @modified :
      *  @purpose  : To update department details.
      */
        $scope.updateDepartment = function (departmentData, client) {
            var super_admin = $window.localStorage.super_admin;
            if ( super_admin == 'true' ) {
                departmentData.client_id = client;
            } else {
                departmentData.client_id = $window.localStorage.logclient_id;
            } console.log('departmentData', departmentData);
            Department.updateDepartment(departmentData, function (response) {
                if (response.code === 200) {
                    toaster.pop('success', "", response.message);
                    $timeout(function () {
                        $state.go('main.list_department');
                    }, 500);
                } else {
                    $scope.showErrors(response.message);
                    toaster.pop('error', "", response.err);
                }
            })
        }


    }]);
