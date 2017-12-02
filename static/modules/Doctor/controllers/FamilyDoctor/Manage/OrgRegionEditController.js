"use strict";

define([
      "module-services-api", "module-directive-bundling-doctor-all","bootstrap-select"
], function () {

    var app = angular.module("myApp", [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
    ]);

    app.controller("OrgRegionEditController", ["$scope", '$state', "FamilyDoctorServices", function ($scope, $state, FamilyDoctorServices) {

        $scope.Regions = [];
        $scope.Hospitals = [];
        $scope.Stations = [];
        $scope.RegionIDs = [];

        $scope.model = { Details:[]};
        debugger;
        if($state.params.id){
            $scope.editflag =true;
        }
        else{
            $scope.editflag =false;
        }

        $("#myForm").validate({
            submitHandler: function (form) {
                $scope.submit();
            }
        });

        $scope.init = function () {
            //$scope.getRegions();
            $scope.getHospital();
            if($scope.editflag){
                $scope.load($state.params.id);
            }
        };

        $scope.submit = function () {
            for(var i= 0;i<$scope.Stations.length;i++){  
                if($scope.Stations[i].Value == $scope.model.HospitalID){
                    $scope.model.HospitalName = $scope.Stations[i].Text
                    break;
                }
            }
            
            $scope.model.Details = [];
            if($scope.RegionIDs.length>0){
                for(var i =0 ; i<$scope.RegionIDs.length;i++){
                    $scope.model.Details.push({VillageRegionID:$scope.RegionIDs[i]});
                }
            }

            FamilyDoctorServices.modifyOrgRegions($scope.model, function (obj) {
                if (obj.Status == 0) {
                    layer.msg("添加成功");
                    $state.go("Doctor.FamilyDoctorManage.OrgRegion");
                } else
                    layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
            }, function (obj) {
                if (obj.Msg) {
                    layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
                }
            })
        }

        $scope.load = function (orgID) {
            FamilyDoctorServices.getOrgRegionDetail({ orgID : orgID}, function (obj) {
                if (obj.Status == 0) {
                    $scope.model = obj.Data;
                    if($scope.model.ServiceCenterID){
                        $scope.onHospitalChange();
                    }
                    if($scope.model.Details.length>0){
                        for(var i =0 ; i<$scope.model.Details.length;i++){
                            $scope.RegionIDs.push($scope.model.Details[i].VillageRegionID);
                        }
                    }
                } else
                    layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
            }, function (obj) {
                if (obj.Msg) {
                    layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
                }
            })
        }


       /* $scope.getRegions = function () {
            FamilyDoctorServices.getRegions({ CurrentPage: 1, PageSize: 100 }, function (obj) {
                $scope.Regions = obj.Data;
            })
        } */

        $scope.getHospital = function () {
            FamilyDoctorServices.getServiceCenterList({}, function (obj) {
                $scope.Hospitals = obj.Data;
            })
        }

        $scope.onHospitalChange = function (){
            $scope.getStation($scope.model.ServiceCenterID);
            $scope.getRegions($scope.model.ServiceCenterID)
        }

        $scope.onStationChange = function (){
            $scope.load($scope.model.HospitalID);
        }

        $scope.getStation = function (orgid) {
            FamilyDoctorServices.getChildrenOrgList({orgID : orgid}, function (obj) {
                $scope.Stations = obj.Data;
            })
        }

        $scope.getRegions = function (orgid) {
            FamilyDoctorServices.getCenterSubRegions({orgID : orgid}, function (obj) {
                $scope.Regions = obj.Data;
            })
        }

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            // 下拉菜单多选
            $('.selectpicker').selectpicker({
                size: 10
            })
        });


        $scope.back = function () {
            history.back();
        }

        $scope.init();
    }])

    app.directive('onFinishRenderFilters', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }]);

})