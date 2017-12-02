"use strict";

define([
        "module-services-api",
         "css!styles/layout.room.css"
], function () {

    var app = angular.module("myApp", [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
    ]);

    app.controller("OrgRegionController", ["$scope", "$state", "FamilyDoctorServices", function ($scope, $state, FamilyDoctorServices) {
        $scope.CurrentPage = 1;
        $scope.PageSize = 10;
        $scope.ListItems = [];
        $scope.TotalCount = 0;
        $scope.Regions = [];
        $scope.TownRegionID = "";
        $scope.onSearch = function ()
        {
            $scope.fn.getOrgRegions();
        }
        $scope.fn = {};
        $scope.fn.init = function () {
            $scope.fn.getRegions()
        };

        $scope.fn.getOrgRegions = function () {
           
            FamilyDoctorServices.getOrgRegions({
                CurrentPage: $scope.CurrentPage,
                PageSize: $scope.PageSize,
                TownRegionID: $scope.TownRegionID,
                Keyword: $scope.Keyword
            }, function (obj) {
                if (obj.Data != null) {
                    $scope.ListItems = obj.Data;
                    $scope.TotalCount = obj.Total;
                }
            })
        }

        $scope.fn.getRegions = function () {
            FamilyDoctorServices.getRegions({ CurrentPage: 1, PageSize: 100}, function (obj) {
                $scope.Regions = obj.Data;
            })

        }

        $scope.fn.init();
    }])

})