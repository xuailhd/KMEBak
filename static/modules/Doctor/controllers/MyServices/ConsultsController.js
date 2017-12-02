"use strict";
define(["module-directive-bundling-doctor-all",

        "module-services-api",
        "css!styles/layout.room.css"
        ], function () {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);


            //我的咨询（列表控制器）
            app.controller('MyConsultController', ['$scope',
                '$http',
                '$state',
                '$translate',
                '$modal',
                "userConsultsServices",
            function (
                $scope,
                $http,
                $state,
                $translate,
                $modal,
                userConsultsServices) {

                $scope.CurrentPage = 1;
                $scope.pageSize = 10;
                $scope.totalCount = 0;
                $scope.BeginDate = null;
                $scope.EndDate = null;

                var ConsultState = {
                    "N0": "未筛选",
                    "N1": "未领取",
                    "N2": "已领取",
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

                    if ($scope.BeginDate == "")
                        $scope.BeginDate = null;
                    if ($scope.EndDate == "")
                        $scope.EndDate = null;

                    var beginDate = $scope.BeginDate != null ? $scope.BeginDate : new Date(1990, 1, 1).format('yyyy-MM-dd');
                    var endDate = $scope.EndDate != null ? $scope.EndDate : new Date().format('yyyy-MM-dd');

                    if ($scope.BeginDate == null && $scope.EndDate == null) {
                        switch ($state.params.type) {
                            // 最近三天
                            case "1":
                                beginDate = new Date().addDays(-3).format('yyyy-MM-dd');
                                break;

                                // 最近一周
                            case "2":
                                beginDate = new Date().addDays(-7).format('yyyy-MM-dd');
                                break;

                            case "3":
                                beginDate = getPreMonthDay(endDate, 1);
                                break;
                        }
                    }

                    userConsultsServices.ConsultMe({
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.CurrentPage,
                        Keyword: $scope.Keyword,
                        BeginDate: beginDate,
                        EndDate: endDate,
                        ConsultState: $scope.Status == undefined || $scope.Status == "" ? null : $scope.Status,
                        InquiryType: 0,
                        OrderType: 0
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

                $scope.onShowServiceDetail = function (opdRegisterID) {
                    
                }

                function getPreMonthDay(date, monthNum) {
                    var arr = date.split('-');
                    var year = arr[0]; //获取当前日期的年份
                    var month = arr[1]; //获取当前日期的月份
                    var day = arr[2]; //获取当前日期的日

                    var days = new Date(year, month, 0);
                    days = days.getDate(); //获取当前日期中月的天数
                    var year2 = year;
                    var month2 = parseInt(month) - monthNum;
                    if (month2 <= 0) {
                        year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12);
                        month2 = 12 - (Math.abs(month2) % 12);
                    }
                    var day2 = day;
                    var days2 = new Date(year2, month2, 0);
                    days2 = days2.getDate();
                    if (day2 > days2) {
                        day2 = days2;
                    }
                    if (month2 < 10) {
                        month2 = '0' + month2;
                    }
                    var t2 = year2 + '-' + month2 + '-' + day2;
                    return t2;
                }
            }
            ]);

          
});