"use strict";
define(["module-directive-bundling-doctor-all",
        "module-filter-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);
            app.controller('SmartMatchController', ['$scope', '$state', '$translate', 'familySignatureServices', 'webapiServices', 'FamilyDoctorServices', function ($scope, $state, $translate, services, webapiServices, FamilyDoctorServices) {

                $scope.CommonApiUrl = global_ApiConfig.CommonApiUrl;
                $scope.CurrentPage = 1;
                $scope.PageSize = 10;
                $scope.pageList = [];
                $scope.TotalCount = 0;
                $scope.OrgList = []
                $scope.OrgnazitionID = '';
                $scope.Matched = false;
        
                $scope.onSearch = function () {
                    if ($scope.Matched) {
                        $scope.MatchDoctorGroup();
                    }
                    else {
                        services.GetPageList({
                            PageSize: $scope.PageSize,
                            CurrentPage: $scope.CurrentPage,
                            OrgnazitionID: $scope.OrgnazitionID
                        }, function (response) {
                            $scope.loading = false;
                            $scope.pageList = response.Data;
                            $scope.TotalCount = response.Total;
                            console.log($scope.pageList)
                        }, function () {
                            layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });
                            $scope.loading = false;
                        })
                    }
                }

                $scope.MatchDoctorGroup = function () {
                    services.MatchDoctorGroup({
                        PageSize: $scope.PageSize,
                        CurrentPage: $scope.CurrentPage,
                        OrgnazitionID: ''
                    }, function (response) {
                        $scope.loading = false;
                        $scope.pageList = response.Data;
                        $scope.pageTotal = response.Total;
                        $scope.Matched = true
                    }, function () {
                        layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });
                        $scope.loading = false;
                    })
                }

                $scope.dropDownList = function () {
                    FamilyDoctorServices.getOrgList({}, function (response) {
                        $scope.OrgList = response.Data;
                        console.log($scope.OrgList)
                    }, function () {
                        layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });
                        $scope.loading = false;
                    })
                }

                $scope.SaveMatch = function () {               
                    services.SaveMatch({}, function () {
                        $scope.Matched = false
                        layer.msg("保存成功");
                    }, function () {
                        layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });
                        $scope.loading = false;
                    })
                }

                $scope.init = function () {
                    $scope.onSearch();
                    $scope.dropDownList();
                }
                $scope.init()
            }
            ]);
        });