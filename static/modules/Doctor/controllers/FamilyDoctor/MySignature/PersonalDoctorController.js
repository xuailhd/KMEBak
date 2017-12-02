"use strict";
define(["module-services-api",
        "module-filter-all",
        "module-directive-bundling-doctor-all"
], function (apiUtil) {

    var app = angular.module("myApp", [
        "pascalprecht.translate",
        'ui.router',
        "ui.bootstrap",
        "ngAnimate"]);
    app.controller('PersonalDoctorController', ['$scope', '$state', '$translate', 'familyUserPackageServices', function ($scope, $state, $translate, familyUserPackageServices) {

        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 1;
        $scope.listItems = [];

        $scope.onSearch = function () {
            familyUserPackageServices.promise.getComsumeList({
                Keyword: $scope.keyword,
                StartTime: $scope.beginDate,
                EndTime: $scope.endDate,
                UserPackageID: 'JK666TC',
                PageSize: $scope.pageSize,
                CurrentPage: $scope.currentPage
            }).then(function (resp) {
                if (resp.Status != 0)
                    return;

                $scope.listItems = resp.Data.map(function (item) {
                    item.GroupName = "自聘医生团队";
                    return item;
                });

            })["catch"](function(resp){
                
                
            });
        };

        $scope.onSearch();
    }
    ]);
});