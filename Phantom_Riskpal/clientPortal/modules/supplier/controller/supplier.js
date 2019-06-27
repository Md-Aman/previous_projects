'use strict';

angular.module('supplier', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('main.add_supplier', {
                url: '/supplier/add',
                templateUrl: 'modules/supplier/views/add_supplier.html',
                controller: 'SupplierCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.add_suppliernew', {
                url: '/supplier/addnew',
                templateUrl: 'modules/supplier/views/add_suppliernew.html',
                controller: 'SupplierCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.list_supplier', {
                url: '/supplier/list',
                templateUrl: 'modules/supplier/views/list_supplier.html',
                controller: 'SupplierCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.list_suppliernew', {
                url: '/supplier/listnew',
                templateUrl: 'modules/supplier/views/list_suppliernew.html',
                controller: 'SupplierCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.update_supplier', {
                url: '/supplier/update_supplier/:supplier_id',
                templateUrl: 'modules/supplier/views/update_supplier.html',
                controller: 'SupplierCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.update_suppliernew', {
                url: '/supplier/update_suppliernew/:supplier_id',
                templateUrl: 'modules/supplier/views/update_suppliernew.html',
                controller: 'SupplierCtrl',
                parent: 'main',
                authenticate: true
            })

    })
    .controller('SupplierCtrl', ['$scope', '$location', 'Supplier', 'ngTableParams', '$state', 'toaster', '$timeout', 'Country','Usergroup', 'Upload','$window','$rootScope', function ($scope, $location, Supplier, ngTableParams, $state, toaster, $timeout, Country,Usergroup, Upload,$window,$rootScope) {



        /* @function : getAllCategories
          *  @author  : MadhuriK 
          *  @created  : 05-Apr-17
          *  @modified :
          *  @purpose  : To get all the country list.
          */
        $scope.getAllCountries = function () {
            console.log("fd")
            $rootScope.supplier=null;
            //$rootScope.supplierInformationtest=null;
            Country.getAllCountries(function (response) {
                if (response.code === 200) {
                    $scope.countryArr = response.data;
                    if ($state.params.supplier_id !== undefined) {
                        $scope.getSupplierDetails();
                    }
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }

            /* @function : filterclients
     *  @author  : Siroi 
     *  @created  : 21-Mar-18
     *  @modified :
     *  @purpose  : To get all client list for creating 
     */
    $scope.getAllClients = function () {
        Usergroup.getAllClients(function (response) {
          if (response.code == 200) {
            $scope.clientArr = response.data;
          } else {
            $scope.clientArr = {};
          }
        })
  
      }


        // /* @function : addContact
        //   *  @author  : MadhuriK 
        //   *  @created  : 07-Apr-17
        //   *  @modified :
        //   *  @purpose  : To add Contact fields (contact, email, number).
        //   */
        // $scope.contact_list = [{ contact: "", number: "", email: "" }];
        // $scope.addContact = function (index) {
        //     var name = { contact: "", number: "", email: "" };
        //     $scope.contact_list.push(name);

        // }


        // /* @function : removeContact
        //   *  @author  : MadhuriK 
        //   *  @created  : 07-Apr-17
        //   *  @modified :
        //   *  @purpose  : To remove Contact fields (contact, email, number).
        //   */
        // $scope.removeContact = function () {
        //     var lastItem = $scope.contact_list.length - 1;
        //     $scope.contact_list.splice(lastItem);
        // }



        /* @function : addCost
          *  @author  : MadhuriK 
          *  @created  : 07-Apr-17
          *  @modified :
          *  @purpose  : To add cost per unit/day.
          */
        $scope.costArr = [{ cost: "" }];
        $scope.addCost = function () {
            var cost = { cost: "" }
            $scope.costArr.push(cost);
        }



        /* @function : removeCost
          *  @author  : MadhuriK 
          *  @created  : 07-Apr-17
          *  @modified :
          *  @purpose  : To remove cost per unit/day.
          */
        $scope.removeCost = function () {
            var lastItem = $scope.costArr.length - 1;
            $scope.costArr.splice(lastItem);
        }


        /* @function : attachment
         *  @author  : MadhuriK 
         *  @created  : 10-Apr-17
         *  @modified :
         *  @purpose  : To upload supplier attachment.
         */
        $scope.attachment = function (file) {
            file.upload = Upload.upload({
                url: '/admin/supplier/uploadAttachment',
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


        /* @function : addSupplier
         *  @author  : MadhuriK 
         *  @created  : 10-Apr-17
         *  @modified :
         *  @purpose  : To add the supplier.
         */
        $scope.addSupplier = function (supplier) {
            //supplier.contact = [];
           // supplier.contact = $scope.contact_list;
          
            supplier.rating_with_star = supplier.rating_with_star == false ? '0' : supplier.rating_with_star;

            if(localStorage.super_admin == "true"){
                supplier.super_admin=1;
              

        
              }else{
                supplier.super_admin=0;
                supplier.client_id=$window.localStorage.logclient_id;

              }
            Supplier.addSupplier(supplier, function (response) {
                if (response.code === 200) {
                    toaster.pop('success', "", response.message);
                    $timeout(function () {
                        $state.go('main.list_supplier');
                    }, 500);
                } else {
                    toaster.pop('error', "", response.message);
                }
            })
        }


          /* @function : addSupplier
         *  @author  : MadhuriK 
         *  @created  : 10-Apr-17
         *  @modified :
         *  @purpose  : To add the supplier.
         */
        $scope.addSuppliernew = function (supplier) {
            supplier.contact = [];
           
           // supplier.contact = $scope.contact_list;
            supplier.rating_with_star = supplier.rating_with_star == false ? '0' : supplier.rating_with_star;
           console.log(localStorage.super_admin+"fd");
            if(localStorage.super_admin == "true"){
                supplier.super_admin=1;
                supplier.client_id=supplier.client_id;
              }else{
                supplier.super_admin=0;
                supplier.client_id=$window.localStorage.logclient_id;

              }
            Supplier.addSupplier(supplier, function (response) {
                if (response.code === 200) {
                    toaster.pop('success', "", response.message);
                    $timeout(function () {
                        $state.go('main.list_suppliernew');
                    }, 500);
                } else {
                    toaster.pop('error', "", response.message);
                }
            })
        }

        // /* @function : getDepartmentList
        //  *  @author  : MadhuriK 
        //  *  @created  : 10-Apr-17
        //  *  @modified :
        //  *  @purpose  : To get all getDepartmentList.
        //  */
        // $scope.getDepartmentList = function () {
        //       Supplier.getDepartmentList(function (result) {
        //         console.log("resultresult",result)
        //           if (result.code == 200) {
        //               $scope.departmentArr = result.data;
        //           } else {
        //               $scope.departmentArr = [];
        //           }
        //       })
        // }()


        /* @function : getAllSupplier
         *  @author  : MadhuriK 
         *  @created  : 10-Apr-17
         *  @modified :
         *  @purpose  : To get all supplier.
         */
        $scope.getAllSupplier = function (keyword) {
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

                        if(localStorage.super_admin == "true"){
                             var super_admin=true;
                          
                              var client_id='';
                          }else{
                             
                          super_admin=false;
                          client_id=$window.localStorage.logclient_id;
                              
                          }
                        Supplier.getAllSupplier({ page: page, count: count, sortby: sorting, keyword: keyword,super_admin:super_admin,client_id:client_id }, function (response) {
                            if (response.code === 200) {
                              response.data.forEach(function (result) {
                                    result.departmentArr = [];
                                    result.approvingArr = [];
                                    result.department.forEach(function (depart) {
                                        result.departmentArr.push(depart.department_name);
                                    })
                                })

                                
                                params.total(response.count);
                                $defer.resolve(response.data);
                                $scope.supplierData = response.data;
                            } else {
                                toaster.pop('error', "", response.err);
                            }
                        });
                    }
                });
        }


        /* @function : getSupplierDetails
         *  @author  : MadhuriK 
         *  @created  : 11-Apr-17
         *  @modified :
         *  @purpose  : To get supplier details.
         */
        $scope.getSupplierDetails = function () {
            var supplier_id = $state.params.supplier_id;
            Supplier.getSupplierDetails(supplier_id, function (response) {
                if (response.code === 200) {
                    // Supplier.getDepartmentList(function (result) {
                    //     if (response.code === 200) {
                    //         $scope.departmentArr = result.data;
                    //         $scope.departmentArr.forEach(function (department) {
                    //             if (response.data.department.indexOf(department._id) > -1) {
                    //               console.log("response.data.department.indexOf(department._id)",response.data.department.indexOf(department._id))
                    //                 department.ticked = true;
                    //             }
                    //         })
                    //     }
                    // })

                   

                     
                        Usergroup.getAllClients(function (result) {
                          if (result.code == 200) {
                            $scope.clientArr = result.data;

                            $scope.clientArr.forEach(function(client_all) {
                              console.log(response.data.client_id)
                                  response.data.client_id.forEach(function(client_selected) {
                                      console.log(client_selected+"rrrrr")
                                    if (client_selected == client_all._id) {
                                        console.log("tickkk")
                                      client_all.ticked = true;
                                    }
                                  })
                                
                              })

                          } 
                        })
                  
                      




                    response.data.rate = "'" + response.data.rate + "'";
                    response.data.rating_with_star = response.data.rating_with_star ? response.data.rating_with_star.toString() : "";
                    $scope.supplier = response.data;
                    $scope.contact_list = response.data.contact;
                } else {
                    toaster.pop('error', "", response.err);
                }
            })

        }


        /* @function : updateSupplier
         *  @author  : MadhuriK 
         *  @created  : 11-Apr-17
         *  @modified :
         *  @purpose  : To update the supplier.
         */
        $scope.updateSupplier = function (supplier) {
            console.log(supplier)
            supplier._id = $state.params.supplier_id;
            supplier.rating_with_star = supplier.rating_with_star == false ? '0' : supplier.rating_with_star;
           //  supplier.contact = [];
           // supplier.contact = $scope.contact_list;
           if(localStorage.super_admin == "true"){
            supplier.super_admin=1;
    
          }else{
            supplier.super_admin=0;
            supplier.client_id=$window.localStorage.logclient_id;

          }
            Supplier.updateSupplier(supplier, function (response) {
                if (response.code === 200) {
                    toaster.pop('success', "", response.message);
                    $timeout(function () {
                        $state.go('main.list_supplier');
                    }, 500);
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }

          /* @function : updateSupplier
         *  @author  : MadhuriK 
         *  @created  : 11-Apr-17
         *  @modified :
         *  @purpose  : To update the supplier.
         */
        $scope.updateSuppliernew = function (supplier) {
            supplier._id = $state.params.supplier_id;
            supplier.rating_with_star = supplier.rating_with_star == false ? '0' : supplier.rating_with_star;
            supplier.contact = [];
            supplier.contact = $scope.contact_list;
            Supplier.updateSupplier(supplier, function (response) {
                if (response.code === 200) {
                    toaster.pop('success', "", response.message);
                    $timeout(function () {
                        $state.go('main.list_suppliernew');
                    }, 500);
                } else {
                    toaster.pop('error', "", response.err);
                }
            })
        }


        /* @function : changeStatus
         *  @author  : MadhuriK 
         *  @created  : 11-Apr-17
         *  @modified :
         *  @purpose  : To change to supplier status.
         */
        $scope.changeStatus = function (supplier_status, supplier_id) {
            var supplierStatus = supplier_status == 'Active' ? 'Inactive' : 'Active';
            if (supplier_status && supplier_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to " + supplierStatus + " selected category?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        var supplier = {};
                        supplier.id = supplier_id;
                        supplier.status = supplierStatus;
                        Supplier.changeSupplierStatus(supplier, function (response) {
                            if (response.code === 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                                $scope.getAllSupplier();
                            } else {
                                toaster.pop('error', "", response.err);
                            }

                        });
                    });
            }
        }

        /* @function : deleteSupplier
         *  @author  : MadhuriK 
         *  @created  : 11-Apr-17
         *  @modified :
         *  @purpose  : To delete supplier.
         */
        $scope.deleteSupplier = function (supplier_id) {
            if (supplier_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to delete selected supplier?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        Supplier.deleteSupplier(supplier_id, function (response) {
                            if (response.code === 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                                $scope.getAllSupplier();
                            } else {
                                toaster.pop('error', "", response.err);
                            }

                        });
                    });
            }
        }


        $scope.getAllCurrencies = function () {
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
        }


    }]);
