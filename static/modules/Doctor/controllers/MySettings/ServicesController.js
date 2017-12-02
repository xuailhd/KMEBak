define(["module-directive-bundling-doctor-all",
        "module-services-api",
        "css!framework/bootstrap/css/bootstrap-switch.css",
        "css!framework/bootstrap/css/bootstrap-switch-highlight.css", "plugins-dateTime"],
        function () {

            var app = angular.module("myApp", [
        "pascalprecht.translate",
        'ui.router',
        "ui.bootstrap",
        "ngAnimate"]);
          
            //选项卡
            app.controller('ServicesController', ['$scope', '$state', function ($scope, $state) {
             
                $scope.tab = $state.params.tab || "Services";
                $scope.id = $state.params.id;
            }]);

            //服务设置
            app.controller('MyServicesController', ['$scope', "$state", '$translate', "doctorServiceServices",
                function ($scope, $state, $translate, doctorServiceServices) {
                
                    $scope.serviceListItems = [];

                    //获取医生价格服务列表                  
                    doctorServiceServices.get(null, function (response) {
                      
                        $scope.serviceListItems = [];
                        if (response.Status==0)
                        {
                            for (i = 0; i < response.Data.length; i++)
                            {
                                var docModel = response.Data[i];
                                var ServiceClass = docModel.ServiceSwitch == 1 ? "bootstrap-switch-container swiftMargin0" : "bootstrap-switch-container swiftMargin53";

                                $scope.serviceListItems.push({
                                    "ServiceID": docModel.ServiceID,
                                    "ServiceType": docModel.ServiceType,
                                    "ServiceTypeName": docModel.ServiceTypeName,
                                    "ServiceSwitch": docModel.ServiceSwitch,
                                    "ServicePrice": docModel.ServicePrice,
                                    "ServicePriceUp": docModel.ServicePriceUp,
                                    "ServicePriceDown": docModel.ServicePriceDown,
                                    "ServiceClass": ServiceClass
                                
                                });
                            }
                        }
                    },
                    function (response) {
                        layer.msg("加载数据失败", { icon: 2, shade: 0.5 });
                    });

                  
                    //保存方法
                    $scope.onSave = function () {
                        $("#myForm").validate({
                            submitHandler: function (form) {
                                form.submit();
                            }
                        });
                        var dataList = [];
                        for (i = 0; i < $scope.serviceListItems.length; i++)
                        {
                            var docModel = $scope.serviceListItems[i];
                            dataList.push({
                                "ServiceID": docModel.ServiceID,
                                "ServiceType": docModel.ServiceType,
                                "ServiceTypeName": docModel.ServiceTypeName,
                                "ServiceSwitch": docModel.ServiceSwitch,
                                "ServicePrice": docModel.ServicePrice
                            });
                        }
                        doctorServiceServices.update({ Data: dataList }, function (response) {
                            if (response.Status==0) {
                                layer.msg(response.Msg);                                
                            } else {
                                layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                            }
                            return false;
                        },
                        function (response) {
                            layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                        });
                    }

                    //开关方法
                    $scope.setSwitch = function (ServiceType) {
                        for (i = 0; i < $scope.serviceListItems.length; i++) {
                            if (ServiceType == $scope.serviceListItems[i].ServiceType) {
                                if ($scope.serviceListItems[i].ServiceSwitch == 1) {
                                    $scope.serviceListItems[i].ServiceClass = "bootstrap-switch-container swiftMargin53";
                                    $scope.serviceListItems[i].ServiceSwitch = 0;
                                    break;
                                } else if ($scope.serviceListItems[i].ServiceSwitch ==0) {
                                    $scope.serviceListItems[i].ServiceClass = "bootstrap-switch-container swiftMargin0";
                                    $scope.serviceListItems[i].ServiceSwitch = 1;
                                    break;
                                }
                            }
                        }
                    }

                    //家庭医生服务开关按钮
                    $scope.setSwitch3 = function (ServiceType)
                    {
                        if (ServiceType == 1 || ServiceType == 2 || ServiceType == 3 || ServiceType == 5 || ServiceType == 0)
                        {
                            $scope.setNoneFamileSwitch(ServiceType);

                        } else if (ServiceType == 4)
                        {
                            $scope.setFamileSwitch();
                        }
                    }

                    //非家庭医生服务开关控制
                    $scope.setNoneFamileSwitch = function (ServiceType)
                    {
                        for (i = 0; i < $scope.serviceListItems.length; i++)
                        {
                            if (ServiceType == $scope.serviceListItems[i].ServiceType)
                            {
                                if ($scope.serviceListItems[i].ServiceSwitch == 1)
                                {
                                    $scope.serviceListItems[i].ServiceClass = "bootstrap-switch-container swiftMargin53";
                                    $scope.serviceListItems[i].ServiceSwitch = 0;
                                }
                                else if ($scope.serviceListItems[i].ServiceSwitch == 0)
                                {
                                    $scope.serviceListItems[i].ServiceClass = "bootstrap-switch-container swiftMargin0";
                                    $scope.serviceListItems[i].ServiceSwitch = 1;
                                }
                            }
                        }

                        //如果关闭了语音、图文、视频时就要关闭家庭医生
                        if (ServiceType == 1 || ServiceType == 2 || ServiceType == 3)
                        {
                            //找出家庭医生服务并关闭
                            $scope.serviceListItems.filter(function (item) {

                                return item.ServiceType == 4

                            }).forEach(function (item) {

                                item.ServiceClass = "bootstrap-switch-container swiftMargin53";
                                item.ServiceSwitch = 0;
                            });
                        }
                    }

                    //家庭医生服务开关控制
                    $scope.setFamileSwitch = function () {

                        //家庭医生
                        var familyDoctorService = $scope.serviceListItems.filter(function (item) {
                            return item.ServiceType == 4;
                        })[0];

                        //语音、视频、图文咨询
                        var baseServices = $scope.serviceListItems.filter(function (item) {
                            return item.ServiceType == 1 || item.ServiceType == 2 || item.ServiceType == 3;
                        })
                        
                        //如果是打开的则关闭
                        if (familyDoctorService.ServiceSwitch == 1)
                        {
                            familyDoctorService.ServiceClass = "bootstrap-switch-container swiftMargin53";
                            familyDoctorService.ServiceSwitch = 0;
                        }                        
                        else if (familyDoctorService.ServiceSwitch == 0)
                        {
                            //所有服务都已经开启了才允许打开家庭医生
                            if (baseServices.filter(function (item) {

                                return item.ServiceSwitch == 1;

                            }).length == baseServices.length)
                            {
                                familyDoctorService.ServiceClass = "bootstrap-switch-container swiftMargin0";
                                familyDoctorService.ServiceSwitch = 1;
                            }
                            else
                            {
                                //提示用户需要打开 图文咨询、语音咨询、视频咨询
                                layer.msg("图文咨询、语音咨询、视频咨询同时开启状态，才能开启家庭服务");
                            }
                        }
                    }
                  
                }]);

            //义诊设置
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
                          doctorClinicServices.GetDoctorClinicPagelist({ ClinicMonth: monthStr }, function (response) {
                              $scope.Data = response.Data;
                              $scope.Data.AcceptCount = $scope.Data[0].AcceptCount;
                              $scope.Data.State = $scope.Data[0].State;
                              $scope.ServiceClass = $scope.Data.State ? "bootstrap-switch-container swiftMargin0" : "bootstrap-switch-container swiftMargin53";

                              for (var i = 0; i < $scope.Data.length; i++) {
                                  $scope.activeObj[$scope.Data[i].ClinicMonth] = [];
                                  if ($scope.Data[i].ClinicDates) {
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

                      $scope.fn.onInit = function ()
                      {

                      
                          $scope.monthData = {
                              "curMonthDate": new Date().format("yyyyMM"),
                              "preMonthDate": new Date().addMonths(-1).format("yyyyMM"),
                              "nextMonthDate": new Date().addMonths(1).format("yyyyMM")
                          };

                          $scope.fn.onQuery();

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
                          console.log("save:", $scope.saveDate);
                          doctorClinicServices.AddDoctorClinicData($scope.saveDate, function (response) {
                              layer.msg(response.Msg);
                          }, function (response) {
                              if (response.Msg) {
                                  layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                              }
                              else {
                                  layer.msg("保存失败", { icon: 2, shade: 0.5 });
                              }
                          });
                      }

                      //开关方法
                      $scope.setSwitch = function () {
                          if ($scope.Data.State == true) {
                              $scope.Data.State = false;
                              $scope.ServiceClass = "bootstrap-switch-container swiftMargin53"
                          } else {
                              $scope.Data.State = true;
                              $scope.ServiceClass = "bootstrap-switch-container swiftMargin0"
                          }
                      }

                      $scope.fn.onInit();

                  }]);
        });
