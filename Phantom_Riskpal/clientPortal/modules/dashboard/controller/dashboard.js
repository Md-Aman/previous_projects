'use strict';

angular.module('dashboard', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main.dashboard', {
                url: '/dashboard',
                templateUrl: 'modules/dashboard/views/dashboard.html',
                controller: 'DashboardCtrl',
                parent: 'main',
                authenticate: true,
                
            
               
            })
            .state('main.authy', {
                url: '/analytics/authy',
                templateUrl: 'modules/dashboard/views/authy.html',
                controller: 'DashboardCtrl',
                parent: 'main',
                authenticate: true
              })
            .state('main.accessrestricted', {
                url: "/",
                templateUrl: "modules/404.html"
               
            });
            

        // $urlRouterProvider.when('/', '/main/dashboard');
    })

 
    .controller('DashboardCtrl', function ($scope, toaster, $timeout, Dashboard) {


        /* @function : getClientCount
         *  @author  : MadhuriK 
         *  @created  : 29-May-17
         *  @modified :
         *  @purpose  : To get client count.
         */
        $scope.getClientCount = function () {
            Dashboard.getClientCount(function (response) {
                if (response.code == 200) {
                    $scope.clientCount = response.data ? response.data : 0;
                } else {
                    $scope.clientCount = {};
                }
            })
        }

         /* @function : getAllTypeOfRa
       *  @author  : MadhuriK 
       *  @created  : 09-Jun-17
       *  @modified :
       *  @purpose  : To get all type of RAs.
       */
      $scope.getAllTypeOfRa = function () {

        Dashboard.getAllTypeOfRa(function (response) {

            if (response.code === 200) {
                $scope.typeOfRaArr = response.data;
            } else {
                $scope.typeOfRaArr = [];
            }
        })
    }

    });

