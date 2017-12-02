"use strict";
define([
        "module-directive-bundling-doctor-all",
        "module-services-api"
    ],
    function () {

        var app = angular.module("myApp",
            [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
            ]);

        app.controller('FamilyServiceConfirmController',
            [
                '$scope',
                '$http',
                "$q",
                '$location',
                '$state',
                '$translate',            
                'familySignatureServices',
                function ($scope, $http, $q, $location, $state, $translate, familySignatureServices) {
                    $scope.ListItems = [];
                    $scope.page = 1;
                    $scope.pageSize = 10;
                    $scope.totalCount = 0;
                    $scope.HospitalName = global_doctorInfo.HospitalName;

                    //确认签约
                    $scope.onConfirm = function (item) {
                        
                        //修改状态为已签约
                        familySignatureServices.changeStatus({
                            Status:1, //已签约
                            SignatureID: item.SignatureID
                        }, function (resp)
                        {
                            if (resp.Status == 0)
                            {
                                layer.msg("确认成功", { icon: 1, shade: 0.5 });

                                $scope.ListItems.remove(item);
                            }
                            else {
                                layer.msg("确认失败", { icon: 2, shade: 0.5 });
                            }

                        }, function () {
                            layer.msg("确认失败", { icon: 2, shade: 0.5 });
                        });
                    }

                    //搜索已签约的家庭
                    $scope.onSearch = function ()
                    {
                        $scope.loading = true;
                        familySignatureServices.searchSignatures({
                            DoctorOrgID: global_doctorInfo.HospitalID,
                            CurrentPage: $scope.page,
                            PageSize: 9999,
                            Status: [0]
                        },
                            function (resp) {

                                $scope.loading = false;
                                $scope.ListItems = resp.Data;
                                $scope.totalCount = resp.Total;

                            }, function ()
                            {
                                $scope.loading = false;
                                $scope.ListItems = [];
                            });
                    };
                }
            ]);
    }
);