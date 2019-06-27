'use strict';

angular.module('category', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.list_categories', {
        url: '/list/categories',
        templateUrl: 'modules/categories/views/list_categories.html',
        controller: 'categoryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.add_categories', {
        url: '/add/categories',
        templateUrl: 'modules/categories/views/add_categories.html',
        controller: 'categoryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.update_categories', {
        url: '/update/categories/:category_id',
        templateUrl: 'modules/categories/views/update_categories.html',
        controller: 'categoryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.list_risk_associated_categories', {
        url: '/list/risk_associated_categories',
        templateUrl: 'modules/categories/views/list_risk_associated_categories.html',
        controller: 'categoryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.add_risk_associated_categories', {
        url: '/add/risk_associated_categories',
        templateUrl: 'modules/categories/views/add_risk_associated_categories.html',
        controller: 'categoryCtrl',
        parent: 'main',
        authenticate: true
      })
      .state('main.update_risk_associated_categories', {
        url: '/update/risk_associated_categories/:risk_associated_category_id',
        templateUrl: 'modules/categories/views/update_risk_associated_categories.html',
        controller: 'categoryCtrl',
        parent: 'main',
        authenticate: true
      })
  })
  .controller('categoryCtrl', function($scope, toaster, $timeout, Category, ngTableParams, $state, $window) {



    /* @function : getAllCategories
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To get all categories.
     */
    $scope.getAllCategories = function(category_name) {

      // var types_of_ra_id = $state.params.types_of_ra_id;

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

          if(localStorage.super_admin == "true"){
            var super_admin=true;
          
             var client_id='';
          }else{
             
            super_admin=false;
            client_id=$window.localStorage.logclient_id;
              
          }
          Category.getAllCategories({ page: page, count: count, sortby: sorting, category_name: category_name,super_admin:super_admin,client_id:client_id }, function(response) {
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
              response.data.forEach(function(catObj) {
                catObj.countryArr = [];
                catObj.country.forEach(function(countryObj) {
                  catObj.countryArr.push(countryObj.name);
                })
              })
             // $scope.categories = response.data;
            } else {
              toaster.pop('error', "", response.err);
            }
          });
        }
      });
    }



    /* @function : deleteCategory
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To delete category.
     */
    $scope.deleteCategory = function(category_id) {
      if (category_id) {
        swal({
            title: "Are you sure?",
            text: "You want to delete selected risk label?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function() {
            Category.deleteCategory(category_id, function(response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllCategories();
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
     *  @created  : 25-May-17
     *  @modified :
     *  @purpose  : To change category status.
     */
    $scope.changeStatus = function(status, category_id) {
      var categoryStatus = status == 'Active' ? 'Inactive' : 'Active';
      if (categoryStatus && category_id) {
        swal({
            title: "Are you sure?",
            text: "You want to " + categoryStatus + " selected risk label?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function() {
            var category = {};
            category.id = category_id;
            category.status = categoryStatus;
            Category.changeCategoryStatus(category, function(response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllCategories();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }


    /* @function : getCountries
     *  @author  : MadhuriK 
     *  @created  : 25-May-17
     *  @modified :
     *  @purpose  : To get all countries.
     */
    $scope.getCountries = function() {
      Category.getCountries(function(response) {
        if (response.code == 200) {
          $scope.countryArr = response.data;
        } else {
          $scope.countryArr = [];
        }
      })

    }


    /* @function : addCategory
     *  @author  : MadhuriK 
     *  @created  : 25-May-17
     *  @modified :
     *  @purpose  : To add category.
     */
    $scope.addCategory = function(category) {
      console.log("sectorName", category)
      if (category) {
        var sectorArr = [];
        category.sectorName.forEach(function(sectorNameobj) {
          sectorArr.push(sectorNameobj._id);
        })
        category.sector_name = sectorArr;

        if(localStorage.super_admin == "true"){
          category.super_admin=true;
        
          category.client_id='';
          
        }else{
           
          category.super_admin=false;
          category.client_id=$window.localStorage.logclient_id;
            
        }

        Category.addCategory(category, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $state.go('main.list_categories');
            }, 500);
          } else {
            toaster.pop('error', "", response.error);
          }
        })
      }
    }


    /* @function : getCategoryDetails
     *  @author  : MadhuriK 
     *  @created  : 24-Mar-17
     *  @modified :
     *  @purpose  : To get category details.
     */
    $scope.getCategoryDetails = function() {
      var category_id = $state.params.category_id;
      Category.getCategoryDetails(category_id, function(response) {
        if (response.code === 200) {
          Category.getCountries(function(result) {
            if (response.code === 200) {
              $scope.countryArr = result.data;
              $scope.countryArr.forEach(function(country) {
                response.data.country.forEach(function(countryData) {
                  if (countryData.name == country.name) {
                    country.ticked = true;
                  }
                })
              })
            }
          })
          var category={}
          if(localStorage.super_admin == "true"){
            category.super_admin=true;
          
            category.client_id='';
          }else{
             
            category.super_admin=false;
            category.client_id=$window.localStorage.logclient_id;
              
          }
    
          Category.getAllSectors(category, function(response1) {
            if (response.code == 200) {
              $scope.sectorArr = response1.data;
              $scope.sectorArr.forEach(function(sector) {
                if(response.data.sector_name.length>0){
                response.data.sector_name.forEach(function(sectorName) {
                  if (sectorName._id == sector._id) {
                      sector.ticked = true;
                  }
                })
            }
              })
            }
          })
          $scope.category = response.data;
        } else {
          toaster.pop('error', "", response.err);
        }
      })
    }


    /* @function : updateCategory
     *  @author  : MadhuriK 
     *  @created  : 27-Mar-17
     *  @modified :
     *  @purpose  : To update the category.
     */
    $scope.updateCategory = function(category) {
      category._id = $state.params.category_id
      var sectorArr = [];
        category.sectorName.forEach(function(sectorNameobj) {
          sectorArr.push(sectorNameobj._id);
        })
      category.sector_name = sectorArr;
      Category.updateCategory(category, function(response) {
        if (response.code === 200) {
          toaster.pop('success', "", response.message);
          $timeout(function() {
            $state.go('main.list_categories');
          }, 500);
        } else {
          toaster.pop('error', "", response.error);
        }

      })
    }



    /* @function : getAllRiskAssociatedCategories
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To get all risk associated categories.
     */
    $scope.getAllRiskAssociatedCategories = function(category_name) {
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
          Category.getAllRiskAssociatedCategories({ page: page, count: count, sortby: sorting, category_name: category_name }, function(response) {
            if (response.code === 200) {
              response.data.forEach(function(riskCat) {
                riskCat.countryArr = [];
                riskCat.country.forEach(function(countryObj) {
                  riskCat.countryArr.push(countryObj.name);
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
              $scope.RiskcategoryData = response.data;
            } else {
              toaster.pop('error', "", response.err);
            }
          });
        }
      });
    }


    /* @function : deleteRiskAssociatedCategory
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To delete risk associated categories.
     */
    $scope.deleteRiskAssociatedCategory = function(risk_associated_category_id) {
      if (risk_associated_category_id) {
        swal({
            title: "Are you sure?",
            text: "You want to delete selected risk associated category?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function() {
            Category.deleteRiskAssociatedCategory(risk_associated_category_id, function(response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllRiskAssociatedCategories();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }

    }


    /* @function : changeRiskCategoryStatus
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To change risk associated category status.
     */
    $scope.changeRiskCategoryStatus = function(status, risk_category_id) {
      var riskCategoryStatus = status == 'Active' ? 'Inactive' : 'Active';
      if (riskCategoryStatus && risk_category_id) {
        swal({
            title: "Are you sure?",
            text: "You want to " + riskCategoryStatus + " selected risk associated category?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function() {
            var risk_category = {};
            risk_category.id = risk_category_id;
            risk_category.status = riskCategoryStatus;
            Category.changeRiskCategoryStatus(risk_category, function(response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllRiskAssociatedCategories();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }
    }


    /* @function : addRiskAssociatedCategory
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To add risk associated category.
     */
    $scope.addRiskAssociatedCategory = function(riskAssociatedCategory) {
      if (riskAssociatedCategory) {
        Category.addRiskAssociatedCategory(riskAssociatedCategory, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $state.go('main.list_risk_associated_categories');
            }, 500);
          } else {
            toaster.pop('error', "", response.err);
          }
        })
      }
    }


    /* @function : getRiskAssociatedCategoryDetails
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To get risk associated category details.
     */
    $scope.getRiskAssociatedCategoryDetails = function() {
      var ris_cat_id = $state.params.risk_associated_category_id;
      if (ris_cat_id) {
        Category.getRiskAssociatedCategoryDetails(ris_cat_id, function(response) {
          if (response.code == 200) {
            Category.getCountries(function(result) {
              if (response.code === 200) {
                $scope.countryArr = result.data;
                $scope.countryArr.forEach(function(country) {
                  response.data.country.forEach(function(countryData) {
                    if (countryData.name == country.name) {
                      country.ticked = true;
                    }
                  })
                })
              }
            })
            $scope.category = response.data
          } else {
            $scope.category = {};
          }
        })
      }

    }


    /* @function : updateRiskAssociatedCategory
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To update risk associated category.
     */
    $scope.updateRiskAssociatedCategory = function(riskAssociatedCategory) {
      if (riskAssociatedCategory) {
        Category.updateRiskAssociatedCategory(riskAssociatedCategory, function(response) {
          if (response.code == 200) {
            toaster.pop('success', "", response.message);
            $timeout(function() {
              $state.go('main.list_risk_associated_categories');
            }, 500);
          } else {
            toaster.pop('error', "", response.err);
          }
        })
      }
    }



    /* @function : markAsMandatory
     *  @author  : MadhuriK 
     *  @created  : 26-May-17
     *  @modified :
     *  @purpose  : To mark risk associated category as mandatory or non mandatory.
     */
    $scope.markAsMandatory = function(is_mandatory, category_id) {
      var mandatoryStatus = is_mandatory == true ? 'marked category as not mandatory' : 'marked category as mandatory';
      var mandatory = is_mandatory == true ? false : true;
      if (category_id) {
        swal({
            title: "Are you sure?",
            text: "You want to " + mandatoryStatus + "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00acd6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
          },
          function() {
            var category = {};
            category.id = category_id;
            category.is_mandatory = mandatory;
            Category.markAsMandatory(category, function(response) {
              if (response.code === 200) {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('success', "", response.message);
                $scope.getAllCategories();
              } else {
                $scope.toasters.splice(toaster.id, 1);
                toaster.pop('error', "", response.err);
              }

            });
          });
      }

    }



    /* @function : redirectToAddCat
     *  @author  : MadhuriK 
     *  @created  : 09-Jun-17
     *  @modified :
     *  @purpose  : Redirect to add category of particular ra
     */
    $scope.redirectToAddCat = function() {
      var types_of_ra_id = $state.params.types_of_ra_id;
      $state.go('main.add_categories', { types_of_ra_id: $state.params.types_of_ra_id });
    }



    /* @function : getTypesOfRa
     *  @author  : MadhuriK 
     *  @created  : 22-Jun-17
     *  @modified :
     *  @purpose  : get all types of ra
     */
    $scope.getTypesOfRa = function() {
      Category.getTypesOfRa(function(response) {
        if (response.code == 200) {
          $scope.typeOfRas = response.data;
        } else {
          $scope.typeOfRas = {};
        }
      })
    }


    /* @function : filterCountry
     *  @author  : MadhuriK 
     *  @created  : 13-July-17
     *  @modified :
     *  @purpose  : To get all sector list.
     */
    $scope.getAllSectors = function() {

      var category={}
      if(localStorage.super_admin == "true"){
        category.super_admin=true;
      
        category.client_id='';
      }else{
         
        category.super_admin=false;
        category.client_id=$window.localStorage.logclient_id;
          
      }

      Category.getAllSectors(category, function(response) {
        if (response.code == 200) {
          $scope.sectorArr = response.data;
        } else {
          $scope.sectorArr = {};
        }
      })

    }

  });
