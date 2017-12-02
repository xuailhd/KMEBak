"use strict";

define(["module-directive-bundling-doctor-all",
        "module-services-api",
         "css!styles/layout.room.css"
], function () {

    var app = angular.module("myApp", [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
    ]);

    app.controller("RegionController", ["$scope", "$state", "FamilyDoctorServices", function ($scope, $state, FamilyDoctorServices) {
        $scope.CurrentPage = 1;
        $scope.PageSize = 10;
        $scope.ListItems = [];
        $scope.TotalCount = 0;

        $scope.onSearch = function ()
        {
            $scope.getRegions();
        }


        $scope.getRegions = function () {
                
            var data = { CurrentPage: $scope.CurrentPage, PageSize: $scope.PageSize,
                    RegionIDKeyword : $scope.RegionIDKeyword,ParentIDKeyword:$scope.ParentIDKeyword};
            FamilyDoctorServices.getAllRegions(data, function (obj) {
                $scope.ListItems = obj.Data;
                $scope.TotalCount = obj.Total;
            })
        }
    }])

})