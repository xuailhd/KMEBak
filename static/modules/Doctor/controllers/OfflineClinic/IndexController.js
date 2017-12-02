"use strict";
define(["module-directive-bundling-doctor-all",
        "module-filter-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);


         

            app.controller('MyOfflineClinicController', ['$scope', 'webapiServices', "$state", '$translate', 'doctorPatientsServices', function ($scope, webapiServices, $state, $translate, doctorPatientsServices) {

                $scope.currentStateName = $state.current.name

            }]);
           

        



        });