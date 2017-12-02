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
            app.controller('SignaturesController', ['$scope', '$state', '$translate', 'familySignatureServices', function ($scope, $state, $translate, familySignatureServices) {

                $scope.HospitalName = global_doctorInfo.HospitalName;
                $scope.CurrentPage = 1;
                $scope.PageSize = 10;
                $scope.TotalCount = 1;
                $scope.ListItems = [];
                $scope.DoctorList = [];
           
                //获取医生列表
                $scope.getDoctorList = function ()
                {
                    familySignatureServices.getDoctorList({}, function (resp)
                    {
                        $scope.DoctorList = resp.Data
                    }, function () {
                        layer.msg("加载签约医生列表失败", { icon: 2, shade: 0.5 });
                    });
                }

                $scope.onSearch = function ()
                {
                    familySignatureServices.searchSignatures({
                        Keyword: $scope.Keyword,
                        FDSignedDoctorName: $scope.FDSignedDoctorName,
                        DoctorOrgID: global_doctorInfo.HospitalID,
                        PageSize: $scope.PageSize,
                        CurrentPage: $scope.CurrentPage,
                        Status: $scope.Status === null || $scope.Status === void 0 || $scope.Status === "" ? [] : [+$scope.Status],
                    }, function (response) {
                        $scope.ListItems = response.Data;
                        $scope.TotalCount = response.Total;
                    });
                };

                $scope.onSearch();
                $scope.getDoctorList();
            }
            ]);
        });