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

        app.controller('HealthEducationListController',
            [
                '$scope',
                '$http',
                "$q",
                '$location',
                '$state',
                '$translate',
                'UserNoticeServices',
                function ($scope, $http, $q, $location, $state, $translate, UserNoticeServices) {

                    var NoticeType = {
                        "0": "系统公告",
                        "1": "系统公告",
                        "2": "订单消息",
                        "3": "业务消息",
                        "4": "系统公告",
                        "5": "服务消息"
                    };

                    $scope.page = 1;
                    $scope.pageSize = 10;
                    $scope.totalCount = 2;
                    $scope.loading = false;

                    $scope.onView = function (item) {

                        $scope.Detail = item;

                        $("#modal-HealthEducationDetail").modal("show")
                    }

                    $scope.onDelete = function (item) {

                        layer.msg("删除成功", {})
                    }

                    //我的消息列表
                    $scope.onSearch = function () {

                        $scope.loading = true;
                        UserNoticeServices.getMySentMsg({
                            PageSize: 10,
                            CurrentPage: 1,                            
                            NoticeSecondType: "0101021"//健康教育
                        }, function (obj) {

                            $scope.loading = false;
                            $scope.ListItems = obj.Data;
                        }, function () {
                            $scope.loading = false;
                        });
                    };

                }
            ]);
    }
);