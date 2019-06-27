'use strict';

angular.module('country_risk_level', ['ui.router', 'angularUtils.directives.dirPagination'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.country_risk_level', {
        url: '/update/country_risk_level',
        templateUrl: 'modules/country_risk_level/views/country_risk_level.html',
        controller: 'countryRiskLevelCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.country_threat_matrix', {
        url: '/country/threat_matrix',
        templateUrl: 'modules/country_risk_level/views/country_threat_matrix.html',
        controller: 'countryRiskLevelCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.country_list', {
        url: '/country/countrylist/:keyword',
        templateUrl: 'modules/country_risk_level/views/country_list.html',
        controller: 'countryRiskLevelCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.view_country', {
        url: '/view/country/:country_id',
        templateUrl: 'modules/country_risk_level/views/view_country.html',
        controller: 'countryRiskLevelCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.add_information', {
        url: '/view/country',
        templateUrl: 'modules/country_risk_level/views/add_info.html',
        controller: 'countryRiskLevelCtrl',
        parent: 'main',
        authenticate: true
      })
  })
  .controller('countryRiskLevelCtrl', ['$scope', 'toaster', '$timeout', 'CountryRiskLevel', 'ngTableParams', '$state', '$window', '$stateParams', function($scope, toaster, $timeout, CountryRiskLevel, ngTableParams, $state, $window, $stateParams) {


    /* @function : countryRiskLevel
     *  @author  : MadhuriK 
     *  @created  : 24-May-17
     *  @modified :
     *  @purpose  : To get all country risk level of a news agency.
     */
    $scope.countryRiskLevelForAllAgencies = function() {
      $scope.showLoader = true;
      CountryRiskLevel.countryRiskLevelForAllAgencies(function(response) {
        if (response.code == 200) {
          $scope.showLoader = false;
          $scope.countryArr = response.data;
          $scope.countryArrCopy = angular.copy($scope.countryArr);
        } else {
          $scope.showLoader = false;
          $scope.countryArr = [];
        }
      })
    }


    /* @function : editCountry
     *  @author  : MadhuriK 
     *  @created  : 25-May-17
     *  @modified :
     *  @purpose  : To inline edit country specific information.
     */
    $scope.editing = false;
    $scope.editCountry = function(countryData) {
      $scope.editing = true;
      $scope.countryId = countryData._id;

    }

    /* @function : saveCountryColorForAllNewsAgency
     *  @author  : MadhuriK 
     *  @created  : 24-May-17
     *  @modified :
     *  @purpose  : To save country color for all news agency.
     */
    $scope.saveCountryColorForAllNewsAgency = function(countryData) {
      if (countryData[Object.keys(countryData)[1]] != false) {
        countryData.checked = true;
      } else {
        countryData.color = "";
        countryData.checked = false;
      }
      CountryRiskLevel.saveCountryColorForAllNewsAgency(countryData, function(response) {
        if (response.code == 200) {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('success', "", response.message);
        } else {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('error', "", response.err);
        }
      })

    }


    /* @function : countrySpecificInfoForAllAgency
     *  @author  : MadhuriK 
     *  @created  : 25-May-17
     *  @modified :
     *  @purpose  : To save country specific information.
     */
    $scope.countrySpecificInfoForAllAgency = function(countryData) {
      if (countryData) {
        CountryRiskLevel.countrySpecificInfoForAllAgency(countryData, function(response) {
          if (response.code == 200) {
            $scope.editing = false;
            $scope.toasters.splice(toaster.id, 1);
            toaster.pop('success', "", response.message);
          } else {
            $scope.toasters.splice(toaster.id, 1);
            toaster.pop('error', "", response.err);
          }
        })
      }
    }



    /* @function : getCountriesForThreatMatrix
     *  @author  : MadhuriK 
     *  @created  : 22-Jun-17
     *  @modified :
     *  @purpose  : To save country specific information.
     */
    $scope.getCountriesForThreatMatrix = function() {
      $scope.showLoader = true;
      CountryRiskLevel.getCountriesForThreatMatrix(function(response) {
        if (response.code === 200) {
          $scope.showLoader = false;
          response.data.forEach(function(newData) {
            newData.arr = [];
            response.country_threat_matrix.forEach(function(countryThreatMatrix) {

          response.riskcategory.forEach(function(riskcatresul){

            if(riskcatresul._id == countryThreatMatrix.category_id){
            
              if (countryThreatMatrix.countryname == newData.name) {
                newData.arr.push({
                  appropriate_risk: countryThreatMatrix.country_risk,
                  category_name: countryThreatMatrix.category_name
                });
              }
            }
            })
            })
          })
          $scope.countryArr = response.data;
          $scope.countryThreatMatrixArrCopy = angular.copy($scope.countryArr);
        } else {
          $scope.showLoader = false;
          toaster.pop('error', "", response.err);
        }
      })
    }


    /* @function : getAllCategoryList
     *  @author  : MadhuriK 
     *  @created  : 22-Jun-17
     *  @modified :
     *  @purpose  : To save country specific information.
     */
    $scope.getAllCategoryList = function() {
      CountryRiskLevel.getAllCategoryList(function(response) {
        if (response.code == 200) {
          $scope.categoryArr = response.data;
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }


    /* @function : filterCountryThreatMatrix
     *  @author  : MadhuriK 
     *  @created  : 22-Jun-17
     *  @modified :
     *  @purpose  : To get filter country matrix list.
     */
    $scope.filterCountryThreatMatrix = function(country_name) {
      if (country_name.length > 0) {
        country_name = country_name.toLowerCase();
        // $scope.countryArr = _.filter($scope.countryArr, function (country) {
        //     return country['name'].toLowerCase().startsWith(country_name);
        // });
        var dataArr = [];
        $scope.countryThreatMatrixArrCopy.forEach(function(country) {
          if (country['name'].toLowerCase().startsWith(country_name)) {
            dataArr.push(country);
          }
        })

        $scope.countryArr = dataArr;
      } else {
        $scope.getCountriesForThreatMatrix();
      }
    }


    /* @function : getRiskBycategory
     *  @author  : MadhuriK 
     *  @created  : 22-Jun-17
     *  @modified :
     *  @purpose  : To check selected level of country threat matrix (high,medium,low).
     */
    $scope.getRiskBycategory = function(catname, countryarray, rating) {
      var data = countryarray.arr.filter(function(item) {
        return item.category_name == catname;
      });
      var newData = data.length > 0 ? data[0].appropriate_risk : null;
      if (newData == rating) {
        return true;
      } else {
        return false;
      }
    }

    /* @function : saveCountryThreatMatrix
     *  @author  : MadhuriK 
     *  @created  : 22-Jun-17
     *  @modified :
     *  @purpose  : To save country treat matrix.
     */
    $scope.country = {};
    $scope.saveCountryThreatMatrix = function(data, cat, $index) {
      if (data.arr.length > 0) {
        angular.forEach(data.arr, function(value, key) {
          if (value.category_name == cat.categoryName) {
            value.appropriate_risk = data[$index].appropriate_risk;
          }
        })
      }
      var arr = {};
      if (data[$index].appropriate_risk) {
        arr = {
          country_risk: data[$index].appropriate_risk,
          countryname: data.name,
          category_id: cat._id,
          category_name: cat.categoryName,
        }
      }
      if (arr) {
        console.log(arr)
        CountryRiskLevel.saveCountryThreatMatrix(arr, function(response) {
          if (response.code == 200) {
            $scope.toasters.splice(toaster.id, 1);
            toaster.pop('success', "", response.message);
          } else {
            $scope.toasters.splice(toaster.id, 1);
            toaster.pop('error', "", response.err);
          }
        })
      }
    }


    /* @function : locationChangeStart
     *  @author   : MadhuriK 
     *  @created  : 04-July-17
     *  @modified :
     *  @purpose  : Ask user for saving data before changing page.
     */
    $scope.refreshFlag = true;
    $scope.$on('$stateChangeStart', function(e) {
      var formData = $scope.postJobForm ? $scope.postJobForm.$pristine : true;
      if ($scope.refreshFlag && !formData) {
        var answer = confirm("Are you sure you want to leave this page without saving data?")
        if (!answer) {
          e.preventDefault();
        }
      }
    })



    $scope.pageChangeHandler = function(page) {
      // console.log("page", page);
      // $scope.page = page !== 1 ? page : ;
      if (page > 1) {
        $scope.page = page;
      }
    }


    /* @function : getCountryList
     *  @author  : MadhuriK 
     *  @created  : 12-Jun-17
     *  @modified :
     *  @purpose  : To get country list.
     */
    $scope.getCountryList = function(keyword) {
      CountryRiskLevel.getCountryList(function(response) {
        console.log("fd");
        if (response.code === 200) {
          var dataArr = [];
          response.data.forEach(function(country) {
            var display_name = country.name + ' (' + country.code + ')';
            if (dataArr.indexOf(country.name.slice(0, 1)) == -1 && (country.name.slice(0, 1) !== 'Å')) {
              dataArr.push(country.name.slice(0, 1));
              dataArr.push({ name: country.name, _id: country._id, code: country.code, display_name: display_name });
            } else if (country.name) {
              dataArr.push({ name: country.name, _id: country._id, code: country.code, display_name: display_name });
            }
          })
          $scope.countryArr = dataArr;
          if ($stateParams.keyword) {
            var country_name = $stateParams.keyword.toLowerCase();
            $scope.countryArr = _.filter($scope.countryArr, function(country) {
              if (country.name) {
                return country['name'].toLowerCase().startsWith(country_name);
              }
            });
          }
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }

    /* @function : filterCountry
     *  @author  : MadhuriK 
     *  @created  : 21-Jun-17
     *  @modified :
     *  @purpose  : To get filter country list.
     */
    $scope.filterCountry = function(country_name) {
      $stateParams.keyword = country_name
      $scope.keyword = country_name;
      if (country_name.length > 0) {
        country_name = country_name.toLowerCase();
        $scope.countryArr = _.filter($scope.countryArr, function(country) {
          // return country.name == country_name;
          if (country.name) {
            return country['name'].toLowerCase().startsWith(country_name);
          }
        });
      } else {
        $scope.getCountryList();
      }
    }
    $scope.acb = $stateParams.keyword && $scope.filterCountry($stateParams.keyword) || '';



    /* @function : getCountryThreatMatrix
     *  @author  : MadhuriK 
     *  @created  : 13-Jun-17
     *  @modified :
     *  @purpose  : To get country threat matrix.
     */

    $scope.series = ['High', 'Medium', 'Low'];
    $scope.getCountryThreatMatrix = function() {
      $scope.showLoader = true;
      var country_id = $state.params.country_id;
      console.log("country_idsss", country_id)
      if (country_id) {
        var countryObj = {country: [country_id]}
        CountryRiskLevel.getCountryThreatMatrix(countryObj, function(response) {
          if (response.code == 200) {
            $scope.showLoader = false;
           
            if (response.countryObj) {
              $scope.countryObj = response.countryObj[0];
              var countryDescription = $scope.countryObj.description;
              var countrySecurity = $scope.countryObj.security;
              $scope.countryDescriptionarray = countryDescription;
              $scope.countrySecurityarray = countrySecurity;
            } else {
              $scope.countryDescriptionarray = 'No Data Available';
              $scope.countrySecurityarray = 'No Data Available';
            }
            
            $scope.data = [];
            $scope.colors = [{ fillColor: [] }];
            var data = [],
              colors = [];
            $scope.country = $scope.countryObj.country_id;
            $scope.country.color = $scope.country.color ? $scope.country.color.replace(/'/g, '') : "";
            if ($scope.countryObj.threatMatrix.length > 0) {
              $scope.countryObj.threatMatrix.forEach(function(threatMatrix) {
                var index = $scope.labels.indexOf(threatMatrix.category_name);
                if (threatMatrix.country_risk == 'High') {
                  data[index] = 150;
                  $scope.colors[0].fillColor[index] = '#FF0000';
                } else if (threatMatrix.country_risk == 'Medium') {
                  data[index] = 100;
                  $scope.colors[0].fillColor[index] = '#FFC200';
                } else if (threatMatrix.country_risk == 'Low') {
                  data[index] = 50;
                  $scope.colors[0].fillColor[index] = '#008000';
                }
              })
              $scope.data.push(data);

            } else {
              data.push(0, 0, 0, 0, 0, 0, 0, 0, 0)
              $scope.data.push(data);
            }

          } else {
            toaster.pop('error', "", "Somthing went wrong");
          }
        })
      }
    }



    /* @function : getCategoriesList
     *  @author  : MadhuriK 
     *  @created  : 13-Jun-17
     *  @modified :
     *  @purpose  : To get category list.
     */
    $scope.getCategoriesList = function() {
      CountryRiskLevel.getCategoriesList(function(response) {
        if (response.code == 200) {
          var series = [];
          if (response.data.length > 0) {
            response.data.forEach(function(catObj) {
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

    $scope.addInformation = function(countryinformation) {
      var countryinfo = {}
      countryinfo.country = countryinformation.country;
      countryinfo.info = countryinformation.information;
      CountryRiskLevel.addInformation(countryinfo, function(response) {
        if (response.code === 200) {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('success', "", response.message);
          $timeout(function() {
            $state.go('main.dashboard')
          }, 500);
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }

    $scope.filter = function(country_name) {
      $scope.keyword = country_name;
      $state.go('main.country_list', { keyword: $scope.keyword }, { reload: true })

    }

    var str = "abcdefghijklmnopqrstuvwxyz";
    $scope.alphabet = str.toUpperCase().split("");
    $scope.activeLetter = '';
    $scope.activateLetter = function(letter) {
      $scope.activeLetter = letter
      $state.go('main.country_list', { keyword: $scope.activeLetter }, { reload: true })
    }


  }]);
