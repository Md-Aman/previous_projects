"use strict"

angular.module('SectorService', [])

    .factory('Sector', ['$http', function ($http) {
        return {
            // get add sector
            addSector: function (sectorData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddSector,
                    data: sectorData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all sectors
            getAllSector: function (sectorData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllSector,
                    data: sectorData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to change sector status
            changeSectorStatus: function (sectorData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeSectorStatus,
                    data: sectorData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to delete sector
            deletesector: function (sector_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.Deletesector + "/" + sector_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get sector data
            getSectorData: function (sector_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetSectorData + "/" + sector_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update sector data
            updateSector: function (sectorData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateSector,
                    data: sectorData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            }
        }
    }])