'use strict';

angular.module('profile', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.myprofile', {
        url: '/myprofile',
        templateUrl: 'modules/profile/views/profile.html',
        controller: 'ProfileCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.emergency', {
        url: '/emergency',
        templateUrl: 'modules/profile/views/emergency.html',
        controller: 'ProfileCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.medicalinfo', {
        url: '/medicalinfo',
        templateUrl: 'modules/profile/views/medicalinfo.html',
        controller: 'ProfileCtrl',
        parent: 'main',
        authenticate: true
      })
        .state('main.password', {
        url: '/profile_detail',
        templateUrl: 'modules/profile/views/password.html',
        controller: 'ProfileCtrl',
        parent: 'main',
        authenticate: true
      });

      
      

  })
  .controller('ProfileCtrl', function($scope, toaster, $timeout, MasterAdminProfile, Upload, $rootScope, $window,$location,$state) {

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dtmax = new Date();
    $scope.today = new Date();
   
    $scope.medical_info = {};
    $scope.medical_info.yellow_fever_vaccination = { startDate: null, endDate: null };
    $scope.medical_info.hepA_vaccination = { startDate: null, endDate: null };
    $scope.medical_info.hepB_vaccination = { startDate: null, endDate: null };
    $scope.medical_info.tet_dip_polio_vaccination = { startDate: null, endDate: null };
    $scope.medical_info.rabies_vaccination = { startDate: null, endDate: null };
    $scope.medical_info.cholera_vaccination = { startDate: null, endDate: null };
    $scope.medical_info.meningitis_vaccination = { startDate: null, endDate: null };
    $scope.medical_info.typhoid_vaccination = { startDate: null, endDate: null };

    /* @function : updateMedicalInfo
     *  @author  : MadhuriK 
     *  @created  : 18-Apr-17
     *  @modified :
     *  @purpose  : To update medical information of traveller.
     */
    $scope.getMasterAdminDetails = function(id) {
      $scope.showLoader = true;
      console.log(id);
      var userdata={};
      userdata.id=id;
      MasterAdminProfile.getMasterAdminDetails(userdata,function(response) {
        $scope.showLoader = false;
        if (response.code === 200) {
          $scope.medical_info = response.data.medical_info;

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
          console.log(response.data);
          $window.localStorage.superAdminUserData = JSON.stringify(response.data);
        } else {
          $scope.showLoader = false;
          toaster.pop('error', "", response.err);
        }
      })
    }


    /* @function : updatePersonalDetails
     *  @author  : MadhuriK 
     *  @created  : 18-Apr-17
     *  @modified :
     *  @purpose  : To update personal details of traveller.
     */
    $scope.updateAdminDetails = function(superadmindata) {
      console.log("superid",$scope.personal_details.dob)
    

      superadmindata.ids=superadmindata._id;
      superadmindata.dob= $scope.personal_details.dob;
      superadmindata.gender= $scope.personal_details.gender;
      superadmindata.proof_of_life_question= $scope.personal_details.proof_of_life_question;
      superadmindata.proof_of_life_answer= $scope.personal_details.proof_of_life_answer;
      superadmindata.passport_data=$scope.passport_de;
      superadmindata.passport_details ={
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



      MasterAdminProfile.updateAdminDetails(superadmindata, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
          $scope.getMasterAdminDetails(superadmindata._id);
          $timeout(function() {
            $state.go('main.myprofile');
          }, 500);
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }

     /* @function : updatePersonalDetails
     *  @author  : MadhuriK 
     *  @created  : 18-Apr-17
     *  @modified :
     *  @purpose  : To update personal details of traveller.
     */
    $scope.updateEmergencyDetails = function(superadmindata) {
      console.log("superid",$scope.personal_details.dob)
    

      superadmindata.ids=superadmindata._id;
      superadmindata.dob= $scope.personal_details.dob;
      superadmindata.gender= $scope.personal_details.gender;
      superadmindata.proof_of_life_question= $scope.personal_details.proof_of_life_question;
      superadmindata.proof_of_life_answer= $scope.personal_details.proof_of_life_answer;
      superadmindata.passport_data=$scope.passport_de;
      superadmindata.passport_details ={
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



      MasterAdminProfile.updateAdminDetails(superadmindata, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
          $scope.getMasterAdminDetails(superadmindata._id);
          $timeout(function() {
            $state.go('main.emergency');
          }, 500);
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }



    /* @function : uploadProfilePic
     *  @author  : MadhuriK 
     *  @created  : 18-Apr-17
     *  @modified :
     *  @purpose  : To upload profile pic of traveller.
     */
    $scope.uploadProfilePic = function(file) {
      if (file) {
        var extension = file.name.split(/[\s.]+/);
        var exe = extension[extension.length - 1].toLowerCase();
        if (exe == 'jpeg' || exe == 'jpg' || exe == 'png' || exe == 'gif') {
          file.upload = Upload.upload({
            url: '/traveller/uploadProfilePic',
            data: { file: file }
          }).then(function(resp) {
            $scope.personal_details.profile_pic = resp.data.data;
          }, function(resp) {}, function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          });
        } else {
          toaster.pop('error', "", 'Invalid image type');
          $scope.getMasterAdminDetails();
        }
      }
    }

       $scope.checkPassword = function(password,id) {
      if (password !== undefined) {
        var masteradmin = {
          password: password,
          id:id
        }
        MasterAdminProfile.checkPassword(masteradmin, function(response) {
          if (response.code === 200) {
             $scope.message = "";
          } else {
             $scope.message = response.message;
          }
        })
      }
    }

    $scope.ChangePasswordMatch = function(password) {
      if (password != undefined) {
        if (password.newpassword && password.cpassword && password.newpassword != password.cpassword) {
          $scope.passwordNotMatch = true;
        } else {
          $scope.passwordNotMatch = false;
        }
      }

    }

    $scope.changePassword = function(password,id) {
      if (password) {
        var userdetails = {
          password: password,
          id:id
        }
        MasterAdminProfile.changePassword(userdetails, function(response) {
          if (response.code == 200) {
            $scope.toasters.splice(toaster.id, 1);
            toaster.pop('success', "", response.message);
            $timeout(function() {
            $state.go('main.myprofile');
          }, 500);
          } else {
            $scope.toasters.splice(toaster.id, 1);
            toaster.pop('error', "", response.message);
                   
          }
        })

      }

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
      MasterAdminProfile.getProofOfLifeQuestions(function(response) {
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
      MasterAdminProfile.getCountries(function(response) {
        if (response.code === 200) {
          $scope.countryArr = response.data;
        }
      })
    }


   

    /* @function : allergies_editor
     *  @author  : MadhuriK 
     *  @created  : 24-Apr-17
     *  @modified :
     *  @purpose  : To get data from allergies editor at medical info page .
     */
    $scope.allergies_editor = null;
    $scope.allergiesEditor = function() {
      $scope.allergies_editor = CKEDITOR.replace('allergies');
      if ($scope.allergies_editor) {
        $scope.allergies_editor.on('change', function(evt) {
          $scope.medical_info.allergies = evt.editor.getData();
        });
      }
    }

    $scope.other_medical_info_editor = null;
    $scope.otherEditor = function() {
      $scope.other_medical_info_editor = CKEDITOR.replace('other_medical_info');
      if ($scope.other_medical_info_editor) {
        $scope.other_medical_info_editor.on('change', function(evt) {
          $scope.medical_info.other_medical_info = evt.editor.getData();
        });
      }
    }


     /* @function : updateMedicalInfo
     *  @author  : MadhuriK 
     *  @created  : 18-Apr-17
     *  @modified :
     *  @purpose  : To update medical information of traveller.
     */
    $scope.updateMedicalInfo = function(medical_info,id) {
      medical_info.ids=id;
      console.log(medical_info)

      MasterAdminProfile.updateMedicalInfo(medical_info, function(response) {
        if (response.code === 200) {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('success', "", response.message);
          $timeout(function() {
          //  $state.go('main.dashboard');
          }, 500);
        } else {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('error', "", response.err);
        }
      })
    }


  });
