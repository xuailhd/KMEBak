"use strict";
define(["module-directive-all-doctor",
        "module-services-api",
         "module-services-apiUtil",
        "css!framework/bootstrap/css/bootstrap-switch.css",
        "css!framework/bootstrap/css/bootstrap-switch-highlight.css", "plugins-dateTime"
       ],function () {

          var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            //国际化控制器
          app.controller('DoctorClinicSetController', ['$scope', "$state", '$translate', "doctorClinicServices", "$http",
                function ($scope, $state, $translate, doctorClinicServices, $http) {
                    $scope.Data = {};
                    $scope.tab = $state.params.tab || "ThisMonth";
                    $scope.month = "";
                    $scope.monthData = {};
                    $scope.ServiceClass = "";
                    $scope.preMonthDate = "";
                    $scope.curMonthDate = "";
                    $scope.nextMonthDate = "";
                    $scope.activeObj = {};
                    $scope.getRecordDate = {};
                    $scope.saveDate = [];
                  
                    function getSearchDateStr() {
                        var curDate = new Date(),
                            year = curDate.getFullYear(),
                            month = curDate.getMonth() + 1,
                            prevYear = year,
                            nextYear = year,
                            prevmonth = month - 1,
                            nextmonth = month + 1,
                            searchDateStr = "";
                        if (prevmonth < 1) {
                            prevYear -= 1;
                            prevmonth = 12;
                        };
                        if (nextmonth > 12) {
                            nextYear += 1;
                            nextmonth = 1;
                        };
                        searchDateStr = prevYear + prevmonth + "," + year + month + "," + nextYear + nextmonth;
                        return searchDateStr;
                    };

                    $scope.fn.onQuery = function () {
                        var monthStr = $scope.monthData.preMonthDate + "," + $scope.monthData.curMonthDate + "," + $scope.monthData.nextMonthDate;
                        doctorClinicServices.GetDoctorClinicPagelist({ month: monthStr }, function (response) {

                            $scope.Data = response.Data;
                            $scope.Data.AcceptCount = $scope.Data[0].AcceptCount;
                            $scope.Data.State = $scope.Data[0].State;
                            $scope.ServiceClass = $scope.Data.State ? "bootstrap-switch-container swiftMargin0" : "bootstrap-switch-container swiftMargin53";

                            for (var i = 0;i< $scope.Data.length; i++) {
                                $scope.activeObj[$scope.Data[i].ClinicMonth] = [];
                                if( $scope.Data[i].ClinicDates)
                                {
                                    var checksArr =$scope.Data[i].ClinicDates.split(",");
                                    for (var j = 0; j < checksArr.length; j++) {
                                        if (checksArr[j] != "") {
                                            $scope.activeObj[$scope.Data[i].ClinicMonth].push(checksArr[j]);
                                        }  
                                    }
                                }
                            };
                            //显示日历
                            $(".openSetTip").hide();
                            $(".dateSetBox").show();
                            var datetimeOpts = {
                                curDate: new Date(),
                                dateFormat: "yyyy年mm月",
                                minDate: new Date(),
                                activeObj: $scope.activeObj
                            };
                            var dateTime = new DateTime(datetimeOpts);
                            $scope.getRecordDate = dateTime.getRecordDate();
                        }, function (error) {
                            var errorTip = '<p>' + error.Msg + '</p>'
                            $(".openSetTip").html(errorTip).show();
                            $(".dateSetBox").hide();
                        });
                    }
                    
                    $scope.fn.onInit = function () {

                      
                        $scope.monthData = {
                            "curMonthDate": new Date().format("yyyyMM"),
                            "preMonthDate": new Date().addMonths(-1).format("yyyyMM"),
                            "nextMonthDate": new Date().addMonths(1).format("yyyyMM")
                        };
                    };

                    //保存义诊
                    $scope.onSubmit = function () {
                      //  console.log($scope.getRecordDate);
                        $scope.saveDate = $scope.Data;
                        for (var j in $scope.getRecordDate) {
                            var saveDateObj = {};
                            for (var i = 0; i < $scope.Data.length; i++) {
                                if ($scope.Data[i].ClinicMonth == j) {
                                    $scope.saveDate[i].AcceptCount = $scope.Data.AcceptCount;
                                    $scope.saveDate[i].State = $scope.Data.State;
                                    $scope.saveDate[i].ClinicDates = $scope.getRecordDate[j].join();
                                } /*else {
                                    saveDateObj["ClinicMonth"] = j;
                                    saveDateObj["ClinicDates"] = $scope.getRecordDate[j].join();

                                    saveDateObj["DoctorClinicID"] = $scope.Data[0].DoctorClinicID;
                                    saveDateObj["DoctorID"] = $scope.Data[0].DoctorID;
                                    saveDateObj["ServiceID"] = $scope.Data[0].ServiceID;
                                    $scope.saveDate.push(saveDateObj);
                                }*/
                            }
                            
                        };
                        doctorClinicServices.AddDoctorClinicData($scope.saveDate, function (response) {
                            layer.msg(response.Msg);
                        }, function (response) {
                            if (response.Msg) {
                                layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                            }
                            else
                            {
                                layer.msg("保存失败", { icon: 2, shade: 0.5 });
                            }
                        });
                    }

                    //开关方法
                    $scope.setSwitch = function () {
                        if ($scope.Data.State == true)
                        {
                            $scope.Data.State = false;
                            $scope.ServiceClass = "bootstrap-switch-container swiftMargin53"
                        }else
                        {
                            $scope.Data.State = true;
                            $scope.ServiceClass = "bootstrap-switch-container swiftMargin0"
                        }
                    }

                    $scope.fn.onInit();

                }]);
        });
