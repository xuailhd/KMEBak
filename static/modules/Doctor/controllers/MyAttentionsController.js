"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            app.controller('MyAttentionsController', ['$scope',
                '$http',
                '$state',
                '$translate',
                "doctorsServices",
            function (
                $scope,
                $http,
                $state,
                $translate,
                services) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;
                $scope.totalCount = 0;

                //返回结果
                $scope.ListItems = [];

                $scope.onSearch = function () {
                    $scope.ListItems = [];
                    services.getAttentions({
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.currentPage,
                    }, function (obj) {
                        $scope.ListItems = obj.Data;
                        $scope.totalCount = obj.Total;
                    });
                };

            }
            ]);


        });