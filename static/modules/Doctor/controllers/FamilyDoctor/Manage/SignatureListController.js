"use strict";
define(["module-directive-bundling-doctor-all",
        "module-filter-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);
            app.controller('SignatureListController', ['$scope', '$state', '$translate', 'familySignatureServices', 'FamilyDoctorServices', function ($scope, $state, $translate, familySignatureServices, FamilyDoctorServices) {

                $scope.CurrentPage = 1;
                $scope.PageSize = 10;
                $scope.DoctorOrgID = "";

                $scope.TotalCount = 1;
                $scope.ListItems = [];                
                $scope.OrgList = [];

                // 获取甲方信息
                $scope.getOrgList = function ()
                {
                    FamilyDoctorServices.getOrgList({}, function (resp)
                    {
                        if (resp.Status == 0) {
                            $scope.OrgList = resp.Data
                        }
                    }, function () {

                        layer.msg("加载机构列表失败", { icon: 2, shade: 0.5 });
                    });
                }
                $scope.onKeywordKeyUp = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        $scope.onSearch();
                    }
                };
                $scope.onSearch = function ()
                {
                    $scope.loading = true;
                    familySignatureServices.searchSignatures({
                        DoctorOrgID:$scope.DoctorOrgID,
                        Keyword: $scope.Keyword,
                        PageSize: $scope.PageSize,
                        CurrentPage: $scope.CurrentPage,
                        Status: $scope.Status?[$scope.Status]:[]
                    }, function (response) {
                        $scope.loading = false;
                        $scope.ListItems = response.Data;
                        $scope.TotalCount = response.Total;
                    }, function () {

                        layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });
                        $scope.loading = false;

                    });
                };

                $scope.onDelete = function (item)
                {
                    var dialog = layer.confirm("删除后不能恢复，确认删除？", {
                        //暗转提示
                        title: "警告",
                        btn: ["否","是"] //按钮

                    }, function ()
                    {
                        layer.close(dialog)

                    }, function ()
                    {
                        layer.close(dialog)

                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2

                        familySignatureServices.delete({
                            SignatureID: item.SignatureID
                        }, function (response) {
                            $scope.onSearch();
                            layer.close(loading)
                            layer.msg("删除成功", { icon: 1, shade: 0.5 });

                        }, function () {
                            layer.close(loading)
                            layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });


                        });
                    
                    });
                }

                /*签约*/
                $scope.linkSignaDetail = function (item) {
                    if (item.SignatureID) {
                        $state.go('Doctor.FamilyDoctorManageSignatureEdit', { id: item.SignatureID })
                    } else {
                        $state.go('Doctor.FamilyDoctorManageSignatureEdit', { id: escape(JSON.stringify(item)) })
                    }
                }

                $scope.onInit = function () {
                    $scope.getOrgList();
                }

                $scope.onInit();
            }
            ]);
        });