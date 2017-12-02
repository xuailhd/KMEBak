"use strict";
define(["module-directive-bundling-doctor-all",
        "module-filter-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);

            app.controller('ServicesOrderController', ['$scope', 'webapiServices', "$state", '$translate', 'doctorPatientsServices', function ($scope, webapiServices, $state, $translate, doctorPatientsServices) {
                $scope.currentStateName = $state.current.name;
                $scope.currentFilterType = $state.params.type == null ? 0 : $state.params.type;

                $scope.onDateFilter = function (type) {
                   
                    $scope.currentFilterType = type;
                    $state.go($state.current.name, { type: type });
                }
            }]);
        });