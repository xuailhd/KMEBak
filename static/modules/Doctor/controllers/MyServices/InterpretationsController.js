"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);


            //我的咨询（列表控制器）
            app.controller('InterpretationsController', ['$scope',
                '$http',
                '$state',
                '$translate',               
                "userConsultsServices",
            function (
                $scope,
                $http,
                $state,
                $translate,            
                userConsultsServices) {

                $scope.CurrentPage = 1;
                $scope.pageSize = 10;
                $scope.totalCount = 0;

                var ConsultState = {
                    "N0": "未回复",
                    "N1": "未回复",
                    "N2": "未回复",
                    "N3": "未回复",
                    "N4": "已回复",
                    "N5": "已完成"
                };
                //咨询类型（0-付费、1-免费、2-义诊、3-套餐、4-会员、5-家庭医生）
                var ConsultType = {
                    "N0": "付费",
                    "N1": "免费",
                    "N2": "义诊",
                    "N3": "套餐",
                    "N4": "会员",
                    "N5": "家庭医生"
                };

                $scope.ConsultTypes = [];

                for (var key in ConsultType) {
                    $scope.ConsultTypes.push({ Value: key.substring(1), Text: ConsultType[key] });
                }

                //返回结果
                $scope.ListItems = [];

                //后台医生之我的问题
                $scope.onSearch = function () {
                    $scope.ListItems = [];
                    userConsultsServices.ConsultMe({
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.CurrentPage,
                        Keyword: $scope.AllKeyword,
                        BeginDate: $scope.AllBeginDate,
                        EndDate: $scope.AllEndDate,
                        InquiryType: 1
                    }, function (obj) {
                        if (obj.Data != null) {
                            $.each(obj.Data, function (i, d) {
                                d.ConsultTypeName = ConsultType["N" + d.ConsultType];
                                d.ConsultStateName = ConsultState["N" + d.ConsultState];
                                if (d.ConsultContent != null && d.ConsultContent.length > 20)
                                    d.ConsultContent = d.ConsultContent.substring(0, 20) + "...";
                            })
                        }
                        $scope.ListItems = obj.Data;
                        $scope.totalCount = obj.Total;
                    });
                };

            }
            ]);

          
});