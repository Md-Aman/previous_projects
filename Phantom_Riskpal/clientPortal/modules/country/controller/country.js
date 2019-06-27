'use strict';

angular.module('country', ['ui.router', 'angularUtils.directives.dirPagination'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.list_country', {
        url: '/country/list',
        templateUrl: 'modules/country/views/list_country.html',
        controller: 'CountryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.risk_associated_country', {
        url: '/country/risk',
        templateUrl: 'modules/country/views/risk_associated_country.html',
        controller: 'CountryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.country_list1', {
        url: '/country/countrylist/:keyword',
        templateUrl: 'modules/country/views/country_list.html',
        controller: 'CountryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.view_country1', {
        url: '/view/country/:country_id',
        templateUrl: 'modules/country/views/view_country.html',
        controller: 'CountryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.add_information1', {
        url: '/view/country',
        templateUrl: 'modules/country/views/add_info.html',
        controller: 'CountryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.country_matrix_logs', {
        url: '/view/country_matrix_logs',
        templateUrl: 'modules/country/views/country_matrix_logs.html',
        controller: 'CountryCtrl',
        parent: 'main',
        authenticate: true
      })
  })
  .controller('CountryCtrl', ['$scope', '$location', 'Country', '$state', 'toaster', '$timeout', '_', '$stateParams', '$rootScope', 'ngTableParams', '$filter', function ($scope, $location, Country, $state, toaster, $timeout, _, $stateParams, $rootScope, ngTableParams, $filter) {
    /* @function : getAllCountries
     *  @author  : MadhuriK 
     *  @created  : 05-Apr-17
     *  @modified :
     *  @purpose  : To get all the country list.
     */
    var countryArrs = [];

    $scope.getAllCountries = function () {
      $scope.showLoader = true;
      Country.getAllCountries(function (response) {
        if (response.code === 200) {
          $scope.showLoader = false;
          if (response.country_risk.length > 0) {
            response.data.forEach(function (countryData) {
              response.country_risk.forEach(function (countryRiskData) {

                if (countryData._id == countryRiskData.country_id) {
                  countryData.specific_info = countryRiskData.specific_info;
                  countryData.color = countryRiskData.color;
                }
              })
            })
          }
          $scope.countryArr = response.data;
          angular.copy($scope.countryArr, countryArrs);
        } else {
          $scope.showLoader = false;
          toaster.pop('error', "", response.err);
        }
      })
    }



    /* @function : getAllCategories
     *  @author  : MadhuriK 
     *  @created  : 06-Apr-17
     *  @modified :
     *  @purpose  : To inline edit country specific information.
     */
    $scope.editing = false;
    $scope.editCountry = function (countryData) {
      $scope.editing = true;
      $scope.countryId = countryData._id;

    }

    /* @function : saveCountrySpecificInfo
     *  @author  : MadhuriK 
     *  @created  : 06-Apr-17
     *  @modified :
     *  @purpose  : To save country specific information.
     */
    $scope.saveCountrySpecificInfo = function (countryData) {
      if (countryData) {
        Country.saveCountrySpecificInfo(countryData, function (response) {
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


    /* @function : saveCountryColor
     *  @author  : MadhuriK 
     *  @created  : 06-Apr-17
     *  @modified :
     *  @purpose  : To save country color.
     */
    $scope.saveCountryColor = function (countryData) {
      if (countryData[Object.keys(countryData)[1]] != false) {
        countryData.checked = true;
      } else {
        countryData.color = "";
        countryData.checked = false;
      }

      Country.saveCountryColor(countryData, function (response) {
        if (response.code == 200) {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('success', "", response.message);
        } else {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('error', "", response.err);
        }
      })

    }


    /* @function : getAllCategories
     *  @author  : MadhuriK 
     *  @created  : 06-Apr-17
     *  @modified :
     *  @purpose  : To get all categories.
     */
    $scope.getAllCategories = function () {
      Country.getAllCategories(function (response) {
        if (response.code == 200) {
          $scope.categoryArr = response.data;
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }


    /* @function : filterCountry
     *  @author  : MadhuriK 
     *  @created  : 10-Apr-17
     *  @modified :
     *  @purpose  : To get filter country list.
     */

    $scope.filter = function (country_name) {
      $scope.keyword = country_name;
      $state.go('main.country_list', { keyword: $scope.keyword }, { reload: true })
      // if (country_name.length > 0) {
      //     country_name = country_name.toLowerCase();
      //     $scope.countryArr = _.filter($scope.countryArr, function (country) {
      //         // return country.name == country_name;
      //         return country['name'].toLowerCase().startsWith(country_name);
      //     });
      // } else {
      //     $scope.countryArr = countryArrs;
      // }
    }

    /* @function : getCountriesForThreatMatrix
     *  @author  : MadhuriK 
     *  @created  : 30-May-17
     *  @modified :
     *  @purpose  : To get country list for country treat matrix.
     */
    $scope.getCountriesForThreatMatrix = function () {
      $scope.showLoader = true;
      Country.getCountriesForThreatMatrix(function (response) {
        if (response.code === 200) {
          $scope.showLoader = false;
          response.data.forEach(function (newData) {
            newData.arr = [];
            response.country_threat_matrix.forEach(function (countryThreatMatrix) {

              if (countryThreatMatrix.countryname == newData.name) {
                newData.arr.push({
                  appropriate_risk: countryThreatMatrix.country_risk,
                  category_name: countryThreatMatrix.category_name
                });
              }
            })
          })
          $scope.countryArr = response.data;
        } else {
          $scope.showLoader = false;
          toaster.pop('error', "", response.err);
        }
      })
    }


    $scope.getRiskBycategory = function (catname, countryarray, rating) {
      var data = countryarray.arr.filter(function (item) {
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
     *  @created  : 30-May-17
     *  @modified :
     *  @purpose  : To save country treat matrix.
     */
    $scope.country = {};
    $scope.saveCountryThreatMatrix = function (data, cat, $index) {
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
        Country.saveCountryThreatMatrix(arr, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
          } else {
            toaster.pop('error', "", response.err);
          }
        })
      }
    }



    /* @function : filterCountryThreatMatrix
     *  @author  : MadhuriK 
     *  @created  : 30-May-17
     *  @modified :
     *  @purpose  : To get filter country matrix list.
     */

    $scope.filterCountryThreatMatrix = function (country_name) {
      if (country_name.length > 0) {
        country_name = country_name.toLowerCase();
        $scope.countryArr = _.filter($scope.countryArr, function (country) {
          return country['name'].toLowerCase().startsWith(country_name);
        });
      } else {
        $scope.getCountriesForThreatMatrix();
      }
    }


    /* @function : getCountryList
     *  @author  : MadhuriK 
     *  @created  : 12-Jun-17
     *  @modified :
     *  @purpose  : To get country list.
     */
    $scope.getCountryList = function (keyword) {
      $scope.showLoader = true;
      Country.getCountryList(function (response) {
        if (response.code === 200) {
          $scope.showLoader = false;
          var dataArr = [];
          response.data.forEach(function (country) {
            var display_name = country.name + ' (' + country.code + ')';
            if (dataArr.indexOf(country.name.slice(0, 1)) == -1 && (country.name.slice(0, 1) !== 'Å')) {
              dataArr.push(country.name.slice(0, 1));
              dataArr.push({ name: country.name, _id: country._id, code: country.code, display_name: display_name });
            } else if (country.name) {
              dataArr.push({ name: country.name, _id: country._id, code: country.code, display_name: display_name });
            }
          })
          $scope.countryArr = dataArr;
          var country_name = $stateParams.keyword.toLowerCase();
          console.log(">>>>>", $scope.countryArr)
          $scope.countryArr = _.filter($scope.countryArr, function (country) {
            // return country.name == country_name;
            if (country.name) {
              return country['name'].toLowerCase().startsWith(country_name);
            }
          });
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }

    // handle click event in date picker 
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

    // get country matrix logs
    $scope.getCountryMatrixLogs = function (keyword) {
      console.log("keyword", keyword)
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 31,
        sorting: {
          updatedAt: 'desc' // initial sorting
        }
      }, {
          getData: function ($defer, params) {
            var page = params.page();
            var count = params.count();
            var sorting = params.sorting();
            Country.getCountryMatrixLogs({ page: page, count: count, sortby: sorting, keyword: keyword }, function (response) {
              if (response.code === 200) {
                console.log(response);
               
                params.total(response.count);
                $defer.resolve(response.data);
                $scope.countryMatrixLogData = response;
                var filter = { semi_approve: false, is_reject: false, is_approve: false, is_more_info: false };
                $rootScope.readCount = $filter('filter')($scope.countryMatrixLogData, filter).length;
              } else {
                toaster.pop('error', "", response.message);
              }
            });
          }
        });
    }

    /* @function : filterCountry
    *  @author  : MadhuriK 
    *  @created  : 21-Jun-17
    *  @modified :
    *  @purpose  : To get filter country list.
    */

    $scope.filterCountry = function (country_name) {
      $stateParams.keyword = country_name
      $scope.keyword = country_name;
      if (country_name.length > 0) {
        country_name = country_name.toLowerCase();
        $scope.countryArr = _.filter($scope.countryArr, function (country) {
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
    $scope.getCountryThreatMatrix = function () {
      $scope.showLoader = true;
      var country_id = $state.params.country_id;
      console.log("country_id", country_id)
      if (country_id) {
        var countryObj = {country: [country_id]};
        Country.getCountryThreatMatrix(countryObj, function(response) {
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
                console.log("index", index)
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
    $scope.getCategoriesList = function () {
      Country.getCategoriesList(function (response) {
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

    $scope.getAllCountry = function () {
      var country_id = $state.params.country_id;
      $scope.showLoader = true;
      Country.getAllCountry(country_id, function (response) {
        if (response.code === 200) {
          response.country_risk.forEach(function (data) {
            $scope.specificinfo = data.specific_info ? data.specific_info : "";
          })
        } else {
          $scope.showLoader = false;
          toaster.pop('error', "", response.err);
        }
      })
    }

    var str = "abcdefghijklmnopqrstuvwxyz";
    $scope.alphabet = str.toUpperCase().split("");
    $scope.activeLetter = '';
    $scope.activateLetter = function (letter) {
      console.log("letter", letter)
      $scope.activeLetter = letter
      $state.go('main.country_list', { keyword: $scope.activeLetter }, { reload: true })
    }



    $scope.getSupplierForCountry = function () {
      $scope.showLoader = true;
      var country_id = $state.params.country_id;
      Country.getSupplierForCountry(country_id, function (response) {
        if (response.code === 200) {
          $scope.supplierdata = response.supplierData;
        } else {
          $scope.showLoader = false;
          toaster.pop('error', "", response.err);
        }
      })
    }

    // $scope.addInformation=function(countryinformation){
    //  var  countryinfo={}
    //   countryinfo.country=countryinformation.country;
    //   countryinfo.info=countryinformation.information;
    //  Country.addInformation(countryinfo, function(response) {
    //     if (response.code === 200) {
    //     $scope.countrydata=response.country;
    //     } else {
    //       $scope.showLoader = false;
    //       toaster.pop('error', "", response.err);
    //     }
    //   })
    // }

  }]);
