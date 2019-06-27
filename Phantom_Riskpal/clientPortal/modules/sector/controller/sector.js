'use strict';

angular.module('sector', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main.list_sector', {
                url: '/list/sector',
                templateUrl: 'modules/sector/views/list_sector.html',
                controller: 'sectorCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.add_sector', {
                url: '/add/sector',
                templateUrl: 'modules/sector/views/add_sector.html',
                controller: 'sectorCtrl',
                parent: 'main',
                authenticate: true
            })
            .state('main.update_sector', {
                url: '/update/sector/:sector_id',
                templateUrl: 'modules/sector/views/update_sector.html',
                controller: 'sectorCtrl',
                parent: 'main',
                authenticate: true
            })

    })
    .controller('sectorCtrl', function ($scope, toaster, $timeout, Sector, ngTableParams, $state, $window) {


        /* @function : addSector
        *  @author  : MadhuriK 
        *  @created  : 12-July-17
        *  @modified :
        *  @purpose  : add sector
        */
        $scope.addSector = function (sector) {
            if (sector) {
                Sector.addSector(sector, function (response) {
                    if (response.code == 200) {
                        toaster.pop('success', "", response.message);
                        $timeout(function () {
                            $state.go('main.list_sector');
                        }, 500);
                    } else {
                        toaster.pop('error', "", response.error);
                    }
                })
            }
        }



        /* @function : getAllSector
        *  @author  : MadhuriK 
        *  @created  : 12-July-17
        *  @modified :
        *  @purpose  : get all sector
        */
        $scope.getAllSector = function (sector_name) {
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
                        Sector.getAllSector({ page: page, count: count, sortby: sorting, sector_name: sector_name }, function (response) {
                            if (response.code === 200) {
                                params.settings().counts = [];

                                if (response.count > 10) {
                                    params.settings().counts.push(10);
                                    params.settings().counts.push(25);
                                } if (response.count > 25) {
                                    params.settings().counts.push(50);
                                } if (response.count > 50) {
                                    params.settings().counts.push(100);
                                }
                                params.total(response.count);
                                $defer.resolve(response.data);
                                $scope.SectorData = response.data;
                            } else {
                                toaster.pop('error', "", response.err);
                            }
                        });
                    }
                });
        }


        /* @function : changeStatus
         *  @author  : MadhuriK 
         *  @created  : 12-July-17
         *  @modified :
         *  @purpose  : To change sector status.
         */
        $scope.changeStatus = function (status, sector_id) {
            var sectorStatus = status == 'Active' ? 'Inactive' : 'Active';
            if (sectorStatus && sector_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to " + sectorStatus + " selected sector?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        var sector = {};
                        sector.id = sector_id;
                        sector.status = sectorStatus;
                        Sector.changeSectorStatus(sector, function (response) {
                            if (response.code === 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                                $scope.getAllSector();
                            } else {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('error', "", response.err);
                            }

                        });
                    });
            }
        }


        /* @function : deletesector
        *  @author  : MadhuriK 
        *  @created  : 12-July-17
        *  @modified :
        *  @purpose  : To delete sector.
        */
        $scope.deletesector = function (sector_id) {
            if (sector_id) {
                swal({
                    title: "Are you sure?",
                    text: "You want to delete selected sector?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#00acd6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                },
                    function () {
                        Sector.deletesector(sector_id, function (response) {
                            if (response.code === 200) {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('success', "", response.message);
                                $scope.getAllSector();
                            } else {
                                $scope.toasters.splice(toaster.id, 1);
                                toaster.pop('error', "", response.err);
                            }

                        });
                    });
            }
        }


        /* @function : getSectorData
        *  @author  : MadhuriK 
        *  @created  : 12-July-17
        *  @modified :
        *  @purpose  : To get sector data.
        */
        $scope.getSectorData = function () {
            var sector_id = $state.params.sector_id;
            if (sector_id) {
                Sector.getSectorData(sector_id, function (response) {
                    if (response.code == 200) {
                        $scope.sector = response.data;
                    } else {
                        $scope.sector = {};
                    }
                })
            }

        }


        /* @function : updateSector
        *  @author  : MadhuriK 
        *  @created  : 12-July-17
        *  @modified :
        *  @purpose  : To update sector data.
        */
        $scope.updateSector = function (sector) {
            if (sector) {
                Sector.updateSector(sector, function (response) {
                    if (response.code == 200) {
                        toaster.pop('success', "", response.message);
                        $timeout(function () {
                            $state.go('main.list_sector');
                        }, 500);
                    } else {
                        toaster.pop('error', "", response.error);
                    }
                })
            }
        }

    });
