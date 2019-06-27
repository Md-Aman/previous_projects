'use strict';

angular.module('usergroup', ['ui.router', 'angularUtils.directives.dirPagination'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.add_usergroup', {
        url: '/add/usergroup',
        templateUrl: 'modules/usergroup/views/add_usergroup.html',
        controller: 'UsergroupCtrl',
        parent: 'main',
        authenticate: true
      })

      .state('main.list_usergroup', {
        url: '/list/usergroup',
        templateUrl: 'modules/usergroup/views/list_usergroup.html',
        controller: 'UsergroupCtrl',
        parent: 'main',
        authenticate: true
      })

      .state('main.update_usergroup', {
        url: '/edit/usergroup/:usergroup_id',
        templateUrl: 'modules/usergroup/views/edit_usergroup.html',
        controller: 'UsergroupCtrl',
        parent: 'main',
        authenticate: true
      })
     
  })
  .controller('UsergroupCtrl', function ($scope, toaster, $timeout, Usergroup, ngTableParams, $state, $window) {
    $scope.superAdminUserData = $window.localStorage.superAdminUserData !== undefined ? JSON.parse($window.localStorage.superAdminUserData) : "";
    $scope.fullname = $scope.superAdminUserData.firstname + " " + $scope.superAdminUserData.lastname;
  
    
   
     /* @function : checked all checbox in user permission table 
     *  @author  : Siroi 
     *  @created  : 23-Mar-18
     *  @modified :
     *  @purpose  : to check all checkbox initially 
     */

    $scope.usergroup={trackmanage:'1',currenttravel:'1',riskassessment:'1',riskassessmentothers:'1',
  
    checkinlog:'1',contact:'1',accidents:'1',medical:'1',reports:'1',tbc:'1',userinfo:'1',createusers:'1',editusergroup:'1',bulkupload:'1',
    managesystem:'1',departments:'1',riskassessmenttemplates:'1',labels:'1',timer:'1',countryrisk:'1',activitytype:'1',suppliers:'1',resourcelib:'1',emailtemplates:'1',editcontent:'1',countryinfo:'1',countrythreatcategories:'1',
    mytravel:'1',countrylist:'1',riskassessments:'1',communicate:'1',analytics:'1',traveldata:'1',supplierdata:'1',accidentdata:'1',managementdata:'1',analyticsresoucre:'1',training:'1',appusage:'1',userdata:'1',resourcelibview:'1',resourcelibedit:'1',csuppliers:'1',taccidents:'1',riskassessmentsoverride:'1',
    myprofileemrgncy:'1',myprofilemedical:'1',myprofiletraining:'1'

  }




  //mytravel check all option
  $scope.mytravelall=function(){
    
    var mytravelall=$scope.usergroup.mytravel;
    if(mytravelall ==1 ){
    
    $scope.usergroup.riskassessment='0';
    $scope.usergroup.riskassessmentothers='0';
    $scope.usergroup.checkinlog='0';
    $scope.usergroup.contact='0';
    $scope.usergroup.accidents='0';
    $scope.usergroup.countrylist='0';
    $scope.usergroup.suppliers='0';
    $scope.usergroup.reports='0';
    

    }else if(mytravelall == 0){
     
    $scope.usergroup.riskassessment='1';
    $scope.usergroup.riskassessmentothers='1';
    $scope.usergroup.checkinlog='1';
    $scope.usergroup.contact='1';
    $scope.usergroup.accidents='1';
    $scope.usergroup.countrylist='1';
    $scope.usergroup.suppliers='1';
    $scope.usergroup.reports='1';
    

    }
};

  $scope.managesystemall=function(){
    
    var managesystem=$scope.usergroup.managesystem;
    if(managesystem ==1 ){
    
    $scope.usergroup.departments='0';
    $scope.usergroup.riskassessmenttemplates='0';
    $scope.usergroup.labels='0';
    //$scope.usergroup.timer='0';
   // $scope.usergroup.countryrisk='0';
   // $scope.usergroup.activitytype='0';
    $scope.usergroup.csuppliers='0';
   // $scope.usergroup.resourcelib='0';
    $scope.usergroup.emailtemplates='0';
    $scope.usergroup.editcontent='0';
    $scope.usergroup.countryinfo='0';
    $scope.usergroup.countrythreatcategories='0';

    }else if(managesystem == 0){
     
    $scope.usergroup.departments='1';
    $scope.usergroup.riskassessmenttemplates='1';
    $scope.usergroup.labels='1';
  //  $scope.usergroup.timer='1';
   // $scope.usergroup.countryrisk='1';
   // $scope.usergroup.activitytype='1';
    $scope.usergroup.csuppliers='1';
   // $scope.usergroup.resourcelib='1';
    $scope.usergroup.emailtemplates='1';
    $scope.usergroup.editcontent='1';
    $scope.usergroup.countryinfo='1';
    $scope.usergroup.countrythreatcategories='1';

    }
};

  //Check all based on main menu 

  $scope.trackmanageall=function(){
    
      var trackmanage=$scope.usergroup.trackmanage;
      if(trackmanage ==1 ){
      
      $scope.usergroup.currenttravel='0';
      $scope.usergroup.riskassessments='0';
      $scope.usergroup.riskassessmentsoverride='0';
      $scope.usergroup.communicate='0';
      $scope.usergroup.taccidents='0';
      $scope.usergroup.medical='0';

      }else if(trackmanage == 0){
       
      $scope.usergroup.currenttravel='1';
      $scope.usergroup.riskassessments='1';
      $scope.usergroup.riskassessmentsoverride='1';
      $scope.usergroup.communicate='1';
      $scope.usergroup.taccidents='1';
      $scope.usergroup.medical='1';

      }
  };

  $scope.analyticsall=function(){
    
    var analytics=$scope.usergroup.analytics;
    if(analytics ==1 ){
    
    $scope.usergroup.traveldata='0';
    $scope.usergroup.supplierdata='0';
    $scope.usergroup.accidentdata='0';
    $scope.usergroup.managementdata='0';
    $scope.usergroup.analyticsresoucre='0';
    $scope.usergroup.training='0';
    $scope.usergroup.appusage='0';
    $scope.usergroup.userdata='0';
   
    }else if(analytics == 0){
     
    $scope.usergroup.traveldata='1';
    $scope.usergroup.supplierdata='1';
    $scope.usergroup.accidentdata='1';
    $scope.usergroup.managementdata='1';
    $scope.usergroup.analyticsresoucre='1';
    $scope.usergroup.training='1';
    $scope.usergroup.appusage='1';
    $scope.usergroup.userdata='1';
   
    }
};

$scope.userinfoall=function(){
    
  var userinfo=$scope.usergroup.userinfo;
  if(userinfo ==1 ){
  
  $scope.usergroup.createusers='0';
  $scope.usergroup.editusergroup='0';
  $scope.usergroup.bulkupload='0';
  
  }else if(userinfo == 0){
   
  $scope.usergroup.createusers='1';
  $scope.usergroup.editusergroup='1';
  $scope.usergroup.bulkupload='1';
  }
};

$scope.resourceliball=function(){
    
  var resourcelib=$scope.usergroup.resourcelib;
  if(resourcelib ==1 ){
  
  $scope.usergroup.resourcelibview='0';
  $scope.usergroup.resourcelibedit='0';
  
  
  }else if(resourcelib == 0){
   
  $scope.usergroup.resourcelibview='1';
  $scope.usergroup.resourcelibedit='1';
  
  }
};




    

    /* @function : saveUsergroup
     *  @author  : Siroi 
     *  @created  : 21-Mar-18
     *  @modified :
     *  @purpose  : To save User groups and permissions.
     */
    $scope.saveUsergroup = function (usergroup) {
    
      $scope.showLoader = true;
      if (usergroup) {
        if (!usergroup.typeof_group) {
          $scope.showLoader = false;
          toaster.pop('error', "", "Please select user group type");
        }else{
          if((usergroup.currenttravel != '0' || usergroup.riskassessment != '0' || usergroup.riskassessmentothers != '0' || usergroup.checkinlog != '0' || usergroup.contact != '0' || usergroup.accidents != '0' || usergroup.medical != '0' ||  usergroup.createusers !=0 || usergroup.editusergroup !=0 || usergroup.bulkupload !=0 || usergroup.departments != 0 ||
        
           usergroup.riskassessmenttemplates !=0 ||    usergroup.labels !=0 ||  usergroup. suppliers !=0 ||  usergroup.emailtemplates !=0 || usergroup.editcontent !=0 || usergroup.countryinfo !=0 || usergroup.countrythreatcategories !=0 
         ||  usergroup.countrylist !=0 ||   usergroup.csuppliers !=0 ||  usergroup.reports !=0 || usergroup.riskassessments !=0 ||  usergroup.communicate !=0 || usergroup.traveldata !=0 || usergroup. supplierdata !=0 || usergroup.accidentdata !=0 || usergroup.managementdata !=0 || usergroup.analyticsresoucre !=0 || usergroup.training !=0 || usergroup.appusage !=0 || usergroup.userdata !=0 || usergroup.resourcelibview != 0 || usergroup.resourcelibedit !=0 || usergroup.taccidents !=0 ||  usergroup.riskassessmentsoverride !=0

      
          )){
          
          Usergroup.saveUsergroup(usergroup, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;
              toaster.pop('success', "", response.message);
              $timeout(function () {
                $state.go('main.list_usergroup');
              }, 500);
            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })

        }else{
          toaster.pop('error', "", "Please select any one permission");
        }
        }
      }

    }

     /* @function : getAllUsergroups
     *  @author  : Siroi 
     *  @created  : 21-Mar-18
     *  @modified :
     *  @purpose  : To get all user groups.
     */
    $scope.getAllusergroup = function (keyword) {
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
             
            super_admin=false;
            client_id=$window.localStorage.logclient_id;
              
          }
          Usergroup.getAllusergroup({
            page: page,
            count: count,
            sortby: sorting,
            keyword: keyword,
            super_admin:super_admin,client_id:client_id 
          }, function (response) {
            if (response.code === 200) {
             
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
             params.total(response.count);
              $defer.resolve(response.data);
             $scope.usergroups = response.data;
            
            } else {
              toaster.pop('error', "", response.err);
            }
          });
        }
      });
    }



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

    /* @function : getUsergroupdetails
     *  @author  : Siroi 
     *  @created  : 22-Mar-18
     *  @modified :
     *  @purpose  : To get user group details
     */
    $scope.getUsergroupDetails = function () {
      $scope.usergroups = {};
      var usergroup_id = $state.params.usergroup_id
      if (usergroup_id) {
        console.log(usergroup_id);
        Usergroup.getUsergroupDetails(usergroup_id, function (response) {
          if (response.code === 200) {
           
            $scope.usergroups = response.data;
          //  $scope.usergroup.client = response.data.client_id;
           // console.log(JSON.stringify($scope.usergroup.client));
           //console.log("$scope.newsagencies", $scope.newsagencies)
            
            $scope.getAllClients();
            
          } else {
            $scope.usergroups = [];
          }
        })
      }
    }

   

   
 /* @function : updateUsergroup
     *  @author  : Siroi 
     *  @created  : 22-Mar-18
     *  @modified :
     *  @purpose  : To update user group details.
     */
    $scope.updateUsergroup = function (usergroups) {
      
      if (usergroups) {
        console.log(usergroups)
        
        Usergroup.updateUsergroup(usergroups, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('main.list_usergroup');
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }

    }

     /* @function : deleteUsergroup
     *  @author  : Siroi 
     *  @created  : 22-MAr-18
     *  @modified :
     *  @purpose  : To delete user group.
     */
    $scope.deleteUsergroup = function (usergroup_id) {
      if (usergroup_id) {
        swal({
            title: "Are you sure?",
            text: "You want to delete selected user group?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function () {
            Usergroup.deleteUsergroup(usergroup_id, function (response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllusergroup();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }

  

  

  });
