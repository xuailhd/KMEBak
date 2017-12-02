"use strict";
define(["module-directive-bundling-doctor-all",    
        "module-filter-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);


            /*
                   我的患者             
               */
            app.controller('MyCheckedPatientsController', ['$scope', '$state', 'webapiServices', '$translate', 'doctorTaskServices', function ($scope, $state, webapiServices, $translate, doctorTaskServices) {

                $scope.CommonApiUrl = global_ApiConfig.CommonApiUrl;
                $scope.page = 1;
                $scope.pageSize = 10;
                $scope.totalCount = 1;
                $scope.ListItems = [];
                $scope.RoomState = "0,1,2,3,4,6";
                $scope.BeginDate = null;
                $scope.EndDate = null;

                var EnumGender = {
                    "N0": "男",
                    "N1": "女",
                    "N2": "未知"
                };

                //看过的病人
                $scope.onSearch = function (a) {                
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

                    doctorTaskServices.getTaskList({
                        OPDType:[2,3],//查询语音和视频
                        Keyword: $scope.Keyword,
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.page,
                        RoomState: $scope.RoomState.split(',').map(function (item) {

                            return parseInt(item)
                        }),
                        BeginDate: beginDate,
                        EndDate: endDate,
                        OrderType: 0,
                        ResponseFilters: ["AttachFiles", "RecipeFiles"]
                    }, function (obj) {
                        if (obj.Data != null) {
                            $.each(obj.Data, function (i, d) {
                                d.Member.Gender = EnumGender["N" + d.Member.Gender];
                                d.Member.Age = getAge(d.Member.Birthday)
                            });
                        }
                        $scope.ListItems = obj.Data;
                        $scope.totalCount = obj.Total;
                    });
                };

                //查看会诊详情
                $scope.detail = function (item) {
                    $state.go("Doctor.MyServices.InquiriesDetail", { id: item.OPDRegisterID });
                };

            }
            ]);

            function getPreMonthDay(date, monthNum){
                var arr = date.split('-');
                var year = arr[0]; //获取当前日期的年份
                var month = arr[1]; //获取当前日期的月份
                var day = arr[2]; //获取当前日期的日

                var days = new Date(year, month, 0);
                days = days.getDate(); //获取当前日期中月的天数
                var year2 = year;
                var month2 = parseInt(month) - monthNum;
                if (month2 <=0) {
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

            //计算年龄
            function getAge(str) {

                var age = -1;
                if (str == null || str == "")
                    return age;

                var today = new Date();
                var todayYear = today.getFullYear();
                var todayMonth = today.getMonth() + 1;
                var todayDay = today.getDate();

                var birthday = new Date(str.substring(0, 4) + '/' + str.substring(5, 7) + '/' + str.substring(8));
                var birthdayYear = birthday.getFullYear();
                var birthdayMonth = birthday.getMonth() + 1;
                var birthdayDay = birthday.getDate();
                if (todayYear - birthdayYear < 0)
                    return age;

                if (todayMonth - birthdayMonth < 0) {
                    age = (todayYear - birthdayYear) - 1;
                } else if (todayMonth == birthdayMonth) {

                    if (todayDay - birthdayDay >= 0)
                        age = todayYear - birthdayYear;
                    else
                        age = todayYear - birthdayYear - 1;
                } else {
                    age = todayYear - birthdayYear;
                }

                return age;
            }
        });