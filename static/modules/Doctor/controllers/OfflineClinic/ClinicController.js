"use strict";
define(["module-directive-bundling-doctor-all",
        "module-filter-all",
        "module-services-api"], function () {
         
            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);

            app.controller('DoctorClinicController', ['$scope', '$state', 'doctorTaskServices', '$translate', function ($scope, $state, doctorTaskServices, $translate) {
                var EnumGender = {
                    "N0": "男",
                    "N1": "女",
                    "N2": "未知"
                };
                $scope.page = 1;
                $scope.pageSize = 10;
                $scope.totalCount = 1;
                $scope.ListItems = [];
                $scope.RoomState = "0,1,2,3,4,6";

                //看过的病人
                $scope.onSearch = function (a) {

                    doctorTaskServices.getTaskList({
                        OPDType: [0],//查询出预约挂号
                        Keyword: $scope.Keyword,
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.page,
                        BeginDate: $scope.BeginDate,
                        EndDate: $scope.EndDate,
                        OrderType: 0,
                        RoomState: $scope.RoomState.split(",").map(function (item) {

                            return parseInt(item);

                        })

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

                $scope.UrlPrefix = global_StoreConfig.UrlPrefix;
            }
            ]);

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