"use strict";

define(["module-directive-bundling-doctor-all","module-directive-chat-detail-Inquiries"],
    function () {

        var app = angular.module("myApp", ["ui.bootstrap"]);
        app.controller('InquiriesDetailController', ['$scope', '$state', function ($scope, $state) {
            var opdRegisterID = $state.params.id;
            $scope.OPDRegisterID = opdRegisterID;
            //返回
            $scope.GoBack = function () {
                history.back();
            };

        }
        ]);


    });