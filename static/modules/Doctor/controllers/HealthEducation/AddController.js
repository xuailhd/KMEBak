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

        app.controller('FamilyServiceDetailController',
            [
                '$scope',
                '$http',
                "$q",
                '$location',
                '$state',
                '$translate',
                'UserNoticeServices',
                "personTagAliasServices",
                function ($scope, $http, $q, $location, $state, $translate, UserNoticeServices, personTagAliasServices) {
                  
                    $scope.Title = "";
                    $scope.Tag = "";
                    $scope.Content = "";

                    $scope.onSubmit = function ()
                    {
                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2

                        UserNoticeServices.push({
                            Model: {
                                "Title": $scope.Title,
                                "Summary": $scope.Tag,
                                "Content": $scope.Content,
                                "NoticeSecondType": "0101021"
                            },
                            //机构表情+疾病标签（仅发送给此机构下疾病关联的用户）
                            ToUserList: [
                                "PersonnelTag:"+$scope.Tag,
                                "OwnerOrgID:" + global_doctorInfo.HospitalID],
                            ToUserListType: "Tag"
                        }, function (resp) {

                            layer.close(loading)

                            if (resp.Status == 0)
                            {
                                layer.msg("提交成功", { icon: 1, shade: 0.5 });
                            }
                            else
                            {
                                layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });
                            }

                        }, function ()
                        {
                            layer.close(loading)
                            layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });
                        })
                    }

                    $scope.getTagAlias = function ()
                    {
                        personTagAliasServices.getTagAlias({}, function (resp) {

                            if (resp.Status == 0) {
                                $scope.Tags = resp.Data;
                            }
                            else
                            {
                                layer.msg("获取收信对象失败", { icon: 2, shade: 0.5 });

                            }
                        }, function ()
                        {
                            layer.msg("获取收信对象失败", { icon: 2, shade: 0.5 });

                        })
                    }

                    $scope.getTagAlias();
                }
            ]);
    }
);