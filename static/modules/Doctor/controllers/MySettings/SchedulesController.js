"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {
            
     var app = angular.module("myApp", [
      "pascalprecht.translate",
      'ui.router',
      "ui.bootstrap",
      "ngAnimate"]);

     app.controller('SchedulesController', ['$scope', '$http', '$state', '$translate', 'schedulesServices', 'doctorSchedulesServices',
            function ($scope, $http, $state, $translate, schedulesServices, doctorSchedulesServices) {
                //添加一天
                var AddDays = function (date, value) {
                    date.setDate(date.getDate() + value);
                    return date;
                }
                //周一 
                var Monday = AddDays(new Date(), -(new Date().getDay() == 0 ? 7 : new Date().getDay()) + 1);

                $scope.Data = {};
                //默认下周
                $scope.BeginDate = Monday;
                $scope.tab = $state.params.tab || "ThisWeek"
                //页面初始化
                $scope.onInit = function () {

                    //下周
                    if ($scope.tab == 'NextWeek')
                    {
                        $scope.BeginDate = AddDays(Monday, 7).format("yyyy/MM/dd");
                    }
                    //上周
                    else if ($scope.tab == 'PrevWeek')
                    {                        
                        $scope.BeginDate = AddDays(Monday, -7).format("yyyy/MM/dd")
                    }
                    //本周
                    else if ($scope.tab == 'ThisWeek')
                    {
                        $scope.BeginDate = Monday.format("yyyy/MM/dd")
                    
                    }
                    
                    //加载数据
                    $scope.promise = schedulesServices.get({ BeginDate: $scope.BeginDate, Days: 7 }, function (obj) {
                        $scope.Data.DateWeekList = obj.Data.DateWeekList;
                        $scope.Data.ScheduleList = obj.Data.ScheduleList;
                    });
                };

                $scope.checkClick = function (item) {
                    if (!item.Disable) {
                        if (!item.Checked) {//没有安排排班去排班
                            item.Checked = true;
                        } else {//安排了排班去取消
                            if (item.ScheduleID != undefined && item.ScheduleID.length > 0) {
                                schedulesServices.exist({ ScheduleID: item.ScheduleID }, function (obj) {
                                    if (obj.Data) {
                                        layer.msg("已有" + obj.Total + "人预约，不能取消", { icon: 2, shade: 0.5, time: 1000 })
                                        item.Checked = true;
                                    } else {
                                        item.Checked = false;
                                    };
                                });

                            } else {
                                item.Checked = false;
                            };
                        }
                    } else {
                        return false;
                    }
                };

                //保存
                $scope.onSubmit = function () {

                    doctorSchedulesServices.update({ BeginDate: $scope.BeginDate, Data: $scope.Data.ScheduleList }, function (response) {

                        layer.msg($translate.instant('msgSaveSuccess'));
                    }, function () {

                        layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                    });

                }  
                $scope.Check = function (i) {
                    layer.msg(i);                    
                }
                $scope.onInit();



            }
            ]);


        });