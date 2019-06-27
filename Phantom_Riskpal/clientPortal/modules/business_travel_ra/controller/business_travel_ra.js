'use strict';

angular.module('business_travel_ra', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main.list_biz_categories', {
                url: '/list/business_travel/categories',
                templateUrl: 'modules/business_travel_ra/views/list_biz_categories.html',
                controller: 'businessTravelRaCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.add_biz_categories', {
                url: '/add/business_travel/categories',
                templateUrl: 'modules/business_travel_ra/views/add_biz_categories.html',
                controller: 'businessTravelRaCtrl',
                parent: 'main',
                authenticate: true
            })
            // .state('main.update_categories', {
            //     url: '/update/categories/:category_id',
            //     templateUrl: 'modules/business_travel_ra/views/update_categories.html',
            //     controller: 'businessTravelRaCtrl',
            //     parent: 'main',
            //     authenticate: true
            // })
            .state('main.list_biz_questionnaire', {
                url: '/list/business_travel/questionnaire',
                templateUrl: 'modules/business_travel_ra/views/list_biz_questionnaire.html',
                controller: 'businessTravelRaCtrl',
                parent: 'main',
                authenticate: true
            })
        // .state('main.add_questionnaire', {
        //     url: '/add/questionnaire',
        //     templateUrl: 'modules/business_travel_ra/views/add_questionnaire.html',
        //     controller: 'businessTravelRaCtrl',
        //     parent: 'main',
        //     authenticate: true
        // })
        // .state('main.update_questionnaire', {
        //     url: '/update/questionnaire/:questionnaire_id',
        //     templateUrl: 'modules/business_travel_ra/views/update_questionnaire.html',
        //     controller: 'businessTravelRaCtrl',
        //     parent: 'main',
        //     authenticate: true
        // })
    })
    .controller('businessTravelRaCtrl', function ($scope, toaster, $timeout, BusinessTravelRa, ngTableParams, $state, $window) {


        /* @function : getCountriesName
         *  @author  : MadhuriK 
         *  @created  : 25-May-17
         *  @modified :
         *  @purpose  : To get all countries.
         */
        $scope.getCountriesName = function () {
            BusinessTravelRa.getCountriesName(function (response) {
                if (response.code == 200) {
                    $scope.countryArr = response.data;
                } else {
                    $scope.countryArr = [];
                }
            })

        }


        /* @function : addBizTravelCategory
         *  @author  : MadhuriK 
         *  @created  : 08-Jun-17
         *  @modified :
         *  @purpose  : To add category for business travel ra.
         */
        $scope.addBizTravelCategory = function (category) {
            if (category) {
                BusinessTravelRa.addBizTravelCategory(category, function (response) {
                    if (response.code == 200) {
                        toaster.pop('success', "", response.message);
                        $timeout(function () {
                            $state.go('main.list_biz_categories');
                        }, 500);
                    } else {
                        toaster.pop('error', "", response.err);
                    }
                })
            }
        }


        /* @function : getAllBizCategories
       *  @author  : MadhuriK 
       *  @created  : 26-May-17
       *  @modified :
       *  @purpose  : To get all categories.
       */
        $scope.getAllBizCategories = function (category_name) {
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
                        BusinessTravelRa.getAllBizCategories({ page: page, count: count, sortby: sorting, category_name: category_name }, function (response) {
                            if (response.code === 200) {
                                params.total(response.count);
                                $defer.resolve(response.data);
                                response.data.forEach(function (catObj) {
                                    catObj.countryArr = [];
                                    catObj.country.forEach(function (countryObj) {
                                        catObj.countryArr.push(countryObj.name);
                                    })
                                })
                                $scope.categories = response.data;
                            } else {
                                toaster.pop('error', "", response.err);
                            }
                        });
                    }
                });
        }


    });