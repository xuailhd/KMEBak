"use strict";

define([
      "module-services-api", "module-directive-bundling-doctor-all"
], function () {

    var app = angular.module("myApp", [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
    ]);

    app.controller("RegionEditController", ["$scope", '$state', "FamilyDoctorServices", function ($scope, $state, FamilyDoctorServices) {

    $scope.model = {};

    var regionID = $state.params.id;

    $("#myForm").validate({
        submitHandler: function (form) {
            $scope.submit();
        }
    });

    $scope.submit = function () {
        FamilyDoctorServices.editRegion($scope.model, function (obj) {
            if (obj.Status == 0) {
                layer.msg("添加成功");
                $state.go("Doctor.RegionManage");
            } else
                layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
        }, function (obj) {
            if (obj.Msg) {
                layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
            }
        })
    };

    $scope.load = function(regionID){
        FamilyDoctorServices.getRegionDetail({RegionID:regionID}, function (obj) {
                if (obj.Status == 0) {
                    $scope.model = obj.Data;
                    $scope.model.RegionLevel = $scope.model.RegionLevel.toString();
                } else
                    layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
            }, function (obj) {
                if (obj.Msg) {
                    layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
                }
            })
    }

        
    $scope.back = function () {
        history.back();
    };

    if(regionID){
        $scope.load(regionID)
    }

}])

})