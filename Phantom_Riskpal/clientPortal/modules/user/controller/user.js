'use strict';

angular.module('user', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.add_user', {
                url: '/user/add',
                templateUrl: 'modules/user/views/add_user.html',
                controller: 'UserCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.user_list', {
                url: '/user/list',
                templateUrl: 'modules/user/views/user_list.html',
                controller: 'UserCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.update_user', {
                url: '/user/update/:user_id',
                templateUrl: 'modules/user/views/user_update.html',
                controller: 'UserCtrl',
                parent: 'main',
                authenticate: true
            })


    })
    .controller('UserCtrl', ['$scope', '$location', 'User','Usergroup','NewsAgencies', 'ngTableParams', '$state', 'toaster', '$timeout','$http','$window', '$sce', function ($scope, $location, User,Usergroup,NewsAgencies, ngTableParams, $state, toaster, $timeout,$http,$window, $sce) {
    $scope.adminUserData = $window.localStorage.adminUserData !== undefined ? JSON.parse($window.localStorage.adminUserData) : "";
    $scope.fullname = $scope.adminUserData.firstname + " " + $scope.adminUserData.lastname;

   
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
  
        $scope.opened = true;
      };
  
      $scope.dtmax = new Date();
      $scope.today = new Date();

         /* @function : filterclients
     *  @author  : Siroi 
     *  @created  : 21-Mar-18
     *  @modified :
     *  @purpose  : To get all client list for creating 
     */
    $scope.getAllClients = function () {
        Usergroup.getAllClients(function (response) {
          if (response.code == 200) {
            $scope.clientArr = response.data;
          } else {
            $scope.clientArr = {};
          }
        })
  
      }


        /* @function : getDepartDetails
         *  @author  : Siroi 
         *  @created  : 24-Mar-18
         *  @modified :
         *  @purpose  : To get department list.
         */
        $scope.getDepartmentList = function () {
            User.getDepartmentList(function (response) {
                if (response.code == 200) {
                    $scope.departmentArr = response.data;
                } else {
                    $scope.departmentArr = [];
                }
            })
        }


        /* @function : addDepartment
          *  @author  : MadhuriK 
          *  @created  : 12-Apr-17
          *  @modified :
          *  @purpose  : To add department onclick on plus button.
          */
        // $scope.departmentArr = [{ department: "" }];
        // $scope.addDepartment = function () {
        //     var department = { department: "" }
        //     $scope.departmentArr.push(department);
        // }


        /* @function : removeDepartment
          *  @author  : MadhuriK 
          *  @created  : 12-Apr-17
          *  @modified :
          *  @purpose  : To remove department onclick on minus button.
          */
        // $scope.removeDepartment = function () {
        //     var lastItem = $scope.departmentArr.length - 1;
        //     $scope.departmentArr.splice(lastItem);
        // }


        /* @function : addProject
          *  @author  : MadhuriK 
          *  @created  : 12-Apr-17
          *  @modified :
          *  @purpose  : To add project onclick on plus button.
          */
        $scope.projectArr = [{ project: "" }];
        $scope.addProject = function () {
            var project = { project: "" }
            $scope.projectArr.push(project);
        }


        /* @function : removeProject
          *  @author  : MadhuriK 
          *  @created  : 12-Apr-17
          *  @modified :
          *  @purpose  : To remove project onclick on minus button.
          */
        $scope.removeProject = function () {
            var lastItem = $scope.projectArr.length - 1;
            $scope.projectArr.splice(lastItem);
        }



        /* @function : addReportsTo
          *  @author  : MadhuriK 
          *  @created  : 12-Apr-17
          *  @modified :
          *  @purpose  : To add reports to onclick on plus button.
          */
        $scope.reportsToArr = [{ reportsTo: "" }];
        $scope.addReportsTo = function () {
            var reportsTo = { reportsTo: "" }
            $scope.reportsToArr.push(reportsTo);
        }


        /* @function : removeReportsTo
          *  @author  : MadhuriK 
          *  @created  : 12-Apr-17
          *  @modified :
          *  @purpose  : To remove reports to onclick on minus button.
          */
        $scope.removeReportsTo = function () {
            var lastItem = $scope.reportsToArr.length - 1;
            $scope.reportsToArr.splice(lastItem);
        }

        /* @function : getUsergroup list based on client
         *  @author  : Siroi 
         *  @created  : 26-Mar-18
         *  @modified :
         *  @purpose  : Togetusergroup list
         */

         $scope.clientusergroup= function(userform){


            var client_id=JSON.parse(userform.client)._id;
            User.getUsergroups(client_id,function (response) {
                
                if (response.code == 200) {

                    
                  $scope.usergroupArr = response.data;
                } else {
                  $scope.usergroupArr = {};
                }
              })
            

         };


         /* @function : get departments based  on client selection in only super admin
         *  @author  : Siroi 
         *  @created  : 26-Mar-18
         *  @modified :
         *  @purpose  : Togetusergroup list
         */

        $scope.getDepartmentusers= function(userform){


            var client_id=JSON.parse(userform.client)._id;
            User.getDepartmentusers(client_id,function (response) {
                
                if (response.code == 200) {
          console.log(response.data);
                    
                  $scope.departmentArr = response.data;
                } else {
                  $scope.departmentArr = {};
                }
              })
            

         };

           /* @function : get departments based  on client selection in only super admin
         *  @author  : Siroi 
         *  @created  : 26-Mar-18
         *  @modified :
         *  @purpose  : Togetusergroup list
         */

        $scope.getDepartmentusersedit= function(client_id){


          //  var client_id=JSON.parse(userform.client)._id;
            User.getDepartmentusers(client_id,function (response) {
                
                if (response.code == 200) {
         
                    
                  $scope.userdepartment = response.data;
                } else {
                  $scope.userdepartment = {};
                }
              })
            

         };

           


  /* @function : getUsergroup list based on logged users not in super admin
         *  @author  : Siroi 
         *  @created  : 26-Mar-18
         *  @modified :
         *  @purpose  : To getusergroup list
         */

         $scope.usereditclientusergroup= function(client_id){

            console.log("not file");

console.log(client_id);
           // var client_id='5aafb1907bf48d1ee884fa68';
            User.getUsergroups(client_id,function (response) {
                
                if (response.code == 200) {

                    console.log("fdtrt");
                  $scope.usergroupArr = response.data;
                } else {
                  $scope.usergroupArr = {};
                }
              })
            

         };

          /* @function : saveUser
         *  @author  : Siroi 
         *  @created  : 26-Mar-18
         *  @modified :
         *  @purpose  : To save the user details
         */
        $scope.saveUser = function (userform) {

            
             $scope.showLoader = true;
          
             
             var  departmentArr = [];
             var  userdepartment =[];

             if(localStorage.super_admin == "true"){
               userform.super_admin=1;
               userform.departmentArr.forEach(function (data) {
                departmentArr.push(data._id);
            })

            userform.department = departmentArr;
               
             }else{
                
                userform.super_admin=0;
                userform.client_id=$window.localStorage.logclient_id;
               //  console.log(localStorage.logclient_id);
               userform.userdepartment.forEach(function (data) {
                userdepartment.push(data._id);
            })

            userform.department = userdepartment;
             }
             userform.passport_data=$scope.passport_de;

           
             
            

             User.saveUser(userform, function (response) {

                 if (response.code === 200) {
                     $scope.showLoader = false;
                     toaster.pop('success', "", response.message);
                     console.log(response.message);
                   
                     $timeout(function () {
                         $state.go('main.user_list');
                     }, 500);
                 } else {
                     $scope.showLoader = false;
                     $scope.showError(response);
                     
                     console.log(response.message+"dd");
                   
                 }
             })
         
     }
     $scope.showError = function (response) {
        let msg = '';
        if ( typeof response == 'Object' ) {
            if (response.message.length > 0 ) {
                response.message.forEach(item => {
                    msg += "<span style='font-weight:bold;'>" + item.param.replace(/_/g, ' ') + ': </span>' + item.msg + "<br>";
                });
            
                $scope.messageError = $sce.trustAsHtml(msg);
                setTimeout(() => {
                    $scope.messageError = '';
                }, 5000)
                toaster.pop('error', "", response.err);
            } else {
                toaster.pop('error', "", response.message);
            }
        }
        else {
            toaster.pop('error', "", response.message);
        }
     }

        /* @function : getAllUser
         *  @author  : Siroi 
         *  @created  : 26-Mar-18
         *  @modified :
         *  @purpose  : To get list of all users.
         */
        $scope.getAllUser = function (keyword) {
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
                        if(localStorage.super_admin == "true"){
                            var super_admin=true;
                          
                             var client_id='';
                          }else{
                             
                           var super_admin=false;
                           var client_id=$window.localStorage.logclient_id;
                              
                          }
                        User.getAllUser({ page: page, count: count, sortby: sorting, keyword: keyword,super_admin:super_admin,client_id:client_id }, function (response) {
                            if (response.code === 200) {
                                console.log(response.data)

                                params.settings().counts = [];
                                if (response.count > 10) {
                                  params.settings().counts.push(10);
                                  params.settings().counts.push(25);
                                }
                                if (response.count > 25) {
                                  params.settings().counts.push(50);
                                }
                                if (response.count > 50) {
                                  params.settings().counts.push(100);
                                }
                              
                                
                                response.data.forEach(function (user) {
                                    user.departmentArr = [];
                                    user.approvingArr = [];
                                    user.department.forEach(function (depart) {
                                        console.log("fdfddd"+depart.department_name);
                                        user.departmentArr.push(depart.department_name);
                                       
                                    })
                                })




                                params.total(response.count);
                                $defer.resolve(response.data);
                                $scope.UserData = response.data;
                               
                                console.log($scope.UserData);
                            } else {
                                toaster.pop('error', "", response.err);
                            }
                        });
                    }
                });
        }







        /* @function : saveApprovingManager
         *  @author  : MadhuriK 
         *  @created  : 13-Apr-17
         *  @modified :
         *  @purpose  : To add the approving manager.
         */
        $scope.saveApprovingManager = function (approving_manager) {
               approving_manager.fullname= $scope.fullname;
            if (approving_manager.department.length == 0) {
                toaster.pop('error', "", "Please select atleast one department");
            } else {
                $scope.showLoader = true;
                approving_manager.project = [];
                approving_manager.reportsTo = [];

                approving_manager.project = $scope.projectArr;
                approving_manager.reportsTo = $scope.reportsToArr;
                ApprovingManager.addApprovingManager(approving_manager, function (response) {

                    if (response.code === 200) {
                        $scope.showLoader = false;
                        toaster.pop('success', "", response.message);
                        $timeout(function () {
                            $state.go('main.list_approving_manager');
                        }, 500);
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', "", response.err);
                    }
                })
            }
        }



        /* @function : getAllApprovingManager
         *  @author  : MadhuriK 
         *  @created  : 13-Apr-17
         *  @modified :
         *  @purpose  : To get list of all the approving manager.
         */
        $scope.getAllApprovingManager = function (keyword) {
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
                        ApprovingManager.listApprovingManager({ page: page, count: count, sortby: sorting, keyword: keyword }, function (response) {
                            if (response.code === 200) {
                                params.total(response.count);
                                $defer.resolve(response.data);
                                $scope.ApprovingManagerData = response.data;
                            } else {
                                toaster.pop('error', "", response.err);
                            }
                        });
                    }
                });
        }


        /* @function : changeStatus
         *  @author  : Siroi 
         *  @created  : 13-Apr-17
         *  @modified : 27 -mar-18
         *  @purpose  : To change to user status.
         */
        $scope.changeStatus = function (user_status, user_id) {
            var userstatus = user_status == 'Active' ? 'Inactive' : 'Active';
            if (user_status && user_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to " + userstatus + " selected user?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        var user = {};
                        user.id = user_id;
                        user.status = userstatus;
                        User.changeUserStatus(user, function (response) {
                            if (response.code === 200) {
                                toaster.pop('success', "", response.message);
                                $scope.getAllUser();
                            } else {
                                toaster.pop('error', "", response.err);
                            }

                        });
                    });
            }
        }

     /* @function : getUserDetails
     *  @author  : Siroi 
     *  @created  : 22-Mar-18
     *  @modified :
     *  @purpose  : To get user group details
     */
    $scope.getUserDetails = function () {
        $scope.userform = {};
        var user_id = $state.params.user_id;
        if (user_id) {
         
          User.getUserDetails(user_id, function (response) {
              
            if (response.code === 200) {
             
              $scope.userform = response.data;
              $scope.userform.client = response.data.client_id;
              $scope.usereditclientusergroup(response.data.client_id); 
              User.getDepartmentusers(response.data.client_id,function (result) {
                if (result.code === 200) {
                    $scope.departmentArr = result.data;
                    $scope.departmentArr.forEach(function (department) {
                        response.data.department.forEach(function (final_ap) {
                            if (department._id == final_ap) {
                                department.ticked = true;
                            }
                        })
                       
                    })
                }
            })

            
          

              $scope.personal_details = response.data;
              $scope.passport_details = response.data.passport_details;
         
          $scope.passport_de = $scope.personal_details.passport_data;
          if (response.data.passport_details) {
            $scope.passport_details.full_name = response.data.passport_details.emergency_contact.full_name;
            $scope.passport_details.mobile_number = response.data.passport_details.emergency_contact.mobile_number;
            $scope.passport_details.email = response.data.passport_details.emergency_contact.email;
            $scope.passport_details.relationship_to_you = response.data.passport_details.emergency_contact.relationship_to_you;
            $scope.passport_details.alternative_full_name = response.data.passport_details.emergency_contact.alternative_full_name;
            $scope.passport_details.alternative_mobile_number = response.data.passport_details.emergency_contact.alternative_mobile_number;
            $scope.passport_details.alternative_email = response.data.passport_details.emergency_contact.alternative_email;
            $scope.passport_details.alternative_relationship_to_you = response.data.passport_details.emergency_contact.alternative_relationship_to_you;
          }
              
        
            } else {
              $scope.userform = [];
            }
          })
        }
      }


        /* @function : deleteUser
         *  @author  : Siroi 
         *  @created  : 27-Mar-18
         *  @modified :
         *  @purpose  : To delete to user.
         */
        $scope.deleteUsers = function (user_id) {
            if (user_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to delete?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        User.deleteUsers(user_id, function (response) {
                            if (response.code === 200) {
                                toaster.pop('success', "", response.message);
                                $scope.getAllUser();
                            } else {
                                toaster.pop('error', "", response.message);
                            }

                        });
                    });
            }
        }



        /* @function : getApprovalManagerDetails
         *  @author  : MadhuriK 
         *  @created  : 13-Apr-17
         *  @modified :
         *  @purpose  : To get Approving Manager details.
         */
        $scope.getApprovalManagerDetails = function () {
            var approving_manager_id = $state.params.approving_manager_id;
            ApprovingManager.getApprovalManagerDetails(approving_manager_id, function (response) {
                if (response.code === 200) {
                    response.data.threat_level = "'" + response.data.threat_level + "'";

                    ApprovingManager.getDepartmentList(function (result) {
                        if (result.code == 200) {
                            $scope.departmentArr = result.data;
                            if ($scope.departmentArr.length > 0) {
                                $scope.departmentArr.forEach(function (departmentObj) {
                                    response.data.department.forEach(function (depart) {
                                        if (departmentObj._id == depart) {
                                            departmentObj.ticked = true;
                                        }
                                    })
                                })
                            }
                        }
                    })
                    $scope.projectArr = response.data.project;
                    $scope.reportsToArr = response.data.reportsTo;
                    $scope.approving_manager = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            })

        }



        /* @function : updateUser
         *  @author  : Siroi 
         *  @created  : 27-Mar-18
         *  @modified :
         *  @purpose  : To update User.
         */
        $scope.updateUser = function (userform) {

         
           if(!userform.mobile_number) {
              toaster.pop('error', "", "Please add mobile number");
            }else{
                userform.id = $state.params.user_id;
                userform.dob= $scope.personal_details.dob;
                userform.gender= $scope.personal_details.gender;
                userform.proof_of_life_question= $scope.personal_details.proof_of_life_question;
                userform.proof_of_life_answer= $scope.personal_details.proof_of_life_answer;
                userform.passport_data=$scope.passport_de;
                userform.passport_details ={
                  passport_number: $scope.passport_details?$scope.passport_details.passport_number:'',
                  emergency_contact: {
                    full_name: $scope.passport_details?$scope.passport_details.full_name:'',
                    mobile_number: $scope.passport_details?$scope.passport_details.mobile_number:'',
                    email: $scope.passport_details?$scope.passport_details.email:'',
                    relationship_to_you: $scope.passport_details?$scope.passport_details.relationship_to_you:'',
                    alternative_full_name: $scope.passport_details?$scope.passport_details.alternative_full_name:'',
                    alternative_mobile_number: $scope.passport_details?$scope.passport_details.alternative_mobile_number:'',
                    alternative_email: $scope.passport_details?$scope.passport_details.alternative_email:'',
                    alternative_relationship_to_you: $scope.passport_details?$scope.passport_details.alternative_relationship_to_you:''
                  }
                }

                var  departmentArr = [];
                userform.departmentArr.forEach(function (data) {
                     departmentArr.push(data._id);
                 })
     
                 userform.department = departmentArr;
           
                User.updateUser(userform, function (response) {
                    if (response.code === 200) {
                        toaster.pop('success', "", response.message);
                        $timeout(function () {
                            $state.go('main.user_list');
                        }, 500);
                    } else {
                        $scope.showError(response);
                    }
                })
            }
        }

        /* @function : importUser
         *  @author  : Siroi 
         *  @created  : 29-Mar-18
         *  @modified :
         *  @purpose  : To import user from csv file.
         */


      
         
         $scope.importUser = function(myFile) {
            
                var file = myFile[0];
                console.log("fd");
                var fd = new FormData();
                fd.append('file', file);
                $scope.showLoader = true;
                $http.post('https://' + window.location.host +'/admin/importApprovingmanager', fd, {
                      
                transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    },
                }).success(function(data) {
                    console.log("function");
                    if (data.code == 200) {
                        $scope.showLoader = false;
                        console.log("success");
                        angular.element('.modal-backdrop.fade.in').removeClass('modal-backdrop');
                        angular.element('body').removeClass('modal-open');
                        $timeout(function () {
                        $state.reload();
                        }, 2000);
                        toaster.pop('success', "", data.message);
                    } else {
                        $scope.showLoader = false;
                        console.log("failure");
                        angular.element('.modal-backdrop.fade.in').removeClass('modal-backdrop');
                        angular.element('body').removeClass('modal-open');
                        $timeout(function () {
                        $state.reload();
                        }, 2000);
                           toaster.pop('error', "",data.message);
                    }
              })
       }



         /* @function : addMobileNumber
     *  @author  : MadhuriK 
     *  @created  : 07-Apr-17
     *  @modified :
     *  @purpose  : To mobile numbers.
     */
    $scope.mobilenumber = [{ mobile_number: "" }];
    $scope.addMobileNumber = function() {
      var mobileNumber = { mobile_number: "" }
      $scope.mobilenumber.push(mobileNumber);
    }



    /* @function : removeMobileNumber
     *  @author  : MadhuriK 
     *  @created  : 07-Apr-17
     *  @modified :
     *  @purpose  : To remove mobile number.
     */
    $scope.removeMobileNumber = function() {
      var lastItem = $scope.mobilenumber.length - 1;
      $scope.mobilenumber.splice(lastItem);
    }



    /* @function : addPassportDetails
     *  @author  : MadhuriK 
     *  @created  : 07-Apr-17
     *  @modified :
     *  @purpose  : To add passport details.
     */
    $scope.passport_de = [{ nationality: "", passport_number: "",issuedate:"",expirydate:"" }];
    $scope.addPassportDetails = function() {
      var passportArr = { nationality: "", passport_number: "",issuedate:"",expirydate:"" }
      $scope.passport_de.push(passportArr);
    }



    /* @function : removePassportDetails
     *  @author  : MadhuriK 
     *  @created  : 07-Apr-17
     *  @modified :
     *  @purpose  : To remove passport details.
     */
    $scope.removePassportDetails = function() {
      var lastItem = $scope.passport_de.length - 1;
      $scope.passport_de.splice(lastItem);
    }


    /* @function : getProofOfLife
     *  @author  : MadhuriK 
     *  @created  : 17-Apr-17
     *  @modified :
     *  @purpose  : To get proof of life questions.
     */
    $scope.getProofOfLifeQuestions = function() {
        User.getProofOfLifeQuestions(function(response) {
        if (response.code == 200) {
          $scope.proofOfLifeQuestions = response.data;
        } else {
          $scope.proofOfLifeQuestions = [];
        }
      })
    }


       /* @function : getCountries
     *  @author  : MadhuriK 
     *  @created  : 18-Apr-17
     *  @modified :
     *  @purpose  : To get all Countries.
     */
    $scope.getCountries = function() {
        User.getCountries(function(response) {
        if (response.code === 200) {
          $scope.countryArr = response.data;
        }
      })
    }


    }]);
