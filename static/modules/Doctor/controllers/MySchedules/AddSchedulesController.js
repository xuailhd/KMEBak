"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api",
        "css!styles/layout-addschedules.min.css"], function () {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);

            app.controller('AddSchedulesController', ['$scope', '$http', '$state', '$stateParams', '$translate', 'doctorSchedulesServices',
                   function ($scope, $http, $state, $stateParams, $translate, doctorSchedulesServices) {
                       var flag = true;

                       $scope.BeginDate = '';
                       $scope.EndDate = '';
                       $scope.Status = 0; //0-未启用 1-启用
                       $scope.paramsId = $stateParams.id;                     
                       $scope.title = '';
                       $scope.ScheduleList = {}
                                       
                       if (!$stateParams.id) {
                           $scope.title = '新增排班'
                           doctorSchedulesServices.get({}, function (response) {
                               if (response.Status !== 0) {
                                   layer.msg(response.Msg);
                                   return;
                               }
                               var scheList = response.Data.ScheduleList;   
                               for (var i = 0, len = scheList.length; i < len; i++) {
                                   var index = i;
                                   switch (scheList[index].TimePeriod) {
                                       case '上午':
                                           if (!$scope.ScheduleList['morning']) {
                                               $scope.ScheduleList['morning'] = []
                                           }
                                           $scope.ScheduleList['morning'].push({
                                               BeginTime: scheList[index].StartTime,
                                               EndTime: scheList[index].EndTime,
                                               DoctorSchedule: scheList[index].DoctorSchedule
                                           })
                                           break;
                                       case '下午':
                                           if (!$scope.ScheduleList['afternoon']) {
                                               $scope.ScheduleList['afternoon'] = []
                                           }
                                           $scope.ScheduleList['afternoon'].push({
                                               BeginTime: scheList[index].StartTime,
                                               EndTime: scheList[index].EndTime,
                                               DoctorSchedule: scheList[index].DoctorSchedule
                                           })
                                           break;
                                       case '晚上':
                                           if (!$scope.ScheduleList['night']) {
                                               $scope.ScheduleList['night'] = []
                                           }
                                           $scope.ScheduleList['night'].push({
                                               BeginTime: scheList[index].StartTime,
                                               EndTime: scheList[index].EndTime,
                                               DoctorSchedule: scheList[index].DoctorSchedule
                                           })
                                           break;
                                       default:
                                           if (!$scope.ScheduleList['other']) {
                                               $scope.ScheduleList['other'] = []
                                           }
                                           $scope.ScheduleList['other'].push({
                                               BeginTime: scheList[index].StartTime,
                                               EndTime: scheList[index].EndTime,
                                               DoctorSchedule: scheList[index].DoctorSchedule
                                           })
                                   }
                               }
                               console.log($scope.ScheduleList)
                           }, function (ex) {
                               console.error(ex)
                           })
                           


                           // 添加一行 0-上午 1-下午 2-晚上
                           $scope.addList = function (num) {
                               var newList = {
                                   BeginTime: '00:00',
                                   EndTime: '00:00',
                                   DoctorSchedule: [
                                       {
                                           Week: '1',
                                           Number: 0
                                       },
                                       {
                                           Week: '2',
                                           Number: 0
                                       },
                                       {
                                           Week: '3',
                                           Number: 0
                                       },
                                       {
                                           Week: '4',
                                           Number: 0
                                       },
                                        {
                                            Week: '5',
                                            Number: 0
                                        },
                                        {
                                            Week: '6',
                                            Number: 0
                                        },
                                        {
                                            Week: '7',
                                            Number: 0
                                        }
                                   ]
                               };
                               if (typeof num !== 'number') {
                                   return;
                               }
                               if (num === 0) {
                                   $scope.ScheduleList.morning.push(newList);
                               }
                               if (num === 1) {
                                   $scope.ScheduleList.afternoon.push(newList);
                               }
                               if (num === 2) {
                                   $scope.ScheduleList.night.push(newList);
                               }
                           }
                       
                       } 


                       if ($stateParams.id) {
                           $scope.title = '修改排班'
                           doctorSchedulesServices.changePage({
                               NumberSourceID: $stateParams.id,
                               IsNullRow: true
                           }, function (response) {
                               // 1302 - 该号源表生效时间与其它号源表生效时间重叠
                               if (response.Status !== 0) {
                                   layer.msg(response.Msg);
                                   return;
                               }
                               $scope.BeginDate = response.Data.BeginDate.split('T')[0]
                               $scope.EndDate = response.Data.EndDate.split('T')[0]
                               var scheList = response.Data.TableSchedule.ScheduleList;
                               for (var i = 0, len = scheList.length; i < len; i++) {
                                   var index = i;
                                   switch (scheList[index].TimePeriod) {
                                       case '上午':
                                           if (!$scope.ScheduleList['morning']) {
                                               $scope.ScheduleList['morning'] = []
                                           }
                                           $scope.ScheduleList['morning'].push({
                                               BeginTime: scheList[index].StartTime,
                                               EndTime: scheList[index].EndTime,
                                               DoctorSchedule: scheList[index].DoctorSchedule
                                           })
                                           break;
                                       case '下午':
                                           if (!$scope.ScheduleList['afternoon']) {
                                               $scope.ScheduleList['afternoon'] = []
                                           }
                                           $scope.ScheduleList['afternoon'].push({
                                               BeginTime: scheList[index].StartTime,
                                               EndTime: scheList[index].EndTime,
                                               DoctorSchedule: scheList[index].DoctorSchedule
                                           })
                                           break;
                                       case '晚上':
                                           if (!$scope.ScheduleList['night']) {
                                               $scope.ScheduleList['night'] = []
                                           }
                                           $scope.ScheduleList['night'].push({
                                               BeginTime: scheList[index].StartTime,
                                               EndTime: scheList[index].EndTime,
                                               DoctorSchedule: scheList[index].DoctorSchedule
                                           })
                                           break;
                                       default:
                                           $scope.ScheduleList['other'].push({
                                               BeginTime: scheList[index].StartTime,
                                               EndTime: scheList[index].EndTime,
                                               DoctorSchedule: scheList[index].DoctorSchedule
                                           })
                                   }
                               }
                           }, function (err) {
                               console.error(err)
                           })
                       }

                       // 减少数量
                       $scope.reduceSche = function (sche, str, key) {
                           var num = 0;
                           if (typeof str !== 'string') {
                               return;
                           }

                           if (sche.Number <= 0) {
                               return;
                           }
                           switch (str) {
                               case 'morning':
                                   num = +$scope.ScheduleList.morning[key].DoctorSchedule[sche.Week - 1].Number;
                                   if (num < 5) {
                                       $scope.ScheduleList.morning[key].DoctorSchedule[sche.Week - 1].Number = 0;
                                   } else {
                                       $scope.ScheduleList.morning[key].DoctorSchedule[sche.Week - 1].Number = num - 5;
                                   }                              
                                   break;
                               case 'afternoon':
                                   num = +$scope.ScheduleList.afternoon[key].DoctorSchedule[sche.Week - 1].Number;
                                   if (num < 5) {
                                       $scope.ScheduleList.afternoon[key].DoctorSchedule[sche.Week - 1].Number = 0
                                   } else {
                                       $scope.ScheduleList.afternoon[key].DoctorSchedule[sche.Week - 1].Number = num - 5;
                                   }
                                   break;
                               case 'night':
                                   num = +$scope.ScheduleList.night[key].DoctorSchedule[sche.Week - 1].Number
                                   if (num < 5) {
                                       $scope.ScheduleList.night[key].DoctorSchedule[sche.Week - 1].Number = 0;
                                   } else {
                                       $scope.ScheduleList.night[key].DoctorSchedule[sche.Week - 1].Number = num - 5;
                                   }
                                   
                               default:
                                   return false;
                           }
     
                       };
                       // 增加数量
                       $scope.addSche = function (sche, str, key) {
                           if (typeof str !== 'string') {
                               return;
                           }
                           if (sche.Number >= 150) {
                               return;
                           }
                           var num = 0;
                           switch (str) {
                               case 'morning':
                                   num = +$scope.ScheduleList.morning[key].DoctorSchedule[sche.Week - 1].Number;
                                   if (num >= 145) {
                                       $scope.ScheduleList.morning[key].DoctorSchedule[sche.Week - 1].Number = 150;
                                   } else {
                                       $scope.ScheduleList.morning[key].DoctorSchedule[sche.Week - 1].Number = num + 5;
                                   }
                                   break;
                               case 'afternoon':
                                   num = +$scope.ScheduleList.afternoon[key].DoctorSchedule[sche.Week - 1].Number;
                                   if (num >= 145) {
                                       $scope.ScheduleList.afternoon[key].DoctorSchedule[sche.Week - 1].Number = 150
                                   } else {
                                       $scope.ScheduleList.afternoon[key].DoctorSchedule[sche.Week - 1].Number = num + 5;
                                   }
                                   break;
                               case 'night':
                                   num = +$scope.ScheduleList.night[key].DoctorSchedule[sche.Week - 1].Number
                                   if (num >= 145) {
                                       $scope.ScheduleList.night[key].DoctorSchedule[sche.Week - 1].Number = 150;
                                   } else {
                                       $scope.ScheduleList.night[key].DoctorSchedule[sche.Week - 1].Number = num + 5;
                                   }

                               default:
                                   return false;
                           }
                       }                  
                       // 保存
                       $scope.saveHandle = function () {
                           if (!flag) {
                               return;
                           }
                           flag = false;
                           if (!$scope.BeginDate) {
                               flag = true;
                               layer.msg('请填写起始时间');
                               return false;
                           }
                           if (!$scope.EndDate) {
                               flag = true;
                               layer.msg('请填写结束时间')
                               return false;
                           }
                           if ($scope.BeginDate > $scope.EndDate) {
                               flag = true;
                               layer.msg('开始时间必须小于结束时间');
                               return false;
                           }

                           var ScheduleListArr = []; 
                           if ($scope.ScheduleList.morning && $scope.ScheduleList.morning.length > 0) {
                               ScheduleListArr = $scope.ScheduleList.morning
                           }
                           if ($scope.ScheduleList.afternoon && $scope.ScheduleList.afternoon.length > 0) {
                               ScheduleListArr = ScheduleListArr.concat($scope.ScheduleList.afternoon)
                           }
                           if ($scope.ScheduleList.night && $scope.ScheduleList.night.length > 0) {
                               ScheduleListArr = ScheduleListArr.concat($scope.ScheduleList.night)
                           }
                           if (!!$stateParams.id) {
                                doctorSchedulesServices.update(
                                   {
                                       NumberSourceID: $stateParams.id,
                                       BeginDate: $scope.BeginDate,
                                       EndDate: $scope.EndDate,
                                       Status: 0,
                                       ScheduleList: ScheduleListArr
                                   },
                                   function (response) {
                                       flag = true;
                                       layer.msg(response.Msg)
                                       if (response.Status == 0) {
                                           $state.go('Doctor.ScheduleSettings')
                                       }
                                       
                                   },
                                   function (err) {
                                       flag = true;
                                       layer.msg(err.Msg)
                                   }
                                )
                           } else {
                               doctorSchedulesServices.insert({
                                   BeginDate: $scope.BeginDate,
                                   EndDate: $scope.EndDate,
                                   Status: 0,
                                   ScheduleList: ScheduleListArr
                               }, function (response) {
                                   flag = true;
                                   layer.msg(response.Msg)
                                   if (response.Status == 0) {
                                       $state.go('Doctor.ScheduleSettings')
                                   }
                               }, function (err) {
                                   flag = true;
                                   layer.msg(err.Msg)
                               })
                           }

                       };
                       // 启用
                       $scope.addHandle = function () {
                           if (!flag) {
                               return;
                           }
                           flag = false;
                           if (!$scope.BeginDate) {
                               flag = true;
                               layer.msg('请填写起始时间');
                               return false;
                           }
                           if (!$scope.EndDate) {
                               flag = true;
                               layer.msg('请填写结束时间');
                               return false;
                           }
                           if ($scope.BeginDate > $scope.EndDate) {
                               flag = true;
                               layer.msg('开始时间必须小于结束时间');
                               return false;
                           }

                           var ScheduleListArr = [];
                           if ($scope.ScheduleList.morning && $scope.ScheduleList.morning.length > 0) {
                               ScheduleListArr = $scope.ScheduleList.morning
                           }
                           if ($scope.ScheduleList.afternoon&&$scope.ScheduleList.afternoon.length > 0) {
                               ScheduleListArr = ScheduleListArr.concat($scope.ScheduleList.afternoon)
                           }
                           if ($scope.ScheduleList.night&&$scope.ScheduleList.night.length > 0) {
                               ScheduleListArr = ScheduleListArr.concat($scope.ScheduleList.night)
                           }
                           if (!!$stateParams.id) {
                               doctorSchedulesServices.update(
                                   {
                                       NumberSourceID: $stateParams.id,
                                       BeginDate: $scope.BeginDate,
                                       EndDate: $scope.EndDate,
                                       Status: 1,
                                       ScheduleList: ScheduleListArr
                                   },
                                   function (response) {
                                       flag = true;
                                       layer.msg(response.Msg)
                                       if (response.Status == 0) {
                                           $state.go('Doctor.ScheduleSettings')
                                       }
                                   },
                                   function (err) {
                                       flag = true;
                                       layer.msg(err.Msg)
                                   }
                                )
                           } else {
                               doctorSchedulesServices.insert({
                                   BeginDate: $scope.BeginDate,
                                   EndDate: $scope.EndDate,
                                   Status: 1,
                                   ScheduleList: ScheduleListArr
                               }, function (response) {
                                   flag = true;
                                   layer.msg(response.Msg)
                                   if (response.Status == 0) {
                                       $state.go('Doctor.ScheduleSettings')
                                   }
                               }, function (err) {
                                   flag = true;
                                   layer.msg(err.Msg)
                               })
                           }
                       }
                   }
            ]);


        });