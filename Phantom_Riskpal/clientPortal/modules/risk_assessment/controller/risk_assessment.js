'use strict';

angular.module('risk_assessment', ['ngAnimate', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.riskpal_risk_assessment', {
        url: '/list/master_admin_risk_assessment_template',
        templateUrl: 'modules/risk_assessment/views/master_admin_risk_assessment.html',
        controller: 'RiskAssessmentCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.list_risk_assessment', {
        url: '/list/risk_assessment',
        templateUrl: 'modules/risk_assessment/views/list_risk_assessment.html',
        controller: 'RiskAssessmentCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('add_risk_assessment', {
        url: '/risk/assesment',
        templateUrl: 'modules/risk_assessment/views/add_risk_assessment.html',
        controller: 'RiskAssessmentCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('add_risk_assessment.step1', {
        url: '/step1',
        templateUrl: 'modules/risk_assessment/views/step1.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.step2', {
        url: '/step2/:ra_id',
        templateUrl: 'modules/risk_assessment/views/step2.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.step3', {
        url: '/step3/:ra_id',
        templateUrl: 'modules/risk_assessment/views/step3.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.add_question', {
        url: '/add/question',
        templateUrl: 'modules/risk_assessment/views/add_question.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.add_category', {
        url: '/add/category',
        templateUrl: 'modules/risk_assessment/views/add_category.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('main.view_risk_assessment', {
        url: '/view/risk_assessment/:ra_id',
        templateUrl: 'modules/risk_assessment/views/view_risk_assessment.html',
        controller: 'RiskAssessmentCtrl',
        // parent: 'main',
        authenticate: true
      })
      .state('add_risk_assessment.update', {
        url: '/update/risk_assessment/:ra_id',
        templateUrl: 'modules/risk_assessment/views/update_risk_assessment.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.get_risk_que', {
        url: '/risk_questions/:ra_id/:risk_label_id',
        templateUrl: 'modules/risk_assessment/views/risk_ques.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.que_details', {
        url: '/risk_question/details/:ra_id/:risk_label_id/:que_id',
        templateUrl: 'modules/risk_assessment/views/risk_que_details.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('main.submitted_risk_assessment', {
        url: '/list/submitted/risk_assessments',
        templateUrl: 'modules/risk_assessment/views/list_submitted_risk_assessment.html',
        controller: 'RiskAssessmentCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.risk_assessment', {
        url: '/ratimer',
        templateUrl: 'modules/risk_assessment/views/ratimer.html',
        controller: 'RiskAssessmentCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.rejected_risk_assessment', {
        url: '/list/rejected/risk_assessments',
        templateUrl: 'modules/risk_assessment/views/list_rejected_risk_assessment.html',
        controller: 'RiskAssessmentCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.view_Ra_details', {
        url: '/view/ra/details/:newsRa_id',
        templateUrl: 'modules/risk_assessment/views/view_ra_details.html',
        controller: 'RiskAssessmentCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('add_risk_assessment.add_supplier', {
        url: '/add/supplier/:ra_id',
        templateUrl: 'modules/risk_assessment/views/add_supplier.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.add_communication', {
        url: '/add/communication/:ra_id',
        templateUrl: 'modules/risk_assessment/views/add_communication.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.add_contingency', {
        url: '/add/contingency/:ra_id',
        templateUrl: 'modules/risk_assessment/views/add_contingency.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
      .state('add_risk_assessment.countrythreatmatrix', {
        url: '/countrythreatmatrix/:ra_id/:country_id',
        templateUrl: 'modules/risk_assessment/views/countrythreatmatrix.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })
    // .state('main.creatuser', {
    //   url: '/creatuser',
    //   templateUrl: 'modules/risk_assessment/views/index.html',
    //   controller: 'RiskAssessmentCtrl',
    //   authenticate: true
    // })
  })

  .controller('RiskAssessmentCtrl', function ($scope, toaster, $timeout, RiskAssessment, User, ngTableParams, $state, $window, $rootScope, $http, $sce, Upload) {

    $rootScope.ra_id = $window.localStorage.raId ? $window.localStorage.raId : $state.params.ra_id;
    // $scope.moreCountryField = [];
    // $scope.countryAddMoreDisabled = false;
    // $scope.addMoreCountry = function () {
    //   if ( $scope.moreCountryField.length < 5 ) {
    //     $scope.moreCountryField.push({})
    //   } else {
    //     $scope.countryAddMoreDisabled = true;
    //   }
        
    // }
    // $scope.removeMoreCountry = function (index) {
    //   if ( $scope.moreCountryField.length > 1 ) {
    //     $scope.moreCountryField.splice(index, 1);
    //     $scope.countryAddMoreDisabled = false;
    //   } 
    // }
    /* @function : getAllRiskAssessment
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : To get all news ra's of particular traveller.
     */
    $scope.getAllRiskAssessment = function (keyword) {
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
            if (localStorage.super_admin == "true") {
              var super_admin = true;

              var client_id = '';
            } else {

              super_admin = false;
              client_id = $window.localStorage.logclient_id;

            }
            RiskAssessment.getAllRiskAssessment({ page: page, count: count, sortby: sorting, keyword: keyword, super_admin: super_admin, client_id: client_id }, function (response) {

              if (response.code === 200) {
                response.data.forEach(function (value, key) {
                  if (value.country && value.country.color) {
                    response.data[key].color = value.country.color.replace(/'/g, '');
                  }
                })
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
                $scope.typeOfRaData = response.data;
                console.log(response.data)
              } else {
                toaster.pop('error', "", response.err);
              }
            });
          }
        });
    }



    /* @function : getCountryListForRa
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To get country list.
     */
    $scope.getCountryListForRa = function () {
      RiskAssessment.getCountryListForRa(function (response) {
        if (response.code == 200) {
          $scope.countryArr = response.data
        } else {
          $scope.countryArr = [];
        }
      })

    }


    /* @function : getAllQuestionnaireForRa
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To get all questions list to assign ra.
     */
    $scope.getAllQuestionnaireForRa = function (questionnaire_name) {
      $scope.showLoader = true;
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 5,
        sorting: {
          createdAt: 'desc' // initial sorting
        }
      }, {
          getData: function ($defer, params) {
            var page = params.page();
            var count = params.count();
            var sorting = params.sorting();
            RiskAssessment.getAllQuestionnaireForRa({ page: page, count: count, sortby: sorting, questionnaire_name: questionnaire_name }, function (response) {
              if (response.code === 200) {

                response.data.forEach(function (questionnair) {
                  if (questionnair.assigned_ra_id.length > 0) {
                    questionnair.assigned_ra_id.forEach(function (queId) {

                      var raID = $state.params.ra_id ? $state.params.ra_id : $state.params.individualRa_id;
                      if (queId == raID) {
                        questionnair.assign = queId;
                      }
                    })
                  }


                  questionnair.categoryArr = [];
                  questionnair.category_id.forEach(function (Category) {
                    questionnair.categoryArr.push(Category.categoryName);
                  })
                })

                params.settings().counts = [];

                $timeout(function () {
                  $scope.showLoader = false;
                  params.total(response.count);
                  $defer.resolve(response.data);
                  $scope.questionnaire = response.data;
                  $scope.copyquesData = angular.copy(response.data);
                  $scope.data = $scope.questionnaire;
                }, 500);
              } else {
                $scope.showLoader = false;
                toaster.pop('error', "", response.err);
              }
            });
          }
        });
    }


    /* @function : getAllDepartmentOfClient
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To get all departments of client super admin.
     */
    $scope.getAllDepartmentOfClient = function () {

      var client_id = $window.localStorage.logclient_id

      User.getDepartmentusers(client_id, function (response) {
        if (response.code == 200) {
          $scope.clientDepartmentList = response.data
        } else {
          $scope.clientDepartmentList = [];
        }
      })
    }



    /* @function : createRaByClientAdmin
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To create ra by client super admin
     */

    $scope.createRaByClientAdmin = function (raData) {
      
      if (raData.clientDepartment.length == 0) {
        toaster.pop('error', "", 'Please select department');
      } else {
        raData.countryrequired = $rootScope.countrythreattest;
        raData.communicationRequired = $rootScope.communicationstest;
        raData.contingenciesRequired = $rootScope.contingenciestest;
        raData.supplierRequired = $rootScope.supplierInformationtest;
        raData.questionRequired = $rootScope.questiontest;
        // raData.country = $scope.moreCountryField;// raData.country ? raData.country : null
        if (localStorage.super_admin == "true") {
          raData.super_admin = 1;

        } else {
          raData.super_admin = 0;
          raData.client_id = $window.localStorage.logclient_id;

        }
        if (raData.country != null) {

          var country_id = typeof raData.country == "string" ? JSON.parse(raData.country)._id : raData.country._id;

        }
        RiskAssessment.createIndividualRa(raData, function (response) {
          if (response.code == 200) {
            $window.localStorage.raId = response.data._id;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if (!raData.country) {
                $rootScope.activecountry = false;
                $window.localStorage.setItem('activecountry', false);
                var stateToGo = $rootScope.questiontest ? 'add_risk_assessment.step2' : ($rootScope.supplierInformationtest && !$rootScope.questiontest) ? 'add_risk_assessment.add_supplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'add_risk_assessment.add_communication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
                $state.go(stateToGo, { ra_id: $window.localStorage.raId });
              } else {
                if ($rootScope.countrythreattest && raData.country) {
                  $rootScope.activecountry = true;
                  $window.localStorage.setItem('activecountry', true);
                  var countryArray = [];
                  raData.country.forEach(item => {
                    countryArray.push(item._id);
                  });
                  $window.localStorage.setItem('country_id', countryArray.join(','));
                  //country = raData.country; //.indexOf('_id') > -1 ? JSON.parse(raData.country)._id : raData.country;
                  $state.go('add_risk_assessment.countrythreatmatrix', { ra_id: $window.localStorage.raId, country_id: countryArray.join(',') });
                } else {
                  $rootScope.activecountry = false;
                  $window.localStorage.setItem('activecountry', false);
                  stateToGo = $rootScope.questiontest ? 'add_risk_assessment.step2' : ($rootScope.supplierInformationtest && !$rootScope.questiontest) ? 'add_risk_assessment.add_supplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'add_risk_assessment.add_communication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
                  $state.go(stateToGo, { ra_id: $window.localStorage.raId });
                }
              }
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }

    $scope.updateRaByClientAdmin = function (raData) {
     
      if (raData.clientDepartment.length == 0) {
        toaster.pop('error', "", 'Please select department');
      } else {
        raData.countryrequired = $rootScope.countrythreattest;
        raData.communicationRequired = $rootScope.communicationstest;
        raData.contingenciesRequired = $rootScope.contingenciestest;
        raData.supplierRequired = $rootScope.supplierInformationtest;
        raData.questionRequired = $rootScope.questiontest;
        // raData.country = $scope.moreCountryField;// raData.country ? raData.country : null
        if (localStorage.super_admin == "true") {
          raData.super_admin = 1;

        } else {
          raData.super_admin = 0;
          raData.client_id = $window.localStorage.logclient_id;

        }
        if (raData.country != null) {

          var country_id = typeof raData.country == "string" ? JSON.parse(raData.country)._id : raData.country._id;

        }
        RiskAssessment.updateIndividualRa(raData, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if (!raData.country) {
                $rootScope.activecountry = false;
                $window.localStorage.setItem('activecountry', false);
                var stateToGo = $rootScope.questiontest ? 'add_risk_assessment.step2' : ($rootScope.supplierInformationtest && !$rootScope.questiontest) ? 'add_risk_assessment.add_supplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'add_risk_assessment.add_communication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
                $state.go(stateToGo, { ra_id: $window.localStorage.raId });
              } else {
                if ($rootScope.countrythreattest && raData.country) {
                  $rootScope.activecountry = true;
                  $window.localStorage.setItem('activecountry', true);
                  var countryArray = [];
                  raData.country.forEach(item => {
                    countryArray.push(item._id);
                  });
                  $window.localStorage.setItem('country_id', countryArray.join(','));
                  //country = raData.country; //.indexOf('_id') > -1 ? JSON.parse(raData.country)._id : raData.country;
                  $state.go('add_risk_assessment.countrythreatmatrix', { ra_id: $window.localStorage.raId, country_id: countryArray.join(',') });
                } else {
                  $rootScope.activecountry = false;
                  $window.localStorage.setItem('activecountry', false);
                  stateToGo = $rootScope.questiontest ? 'add_risk_assessment.step2' : ($rootScope.supplierInformationtest && !$rootScope.questiontest) ? 'add_risk_assessment.add_supplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'add_risk_assessment.add_communication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
                  $state.go(stateToGo, { ra_id: $window.localStorage.raId });

                }
              }
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }


    // to active supplier state  
    if ($state.current.name !== 'add_risk_assessment.add_supplier') {
      $rootScope.supplier_active = false;
    } else if ($state.current.name == 'add_risk_assessment.add_supplier') {
      $rootScope.supplier_active = true;
    }

    //Get related risk label based on RA

    $scope.getRalabel = function () {
      var ra_id = $state.params.ra_id ? $state.params.ra_id : $window.localStorage.raId;
      RiskAssessment.getRaPreviewData(ra_id, function (response) {
        $scope.limit = 1;
        console.log(response);
        if (response.code === 200) {
          if (response.queData) {
            response.queData.forEach(function (que) {

              que.catArr = [];
              que.category_id.forEach(function (category) {
                que.catArr.push({ id: category._id })
              })
            })

          }

          // if (response.raData.country) {
          ////    $scope.countrycolor = response.raData.country.color.replace(/'/g, '');
          // }


          $rootScope.raDataClientAdmin = response.raData ? response.raData : [];
          $rootScope.questions = response.queData ? response.queData : [];
          // console.log($rootScope.questions[0].createdAt)
          //  $rootScope.supplier = response.supplierData ? response.supplierData : {};
          // $rootScope.supplierobject = Object.keys($rootScope.supplier).length;
          //  $rootScope.communication = response.communicationData ? response.communicationData : {};
          //  $rootScope.communicationobject = Object.keys($rootScope.communication).length;
          //$rootScope.contingency = response.contingencyData ? response.contingencyData : {};
          //   $rootScope.contingencyobject = Object.keys($rootScope.contingency).length;
        } else {
          $rootScope.raDataClientAdmin = [];
          $rootScope.categoryData = [];
          $rootScope.questions = [];
        }
      })
    }




    /* @function : getRaPreviewData
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To create ra by client super admin
     */
    $scope.getRaPreviewData = function () {
      var ra_id = $state.params.ra_id ? $state.params.ra_id : $window.localStorage.raId;
      RiskAssessment.getRaPreviewData(ra_id, function (response) {
        $scope.limit = 1;
        if (response.code === 200) {
          if (response.queData) {
            response.queData.forEach(function (que) {
              que.catArr = [];
              que.category_id.forEach(function (category) {
                que.catArr.push(category.categoryName)
              })
            })
          }
          $scope.countrycolor = [];
            if (response.raData.country) {
              response.raData.country.map((item, index) => {
                $scope.countrycolor.push({color: item.color.replace(/'/g, ''), countryName: item.name });
              })
             
          }
          $rootScope.raDataClientAdmin = response.raData ? response.raData : [];
          
          $rootScope.questions = response.queData ? response.queData : [];
          $rootScope.supplier = response.supplierData ? response.supplierData : {};
          $rootScope.supplierobject = Object.keys($rootScope.supplier).length;
          $rootScope.communication = response.communicationData ? response.communicationData : {};
          $rootScope.communicationobject = Object.keys($rootScope.communication).length;
          $rootScope.contingency = response.contingencyData ? response.contingencyData : {};
          $rootScope.contingencyobject = Object.keys($rootScope.contingency).length;
        } else {
          $rootScope.raDataClientAdmin = [];
          $rootScope.categoryData = [];
          $rootScope.questions = [];
        }
      })
    }


    /* @function : assignQuesToIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To assign questions to individual ra.
     */
    $scope.assignQuesToIndividualRa = function (assignQueData, $index) {
      if ($state.params.ra_id) {
        assignQueData.assignRaId = $state.params.ra_id;
        RiskAssessment.assignQuesToRa(assignQueData, function (response) {
          console.log("dineshfggg");
          console.log(response);
          if (response.code == 200) {
            $scope.toasters.splice(toaster.id, 1);
         
            $timeout(function () {
              toaster.pop('success', "", response.message);
            }, 500);
          } else {
            $scope.toasters.splice(toaster.id, 1);
            $timeout(function () {
              toaster.pop('error', "", response.message);
            }, 500);
          }
        })
      } else {
        $scope.questionnaire[$index].assign = false;
        $scope.toasters.splice(toaster.id, 1);
        toaster.pop('error', "", "Please create RA before assigning question to it");
      }
    }

    /* @function : getIndividualRaDetails
     *  @author  : MadhuriK 
     *  @created  : 6-sep-17
     *  @modified :
     *  @purpose  : To get categoriesList
     */

    $scope.getCategoriesList = function () {
      RiskAssessment.getCategoriesList(function (response) {
        console.log("getCategoriesList", response.data)
        if (response.code == 200) {
          var series = [];
          if (response.data.length > 0) {
            response.data.forEach(function (catObj) {
              series.push(catObj.categoryName);
            })

            $scope.labels = series;
          }

          $scope.getCountryThreatMatrix();

        } else {
          $scope.labels = [];
        }
      })
    }

    /* @function : getIndividualRaDetails
     *  @author  : MadhuriK 
     *  @created  : 6-sep-17
     *  @modified :
     *  @purpose  : To get individual ra data.
     */

    $scope.series = ['High', 'Medium', 'Low'];
    $scope.getCountryThreatMatrix = function () {
      $scope.showLoader = true;
      var country_id = $state.params.country_id;
      console.log("country_id", country_id)
      if (country_id) {
        var country = {country: country_id.split(',')};
        country.realTimeDataFromLiveApi = true;
        RiskAssessment.getCountryThreatMatrix(country, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            // $scope.countryThreat = response.countryObj;
            if (response.countryObj instanceof Array) {
                $scope.data = [];
                $scope.colors = [];
                // $scope.series = [];
                $scope.options = {
                  legend: {
                      display: true
                  }
                };
                 response.countryObj.map((item, countryIndex) => {
                  
                  var fillColor = {fillColor: []};
                  var data = [],
                    colors = [];
                  $scope.country = item.country_id; // get country details using populate
                  // $scope.series.push(item.country_id.name);
                  console.log('seriesss', $scope.series);
                  $scope.country.color = $scope.country.color ? $scope.country.color.replace(/'/g, '') : "";
                  if (item.threatMatrix.length > 0) {
                    var labelss = [];
                    item.threatMatrix.forEach(function (threatMatrix, index) {
                      var index = $scope.labels.indexOf(threatMatrix.category_name);
                      labelss.push(threatMatrix.category_name);
                      if (threatMatrix.country_risk == 'High') {
                        data[index] = 150;
                        fillColor.fillColor[index] = '#FF0000';
                      } else if (threatMatrix.country_risk == 'Medium') {
                        data[index] = 100;
                        fillColor.fillColor[index] = '#FFC200';
                      } else if (threatMatrix.country_risk == 'Low') {
                        data[index] = 50;
                        fillColor.fillColor[index] = '#008000';
                      }
                      
                    })
                    $scope.colors.push(fillColor);
                    console.log('datgaaa', data);
                    $scope.data.push(data);
                    item.graphData = [data];
                    item.colors = [fillColor];
                    $scope.labelss = labelss;
                    console.log('scope .data ', $scope.data);
                    console.log('$scope.colors',  $scope.colors);
                  } else {
                    data.push(0, 0, 0, 0, 0, 0, 0, 0, 0)
                    $scope.data.push(data);
                  }
                });
                $scope.countryThreat =  response.countryObj;
                console.log('$scope.countryThreat', $scope.countryThreat);
                // $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
                // $scope.series = ['Series A', 'Series B'];

                // $scope.data = [
                //   [65, 59, 80, 81, 56, 55, 40],
                //   [28, 48, 40, 19, 86, 27, 90]
                // ];

            } else {
              toaster.pop('error', "", "Somthing went wrong");
            }
           }
        });
          
    }
  }


    /* @function : getIndividualRaDetails
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To get individual ra data.
     */
    // $scope.getRaDetailsCreatedByClient = function () {
    //     console.log("getRaDetailsCreatedByClient")
    //     if ($state.current.name == 'add_risk_assessment.update') {
    //         $window.localStorage.raId = $state.params.ra_id ? $state.params.ra_id : $window.localStorage.raId;
    //     }
    //     var ra_id = $state.params.ra_id ? $state.params.ra_id : $window.localStorage.raId;
    //     if (ra_id) {
    //         RiskAssessment.getRaDetailsCreatedByClient(ra_id, function (response) {
    //             if (response.code === 200) {
    //                 if ($state.current.name == "add_risk_assessment.step1" && response.data.is_created_compleletely == true) {
    //                     delete $window.localStorage.raId;
    //                     response.data = null;
    //                     $rootScope.questions = [];
    //                     $state.reload();
    //                 }
    //                 $scope.individualRa = response.data;
    //                 if ($scope.individualRa) {
    //                     RiskAssessment.getAllDepartmentOfClient(function (result) {
    //                         if (result.code == 200) {
    //                             $scope.clientDepartmentList = result.data;
    //                             if ($scope.clientDepartmentList.length > 0) {
    //                                 $scope.clientDepartmentList.forEach(function (client_all_depart) {
    //                                     if (response.data !== null) {
    //                                         response.data.client_department.forEach(function (client_selected_depart) {
    //                                             if (client_selected_depart == client_all_depart._id) {
    //                                                 client_all_depart.ticked = true;
    //                                             }
    //                                         })
    //                                     }
    //                                 })

    //                             }

    //                         }
    //                     })
    //                 }
    //             } else {
    //                 $scope.individualRa = {};
    //             }
    //         })
    //     }
    // }

    $rootScope.step1 = function (asd) {
      delete $window.localStorage.raId;
      delete $window.localStorage.supplier_id;
      delete $window.localStorage.communication_id;
      delete $window.localStorage.contingency_id;
      delete $window.localStorage.communicationsvalue;
      delete $window.localStorage.contingenciesvalue;
      delete $window.localStorage.supppliervalue;
      delete $window.localStorage.questionvalue;
      delete $window.localStorage.activecountry;
      delete $window.localStorage.countryvalue;
      $rootScope.supplierInformationtest = false;
      $rootScope.countrythreattest = false;
      $rootScope.communicationstest = false;
      $rootScope.contingenciestest = false;
      $rootScope.questiontest = false;
      $rootScope.risksp_id = "";
      $rootScope.cat_ids = [];
      // $state.go('add_risk_assessment.step1')
    }

    $scope.getRaDetailsCreatedByClient = function () {


      if ($state.current.name == 'add_risk_assessment.update') {
        $window.localStorage.raId = $state.params.ra_id ? $state.params.ra_id : $window.localStorage.raId;
      }
      var ra_id = $state.params.ra_id ? $state.params.ra_id : $window.localStorage.raId;
      if (ra_id) {
        RiskAssessment.getRaDetailsCreatedByClient(ra_id, function (response) {
          console.log(response);
          if (response.code === 200) {
            if ($state.current.name == "add_risk_assessment.step1" && response.raData.is_created_compleletely == true) {
              delete $window.localStorage.raId;
              response.raData = null;
              $rootScope.questions = [];
            }
            $scope.individualRa = response.raData;
            (response.raData.country != null) ? $window.localStorage.setItem('country_id', response.raData.country._id) : $window.localStorage.setItem('country_id', null);
            $window.localStorage.setItem('raId', response.raData._id);
            $window.localStorage.setItem('communicationsvalue', response.raData.communicationRequired);
            $window.localStorage.setItem('contingenciesvalue', response.raData.contingenciesRequired);
            $window.localStorage.setItem('supppliervalue', response.raData.supplierRequired);
            $window.localStorage.setItem('questionvalue', response.raData.questionRequired);
            $window.localStorage.setItem('countryvalue', response.raData.countryrequired);

            // $window.localStorage.setItem('risksp_id', response.raData.questionRequired);
            // if (localStorage.hasOwnProperty("questionvalue")) {
            //   if (localStorage.questionvalue) {
            //     $rootScope.questiontest = JSON.parse(localStorage.questionvalue);
            //   } else {
            //     $rootScope.questiontest = JSON.parse(localStorage.questionvalue);
            //   }
            // }
            // if (localStorage.hasOwnProperty("supppliervalue")) {
            //   if (localStorage.supppliervalue) {
            //     $rootScope.supplierInformationtest = JSON.parse(localStorage.supppliervalue);
            //   } else {
            //     $rootScope.supplierInformationtest = JSON.parse(localStorage.supppliervalue);
            //   }
            // }
            // if (localStorage.hasOwnProperty("communicationsvalue")) {
            //   if (localStorage.communicationsvalue) {
            //     $rootScope.communicationstest = JSON.parse(localStorage.communicationsvalue);
            //   } else {
            //     $rootScope.communicationstest = JSON.parse(localStorage.communicationsvalue);
            //   }
            // }
            // if (localStorage.hasOwnProperty("contingenciesvalue")) {
            //   if (localStorage.contingenciesvalue) {
            //     $rootScope.contingenciestest = JSON.parse(localStorage.contingenciesvalue);
            //   } else {
            //     $rootScope.contingenciestest = JSON.parse(localStorage.contingenciesvalue);
            //   }
            // }
            // if (localStorage.hasOwnProperty("activecountry")) {
            //   if (localStorage.activecountry) {
            //     $rootScope.activecountry = JSON.parse(localStorage.activecountry);
            //   } else {
            //     $rootScope.activecountry = JSON.parse(localStorage.activecountry);
            //   }
            // }
            if ($scope.individualRa) {
              $rootScope.raname = $scope.individualRa.ra_name;
              $rootScope.questions = response.queData ? response.queData : [];
              $rootScope.supplier = response.supplierData ? response.supplierData : {};
              $rootScope.communication = response.communicationData ? response.communicationData : {};
              $rootScope.contingency = response.contingencyData ? response.contingencyData : {};
              if (response.queData.length != 0) {
                $rootScope.risksp_id = response.queData[0].category_id[0]._id;
              }
              $window.localStorage.supplier_id = $rootScope.supplier._id;
              $window.localStorage.communication_id = $rootScope.communication._id;
              $window.localStorage.contingency_id = $rootScope.contingency._id;
              $window.localStorage.risksp_id = $rootScope.risksp_id;
              var client_id = $window.localStorage.logclient_id

              // get the selected country from country list
              RiskAssessment.getCountryListForRa(function(res){
                if(res.code == 200){
                  $scope.countryArray = res.data;
                  $scope.countryArr.forEach(function(countries){
                    if(response.raData.country !== null){
                       response.raData.country.forEach(function(selected_country){
                         if(selected_country._id == countries._id){
                          countries.ticked = true;
                         }
                      })
                    }
                  })
                }
              })

              User.getDepartmentusers(client_id, function (result) {
                // console.log("result", result.data)
                if (result.code == 200) {
                  $scope.clientDepartmentList = result.data;
                  console.log("$scope.clientDepartmentList", $scope.clientDepartmentList)
                  if ($scope.clientDepartmentList.length > 0) {
                    $scope.clientDepartmentList.forEach(function (client_all_depart) {
                      if (response.raData !== null) {
                        response.raData.client_department.forEach(function (client_selected_depart) {
                          if (client_selected_depart._id == client_all_depart._id) {
                            client_all_depart.ticked = true;
                          }
                        })
                      }
                    })

                  }

                }
              })



              if (localStorage.hasOwnProperty("questionvalue")) {
                if (localStorage.questionvalue) {
                  $rootScope.questiontest = JSON.parse(localStorage.questionvalue);
                } else {
                  $rootScope.questiontest = JSON.parse(localStorage.questionvalue);
                }
              }
              if (localStorage.hasOwnProperty("countryvalue")) {
                if (localStorage.countryvalue) {
                  $rootScope.countrythreattest = JSON.parse(localStorage.countryvalue);
                } else {
                  $rootScope.countrythreattest = JSON.parse(localStorage.countryvalue);
                }
              }

              if (localStorage.hasOwnProperty("supppliervalue")) {
                if (localStorage.supppliervalue) {
                  $rootScope.supplierInformationtest = JSON.parse(localStorage.supppliervalue);
                } else {
                  $rootScope.supplierInformationtest = JSON.parse(localStorage.supppliervalue);
                }
              }
              if (localStorage.hasOwnProperty("communicationsvalue")) {
                if (localStorage.communicationsvalue) {
                  $rootScope.communicationstest = JSON.parse(localStorage.communicationsvalue);
                } else {
                  $rootScope.communicationstest = JSON.parse(localStorage.communicationsvalue);
                }
              }
              if (localStorage.hasOwnProperty("contingenciesvalue")) {
                if (localStorage.contingenciesvalue) {
                  $rootScope.contingenciestest = JSON.parse(localStorage.contingenciesvalue);
                } else {
                  $rootScope.contingenciestest = JSON.parse(localStorage.contingenciesvalue);
                }
              }
              if (localStorage.hasOwnProperty("activecountry")) {
                if (localStorage.activecountry) {
                  $rootScope.activecountry = JSON.parse(localStorage.activecountry);
                } else {
                  $rootScope.activecountry = JSON.parse(localStorage.activecountry);
                }
              }

            } else {
              $scope.individualRa = {};
            }
          } else {
            $rootScope.raDataClientAdmin = [];
            $rootScope.categoryData = [];
            $rootScope.questions = [];
          }
        })
      }
    }



    if (localStorage.hasOwnProperty("questionvalue")) {
      if (localStorage.questionvalue) {
        $rootScope.questiontest = JSON.parse(localStorage.questionvalue);
      } else {
        $rootScope.questiontest = JSON.parse(localStorage.questionvalue);
      }
    }
    if (localStorage.hasOwnProperty("countryvalue")) {
      if (localStorage.countryvalue) {
        $rootScope.countrythreattest = JSON.parse(localStorage.countryvalue);
      } else {
        $rootScope.countrythreattest = JSON.parse(localStorage.countryvalue);
      }
    }

    if (localStorage.hasOwnProperty("supppliervalue")) {
      if (localStorage.supppliervalue) {
        $rootScope.supplierInformationtest = JSON.parse(localStorage.supppliervalue);
      } else {
        $rootScope.supplierInformationtest = JSON.parse(localStorage.supppliervalue);
      }
    }
    if (localStorage.hasOwnProperty("communicationsvalue")) {
      if (localStorage.communicationsvalue) {
        $rootScope.communicationstest = JSON.parse(localStorage.communicationsvalue);
      } else {
        $rootScope.communicationstest = JSON.parse(localStorage.communicationsvalue);
      }
    }
    if (localStorage.hasOwnProperty("contingenciesvalue")) {
      if (localStorage.contingenciesvalue) {
        $rootScope.contingenciestest = JSON.parse(localStorage.contingenciesvalue);
      } else {
        $rootScope.contingenciestest = JSON.parse(localStorage.contingenciesvalue);
      }
    }
    if (localStorage.hasOwnProperty("activecountry")) {
      if (localStorage.activecountry) {
        $rootScope.activecountry = JSON.parse(localStorage.activecountry);
      } else {
        $rootScope.activecountry = JSON.parse(localStorage.activecountry);
      }
    }
    /* @function : 
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To call $scope.getIndividualRaDetails function when ra_id value store in localStorage .
     */
    // if ($window.localStorage.raId) {
    //     $scope.getRaDetailsCreatedByClient();
    // }


    /* @function : changeLimit
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To change limits of show question.
     */
    $scope.changeLimit = function () {
      if ($scope.limit == $rootScope.questions.length) {
        $scope.limit = 1;
        $scope.buttonLable = "";
      } else {
        $scope.limit = $rootScope.questions.length;
        $scope.buttonLable = 'Show Less';
      }
    }



    /* @function : submitRaCreatedByClient
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To submit ra created by client super admin.
     */
    $scope.submitRaCreatedByClient = function () {
      swal({
        title: "Submit?",
        text: "Confirm submission of risk assessment",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00acd6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true
      },
        function () {
          RiskAssessment.submitRaCreatedByClient($window.localStorage.raId, function (response) {
            delete $window.localStorage.raId;
            delete $window.localStorage.supplier_id;
            delete $window.localStorage.communication_id;
            delete $window.localStorage.contingency_id;
            delete $window.localStorage.communicationsvalue;
            delete $window.localStorage.contingenciesvalue;
            delete $window.localStorage.supppliervalue;
            delete $window.localStorage.questionvalue;
            delete $window.localStorage.activecountry;
            $rootScope.activecountry = false;
            $rootScope.countrythreatmatrix = false;
            $rootScope.supplierInformationtest = false;
            $rootScope.communicationstest = false;
            $rootScope.contingenciestest = false;
            $rootScope.questiontest = false;
            $rootScope.raDataClientAdmin = [];
            $rootScope.questions = [];
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('main.list_risk_assessment', { 'reload': true });
            }, 1000)
          })
        });
    }


    /* @function : getEditorData
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To get ckeditor data for description.
     */
    // $scope.editor = null;
    // $scope.getEditorData = function() {
    //   $scope.editor = CKEDITOR.replace('editor1');
    //   if ($scope.editor) {
    //     $scope.editor.on('change', function(evt) {
    //       $rootScope.data = evt.editor.getData();
    //     });
    //   }

    //   $scope.question = CKEDITOR.replace('question');
    //   if ($scope.question) {
    //     $scope.question.on('change', function(evt) {
    //       $rootScope.question_text = evt.editor.getData();
    //     });
    //   }

    // }



    /* @function : getCategoriesForQue
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To get all categories.
     */
    $scope.getCategoriesForQue = function () {
      RiskAssessment.getCategoriesForQue(function (response) {
        if (response.code === 200) {
          $scope.categoryArr = response.data;
        } else {
          $scope.categoryArr = [];
        }
      })
    }


    /* @function : getCategoriesForQue
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To get all categories and get editor data after 100 ms.
     */
    // $scope.getCategoriesForQue();
    // setTimeout(function() {
    //   $scope.getEditorData();
    // }, 100);




    /* @function : addQuestionByClient
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To add question for second step for individual ra.
     */
    $scope.addQuestionByClient = function (questionnaire) {

      if (!questionnaire.best_practice_advice || !questionnaire.question) {
        toaster.pop('error', "", "Please fill all required fields");
      } else {
        questionnaire.category_id = $rootScope.risksp_id;
        questionnaire.question = questionnaire.question;
        questionnaire.best_practice_advice = questionnaire.best_practice_advice;
        RiskAssessment.addQuestionByClient(questionnaire, function (response) {
          if (response.code === 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('add_risk_assessment.get_risk_que', { ra_id: $window.localStorage.raId, risk_label_id: $rootScope.risksp_id });
            }, 500);
          } else {
            toaster.pop('error', "", response.err);
          }
        })
      }
    }



    /* @function : addCategoryByClient
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To add categories by client super admin.
     */
    $scope.addCategoryByClient = function (category) {
      if (category) {
        RiskAssessment.addCategoryByClient(category, function (response) {
          if (response.code == 200) {
            $timeout(function () {
              $state.go('add_risk_assessment.add_question');
            }, 500);
          } else {
            toaster.pop('error', "", response.error);
          }
        })
      }
    }


    /* @function : filterQueByRiskLable
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To filter question according to selected risk labels.
     */
    $scope.filterQueByRiskLable = function (risk_label) {
      if (risk_label == 'all') {
        $scope.questionnaire = $scope.copyquesData;
      } else {
        var dataArr = [];
        $scope.copyquesData.forEach(function (questionObj) {
          if (questionObj.category_id.length > 0) {
            questionObj.category_id.forEach(function (queCat) {
              if (queCat._id == risk_label) {
                dataArr.push(questionObj);
              }
            })
          }
        })
        // $scope.questionnaire = (dataArr.length > 0) ? dataArr : $scope.copyquesData;
        $scope.questionnaire = dataArr;
      }

    }


    /* @function : changeStatus
     *  @author  : MadhuriK 
     *  @created  : 02-Aug-17
     *  @modified :
     *  @purpose  : To change status of types of ra
     */
    $scope.changeStatus = function (status, typeOfRa_id) {
      var typeOfRaStatus = status == 'Active' ? 'Inactive' : 'Active';
      if (typeOfRaStatus && typeOfRa_id) {
        swal({
          title: "Are you sure?",
          text: "You want to " + typeOfRaStatus + "?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00acd6",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: true
        },
          function () {
            var typeOfRa = {};
            typeOfRa.id = typeOfRa_id;
            typeOfRa.status = typeOfRaStatus;
            RiskAssessment.changeStatus(typeOfRa, function (response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllRiskAssessment();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }



    /* @function : deleteRa
     *  @author  : MadhuriK 
     *  @created  : 02-Aug-17
     *  @modified :
     *  @purpose  : To delete types of ra
     */
    $scope.deleteRa = function (ra_id) {
      if (ra_id) {
        swal({
          title: "Are you sure?",
          text: "You want to delete selected ra?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00acd6",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: true
        },
          function () {
            RiskAssessment.deleteRa(ra_id, function (response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllRiskAssessment();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }


    /* @function : getRaToView
     *  @author  : MadhuriK 
     *  @created  : 02-Aug-17
     *  @modified :
     *  @purpose  : To get ra details to view.
     */
    $scope.getRaToView = function () {
      var types_of_ra_id = $state.params.ra_id;
      if (types_of_ra_id) {
        RiskAssessment.getRaToView(types_of_ra_id, function (response) {
          if (response.code == 200) {
            $scope.raData = response.raData;
            $scope.questionData = response.questionData;

            $scope.questionData.forEach(function (que) {
              que.categoryName = [];
              que.category_id.forEach(function (categoryObj) {
                que.categoryName.push(categoryObj.categoryName);
              })
            })
          } else {
            $scope.raData = [];
            $scope.questionData = [];
          }
        })
      }
    }



    // to show active steps in individual ra creation with multistep form
    if (($state.current.name == 'add_risk_assessment.step2') || ($state.current.name == 'add_risk_assessment.add_question') || ($state.current.name == 'add_risk_assessment.add_category') ||
      ($state.current.name == 'add_risk_assessment.get_risk_que') || ($state.current.name == 'add_risk_assessment.que_details')) {
      $rootScope.individual_stepflag = 'individual_step2';
    } else if (($state.current.name == 'add_risk_assessment.countrythreatmatrix') || ($state.current.name == 'add_risk_assessment.update')) {
      $rootScope.individual_stepflag = 'individualcountry_step2';
    } else if ($state.current.name == 'add_risk_assessment.step3') {
      $rootScope.individual_stepflag = 'individual_step3';
    } else {
      $rootScope.individual_stepflag = '';
    }

    if ($state.current.name) {
      switch ($state.current.name) {
        case "add_risk_assessment.step2":
        case "add_risk_assessment.get_risk_que":
        case "add_risk_assessment.add_question":
        case "add_risk_assessment.add_category":
        case "add_risk_assessment.que_details":
          $rootScope.individual_stepflag = 'individual_step2';
          break;
        case "newsTravellerRa.countrythreatmatrix":
          $rootScope.individual_stepflag = 'individualcountry_step2';
          break;
        case "add_risk_assessment.step3":
          $rootScope.individual_stepflag = 'individual_step3';
          break;
        case "add_risk_assessment.step1":
        case "add_risk_assessment.update":
          $rootScope.individual_stepflag = 'individual_step1';
          break;
      }
    }



    /* @function : sendIndividualSecondStep
     *  @author  : MadhuriK 
     *  @created  : 03-Aug-17
     *  @modified :
     *  @purpose  : To send second step.
     */
    $scope.sendIndividualSecondStep = function () {
      if ($window.localStorage.raId || $state.params.ra_id) {
        var ra_id = $window.localStorage.raId ? $window.localStorage.raId :
          $state.params.ra_id ? $state.params.ra_id : "";
        $state.go('add_risk_assessment.step2', { ra_id: ra_id });
      }
    }

    /* @function : sendIndividualSecondStep
     *  @author  : MadhuriK 
     *  @created  : 4-sep-17
     *  @modified :
     *  @purpose  : To send CountryThreatMatrix.
     */


    // $scope.sendToCountryThreatMatrix=function(){
    //    var ra_id = $window.localStorage.raId
    //    $state.go('add_risk_assessment.countrythreatmatrix', { ra_id: ra_id ,country_id:$scope.individualRa.country });
    // }


    /* @function : sendIndividualThirdStep
     *  @author  : MadhuriK 
     *  @created  : 03-Aug-17
     *  @modified :
     *  @purpose  : To send third step.
     */
    $scope.sendIndividualThirdStep = function () {
      // if ($rootScope.questions.length > 0) {
      var ra_id = $window.localStorage.raId ? $window.localStorage.raId :
        $state.params.ra_id ? $state.params.ra_id : "";
      $state.go('add_risk_assessment.step3', { ra_id: ra_id });
      // }
    }



    /* @function : getAllRiskLabels
     *  @author  : MadhuriK 
     *  @created  : 07-Aug-17
     *  @modified :
     *  @purpose  : To get all risk labels
     */
    $scope.getAllRiskLabels = function (label_name) {

      var ra_id = $state.params.ra_id;
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 30,
        sorting: {
          categoryName: 'asc' // initial sorting
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
            RiskAssessment.getAllRiskLabels({ page: page, count: count, sortby: sorting, label_name: label_name, ra_id: ra_id,super_admin:super_admin,client_id:client_id }, function (response) {
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
                $scope.categories = response.data;
              } else {
                toaster.pop('error', "", response.err);
              }
            });
          }
        });
    }


    /* @function : redirectToIndiRiskQue
     *  @author  : MadhuriK 
     *  @created  : 07-Aug-17
     *  @modified :
     *  @purpose  : To redirect to risk questions of individual section
     */
    $scope.redirectToIndiRiskQue = function (risk_id) {
      if (risk_id) {
        $rootScope.risksp_id = risk_id;
        $scope.cat_ids = [];
        $scope.cat_ids.push(risk_id);
        var ra_id = $state.params.ra_id;
        $state.go('add_risk_assessment.get_risk_que', { ra_id: ra_id, risk_label_id: risk_id })
      }
    }


    /* @function : getAllRiskQuestionnaire
     *  @author  : MadhuriK 
     *  @created  : 07-Aug-17
     *  @modified :
     *  @purpose  : To get all questions of selected risk label
     */
    $scope.getAllRiskQuestionnaire = function (questionnaire_name) {
      if ($state.params.risk_label_id) {
        $scope.showLoader = true;
        $scope.tableParams = new ngTableParams({
          page: 1,
          count: 5,
          sorting: {
            createdAt: 'desc' // initial sorting
          }
        }, {
            getData: function ($defer, params) {
              var page = params.page();
              var count = params.count();
              var sorting = params.sorting();
              RiskAssessment.getAllRiskQuestionnaire({ page: page, count: count, sortby: sorting, questionnaire_name: questionnaire_name, risk_label_id: $state.params.risk_label_id }, function (response) {
                if (response.code === 200) {
                  console.log(response.data);
                  response.data.forEach(function (questionnair) {
                    if (questionnair.assigned_ra_id.length > 0) {
                      questionnair.assigned_ra_id.forEach(function (queId) {

                        var raID = $state.params.ra_id ? $state.params.ra_id : $state.params.individualRa_id;
                        if (queId == raID) {
                          questionnair.assign = queId;
                        }
                      })
                    }


                    questionnair.categoryArr = [];
                    questionnair.category_id.forEach(function (Category) {
                      if (Category._id == $state.params.risk_label_id) {
                        questionnair.categoryArr.push({ id: Category._id, name: Category.categoryName, selected: true });
                      } else {
                        questionnair.categoryArr.push({ id: Category._id, name: Category.categoryName, selected: false });
                      }
                    })
                  })

                  params.settings().counts = [];
                  $timeout(function () {
                    $scope.showLoader = false;
                    params.total(response.count);
                    $defer.resolve(response.data);
                    $scope.questionnaire = response.data;
                    $scope.copyquesData = angular.copy(response.data);
                    $scope.data = $scope.questionnaire;
                    $scope.dinesh = "fd";
                  }, 500);
                } else {
                  $scope.showLoader = false;
                  toaster.pop('error', "", response.err);
                }
              });
            }
          });
      }

    }

    /* @function : redirectToIndiQueDetails
     *  @author  : MadhuriK 
     *  @created  : 07-Aug-17
     *  @modified :
     *  @purpose  : To redirect to question details
     */
    $scope.redirectToIndiQueDetails = function (que_id) {
      if (que_id) {
        $state.go('add_risk_assessment.que_details', { ra_id: $state.params.ra_id, risk_label_id: $state.params.risk_label_id, que_id: que_id })
      }
    }


    /* @function : getRiskQueDetail
     *  @author  : MadhuriK 
     *  @created  : 07-Aug-17
     *  @modified :
     *  @purpose  : To get details of que
     */
    $scope.getRiskQueDetail = function () {
      if ($state.params.que_id) {
        RiskAssessment.getRiskQueDetail($state.params.que_id, function (response) {
          if (response.code == 200) {
            $scope.questionDetails = response.data;
          } else {
            $scope.questionDetails = {};
          }
        })
      }
    }

    // to call get question details api
    if ($state.current.name == 'add_risk_assessment.que_details') {
      $scope.getRiskQueDetail();
    }


    /* @function : backToQuePageOfIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 07-Aug-17
     *  @modified :
     *  @purpose  : To redirect to list question page of ra
     */
    $scope.backToQuePageOfIndividualRa = function () {
      if ($state.params.ra_id && $state.params.risk_label_id) {
        $state.go('add_risk_assessment.get_risk_que', { ra_id: $state.params.ra_id, risk_label_id: $state.params.risk_label_id });
      }

    }


    /* @function : getAllSubmittedRiskAssessment
     *  @author  : MadhuriK 
     *  @created  : 24-Aug-17
     *  @modified :
     *  @purpose  : To get list of submitted risk assessments
     */
    $scope.getAllSubmittedRiskAssessment = function (keyword) {
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
            RiskAssessment.getAllSubmittedRiskAssessment({ page: page, count: count, sortby: sorting, keyword: keyword }, function (response) {
              if (response.code === 200) {
                response.data.forEach(function (departmentArr) {
                  departmentArr.departments = [];
                  departmentArr.department.forEach(function (departments) {
                    departmentArr.departments.push(departments.department_name);
                  })
                })
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
                $scope.newsRaData = response.data;
              } else {
                //  toaster.pop('error', "", response.err);
              }
            });
          }
        });
    }

    /* @function : getAllRejectedRiskAssessment
     *  @author  : MadhuriK 
     *  @created  : 24-Aug-17
     *  @modified :
     *  @purpose  : To get list of rejected risk assessments
     */
    $scope.getAllRejectedRiskAssessment = function (keyword) {
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
            RiskAssessment.getAllRejectedRiskAssessment({ page: page, count: count, sortby: sorting, keyword: keyword }, function (response) {
              if (response.code === 200) {
                response.data.forEach(function (departmentArr) {
                  departmentArr.departments = [];
                  departmentArr.department.forEach(function (departments) {
                    departmentArr.departments.push(departments.department_name);
                  })
                })
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
                $scope.newsRaData = response.data;
              } else {
                //  toaster.pop('error', "", response.err);
              }
            });
          }
        });
    }




    /* @function : getRadetailsForAdmin
     *  @author  : MadhuriK 
     *  @created  : 28-Aug-17
     *  @modified :
     *  @purpose  : To get ra details
     */
    $scope.getRadetailsForAdmin = function () {
      if ($state.params.newsRa_id) {
        RiskAssessment.getRadetailsForAdmin($state.params.newsRa_id, function (response) {
          if (response.code == 200) {
            $scope.newsRaData = response.data;
            $scope.questionnaires = response.question;
          } else {
            $scope.newsRaData = [];
          }
        })
      }
    }



    /* @function : getCurrencyList
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To currency list
     */
    $scope.getCurrencyList = function () {
      RiskAssessment.getCurrencyList(function (response) {
        if (response.code == 200) {
          $scope.currencyArr = response.data;
        } else {
          $scope.currencyArr = [];
        }
      })
    }


    /* @function : addRaSupplierByClientAdmin
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To add supplier by client admin
     */
    $scope.addRaSupplierByClientAdmin = function (supplierData) {
      // console.log("Object.keys(supplierData).length",Object.keys(supplierData).length)
      // if (Object.keys(supplierData).length == 0) {
      //     $timeout(function () {
      //         // $state.go('add_risk_assessment.add_communication', { ra_id: $state.params.ra_id });
      //     var stateToGo = $rootScope.communicationstest ? 'add_risk_assessment.add_communication' : ($rootScope.contingenciestest && !$rootScope.communicationstest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3';
      //                     $state.go(stateToGo, { ra_id: $state.params.ra_id });
      //     }, 500);
      // } else {
        $scope.messageError = '';
      // if (supplierData == undefined) {
      //   var stateToGo = $rootScope.communicationstest ? 'add_risk_assessment.add_communication' : ($rootScope.contingenciestest && !$rootScope.communicationstest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3';
      //   $state.go(stateToGo, { ra_id: $state.params.ra_id });
      // } else {
        supplierData.types_of_ra_id = $state.params.ra_id;
        if (localStorage.super_admin == "true") {
          supplierData.super_admin = 1;

        } else {
          supplierData.super_admin = 0;
          supplierData.client_id = $window.localStorage.logclient_id;

        }
        if (supplierData._id) {
          RiskAssessment.updateRaSupplierByClientAdmin(supplierData, function (response) {
            if (response.code == 200) {
              toaster.pop('success', "", response.message);
              $rootScope.communication_active = true;
              $timeout(function () {
                var stateToGo = $rootScope.communicationstest ? 'add_risk_assessment.add_communication' : ($rootScope.contingenciestest && !$rootScope.communicationstest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3';
                $state.go(stateToGo, { ra_id: $state.params.ra_id });
              }, 500);
            } else {
              let msg = '';
              
              if (response.message.length > 0 ) {
                 response.message.forEach(item => {
                  msg += "<span style='font-weight:bold;'>" + item.param.replace('_', ' ') + ': </span>' + item.msg + "<br>";
                });
              }
              $scope.messageError = $sce.trustAsHtml(msg);
              setTimeout(() => {
                $scope.messageError = '';
              }, 5000)
              toaster.pop('error', "", response.err);
            }
          })
        } else {
          RiskAssessment.addRaSupplierByClientAdmin(supplierData, function (response) {
            if (response.code == 200) {
              $window.localStorage.supplier_id = response.data._id;
              toaster.pop('success', "", response.message);
              $rootScope.communication_active = true;
              $timeout(function () {
                var stateToGo = $rootScope.communicationstest ? 'add_risk_assessment.add_communication' : ($rootScope.contingenciestest && !$rootScope.communicationstest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3';
                $state.go(stateToGo, { ra_id: $state.params.ra_id });
              }, 500);
            } else {
              let msg = '';
              
              if (response.message.length > 0 ) {
                 response.message.forEach(item => {
                  msg += "<span style='font-weight:bold;'>" + item.param.replace('_', ' ') + ': </span>' + item.msg + "<br>";
                });
              }
              $scope.messageError = $sce.trustAsHtml(msg);
              setTimeout(() => {
                $scope.messageError = '';
              }, 5000)
              toaster.pop('error', "", response.err);
            }
          })
        }
      // }
    }


    /* @function : getRaSupplierData
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To get supplier details
     */
    if ($window.localStorage.supplier_id && $state.current.name == "add_risk_assessment.add_supplier") {
      console.log("testingg")
      RiskAssessment.getRaSupplierData($window.localStorage.supplier_id, function (response) {
        if (response.code == 200) {
          response.data.rate = "'" + response.data.rate + "'";
          $scope.supplier = response.data;
        } else {
          $scope.supplier = {};
        }
      })
    }


    // to active communication state
    if ($state.current.name !== 'add_risk_assessment.add_communication') {
      $rootScope.communication_active = false;
    } else if ($state.current.name == 'add_risk_assessment.add_communication') {
      $rootScope.communication_active = true;
    }



    /* @function : addDetailsOfTeam
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To add multiple record.
     */
    $scope.details_of_team = [{ name: "", local_number: "", imei: "" }];
    $scope.addDetailsOfTeam = function () {
      var detailsArr = { name: "", local_number: "", imei: "" }
      $scope.details_of_team.push(detailsArr);
    }


    /* @function : removeDetailsOfTeam
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To remove multiple record.
     */
    $scope.removeDetailsOfTeam = function () {
      var lastItem = $scope.details_of_team.length - 1;
      $scope.details_of_team.splice(lastItem);
    }


    /* @function : addEmergencyContact
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To add multiple emergency contact.
     */
    $scope.emergency_contact = [{ name: "", role: "", number: "", email: "" }];
    $scope.addEmergencyContact = function () {
      var emergencyContactArr = { name: "", role: "", number: "", email: "" }
      $scope.emergency_contact.push(emergencyContactArr);
    }


    /* @function : removeEmergencyContact
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To remove multiple emergency contact.
     */
    $scope.removeEmergencyContact = function () {
      var lastItem = $scope.emergency_contact.length - 1;
      $scope.emergency_contact.splice(lastItem);
    }



    /* @function : addCallInSchedule
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To add multiple call in schedule.
     */
    $scope.call_in_schedule = [{ number_of_checkin: "", one_check_in_time: "", two_check_in_time: "", point_of_contact: "" }];
    $scope.addCallInSchedule = function () {
      var callInScheduleArr = { number_of_checkin: "", one_check_in_time: "", two_check_in_time: "", point_of_contact: "" }
      $scope.call_in_schedule.push(callInScheduleArr);
    }


    /* @function : removeCallInSchedule
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To remove multiple call in schedule.
     */
    $scope.removeCallInSchedule = function () {
      var lastItem = $scope.call_in_schedule.length - 1;
      $scope.call_in_schedule.splice(lastItem);
    }


    /* @function : redirectToPreviousTab
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To redirect to previous tab
     */
    $scope.redirectToPreviousTab = function () {
      $window.history.back();
    }
    /* @function : redirectToPreviousTab
     *  @author  : MadhuriK 
     *  @created  : 6-sep-17
     *  @modified :
     *  @purpose  : To redirect to Step3 tab
     */
    $scope.nextToStep3 = function () {
      var stateToGo = $rootScope.supplierInformationtest ? 'add_risk_assessment.add_supplier' : (!$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'add_risk_assessment.add_communication' : (!$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
      $state.go(stateToGo, { ra_id: $state.params.ra_id });

    }
    //get back from step 3 
    $scope.backFromStep3 = function () {
      var stateToGo = $rootScope.contingenciestest ? 'add_risk_assessment.add_contingency' : (!$rootScope.contingenciestest && $rootScope.communicationstest) ? 'add_risk_assessment.add_communication' : ($rootScope.supplierInformationtest && !$rootScope.communicationstest && !$rootScope.contingenciestest) ? 'add_risk_assessment.add_supplier' : (!$rootScope.supplierInformationtest && !$rootScope.communicationstest && !$rootScope.contingenciestest && $rootScope.questiontest) ? 'add_risk_assessment.step2' : (!$rootScope.supplierInformationtest && !$rootScope.communicationstest && !$rootScope.contingenciestest && !$rootScope.questiontest && $rootScope.activecountry) ? 'add_risk_assessment.countrythreatmatrix' : 'add_risk_assessment.step1'
      $state.go(stateToGo, { ra_id: $state.params.ra_id, country_id: $window.localStorage.country_id });
    }

    // get back from step 2
    $scope.backFromStep2 = function () {
      var stateToGo = $rootScope.communicationstest ? 'add_risk_assessment.add_communication' : (!$rootScope.communicationstest && $rootScope.supplierInformationtest) ? 'add_risk_assessment.add_supplier' : (!$rootScope.communicationstest && !$rootScope.supplierInformationtest && $rootScope.questiontest) ? 'add_risk_assessment.step2' : (!$rootScope.communicationstest && !$rootScope.supplierInformationtest && !$rootScope.questiontest && $rootScope.activecountry) ? 'add_risk_assessment.countrythreatmatrix' : 'add_risk_assessment.step1'
      $state.go(stateToGo, { ra_id: $state.params.ra_id, country_id: $window.localStorage.country_id });
    }

    // get back from suppllierinformation
    $scope.backFromSuplierinfo = function () {
      var stateToGo = $rootScope.questiontest ? 'add_risk_assessment.step2' : (!$rootScope.questiontest && $rootScope.activecountry) ? 'add_risk_assessment.countrythreatmatrix' : 'add_risk_assessment.step1'
      $state.go(stateToGo, { ra_id: $state.params.ra_id, country_id: $window.localStorage.country_id });
    }

    // get back from backFromCommunication
    $scope.backFromCommunication = function () {
      var stateToGo = $rootScope.supplierInformationtest ? 'add_risk_assessment.add_supplier' : (!$rootScope.supplierInformationtest && $rootScope.questiontest) ? 'add_risk_assessment.step2' : (!$rootScope.supplierInformationtest && !$rootScope.questiontest && $rootScope.activecountry) ? 'add_risk_assessment.countrythreatmatrix' : 'add_risk_assessment.step1';
      $state.go(stateToGo, { ra_id: $state.params.ra_id, country_id: $window.localStorage.country_id });
    }

    /* @function : backToStep1
     *  @author  : MadhuriK 
     *  @created  : 6-sep-17
     *  @modified :
     *  @purpose  : To back to Step1 tab
     */

    $scope.backToStep1 = function () {
      if ($rootScope.activecountry) {
        var ra_id = $window.localStorage.raId
        $state.go('add_risk_assessment.countrythreatmatrix', { ra_id: ra_id, country_id: $window.localStorage.country_id });
      } else {
        $state.go('add_risk_assessment.update', { ra_id: $window.localStorage.raId });
      }
    }

    /* @function : redirectTonextTab
        *  @author  : MadhuriK 
        *  @created  : 29-sep-17
        *  @modified :
        *  @purpose  : To redirect to next step2 tab

        */
    $scope.redirectTonextTab = function () {
      // var stateToGo =  $rootScope.questiontest ? 'add_risk_assessment.step2' :(!$rootScope.questiontest && $rootScope.questiontest) ?'add_risk_assessment.add_supplier':'add_risk_assessment.add_communication';
      // $state.go(stateToGo, { ra_id: $window.localStorage.raId});
      var stateToGo = $rootScope.questiontest ? 'add_risk_assessment.step2' : ($rootScope.supplierInformationtest && !$rootScope.questiontest) ? 'add_risk_assessment.add_supplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'add_risk_assessment.add_communication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
      $state.go(stateToGo, { ra_id: $window.localStorage.raId });
    }

    $scope.redirectTostep1 = function () {
      $state.go('add_risk_assessment.update', { ra_id: $window.localStorage.raId });
      // $window.history.back();
    }

    /* @function : addRaCommunicationByClientAdmin
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To add communication data
     */
    $scope.addRaCommunicationByClientAdmin = function (communicationData) {
      // if (Object.keys(communicationData).length == 0 && !$scope.call_in_schedule && !$scope.emergency_contact && !$scope.details_of_team) {
      //     // $state.go('add_risk_assessment.add_contingency', { ra_id: $state.params.ra_id });
      //     var stateToGo = $rootScope.contingenciestest ? 'add_risk_assessment.add_contingency'  : 'add_risk_assessment.step3' 
      //                     $state.go(stateToGo, { ra_id: $state.params.ra_id });
      // } else {
      if (communicationData == undefined) {
        var stateToGo = $rootScope.contingenciestest ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
        $state.go(stateToGo, { ra_id: $state.params.ra_id });
      } else {
        communicationData.types_of_ra_id = $state.params.ra_id;
        communicationData.call_intime = $scope.callintime;
        communicationData.emergency_contact = $scope.emergency_contact;
        communicationData.details_of_team = $scope.details_of_team;

        if (localStorage.super_admin == "true") {
          communicationData.super_admin = 1;

        } else {
          communicationData.super_admin = 0;
          communicationData.client_id = $window.localStorage.logclient_id;

        }

        if (communicationData._id) {
          RiskAssessment.updateRaCommunicationByClientAdmin(communicationData, function (response) {
            if (response.code == 200) {
              toaster.pop('success', "", response.message);
              $rootScope.contingency_active = true;
              $timeout(function () {
                var stateToGo = $rootScope.contingenciestest ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
                $state.go(stateToGo, { ra_id: $state.params.ra_id });
              }, 500);
            } else {
              toaster.pop('error', "", response.message);
            }
          })
        } else {
          RiskAssessment.addRaCommunicationByClientAdmin(communicationData, function (response) {
            if (response.code == 200) {
              $window.localStorage.communication_id = response.data._id;
              toaster.pop('success', "", response.message);
              $rootScope.contingency_active = true;
              $timeout(function () {
                var stateToGo = $rootScope.contingenciestest ? 'add_risk_assessment.add_contingency' : 'add_risk_assessment.step3'
                $state.go(stateToGo, { ra_id: $state.params.ra_id });
              }, 500);
            } else {
              toaster.pop('error', "", response.message);
            }
          })
        }
      }
    }


    // to get data of communication
    if ($window.localStorage.communication_id && $state.current.name == "add_risk_assessment.add_communication") {
      RiskAssessment.getRaCommunicationData($window.localStorage.communication_id, function (response) {
        if (response.code == 200) {
          $scope.communication = response.data;
          if ( response.data.call_in_schedule ) {
            $scope.call_in_schedule = response.data.call_in_schedule.length > 0 ? response.data.call_in_schedule : [{ number_of_checkin: "", one_check_in_time: "", two_check_in_time: "", point_of_contact: "" }];
          }
          
          $scope.emergency_contact = response.data.emergency_contact.length > 0 ? response.data.emergency_contact : [{ name: "", role: "", number: "", email: "" }];
          $scope.details_of_team = response.data.details_of_team.length > 0 ? response.data.details_of_team : [{ name: "", local_number: "", imei: "" }];
        } else {
          $scope.communication = {};
        }
      })
    }


    // to active contingency state
    if ($state.current.name !== 'add_risk_assessment.add_contingency') {
      $rootScope.contingency_active = false;
    } else if ($state.current.name == 'add_risk_assessment.add_contingency') {
      $rootScope.contingency_active = true;
    }


    /* @function : addRaContingencyByClientAdmin
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To add contingency data
     */

    $scope.addRaContingencyByClientAdmin = function (contingencyData) {


      if (contingencyData == undefined) {
        $state.go('add_risk_assessment.step3', { ra_id: $state.params.ra_id });
      } else {

        if (localStorage.super_admin == "true") {

          contingencyData.super_admin = 1;

        } else {

          contingencyData.super_admin = 0;
          contingencyData.client_id = $window.localStorage.logclient_id;

        }

        contingencyData.types_of_ra_id = $state.params.ra_id;
        if (contingencyData._id) {
          RiskAssessment.updateRaContingencyByClientAdmin(contingencyData, function (response) {
            if (response.code == 200) {
              toaster.pop('success', "", response.message);
              $timeout(function () {
                $state.go('add_risk_assessment.step3', { ra_id: $state.params.ra_id });
              }, 500);
            } else {
              toaster.pop('error', "", response.message);
            }
          })
        } else {
          RiskAssessment.addRaContingencyByClientAdmin(contingencyData, function (response) {
            if (response.code == 200) {
              $window.localStorage.contingency_id = response.data._id;
              toaster.pop('success', "", response.message);
              $timeout(function () {
                $state.go('add_risk_assessment.step3', { ra_id: $state.params.ra_id });
              }, 500);
            } else {
              toaster.pop('error', "", response.message);
            }
          })
        }
      }
    }

    // to get contingency data
    if ($window.localStorage.contingency_id && $state.current.name == "add_risk_assessment.add_contingency") {
      console.log("ula vara")
      RiskAssessment.getContingencyData($window.localStorage.contingency_id, function (response) {
        if (response.code == 200) {
          $scope.contingencies = response.data;
        } else {
          $scope.contingencies = {};
        }
      })
    }

    $scope.countrythreatCheckBox = function (value) {
      $window.localStorage.setItem('countryvalue', value);
      $rootScope.countrythreattest = value;
      // console.log("1"+countrythreattest);
    }
    $scope.supplierInfoCheckBox = function (value) {
      $window.localStorage.setItem('supppliervalue', value);
      $rootScope.supplierInformationtest = value;
    }
    $scope.communicationsCheckBox = function (value) {
      $window.localStorage.setItem('communicationsvalue', value);
      $rootScope.communicationstest = value;
    }
    $scope.contingenciesCheckBox = function (value) {
      $window.localStorage.setItem('contingenciesvalue', value);
      $rootScope.contingenciestest = value;
    }
    $scope.questionCheckBox = function (value) {
      $window.localStorage.setItem('questionvalue', value);
      $rootScope.questiontest = value;
    }
    $scope.backToPreviousTab = function () {
      $window.history.back();
    }

    $scope.backTorisklabel = function () {

      $state.go('add_risk_assessment.step2', { ra_id: $window.localStorage.raId });


    }



    /* @function : redirectTo
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To redirect to specific page
     */

    $scope.sendToCountryThreatMatrix = function () {
      $scope.country_id = $window.localStorage.country_id;
      $state.go('add_risk_assessment.countrythreatmatrix', { ra_id: $window.localStorage.raId, country_id: $scope.country_id });
    }

    $scope.goToSupplierPage = function () {
      if ($window.localStorage.raId || $state.params.ra_id) {
        var ra_id = $window.localStorage.raId ? $window.localStorage.raId :
          $state.params.ra_id ? $state.params.ra_id : "";
        $state.go('add_risk_assessment.add_supplier', { ra_id: ra_id });
      }
    }

    $scope.goToCommunicationPage = function () {
      if ($window.localStorage.raId || $state.params.ra_id) {
        var ra_id = $window.localStorage.raId ? $window.localStorage.raId :
          $state.params.ra_id ? $state.params.ra_id : "";
        $state.go('add_risk_assessment.add_communication', { ra_id: ra_id });
      }
    }
    $scope.goToContingencyPage = function () {
      if ($window.localStorage.raId || $state.params.ra_id) {
        var ra_id = $window.localStorage.raId ? $window.localStorage.raId :
          $state.params.ra_id ? $state.params.ra_id : "";
        $state.go('add_risk_assessment.add_contingency', { ra_id: ra_id });
      }
    }


    $scope.timebox = function (checkin) {

      $scope.call_intime = [];

      var timevalue = 24 / checkin;



      var org_time = "0";
      var dummy_val="0";
      for (var i = 0; i < checkin; i++) {

        var arrayvalue = { call_in_time: org_time }


        $scope.call_intime.push(arrayvalue)
        dummy_val = Math.round(dummy_val + timevalue);

        if(dummy_val==0){
          org_time = "0000";
        }else if(dummy_val ==1){
          org_time = "0100";
        }else if(dummy_val ==2){
          org_time = "0200";
        }else if(dummy_val ==3){
          org_time = "0300";
        }else if(dummy_val ==4){
          org_time = "0400";
        }else if(dummy_val ==5){
          org_time = "0500";
        }else if(dummy_val ==6){
          org_time = "0600";
        }else if(dummy_val ==7){
          org_time = "0700";
        }else if(dummy_val ==8){
          org_time = "0800";
        }else if(dummy_val ==9){
          org_time = "0900";
        }else if(dummy_val ==10){
          org_time = "1000";
        }else if(dummy_val ==11){
          org_time = "1100";
        }else if(dummy_val ==12){
          org_time = "1200";
        }else if(dummy_val ==13){
          org_time = "1300";
        }else if(dummy_val ==14){
          org_time = "1400";
        }else if(dummy_val ==15){
          org_time = "1500";
        }else if(dummy_val ==16){
          org_time = "1600";
        }else if(dummy_val ==17){
          org_time = "1700";
        }else if(dummy_val ==18){
          org_time = "1800";
        }else if(dummy_val ==19){
          org_time = "1900";
        }else if(dummy_val ==20){
          org_time = "2000";
        }else if(dummy_val ==21){
          org_time = "2100";
        }else if(dummy_val ==22){
          org_time = "2200";
        }else if(dummy_val ==23){
          org_time = "2300";
        }


      }


    }
    /* @function : setcronvalue
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To set  time for remove rejeted ra from database .
     */

    $scope.setcronvalue = function (selected) {
      if (selected._id) {
        RiskAssessment.updateCron(selected, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('main.dashboard');
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      } else {
        RiskAssessment.setCron(selected, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('main.dashboard');
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }

    /* @function : setcronvalue
     *  @author  : MadhuriK 
     *  @created  : 29-Aug-17
     *  @modified :
     *  @purpose  : To get time for ra timer  .
     */
    $scope.getTimerSetting = function () {
      $scope.selected = {};
      RiskAssessment.getTimerSetting(function (response) {
        if (response.code === 200) {
          $scope.selected = response.data[0];
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }

    /* @function : getAllRiskAssessmentByMA
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : getAllRiskAssessmentByMA
     */
    $scope.getAllRiskAssessmentByMA = function (keyword) {

      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
          createdAt: -1 // initial sorting
        }
      }, {
          getData: function ($defer, params) {
            var page = params.page();
            var count = params.count();
            var sorting = params.sorting();
            RiskAssessment.getAllRiskAssessmentByMA({ page: page, count: count, sortby: sorting, keyword: keyword }, function (response) {
              console.log("response", response.count)
              if (response.code === 200) {
                response.data.forEach(function (typera) {
                  typera.sector = [];
                  if (typera.sector_name.length > 0) {
                    typera.sector_name.forEach(function (sectorname) {
                      typera.sector.push(sectorname.sectorName);
                    })
                  }
                })
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
                $scope.typeOfRaData = response.data;
              } else {
                toaster.pop('error', "", response.err);
              }
            });
          }
        });
    }

  })
