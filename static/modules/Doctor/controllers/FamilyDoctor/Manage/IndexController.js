"use strict";

define(["module-directive-bundling-doctor-all",
        "module-filter-all",
        "module-services-api"],
    function () {

        var app = angular.module("myApp",
            [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
            ]);

        app.controller('FamilyDoctorController',
            [
                '$scope',     
                "$state",
                '$translate', function (
                    $scope,                
                    $state,
                    $translate                    )
                {
                    $scope.currentStateName = $state.current.name;
                }
            ]);
    });

