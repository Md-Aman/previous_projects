'use strict';

angular.module('news_agencies', ['ui.router', 'angularUtils.directives.dirPagination'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.list_news_agencies', {
        url: '/list/client',
        templateUrl: 'modules/news_agencies/views/list_news_agencies.html',
        controller: 'NewsAgenciesCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.add_news_agencies', {
        url: '/add/client',
        templateUrl: 'modules/news_agencies/views/add_news_agencies.html',
        controller: 'NewsAgenciesCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.update_newsAgency', {
        url: '/update/client/:newsAgency_id',
        templateUrl: 'modules/news_agencies/views/update_news_agencies.html',
        controller: 'NewsAgenciesCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.newsAgencyCountryRiskLevel', {
        url: '/view/client_country_risk_level/:newsAgency_id',
        templateUrl: 'modules/news_agencies/views/news_agencies_country_risk_level.html',
        controller: 'NewsAgenciesCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.create_rpstaff', {
        url: '/add/rpstaff',
        templateUrl: 'modules/news_agencies/views/add_rpstaff.html',
        controller: 'NewsAgenciesCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.list_rpstaff', {
        url: '/list/rpstaff',
        templateUrl: 'modules/news_agencies/views/list_rpstaff.html',
        controller: 'NewsAgenciesCtrl',
        parent: 'main',
        authenticate: true
      })
  })
  .controller('NewsAgenciesCtrl', function ($scope, toaster, $timeout, NewsAgencies, ngTableParams, $state, $window) {
    $scope.superAdminUserData = $window.localStorage.superAdminUserData !== undefined ? JSON.parse($window.localStorage.superAdminUserData) : "";
    $scope.fullname = $scope.superAdminUserData.firstname + " " + $scope.superAdminUserData.lastname;
    /* @function : getAllCountries
     *  @author  : MadhuriK 
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To get all country list.
     */
    $scope.getAllCountries = function () {
      NewsAgencies.getAllCountries(function (response) {
        if (response.code == 200) {
          $scope.countryArr = response.data;
        } else {
          $scope.countryArr = [];
        }
      })
    }


    /* @function : saveNewsAgency
     *  @author  : MadhuriK 
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To save news agency.
     */
    $scope.saveNewClient = function (news_agencies) {
      news_agencies.admindata = $scope.newsagencies
      news_agencies.fullname=$scope.fullname;
      $scope.showLoader = true;
      if (news_agencies) {
        if (!news_agencies.type_of_client) {
          $scope.showLoader = false;
          toaster.pop('error', "", "Please select client type");
        } else {
          NewsAgencies.saveNewClient(news_agencies, function (response) {
            if (response.code == 200) {
              $scope.showLoader = false;
              toaster.pop('success', "", response.message);
              $timeout(function () {
                $state.go('main.list_news_agencies');
              }, 500);
            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        }
      }

    }

     /* @function : saveNewRPstaff
     *  @author  : Siroi 
     *  @created  : 12-mar-2018
     *  @modified :
     *  @purpose  : To save new rpstaff.
     */
    $scope.saveNewRPstaff = function (new_rpstaff) {
      new_rpstaff.rpstaffdata = $scope.newsagencies
      new_rpstaff.fullname=$scope.fullname;
      $scope.showLoader = true;
      if (new_rpstaff) {
     
          NewsAgencies.saveNewRPstaff(new_rpstaff, function (response) {
            
            if (response.code == 200) {
              console.log(response.message);
              $scope.showLoader = false;
              toaster.pop('success', "", response.message);
              $timeout(function () {
                $state.go('main.list_rpstaff');
              }, 500);
            } else {
              $scope.showLoader = false;
              toaster.pop('error', "", response.message);
            }
          })
        
      }

    }




    /* @function : getAllNewsAgencies
     *  @author  : MadhuriK 
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To get all news agency.
     */
    $scope.getAllNewsAgencies = function (keyword) {
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
          NewsAgencies.getAllNewsAgencies({
            page: page,
            count: count,
            sortby: sorting,
            keyword: keyword
          }, function (response) {
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
             $scope.newsAgencies = response.data;
            
            } else {
              toaster.pop('error', "", response.err);
            }
          });
        }
      });
    }

     /* @function : getAllRPstaff
     *  @author  : MadhuriK 
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To get all news agency.
     */
    $scope.getAllRPstaff = function (keyword) {
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
          NewsAgencies.getAllRPstaff({
            page: page,
            count: count,
            sortby: sorting,
            keyword: keyword
          }, function (response) {
            if (response.code === 200) {
              console.log("sucess"+response.count);
             
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
               console.log(response.data+"doo");

              $scope.newsAgencies = response.data;
            } else {
              toaster.pop('error', "", response.err);
            }
          });
        }
      });
    }





    /* @function : deleteNewsAgency
     *  @author  : MadhuriK 
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To delete news agency.
     */
    $scope.deleteNewsAgency = function (news_agency_id) {
      if (news_agency_id) {
        swal({
            title: "Are you sure?",
            text: "You want to delete selected client?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function () {
            NewsAgencies.deleteNewsAgency(news_agency_id, function (response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllNewsAgencies();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }

  /* @function : deleteRpstaff
     *  @author  : Siroi 
     *  @created  : 30-May-18
     *  @modified :
     *  @purpose  : To delete rpstaff.
     */
    $scope.deleteRpstaff = function (news_agency_id) {
      if (news_agency_id) {
        swal({
            title: "Are you sure?",
            text: "You want to delete selected Rpstaff?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function () {
            NewsAgencies.deleteRpstaff(news_agency_id, function (response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllRPstaff();
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
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To change client admin status.
     */
    $scope.changeStatus = function (status, news_agency_id) {
      var newsAgencyStatus = status == 'Active' ? 'Inactive' : 'Active';
      if (newsAgencyStatus && news_agency_id) {
        swal({
            title: "Are you sure?",
            text: "You want to " + newsAgencyStatus + " selected news agency?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function () {
            var news_agency = {};
            news_agency.id = news_agency_id;
            news_agency.status = newsAgencyStatus;
            NewsAgencies.changeNewsAgencyStatus(news_agency, function (response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllNewsAgencies();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }

     /* @function : changeStatusrpsatff
     *  @author  : MadhuriK 
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To change client admin status.
     */
    $scope.changeStatusrpsatff = function (status, news_agency_id) {
      var newsAgencyStatus = status == 'Active' ? 'Inactive' : 'Active';
      if (newsAgencyStatus && news_agency_id) {
        swal({
            title: "Are you sure?",
            text: "You want to " + newsAgencyStatus + " selected RPstaff?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function () {
            var news_agency = {};
            news_agency.id = news_agency_id;
            news_agency.status = newsAgencyStatus;
            NewsAgencies.changeStatusrpsatff(news_agency, function (response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllRPstaff();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }


    /* @function : getNewsAgencyDetails
     *  @author  : MadhuriK 
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To get news agency details.
     */
    $scope.getNewsAgencyDetails = function () {
      $scope.news_agencies = {};
      var news_agency_id = $state.params.newsAgency_id
      if (news_agency_id) {
        NewsAgencies.getNewsAgencyDetails(news_agency_id, function (response) {
          if (response.code === 200) {
            $scope.news_agencies = response.data;
            console.log(response.data);
            $scope.news_agencies.sector = response.data.sector_id;
            var ids = [];
            $scope.newsagencies = response.agency.forEach(function (data) {
              ids.push(data._id);
            })
            $scope.newsagencies = response.agency.length > 0 ? response.agency : [{
              firstname: "",
              lastname: "",
              email: "",
              mobile_number: "",
              address: "",
              zip_code: ""
            }];
            console.log("$scope.newsagencies", $scope.newsagencies)
            NewsAgencies.getDepartmentList({
              ids
            }, function (err,result) {
              if (response.code === 200) {
                $scope.departmentArr = result.data;
                $scope.departmentArr.forEach(function (department) {
                  // if (data.department.indexOf(department._id) > -1) {
                  //     department.ticked = true;
                  // }
                })
              }
            })
            $scope.getAllCountries();
          } else {
            $scope.news_agencies = [];
          }
        })
      }
    }


    /* @function : updateNewsAgency
     *  @author  : MadhuriK 
     *  @created  : 19-May-17
     *  @modified :
     *  @purpose  : To update news agency details.
     */
    $scope.updateNewsAgency = function (news_agencies) {
      news_agencies.admindata = $scope.newsagencies
      if (news_agencies) {
        var departmentArr = [];
        if (news_agencies.department) {
          news_agencies.department.forEach(function (depart) {
            departmentArr.push(depart._id);
          })
        }
        news_agencies.department = departmentArr;
        NewsAgencies.updateNewsAgency(news_agencies, function (response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function () {
              $state.go('main.list_news_agencies');
            }, 500);
          } else {
            toaster.pop('error', "", response.err);
          }
        })
      }

    }


    /* @function : countryRiskLevel
     *  @author  : MadhuriK 
     *  @created  : 22-May-17
     *  @modified :
     *  @purpose  : To get all country risk level of a news agency.
     */
    var countryArrs = [];
    $scope.countryRiskLevel = function () {
      var news_agency_id = $state.params.newsAgency_id;
      NewsAgencies.countryRiskLevel(news_agency_id, function (response) {
        if (response.code === 200) {
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
          toaster.pop('error', "", response.err);
        }
      })
    }

    /* @function : editCountry
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
     *  @created  : 22-May-17
     *  @modified :
     *  @purpose  : To save country specific information.
     */
    $scope.saveCountrySpecificInfo = function (countryData) {
      if (countryData) {
        countryData.client_admin_id = $state.params.newsAgency_id;
        NewsAgencies.saveCountrySpecificInfo(countryData, function (response) {
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
     *  @created  : 22-May-17
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
      countryData.client_admin_id = $state.params.newsAgency_id;
      NewsAgencies.saveCountryColor(countryData, function (response) {
        if (response.code == 200) {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('success', "", response.message);
        } else {
          $scope.toasters.splice(toaster.id, 1);
          toaster.pop('error', "", response.err);
        }
      })

    }

    /* @function : filterCountry
     *  @author  : MadhuriK 
     *  @created  : 24-May-17
     *  @modified :
     *  @purpose  : To get filter country list.
     */
    $scope.filterCountry = function (country_name) {
      if (country_name.length > 0) {
        country_name = country_name.toLowerCase();
        $scope.countryArr = _.filter($scope.countryArr, function (country) {
          // return country.name == country_name;
          return country['name'].toLowerCase().startsWith(country_name);
        });
      } else {
        $scope.countryArr = countryArrs;
      }
    }


    /* @function : filterCountry
     *  @author  : MadhuriK 
     *  @created  : 13-July-17
     *  @modified :
     *  @purpose  : To get all sector list.
     */
    $scope.getAllSectors = function () {
      var category={}
      if(localStorage.super_admin == "true"){
        category.super_admin=true;
      
        category.client_id='';
      }else{
         
        category.super_admin=false;
        category.client_id=$window.localStorage.logclient_id;
          
      }


      NewsAgencies.getAllSectors(category,function (response) {
        if (response.code == 200) {
          $scope.sectorArr = response.data;
        } else {
          $scope.sectorArr = {};
        }
      })

    }


    //   $scope.getDepartmentList = function (client_id) {
    //     if (client_id) {
    //         NewsAgencies.getDepartmentList(client_id, function (response) {
    //             if (response.code == 200) {
    //                $scope.departmentArr = result.data;
    //             } else {
    //             $scope.departmentArr = [];

    //             }
    //         })
    //     }
    // }

    /* @function : addEmergencyContact
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17  primary_zip_code department
     *  @modified :
     *  @purpose  : To add multiple emergency contact.
     */

    $scope.newsagencies = [{
      firstname: "",
      lastname: "",
      email: "",
      mobile_number: "",
      address: "",
      zip_code: "",
      department: []
    }];
    $scope.addNewsagencies = function () {
      var newsagenciesArr = {
        firstname: "",
        lastname: "",
        email: "",
        mobile_number: "",
        address: "",
        zip_code: "",
        department: []
      }
      $scope.newsagencies.push(newsagenciesArr);

    }

    /* @function : removeEmergencyContact
     *  @author  : MadhuriK 
     *  @created  : 07-Jun-17
     *  @modified :
     *  @purpose  : To remove multiple emergency contact.
     */
    $scope.removeNewsagencies = function () {
      var lastItem = $scope.newsagencies.length - 1;
      $scope.newsagencies.splice(lastItem);
    }
    var baseURI = '';

    if (window.location.host === 'localhost:3000') {
      baseURI = 'http://' + window.location.host + '/';
    } else {
      baseURI = 'https://' + window.location.host + '/'
    }

    $scope.loginAsClient = function (email, password) {
      var clientdata = {}
      clientdata.email = email;
      clientdata.password = password;
      NewsAgencies.loginAsClient(clientdata, function (response) {
        if (response.code === 200) {
          $window.localStorage.adminUserData = JSON.stringify(response.data);
          $window.localStorage.admintoken = response.data.duoToken;
          $window.localStorage.userLoggedin = true;
          toaster.pop('success', "Successfull login");
          $timeout(function () {
            $window.open(baseURI + '/admin/#/main/dashboard');
          }, 500);

        } else {
          toaster.pop('error', "", response.message);
        }
      })

    }

  });
