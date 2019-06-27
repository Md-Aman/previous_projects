'use strict';

angular.module('superadmin', ['ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    //'ngAnimate',
    'restangular',
    'mgcrea.ngStrap',
    'ui.router',
    'ui.footable',
    'ui.select',
    'ngTable',
    'toaster',
    'ngFileUpload',
    'underscore',
    //   'ngMap',
    'daterangepicker',
    'isteven-multi-select',
    'alexjoffroy.angular-loaders',
    'superadmin.modules',
    'chart.js',
    'internationalPhoneNumber',
    'kendo.directives',
    'ui.tinymce',
    'ngIdle',
  ]).config(["KeepaliveProvider", "IdleProvider",
    function(KeepaliveProvider, IdleProvider) {
      IdleProvider.idle(3600);
      IdleProvider.timeout(5);
      KeepaliveProvider.interval(10);
    }
  ])
  .run(function($rootScope, Idle, $window, $location) {
    Idle.watch();
    $rootScope.$on('IdleStart', function() {
      /* Display modal warning or sth */
      var
        closeInSeconds = 5,
        displayText = "you will be automatically logged out  in #1 seconds.",
        timer;
      swal({
        title: "No activity found!",
        allowOutsideClick: true,
        text: displayText.replace(/#1/, closeInSeconds),
        timer: closeInSeconds * 1000,
        showConfirmButton: false
      });

      timer = setInterval(function() {

        closeInSeconds--;

        if (closeInSeconds < 0) {

          clearInterval(timer);
        }

        $('.sweet-alert > p').text(displayText.replace(/#1/, closeInSeconds));

      }, 1000);
    });
    $rootScope.$on('IdleTimeout', function() {
      $rootScope.superAdminLogout();
      swal.close();
    });
  })
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, uiSelectConfig) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(false);
    uiSelectConfig.theme = 'bootstrap';
  })

  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  }).filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })


  


  .directive('fileModel', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        element.bind('change', function() {
          scope.$apply(function() {
            modelSetter(scope, element[0].files);
          });
        });
      }
    };
  }]);

  