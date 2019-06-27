'use strict';

angular.module('typeOfRa', ['ngAnimate', 'ui.router', 'ui.bootstrap'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.list_type_of_ra', {
        url: '/list/type/ra',
        templateUrl: 'modules/type_of_ra/views/list_type_of_ra.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.add_type_of_ra', {
        url: '/add/ra',
        templateUrl: 'modules/type_of_ra/views/add_type_of_ra.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.update_types_of_ra', {
        url: '/update/ra/:types_of_ra_id',
        templateUrl: 'modules/type_of_ra/views/update_type_of_ra.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.view_types_of_ra', {
        url: '/view/ra/:types_of_ra_id',
        templateUrl: 'modules/type_of_ra/views/view_type_of_ra.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })


      // old flow for ra with multistep form
      .state('add_risk_assisment', {
        url: '/add/risk_assisment',
        templateUrl: 'modules/type_of_ra/views/add_risk_assisment.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('add_risk_assisment.step1', {
        url: '/step1',
        templateUrl: 'modules/type_of_ra/views/step1.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('add_risk_assisment.step2', {
        url: '/step2/:ra_id',
        templateUrl: 'modules/type_of_ra/views/step2.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('add_risk_assisment.step3', {
        url: '/step3/:ra_id',
        templateUrl: 'modules/type_of_ra/views/step3.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('add_risk_assisment.step4', {
        url: '/step4/:ra_id',
        templateUrl: 'modules/type_of_ra/views/step4.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })



      // new flow for generic ra with multistep form
      .state('risk_assesment_generic', {
        url: '/risk/assesment',
        templateUrl: 'modules/type_of_ra/views/risk_assesment_generic.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('risk_assesment_generic.update', {
        url: '/update/risk/assesment/:ra_id',
        templateUrl: 'modules/type_of_ra/views/update_risk_assesment_generic.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_generic.generic_step1', {
        url: '/generic/step1',
        templateUrl: 'modules/type_of_ra/views/generic_step1.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_generic.generic_step2', {
        url: '/generic/step2/:ra_id',
        templateUrl: 'modules/type_of_ra/views/generic_step2.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      // .state('risk_assesment_generic.generic_step3', {
      //     url: '/generic/step3/:ra_id',
      //     templateUrl: 'modules/type_of_ra/views/generic_step3.html',
      //     controller: 'typeOfRaCtrl',
      //     authenticate: true
      // })
      .state('risk_assesment_generic.generic_step4', {
        url: '/generic/step3/:ra_id',
        templateUrl: 'modules/type_of_ra/views/generic_step4.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_generic.add_question', {
        url: '/generic/add_question',
        templateUrl: 'modules/type_of_ra/views/add_question_generic.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_generic.update_generic_question', {
        url: '/generic/update_question/:question_id',
        templateUrl: 'modules/type_of_ra/views/update_question_generic.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_generic.add_category', {
        url: '/generic/add_category',
        templateUrl: 'modules/type_of_ra/views/add_category_generic.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_generic.get_risk_que', {
        url: '/risk/label/questions/:ra_id/:risk_label_id',
        templateUrl: 'modules/type_of_ra/views/get_risk_que.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_generic.que_details', {
        url: '/risk/label/question/details/:ra_id/:risk_label_id/:que_id',
        templateUrl: 'modules/type_of_ra/views/risk_que_details.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })



      // new flow for individual ra with multistep form
      .state('risk_assesment_individual', {
        url: '/risk/assesment/individual',
        templateUrl: 'modules/type_of_ra/views/risk_assesment_individual.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('risk_assesment_individual.update', {
        url: '/update/:individualRa_id',
        templateUrl: 'modules/type_of_ra/views/update_individual_ra.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_individual.individual_step1', {
        url: '/step1',
        templateUrl: 'modules/type_of_ra/views/individual_step1.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_individual.individual_step2', {
        url: '/step2/:individualRa_id',
        templateUrl: 'modules/type_of_ra/views/individual_step2.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_individual.individual_step3', {
        url: '/step3/:individualRa_id',
        templateUrl: 'modules/type_of_ra/views/individual_step3.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_individual.add_question', {
        url: '/add_question',
        templateUrl: 'modules/type_of_ra/views/add_question.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_individual.update_question', {
        url: '/update_question/:question_id',
        templateUrl: 'modules/type_of_ra/views/update_question.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_individual.add_category', {
        url: '/add_category',
        templateUrl: 'modules/type_of_ra/views/add_category.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_individual.get_risk_que', {
        url: '/risk/label/individual/ra/questions/:individualRa_id/:risk_label_id',
        templateUrl: 'modules/type_of_ra/views/get_individual_ra_risk_que.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })
      .state('risk_assesment_individual.que_details', {
        url: '/question/details/:individualRa_id/:risk_label_id/:que_id',
        templateUrl: 'modules/type_of_ra/views/individual_ra_risk_que_details.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })


      // under construction ra not completed but save by super admin
      .state('main.list_under_construction_type_of_ra', {
        url: '/under/construction/ra_list',
        templateUrl: 'modules/type_of_ra/views/underconstruction_list.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic', {
        url: '/under_construction/risk/assesment',
        templateUrl: 'modules/type_of_ra/views/under_construction_risk_assesment_generic.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic.update', {
        url: '/update/risk/assesment/:ra_id',
        templateUrl: 'modules/type_of_ra/views/update_under_construction_genericRa.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic.existing_ra', {
        url: '/preview/existing/risk/assesment/:ra_id',
        templateUrl: 'modules/type_of_ra/views/preview_existing_genericRa.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic.generic_step2', {
        url: '/under_construction/generic/step2/:ra_id',
        templateUrl: 'modules/type_of_ra/views/under_construction_generic_step2.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic.get_risk_que', {
        url: '/under_construction/risk/label/questions/:ra_id/:risk_label_id',
        templateUrl: 'modules/type_of_ra/views/under_construction_get_risk_que.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic.que_details', {
        url: '/under_construction/risk/label/question/details/:ra_id/:risk_label_id/:que_id',
        templateUrl: 'modules/type_of_ra/views/under_construction_risk_que_details.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic.generic_step3', {
        url: '/under_construction/generic/risk/assesment/preview/:ra_id',
        templateUrl: 'modules/type_of_ra/views/under_construction_generic_step3.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic.add_question', {
        url: '/under_construction/generic/add_question',
        templateUrl: 'modules/type_of_ra/views/under_construction_add_question_generic.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_generic.add_category', {
        url: '/under_construction/generic/add_category',
        templateUrl: 'modules/type_of_ra/views/under_construction_add_category_generic.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      // individual ra

      .state('under_construction_risk_assesment_individual', {
        url: '/under_construction/individual/risk/assesment',
        templateUrl: 'modules/type_of_ra/views/under_construction_risk_assesment_individual.html',
        controller: 'typeOfRaCtrl',
        parent: 'main',
        authenticate: true
      })

      .state('under_construction_risk_assesment_individual.update', {
        url: '/update/risk/assesment/:individualRa_id',
        templateUrl: 'modules/type_of_ra/views/update_under_construction_individualRa.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_individual.existing_ra', {
        url: '/preview/existing/individual/risk/assesment/:individualRa_id',
        templateUrl: 'modules/type_of_ra/views/preview_existing_individualRa.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_individual.individual_step2', {
        url: '/under_construction/individual/step2/:individualRa_id',
        templateUrl: 'modules/type_of_ra/views/under_construction_individual_step2.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })


      .state('under_construction_risk_assesment_individual.get_risk_que', {
        url: '/under_construction/individual/risk/label/questions/:individualRa_id/:risk_label_id',
        templateUrl: 'modules/type_of_ra/views/under_construction_individual_get_risk_que.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_individual.que_details', {
        url: '/under_construction/individual/risk/label/question/details/:individualRa_id/:risk_label_id/:que_id',
        templateUrl: 'modules/type_of_ra/views/under_construction_individual_risk_que_details.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_individual.individual_step3', {
        url: '/under_construction/individual/risk/assesment/preview/:individualRa_id',
        templateUrl: 'modules/type_of_ra/views/under_construction_individual_step3.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_individual.add_question', {
        url: '/under_construction/individual/add_question',
        templateUrl: 'modules/type_of_ra/views/under_construction_add_question_individual.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })

      .state('under_construction_risk_assesment_individual.add_category', {
        url: '/under_construction/individual/add_category',
        templateUrl: 'modules/type_of_ra/views/under_construction_add_category_individual.html',
        controller: 'typeOfRaCtrl',
        authenticate: true
      })


  })
  .controller('typeOfRaCtrl', function($scope, toaster, $timeout, TypeOfRa, ngTableParams, $state, $window, Category, Question, $rootScope) {


    $rootScope.ra_id = $window.localStorage.types_of_ra_id ? $window.localStorage.types_of_ra_id : $state.params.ra_id;
    $rootScope.individualRa_id = $window.localStorage.individualRa_id ? $window.localStorage.individualRa_id : $state.params.individualRa_id;


    /* @function : createTypesOfRa
     *  @author  : MadhuriK 
     *  @created  : 08-Jun-17
     *  @modified :
     *  @purpose  : To create types of ra
     */
    $scope.createTypesOfRa = function(typeOfRa) {
      if (typeOfRa._id) {
        $scope.updateTypesOfRa(typeOfRa);
      } else if (typeOfRa) {
        TypeOfRa.createTypesOfRa(typeOfRa, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            if (window.location.hash == '#/main/add/risk_assisment/step1') {
              $timeout(function() {
                $state.go('add_risk_assisment.step2', { ra_id: response.data._id });
              }, 500);
            } else {
              $timeout(function() {
                $state.go('main.list_type_of_ra');
              }, 500);
            }
          } else {
            toaster.pop('error', "", response.error);
          }
        })
      }

    }


    /* @function : getAllTypesOfRa
     *  @author  : MadhuriK 
     *  @created  : 08-Jun-17
     *  @modified :
     *  @purpose  : To get all types of ra
     */
    $scope.search = true;
    $scope.getAllTypesOfRa = function(keyword) {
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
          createdAt: 'desc' // initial sorting
        }
      }, {
        getData: function($defer, params) {
          var page = params.page();
          var count = params.count();
          var sorting = params.sorting();
          TypeOfRa.getAllTypesOfRa({ page: page, count: count, sortby: sorting, keyword: keyword }, function(response) {
            if (response.code === 200) {
              params.settings().counts = [];
               response.data.forEach(function(typera) {
                  typera.sector = [];
                  if (typera.sector_name.length > 0) {
                    typera.sector_name.forEach(function(sectorname) {
                      typera.sector.push(sectorname.sectorName);
                    })
                  }
                })
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
              $scope.search = (response.data.length > 0 || keyword) ? true : false;
              $scope.typeOfRaData = response.data;
            } else {
              toaster.pop('error', "", response.err);
            }
          });
        }
      });
    }



    /* @function : deleteTypeOfRa
     *  @author  : MadhuriK 
     *  @created  : 08-Jun-17
     *  @modified :
     *  @purpose  : To delete types of ra
     */
    $scope.deleteTypeOfRa = function(typeOfRa_id) {
      if (typeOfRa_id) {
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
          function() {
            TypeOfRa.deleteTypeOfRa(typeOfRa_id, function(response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                if ($window.localStorage.individualRa_id) {
                  delete $window.localStorage.individualRa_id;
                } else if ($window.localStorage.types_of_ra_id) {
                  delete $window.localStorage.types_of_ra_id;
                }
                $scope.getAllTypesOfRa();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }

    /* @function : changeStatus
     *  @author  : MadhuriK 
     *  @created  : 08-Jun-17
     *  @modified :
     *  @purpose  : To change status of types of ra
     */
    $scope.changeStatus = function(status, typeOfRa_id) {
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
          function() {
            var typeOfRa = {};
            typeOfRa.id = typeOfRa_id;
            typeOfRa.status = typeOfRaStatus;
            TypeOfRa.changeTypeOfRaStatus(typeOfRa, function(response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllTypesOfRa();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }


    /* @function : getRaDetails
     *  @author  : MadhuriK 
     *  @created  : 08-Jun-17
     *  @modified :
     *  @purpose  : To ra details 
     */
    $scope.getRaDetails = function() {
      if ($state.current.name == 'risk_assesment_generic.update' || $state.current.name == 'under_construction_risk_assesment_generic.update') {
        $window.localStorage.types_of_ra_id = $state.params.ra_id ? $state.params.ra_id : $window.localStorage.types_of_ra_id;
      }
      var types_of_ra_id = $state.params.types_of_ra_id ? $state.params.types_of_ra_id : $window.localStorage.types_of_ra_id;
      if (types_of_ra_id) {
        TypeOfRa.getRaDetails(types_of_ra_id, function(response) {
          if (response.code === 200 && response.data !== null) {
            TypeOfRa.getAllSectorList(function(response1) {
              if (response.code == 200) {
                $rootScope.sectorArr = response1.data;
                $rootScope.sectorArr.forEach(function(sector) {
                  if (response.data.sector_name.length > 0) {
                    response.data.sector_name.forEach(function(sectorName) {
                        console.log("sectorName",sectorName)
                         console.log("sector",sector._id)
                      if (sectorName == sector._id) {
                        sector.ticked = true;
                      }
                    })
                  }
                })
              }
            })
            if ($state.current.name == "risk_assesment_generic.generic_step1" && response.data.is_created_compleletely == true) {
              delete $window.localStorage.types_of_ra_id;
              response.data = {};
              $state.reload();
              $rootScope.questions = [];
            }

            $scope.typesOfRa = response.data;
            // $scope.typesOfRa.sector = response.data ? response.data.sector_id : "";

          } else {
            $scope.typesOfRa = {};
          }
        })
      }

    }



    /* @function : updateTypesOfRa
     *  @author  : MadhuriK 
     *  @created  : 08-Jun-17
     *  @modified :
     *  @purpose  : To udpate ra details 
     */
    $scope.updateTypesOfRa = function(typeOfRa) {
      if (typeOfRa) {
        TypeOfRa.updateTypesOfRa(typeOfRa, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            if (window.location.hash == '#/main/add/risk_assisment/step1') {
              $timeout(function() {
                $state.go('add_risk_assisment.step2', { ra_id: typeOfRa._id });
              }, 500);
            } else {
              $timeout(function() {
                $state.go('main.list_type_of_ra');
              }, 500);
            }
          } else {
            toaster.pop('error', "", response.error);
          }
        })
      }

    }


    /* @function : addCategory
     *  @author  : MadhuriK 
     *  @created  : 07-July-17
     *  @modified :
     *  @purpose  : To add category.
     */
    $scope.addCategory = function(category) {
      if (category._id) {
        $scope.updateCategory(category);
      } else if (category) {
        category.types_of_ra_id = $state.params.ra_id ? $state.params.ra_id : "";
        if (category.types_of_ra_id !== "") {
          Category.addCategory(category, function(response) {
            if (response.code == 200) {
              $window.localStorage.category_id = response.data._id;
              toaster.pop('success', "", response.message);
              $timeout(function() {
                $state.go('add_risk_assisment.step3', { ra_id: $state.params.ra_id });
              }, 500);
            } else {
              toaster.pop('error', "", response.error);
            }
          })
        } else {
          toaster.pop('error', "", "Please create ra before creating category");
        }
      }
    }


    /* @function : $stateChangeStart
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To call getRaDetails function when types_of_ra_id value store in localStorage .
     */
    if ($window.localStorage.types_of_ra_id || $state.params.ra_id) {
      $scope.getRaDetails();
    }

    /* @function : getEditorData
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To get ckeditor data for description.
     */
    $scope.editor = null;
    $scope.question = null;
    $scope.getEditorData = function() {
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
        $scope.editor.on('change', function(evt) {
          $rootScope.data = evt.editor.getData();
        });
      }

      $scope.question = CKEDITOR.replace('question');
      if ($scope.question) {
        $scope.question.on('change', function(evt) {
          $rootScope.question_text = evt.editor.getData();
        });
      }
    }


    /* @function : addQuestionnaire
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To add question.
     */
    $scope.addQuestionnaire = function(question) {
      if ($state.params.ra_id && question.category_id) {
        if (question._id) {
          $scope.updateQuestionnaire(question);
        } else if (question) {
          question.best_practice_advice = $rootScope.data;
          Question.addQuestionnaire(question, function(response) {
            if (response.code === 200) {
              $window.localStorage.question_id = response.data._id;
              toaster.pop('success', "", response.message);
              $timeout(function() {
                $state.go('add_risk_assisment.step4', { ra_id: $window.localStorage.types_of_ra_id });
              }, 500);
            } else {
              toaster.pop('error', "", response.err);
            }
          })
        }
      } else {
        toaster.pop('error', "", "Please create ra and category before creating question and select category for question");
      }
    }



    /* @function : getCategoryDetails
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To get category details.
     */
    $scope.getCategoryDetails = function() {
      var category_id = $window.localStorage.category_id;
      Category.getCategoryDetails(category_id, function(response) {
        if (response.code === 200) {
          $scope.category = response.data;
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }


    /* @function : updateCategory
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To update the category.
     */
    $scope.updateCategory = function(category) {
      Category.updateCategory(category, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
          $timeout(function() {
            $state.go('add_risk_assisment.step3', { ra_id: category.types_of_ra_id });
          }, 500);
        } else {
          toaster.pop('error', "", response.error);
        }

      })
    }


    /* @function : getCategoryDetails
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To call getCategoryDetails function when category_id value store in localStorage .
     */
    if ($window.localStorage.category_id) {
      $scope.getCategoryDetails();
    }

    /* @function : getCategories
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To get all categories.
     */
    $scope.getCategories = function() {
      Question.getCategories(function(response) {
        if (response.code === 200) {
          // var catArr = [];
          // response.data.forEach(function (catObj) {
          //     if (catObj.types_of_ra_id == $state.params.ra_id) {
          //         catArr.push(catObj);
          //     }
          // })
          $scope.categoryArr = response.data;
        } else {
          $scope.categoryArr = [];
        }
      })
    }



    /* @function : getCategories
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To get all categories and get editor data after 100 ms.
     */

    $scope.getCategories();

    if (($state.current.name == 'risk_assesment_individual.add_question') || ($state.current.name == 'risk_assesment_generic.add_question' || $state.current.name == 'under_construction_risk_assesment_generic.add_question') ||
      ($state.current.name == 'under_construction_risk_assesment_individual.add_question')
    )
      setTimeout(function() {
        $scope.getEditorData();
      }, 100);


    /* @function : getQuestionnairDetail
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To get details of questionnair.
     */
    $scope.getQuestionnairDetail = function() {
      var questionnair_id = $state.params.question_id;
      Question.getQuestionnairDetail(questionnair_id, function(response) {
        if (response.code === 200) {
          Question.getCategories(function(result) {
            if (response.code === 200) {


              var catArr = [];
              result.data.forEach(function(catObj) {
                if (catObj.types_of_ra_id == $state.params.ra_id) {
                  catArr.push(catObj);
                }
              })
              if (response.data) {
                $scope.categoryArr = catArr;
                $scope.categoryArr.forEach(function(category) {
                  response.data.category_id.forEach(function(categoryId) {
                    if (categoryId._id == category._id) {
                      category.ticked = true;
                    }
                  })
                })
                response.data.catArr = [];
                response.data.category_id.forEach(function(catObj) {
                  response.data.catArr.push(catObj.categoryName);
                })
              }
            }

          })
          $scope.questionnaire = response.data;
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }

    if ($state.params.question_id) {
      $scope.getQuestionnairDetail();
    }

    /* @function : updateQuestionnaire
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To update questionnair.
     */
    $scope.updateQuestionnaire = function(questionnaire) {
      Question.updateQuestionnaire(questionnaire, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
          $timeout(function() {
            $state.go('add_risk_assisment.step4', { ra_id: $window.localStorage.types_of_ra_id });
          }, 500);
        } else {
          toaster.pop('error', "", response.err);
        }

      })
    }


    /* @function : submitForm
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To complete the process.
     */
    $scope.submitForm = function() {
      delete $window.localStorage.category_id;
      delete $window.localStorage.types_of_ra_id;
      delete $window.localStorage.question_id;
      $rootScope.raData = [];
      $rootScope.categoryData = [];
      $rootScope.questions = [];
      toaster.pop('success', "", "Submitted successfully");
      $timeout(function() {
        $state.reload();
      }, 500);

      $timeout(function() {
        $state.go('add_risk_assisment.step1');
      }, 1000)
    }



    /* @function : createNewCatForRa
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To create new category for selected ra.
     */
    $scope.createNewCatForRa = function() {
      if ($window.localStorage.category_id) {
        delete $window.localStorage.category_id;
        $state.reload();
      }

    }

    /* @function : createNewCatForRa
     *  @author  : MadhuriK 
     *  @created  : 10-July-17
     *  @modified :
     *  @purpose  : To create new category and stay on the same page for creating new category.
     */
    $scope.addCatAndStay = function(category) {
      if (category._id) {
        $scope.updateCatAndStay(category);
      } else if (category) {
        category.types_of_ra_id = $state.params.ra_id ? $state.params.ra_id : "";
        if (category.types_of_ra_id !== "") {
          Category.addCategory(category, function(response) {
            if (response.code == 200) {
              $window.localStorage.category_id = response.data._id;
              toaster.pop('success', "", response.message);
            } else {
              toaster.pop('error', "", response.error);
            }
          })
        } else {
          toaster.pop('error', "", "Please create ra before creating category");
        }
      }
    }


    /* @function : updateCatAndStay
     *  @author  : MadhuriK 
     *  @created  : 11-July-17
     *  @modified :
     *  @purpose  : To update the category.
     */
    $scope.updateCatAndStay = function(category) {
      Category.updateCategory(category, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
        } else {
          toaster.pop('error', "", response.error);
        }

      })
    }


    /* @function : createNewQueForRa
     *  @author  : MadhuriK 
     *  @created  : 11-July-17
     *  @modified :
     *  @purpose  : To create new questions.
     */
    $scope.createNewQueForRa = function() {
      if ($window.localStorage.question_id) {
        delete $window.localStorage.question_id;
        $state.reload();
      }
    }


    /* @function : addQueAndStay
     *  @author  : MadhuriK 
     *  @created  : 11-July-17
     *  @modified :
     *  @purpose  : To add question and stay on the same page.
     */
    $scope.addQueAndStay = function(question) {
      if ($state.params.ra_id && question.category_id) {
        if (question._id) {
          $scope.updateQueAndStay(question);
        } else if (question) {
          question.best_practice_advice = $rootScope.data;
          Question.addQuestionnaire(question, function(response) {
            if (response.code === 200) {
              $window.localStorage.question_id = response.data._id;
              toaster.pop('success', "", response.message);
            } else {
              toaster.pop('error', "", response.err);
            }
          })
        }
      } else {
        toaster.pop('error', "", "Please create ra and category before creating question and select category for question");
      }
    }



    /* @function : addQueAndStay
     *  @author  : MadhuriK 
     *  @created  : 11-July-17
     *  @modified :
     *  @purpose  : To update question and stay on the same page.
     */
    $scope.updateQueAndStay = function(questionnaire) {
      Question.updateQuestionnaire(questionnaire, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
        } else {
          toaster.pop('error', "", response.err);
        }

      })
    }


    if ($state.params.ra_id || $window.localStorage.ra_id || $window.localStorage.individualRa_id ||
      $state.params.individualRa_id
    ) {
      var ra_id;
      if ($state.current.name.indexOf('risk_assesment_generic') > -1) {
        ra_id = $state.params.ra_id ? $state.params.ra_id : $window.localStorage.ra_id;
      } else if ($state.current.name.indexOf('risk_assesment_individual') > -1) {
        ra_id = $state.params.individualRa_id ? $state.params.individualRa_id : $window.localStorage.individualRa_id;
      }
      TypeOfRa.getRaPreviewData(ra_id, function(response) {
        $scope.limit = 1;
        if (response.code === 200) {
          $rootScope.raData = response.raData ? response.raData : [];
          //   $rootScope.categoryData = response.categoryData ? response.categoryData : [];
          if (response.queData) {
            response.queData.forEach(function(que) {
              que.catArr = [];
              que.category_id.forEach(function(category) {
                que.catArr.push(category.categoryName)
              })
            })
          }

          $rootScope.questions = response.queData ? response.queData : [];
        } else {
          $rootScope.raData = [];
          $rootScope.categoryData = [];
          $rootScope.questions = [];
        }
      })
    }



    /* Add Generic and Individual ra flow */


    /* @function : getAllSectorList
     *  @author  : MadhuriK 
     *  @created  : 13-July-17
     *  @modified :
     *  @purpose  : To get sector list for creating generic ra.
     */
    $scope.getAllSectorList = function() {
      TypeOfRa.getAllSectorList(function(response) {
        if (response.code == 200) {
          console.log("response", response.data)
          $window.localStorage.sector = JSON.stringify(response.data);
          $rootScope.sectorArr = ($window.localStorage.sector !== undefined && $window.localStorage.sector !== null) ? JSON.parse($window.localStorage.sector) : "";
        } else {
          $window.localStorage.sector = {};
        }
      })
    }



    /* @function : createGenericRa
     *  @author  : MadhuriK 
     *  @created  : 13-July-17
     *  @modified :
     *  @purpose  : To create generic ra.
     */
    $scope.createGenericRa = function(genericRaData) {
      var sectorArr = [];
      genericRaData.sectorName.forEach(function(sectorNameobj) {
        sectorArr.push(sectorNameobj._id);
      })
      genericRaData.sector_name = sectorArr;
      if (genericRaData.sector == "Select Sector") {
        toaster.pop('error', "", "Please select any sector");
      } else {
        if (genericRaData._id) {
          TypeOfRa.updateGenericRa(genericRaData, function(response) {
            if (response.code == 200) {
              toaster.pop('success', "", response.message);
              $timeout(function() {
                $state.go('risk_assesment_generic.generic_step2', { ra_id: $window.localStorage.types_of_ra_id });
              }, 500);
            } else {
              toaster.pop('error', "", response.message);
            }
          })
        } else {
          TypeOfRa.createGenericRa(genericRaData, function(response) {
            if (response.code == 200) {
              $window.localStorage.types_of_ra_id = response.data._id;
              toaster.pop('success', "", response.message);
              $timeout(function() {
                $state.go('risk_assesment_generic.generic_step2', { ra_id: response.data._id });
              }, 500);
            } else {
              toaster.pop('error', "", response.message);
            }
          })
        }
      }
    }


    /* @function : getAllClientList
     *  @author  : MadhuriK 
     *  @created  : 13-July-17
     *  @modified :
     *  @purpose  : To get all client list.
     */
    $scope.getAllClientList = function() {
      TypeOfRa.getAllClientList(function(response) {
        if (response.code == 200) {
          // $window.localStorage.clientList = response.data.length > 0 ? JSON.stringify(response.data) : null;
          $scope.clientList = response.data.length > 0 ? response.data : null;

          // ($window.localStorage.clientList !== null && $window.localStorage.clientList !== undefined) ? JSON.parse($window.localStorage.clientList) : "";

        } else {
          $window.localStorage.clientList = {};
        }
      })
    }



    /* @function : getDepartment
     *  @author  : MadhuriK 
     *  @created  : 13-July-17
     *  @modified :
     *  @purpose  : To get department of selected client.
     */
    $scope.getDepartment = function(client_id) {
      if (client_id) {
        TypeOfRa.getDepartment(client_id, function(response) {
          if (response.code == 200) {

            //    $window.localStorage.clientDepartmentList = response.data.length > 0 ? JSON.stringify(response.data) : null;

            $scope.clientDepartmentList = response.data;

            // $window.localStorage.clientDepartmentList !== null ? JSON.parse($window.localStorage.clientDepartmentList) : "";

          } else {
            // $window.localStorage.clientDepartmentList = [];
          }
        })
      }

    }


    /* @function : createIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 13-July-17
     *  @modified :
     *  @purpose  : To create individual ra.
     */
    $scope.createIndividualRa = function(raData) {
      raData.country = raData.country ? raData.country : null
      if (raData._id) {
        TypeOfRa.updateIndividualRa(raData, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $state.go('risk_assesment_individual.individual_step2', { individualRa_id: $window.localStorage.individualRa_id });
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      } else {
        TypeOfRa.createIndividualRa(raData, function(response) {
          if (response.code == 200) {
            $window.localStorage.individualRa_id = response.data._id;
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $state.go('risk_assesment_individual.individual_step2', { individualRa_id: response.data._id });
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }



    /* @function : getAllCountryList
     *  @author  : MadhuriK 
     *  @created  : 14-July-17
     *  @modified :
     *  @purpose  : To get country list.
     */
    $scope.getAllCountryList = function() {
      TypeOfRa.getAllCountryList(function(response) {
        if (response.code == 200) {
          // $window.localStorage.countryArr = response.data.length > 0 ? JSON.stringify(response.data) : null;
          // $rootScope.countryArr = response.data.length > 0 ? response.data : null;
          $scope.countryArr = response.data.length > 0 ? response.data : null;


          // ($window.localStorage.countryArr !== null && $window.localStorage.countryArr !== undefined) ? JSON.parse($window.localStorage.countryArr) : "";
        } else {
          // $window.localStorage.countryArr = {};
        }
      })
    }



    /* @function : getAllCountryList
     *  @author  : MadhuriK 
     *  @created  : 14-July-17
     *  @modified :
     *  @purpose  : To get all question.
     */
    $scope.getAllQuestionnaire = function(questionnaire_name) {
      $scope.showLoader = true;
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 5,
        sorting: {
          createdAt: 'desc' // initial sorting
        }
      }, {
        getData: function($defer, params) {
          var page = params.page();
          var count = params.count();
          var sorting = params.sorting();
          Question.getAllQuestionnaire({ page: page, count: count, sortby: sorting, questionnaire_name: questionnaire_name }, function(response) {
            if (response.code === 200) {

              response.data.forEach(function(questionnair) {
                if (questionnair.assigned_ra_id.length > 0) {
                  questionnair.assigned_ra_id.forEach(function(queId) {

                    var raID = $state.params.ra_id ? $state.params.ra_id : $state.params.individualRa_id;
                    if (queId == raID) {
                      questionnair.assign = queId;
                    }
                  })
                }


                questionnair.categoryArr = [];
                questionnair.category_id.forEach(function(Category) {
                  questionnair.categoryArr.push(Category.categoryName);
                })
              })

              params.settings().counts = [];

              // if (response.count > 10) {
              //     params.settings().counts.push(10);
              //     params.settings().counts.push(25);
              // } if (response.count > 25) {
              //     params.settings().counts.push(50);
              // } if (response.count > 50) {
              //     params.settings().counts.push(100);
              // }
              $timeout(function() {
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


    /* @function : assignQues
     *  @author  : MadhuriK 
     *  @created  : 14-July-17
     *  @modified :
     *  @purpose  : To assign questions to ra.
     */
    var assignQuesArr = [];
    $scope.assignQuesToRa = function(assignQueData, $index) {
      if ($state.params.ra_id) {
        assignQueData.assignRaId = $state.params.ra_id;
        TypeOfRa.assignQuesToRa(assignQueData, function(response) {
          if (response.code == 200) {
            $scope.toasters.splice(toaster.id, 1);
            $state.reload();
            $timeout(function() {
              toaster.pop('success', "", response.message);
            }, 500);
          } else {
            $scope.toasters.splice(toaster.id, 1);
            $state.reload();
            $timeout(function() {
              toaster.pop('error', "", response.message);
            }, 500);
          }
        })
        // if (assignQueData.assign == true) {
        //     assignQuesArr.push(assignQueData);
        // }
        // else if (assignQueData.assign == false) {
        //     if (assignQuesArr.length > 0) {
        //         assignQuesArr.forEach(function (ques, $index) {
        //             if (ques._id == assignQueData._id) {
        //                 assignQuesArr.splice($index, 1);
        //             }
        //         })
        //     }
        // }
      } else {
        $scope.questionnaire[$index].assign = false;
        $scope.toasters.splice(toaster.id, 1);
        toaster.pop('error', "", "Please create RA before assigning question to it");
      }

    }


    /* @function : submitGenericRa
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To complete the process for generic ra.
     */
    $scope.submitGenericRa = function() {
      swal({
          title: "Are you sure?",
          text: "You want to submit created ra or want to do some modifications",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00acd6",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: true
        },
        function() {
          TypeOfRa.submitGenericRa($window.localStorage.types_of_ra_id, function(response) {
            if (response.code == 200) {
              toaster.pop('success', "", response.message);
              $timeout(function() {
                delete $window.localStorage.types_of_ra_id;
                $rootScope.raData = [];
                $rootScope.questions = [];
                $state.go('main.list_type_of_ra');
              }, 1000)
            }

          });

        });
    }




    /* @function : assignQuesToIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To assign questions to individual ra.
     */
    $scope.assignQuesToIndividualRa = function(assignQueData, $index) {
      if ($state.params.individualRa_id) {
        assignQueData.assignRaId = $state.params.individualRa_id;
        TypeOfRa.assignQuesToRa(assignQueData, function(response) {
          if (response.code == 200) {
            $scope.toasters.splice(toaster.id, 1);
            $state.reload();
            $timeout(function() {
              toaster.pop('success', "", response.message);
            }, 500);
          } else {
            $scope.toasters.splice(toaster.id, 1);
            $state.reload();
            $timeout(function() {
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
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To get individual ra data.
     */
    $scope.getIndividualRaDetails = function() {
      if (($state.current.name == 'risk_assesment_individual.update') || ($state.current.name == 'under_construction_risk_assesment_individual.update')) {
        $window.localStorage.individualRa_id = $state.params.individualRa_id ? $state.params.individualRa_id : $window.localStorage.individualRa_id;
      }

      var individualRa_id = $state.params.individualRa_id ? $state.params.individualRa_id : $window.localStorage.individualRa_id;
      if (individualRa_id) {
        TypeOfRa.getRaDetails(individualRa_id, function(response) {
          if (response.code === 200 && response.data !== null) {
            if ($state.current.name == "risk_assesment_individual.individual_step1" && response.data.is_created_compleletely == true) {
              delete $window.localStorage.individualRa_id;
              response.data = {};
              $rootScope.questions = [];
              $state.reload();
            }

            $scope.individualRa = response.data;
            $scope.individualRa.clientList = response.data ? response.data.client_id : "";
            TypeOfRa.getDepartment(response.data.client_id, function(result) {
              if (result.code == 200) {
                $scope.clientDepartmentList = result.data;

                $scope.clientDepartmentList.forEach(function(client_all_depart) {
                  if (response.data.client_department.length > 0) {
                    response.data.client_department.forEach(function(client_selected_depart) {
                      if (client_selected_depart == client_all_depart._id) {
                        client_all_depart.ticked = true;
                      }
                    })
                  }
                })
                // $window.localStorage.clientDepartmentList = $scope.clientDepartmentList.length > 0 ? JSON.stringify($scope.clientDepartmentList) : null;
                // $scope.clientDepartmentList = $scope.clientDepartmentList;
                //  $window.localStorage.clientDepartmentList !== null ? JSON.parse($window.localStorage.clientDepartmentList) : "";
              }
            })
          } else {
            $scope.individualRa = {};
          }
        })
      }
    }



    /* @function : $stateChangeStart
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To call $scope.getIndividualRaDetails function when individualRa_id value store in localStorage .
     */
    if ($window.localStorage.individualRa_id || $state.params.individualRa_id) {
      $scope.getIndividualRaDetails();
    }


    /* @function : submitIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To complete the process for generic ra.
     */
    $scope.submitIndividualRa = function() {
      swal({
          title: "Are you sure?",
          text: "You want to submit created ra or want to do some modifications",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00acd6",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: true
        },
        function() {
          TypeOfRa.submitGenericRa($window.localStorage.individualRa_id, function(response) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              delete $window.localStorage.individualRa_id;
              $rootScope.raData = [];
              $rootScope.questions = [];
              $state.go('main.list_type_of_ra');
            }, 1000)
          })
        });
    }


    /* @function : reset
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To reset new ra process.
     */
    $scope.reset = function(typesOfRa) {
      if (typesOfRa) {
        delete $window.localStorage.individualRa_id;
        $state.reload();
      }
    }


    /* @function : addQuestionToIndividual
     *  @author  : MadhuriK 
     *  @created  : 17-July-17
     *  @modified :
     *  @purpose  : To add question for second step for individual ra.
     */
    $scope.addQuestionToIndividual = function(questionnaire) {
      if (!$rootScope.question_text || !$rootScope.data || questionnaire.category_id.length == 0) {
        toaster.pop('error', "", "Please all the required fields");
      } else {
        questionnaire.question = $rootScope.question_text;
        questionnaire.best_practice_advice = $rootScope.data;
        Question.addQuestionnaire(questionnaire, function(response) {
          if (response.code === 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $window.history.back();
            }, 500);
            // $timeout(function () {
            //     $state.go('risk_assesment_individual.individual_step2', { individualRa_id: $window.localStorage.individualRa_id });
            // }, 500);
          } else {
            toaster.pop('error', "", response.err);
          }
        })
      }
    }


    /* @function : addQuestionToGeneric
     *  @author  : MadhuriK 
     *  @created  : 18-July-17
     *  @modified :
     *  @purpose  : To add question for second step for generic ra.
     */
    $scope.addQuestionToGeneric = function(questionnaire) {
      if (!$rootScope.question_text || !$rootScope.data || questionnaire.category_id.length == 0) {
        toaster.pop('error', "", "Please all the required fields");
      } else {
        questionnaire.question = $rootScope.question_text;
        questionnaire.best_practice_advice = $rootScope.data;
        Question.addQuestionnaire(questionnaire, function(response) {
          if (response.code === 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $window.history.back();
            }, 500);
            // $timeout(function () {
            //     $state.go('risk_assesment_generic.generic_step2', { ra_id: $window.localStorage.types_of_ra_id });
            // }, 500);
          } else {
            toaster.pop('error', "", response.err);
          }
        })
      }
    }


    /* @function : changeLimit
     *  @author  : MadhuriK 
     *  @created  : 18-July-17
     *  @modified :
     *  @purpose  : To change limits of show question.
     */
    $scope.changeLimit = function() {
      if ($scope.limit == $rootScope.questions.length) {
        $scope.limit = 1;
        $scope.buttonLable = "";
      } else {
        $scope.limit = $rootScope.questions.length;
        $scope.buttonLable = 'Show Less';
      }
    }


    /* @function : updateQuestionToGeneric
     *  @author  : MadhuriK 
     *  @created  : 20-July-17
     *  @modified :
     *  @purpose  : To update question for generic ra.
     */
    $scope.updateQuestionToGeneric = function(questionnaire) {
      Question.updateQuestionnaire(questionnaire, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
          $timeout(function() {
            $state.go('risk_assesment_generic.generic_step2', { ra_id: $window.localStorage.types_of_ra_id });
          }, 500);
        } else {
          toaster.pop('error', "", response.err);
        }

      })
    }


    /* @function : updateQuestionToIndividual
     *  @author  : MadhuriK 
     *  @created  : 20-July-17
     *  @modified :
     *  @purpose  : To update question for individual ra.
     */
    $scope.updateQuestionToIndividual = function(questionnaire) {
      Question.updateQuestionnaire(questionnaire, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
          $timeout(function() {
            $state.go('risk_assesment_individual.individual_step2', { individualRa_id: $window.localStorage.individualRa_id });
          }, 500);
        } else {
          toaster.pop('error', "", response.err);
        }

      })
    }


    /* @function : addCategoryToGeneric
     *  @author  : MadhuriK 
     *  @created  : 20-July-17
     *  @modified :
     *  @purpose  : To add category for generic ra.
     */
    $scope.addCategoryToGeneric = function(category) {
      if (category) {
        Category.addCategory(category, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              window.history.back();
            }, 500)

            // $timeout(function () {
            //     $state.go('risk_assesment_generic.add_question', { ra_id: $window.localStorage.types_of_ra_id });
            // }, 500);
          } else {
            toaster.pop('error', "", response.error);
          }
        })
      }
    }



    /* @function : addCategoryToIndividual
     *  @author  : MadhuriK 
     *  @created  : 20-July-17
     *  @modified :
     *  @purpose  : To add category for individual ra.
     */
    $scope.addCategoryToIndividual = function(category) {
      if (category) {
        Category.addCategory(category, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $window.history.back();
            })

            // $timeout(function () {
            //     $state.go('risk_assesment_individual.add_question', { individualRa_id: $window.localStorage.individualRa_id });
            // }, 500);
          } else {
            toaster.pop('error', "", response.error);
          }
        })
      }
    }


    /* @function : getRaToView
     *  @author  : MadhuriK 
     *  @created  : 24-July-17
     *  @modified :
     *  @purpose  : To get ra details to view.
     */
    $scope.getRaToView = function() {
      var types_of_ra_id = $state.params.types_of_ra_id;
      if (types_of_ra_id) {
        TypeOfRa.getRaToView(types_of_ra_id, function(response) {
          if (response.code == 200) {
            $scope.raData = response.raData;
            $scope.questionData = response.questionData;

            $scope.questionData.forEach(function(que) {
              que.categoryName = [];
              que.category_id.forEach(function(categoryObj) {
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


    /* @function : filterQueByRiskLable
     *  @author  : MadhuriK 
     *  @created  : 28-July-17
     *  @modified :
     *  @purpose  : To filter question according to selected risk labels.
     */
    $scope.filterQueByRiskLable = function(risk_label) {
      if (risk_label == 'all') {
        $scope.questionnaire = $scope.copyquesData;
      } else {
        var dataArr = [];
        $scope.copyquesData.forEach(function(questionObj) {
          if (questionObj.category_id.length > 0) {
            questionObj.category_id.forEach(function(queCat) {
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


    // to show active steps in generic ra creation with multistep form
    if (($state.current.name == 'risk_assesment_generic.generic_step2') || ($state.current.name == 'risk_assesment_generic.get_risk_que') || ($state.current.name == 'risk_assesment_generic.add_question') || ($state.current.name == 'risk_assesment_generic.add_category') || ($state.current.name == 'risk_assesment_generic.que_details')) {
      $rootScope.flag = 'step2';
    } else if ($state.current.name == 'risk_assesment_generic.generic_step4') {
      $rootScope.flag = 'step4';
    } else {
      $rootScope.flag = '';
    }


    // to show active steps in individual ra creation with multistep form
    if (($state.current.name == 'risk_assesment_individual.individual_step2') || ($state.current.name == 'risk_assesment_individual.add_question') || ($state.current.name == 'risk_assesment_individual.add_category') ||
      ($state.current.name == 'risk_assesment_individual.get_risk_que') ||
      ($state.current.name == 'risk_assesment_individual.que_details')) {
      $rootScope.individual_stepflag = 'individual_step2';
    } else if ($state.current.name == 'risk_assesment_individual.individual_step3') {
      $rootScope.individual_stepflag = 'individual_step3';
    } else {
      $rootScope.individual_stepflag = '';
    }





    /* @function : sendToSecondStep
     *  @author  : MadhuriK 
     *  @created  : 03-Aug-17
     *  @modified :
     *  @purpose  : To redirect to second step in generic ra creation if third step is complete.
     */
    $scope.sendToSecondStep = function() {
      if ($window.localStorage.types_of_ra_id || $state.params.ra_id) {
        var ra_id = $window.localStorage.types_of_ra_id ? $window.localStorage.types_of_ra_id :
          $state.params.ra_id ? $state.params.ra_id : "";
        $state.go('risk_assesment_generic.generic_step2', { ra_id: ra_id });
      }
    }



    /* @function : sendToThirdStep
     *  @author  : MadhuriK 
     *  @created  : 02-Aug-17
     *  @modified :
     *  @purpose  : To redirect to third step in generic ra creation if second step is complete.
     */
    $scope.sendToThirdStep = function() {

      if ($window.localStorage.types_of_ra_id || $state.params.ra_id) {
        var ra_id = $window.localStorage.types_of_ra_id ? $window.localStorage.types_of_ra_id :
          $state.params.ra_id ? $state.params.ra_id : "";
        $state.go('risk_assesment_generic.generic_step3', { ra_id: ra_id });
      } else {
        // toaster.pop('error', "", "Please assign atleast one question to RA");
      }
    }



    /* @function : sendToFourthStep
     *  @author  : MadhuriK 
     *  @created  : 02-Aug-17
     *  @modified :
     *  @purpose  : To redirect to fourth step in generic ra creation if third step is complete.
     */
    $scope.sendToFourthStep = function() {
      if ($rootScope.questions.length > 0) {
        var ra_id = $window.localStorage.types_of_ra_id ? $window.localStorage.types_of_ra_id :
          $state.params.ra_id ? $state.params.ra_id : "";
        $state.go('risk_assesment_generic.generic_step4', { ra_id: ra_id });
      }
    }



    /* @function : sendToThirdStep
     *  @author  : MadhuriK 
     *  @created  : 02-Aug-17
     *  @modified :
     *  @purpose  : To redirect to second step in individual ra creation if first step is complete.
     */
    $scope.sendIndividualSecondStep = function() {
      if ($window.localStorage.individualRa_id || $state.params.individualRa_id) {
        var ra_id = $window.localStorage.individualRa_id ? $window.localStorage.individualRa_id :
          $state.params.individualRa_id ? $state.params.individualRa_id : "";
        $state.go('risk_assesment_individual.individual_step2', { individualRa_id: ra_id });
      } else {
        // toaster.pop('error', "", "Please assign atleast one question to RA");
      }
    }


    /* @function : sendToThirdStep
     *  @author  : MadhuriK 
     *  @created  : 02-Aug-17
     *  @modified :
     *  @purpose  : To redirect to third step in individual ra creation if second step is complete.
     */
    $scope.sendIndividualThirdStep = function() {
      if ($rootScope.questions.length > 0) {
        var ra_id = $window.localStorage.individualRa_id ? $window.localStorage.individualRa_id :
          $state.params.individualRa_id ? $state.params.individualRa_id : "";
        $state.go('risk_assesment_individual.individual_step3', { individualRa_id: ra_id });
      }
    }


    /* @function : getAllRiskLabels
     *  @author  : MadhuriK 
     *  @created  : 03-Aug-17
     *  @modified :
     *  @purpose  : To get all risk labels
     */
    $scope.getAllRiskLabels = function() {
      // TypeOfRa.getAllRiskLabels(function (response) {
      //     if (response.code == 200) {
      //         $scope.riskLabels = response.data;
      //     } else {
      //         $scope.riskLabels = {};
      //     }
      // })
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 18,
        sorting: {
          createdAt: 'desc' // initial sorting
        }
      }, {
        getData: function($defer, params) {
          var page = params.page();
          var count = params.count();
          var sorting = params.sorting();
          TypeOfRa.getAllRiskLabels({ page: page, count: count, sortby: sorting }, function(response) {
            if (response.code === 200) {
              params.settings().counts = [];

              if (response.count > 18) {
                params.settings().counts.push(18);
                params.settings().counts.push(30);
              }
              if (response.count > 30) {
                params.settings().counts.push(60);
              }
              if (response.count > 60) {
                params.settings().counts.push(90);
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


    /* @function : redirectToRiskQue
     *  @author  : MadhuriK 
     *  @created  : 03-Aug-17
     *  @modified :
     *  @purpose  : To redirect to risk questions
     */
    $scope.redirectToRiskQue = function(risk_id) {
      if (risk_id) {
        var ra_id = $state.params.ra_id;
        $state.go('risk_assesment_generic.get_risk_que', { ra_id: ra_id, risk_label_id: risk_id })
      }
    }



    /* @function : getAllRiskQuestionnaire
     *  @author  : MadhuriK 
     *  @created  : 04-Aug-17
     *  @modified :
     *  @purpose  : To get all questions of selected risk label
     */
    $scope.getAllRiskQuestionnaire = function(questionnaire_name) {
      if ($state.params.risk_label_id) {
        $scope.showLoader = true;
        $scope.tableParams = new ngTableParams({
          page: 1,
          count: 5,
          sorting: {
            createdAt: 'desc' // initial sorting
          }
        }, {
          getData: function($defer, params) {
            var page = params.page();
            var count = params.count();
            var sorting = params.sorting();
            TypeOfRa.getAllRiskQuestionnaire({ page: page, count: count, sortby: sorting, questionnaire_name: questionnaire_name, risk_label_id: $state.params.risk_label_id }, function(response) {
              if (response.code === 200) {

                response.data.forEach(function(questionnair) {
                  if (questionnair.assigned_ra_id.length > 0) {
                    questionnair.assigned_ra_id.forEach(function(queId) {

                      var raID = $state.params.ra_id ? $state.params.ra_id : $state.params.individualRa_id;
                      if (queId == raID) {
                        questionnair.assign = queId;
                      }
                    })
                  }


                  questionnair.categoryArr = [];
                  questionnair.category_id.forEach(function(Category) {
                    if (Category._id == $state.params.risk_label_id) {
                      questionnair.categoryArr.push({ id: Category._id, name: Category.categoryName, selected: true });
                    } else {
                      questionnair.categoryArr.push({ id: Category._id, name: Category.categoryName, selected: false });
                    }
                  })
                })

                params.settings().counts = [];
                $timeout(function() {
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



    /* @function : redirectToQueDetails
     *  @author  : MadhuriK 
     *  @created  : 04-Aug-17
     *  @modified :
     *  @purpose  : To redirect to question details
     */
    $scope.redirectToQueDetails = function(que_id) {
      if (que_id) {
        $state.go('risk_assesment_generic.que_details', { ra_id: $state.params.ra_id, risk_label_id: $state.params.risk_label_id, que_id: que_id })
      }
    }



    /* @function : getRiskQueDetail
     *  @author  : MadhuriK 
     *  @created  : 04-Aug-17
     *  @modified :
     *  @purpose  : To get details of que
     */
    $scope.getRiskQueDetail = function() {
      if ($state.params.que_id) {
        TypeOfRa.getRiskQueDetail($state.params.que_id, function(response) {
          if (response.code == 200) {
            $scope.questionDetails = response.data;
          } else {
            $scope.questionDetails = {};
          }
        })
      }
    }



    /* @function : backToQuePage
     *  @author  : MadhuriK 
     *  @created  : 04-Aug-17
     *  @modified :
     *  @purpose  : To redirect to list question page
     */
    $scope.backToQuePage = function() {
      if ($state.params.ra_id && $state.params.risk_label_id) {
        $state.go('risk_assesment_generic.get_risk_que', { ra_id: $state.params.ra_id, risk_label_id: $state.params.risk_label_id });
      }

    }

    // to call get question details api
    if (($state.current.name == 'risk_assesment_generic.que_details') || ($state.current.name == 'risk_assesment_individual.que_details') || ($state.current.name == 'under_construction_risk_assesment_generic.que_details') || ($state.current.name == 'under_construction_risk_assesment_individual.que_details')) {
      $scope.getRiskQueDetail();
    }


    /* @function : redirectToIndiRiskQue
     *  @author  : MadhuriK 
     *  @created  : 03-Aug-17
     *  @modified :
     *  @purpose  : To redirect to risk questions of individual section
     */
    $scope.redirectToIndiRiskQue = function(risk_id) {
      if (risk_id) {
        var individualRa_id = $state.params.individualRa_id;
        $state.go('risk_assesment_individual.get_risk_que', { individualRa_id: individualRa_id, risk_label_id: risk_id })
      }
    }


    /* @function : backToQuePageOfIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 04-Aug-17
     *  @modified :
     *  @purpose  : To redirect to list question page of individual ra
     */
    $scope.backToQuePageOfIndividualRa = function() {
      if ($state.params.individualRa_id && $state.params.risk_label_id) {
        $state.go('risk_assesment_individual.get_risk_que', { individualRa_id: $state.params.ra_id, risk_label_id: $state.params.risk_label_id });
      }

    }


    /* @function : redirectToIndiQueDetails
     *  @author  : MadhuriK 
     *  @created  : 04-Aug-17
     *  @modified :
     *  @purpose  : To redirect to question details
     */
    $scope.redirectToIndiQueDetails = function(que_id) {
      if (que_id) {
        $state.go('risk_assesment_individual.que_details', { individualRa_id: $state.params.individualRa_id, risk_label_id: $state.params.risk_label_id, que_id: que_id })
      }
    }




    /* @function : saveAndSubmitLater
     *  @author  : MadhuriK 
     *  @created  : 08-Aug-17
     *  @modified :
     *  @purpose  : To save ra but not completed yet.
     */
    $scope.saveAndSubmitLater = function() {
      swal({
          title: "Are you sure?",
          text: "You want to save RA and submit later",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00acd6",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: true
        },
        function() {

          TypeOfRa.saveAndSubmitLater($window.localStorage.types_of_ra_id, function(response) {
            if (response.code == 200) {
              toaster.pop('success', "", response.message);
              $timeout(function() {
                delete $window.localStorage.types_of_ra_id;
                $rootScope.raData = [];
                $rootScope.questions = [];
                $state.go('main.list_under_construction_type_of_ra');
              }, 1000)
            }

          });

        });
    }



    /* @function : getAllUnderConstructionRA
     *  @author  : MadhuriK 
     *  @created  : 08-Aug-17
     *  @modified :
     *  @purpose  : To get all ra which are not submitted yet.
     */
    $scope.getAllUnderConstructionRA = function(keyword) {
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
          createdAt: 'desc' // initial sorting
        }
      }, {
        getData: function($defer, params) {
          var page = params.page();
          var count = params.count();
          var sorting = params.sorting();
          TypeOfRa.getAllUnderConstructionRA({ page: page, count: count, sortby: sorting, keyword: keyword }, function(response) {
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
              $scope.under_construction_search = (response.data.length > 0 || keyword) ? true : false;
              $scope.typeOfRaData = response.data;
            } else {
              toaster.pop('error', "", response.err);
            }
          });
        }
      });
    }




    /* @function : saveAndSubmitLaterIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 08-Aug-17
     *  @modified :
     *  @purpose  : To save individual ra but not submitted by master admin.
     */
    $scope.saveAndSubmitLaterIndividualRa = function() {
      swal({
          title: "Are you sure?",
          text: "You want to save RA and submit later",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00acd6",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: true
        },
        function() {
          TypeOfRa.saveAndSubmitLater($window.localStorage.individualRa_id, function(response) {
            if (response.code == 200) {
              toaster.pop('success', "", response.message);
              $timeout(function() {
                delete $window.localStorage.individualRa_id;
                $rootScope.raData = [];
                $rootScope.questions = [];
                $state.go('main.list_under_construction_type_of_ra');
              }, 1000)
            }

          });

        });
    }



    /* @function : getAllRiskLableOfQue
     *  @author  : MadhuriK 
     *  @created  : 09-Aug-17
     *  @modified :
     *  @purpose  : To search all risk labels of a question.
     */
    $scope.getAllRiskLableOfQue = function(question_name) {
      if (question_name.length > 0) {
        $scope.tableParams = new ngTableParams({
          page: 1,
          count: 18,
          sorting: {
            createdAt: 'desc' // initial sorting
          }
        }, {
          getData: function($defer, params) {
            var page = params.page();
            var count = params.count();
            var sorting = params.sorting();
            TypeOfRa.getAllRiskLableOfQue({ page: page, count: count, sortby: sorting, question_name: question_name }, function(response) {
              if (response.code === 200) {
                params.settings().counts = [];

                if (response.count > 18) {
                  params.settings().counts.push(18);
                  params.settings().counts.push(30);
                }
                if (response.count > 30) {
                  params.settings().counts.push(60);
                }
                if (response.count > 60) {
                  params.settings().counts.push(90);
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
      } else {
        $scope.getAllRiskLabels();
      }
    }



    /* @function : deleteRa
     *  @author  : MadhuriK 
     *  @created  : 08-Jun-17
     *  @modified :
     *  @purpose  : To delete types of ra
     */
    $scope.deleteRa = function(typeOfRa_id) {
      if (typeOfRa_id) {
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
          function() {
            TypeOfRa.deleteTypeOfRa(typeOfRa_id, function(response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                if ($window.localStorage.individualRa_id) {
                  delete $window.localStorage.individualRa_id;
                } else if ($window.localStorage.types_of_ra_id) {
                  delete $window.localStorage.types_of_ra_id;
                }
                $scope.getAllUnderConstructionRA();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }



    /* @function : updateUnderConstructionGenericRa
     *  @author  : MadhuriK 
     *  @created  : 11-Jun-17
     *  @modified :
     *  @purpose  : To update underconstruction generic ra
     */
    $scope.updateUnderConstructionGenericRa = function(genericRaData) {
      if (genericRaData.sector == "Select Sector") {
        toaster.pop('error', "", "Please select any sector");
      } else {
        if (genericRaData._id) {
          TypeOfRa.updateGenericRa(genericRaData, function(response) {
            if (response.code == 200) {
              toaster.pop('success', "", response.message);
              $timeout(function() {
                $state.go('under_construction_risk_assesment_generic.existing_ra', { ra_id: $window.localStorage.types_of_ra_id });
              }, 500);
            } else {
              toaster.pop('error', "", response.message);
            }
          })
        }
      }
    }


    /* @function : redirectToUnderConstructionRiskQue
     *  @author  : MadhuriK 
     *  @created  : 11-Aug-17
     *  @modified :
     *  @purpose  : To redirect to under construction risk questions
     */
    $scope.redirectToUnderConstructionRiskQue = function(risk_id) {
      if (risk_id) {
        var ra_id = $state.params.ra_id;
        $state.go('under_construction_risk_assesment_generic.get_risk_que', { ra_id: ra_id, risk_label_id: risk_id })

      }
    }


    $scope.backToStepOne = function() {
      if ($window.localStorage.types_of_ra_id || $state.params.ra_id) {
        var ra_id = $window.localStorage.types_of_ra_id ? $window.localStorage.types_of_ra_id :
          $state.params.ra_id ? $state.params.ra_id : "";
          console.log("ra_id",ra_id)
        $state.go('risk_assesment_generic.update', { ra_id: ra_id });
      }
    }

    /* @function : underConstructionQueDetails
     *  @author  : MadhuriK 
     *  @created  : 11-Aug-17
     *  @modified :
     *  @purpose  : To redirect to under construction ra question details
     */
    $scope.underConstructionQueDetails = function(que_id) {
      if (que_id) {
        $state.go('under_construction_risk_assesment_generic.que_details', { ra_id: $state.params.ra_id, risk_label_id: $state.params.risk_label_id, que_id: que_id })
      }
    }


    /* @function : backToUnderConstructionQuePage
     *  @author  : MadhuriK 
     *  @created  : 11-Aug-17
     *  @modified :
     *  @purpose  : To redirect to under construction question list page
     */
    $scope.backToUnderConstructionQuePage = function() {
      if ($state.params.ra_id && $state.params.risk_label_id) {
        $state.go('under_construction_risk_assesment_generic.get_risk_que', { ra_id: $state.params.ra_id, risk_label_id: $state.params.risk_label_id });
      }

    }



    /* @function : updateUnderConstructionIndividualRa
     *  @author  : MadhuriK 
     *  @created  : 11-Aug-17
     *  @modified :
     *  @purpose  : To update under construction individual ra.
     */
    $scope.updateUnderConstructionIndividualRa = function(raData) {
      raData.country = raData.country ? raData.country : null
      if (raData._id) {
        TypeOfRa.updateIndividualRa(raData, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $state.go('under_construction_risk_assesment_individual.existing_ra', { individualRa_id: $window.localStorage.individualRa_id });
            }, 500);
          } else {
            toaster.pop('error', "", response.message);
          }
        })
      }
    }


    /* @function : redirectToUnderConstructionIndiRiskQue
     *  @author  : MadhuriK 
     *  @created  : 11-Aug-17
     *  @modified :
     *  @purpose  : To redirect to risk questions of under construction individual section
     */
    $scope.redirectToUnderConstructionIndiRiskQue = function(risk_id) {
      if (risk_id) {
        var individualRa_id = $state.params.individualRa_id;
        $state.go('under_construction_risk_assesment_individual.get_risk_que', { individualRa_id: individualRa_id, risk_label_id: risk_id })
      }
    }


    /* @function : underConstructionIndiQueDetails
     *  @author  : MadhuriK 
     *  @created  : 11-Aug-17
     *  @modified :
     *  @purpose  : To redirect to under construction ra question details
     */
    $scope.underConstructionIndiQueDetails = function(que_id) {
      if (que_id) {
        $state.go('under_construction_risk_assesment_individual.que_details', { individualRa_id: $state.params.individualRa_id, risk_label_id: $state.params.risk_label_id, que_id: que_id })
      }
    }



    /* @function : backToUnderConstructionIndiQuePage
     *  @author  : MadhuriK 
     *  @created  : 11-Aug-17
     *  @modified :
     *  @purpose  : To redirect to under construction question list page
     */
    $scope.backToUnderConstructionIndiQuePage = function() {
      if ($state.params.individualRa_id && $state.params.risk_label_id) {
        $state.go('under_construction_risk_assesment_individual.get_risk_que', { individualRa_id: $state.params.individualRa_id, risk_label_id: $state.params.risk_label_id });
      }

    }
    

    $scope.backToIndividualStep1 = function() {
      if ($window.localStorage.individualRa_id || $state.params.individualRa_id) {
        var ra_id = $window.localStorage.individualRa_id ? $window.localStorage.individualRa_id :
          $state.params.individualRa_id ? $state.params.individualRa_id : "";
        $state.go('risk_assesment_individual.update', { individualRa_id: ra_id });
      } 
    }

  });
