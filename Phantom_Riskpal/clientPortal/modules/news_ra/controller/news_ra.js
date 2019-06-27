'use strict';
angular.module('news_ra', ['ui.router', 'angularUtils.directives.dirPagination', 'ui.bootstrap', 'angularTrix'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('newsTravellerRa.news_ra', {
        url: '/add/:types_of_ra_id',
        templateUrl: 'modules/news_ra/views/news_ra.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })
      .state('newsTravellerRa', {
        url: '/news_ra',
        templateUrl: 'modules/news_ra/views/newsTravellerRa.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.news_ra_list', {
        url: '/news_ra/list',
        templateUrl: 'modules/news_ra/views/news_ra_list.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.news_ra_second', {
        url: '/news_ra/add/second/:types_of_ra_id/:news_ra_id',
        templateUrl: 'modules/news_ra/views/news_ra_second.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.update_news_ra', {
        url: '/news_ra/update_news_ra/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/update_news_ra.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.list_category_questionnaire', {
        url: '/news_ra/list_category_questionnaire/:news_ra_id/:category_id',
        templateUrl: 'modules/news_ra/views/list_category_questionnaire.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.copy_news_ra', {
        url: '/copy/news_ra/:newsRa_id',
        templateUrl: 'modules/news_ra/views/copy_news_ra.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.view_news_ra', {
        url: '/view/news_ra/:newsRa_id',
        templateUrl: 'modules/news_ra/views/view_news_ra.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.new_templates', {
        url: '/main/ra_templates',
        templateUrl: 'modules/news_ra/views/ratemplates.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })
      // .state('main.addSupplier', {
      //     url: '/add/supplier/:news_ra_id',
      //     templateUrl: 'modules/news_ra/views/addSupplier.html',
      //     controller: 'NewsRaCtrl',
      //     parent: 'main',
      //     authenticate: true
      // })
      // .state('main.addCommunication', {
      //     url: '/add/communication/:news_ra_id',
      //     templateUrl: 'modules/news_ra/views/addCommunication.html',
      //     controller: 'NewsRaCtrl',
      //     parent: 'main',
      //     authenticate: true
      // })
      // .state('main.addContingenciesKit', {
      //     url: '/add/contingenciesKit/:news_ra_id',
      //     templateUrl: 'modules/news_ra/views/addContingenciesKit.html',
      //     controller: 'NewsRaCtrl',
      //     parent: 'main',
      //     authenticate: true
      // })
      // .state('main.addAnyOtherInfo', {
      //     url: '/add/anyOtherInfo/:news_ra_id',
      //     templateUrl: 'modules/news_ra/views/addAnyOtherInfo.html',
      //     controller: 'NewsRaCtrl',
      //     parent: 'main',
      //     authenticate: true
      // })


      /** RA creation new flow  date 24July17*/

      .state('main.add_ra', {
        url: '/add/Ra/:types_of_ra_id',
        templateUrl: 'modules/news_ra/views/add_ra.html',
        controller: 'NewsRaCtrl',
        parent: 'main',
        authenticate: true
      })

      .state('newsTravellerRa.ra_questions', {
        url: '/ra/questions/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/list_questions.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })

      .state('newsTravellerRa.risklabel', {
        url: '/ra/questions/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/risk_label.html',
        controller: 'NewsRaCtrl',
        authenticate: true
      })
      .state('newsTravellerRa.add_question', {
        url: '/add/question/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/add_question.html',
        controller: 'NewsRaCtrl',
        authenticate: true
      })

      .state('newsTravellerRa.update_ra', {
        url: '/update/ra/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/update_ra.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })
      .state('newsTravellerRa.addSupplier', {
        url: '/add/supplier/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/addSupplier.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })
      .state('newsTravellerRa.addCommunication', {
        url: '/add/communication/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/addCommunication.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })
      .state('newsTravellerRa.addContingenciesKit', {
        url: '/add/contingenciesKit/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/addContingenciesKit.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })
      .state('newsTravellerRa.addAnyOtherInfo', {
        url: '/add/anyOtherInfo/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/addAnyOtherInfo.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })
      .state('newsTravellerRa.preview_ra', {
        url: '/preview_ra/:types_of_ra_id/:newsRa_id',
        templateUrl: 'modules/news_ra/views/preview_ra.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })
      .state('newsTravellerRa.countrythreatmatrix', {
        url: '/countrythreatmatrix/:types_of_ra_id/:newsRa_id/:country_id',
        templateUrl: 'modules/news_ra/views/countrythreatmatrix.html',
        controller: 'NewsRaCtrl',
        // parent: 'main',
        authenticate: true
      })

      .state('newsTravellerRa.get_risk_que', {
        url: '/risk_questions/:types_of_ra_id/:newsRa_id/:risk_label_id',
        templateUrl: 'modules/news_ra/views/risk_ques.html',
        controller: 'RiskAssessmentCtrl',
        authenticate: true
      })

      /** end */
      /**Aproving Manager states */

      .state('main.list_news_ra', {
        url: '/newsRaList',
        templateUrl: 'modules/news_ra/views/newsRaList.html',
        controller: 'NewsRaCtrl',
        authenticate: true
      })
      .state('main.view_pendingRa_details', {
        url: '/view/newsRaDetails/:newsRa_id',
        templateUrl: 'modules/news_ra/views/newsRaDetails.html',
        controller: 'NewsRaCtrl',
        authenticate: true
      })
      .state('main.edit_pendingRa_details', {
        url: '/view/newsRaEdit/:newsRa_id',
        templateUrl: 'modules/news_ra/views/newsRaEdit.html',
        controller: 'NewsRaCtrl',
        authenticate: true
      })
      .state('main.terms_and_conditions', {
        url: '/view/terms_and_conditions/:traveller_id',
        templateUrl: 'modules/news_ra/views/terms_and_condition.html',
        controller: 'NewsRaCtrl',
        authenticate: true
      })
      .state('main.list_news_raall', {
        url: '/newsRaallList',
        templateUrl: 'modules/news_ra/views/new_raalllist.html',
        controller: 'NewsRaCtrl',
        authenticate: true
      })


  })



  .controller('NewsRaCtrl', function ($scope, toaster, $timeout, NewsRa, ngTableParams, $state, $window, Upload, $rootScope, $location, $filter, User, $modal, $sce, Supplier, RiskAssessment, Question) {
    $scope.moreCountryField = [];
    $scope.countryAddMoreDisabled = false;
    $scope.addMoreCountry = function () {
      if ( $scope.moreCountryField.length < 5 ) {
        $scope.moreCountryField.push({})
      } else {
        $scope.countryAddMoreDisabled = true;
      }
        
    }
    $scope.removeMoreCountry = function (index) {
      if ( $scope.moreCountryField.length > 1 ) {
        $scope.moreCountryField.splice(index, 1);
        $scope.countryAddMoreDisabled = false;
      } 
    }
    
    function MyDate() {
      this.zDate = new Date(Date.UTC(2012, 12, 5, 9, 0))
    }
    Object.defineProperty(MyDate.prototype, 'stTime', {
      get: function () {
        var t = this.zDate;
        return new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes());
      },
      set: function (t) {
        console.log(t);
        this.zDate = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes()));
      }
    });

    function dateCtrl($scope) {
      $scope.myDate = {
        date: new MyDate(),
        date2: new Date(Date.UTC(2012, 12, 5, 9, 0))
      };
    };

    $('body').popover({ selector: '[data-popover]', trigger: 'click hover', placement: 'left', delay: { show: 50, hide: 500 } });
    //data-min-date="{{previewData.start_date}}"
    $scope.defalt_view;
    $scope.newsRa = {}
    $scope.newsRa.date_of_ra = new Date();



    $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.open1 = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened1 = true;
    };

    /* @function : getAllTypeOfRa
     *  @author  : MadhuriK 
     *  @created  : 09-Jun-17
     *  @modified :
     *  @purpose  : To get all type of RAs.
     */
    $scope.getAllTypeOfRa = function () {

      NewsRa.getAllTypeOfRa(function (response) {

        if (response.code === 200) {
          $scope.typeOfRaArr = response.data;
        } else {
          $scope.typeOfRaArr = [];
        }
      })
    }




    /* @function : getCountries
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : To get all Countries.
     */
    $scope.getCountries = function () {
      NewsRa.getCountries(function (response) {
        if (response.code === 200) {
          $scope.countryArr = response.data;
        } else {
          $scope.countryArr = [];
          toaster.pop('error', "", response.message);
        }
      })
    }

    /* @function : getAllTravellers
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : To get all travellers.
     */
    $scope.getAllTravellers = function () {
      NewsRa.getAllTravellers(function (response) {
        if (response.code === 200) {
          // $scope.fullnamearr = [];
          $scope.travellerArr = response.data;
          for (var i = 0; i < $scope.travellerArr.length; i++) {
            $scope.travellerArr[i].fullname = $scope.travellerArr[i].firstname + ' ' + $scope.travellerArr[i].lastname;
          };
        } else {
          $scope.travellerArr = [];
          toaster.pop('error', "", response.message);
        }
      })
    }


    /* @function : getAllApprovingManger
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : To get all users based on departments and approving managers from related to department.
     */
    $scope.getAllApprovingManger = function (fromPage = false) {
      var types_of_ra_id= $state.params.types_of_ra_id;
    
      NewsRa.getDeptRelatedUsersAprovingmanger(types_of_ra_id,function (response) {
        console.log('response', response)
        if (response.code === 200) {
          var dataArr = [];
          if ( fromPage )
          {
            $scope.client_department = response.traveller.client_department;
          }
            
          $scope.travellerDepartment = response.travellerDepartment.department;
          console.log('response travller detp', response.travellerDepartment);
        
          response.traveller.client_department.forEach(function (dept) {
            // if (dept._id.length > 0) {
            //   // questionObj.category_id.forEach(function(queCat) {
            //   //   if (queCat._id == risk_label) {
            //   //     dataArr.push(questionObj);
            //   //   }
            //   // })
            // }
            
            console.log('dept approving manage', dept)

            response.data.forEach(function (final_user) {

              if (final_user._id == dept.final_approving_manager ) {


                dataArr.push(final_user);
              }

             var alter_appr=dept.alternative_final_approving_manager.indexOf(final_user._id);

             console.log(alter_appr)
             if(alter_appr != -1){

              dataArr.push(final_user);


             }

            //   response.traveller.client_department.alternative_final_approving_manager.forEach(function (alter){

            //  console.log(alter)   


            //   })

            })
          })

          var result = [];
          $.each(dataArr, function (i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
          });


          $scope.approvingManager = result;

        } else {
          $scope.approvingManager = [];

          toaster.pop('error', "", response.message);
        }
      })
    }

    /* @function : getAllApprovingManger
    *  @author  : Siroi 
    *  @created  : 23-May-18
    *  @modified :
    *  @purpose  : To get all users related to logged in userd department.
    */
    $scope.getDeptRelatedUsers = function () {
      NewsRa.getDeptRelatedUsers(function (response) {
        if (response.code === 200) {


          $scope.getDeptRelatedUsers = response.data;
          $scope.getDeptRelatedUsersother = response.data;

          $scope.primarytraveler = response.data;


        } else {
          $scope.getDeptRelatedUsers = [];
          $scope.getDeptRelatedUsersother = [];

          $scope.primarytraveler = [];


          toaster.pop('error', "", response.message);
        }
      })
    }

    /* @function : getTraveller
    *  @author  : Siroi 
    *  @created  : 23-May-18
    *  @modified :
    *  @purpose  : To get users based primary traveller selection
    */

    $scope.othertraveller = function(traveller_id){

   
      NewsRa.getOthertraveller(traveller_id,function (response) {
        console.log(response)
        if (response.code === 200) {


          $scope.getDeptRelatedUsersother = response.data;


        } else {
          $scope.getDeptRelatedUsersother = [];


          toaster.pop('error', "", response.message);
        }
      })
     
    }


    /* @function : addNewsRa
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : To add news ra of travellers.
     */
    $scope.addNewsRa = function (news_ra) {
      var countryArray = [];
      news_ra.country =   $scope.moreCountryField;
      news_ra.country.forEach(function (countries) {
        countryArray.push(JSON.parse(countries.country)._id);
      })
      var departmentArr = [];
      news_ra.department.forEach(function (depart) {
        departmentArr.push(depart._id);
      })
      if (news_ra.approvingManager.length == 0) {
        toaster.pop('error', "", 'Please select approving manager');
      } else if (news_ra.country.length == 0) {
        toaster.pop('error', "", 'Please select country of operation');
      } else if($scope.checkDuplicateCountry(countryArray)) {
        toaster.pop('error', "", 'Please select different country of operation');
      }else {
        news_ra.itinearyArr = [];
        news_ra.itinearyArr = $scope.scheduleArr;

        var project_code = "";
        news_ra.country.forEach(function (country) {
          project_code += country.code + "_"
        })
        news_ra.project_code = project_code + Date.now();
        news_ra.department = [];
        news_ra.department = departmentArr;
        news_ra.types_of_ra_id = $state.params.types_of_ra_id;
        news_ra.travellerTeamArr = news_ra.getDeptRelatedUsers;
        console.log("team" + news_ra.travellerTeamArr)
        NewsRa.addNewsRa(news_ra, function (response) {
          if (response.code === 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }

    }
    /* @function : getRA template information
        *  @author  : siroi 
        *  @created  : 27-jul-18
        *  @modified :
        *  @purpose  : To get template information
        */

    $scope.redirect_racreation = function (ratemplate_id, racountrypage, communicationpage, supplierpage, contingenciespage, questionpage) {

      delete $window.localStorage.communicationsvalue;
      delete $window.localStorage.contingenciesvalue;
      delete $window.localStorage.supppliervalue;
      delete $window.localStorage.questionvalue;
      delete $window.localStorage.countryvalue;
      $rootScope.supplierInformationtest = false;
      $rootScope.countrythreattest = false;
      $rootScope.communicationstest = false;
      $rootScope.contingenciestest = false;
      $rootScope.questiontest = false;

      $window.localStorage.setItem('communicationsvalue', communicationpage);
      $window.localStorage.setItem('contingenciesvalue', contingenciespage);
      $window.localStorage.setItem('supppliervalue', supplierpage);
      $window.localStorage.setItem('questionvalue', questionpage);
      $window.localStorage.setItem('countryvalue', racountrypage);


      $state.go('newsTravellerRa.news_ra', { types_of_ra_id: ratemplate_id })

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



    /* @function : getAllNewsRa
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : To get all news ra's of particular traveller.
     */
    $scope.getAllNewsRa = function (keyword) {
      console.log("keyword", keyword)
      // var types_of_ra_id = $state.params.types_of_ra_id;
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
            NewsRa.getAllNewsRa({ page: page, count: count, sortby: sorting, keyword: keyword }, function (response) {
              if (response.code === 200) {
                if (response.data.length > 0) {
                  $rootScope.ra_name = response.typeOfRa.ra_name;
                  response.data.forEach(function (newsRa) {
                    console.log("newsRa :", newsRa);
                    newsRa.countryArr = [];
                    newsRa.countrycolor = [];
                    newsRa.departmentArr = [];
                    newsRa.approvingArr = [];
                    newsRa.situation = [];
                    newsRa.incident = [];
                    newsRa.situationlog = [];
                    if (newsRa.situationlog_report.length > 0) {
                      newsRa.situationlog_report.forEach(function (situationlog) {
                        newsRa.situationlog.push(situationlog.log_name);
                      })
                    }
                    if (newsRa.country.length > 0) {
                      newsRa.country.forEach(function (country) {
                        newsRa.countryArr.push(country.name);
                      })
                    }
                    if (newsRa.situation_report.length > 0) {
                      newsRa.situation_report.forEach(function (situation_report) {
                        newsRa.situation.push(situation_report.report_name);
                      })
                    }
                    if (newsRa.incident_report.length > 0) {
                      newsRa.incident_report.forEach(function (incident_report) {
                        newsRa.incident.push(incident_report.incident_type);
                      })
                    }
                    if (newsRa.country.length > 0) {
                      newsRa.country.forEach(function (country) {
                        if (country.color) {
                          newsRa.countrycolor.push(country.color.replace(/'/g, ''));
                        }
                      })
                    }
                    if (newsRa.department.length > 0) {
                      newsRa.department.forEach(function (depart) {
                        newsRa.departmentArr.push(depart.department_name);
                      })
                    }
                    if (newsRa.approvingManager.length > 0) {
                      newsRa.approvingManager.forEach(function (approving) {
                        newsRa.approvingArr.push(approving.firstname);
                      })
                    }
                  })
                }
                // if (response.typeOfRa) {
                //   console.log("testt")
                //   console.log(response.typeOfRa)
                //   delete $window.localStorage.communicationsvalue;
                //   delete $window.localStorage.contingenciesvalue;
                //   delete $window.localStorage.supppliervalue;
                //   delete $window.localStorage.questionvalue;
                //   delete $window.localStorage.countryvalue;
                //   $rootScope.supplierInformationtest = false;
                //   $rootScope.countrythreattest = false;
                //   $rootScope.communicationstest = false;
                //   $rootScope.contingenciestest = false;
                //   $rootScope.questiontest = false;

                //   $window.localStorage.setItem('communicationsvalue', response.typeOfRa.communicationRequired);
                //   $window.localStorage.setItem('contingenciesvalue', response.typeOfRa.contingenciesRequired );
                //   $window.localStorage.setItem('supppliervalue', response.typeOfRa.supplierRequired );
                //   $window.localStorage.setItem('questionvalue', response.typeOfRa.questionRequired );
                //   $window.localStorage.setItem('countryvalue', response.typeOfRa.countryrequired);

                // }
                params.total(response.count);
                $defer.resolve(response.data);
                $scope.NewsRaData = response.data;
                $rootScope.typeofRa = response.typeOfRa;

              } else {
                toaster.pop('error', "", response.err);
              }
            });
          }
        });
    }



    /* @function : addNewsRaAndNext
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : To add news ra and redirect to next page.
     */
    $scope.addNewsRaAndNext = function (news_ra) {
      var countryArray = [];
      news_ra.country =   $scope.moreCountryField;
      news_ra.country.forEach(function (countries) {
        countryArray.push(JSON.parse(countries.country)._id);
      })
      if (!news_ra.approvingManager == 0) {
        toaster.pop('error', "", 'Please select approving manager');
      } else if (news_ra.country.length == 0) {
        toaster.pop('error', "", 'Please select country of operation');
      } else if($scope.checkDuplicateCountry(countryArray)) {
        toaster.pop('error', "", 'Please select different country of operation');
      }else if (news_ra.department.length == 0) {
        toaster.pop('error', "", 'Please select atlest one department');
      } else {
        var departmentArr = [];
        news_ra.department.forEach(function (depart) {
          departmentArr.push(depart._id);
        })
        news_ra.itinearyArr = [];
        news_ra.itinearyArr = $scope.scheduleArr;

        var project_code = "";
        news_ra.country.forEach(function (country) {
          project_code += country.code + "_"
        })
        news_ra.project_code = project_code + Date.now();
        news_ra.department = [];
        news_ra.department = departmentArr;
        news_ra.types_of_ra_id = $state.params.types_of_ra_id;
        NewsRa.addNewsRa(news_ra, function (response) {
          var news_ra_id = response.data._id;
          if (response.code === 200) {
            // toaster.pop('success', "", response.message);
            $timeout(function () {
              // $state.go('main.news_ra_second', { news_ra_id: news_ra_id });
              $state.go('main.news_ra_second', { types_of_ra_id: $state.params.types_of_ra_id, news_ra_id: news_ra_id })
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }


    



    /* @function : getCategories
     *  @author  : MadhuriK 
     *  @created  : 20-Apr-17
     *  @modified :
     *  @purpose  : To get all categories.
     */
    $scope.getCategories = function () {
      var types_of_ra_id = $state.params.types_of_ra_id;
      NewsRa.getCategories(types_of_ra_id, function (response) {
        if (response.code === 200) {
          $scope.categories = response.data;
        } else {
          $scope.categories = [];
        }
      })
    }



    /* @function : getNewsRaDetails
     *  @author  : MadhuriK 
     *  @created  : 21-Apr-17
     *  @modified :
     *  @purpose  : To get news ra detials from update page.
     */
    $scope.getNewsRaDetails = function () {
      var types_of_ra_id= $state.params.types_of_ra_id;

 
      NewsRa.getDeptRelatedUsersAprovingmanger(types_of_ra_id,function (result1) {
        if (result1.code === 200) {
          console.log('hereeeeeeee', result1);
          var dataArr = [];
          $scope.client_department = result1.traveller.client_department;
          
          result1.traveller.client_department.forEach(function (dept) {


            result1.data.forEach(function (final_user) {

              if (final_user._id == dept.final_approving_manager || final_user._id == dept.alternative_final_approving_manager || final_user._id == dept.intermediate_approving_manager) {

                dataArr.push(final_user);
              }

            })
          })

          var resultArr = [];
          $.each(dataArr, function (i, e) {
            if ($.inArray(e, resultArr) == -1) resultArr.push(e);
          });


          $scope.approvingManagerArr = resultArr;
          console.log($scope.approvingManagerArr)

          $scope.getNewsRaDetailsNew(result1);


        } else {
          $scope.approvingManagerArr = [];

          toaster.pop('error', "", response.message);
        }
      })



    }

    $scope.getNewsRaDetailsNew = function (raData) {

      var newsRa_id = $state.params.newsRa_id;


      NewsRa.getNewsRaDetails(newsRa_id, function (response) {


        if (response.code == 200) {
          console.log("trrrrrrrrrrrrr")
          console.log(response.data)

          delete $window.localStorage.communicationsvalue;
          delete $window.localStorage.contingenciesvalue;
          delete $window.localStorage.supppliervalue;
          delete $window.localStorage.questionvalue;
          delete $window.localStorage.countryvalue;

          $rootScope.supplierInformationtest = false;
          $rootScope.countrythreattest = false;
          $rootScope.communicationstest = false;
          $rootScope.contingenciestest = false;
          $rootScope.questiontest = false;

          $window.localStorage.setItem('communicationsvalue', response.data.types_of_ra_id.communicationRequired);
          $window.localStorage.setItem('contingenciesvalue', response.data.types_of_ra_id.contingenciesRequired);
          $window.localStorage.setItem('supppliervalue', response.data.types_of_ra_id.supplierRequired);
          $window.localStorage.setItem('questionvalue', response.data.types_of_ra_id.questionRequired);
          $window.localStorage.setItem('countryvalue', response.data.types_of_ra_id.countryrequired);
          $scope.client_department = raData.traveller.client_department;
          $scope.departmentArray = []; // used for newsRaEdit.html
          $scope.client_department.forEach(item => {
            response.data.department.forEach(dept => {
              $scope.departmentArray.push(dept.department_name);
              if ( item._id == dept ) {
                item.ticked = true;
              }
            })
          });
          console.log('client dtparmtne', $scope.client_department);
          
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



          NewsRa.getCountries(function (result) {
            // if (response.code === 200) {
              $scope.selectedCountry = response.data.country;
              $scope.moreCountryField = [];
              console.log('$scope.mre before', $scope.moreCountryField,);
              $scope.selectedCountry.forEach(item => {
                $scope.moreCountryField.push({_id: item});
            });
          console.log('$scope.moreCountryField', $scope.moreCountryField, '---', $scope.selectedCountry);
              $scope.countryArr = result.data;
              
            // }
          })

          // show selected traveller list 
          NewsRa.getDeptRelatedUsers(function (result) {
            if (response.code === 200) {
              $scope.getDeptRelatedUsers = result.data;
              
              $scope.getDeptRelatedUsers.forEach(function (traveller) {
                response.data.travellerTeamArr.forEach(function (final_ap) {

                  if (traveller._id == final_ap) {
                    traveller.ticked = true;
                  }
                })

              })



            }
          })

          NewsRa.getOthertraveller(response.data.traveller_id,function (responseother) {
            if (response.code === 200) {
    
    
              $scope.getDeptRelatedUsersother = responseother.data;
              $scope.getDeptRelatedUsersother.forEach(function (traveller) {
                response.data.travellerTeamArr.forEach(function (final_ap) {

                  if (traveller._id == final_ap) {
                    traveller.ticked = true;
                  }
                })

              })
    
    
            } else {
              $scope.getDeptRelatedUsersother = [];
    
    
              toaster.pop('error', "", responseother.message);
            }
          })







          // // show selected approving manager list 
          // NewsRa.getAllApprovingManger(function(result) {
          //   if (response.code === 200) {
          //     $scope.approvingManagerArr = result.data;
          //     // $scope.finalApprovingManager = [];
          //     //$scope.approvingManagerArrCopy = angular.copy($scope.approvingManagerArr);

          //     for (var i = 0; i < $scope.approvingManagerArr.length; i++) {
          //       $scope.approvingManagerArr[i].fullname = $scope.approvingManagerArr[i].firstname + ' ' + $scope.approvingManagerArr[i].lastname;
          //     }
          //     for (var i = 0; i < response.data.approvingManager.length; i++) {
          //       $scope.finalApprovingManager.push({ _id: response.data.approvingManager[i], fullname: $scope.approvingManagerArr[i].fullname })
          //     }
          //     // $scope.approvingManagerArr.forEach(function(approvingManager) {
          //     //   response.data.approvingManager.forEach(function(approvingManagerId, key) {
          //     //     if (approvingManagerId == approvingManager._id) {
          //     //       $scope.finalApprovingManager[key] = approvingManager;
          //     //     }
          //     //   })
          //     // })
          //   }
          // })
          $scope.scheduleArr = response.data.itinearyArr;

          $scope.newsRa = response.data;
          console.log("REEEEEEEEE")
          console.log(response.data)
        } else {
          $scope.newsRa = [];
        }
      })
    }




    /* @function : updateNewsRa
     *  @author  : MadhuriK 
     *  @created  : 21-Apr-17
     *  @modified :
     *  @purpose  : To update news ra.
     */
    $scope.updateNewsRa = function (news_ra) {
      var departmentArr = [];
      var countryArray = [];
      news_ra.country =   $scope.moreCountryField;
      news_ra.country.forEach(function (countries) {
        countryArray.push(JSON.parse(countries.country)._id);
      })
      news_ra.department.forEach(function (depart) {
        departmentArr.push(depart._id);
      })
      if (news_ra.approvingManager.length == 0) {
        toaster.pop('error', "", 'Please select approving manager');
      } else if (news_ra.country.length == 0) {
        toaster.pop('error', "", 'Please select country of operation');
      } else if($scope.checkDuplicateCountry(countryArray)) {
        toaster.pop('error', "", 'Please select different country of operation');
      }else {
        news_ra.department = [];
        news_ra.department = departmentArr;
        // news_ra.itinearyArr = [];
        // news_ra.itinearyArr = $scope.scheduleArr;

        NewsRa.updateNewsRa(news_ra, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              // $state.go('main.news_ra_list');
              $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
            }, 500);
          } else {
            let msg = '';
              
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
        })
      }

    }



    /* @function : updateNewsRaAndNext
     *  @author  : MadhuriK 
     *  @created  : 21-Apr-17
     *  @modified :
     *  @purpose  : To update news ra and redirect to next page.
     */
    $scope.updateNewsRaAndNext = function (news_ra) {
      var countryArray = [];
      news_ra.country =   $scope.moreCountryField;
      news_ra.country.forEach(function (countries) {
        countryArray.push(JSON.parse(countries.country)._id);
      })
      var departmentArr = [];
      news_ra.department.forEach(function (depart) {
        departmentArr.push(depart._id);
      })
      if (news_ra.approvingManager.length == 0) {
        toaster.pop('error', "", 'Please select approving manager');
      } else if (news_ra.country.length == 0) {
        toaster.pop('error', "", 'Please select country of operation');
      } else if($scope.checkDuplicateCountry(countryArray)) {
        toaster.pop('error', "", 'Please select different country of operation');
      }else {
        news_ra.department = [];
        news_ra.department = departmentArr;

        news_ra.itinearyArr = [];
        news_ra.itinearyArr = $scope.scheduleArr;

        NewsRa.updateNewsRa(news_ra, function (response) {
          if (response.code == 200) {
            $timeout(function () {

              if ($rootScope.countrythreattest && response.country[0]._id) {
                $rootScope.countrythreattest = true;
                console.log("fdfdfddfdd")
                $window.localStorage.setItem('countrythreat', true);
                // $state.go('add_risk_assessment.countrythreatmatrix', { ra_id: $window.localStorage.raId, country_id: country_id });
                $state.go('newsTravellerRa.countrythreatmatrix', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: response.data._id, country_id: $scope.country_id }, { reload: true })

              } else {
                $rootScope.activecountry = false;
                $window.localStorage.setItem('activecountry', false);
                var stateToGo = $rootScope.questiontest ? 'newsTravellerRa.ra_questions' : (!$rootScope.questiontest && $rootScope.supplierInformationtest) ? 'newsTravellerRa.addSupplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';

                $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: response.data._id }, { reload: true })

                //$state.go('newsTravellerRa.countrythreatmatrix', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $scope.news_ra_id, country_id: $scope.country_id }, { reload: true })

              }
              // $state.go('main.news_ra_second', { news_ra_id: news_ra._id });
              // $state.go('main.news_ra_second', { types_of_ra_id: $state.params.types_of_ra_id, news_ra_id: news_ra._id })
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }


    /* @function : getCategoryQuestionnaire
     *  @author  : MadhuriK 
     *  @created  : 21-Apr-17
     *  @modified :
     *  @purpose  : To get questionnaire of category.
     */
    $scope.getCategoryQuestionnaire = function () {
      var category_id = $state.params.category_id;
      NewsRa.getCategoryQuestionnaire(category_id, function (response) {
        if (response.code == 200) {
          $scope.questionnaire = response.data;
          $scope.category = response.category;
        } else {
          $scope.questionnaire = [];
        }
      })
    }

    $scope.redirect = function (category_id) {
      var news_ra_id = $state.params.news_ra_id;
      $state.go('main.list_category_questionnaire', { news_ra_id: news_ra_id, category_id: category_id });
    }



    /* @function : addQuestionnaireRa
     *  @author  : MadhuriK 
     *  @created  : 26-Apr-17
     *  @modified :
     *  @purpose  : To add specific mitigation by traveller at questionnaire of a particular category.
     */
    $scope.addQuestionnaireRa = function (questionnaire) {
      questionnaire[0].news_ra_id = $state.params.news_ra_id;
      questionnaire[0].category_id = $state.params.category_id;
      if (questionnaire.length > 0) {
        NewsRa.addQuestionnaireRa(questionnaire, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);

            $timeout(function () {
              history.back();
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }


    /* @function : getNewsRa
     *  @author  : MadhuriK 
     *  @created  : 26-Apr-17
     *  @modified :
     *  @purpose  : To get news ra details .
     */
    $scope.getNewsRa = function () {
      var news_ra_id = $state.params.news_ra_id;
      var category_id = $state.params.category_id;
      NewsRa.getNewsRa(news_ra_id, category_id, function (response) {
        if (response.code == 200) {
          if (response.data.length > 0 && response.data[0].category_id == $state.params.category_id) {
            $scope.questionnaire = response.data;
          } else {
            $scope.getCategoryQuestionnaire();
          }
        } else {

          $scope.questionnaire = [];
        }
      })
    }

    $scope.dataURItoBlob = function (dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
      else
        byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: mimeString });
    }


    /* @function : submitRAToManager
     *  @author  : MadhuriK 
     *  @created  : 27-Apr-17
     *  @modified :
     *  @purpose  : To submit news Ra to approving manager.
     */
    $scope.news_ra_id = $state.params.newsRa_id;
    $scope.types_of_ra_id = $state.params.types_of_ra_id;
    $scope.submitRAToManager = function () {

      // var dataURL = canvas.toDataURL('image/jpeg', 0.5);
      $scope.country_ids =[];
      var countryIdsString = $window.localStorage.country_id;
      if ( countryIdsString ) {
        var countryIds = countryIdsString.split(",");
        countryIds.forEach(function(value,key){
          var canvas = document.getElementById('bar-'+key);
          if ( typeof canvas != 'undefined' && canvas != null) {
            var dataURL = canvas.toDataURL('image/png', 0.5);
            $scope.country_ids.push(dataURL);
            
          }
         
        })
      }
      
      // var canvas = document.getElementById('bar');


      // var dataURL = canvas.toDataURL('image/png', 0.5);



      var st_date=document.getElementById('StartDate').value;
      var ed_date=document.getElementById('enddate').value;



      swal({
        title: "Submit?",
        text: "You want to submit selected RA to approving manager?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00acd6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true
      },
        function () {
          var radetails = {}

          radetails.news_ra_id = $state.params.newsRa_id;
          radetails.types_of_ra_id = $state.params.types_of_ra_id;
          $scope.showLoader = true;
          radetails.country_des = $window.localStorage.countryDescriptiondetail;
          radetails.security = $window.localStorage.countrySecuritydetail;
          radetails.graph = $scope.country_ids;
          radetails.st_date= st_date;
          radetails.ed_date= ed_date;

          NewsRa.submitRAToManager(radetails, function (response) {

            if (response.code == 200) {
              delete $window.localStorage.country_id;
              delete $window.localStorage.countryname;
              delete $window.localStorage.communicationRequired;
              delete $window.localStorage.contingenciesRequired;
              delete $window.localStorage.supplierRequired;
              delete $window.localStorage.questionRequired;
              delete $window.localStorage.countryDescriptiondetail;
              delete $window.localStorage.countrySecuritydetail;
              $scope.showLoader = false;
              $scope.newsRaStatus = response.data.is_submitted;
              toaster.pop('success', "", response.message);
              $scope.getNewsRaStatus();
              $timeout(function () {
                $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
              }, 500);
            } else {

              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        });

    }


    /* @function : getNewsRaStatus
     *  @author  : MadhuriK 
     *  @created  : 04-May-17
     *  @modified :
     *  @purpose  : To check news ra submit status.
     */
    $scope.getNewsRaStatus = function () {
      var news_ra_id = $state.params.news_ra_id;
      NewsRa.getNewsRaStatus($state.params.news_ra_id, function (response) {
        if (response.code == 200) {
          $scope.is_submitted = response.data.is_submitted == true ? true : false;
          $scope.is_more_info = response.data.is_more_info == true ? true : false;
        }
      })
    }


    /* @function : deleteNewsRa
     *  @author  : MadhuriK 
     *  @created  : 15-May-17
     *  @modified :
     *  @purpose  : To delete news ra.
     */
    $scope.deleteNewsRa = function (news_ra_id) {
      if (news_ra_id) {
        swal({
          title: "Are you sure?",
          text: "You want to delete selected news ra?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00acd6",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: true
        },
          function () {
            NewsRa.deleteNewsRa(news_ra_id, function (response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllNewsRa();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }

    /* @function : addDepartment
     *  @author  : MadhuriK 
     *  @created  : 07-Apr-17
     *  @modified :
     *  @purpose  : To add department.
     */
    $scope.departmentArr = [{ department: "" }];
    $scope.addDepartment = function () {
      var department = { department: "" }
      $scope.departmentArr.push(department);
    }



    /* @function : removeDepartment
     *  @author  : MadhuriK 
     *  @created  : 07-Apr-17
     *  @modified :
     *  @purpose  : To remove department.
     */
    $scope.removeDepartment = function () {
      var lastItem = $scope.departmentArr.length - 1;
      $scope.departmentArr.splice(lastItem);
    }


    /* @function : copyNewsRa
     *  @author  : MadhuriK 
     *  @created  : 21-Apr-17
     *  @modified :
     *  @purpose  : To copy news ra.
     */
    $scope.copyNewsRa = function (news_ra) {
      console.log("news_ra", news_ra)
      var departmentArr = [];
      var countryArray = [];
      news_ra.country =   $scope.moreCountryField;
      news_ra.country.forEach(function (countries) {
        countryArray.push(JSON.parse(countries.country)._id);
      })
      news_ra.department.forEach(function (depart) {
        departmentArr.push(depart);
      })
      if (news_ra.approvingManager.length == 0) {
        toaster.pop('error', "", 'Please select approving manager');
      } else if (news_ra.country.length == 0) {
        toaster.pop('error', "", 'Please select country of operation');
      } else if($scope.checkDuplicateCountry(countryArray)) {
        toaster.pop('error', "", 'Please select different country of operation');
      }else {
        news_ra.department = [];
        news_ra.department = departmentArr;
        news_ra.itinearyArr = [];
        news_ra.itinearyArr = $scope.scheduleArr;
        news_ra.country_name = news_ra.country_name;
        NewsRa.copyNewsRa(news_ra, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $window.history.back();
              //$state.go('main.news_ra_list');
              // $state.go('main.news_ra_list',{types_of_ra_id: $state.params.newsRa_id });
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }


    /* @function : addDetailsOfTeam
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
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
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To remove multiple record.
     */
    $scope.removeDetailsOfTeam = function () {
      var lastItem = $scope.details_of_team.length - 1;
      $scope.details_of_team.splice(lastItem);
    }


    /* @function : addEmergencyContact
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
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
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To remove multiple emergency contact.
     */
    $scope.removeEmergencyContact = function () {
      var lastItem = $scope.emergency_contact.length - 1;
      $scope.emergency_contact.splice(lastItem);
    }



    /* @function : addCallInSchedule
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To add multiple call in schedule.
     */
    $scope.call_in_schedule = [{ number_of_checkin: "", one_check_in_time: "", two_check_in_time: "", point_of_contact: "", number: "", email: "" }];
    $scope.addCallInSchedule = function (number) {
      var callInScheduleArr = { number_of_checkin: "", one_check_in_time: "", two_check_in_time: "", point_of_contact: "", number: "", email: "" }
      $scope.call_in_schedule.push(callInScheduleArr);
    }
    // $scope.call_in_schedule = [{ number_of_checkin: "", one_check_in_time: "", two_check_in_time: "", point_of_contact: "", number: "", email: "" }];
    // $scope.addCallInSchedule = function(number) {
    //   var callInScheduleArr = { number_of_checkin: "", one_check_in_time: "", two_check_in_time: "", point_of_contact: "", number: "", email: "" }
    //   if (number) {
    //     for (var i = 0; i < number; i++) {
    //       $scope.call_in_schedule.push(callInScheduleArr);
    //     }
    //   } else if(number){
    //     var lastItem = $scope.call_in_schedule.length - 3;
    //     $scope.call_in_schedule.splice(lastItem);
    //   }
    // }


    /* @function : removeCallInSchedule
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To remove multiple call in schedule.
     */
    $scope.removeCallInSchedule = function () {
      var lastItem = $scope.call_in_schedule.length - 1;
      $scope.call_in_schedule.splice(lastItem);
    }


    /* @function : redirectTo
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To redirect specific location with news ra id.
     */
    $scope.redirectTo = function (redirectPath) {
      var news_ra_id = $state.params.news_ra_id;
      $state.go(redirectPath, { news_ra_id: news_ra_id });
    }


    /* @function : addNewsRaCommunication
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To add news ra communication form.
     */

    $scope.addNewsRaCommunication = function (communicationData, Racommunications, option) {
      console.log($scope.communication._id)
      if ($scope.communication._id) {
        $scope.showLoader = true;
        communicationData.news_ra_id = $state.params.newsRa_id;
        communicationData.call_intime = $scope.call_intime;
        communicationData.emergency_contact = $scope.emergency_contact;
        communicationData.details_of_team = $scope.details_of_team;
        communicationData.types_of_ra_id = $state.params.types_of_ra_id;
        NewsRa.updateNewsRaCommunication(communicationData, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if (option == 'next') {
                var stateToGo = $rootScope.contingenciestest ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo'
                $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id });
              } else {
                $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
              }
            }, 500);
          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })
      } else {
        var data = [];
        if (communicationData != undefined) {
          communicationData.news_ra_id = $state.params.newsRa_id;
          communicationData.call_intime = $scope.call_intime;
          communicationData.emergency_contact = $scope.emergency_contact;
          communicationData.details_of_team = $scope.details_of_team;
          communicationData.types_of_ra_id = $state.params.types_of_ra_id;
          //communicationData.types_of_ra_id = $state.params.types_of_ra_id;
          console.log("communnicationds datafdfd")
          console.log(communicationData);
          data.push(communicationData);
        }
        // if (Racommunications != undefined) {
        //   Racommunications.news_ra_id = $state.params.newsRa_id;
        //   Racommunications.call_in_schedule = $scope.call_in_schedule;
        //   Racommunications.emergency_contact = $scope.emergency_contact;
        //   Racommunications.details_of_team = $scope.details_of_team;
        //   Racommunications.types_of_ra_id = $state.params.types_of_ra_id;
        //   console.log("communnicationds datafdfd")
        //   console.log(Racommunications);
        //   //Racontingencies.types_of_ra_id = $state.params.types_of_ra_id;
        //   data.push(Racommunications);
        // }
        //$state.go('main.addContingenciesKit', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id });
        $scope.showLoader = true;
        // communicationData.news_ra_id = $state.params.newsRa_id;
        // communicationData.call_in_schedule = $scope.call_in_schedule;
        // communicationData.emergency_contact = $scope.emergency_contact;
        // communicationData.details_of_team = $scope.details_of_team;
        // communicationData.types_of_ra_id = $state.params.types_of_ra_id;
        NewsRa.addNewsRaCommunication(data, function (response) {

          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if (option == 'next') {
                var stateToGo = $rootScope.contingenciestest ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo'
                $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id });
              } else {
                $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
              }
            }, 500);
          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })
      }
    }

    /* @function : getCommunicationData
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To get news ra communication data.
     */
    $scope.getCommunicationData = function () {
      var newsRa_id = $state.params.newsRa_id;
      var types_of_ra_id = $state.params.types_of_ra_id;
      if (types_of_ra_id && newsRa_id) {
        NewsRa.getCommunicationData(newsRa_id, types_of_ra_id, function (response) {
          if (response.code == 200 && response.data) {
            $scope.call_intime = response.data ? response.data.call_intime : $scope.call_intime;
            $scope.emergency_contact = response.data ? response.data.emergency_contact : $scope.emergency_contact;
            $scope.details_of_team = response.data ? response.data.details_of_team : $scope.details_of_team;
            $scope.communication = response.data;
            // $scope.flag = $scope.communication !== null ? true : false;
          } else {
            // toaster.pop('error', "", response.message);
            $scope.communication = {};
          }
        })
      }
    }

    $scope.getRaCommunicationData = function () {
      var types_of_ra_id = $state.params.types_of_ra_id;
      NewsRa.getRaCommunicationData({ types_of_ra_id }, function ( response) {
        console.log(response)
        if (response.code == 200) {
          $scope.Racall_in_schedule = response.data ? response.data.call_in_schedule : $scope.call_in_schedule;
          $scope.Raemergency_contact = response.data ? response.data.emergency_contact : $scope.emergency_contact;
          $scope.Radetails_of_team = response.data ? response.data.details_of_team : $scope.details_of_team;
          $scope.Racommunications = response.data;
        } else {
          toaster.pop('error', "", response.message);
        }

      })
    }

    $scope.getRaContingencyData = function () {
      console.log("fdf");
      var types_of_ra_id = $state.params.types_of_ra_id;
      NewsRa.getRaContingencyData({ types_of_ra_id }, function (response) {
        if (response.code == 200) {
          $scope.Racontingencies = response.data;
        } else {
          toaster.pop('error', "", response.message);
        }

      })
    }



    /* @function : addNewsRaContingencies
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To add news ra contingencies data.
     */
    $scope.addNewsRaContingencies = function (contingenciesData, Racontingencies, option) {
      if ($scope.contingencies._id) {
        $scope.showLoader = true;
        contingenciesData.news_ra_id = $state.params.newsRa_id;
        //contingenciesData.types_of_ra_id = $state.params.types_of_ra_id;
        NewsRa.updateNewsRaContingencies(contingenciesData, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if (option == "next") {
                $state.go('newsTravellerRa.addAnyOtherInfo', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id });
              } else {
                $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
              }
            }, 500);
          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })
      } else {
        var data = [];
        if (contingenciesData != undefined) {
          contingenciesData.news_ra_id = $state.params.newsRa_id;
          //contingenciesData.types_of_ra_id = $state.params.types_of_ra_id;
          data.push(contingenciesData);
        }
        if (Racontingencies != undefined) {
          Racontingencies.news_ra_id = $state.params.newsRa_id;
          //Racontingencies.types_of_ra_id = $state.params.types_of_ra_id;
          data.push(Racontingencies);
        }
        $scope.showLoader = true;
        // contingenciesData.news_ra_id = $state.params.newsRa_id;
        // contingenciesData.types_of_ra_id = $state.params.types_of_ra_id;
        NewsRa.addNewsRaContingencies(data, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if (option == "next") {
                $state.go('newsTravellerRa.addAnyOtherInfo', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id });
              } else {
                $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
              }
            }, 500);
          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })
      }
    }


    /* @function : getContingencyData
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To get news ra Contingency data.
     */
    $scope.getContingencyData = function () {
      var newsRa_id = $state.params.newsRa_id;
      var types_of_ra_id = $state.params.types_of_ra_id;
      if (types_of_ra_id && newsRa_id) {
        NewsRa.getContingencyData(newsRa_id, types_of_ra_id, function (response) {
          if (response.code == 200 && response.data) {
            $scope.contingencies = response.data;

          } else {
            // toaster.pop('error', "", response.message);
            $scope.contingencies = {};
          }
        })
      }
    }


    // /* @function : addAnyOtherInfo
    // *  @author  : MadhuriK 
    // *  @created  : 07-Jun-17
    // *  @modified :
    // *  @purpose  : To save news ra any other relevant info.
    // */
    // $scope.addAnyOtherInfo = function (relevant_info) {
    //     var other_info = {
    //         news_ra_id: $state.params.news_ra_id,
    //         relevant_info: relevant_info
    //     }
    //     if (other_info) {
    //         NewsRa.addAnyOtherInfo(other_info, function (response) {
    //             if (response.code == 200) {
    //                 toaster.pop('success', "", response.message);
    //                 $timeout(function () {
    //                     $state.go('main.news_ra_second', { news_ra_id: $state.params.news_ra_id });
    //                 }, 500);
    //                 // $scope.getCommunicationData();
    //             } else {
    //                 toaster.pop('error', "", response.message);
    //             }
    //         })
    //     }
    // }


    /* @function : getOtherInfo
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To get news ra any other relevant info.
     */
    $scope.getOtherInfo = function () {
      var newsRa_id = $state.params.newsRa_id;
      $scope.supporting_docs = [];
      NewsRa.getNewsRaDetails(newsRa_id, function (response) {
        if (response.code == 200) {
          console.log(response.data)
          $scope.relevant_info = response.data.relevant_info;
          $scope.risk_detailed = response.data.risk_detailed;
          if (response.data.supporting_docs != null) {
            $scope.otherinfo = response.data;
          }
        } else {
          $scope.relevant_info = "";
        }
      })
    }

    /* @function : attachment
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To upload supplier attachment.
     */
    $scope.attachment = function (file) {
      file.upload = Upload.upload({
        url: '/traveller/uploadAttachment',
        data: { file: file }
      }).then(function (resp) {
        $scope.supplier.attachment = resp.data.data;
        //    delete $scope.supplier.attachment;
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    }


    /* @function : addNewsRaSupplier
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To add supplier for news ra.
     */
    $scope.addNewsRaSupplierOrg = function (LocalContact, supplierraData, option) {
      console.log(LocalContact)
      if ($scope.LocalContact._id) {
        $scope.showLoader = true;
        supplier.news_ra_id = $state.params.newsRa_id;
        supplier.types_of_ra_id = $state.params.types_of_ra_id;
        supplier.local_contect = $scope.LocalContact_list;
        supplier.local_driver = $scope.LocalDriver_list;
        supplier.accomodation = $scope.Accomodation_list;
        supplier.contact = $scope.contact_list;
        NewsRa.updateNewsRaSupplier(supplier, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if (option == 'next') {
                var stateToGo = $rootScope.communicationstest ? 'newsTravellerRa.addCommunication' : ($rootScope.contingenciestest && !$rootScope.communicationstest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';
                $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id });
              } else {
                $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
              }
            }, 500);
          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })
      } else {
        var data = [];
        if (supplier != undefined) {
          supplier.news_ra_id = $state.params.newsRa_id;
          supplier.contact = $scope.contact_list;
          supplier.local_contect = $scope.LocalContact_list;
          supplier.local_driver = $scope.LocalDriver_list;
          supplier.accomodation = $scope.Accomodation_list;
          data.push(supplier);
        }
        if (supplierraData != undefined) {
          supplier.contact = $scope.contact_list;
          supplierraData.news_ra_id = $state.params.newsRa_id;
          supplierraData.local_contect = $scope.LocalContact_list;
          supplierraData.local_driver = $scope.LocalDriver_list;
          supplierraData.accomodation = $scope.Accomodation_list;
          data.push(supplierraData);
        }
        $scope.showLoader = true;
        // supplier.news_ra_id = $state.params.newsRa_id;
        // supplier.types_of_ra_id = $state.params.types_of_ra_id;
        // NewsRa.addNewsRaSupplier(data, function(response) {
        //   if (response.code == 200) {
        //     $scope.showLoader = false;
        //     toaster.pop('success', "", response.message);
        //     $timeout(function() {
        //       if (option == 'next') {
        //         var stateToGo = $rootScope.communicationValue ? 'newsTravellerRa.addCommunication' : ($rootScope.contingenciesValue && !$rootScope.communicationValue) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';
        //         $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id });
        //       } else {
        //         $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
        //       }
        //     }, 500);
        //   } else {
        //     $scope.showLoader = false;
        //     toaster.pop('error', "", response.message);
        //   }
        // })
      }
    }

    /* @function : addNewsRaSupplier
   *  @author  : MadhuriK 
   *  @created  : 07-Jun-17
   *  @modified :
   *  @purpose  : To add supplier for news ra.
   */
    $scope.addNewsRaSupplier = function (LocalContact, LocalDriver, Accomodation, suppliersList, supplierraData, option) {



      suppliersList.forEach(function (supplier) {
        if (supplier.supplier_name != "") {
          if (supplier._id) {
            $scope.showLoader = true;
            supplier.news_ra_id = $state.params.newsRa_id;
            supplier.types_of_ra_id = $state.params.types_of_ra_id;
            NewsRa.updateNewsRaSupplier(supplier, function (response) {
              if (response.code == 200) {
                $scope.showLoader = false;
                console.log("upddddddddddddddddddate")


              } else {
                $scope.showLoader = false;
                toaster.pop('error', "", response.message);
              }
            })
          } else {
            supplier.news_ra_id = $state.params.newsRa_id;
            supplier.types_of_ra_id = $state.params.types_of_ra_id;
            $scope.showLoader = true;

            NewsRa.addNewsRaSupplier(supplier, function (response) {
              if (response.code == 200) {
                $scope.showLoader = false;
                console.log("upddddddddddddddddddate")

              } else {
                $scope.showLoader = false;
                toaster.pop('error', "", response.message);
              }
            })
          }

        }
      })
      if (typeof ($scope.LocalContact) != "undefined") {

        if ($scope.LocalContact._id) {
          $scope.showLoader = true;
          LocalContact.news_ra_id = $state.params.newsRa_id;
          LocalContact.types_of_ra_id = $state.params.types_of_ra_id;
          LocalContact.service_provided = "Local Contact";
          NewsRa.updateNewsRaSupplier(LocalContact, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;

            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        } else {
          LocalContact.news_ra_id = $state.params.newsRa_id;
          LocalContact.types_of_ra_id = $state.params.types_of_ra_id;
          LocalContact.service_provided = "Local Contact";
          $scope.showLoader = true;
          NewsRa.addNewsRaSupplier(LocalContact, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;

            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        }
      }


      if (typeof ($scope.LocalDriver) != "undefined") {

        if ($scope.LocalDriver._id) {
          $scope.showLoader = true;
          LocalDriver.news_ra_id = $state.params.newsRa_id;
          LocalDriver.types_of_ra_id = $state.params.types_of_ra_id;
          LocalDriver.service_provided = "Local Driver";
          NewsRa.updateNewsRaSupplier(LocalDriver, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;

            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        } else {
          LocalDriver.news_ra_id = $state.params.newsRa_id;
          LocalDriver.types_of_ra_id = $state.params.types_of_ra_id;
          LocalDriver.service_provided = "Local Driver";
          $scope.showLoader = true;

          NewsRa.addNewsRaSupplier(LocalDriver, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;
              toaster.pop('success', "", response.message);


            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        }
      }


      if (typeof ($scope.Accomodation) != "undefined") {

        if ($scope.Accomodation._id) {
          $scope.showLoader = true;
          Accomodation.news_ra_id = $state.params.newsRa_id;
          Accomodation.types_of_ra_id = $state.params.types_of_ra_id;
          Accomodation.service_provided = "Accomodation";
          NewsRa.updateNewsRaSupplier(Accomodation, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;

            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        } else {
          Accomodation.news_ra_id = $state.params.newsRa_id;
          Accomodation.types_of_ra_id = $state.params.types_of_ra_id;
          Accomodation.service_provided = "Accomodation";
          $scope.showLoader = true;

          NewsRa.addNewsRaSupplier(Accomodation, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;

            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        }
      }


      $timeout(function () {
        if (option == 'next') {
          var stateToGo = $rootScope.communicationstest ? 'newsTravellerRa.addCommunication' : ($rootScope.contingenciestest && !$rootScope.communicationstest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';
          $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id });
        } else {
          $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
        }
      }, 500);
    }




    /* @function : getSupplierData
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To get supplier for news ra.
     */
    // $scope.getSupplierData = function () {
    //     console.log('get previus data to updfata>>>>>>>>')
    //     var news_ra_id = $state.params.news_ra_id;
    //     console.log("$state.params.news_ra_id",$state.params.news_ra_id);
    //     if (news_ra_id) {
    //         console.log('get previus data to updfata>>>>>>>>')
    //         NewsRa.getSupplierData(news_ra_id, function (response) {
    //             if (response.code == 200) {
    //                 console.log('dfdsfds',response.data)
    //                 $scope.supplier = response.data;
    //             } else {
    //                 toaster.pop('error', "", response.message);
    //             }
    //         })
    //     }
    // }


    /* @function : getAllCountries
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To get all Countries.
     */
    $scope.getAllCountries = function () {
      NewsRa.getAllCountries(function (response) {
        if (response.code == 200) {
          $scope.countryArr = response.data;
        } else {
          $scope.countryArr = {};
        }
      })
    }

    /* @function : getAllCurrencies
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To get all currencies.
     */
    $scope.getAllCurrencies = function () {
      NewsRa.getAllCurrencies(function (response) {
        if (response.code == 200) {
          $scope.currencyArr = response.data;
          console.log("$scope.currencyArr :", $scope.currencyArr);
        } else {
          $scope.currencyArr = {};
        }
      })
    }

    /* @function : redirectToAddRa
     *  @author  : MadhuriK 
     *  @created  : 09-Jun-17
     *  @modified :
     *  @purpose  : To redirect to add ra form.
     */
    $scope.redirectToAddRa = function () {
      var types_of_ra_id = $state.params.types_of_ra_id;
      $state.go('newsTravellerRa.news_ra', { types_of_ra_id: types_of_ra_id });
    }


    /* @function : redirectToAddRa
     *  @author  : MadhuriK 
     *  @created  : 09-Jun-17
     *  @modified :
     *  @purpose  : To redirect to add ra form.
     */
    $scope.redirectToEditRa = function (ra_id) {
      var types_of_ra_id = $state.params.types_of_ra_id;
      $state.go('main.update_news_ra', { types_of_ra_id: types_of_ra_id, newsRa_id: ra_id });
    }


    /* @function : addItineary
     *  @author  : MadhuriK 
     *  @created  : 13-Jun-17
     *  @modified :
     *  @purpose  : To add multiple itineary.
     */
    $scope.scheduleArr = [{ itineary: "", itineary_description: "" }];
    $scope.addItineary = function () {
      var itinearyArr = { itineary: "", itineary_description: "" }
      $scope.scheduleArr.push(itinearyArr);
    }


    /* @function : removeItineary
     *  @author  : MadhuriK 
     *  @created  : 13-Jun-17
     *  @modified :
     *  @purpose  : To remove multiple itineary.
     */
    $scope.removeItineary = function () {
      var lastItem = $scope.scheduleArr.length - 1;
      $scope.scheduleArr.splice(lastItem);
    }


    /* @function : getDepartmentList
     *  @author  : MadhuriK 
     *  @created  : 06-July-17
     *  @modified :
     *  @purpose  : To get department list.
     */
    $scope.getDepartmentList = function () {
      var raId = $state.params.types_of_ra_id;
      // var client_id=$window.localStorage.logclient_id

      NewsRa.getRaDetails(raId, function (response) {
        if (response.code == 200) {
          if (response.data.is_individual) {
            $scope.showDepartment = true;
            NewsRa.getDepartmentList(function (result) {
              if (result.code == 200) {
                // var department = result.data.filter(function (departmentObj) {
                //     console.log("departmentObj._id",departmentObj)
                //     return (response.data.client_department.indexOf(departmentObj._id) > -1);
                // })
                // $scope.departmentArr = department;
                // console.log("$scope.departmentArr",$scope.departmentArr)
                $scope.departmentArr = result.data;
                $scope.finalDepartmentArray = [];
                for (var i = 0; i < response.data.client_department.length; i++) {
                  for (var j = 0; j < $scope.departmentArr.length; j++) {
                    if (response.data.client_department[i] == $scope.departmentArr[j]._id) {
                      $scope.finalDepartmentArray.push($scope.departmentArr[j])
                    }
                  }
                }
              } else {
                $scope.finalDepartmentArray = [];
              }
            })
          } else if (response.data.is_generic) {
            $scope.showDepartment = false;
          }
        } else {
          toaster.pop('error', "", response.message);
        }
      })
    }


    /* @function : onItemClick
     *  @author  : MadhuriK 
     *  @created  : 07-July-17
     *  @modified :
     *  @purpose  : To get filter approving manager's list according to depart selected by traveller.
     */
    $scope.onItemClick = function (department) {
      var dataArr = [];
      department.forEach(function (depart) {
        $scope.approvingManagerArrCopy.forEach(function (ap) {
          if ((depart.intermediate_approving_manager.indexOf(ap._id) > -1) || (depart.alternative_final_approving_manager.indexOf(ap._id) > -1) ||
            (depart.final_approving_manager.indexOf(ap._id) > -1)) {
            var result = _.findWhere(dataArr, { _id: ap._id });
            if (result == undefined) {
              dataArr.push(ap);
            }
          }
        })
      })
      $scope.approvingManagerArr = dataArr;
    }


    /* @function : addRaAndNext
     *  @author  : MadhuriK 
     *  @created  : 25-July-17
     *  @modified :
     *  @purpose  : To add ra and redirect to next page countrymatrix.
     */
    $scope.checkDuplicateCountry=function(countryArray){
      countryArray.sort();
      for (var i = 0; i < countryArray.length -1; i++)
      {
        if (countryArray[i+1] == countryArray[i])
        {
          return true;
        }
      }
      return false;
    }

    $scope.addRaAndNext = function (news_ra, nextPage = true) {
      var countryArray = [];
      news_ra.country =   $scope.moreCountryField;
      news_ra.country.forEach(function (countries) {
        countryArray.push(JSON.parse(countries.country)._id);
      })
     
    
      if (!news_ra.approvingManager) {
        toaster.pop('error', "", 'Please select approving manager');
      } 
      else if (news_ra.country.length == 0) {
        toaster.pop('error', "", 'Please select country of operation');
      }else if($scope.checkDuplicateCountry(countryArray)) {
        toaster.pop('error', "", 'Please select different country of operation');
      }
      //  else if (news_ra.department.length==0) {
      //   toaster.pop('error', "", 'Please select atleast one department');
      // } 
      else {
        $scope.CountryArr = [];
        if(news_ra.authorcheck == false){

          news_ra.primarytraveler=news_ra.primarytraveler;
        }else{
          news_ra.primarytraveler= "";

        }
        console.log('new ra', news_ra);
        try {
          var countryobj = JSON.parse(news_ra.country);
        } catch (e) {
          var countryobj = news_ra.country[0];
        }
        $scope.CountryArr.push(countryobj);
        news_ra.country = news_ra.country ? news_ra.country : null
        $scope.CountryArr.forEach(function (country) {
          $scope.country_id = country._id;
          $scope.countryname = country.name;
        })
        $window.localStorage.setItem('country_id', countryArray);
        $window.localStorage.setItem('countryname', $scope.countryname);
        
        // news_ra.itinearyArr = [];
        // news_ra.itinearyArr = $scope.scheduleArr;

        var project_code = "";
        $scope.CountryArr.forEach(function (country) {
          project_code += country.code + "_"
        })
        news_ra.project_code = project_code + Date.now();
        
        news_ra.country = countryArray;
        news_ra.country_name = $scope.countryname;
        news_ra.types_of_ra_id = $state.params.types_of_ra_id;
        news_ra.travellerTeamArr = news_ra.getDeptRelatedUsers;
        $scope.showLoader = true;
       
        NewsRa.addNewsRa(news_ra, function (response) {
          $scope.news_ra_id = response.data._id;
          if (response.code === 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if ( !nextPage ) {
                $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
              } else {
                if ($rootScope.countrythreattest) {
                  $rootScope.countrythreattest = true;
                  $window.localStorage.setItem('countryvalue', true);
                  // $state.go('add_risk_assessment.countrythreatmatrix', { ra_id: $window.localStorage.raId, country_id: country_id });
                  $state.go('newsTravellerRa.countrythreatmatrix', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: response.data._id, country_id: countryArray }, { reload: true })
  
                } else {
                  $rootScope.activecountry = false;
                  $window.localStorage.setItem('countryvalue', false);
                  var stateToGo = $rootScope.questiontest ? 'newsTravellerRa.ra_questions' : (!$rootScope.questiontest && $rootScope.supplierInformationtest) ? 'newsTravellerRa.addSupplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';
  
                  $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: response.data._id }, { reload: true })
  
                  //$state.go('newsTravellerRa.countrythreatmatrix', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $scope.news_ra_id, country_id: $scope.country_id }, { reload: true })
  
                }
              }
              
              // $state.go('main.ra_questions', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: news_ra_id })   
              // $state.go('newsTravellerRa.countrythreatmatrix', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $scope.news_ra_id, country_id: $scope.country_id }, { reload: true })

            }, 500);


          } else {
            $scope.showLoader = false;
            $scope.showError(response);
          }
        })
      }
    }
    $scope.showError = function (response) {
      let msg = '';
            
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
    /* @function : getRaQuestions
     *  @author  : MadhuriK 
     *  @created  : 25-July-17
     *  @modified :
     *  @purpose  : To get questions of selected ra.
     */
    $scope.getRaQuestions = function () {
      var ra_id = $state.params.types_of_ra_id;
      if (ra_id) {
        NewsRa.getRaQuestions(ra_id, function (response) {
          if (response.code == 200) {
            $scope.questionnaire = response.data;
          } else {
            $scope.questionnaire = {};
          }
        })
      }
    }


    /* @function : redirectToUpdateRa
     *  @author  : MadhuriK 
     *  @created  : 25-July-17
     *  @modified :
     *  @purpose  : To redirect specific location with news ra id.
     */
    $scope.redirectToUpdateRa = function (types_ra_id, redirectPath) {
      var types_of_ra_id = types_ra_id;
      var news_ra_id = redirectPath;

      $state.go('newsTravellerRa.update_ra', { types_of_ra_id: types_of_ra_id, newsRa_id: news_ra_id }, { reload: true });
      //location.reload(true);
    }


    /* @function : updateRaAndNext
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To update ra details and redirect to next page.
     */
    $scope.updateRaAndNext = function (news_ra, submitNext = true) {
      console.log('news_ra.country', $scope.moreCountryField, '---', news_ra.country);
      $scope.CountryArr = [];
      $scope.moreCountryField.forEach(item => {
        if ( typeof item.country != 'undefined' ) {
          var count = JSON.parse(item.country);
          $scope.CountryArr.push(count._id);
        } else {
          $scope.CountryArr.push(item._id);
        }
      })

      if (!news_ra.approvingManager) {
        toaster.pop('error', "", 'Please select approving manager');
      } else if (news_ra.country.length == 0 && $scope.moreCountryField.length == 0) {
        toaster.pop('error', "", 'Please select country of operation');
      } else if($scope.checkDuplicateCountry($scope.CountryArr)) {
        toaster.pop('error', "", 'Please select different country of operation');
      }
        else {
        news_ra.travellerTeamArr = [];
        // news_ra.department = [];

        var loginuserdetails=JSON.parse($window.localStorage.superAdminUserData);
       
        console.log(news_ra.author_id)

        if(news_ra.authorcheck == 1 && news_ra.author_id == loginuserdetails._id){

          news_ra.primarytraveler=news_ra.traveller_id;
          
        }else{
          news_ra.primarytraveler="";

        }

        news_ra.currentraveller=loginuserdetails._id;

        
        // news_ra.country = news_ra.country ? news_ra.country : null
        console.log("$scope.CountryArr", $scope.CountryArr)
        
        $scope.showLoader = true;

        // news_ra.itinearyArr = [];
        // news_ra.itinearyArr = $scope.scheduleArr;
        news_ra.country = $scope.CountryArr;
        news_ra.travellerTeamArr = news_ra.getDeptRelatedUsers;
        news_ra.approvingManager = news_ra.approvingManager;
        NewsRa.updateNewsRa(news_ra, function (response) {
         
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              if ( !submitNext ) {
                $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });
              } else {
                if ($rootScope.countrythreattest) {
                  $rootScope.countrythreattest = true;
                  console.log("fdfdfddfdd")
                  $window.localStorage.setItem('countryvalue', true);
                 
                    $window.localStorage.setItem('country_id', $scope.CountryArr.join(','));
                  // $state.go('add_risk_assessment.countrythreatmatrix', { ra_id: $window.localStorage.raId, country_id: country_id });
                  $state.go('newsTravellerRa.countrythreatmatrix', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: response.data._id, country_id: $scope.CountryArr.join(',') }, { reload: true })
  
                } else {
                  $rootScope.activecountry = false;
                  $window.localStorage.setItem('countryvalue', false);
                  var stateToGo = $rootScope.questiontest ? 'newsTravellerRa.ra_questions' : (!$rootScope.questiontest && $rootScope.supplierInformationtest) ? 'newsTravellerRa.addSupplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';
  
                  $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: response.data._id }, { reload: true })
    
                }
              }
              
            }, 500);
          } else {
            let msg = '';
              
              if (response.message.length > 0 ) {
                 response.message.forEach(item => {
                  msg +=  item.msg + "<br>";
                });
              
              $scope.messageError = $sce.trustAsHtml(msg);
              setTimeout(() => {
                $scope.messageError = '';
              }, 5000)
              $scope.showLoader = false;
              toaster.pop('error', "", response.err);
            } else {
              toaster.pop('error', "", response.message);
            }
          }
        })
      }
    }

    /* @function : redirectToPreviousTab
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To redirect to the previous tab ie edit ra
     */
    $scope.redirectToPreviousTab = function () {
      console.log("dff")
      var types_of_ra_id = $state.params.types_of_ra_id;
      var newsRa_id = $state.params.newsRa_id;
      if (types_of_ra_id && newsRa_id) {
        $state.go('newsTravellerRa.update_ra', { types_of_ra_id: types_of_ra_id, newsRa_id: newsRa_id });
      }
    }


    $scope.addquestionnexttab = function () {


      $timeout(function () {
        var stateToGo = $rootScope.supplierInformationtest ? 'newsTravellerRa.addSupplier' : (!$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo'
        $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
      }, 500);

    }


    /* @function : addQuestionToRa
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To add specific mitigation by traveller in question
     */
    $scope.addQuestionToRaTickbox = function (questions) {
      console.log(questions)
        questions.types_of_ra_id = $state.params.types_of_ra_id;
        questions.newsRa_id = $state.params.newsRa_id;
     if(questions.ticked == true){
       questions.ticked= false;
     }else{
      questions.ticked= true;

     }
       
        NewsRa.addQuestionToRa(questions, function (response) {
         console.log(response)
        })

     
    }

    /* @function : addQuestionToRa
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To add specific mitigation by traveller in question
     */
    $scope.addQuestionToRa = function (questions, option) {
      console.log(questions)
      $scope.showLoader = true;
      if (questions.length > 0) {
        questions[0].types_of_ra_id = $state.params.types_of_ra_id;
        questions[0].newsRa_id = $state.params.newsRa_id;
        console.log(questions);
        NewsRa.addQuestionToRaupdate(questions, function (response) {
          console.log(response)
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            if (option == 'next') {
              $timeout(function () {
                var stateToGo = $rootScope.supplierInformationtest ? 'newsTravellerRa.addSupplier' : (!$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo'
                $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
              }, 500);
            } else {

              $state.go('main.news_ra_list', { types_of_ra_id: $state.params.types_of_ra_id });

            }

          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })

      } else {
        toaster.pop('error', "", "Please fill specific mitigation for atleast one question");
      }
    }

   

    /* @function : getRaAnswers
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To get news ra answers .
     */
    $scope.getRaAnswers = function () {
      $scope.showLoader = true;
      var newsRa_id = $state.params.newsRa_id;
      var types_of_ra_id = $state.params.types_of_ra_id;
      NewsRa.getRaAnswers(newsRa_id, types_of_ra_id, function (response) {
        if (response.code == 200) {
          $scope.showLoader = false;
          if (response.data.length > 0) {
            $scope.questionnaire = response.data;
            $scope.from = true;

          } else {
            console.log("only first time")
            // $scope.showLoader = false;
            var ra_id = $state.params.types_of_ra_id;
            if (ra_id) {
              NewsRa.getRaQuestions(ra_id, function (response) {
                if (response.code == 200) {
                  $scope.questionnaire = response.data;

                  var questions=response.data;

                  questions[0].types_of_ra_id = $state.params.types_of_ra_id;
                  questions[0].newsRa_id = $state.params.newsRa_id;

                  //First time insert the all template questions to RA
                  NewsRa.insertquestiontora(questions, function(response11){
console.log(response11)

                  })

                  
                } else {
                  $scope.questionnaire = {};
                }
              })
            }
            
            $scope.from = false;

          }
        } else {
          $scope.showLoader = false;
          $scope.questionnaire = [];
        }
      })
    }


    /* @function : goBackToQuestionPage
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To go back to question section .
     */
    $scope.goBackToQuestionPage = function () {

      var stateToGo = $rootScope.questiontest ? 'add_risk_assessment.step2' : (!$rootScope.questiontest && $rootScope.activecountry) ? 'add_risk_assessment.countrythreatmatrix' : 'add_risk_assessment.step1'
      $state.go(stateToGo, { ra_id: $state.params.ra_id, country_id: $window.localStorage.country_id });

      $state.go('newsTravellerRa.ra_questions', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
    }

    /* @function : backToQuestionPage
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To go back to question section from supplier page.
     */
    //     $scope.backToStep1=function(){
    //       $scope.country_id = $window.localStorage.country_id;
    //     $state.go('newsTravellerRa.countrythreatmatrix', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id ,country_id:$scope.country_id});
    // } 
    $scope.backToQuestionPage = function () {
      $scope.country_id = $window.localStorage.country_id;
      var stateToGo = $rootScope.questiontest ? 'newsTravellerRa.ra_questions' : (!$rootScope.questiontest && $rootScope.countrythreattest) ? 'newsTravellerRa.countrythreatmatrix' : 'newsTravellerRa.update_ra';
      $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id, country_id: $scope.country_id })
    }

    $scope.addnewquestion = function () {
      $state.go('newsTravellerRa.add_question', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
    }

    /* @function : addQuestionByClient
    *  @author  : MadhuriK 
    *  @created  : 17-July-17
    *  @modified :
    *  @purpose  : To add question for second step for individual ra.
    */
    $scope.addQuestionByClient = function (questionnaire) {

      console.log(questionnaire)
      if (!questionnaire.best_practice_advice || !questionnaire.question) {
        toaster.pop('error', "", "Please fill all required fields");
      } else {
        questionnaire.category_id = $state.params.risk_label_id;
        questionnaire.question = questionnaire.question;
        questionnaire.best_practice_advice = questionnaire.best_practice_advice;
        RiskAssessment.addQuestionByClient(questionnaire, function (response) {
          if (response.code === 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('newsTravellerRa.get_risk_que', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id, risk_label_id: $state.params.risk_label_id });
            }, 500);
          } else {
            toaster.pop('error', "", response.err);
          }
        })
      }
    }


    /* @function : getSupplierDetailsOfRa
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To get SupplierDetailsOfRa .
     */
    $scope.getSupplierDetailsOfRaLocalContact = function () {
      var types_of_ra_id = $state.params.types_of_ra_id;
      var newsRa_id = $state.params.newsRa_id;

      if (types_of_ra_id && newsRa_id) {
        NewsRa.getSupplierDetailsOfRaLocalContact(newsRa_id, types_of_ra_id, function (response) {
          console.log("yesresponse")
          console.log(response.data)
          if (response.code == 200 && response.data) {

            $scope.LocalContact = response.data;

          } else {
            $scope.LocalContact = {};
          }
        })
      }

    }

    /* @function : getSupplierDetailsOfRa
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To get SupplierDetailsOfRa .
     */
    $scope.getSupplierDetailsOfRaLocalDriver = function () {
      var types_of_ra_id = $state.params.types_of_ra_id;
      var newsRa_id = $state.params.newsRa_id;
      if (types_of_ra_id && newsRa_id) {
        NewsRa.getSupplierDetailsOfRaLocalDriver(newsRa_id, types_of_ra_id, function (response) {
          console.log("yesresponse")
          console.log(response.data)
          if (response.code == 200 && response.data) {

            $scope.LocalDriver = response.data;

          } else {
            $scope.LocalDriver = {};
          }
        })
      }

    }

    /* @function : getSupplierDetailsOfRa
    *  @author  : MadhuriK 
    *  @created  : 26-July-17
    *  @modified :
    *  @purpose  : To get SupplierDetailsOfRa .
    */
    $scope.getSupplierDetailsOfRaAccomadation = function () {
      console.log("fd");

      var types_of_ra_id = $state.params.types_of_ra_id;
      var newsRa_id = $state.params.newsRa_id;
      if (types_of_ra_id && newsRa_id) {
        NewsRa.getSupplierDetailsOfRaAccomadation(newsRa_id, types_of_ra_id, function (response) {

          if (response.code == 200 && response.data) {

            $scope.Accomodation = response.data;



          } else {

            $scope.Accomodation = {};
          }
        })
      }

    }

    /* @function : getSupplierDetailsOfRa
     *  @author  : MadhuriK 
     *  @created  : 26-July-17
     *  @modified :
     *  @purpose  : To get SupplierDetailsOfRa .
     */
    $scope.getSupplierDetailsOfRaOther = function () {
      var types_of_ra_id = $state.params.types_of_ra_id;
      var newsRa_id = $state.params.newsRa_id;
      if (types_of_ra_id && newsRa_id) {
        NewsRa.getSupplierDetailsOfRaOther(newsRa_id, types_of_ra_id, function (response) {

          if (response.code == 200 && response.data) {

            if (response.data.length != 0) {

              $scope.addnewsupplier = true;
              $scope.morebutton = true;

              $scope.suppliersList = response.data;

            } else if (response.data.length == 0) {
              console.log("comingyes")
              $scope.supp_hide = true;


            }

          } else {
            $scope.suppliersList = {};
          }
        })
      }

    }

    /* @function : getSupplierRaData
     *  @author  : Shubham 
     *  @created  : 30-Aug-17
     *  @modified :
     *  @purpose  : To get suuplier Ra data .
     */
    $scope.getSupplierRaData = function () {

      var ra_id = $state.params.types_of_ra_id;
      NewsRa.getSupplierRaData({ ra_id }, function (response) {
        if (response.code == 200) {
          $scope.countryName = localStorage.getItem("countryname");
          $scope.supplierraData = response.data;

        } else {
          $scope.supplierraData = {};
        }
        console.log(response)
      })

    }




    /* @function : goBackToSupplierPage
     *  @author  : MadhuriK 
     *  @created  : 27-July-17
     *  @modified :
     *  @purpose  : To go back to supplier page .
     */
    $scope.goBackToSupplierPage = function () {
      $state.go('newsTravellerRa.addSupplier', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
    }

    /* @function : backToSupplierPage
     *  @author  : MadhuriK 
     *  @created  : 27-July-17
     *  @modified :
     *  @purpose  : To go back to supplier page from communication page .
     */

    $scope.backToSupplierPage = function () {
      $scope.country_id = $window.localStorage.country_id;
      var stateToGo = $rootScope.supplierInformationtest ? 'newsTravellerRa.addSupplier' : (!$rootScope.supplierInformationtest && $rootScope.questiontest) ? 'newsTravellerRa.ra_questions' : (!$rootScope.supplierInformationtest && !rootScope.questiontest && !rootScope.countrythreattest) ? 'newsTravellerRa.countrythreatmatrix' : 'newsTravellerRa.update_ra';
      $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id, country_id: $scope.country_id })
    }


    /* @function : goBackToCommuniucationPage
     *  @author  : MadhuriK 
     *  @created  : 27-July-17
     *  @modified :
     *  @purpose  : To go back to communication page .
     */
    $scope.goBackToCommunicationPage = function () {
      $state.go('newsTravellerRa.addCommunication', {
        types_of_ra_id: $state.params.types_of_ra_id,
        newsRa_id: $state.params.newsRa_id
      })
    }

    /* @function : backToCommuniucationPage
     *  @author  : MadhuriK 
     *  @created  : 27-July-17
     *  @modified :
     *  @purpose  : To go back to communication page from ContingencyPage .
     */
    $scope.backToCommunicationPage = function () {
      $scope.country_id = $window.localStorage.country_id;
      var stateToGo = $rootScope.communicationstest ? 'newsTravellerRa.addCommunication' : (!$rootScope.communicationstest && $rootScope.supplierInformationtest) ? 'newsTravellerRa.addSupplier' : (!$rootScope.communicationstest && !$rootScope.supplierInformationtest && $rootScope.questiontest) ? 'newsTravellerRa.ra_questions' : (!$rootScope.communicationstest && !$rootScope.supplierInformationtest && !$rootScope.questiontest && $rootScope.countrythreattest) ? 'newsTravellerRa.countrythreatmatrix' : 'newsTravellerRa.update_ra';
      $state.go(stateToGo, {
        types_of_ra_id: $state.params.types_of_ra_id,
        newsRa_id: $state.params.newsRa_id,
        country_id: $scope.country_id
      })
    }

    /* @function : goBackToContingencyPage
     *  @author  : MadhuriK 
     *  @created  : 27-July-17
     *  @modified :
     *  @purpose  : To go back to contingency page .
     */
    $scope.goBackToContingencyPage = function () {
      $state.go('newsTravellerRa.addContingenciesKit', {
        types_of_ra_id: $state.params.types_of_ra_id,
        newsRa_id: $state.params.newsRa_id
      })
    }
    /* @function : backToContingencyPage
     *  @author  : MadhuriK 
     *  @created  : 27-July-17
     *  @modified :
     *  @purpose  : To go back to contingency page from otherinformation page.
     */
    $scope.backToContingencyPage = function () {
      $scope.country_id = $window.localStorage.country_id;
      var stateToGo = $rootScope.contingenciestest ? 'newsTravellerRa.addContingenciesKit' : (!$rootScope.contingenciestest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.contingenciestest && !$rootScope.communicationstest && $rootScope.supplierInformationtest) ? 'newsTravellerRa.addSupplier' : ($rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && !$rootScope.contingenciestest) ? 'newsTravellerRa.ra_questions' : ($rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && !$rootScope.contingenciestest && $rootScope.countrythreattest) ? 'newsTravellerRa.countrythreatmatrix' : 'newsTravellerRa.update_ra';
      $state.go(stateToGo, {
        types_of_ra_id: $state.params.types_of_ra_id,
        newsRa_id: $state.params.newsRa_id,
        country_id: $scope.country_id
      })
    }
    /* @function : addAnyOtherInfo
     *  @author  : hemant 
     *  @created  : 13-sep-17
     *  @modified :
     *  @purpose  : To go addAnyOtherInfo page .
     */
    $scope.goToAddAnyOtherInfo = function () {
      $state.go('newsTravellerRa.addAnyOtherInfo', {
        types_of_ra_id: $state.params.types_of_ra_id,
        newsRa_id: $state.params.newsRa_id
      })
    }

    /* @function : goToPreviewPage
     *  @author  : hemant 
     *  @created  : 13-sep-17
     *  @modified :
     *  @purpose  : To go Preview page .
     */
    $scope.goToPreviewPage = function () {
      $state.go('newsTravellerRa.preview_ra', {
        types_of_ra_id: $state.params.types_of_ra_id,
        newsRa_id: $state.params.newsRa_id
      })
    }
    /* @function : addAnyOtherInfo
     *  @author  : MadhuriK 
     *  @created  : 27-July-17
     *  @modified :
     *  @purpose  : To save news ra any other relevant info and submit ra.
     */
    $scope.addAnyOtherInfo = function (otherinfo) {


     otherinfo.news_ra_id =  $state.params.newsRa_id;
     otherinfo.types_of_ra_id= $state.params.types_of_ra_id;
    

      
        NewsRa.addAnyOtherInfo(otherinfo, function (response) {
          if (response.code == 200) {
            $timeout(function () {
              $state.go('newsTravellerRa.preview_ra', {
                types_of_ra_id: $state.params.types_of_ra_id,
                newsRa_id: $state.params.newsRa_id
              });
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
       })

    }

    /* @function : removeDoc
     *  @author  : Hemant 
     *  @created  : 21-sep-17
     *  @modified :
     *  @purpose  : To remove doc
     */
    $scope.removeDoc = function(doc,idx) {
      // console.log("doc",doc)
      var docdata = {}
      docdata.data = doc;
      docdata.news_ra_id = $state.params.newsRa_id;
      console.log(docdata)
      NewsRa.removeDoc(docdata, function(response) {
        if (response.code == 200) {
          $scope.otherinfo.supporting_docs.splice(idx, 1);

       $timeout(function() {
             $scope.toasters.splice(toaster.id, 1);
          toaster.pop('success', "", response.message);
         },500);

         // $state.reload();
        } else {
             $scope.toasters.splice(toaster.id, 1);
         toaster.pop('error', "", response.message);
        }
      })
    }




    /* @function : getRaPreviewData
     *  @author  : hemant 
     *  @created  : 13-sep-17
     *  @modified :
     *  @purpose  : To get Ra PreviewData .
     */

    $scope.getRaPreviewData = function () {
      var newsRa_id = $state.params.newsRa_id;
      delete $window.localStorage.countryDescriptiondetail;
      delete $window.localStorage.countrySecuritydetail;
      NewsRa.getRaPreviewData(newsRa_id, function (response) {
        $scope.limit = 1;
        console.log('responsesssssssss', response)
        if (response.code === 200) {
          $rootScope.raDataClientAdmin = response.raData ? response.raData : [];
          response.raData.countryArr = [];
          response.raData.countryArrId = [];

          response.raData.country.forEach(function (country) {
            response.raData.countryArr.push(country.name);
            response.raData.countryArrId.push(country._id);

          })
         $scope.getCategoriesListpreview(response.raData.countryArrId);
          response.raData.departmentArray = [];
          response.raData.department.forEach(function (department) {
            response.raData.departmentArray.push(department.department_name)
          })
          response.raData.countrycolor = [];
          response.raData.country.forEach(function (country) {
            if (country.color) {
              response.raData.countrycolor.push(country.color.replace(/'/g, ''))
            }
          })
          var json = {
            startdate: response.raData.startdate,
            enddate: response.raData.enddate
          };
          var date1 = new Date(json.startdate);
          var date2 = new Date(json.enddate);
          $scope.startdate = $filter('date')(date1, "MMM dd, yyyy");
          $scope.enddate = $filter('date')(date2, "MMM dd, yyyy");
          $scope.appName=response.raData.approvingManager[0].firstname + " " +response.raData.approvingManager[0].lastname;
         if(response.raData.authorcheck == 1){
          $scope.authorName=response.raData.author_id.firstname + " " +response.raData.author_id.lastname;
         }
          $rootScope.questions = response.queData ? response.queData : [];
          $rootScope.supplier = response.supplierData ? response.supplierData : [];
          $rootScope.communication = response.communicationData ? response.communicationData : [];
          $rootScope.contingency = response.contingencyData ? response.contingencyData : [];
          $rootScope.raData = response.raData ? response.raData : [];
        } else {
          $rootScope.raDataClientAdmin = [];
          $rootScope.categoryData = [];
          $rootScope.questions = [];
        }

      })
    }

    $scope.removefile = function (supporting_docs) {

      $scope.supporting_docs1 = "";



    }

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
    $scope.backToPreviousTab = function () {
      $window.history.back();
    }

    $scope.redirectToRa = function () {



      $state.go('main.news_ra', {
        types_of_ra_id: $state.params.types_of_ra_id,
        newsRa_id: $state.params.newsRa_id
      })
    }
    $scope.generateCountryThreatMatrix = function(country, realTimeDataFromLiveApi = false) {
      console.log('countryyy in trheat matrix func', country);
        $scope.series = ['High', 'Medium', 'Low'];
        if (country) {
          country.realTimeDataFromLiveApi = realTimeDataFromLiveApi;
          RiskAssessment.getCountryThreatMatrix(country, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;
              if (response.countryObj instanceof Array) {
                  $scope.data = [];
                  $scope.colors = [];
                  // $scope.colors = [{fillColor: []}];
                  

                  $scope.series = [];
                  response.countryObj.map((item, countryIndex) => {
                    
                    var fillColor = {fillColor: []};
                    var data = [],
                      colors = [];
                    $scope.country = item.country_id; // get country details using populate
                    // $scope.series.push(item.country_id.name);
                    $scope.country.color = $scope.country.color ? $scope.country.color.replace(/'/g, '') : "";
                    if (item.threatMatrix.length > 0) {
                      var labelss = [];
                      item.threatMatrix.forEach(function (threatMatrix, index) {
                        console.log('threatMatrix.category_name', threatMatrix.category_name);
                        var index = $scope.labels.indexOf(threatMatrix.category_name);
                        labelss.push(threatMatrix.category_name);
                        if (threatMatrix.country_risk == 'High') {
                          data[index] = 150;
                          fillColor.fillColor[index] = '#FF0000';
                          // $scope.colors[0].fillColor[index] = '#FF0000';
                        } else if (threatMatrix.country_risk == 'Medium') {
                          data[index] = 100;
                          fillColor.fillColor[index] = '#FFC200';
                          // $scope.colors[0].fillColor[index] = '#FFC200';
                        } else if (threatMatrix.country_risk == 'Low') {
                          data[index] = 50;
                          fillColor.fillColor[index] = '#008000';
                          // $scope.colors[0].fillColor[index] = '#008000';
                          
                        }
                        
                      })

                      $scope.colors.push(fillColor);
                      $scope.data.push(data);
                     
                      item.graphData = [data];
                      item.colors = [fillColor];
                      $scope.labelss = labelss;
                    } else {
                      data.push(0, 0, 0, 0, 0, 0, 0, 0, 0)
                      $scope.data.push(data);
                    }
                  });
                  $scope.countryIds =[];
                  $scope.countryThreat =  response.countryObj;
                  $scope.countryThreat.forEach(function(countryObj){
                        $scope.countryIds.push(countryObj.country_id._id)
                  })
                  $window.localStorage.setItem('countryIds', $scope.countryIds);
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

    /* @function : getCountryThreatMatrix
     *  @author  : hemant 
     *  @created  : 13-Jun-17
     *  @modified :
     *  @purpose  : To get country threat matrix.
     */

    // $scope.series = ['High', 'Medium', 'Low'];
    $scope.getCountryThreatMatrix = function () {
      $scope.showLoader = true;
      var country_id = $state.params.country_id;
      console.log("country_id", country_id);
      var countryMatrixObj = {country: country_id.split(',')};
      var realTimeDataFromLiveApi = true;
      $scope.generateCountryThreatMatrix(countryMatrixObj, realTimeDataFromLiveApi);
  }

    /* @function : getCountryThreatMatrix in preview page 
       *  @author  : hemant 
       *  @created  : 13-Jun-17
       *  @modified :
       *  @purpose  : To get country threat matrix.
       */

    
    $scope.getCountryThreatMatrixpreview = function (countryid) {
      // $scope.showLoader = true;
      var country_id = countryid;
      delete $window.localStorage.countryDescriptiondetail;
      delete $window.localStorage.countrySecuritydetail;

      console.log("preview country threat matrix")
      console.log("country_id", country_id)
      var countryMatrixObj = {country: country_id};
      $scope.generateCountryThreatMatrix(countryMatrixObj);
    }



    /* @function : getCategoriesList
     *  @author  : hemant 
     *  @created  : 13-Jun-17
     *  @modified :
     *  @purpose  : To get category list.
     */
    $scope.getCategoriesList = function () {
      $scope.newsid = $state.params.newsRa_id;
      console.log("$state.newsid.newsid", $scope.newsid)
      NewsRa.getCategoriesList(function (response) {
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

    /* @function : getCategoriesList for preview page 
    *  @author  : hemant 
    *  @created  : 13-Jun-17
    *  @modified :
    *  @purpose  : To get category list.
    */
    $scope.getCategoriesListpreview = function (country_id) {
      $scope.newsid = $state.params.newsRa_id;
      console.log("$state.newsid.newsid", $scope.newsid)
      NewsRa.getCategoriesList(function (response) {
        if (response.code == 200) {
          var series = [];
          if (response.data.length > 0) {
            response.data.forEach(function (catObj) {
              series.push(catObj.categoryName);
            })

            $scope.labels = series;
          }

          $scope.getCountryThreatMatrixpreview(country_id);

        } else {
          $scope.labels = [];
        }
      })
    }

    /* @function : addLocalContect
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : To add LocalContect.
     */
    $scope.LocalContact_list = [{ name: "", number: "", email: "", sourcing: "", who_recommended: "", more_info: "", city: "", cost: "", currency: "" }];
    $scope.addLocalContect = function (index) {
      var name = { name: "", number: "", email: "", sourcing: "", who_recommended: "", more_info: "", city: "", cost: "", currency: "" };
      $scope.LocalContact_list.push(name);

    }
    /* @function : removeLocalContect
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : To remove LocalContect.
     */
    $scope.removeLocalContect = function () {
      var lastItem = $scope.LocalContact_list.length - 1;
      $scope.LocalContact_list.splice(lastItem);
    }
    /* @function : addLocalDriver
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : To add LocalDriver.
     */
    $scope.LocalDriver_list = [{ name: "", number: "", email: "", sourcing: "", who_recommended: "", more_info: "", city: "", cost: "", currency: "" }];
    $scope.addLocalDriver = function (index) {
      var driverlist = { name: "", number: "", email: "", sourcing: "", who_recommended: "", more_info: "", city: "", cost: "", currency: "" };
      $scope.LocalDriver_list.push(driverlist);

    }
    /* @function : removeLocalDriver
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : To remove LocalDriver.
     */
    $scope.removeLocalDriver = function () {
      var removedriver = $scope.LocalDriver_list.length - 1;
      $scope.LocalDriver_list.splice(removedriver);
    }
    /* @function : AddAccomodation
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : To Add Accomodation.
     */

    $scope.Accomodation_list = [{ name: "", number: "", email: "", sourcing: "", who_recommended: "", more_info: "", city: "", cost: "", currency: "" }];
    $scope.AddAccomodation = function (index) {
      var accomlist = { name: "", number: "", email: "", sourcing: "", who_recommended: "", more_info: "", city: "", cost: "", currency: "" };
      $scope.Accomodation_list.push(accomlist);

    }

    /* @function : remove Accomodation
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : To add remove Accomodation.
     */
    $scope.removeAccomodation = function () {
      var removelist = $scope.Accomodation_list.length - 1;
      $scope.Accomodation_list.splice(removelist);
    }

    /* @function : addPassportDetails
     *  @author  : MadhuriK 
     *  @created  : 07-Apr-17
     *  @modified :
     *  @purpose  : To add passport details.
     */
    $scope.suppliersList = [{ supplier_name: "", country: "", city: "", sourced_by: "", address: "", email: "", currency: "", cost: "", service_provided: "", description: "" }];
    $scope.addSuppliersList = function () {
      var supplierArr = { supplier_name: "", country: "", city: "", sourced_by: "", address: "", number: "", email: "", currency: "", cost: "", service_provided: "", description: "" }
      $scope.suppliersList.push(supplierArr);
    }



    /* @function : removeSuppliersList
     *  @author  : MadhuriK 
     *  @created  : 07-Apr-17
     *  @modified :
     *  @purpose  : To remove supplier details.
     */
    $scope.removeSuppliersList = function (index) {
      var lastItem = $scope.suppliersList.length - 1;
      if (index == 0) {
        $scope.supp_hide = false;
      }
      $scope.suppliersList.splice(index);

    }

    /* @function : deleteUser
       *  @author  : Siroi 
       *  @created  : 27-Mar-18
       *  @modified :
       *  @purpose  : To delete to user.
       */
    $scope.deleteOthersuppliers = function (supplier_id) {
      if (supplier_id) {
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
            NewsRa.deleteOthersuppliers(supplier_id, function (response) {
              if (response.code === 200) {
                $scope.getSupplierDetailsOfRaOther();
              } else {
                toaster.pop('error', "", response.message);
              }

            });
          });
      }
    }

    $scope.etc_supplier = function () {

      $scope.addnewsupplier = true;
      $scope.morebutton = true;

    }

    /* @function : redirectTonextTab
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : for redirect To ra_questions tab.
     */
    $scope.redirectTonextTab = function (a, b) {
      var stateToGo = $rootScope.questiontest ? 'newsTravellerRa.ra_questions' : (!$rootScope.questiontest && $rootScope.supplierInformationtest) ? 'newsTravellerRa.addSupplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';
      $state.go(stateToGo, { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
    }
    /* @function : addrisklabel
        *  @author  : hemant 
        *  @created  : 9-oct-17
        *  @modified :
        *  @purpose  : for redirect To ra_questions tab.
        */
    $scope.addrisklabel = function () {
      console.log("fdfdf")
      // var stateToGo = $rootScope.questiontest ? 'newsTravellerRa.ra_questions' : (!$rootScope.questiontest && $rootScope.supplierInformationtest) ? 'newsTravellerRa.addSupplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';
      $state.go('newsTravellerRa.risklabel', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
    }

    /* @function : addrisklabel
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : for redirect To ra_questions tab.
     */
    $scope.gobackrisklabel = function () {
      console.log("fdfdf")
      // var stateToGo = $rootScope.questiontest ? 'newsTravellerRa.ra_questions' : (!$rootScope.questiontest && $rootScope.supplierInformationtest) ? 'newsTravellerRa.addSupplier' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && $rootScope.communicationstest) ? 'newsTravellerRa.addCommunication' : (!$rootScope.questiontest && !$rootScope.supplierInformationtest && !$rootScope.communicationstest && $rootScope.contingenciestest) ? 'newsTravellerRa.addContingenciesKit' : 'newsTravellerRa.addAnyOtherInfo';
      $state.go('newsTravellerRa.risklabel', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
    }
    /* @function : backToStep1
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : for redirect to countrythreatmatrix.
     */
    $scope.backToStep1 = function () {
      if ($rootScope.countrythreattest) {
        $scope.country_id = $window.localStorage.country_id;
        $state.go('newsTravellerRa.countrythreatmatrix', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id, country_id: $scope.country_id });
      } else {
        var types_of_ra_id = $state.params.types_of_ra_id;
        var newsRa_id = $state.params.newsRa_id;
        $state.go('newsTravellerRa.update_ra', { types_of_ra_id: types_of_ra_id, newsRa_id: newsRa_id });
      }

      $scope.country_id = $window.localStorage.country_id;
    }
    //   states on breadcrumb 
    $scope.countryid = $window.localStorage.country_id
    if ($state.current.name) {
      switch ($state.current.name) {
        case "newsTravellerRa.news_ra":
        case "newsTravellerRa.update_ra":
          $rootScope.individual_stepflag = 'individualcountry_step1';
          break;
        case "newsTravellerRa.countrythreatmatrix":
          $rootScope.individual_stepflag = 'individualcountry_step2';
          break;
        case "newsTravellerRa.ra_questions":
          $rootScope.individual_stepflag = 'individualcountry_step3';
          break;

        case "newsTravellerRa.addSupplier":
          $rootScope.individual_stepflag = 'individualcountry_step4';
          break;
        case "newsTravellerRa.addCommunication":
          $rootScope.individual_stepflag = 'individualcountry_step5';
          break;
        case "newsTravellerRa.addContingenciesKit":
          $rootScope.individual_stepflag = 'individualcountry_step6';
          break;
        case "newsTravellerRa.addAnyOtherInfo":
          $rootScope.individual_stepflag = 'individualcountry_step7';
          break;
        case "newsTravellerRa.preview_ra":
          $rootScope.individual_stepflag = 'individualcountry_step8';
          break;
      }
    }
    /* @function : sendToNewsRa
     *  @author  : hemant 
     *  @created  : 9-oct-17
     *  @modified :
     *  @purpose  : send To NewsRa state.
     */
    $scope.sendToNewsRa = function () {
      $state.go('newsTravellerRa.update_ra', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id })
    }

    // $scope.IsVisible = false;
    //   $scope.ShowPassport = function (value) {
    //       $scope.IsVisible = value == "Share";
    //   }


    /* @function : addContact
     *  @author  : MadhuriK 
     *  @created  : 02-Jun-17
     *  @modified :
     *  @purpose  : To add Contact fields (contact, email, number).
     */
    $scope.contact_list = [{ contact: "", number: "", email: "" }];
    $scope.addContact = function (index) {
      var name = { contact: "", number: "", email: "" };
      $scope.contact_list.push(name);

    }


    /* @function : removeContact
     *  @author  : MadhuriK 
     *  @created  : 02-Jun-17
     *  @modified :
     *  @purpose  : To remove Contact fields (contact, email, number).
     */
    $scope.removeContact = function () {
      var lastItem = $scope.contact_list.length - 1;
      $scope.contact_list.splice(lastItem);
    }

    var oldValue = [];
    $scope.attach_supporting_docs = function (files) {
      $scope.showLoader = true;

      console.log("files", files)

      if (files.length > 0) {
        files.upload = Upload.upload({
          url: '/traveller/attach_supporting_docs',
          data: { files: files }
        }).then(function (resp) {
          resp.data.data.forEach(function (UrlValue) {
            oldValue.push(UrlValue);
          })
          $scope.showLoader = false;
          $scope.otherinfo.supporting_docs = oldValue;
          //  $scope.sd = oldValue[0].split("/");
          // $scope.supporting_docs =  $scope.sd[2];
        }, function (resp) { }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
      }
    }


    /* @function : getAllnewsRa for Approving managers pending Risk assessment 
     *  @author  : Siroi 
     *  @created  : 02-Jun-18
     *  @modified :
     *  @purpose  : To get all news ra.
     */
    $scope.getAllpendingnewsRa = function (keyword) {
      console.log("keyword", keyword)
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
          updatedAt: 'desc' // initial sorting
        }
      }, {
          getData: function ($defer, params) {
            var page = params.page();
            var count = params.count();
            var sorting = params.sorting();
            NewsRa.getAllpendingnewsRa({ page: page, count: count, sortby: sorting, keyword: keyword }, function (response) {
              if (response.code === 200) {
                console.log(response)
                response.data.forEach(function (newsra, key) {
                  newsra.countryArr = [];
                  newsra.departmentArr = [];
                  newsra.approvingArr = [];
                  if (newsra.country.length > 0) {
                    newsra.country.forEach(function (country) {
                      newsra.countryArr.push(country.name);
                    })
                  }
                  if (newsra.department.length > 0) {
                    newsra.department.forEach(function (depart) {
                      newsra.departmentArr.push(depart.department_name);
                    })
                  }
                  if (newsra.approvingManager.length > 0) {
                    newsra.approvingManager.forEach(function (approving) {
                      var fullname = approving.firstname + ' ' + approving.lastname;
                      newsra.approvingArr.push(fullname);
                    })
                  }
                  //  var approvingmanagerid = JSON.parse(localStorage.getItem('approvingManagerData'));
                  var id = response.data[0].traveller_id._id;
                  response.data[key].userExists = _.contains(newsra.approvedBy, id) ? true : false;
                })
                params.total(response.count);
                $defer.resolve(response.data);
                $scope.newsRaData = response.data;
                var filter = { semi_approve: false, is_reject: false, is_approve: false, is_more_info: false };
                $rootScope.readCount = $filter('filter')($scope.newsRaData, filter).length;
              } else {
                toaster.pop('error', "", response.message);
              }
            });
          }
        });
    }

    /* @function : getAllnewsRa from client based 
     *  @author  : Siroi 
     *  @created  : 06-Jun-18
     *  @modified :
     *  @purpose  : To get all news ra. 
     */
    $scope.getAllclientnewsRa = function (keyword) {
      console.log("keyword", keyword)
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
            NewsRa.getAllclientnewsRa({ page: page, count: count, sortby: sorting, keyword: keyword, super_admin: super_admin, client_id: client_id }, function (response) {
              if (response.code === 200) {
                console.log(response)
                response.data.forEach(function (newsra, key) {
                  newsra.countryArr = [];
                  newsra.departmentArr = [];
                  newsra.approvingArr = [];
                  if (newsra.country.length > 0) {
                    newsra.country.forEach(function (country) {
                      newsra.countryArr.push(country.name);
                    })
                  }
                  if (newsra.department.length > 0) {
                    newsra.department.forEach(function (depart) {
                      newsra.departmentArr.push(depart.department_name);
                    })
                  }
                  if (newsra.approvingManager.length > 0) {
                    newsra.approvingManager.forEach(function (approving) {
                      var fullname = approving.firstname + ' ' + approving.lastname;
                      newsra.approvingArr.push(fullname);
                    })
                  }
                  //  var approvingmanagerid = JSON.parse(localStorage.getItem('approvingManagerData'));
                  var id = response.data[0].traveller_id._id;
                  response.data[key].userExists = _.contains(newsra.approvedBy, id) ? true : false;
                })
                params.total(response.count);
                $defer.resolve(response.data);
                $scope.newsRaData = response.data;
                var filter = { semi_approve: false, is_reject: false, is_approve: false, is_more_info: false };
                $rootScope.readCount = $filter('filter')($scope.newsRaData, filter).length;
              } else {
                toaster.pop('error', "", response.message);
              }
            });
          }
        });
    }

    /* @function : approveNewsRa
     *  @author  : MadhuriK 
     *  @created  : 08-May-17
     *  @modified :
     *  @purpose  : To approve news ra.
     */
    $scope.approveNewsRa = function (news_ra_id) {
      if ($scope.newsRaData.description_of_action == undefined) {
        toaster.pop('error', "", "Please provide your comment before approve ra");
      } else {
        if (news_ra_id) {
          swal({
            title: "Are you sure?",
            text: "You want to approve selected Ra?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
            function () {
              var newsRaData = {
                news_ra_id: news_ra_id,
                description_of_action: $scope.newsRaData.description_of_action
              }
              NewsRa.approveNewsRa(newsRaData, function (response) {
                if (response.code === 200) {
                  toaster.pop('success', "", response.message);
                  //$scope.getAllnewsRa();
                  $timeout(function () {
                    $state.go('main.list_news_ra');
                  }, 500);
                } else {
                  toaster.pop('error', "", response.message);
                }

              });
            });
        }
      }
    }


    /* @function : getNewsRadetails
     *  @author  : MadhuriK 
     *  @created  : 08-May-17
     *  @modified :
     *  @purpose  : To get news ra details.
     */
    $scope.getNewsRadetails = function () {

      delete $window.localStorage.countryDescriptiondetail;
      delete $window.localStorage.countrySecuritydetail;
      var newsRa_id = $state.params.newsRa_id;
      NewsRa.getNewsRadetails(newsRa_id, function (response) {

        console.log('innnnnnnnnnnn', response.data.types_of_ra_id._id)

        $scope.getApprovingManagersforwardRA(response.data.types_of_ra_id._id);
        $scope.getApprovingManagersshare(response.data.types_of_ra_id._id);

        

        if (response.code == 200) {
          var countryArr = [];
          response.data.countrycolor = [];
          // if (response.data.country.length > 0) {
          //   response.data.country.forEach(function (country) {
          //     response.data.countryArr.push(country.name);
          //     if (country.color) {
          //       response.data.countrycolor.push(country.color.replace(/'/g, ''))
          //     }
          //   })
          // }
          $scope.newsRaData = response.data;
          
          response.data.dept = [];
          if (response.departmentData.length > 0) {
            response.departmentData.forEach(function (department) {

              response.data.dept.push(department.department_name)
            })
          }
          $scope.departmentArray = []; // used for newsRaEdit.html
        
          response.data.department.forEach(dept => {
            $scope.departmentArray.push(dept.department_name);
          });
          var json = {
            startdate: response.data.startdate,
            enddate: response.data.enddate
          };
          var date1 = new Date(json.startdate);
          var date2 = new Date(json.enddate);
          $scope.appName=response.data.approvingManager[0].firstname + " " +response.data.approvingManager[0].lastname;
         if(response.data.authorcheck ==1){
          $scope.authorName=response.data.author_id.firstname + " " +response.data.author_id.lastname;
         }
          $scope.startdate = $filter('date')(date1, "MMM dd, yyyy");
          $scope.enddate = $filter('date')(date2, "MMM dd, yyyy");
          $scope.questionnaires = response.questionnaire ? response.questionnaire : [];
          $scope.supplierdata = response.supplierData ? response.supplierData : [];
          $scope.communicationdata = response.communicationData ? response.communicationData : [];
          $scope.contingencydata = response.contingencyData ? response.contingencyData : [];
          if ($scope.newsRaData.traveller_id) {
            $scope.getTravellers($scope.newsRaData.traveller_id._id);
          }

          response.data.country.forEach(function (country) {
            countryArr.push(country._id);

          })
         $scope.getCategoriesListpreview(countryArr);
          // $scope.getCategoriesListpreview(response.data.country)

          // // show selected Countries
          // NewsRa.getCountries(function (result) {
          //   if (response.code === 200) {
          //     $scope.countryArrnew = result.data;
          //     $scope.countryArrnew.forEach(function (country) {
          //       response.data.country.forEach(function (countryName) {
          //         if (countryName.name == country.name) {
          //           // country.ticked = true;
          //         }
          //       })
          //     })
          //   }
          // })

          Supplier.getAllCurrencies(function (response) {
            if (response.code === 200) {
              $scope.currencyArr = response.data;
              // if ($state.params.supplier_id !== undefined) {
              //     $scope.getSupplierDetails();
              // }
            } else {
              toaster.pop('error', "", response.err);
            }
          })


        } else {
          $scope.newsRaData = {};
          response.questionnaire = [];
          response.supplierData = [];
          response.communicationData = [];
          response.contingencyData = [];
        }
      })
    }

    /* @function : rejectNewsRa
     *  @author  : MadhuriK 
     *  @created  : 12-Jun-17
     *  @modified :
     *  @purpose  : To reject news ra.
     */
    $scope.rejectRa = function (news_ra_id) {
      if ($scope.newsRaData.description_of_action == undefined) {
        toaster.pop('error', "", "Please provide your comment before reject the ra");
      } else {
        if (news_ra_id) {
          swal({
            title: "Are you sure?",
            text: "You want to reject selected Ra?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
            function () {
              var newsRaData = {
                news_ra_id: news_ra_id,
                description_of_action: $scope.newsRaData.description_of_action
              }
              NewsRa.rejectRa(newsRaData, function (response) {
                if (response.code === 200) {
                  toaster.pop('success', "", response.message);
                  $timeout(function () {
                    $state.go('main.list_news_ra');
                  }, 500);
                } else {
                  toaster.pop('error', "", response.message);
                }

              });
            });
        }
      }
    }


    /* @function : wantMoreInfoRa
     *  @author  : MadhuriK 
     *  @created  : 12-Jun-17
     *  @modified :
     *  @purpose  : To want more information regarding ra.
     */
    $scope.wantMoreInfoRa = function (news_ra_id) {
      if ($scope.newsRaData.description_of_action == undefined) {
        toaster.pop('error', "", "Please provide your comment");
      } else {
        if (news_ra_id) {
          swal({
            title: "Are you sure?",
            text: "You want to put on hold selected Ra for more information?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
            function () {
              var newsRaData = {
                news_ra_id: news_ra_id,
                description_of_action: $scope.newsRaData.description_of_action
              }
              NewsRa.wantMoreInfoRa(newsRaData, function (response) {
                if (response.code === 200) {
                  toaster.pop('success', "", response.message);

                  $timeout(function () {
                    $state.go('main.list_news_ra');
                  }, 500);
                } else {
                  toaster.pop('error', "", response.message);
                }

              });
            });
        }
      }
    }




    /* @function : approveRa
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : To open popup modal
     */
    $scope.approveRa = function (newsRaData) {

      if (typeof newsRaData.description_of_action == "undefined") {
        newsRaData.description_of_action = " ";

      }
      
      $scope.country_ids =[];
      var countryIdsString = $window.localStorage.country_id;
      if ( countryIdsString ) {
        var countryIds = countryIdsString.split(",");
        countryIds.forEach(function(value,key){
          var canvas = document.getElementById('bar-'+key);
          if ( typeof canvas != 'undefined' && canvas != null) {
            var dataURL = canvas.toDataURL('image/png', 0.5);
            $scope.country_ids.push(dataURL);
            
          }
         
        })
      }
      // var canvas = document.getElementById('bar');
      // var dataURL = canvas.toDataURL('image/png', 0.5);
      var st_date=document.getElementById('StartDate').value;
      var ed_date=document.getElementById('enddate').value;

      newsRaData.country_des = $window.localStorage.countryDescriptiondetail;
      newsRaData.security = $window.localStorage.countryDescriptiondetail;
      newsRaData.graph = $scope.country_ids;
      newsRaData.st_date = st_date;
      newsRaData.ed_date = ed_date;
      

      // NewsRa.generatePDF(newsRaData, function (response) {

      //   console.log(response)


      // })
      var modalInstance = $modal.open({
        templateUrl: 'myModalContentstep1.html',
        controller: 'ModalInstanceCtrlRA',

        resolve: {
          raObj: function () {
            return newsRaData;
          },
        }
      });

      modalInstance.result.then(function (selectedItems) { }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });




    };

    /* @function : Forward the RA to ther managers 
    *  @author  : Siroi 
    *  @created  : 25-June-18
    *  @modified :
    *  @purpose  : To open popup modal for select approving managers
    */
    $scope.forwardRa = function (newsRaData) {

      // var canvas = document.getElementById('bar-1');
      // var dataURL = canvas.toDataURL('image/png', 0.5);
      var st_date=document.getElementById('StartDate').value;
      var ed_date=document.getElementById('enddate').value;

      var graphs =[];
      var countryIds = newsRaData.country;
      console.log('newsRaData in forward', newsRaData);
      if ( countryIds.length > 0 ) {
        countryIds.forEach(function(value,key){
          var canvas = document.getElementById('bar-'+key);
          if ( typeof canvas != 'undefined' && canvas != null) {
            var dataURL = canvas.toDataURL('image/png', 0.5);
            graphs.push(dataURL);
          }
        });
      }

      newsRaData.country_des = $window.localStorage.countryDescriptiondetail;
      newsRaData.security = $window.localStorage.countryDescriptiondetail;
      newsRaData.graph = graphs;
      newsRaData.st_date = st_date;
      newsRaData.ed_date =ed_date;



      var modalInstance = $modal.open({
        templateUrl: 'forwardModalContent.html',
        controller: 'ModalInstanceCtrlRA',

        resolve: {
          raObj: function () {
            return newsRaData;
          },
        }
      });

      modalInstance.result.then(function (selectedItems) { }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });




    };


    /* @function : approveRa
 *  @author  : MadhuriK 
 *  @created  : 25-Aug-17
 *  @modified :
 *  @purpose  : To open popup modal
 */
    $scope.approveRawithoutshare = function (newsRaData) {

      swal({
        title: "Are you sure?",
        text: "You want to Approve Risk Assessment?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00acd6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        showCloseButton: true,

      },
        function (isConfirm) {
          if (isConfirm) {
            $scope.showLoader = true;
            newsRaData.shared_with = [];
            newsRaData.approving_manager_ids = [];

            NewsRa.approveRaByManager(newsRaData, function (response) {
              if (response.code == 200) {
                console.log(response)
                console.log("Gotttt it.....................2222222222222")

                $scope.showLoader = false;
                toaster.pop('success', "", response.message);
                $timeout(function () {
                  $state.go('main.list_news_ra');
                }, 500);
              } else {
                console.log("Gotttt it.....................1111111111")

                $scope.showLoader = false;
                toaster.pop('error', "", response.message);
              }
            })
          }

        });



    };




    /* @function : rejectNewsRa
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : To open popup modal
     */
    $scope.rejectNewsRa = function (newsRaData) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalRejectContent.html',
        controller: 'ModalInstanceCtrlRA',

        resolve: {
          raObj: function () {
            return newsRaData;
          },
        }
      });

      modalInstance.result.then(function (selectedItems) { }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }


    /* @function : moreInfoOfRa
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : To open popup modal
     */
    $scope.moreInfoOfRa = function (newsRaData) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalMoreInfoContent.html',
        controller: 'ModalInstanceCtrlRA',

        resolve: {
          raObj: function () {
            return newsRaData;
          },
        }
      });

      modalInstance.result.then(function (selectedItems) { }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    $scope.requestMedicalInformation = function (newsRaData) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalMedicalContent.html',
        controller: 'ModalInstanceCtrlRA',

        resolve: {
          raObj: function () {
            return newsRaData;
          },
        }
      });

      modalInstance.result.then(function (selectedItems) { }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    $scope.medicalInfoModal = function (newsRaData) {
      console.log("newsRaData", newsRaData)

      swal({
        title: "This feature is under development. Please contact your system administrator for medical information requests",
        allowOutsideClick: true
      });
      // var modalInstance = $modal.open({
      //   templateUrl: 'medicalInfoModal.html',
      //   controller: 'ModalInstanceCtrlRA',

      //   resolve: {
      //     raObj: function () {
      //       return newsRaData;
      //     },
      //   }
      // });

      // modalInstance.result.then(function (selectedItems) { }, function () {
      //   console.log('Modal dismissed at: ' + new Date());
      // });
    }

    /* @function : getApprovingManagers
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : To get approving managers list
     */
    $scope.getApprovingManagers = function () {

      var types_of_ra_id= $state.params.types_of_ra_id;


      NewsRa.getDeptRelatedUsersAprovingmanger(types_of_ra_id,function (response) {
        console.log('dddddddddd', response)
        if (response.code === 200) {
          var dataArr = [];
          response.traveller.client_department.forEach(function (dept) {
            response.data.forEach(function (final_user) {

              if (final_user._id == dept.final_approving_manager || final_user._id == dept.alternative_final_approving_manager || final_user._id == dept.intermediate_approving_manager) {

                dataArr.push(final_user);
              }

            })
          })

          var result = [];
          $.each(dataArr, function (i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
          });


          $rootScope.approvingManagerArr = result;

        } else {
          $rootScope.approvingManagerArr = [];

          toaster.pop('error', "", response.message);
        }
      })

    }

     /* @function : getApprovingManagers
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : To get approving managers list
     */
    $scope.getApprovingManagersshare = function (types_of_ra_id) {



      NewsRa.getDeptRelatedUsersAprovingmanger(types_of_ra_id,function (response) {
        console.log('4342 inn', response);
        if (response.code === 200) {
          var dataArr = [];
          response.traveller.client_department.forEach(function (dept) {
            response.data.forEach(function (final_user) {

              if (final_user._id == dept.final_approving_manager || final_user._id == dept.alternative_final_approving_manager || final_user._id == dept.intermediate_approving_manager) {

                dataArr.push(final_user);
              }

            })
          })
         
          var result = [];
          $.each(dataArr, function (i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
          });


          $rootScope.approvingManagerArr = result;

        } else {
          $rootScope.approvingManagerArr = [];

          toaster.pop('error', "", response.message);
        }
      })

    }


    /* @function : getApprovingManagersforwardRA
   *  @author  : Siroi 
   *  @created  : 25-Jun-18
   *  @modified :
   *  @purpose  : To get approving managers list for RA forward
   */
    $scope.getApprovingManagersforwardRA = function (types_of_ra_id) {
      console.log("Vaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaaaaa")
      console.log(types_of_ra_id)

      NewsRa.getDeptRelatedUsersAprovingmanger(types_of_ra_id,function (response) {
        if (response.code === 200) {
          var dataArr = [];
          response.traveller.client_department.forEach(function (dept) {
            response.data.forEach(function (final_user) {
              if (final_user._id == dept.final_approving_manager || final_user._id == dept.alternative_final_approving_manager || final_user._id == dept.intermediate_approving_manager) {

                dataArr.push(final_user);
              }

            })
          })

          var result = [];
          $.each(dataArr, function (i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
          });


          $rootScope.otherapprovingManagerArr = result;

        } else {
          $rootScope.otherapprovingManagerArr = [];

          toaster.pop('error', "", response.message);
        }
      })

    }




    /* @function : getTravellers
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : To get travellers list
     */

    $scope.getTravellers = function (traveller_id) {

      NewsRa.getDeptRelatedUsers(function (response) {
        if (response.code === 200) {
          console.log("fdfd")
          console.log(response.data)

          $rootScope.travellerArr = response.data;

        } else {
          $rootScope.travellerArr = [];

          toaster.pop('error', "", response.message);
        }
      })
      // NewsRa.getTravellers(traveller_id, function(response) {
      //   if (response.code == 200) {
      //     $rootScope.travellerArr = response.data;
      //   } else {
      //     $rootScope.travellerArr = [];
      //   }
      // })
    }

    /* @function : update the RA details from Approving managers
   *  @author  : Siroi 
   *  @created  : 16-Jun-18
   *  @modified :
   *  @purpose  : To update the RA details from approving managers side 
   */



    $scope.newsRaEditupdateFromapprovingmanager = function (RaDataNew) {

      var newsRa_id = $state.params.newsRa_id;

      NewsRa.getNewsRadetails(newsRa_id, function (response) {
        if (response.code == 200) {
          response.data.countryArr = [];
          response.data.countrycolor = [];
          if (response.data.country.length > 0) {
            response.data.country.forEach(function (country) {
              response.data.countryArr.push(country.name);
              if (country.color) {
                response.data.countrycolor.push(country.color.replace(/'/g, ''))
              }
            })
          }
          $scope.newsRaData = response.data;
          response.data.dept = [];
          if (response.data.department.length > 0) {
            response.data.department.forEach(function (department) {
              response.data.dept.push(department.department_name)
            })
          }
          
          var json = {
            startdate: response.data.startdate,
            enddate: response.data.enddate
          };
          var date1 = new Date(json.startdate);
          var date2 = new Date(json.enddate);
          $scope.startdate = $filter('date')(date1, "MMM dd, yyyy");
          $scope.enddate = $filter('date')(date2, "MMM dd, yyyy");
          $scope.questionnaires = response.questionnaire ? response.questionnaire : [];
          $scope.supplierdata = response.supplierData ? response.supplierData : [];
          $scope.communicationdata = response.communicationData ? response.communicationData : [];
          $scope.contingencydata = response.contingencyData ? response.contingencyData : [];
          if ($scope.newsRaData.traveller_id) {
            $scope.getTravellers($scope.newsRaData.traveller_id._id);
          }



          NewsRa.updateEditRa(RaDataNew, function (result) {

            if (result.code == 200) {

              toaster.pop('success', "", result.message);

            } else {



              toaster.pop('error', "", result.message);
            }




          })



        }
      })




    }

    /* @function : update the RA details from Approving managers suppliers
     *  @author  : Siroi 
     *  @created  : 16-Jun-18
     *  @modified :
     *  @purpose  : To update the RA details from approving managers side 
     */

    $scope.updateNewsRaApprovingManager = function (newsRaData) {

      NewsRa.updateNewsRaApprovingManager(newsRaData, function (response) {
        if (response.code == 200) {
          toaster.pop('success', "", response.message);

        } else {
          toaster.pop('error', "", response.message);
        }
      })


    }

    /* @function : update the RA details from Approving managers suppliers
     *  @author  : Siroi 
     *  @created  : 16-Jun-18
     *  @modified :
     *  @purpose  : To update the RA details from approving managers side 
     */

    $scope.updateNewsRaSupplierApprovingManager = function (supplier) {

      NewsRa.updateNewsRaSupplierApprovingManager(supplier, function (response) {
        if (response.code == 200) {
          toaster.pop('success', "", response.message);

        } else {
          toaster.pop('error', "", response.message);
        }
      })


    }


    /* @function : update the communication details from Approving managers suppliers
     *  @author  : Siroi 
     *  @created  : 16-Jun-18
     *  @modified :
     *  @purpose  : To update the communication details from approving managers side 
     */

    $scope.updateNewsRaCommunicationApprovingManager = function (communication) {







      NewsRa.updateNewsRaCommunicationApprovingManager(communication, function (response) {
        if (response.code == 200) {
          toaster.pop('success', "", response.message);

        } else {
          toaster.pop('error', "", response.message);
        }
      })


    }

    /* @function : update the contigency details from Approving managers suppliers
    *  @author  : Siroi 
    *  @created  : 16-Jun-18
    *  @modified :
    *  @purpose  : To update the contigency details from approving managers side 
    */

    $scope.updateNewsRaContigencyApprovingManager = function (contingency) {

      NewsRa.updateNewsRaContigencyApprovingManager(contingency, function (response) {
        if (response.code == 200) {
          toaster.pop('success', "", response.message);

        } else {
          toaster.pop('error', "", response.message);
        }
      })


    }


    $scope.timebox = function (checkin) {

      $scope.call_intime = [];

      var timevalue = 24 / checkin;



      var org_time = "0000";
      var dummy_val = "0";
      for (var i = 0; i < checkin; i++) {

        var arrayvalue = { call_in_time: org_time }


        $scope.call_intime.push(arrayvalue)
        dummy_val = Math.round(dummy_val + timevalue);

        if (dummy_val == 0) {
          org_time = "0000";
        } else if (dummy_val == 1) {
          org_time = "0100";
        } else if (dummy_val == 2) {
          org_time = "0200";
        } else if (dummy_val == 3) {
          org_time = "0300";
        } else if (dummy_val == 4) {
          org_time = "0400";
        } else if (dummy_val == 5) {
          org_time = "0500";
        } else if (dummy_val == 6) {
          org_time = "0600";
        } else if (dummy_val == 7) {
          org_time = "0700";
        } else if (dummy_val == 8) {
          org_time = "0800";
        } else if (dummy_val == 9) {
          org_time = "0900";
        } else if (dummy_val == 10) {
          org_time = "1000";
        } else if (dummy_val == 11) {
          org_time = "1100";
        } else if (dummy_val == 12) {
          org_time = "1200";
        } else if (dummy_val == 13) {
          org_time = "1300";
        } else if (dummy_val == 14) {
          org_time = "1400";
        } else if (dummy_val == 15) {
          org_time = "1500";
        } else if (dummy_val == 16) {
          org_time = "1600";
        } else if (dummy_val == 17) {
          org_time = "1700";
        } else if (dummy_val == 18) {
          org_time = "1800";
        } else if (dummy_val == 19) {
          org_time = "1900";
        } else if (dummy_val == 20) {
          org_time = "2000";
        } else if (dummy_val == 21) {
          org_time = "2100";
        } else if (dummy_val == 22) {
          org_time = "2200";
        } else if (dummy_val == 23) {
          org_time = "2300";
        }


      }




    }

    $scope.timebox_edit = function (communication) {

      console.log(communication)
      $scope.call_intime = [];

      var timevalue = 24 / communication.no_of_checkin;



      var org_time = "0000";
      var dummy_val = "0";
      for (var i = 0; i < communication.no_of_checkin; i++) {

        var arrayvalue = { call_in_time: org_time }


        $scope.call_intime.push(arrayvalue)
        dummy_val = Math.round(dummy_val + timevalue);

        if (dummy_val == 0) {
          org_time = "0000";
        } else if (dummy_val == 1) {
          org_time = "0100";
        } else if (dummy_val == 2) {
          org_time = "0200";
        } else if (dummy_val == 3) {
          org_time = "0300";
        } else if (dummy_val == 4) {
          org_time = "0400";
        } else if (dummy_val == 5) {
          org_time = "0500";
        } else if (dummy_val == 6) {
          org_time = "0600";
        } else if (dummy_val == 7) {
          org_time = "0700";
        } else if (dummy_val == 8) {
          org_time = "0800";
        } else if (dummy_val == 9) {
          org_time = "0900";
        } else if (dummy_val == 10) {
          org_time = "1000";
        } else if (dummy_val == 11) {
          org_time = "1100";
        } else if (dummy_val == 12) {
          org_time = "1200";
        } else if (dummy_val == 13) {
          org_time = "1300";
        } else if (dummy_val == 14) {
          org_time = "1400";
        } else if (dummy_val == 15) {
          org_time = "1500";
        } else if (dummy_val == 16) {
          org_time = "1600";
        } else if (dummy_val == 17) {
          org_time = "1700";
        } else if (dummy_val == 18) {
          org_time = "1800";
        } else if (dummy_val == 19) {
          org_time = "1900";
        } else if (dummy_val == 20) {
          org_time = "2000";
        } else if (dummy_val == 21) {
          org_time = "2100";
        } else if (dummy_val == 22) {
          org_time = "2200";
        } else if (dummy_val == 23) {
          org_time = "2300";
        }


      }


      communication.call_intime = $scope.call_intime;

      $scope.updateNewsRaCommunicationApprovingManager = function (communication) {







        NewsRa.updateNewsRaCommunicationApprovingManager(communication, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);

            $scope.getNewsRadetails();

          } else {
            toaster.pop('error', "", response.message);
          }
        })


      }





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

            if (localStorage.super_admin == "true") {
              var super_admin = true;

              var client_id = '';
            } else {

              super_admin = false;
              client_id = $window.localStorage.logclient_id;

            }
            RiskAssessment.getAllRiskLabels({ page: page, count: count, sortby: sorting, label_name: label_name, ra_id: ra_id, super_admin: super_admin, client_id: client_id }, function (response) {
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

    //Get related risk label based on RA

    $scope.getRalabel = function () {
      var ra_id = $state.params.types_of_ra_id ? $state.params.types_of_ra_id : $window.localStorage.raId;
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
        var ra_id = $state.params.types_of_ra_id;
        console.log("RAAAAAAAAAAAAAAAAAAA")
        console.log($state.params.newsRa_id);

        $state.go('newsTravellerRa.get_risk_que', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id, risk_label_id: risk_id })
      }
    }

    /* @function : getAllRiskQuestionnaire
   *  @author  : MadhuriK 
   *  @created  : 07-Aug-17
   *  @modified :
   *  @purpose  : To get all questions of selected risk label
   */
    $scope.getAllRiskQuestionnaires = function (questionnaire_name) {

      if ($state.params.risk_label_id) {
        console.log("ullla")
        console.log($state.params.types_of_ra_id)
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

                        var raID = $state.params.types_of_ra_id ? $state.params.types_of_ra_id : $state.params.individualRa_id;
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

      /* @function : getEditorData
         *  @author  : MadhuriK 
         *  @created  : 10-May-17
         *  @modified :
         *  @purpose  : To get ckeditor data for description.
         */
        $scope.editor = null;
        $scope.getEditorData = function () {
           // add default value to _blank for hyperlink
           CKEDITOR.on('dialogDefinition', function(e) {
              if (e.data.name === 'link') {
                  var target = e.data.definition.getContents('target');
                  var options = target.get('linkTargetType').items;
                  for (var i = options.length-1; i >= 0; i--) {
                      var label = options[i][0];
                      if (!label.match(/new window/i)) {
                          options.splice(i, 1);
                      }
                  }
                  var targetField = target.get( 'linkTargetType' );
                  targetField['default'] = '_blank';
              }
          });
            $scope.editor = CKEDITOR.replace('editor1');
            if ($scope.editor) {
                $scope.editor.on('change', function (evt) {
                    $scope.questionnaire.best_practice_advice = evt.editor.getData();
                });
            }


            $scope.question = CKEDITOR.replace('question');
            if ($scope.question) {
                $scope.question.on('change', function (evt) {
                    $scope.questionnaire.question = evt.editor.getData();
                });
            }
        }

 /* @function : getCategories
         *  @author  : MadhuriK 
         *  @created  : 21-Apr-17
         *  @modified :
         *  @purpose  : To get all categories.
         */
        $scope.getCategories = function () {
          console.log("test")
          var question={};
          if(localStorage.super_admin == "true"){
              question. super_admin=true;
            
              question. client_id='';
            }else{
               
              question.super_admin=false;
              question.client_id=$window.localStorage.logclient_id;
                
            }
          Question.getCategories(question,function (response) {
              if (response.code === 200) {
                  $scope.categoryArr = response.data;
              } else {
                  $scope.categoryArr = [];
              }
          })
      }


    /* @function : assignQuesToIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To assign questions to individual ra.
     */
    $scope.assignQuesToIndividualRas = function (assignQueData, $index) {
     
      if ($state.params.types_of_ra_id) {
        assignQueData.assignRaId = $state.params.types_of_ra_id;
        // RiskAssessment.assignQuesToRa(assignQueData, function (response) {

        //   if (response.code == 200) {

        //     toaster.pop('success', "", response.message);

        //   } else {

        //     toaster.pop('error', "", response.message);

        //   }
        // })

//For check RA already  questions or not 
        var newsRa_id = $state.params.newsRa_id;
        var types_of_ra_id = $state.params.types_of_ra_id;
        NewsRa.getRaAnswers(newsRa_id, types_of_ra_id, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            if (response.data.length > 0) {
             console.log("ulla")
              var newsranswers = {};
              newsranswers.types_of_ra_id = $state.params.types_of_ra_id;
              newsranswers.news_ra_id = $state.params.newsRa_id;
              newsranswers.questionnaire_id = assignQueData._id;
              newsranswers.question = assignQueData.question;
              newsranswers.best_practice_advice = assignQueData.best_practice_advice;
      
      
              NewsRa.inserttora(newsranswers, function (response) {
      
                if (response.code == 200) {
      
                  console.log("Inserted one")
                } else {
                  console.log("Inserted two")
      
      
                }
              })
      
            } 
          } else {
            $scope.showLoader = false;
            $scope.questionnaire = [];
          }
        })


      




      } else {
        $scope.questionnaire[$index].assign = false;
        $scope.toasters.splice(toaster.id, 1);
        toaster.pop('error', "", "Please create RA before assigning question to it");
      }
    }




    /* @function : getAllQuestionnaire
        *  @author  : MadhuriK 
        *  @created  : 27-Mar-17
        *  @modified :
        *  @purpose  : To get all questionnairs of selected category.
        */
    $scope.getAllQuestionnaire = function (questionnaire_name) {
      $scope.showLoader = true;
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 5,
        sorting: {
          // createdAt: 'desc' // initial sorting
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


            Question.getAllQuestionnaire({ page: page, count: count, sortby: sorting, questionnaire_name: questionnaire_name, super_admin: super_admin, client_id: client_id }, function (response) {
              if (response.code === 200) {

                response.data.forEach(function (questionnair) {
                  questionnair.categoryArr = [];
                  questionnair.category_id.forEach(function (Category) {
                    questionnair.categoryArr.push(Category.categoryName);
                  })
                })
                console.log("ulla")
                console.log($state.params.types_of_ra_id)
                response.data.forEach(function (questionnair) {
                  if (questionnair.assigned_ra_id.length > 0) {
                    questionnair.assigned_ra_id.forEach(function (queId) {

                      var raID = $state.params.types_of_ra_id;
                      if (queId == raID) {
                        console.log(questionnair)

                        questionnair.assign = queId;
                      }
                    })
                  }


                  
                })

                params.settings().counts = [];

                if (response.count > 5) {
                  params.settings().counts.push(5);
                  params.settings().counts.push(10);
                } else if (response.count > 10) {
                  params.settings().counts.push(25);
                } else if (response.count > 25) {
                  params.settings().counts.push(100);
                }
                $timeout(function () {
                  $scope.showLoader = false;
                  params.total(response.count);
                  $defer.resolve(response.data);
                  $scope.questionnaire = response.data;
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

    /* @function : addQuestionnaire
         *  @author  : MadhuriK 
         *  @created  : 24-Mar-17
         *  @modified :
         *  @purpose  : To add the questionnaire to particular category.
         */
        $scope.addQuestionnaire = function (questionnaire) {
          if (!questionnaire.best_practice_advice || !questionnaire.question || questionnaire.category_id.length == 0) {
              toaster.pop('error', "", "Please fill all required fields");
          } else {
              Question.addQuestionnaire(questionnaire, function (response) {
                  if (response.code === 200) {
                     toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('newsTravellerRa.risklabel', { types_of_ra_id: $state.params.types_of_ra_id, newsRa_id: $state.params.newsRa_id, risk_label_id: $state.params.risk_label_id });
            }, 500);
                  } else {
                      toaster.pop('error', "", response.err);
                  }
              })
          }
      }


    /* @function : getCategories
      *  @author  : MadhuriK 
      *  @created  : 21-Apr-17
      *  @modified :
      *  @purpose  : To get all categories.
      */
    $scope.getCategories = function () {
      console.log("test")
      var question = {};
      if (localStorage.super_admin == "true") {
        question.super_admin = true;

        question.client_id = '';
      } else {

        question.super_admin = false;
        question.client_id = $window.localStorage.logclient_id;

      }
      Question.getCategories(question, function (response) {
        if (response.code === 200) {
          $scope.categoryArr = response.data;
        } else {
          $scope.categoryArr = [];
        }
      })
    }


    $scope.getQueOfSelectedRiskLabel = function (category_id) {
      if (category_id == 'all') {
        $scope.getAllQuestionnaire();
      } else if (category_id == 'Select Risk Label') {
        toaster.pop('error', "", "Please select risk label");
      } else {
        $scope.showLoader = true;
        $scope.tableParams = new ngTableParams({
          page: 1,
          count: 5,
          sorting: {
            // createdAt: 'desc' // initial sorting
          }
        }, {
            getData: function ($defer, params) {
              var page = params.page();
              var count = params.count();
              var sorting = params.sorting();
              Question.getQueOfSelectedRiskLabel({ page: page, count: count, sortby: sorting, category_id: category_id }, function (response) {
                if (response.code === 200) {

                  response.data.forEach(function (questionnair) {
                    questionnair.categoryArr = [];
                    questionnair.category_id.forEach(function (Category) {
                      questionnair.categoryArr.push(Category.categoryName);
                    })
                  })

                  response.data.forEach(function (questionnair) {
                    if (questionnair.assigned_ra_id.length > 0) {
                      questionnair.assigned_ra_id.forEach(function (queId) {
  
                        var raID = $state.params.types_of_ra_id;
                        if (queId == raID) {
                          console.log(questionnair)
  
                          questionnair.assign = queId;
                        }
                      })
                    }
  
  
                    
                  })

                  params.settings().counts = [];

                  if (response.count > 5) {
                    params.settings().counts.push(5);
                    params.settings().counts.push(10);
                  } else if (response.count > 10) {
                    params.settings().counts.push(25);
                  } else if (response.count > 25) {
                    params.settings().counts.push(100);
                  }
                  $timeout(function () {
                    $scope.showLoader = false;
                    params.total(response.count);
                    $defer.resolve(response.data);
                    $scope.questionnaire = response.data;
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
    }



  })



  .controller('ModalInstanceCtrlRA', function ($scope, $http, $modalInstance, raObj, NewsRa, toaster, $timeout, $state, $modal, $rootScope) {

    $scope.raData = raObj;
    $scope.openTermsCondition = function (travellerId, raId) {
      $scope.showLoader = true;
      console.log("openTermsCondition radata", $scope.raData)
      console.log("newsRaData", travellerId)
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        //templateUrl: '/modules/traveller/views/termsCondition.html',
        size: "md",
        controller: function ($scope, $modalInstance) {
          $scope.viewTravellerMedicalInfo = function (traveller) {
            console.log("travellerMedicalInformation1")
            if (traveller) {
              $scope.showLoader = false;
              var travellers = {}
              // traveller.id = travellerId
              travellers.travellerId = travellerId;
              travellers.raId = raId;
              NewsRa.viewTravellerMedicalInfo(travellers, function (response) {
                if (response.code == 200) {
                  toaster.pop('success', "", response.message);
                  $modalInstance.dismiss('cancel');
                  $timeout(function () {
                    $state.reload();
                    // $state.go('main.view_medical_info', { traveller_id: traveller.id });
                  }, 1000);
                } else {
                  toaster.pop('error', "", response.err);
                }
              })

            }

          }

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        }
      });
    };

    /* @function : ok
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : approve ra
     */
    $scope.ok = function (newsRaData) {
      console.log(newsRaData)

      if (newsRaData.approvingManager.length == 0) {
        toaster.pop('error', "", "Please Choose approving manager");
      } else {

        $scope.showLoader = true;
        raObj.shared_with = [];
        raObj.approving_manager_ids = [];
        raObj.adescription_of_action = newsRaData.adescription_of_action;
        raObj.description_of_action = newsRaData.description_of_action;

        raObj.approve = true;
        NewsRa.generatePDF(raObj, function (response1) {



          newsRaData.approvingManager.forEach(function (manager) {
            raObj.shared_with.push(manager.email);
            raObj.approving_manager_ids.push(manager._id);

          })


          NewsRa.approveRaByManager(raObj, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;
              toaster.pop('success', "", response.message);
              $timeout(function () {
                $modalInstance.close();
                $state.go('main.list_news_ra');
              }, 500);
            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })

        })

      }
    };


    $scope.approveshare_val = false;
    $scope.approveshare = function (newsRaData) {

      $scope.approveshare_val = true;
    }


    /* @function : ok
   *  @author  : MadhuriK 
   *  @created  : 25-Aug-17
   *  @modified :
   *  @purpose  : approve ra
   */
    $scope.Approvereturn = function (newsRaData) {
      $scope.approveshare_val = false;


      swal({
        title: "",
        text: "You want to Approve Risk Assessment?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00acd6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        showCloseButton: true,

      },
        function (isConfirm) {
          if (isConfirm) {


            $scope.showLoader = true;
            raObj.shared_with = [];
            raObj.approving_manager_ids = [];
            raObj.description_of_action = newsRaData.description_of_action;


            raObj.approve = true;
            NewsRa.generatePDF(raObj, function (response1) {






              NewsRa.approveRaByManager(raObj, function (response) {
                if (response.code == 200) {
                  $scope.showLoader = false;
                  toaster.pop('success', "", response.message);
                  $timeout(function () {
                    $modalInstance.close();
                    $state.go('main.list_news_ra');
                  }, 500);
                } else {
                  $scope.showLoader = false;
                  toaster.pop('error', "", response.message);
                }
              })

            })

          }


        });



      // $scope.showLoader = true;
      // raObj.shared_with = [];
      // raObj.approving_manager_ids = [];
      // raObj.description_of_action = newsRaData.description_of_action;
      // newsRaData.approvingManager.forEach(function (manager) {
      //   raObj.shared_with.push(manager.email);
      //   raObj.approving_manager_ids.push(manager._id);

      // })
      // console.log(raObj);

      // NewsRa.approveRaByManager(raObj, function (response) {
      //   if (response.code == 200) {
      //     $scope.showLoader = false;
      //     toaster.pop('success', "", response.message);
      //     $timeout(function () {
      //       $modalInstance.close();
      //       $state.go('main.list_news_ra');
      //     }, 500);
      //   } else {
      //     $scope.showLoader = false;
      //     toaster.pop('error', "", response.message);
      //   }
      // })

    };

    /* @function : forwardok
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : approve ra
     */
    $scope.forwardok = function (newsRaData) {
      console.log(newsRaData);
      console.log("openTermsCondition radata", $scope.raData)
      if (typeof newsRaData.otherapprovingManagerArr === "undefined") {
        toaster.pop('error', "", "Please select approving manager");
      } else {
        $scope.showLoader = true;

        raObj.otherapprovingManagerArr = newsRaData.otherapprovingManagerArr;
        raObj.description_of_action_forward = newsRaData.description_of_action_forward;
        raObj.approve = false;
        NewsRa.generatePDF(raObj, function (response) {

          console.log(response)


        })

        NewsRa.forwardToManager(raObj, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $modalInstance.close();
              $state.go('main.list_news_ra');
            }, 500);
          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })
      }
    };

    $scope.getMedicalInfoByRequest = function (id) {
      var traveller_id = id;
      console.log("traveller_id", traveller_id)
      if (traveller_id) {
        NewsRa.getMedicalInfoByRequest(traveller_id, function (response) {
          if (response.code == 200) {
            $scope.medical = response.medical.accept_request == true ? true : false;
            $scope.rejectMedicalRequest = response.medical.reject_request == true ? true : false;
            console.log("$scope.rejectMedicalRequest", $scope.rejectMedicalRequest)
            console.log("$scope.medical", $scope.medical)
            if ($scope.medical == true) {
              $state.go('main.view_medical_info', { traveller_id: traveller_id });
            } else if ($scope.rejectMedicalRequest == true) {
              swal({ title: '', text: "Your request has been rejected by your Client Super Admin for travellers medical information." });
            } else {
              swal({ title: '', text: "Please request to your Client Super Admin for travellers medical information.If already done wait for approval mail." });
            }
          } else {
            $scope.traveller = {};
          }
        })
      }
    }
    /* @function : cancel
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : close popup
     */
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };



    /* @function : rejectRaByManager
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : reject ra
     */
    $scope.rejectRaByManager = function (newsRaData) {
      if (!newsRaData) {
        toaster.pop('error', "", "Please add your description of action before reject RA");
      } else {
        $scope.showLoader = true;
        raObj.description_of_action = newsRaData.description_of_action;
        NewsRa.rejectRaByManager(raObj, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $modalInstance.close();
              $state.go('main.list_news_ra');
            }, 500);
          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })
      }
    }
    /* @function : rejectRaByManager
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : reject ra
     */

    $scope.travellerMedicalInformation = function (newsRaData) {
      console.log("travellerMedicalInformation21")
      if (!newsRaData) {
        toaster.pop('error', "", "Please fill description field");
      } else {
        $scope.showLoader = true;
        raObj.requesrForMedicalInfo = newsRaData.requesrForMedicalInfo;
        NewsRa.travellerMedicalInformation(raObj, function (response) {
          if (response.code == 200) {
            $scope.showLoader = false;
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $modalInstance.close();
              $state.go('main.list_news_ra');
            }, 500);
          } else {
            $scope.showLoader = false;
            toaster.pop('error', "", response.message);
          }
        })
      }
    }


    /* @function : moreInfoRaByManager
     *  @author  : MadhuriK 
     *  @created  : 25-Aug-17
     *  @modified :
     *  @purpose  : more info about ra
     */
    $scope.moreInfoRaByManager = function (newsRaData) {
      if (!newsRaData) {
        toaster.pop('error', "", "Please fill description of action");
      } else {
        if (!newsRaData.description_of_action) {
          toaster.pop('error', "", "Please add your description of action before request to more information about RA");
        } else {
          $scope.showLoader = true;
          raObj.description_of_action = newsRaData.description_of_action;
          raObj.ra_details = newsRaData.ra_details ? 'Missing' : 'Completed';
          raObj.question = newsRaData.question ? 'Missing' : 'Completed';
          raObj.supplier_details = newsRaData.supplier_details ? 'Missing' : 'Completed';
          raObj.communication_details = newsRaData.communication_details ? 'Missing' : 'Completed';
          raObj.contingency_details = newsRaData.contingency_details ? 'Missing' : 'Completed';
          raObj.other_info = newsRaData.other_info ? 'Missing' : 'Completed';
          NewsRa.moreInfoRaByManager(raObj, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;
              toaster.pop('success', "", response.message);
              $timeout(function () {
                $modalInstance.close();
                $state.go('main.list_news_ra');
              }, 500);
            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        }
      }

    }







  })

  /*
  Highlight the search results in risk label and question so added filter option here 
  */

  .filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) {
        text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
          '<span class="highlighted">$1</span>');
      }
      return $sce.trustAsHtml(text)
    }
  });
