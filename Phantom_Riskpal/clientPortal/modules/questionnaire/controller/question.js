'use strict';

angular.module('question', ['ui.router', 'ui.sortable'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.add_questionnaire', {
                url: '/add/question',
                templateUrl: 'modules/questionnaire/views/add_questionnaire.html',
                controller: 'QuestionCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.list_questionnaire', {
                url: '/list/question',
                templateUrl: 'modules/questionnaire/views/list_questionnaire.html',
                controller: 'QuestionCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.update_questionnaire', {
                url: '/update/question/:questionnaire_id',
                templateUrl: 'modules/questionnaire/views/update_questionnaire.html',
                controller: 'QuestionCtrl',
                parent: 'main',
                authenticate: true
            })
    })

    .controller('QuestionCtrl', ['$scope', '$location', 'Question', 'ngTableParams', '$state', 'toaster', '$timeout','$window', function ($scope, $location, Question, ngTableParams, $state, toaster, $timeout,$window) {

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
                            $state.go('main.list_questionnaire');
                        }, 500);
                    } else {
                        toaster.pop('error', "", response.err);
                    }
                })
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
                        if(localStorage.super_admin == "true"){
                            var super_admin=true;
                          
                             var client_id='';
                          }else{
                             
                            super_admin=false;
                            client_id=$window.localStorage.logclient_id;
                              
                          }


                        Question.getAllQuestionnaire({ page: page, count: count, sortby: sorting, questionnaire_name: questionnaire_name,super_admin:super_admin,client_id:client_id }, function (response) {
                            if (response.code === 200) {

                                response.data.forEach(function (questionnair) {
                                    questionnair.categoryArr = [];
                                    questionnair.category_id.forEach(function (Category) {
                                        questionnair.categoryArr.push(Category.categoryName);
                                    })
                                })

                                params.settings().counts = [];

                                if (response.count > 5) {
                                    params.settings().counts.push(5);
                                    params.settings().counts.push(10);
                                }else if (response.count > 10) {
                                    params.settings().counts.push(25);
                                }else if (response.count > 25) {
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



        /* @function : sortableOptions
        *  @author  : MadhuriK 
        *  @created  : 27-Mar-17
        *  @modified :
        *  @purpose  : To chang order of questionnair.
        */
        $scope.sortingLog = [];
        $scope.sortableOptions = {
            update: function (e, ui) {
                var logEntry = $scope.data.map(function (i, index) {
                    return i;
                }).join(', ');
                $scope.sortingLog.push('Update: ' + logEntry);
            },
            stop: function (e, ui) {
                // this callback has the changed model
                var logEntry = $scope.data.map(function (i, index) {
                    if (i.order !== index + 1) {
                        i.order = index + 1;
                        Question.changeOrderOfQuestion(i, function (response) {
                            if (response.code == 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                            } else {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('error', "", response.err);
                            }
                        })
                    }
                    return i;
                }).join(', ');
                $scope.sortingLog.push('Stop: ' + logEntry);
            }

        };


        /* @function : deleteQuestionnair
         *  @author  : MadhuriK 
         *  @created  : 27-Mar-17
         *  @modified :
         *  @purpose  : To delete selected questionnair.
         */
        $scope.deleteQuestionnaire = function (questionnaire_id) {
            if (questionnaire_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to delete selected question?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        Question.deleteQuestionnair(questionnaire_id, function (response) {
                            if (response.code === 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                                $scope.getAllQuestionnaire();
                            } else {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('error', "", response.err);
                            }

                        });
                    });
            }

        }


        /* @function : getQuestionnairDetail
         *  @author  : MadhuriK 
         *  @created  : 27-Mar-17
         *  @modified :
         *  @purpose  : To get details of questionnair.
         */
        $scope.getQuestionnairDetail = function () {
            var questionnair_id = $state.params.questionnaire_id;
            Question.getQuestionnairDetail(questionnair_id, function (response) {
                if (response.code === 200) {
                    var question={};
            if(localStorage.super_admin == "true"){
                question. super_admin=true;
              
                question. client_id='';
              }else{
                 
                question.super_admin=false;
                question.client_id=$window.localStorage.logclient_id;
                  
              }
                    Question.getCategories(question, function (result) {
                        if (response.code === 200) {
                            $scope.categoryArr = result.data;
                            $scope.categoryArr.forEach(function (category) {
                                response.data.category_id.forEach(function (categoryId) {
                                    if (categoryId._id == category._id) {
                                        category.ticked = true;
                                    }
                                })
                            })
                        }
                    })
                    $scope.getEditorData();
                    $scope.questionnaire = response.data;
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }



        /* @function : updateQuestionnaire
         *  @author  : MadhuriK 
         *  @created  : 27-Mar-17
         *  @modified :
         *  @purpose  : To update questionnair.
         */
        $scope.updateQuestionnaire = function (questionnaire) {
            Question.updateQuestionnaire(questionnaire, function (response) {
                if (response.code === 200) {
                    toaster.pop('success', "", response.message);
                    $timeout(function () {
                        $state.go('main.list_questionnaire');
                    }, 500);
                } else {
                    toaster.pop('error', "", response.err);
                }

            })
        }


        /* @function : changeQuestionnaireStatus
        *  @author  : MadhuriK 
        *  @created  : 27-Mar-17
        *  @modified :
        *  @purpose  : To change questionnaire status.
        */
        $scope.changeQuestionnaireStatus = function (questionnaire_status, questionnaire_id) {
            var questionnaireStatus = questionnaire_status == 'Active' ? 'Inactive' : 'Active';
            if (questionnaire_status && questionnaire_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to " + questionnaireStatus + " selected question?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        var questionnaire = {};
                        questionnaire.id = questionnaire_id;
                        questionnaire.status = questionnaireStatus;
                        Question.changeQuestionnaireStatus(questionnaire, function (response) {
                            if (response.code === 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                                $scope.getAllQuestionnaire();
                            } else {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('error', "", response.err);
                            }

                        });
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


        /* @function : redirectToAddQues
         *  @author  : MadhuriK 
         *  @created  : 09-Jun-17
         *  @modified :
         *  @purpose  : To redirect from list questions to add question with category id.
         */
        $scope.redirectToAddQues = function () {
            var category_id = $state.params.category_id;
            $state.go('main.add_questionnaire', { category_id: category_id });
        }


        $scope.redirectToUpdateQues = function (questionId) {
            var category_id = $state.params.category_id;
            $state.go('main.update_questionnaire', { category_id: category_id, questionnaire_id: questionId });
        }



        /* @function : getAllRa
        *  @author  : MadhuriK 
        *  @created  : 22-Jun-17
        *  @modified :
        *  @purpose  : To get all ra
        */
        $scope.getAllRa = function () {
            Question.getAllRa(function (response) {
                if (response.code == 200) {
                    $scope.typeOfRas = response.data;
                } else {
                    $scope.typeOfRas = {};
                }
            })
        }


        /* @function : getRaCategories
        *  @author  : MadhuriK 
        *  @created  : 22-Jun-17
        *  @modified :
        *  @purpose  : To categories of selected ra
        */
        
        // $scope.showCate = false;
        // $scope.getRaCategories = function (typeOfRaId) {
        //     if (typeOfRaId && typeOfRaId !== 'Select Type Of RA') {
        //         Question.getRaCategories(typeOfRaId, function (response) {
        //             if (response.code == 200) {
        //                 $scope.showCate = true;
        //                 $scope.categoryArr = response.data;
        //             } else {
        //                 $scope.categoryArr = {};
        //             }
        //         })
        //     } else {
        //         $scope.showCate = false;
        //         toaster.pop('error', "", "Please select type of risk assisment");
        //     }
        // }


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

                                    params.settings().counts = [];

                                    if (response.count > 5) {
                                        params.settings().counts.push(5);
                                        params.settings().counts.push(10);
                                    }else if (response.count > 10) {
                                        params.settings().counts.push(25);
                                    }else if (response.count > 25) {
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


    }]);