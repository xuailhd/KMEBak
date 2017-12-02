"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api",
        "css!styles/layout.schedules.min.css"], function () {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"
                ]);

            app.controller('SchedulesController', ['$scope', '$http', '$state', '$translate', 'doctorSchedulesServices',
                   function ($scope, $http, $state, $translate, doctorSchedulesServices) {
                       var flag = false;
                       $scope.scheList = [];
                       $scope.total = 1;
                       $scope.page = 1;
                       $scope.pageSize = 10;

                      
                       $scope.changeAnimate = function (e) {                          
                           var $target = $(e.target);
                           var $preWeek = $($target.parent().parent().children('.pre-week')[0])
                           var $nextWeek = $($target.parent().parent().children('.next-week')[0]);
                           var $table = $(e.target.parentElement.nextElementSibling);
                           if ($table.css('display') !== 'none') {
                               $preWeek.hide()
                               $nextWeek.hide();
                               $table.slideUp();
                               $target.css({
                                   transform: 'rotateX(180deg)'
                               })
                           } else {
                               $table.slideDown('normal', function () {
                                   $preWeek.show()
                                   $nextWeek.show();
                               })
                               $target.css({
                                   transform: 'rotateX(0deg)'
                               })
                           }
                           
                  
                       }

                       $scope.getList = function () {
                           var index = layer.load(1, {
                               shade: [0.1, '#f7f7f7'] //0.1透明度的白色背景
                           });
                           doctorSchedulesServices.getList({
                               PageSize: $scope.pageSize,
                               CurrentPage: $scope.page
                           }, function (response) {
                               layer.close(index)
                               if (response.Status === 0) {
                                   $scope.total = response.Total;
                                   $scope.scheList = response.Data;
                               }
                           }, function (ex) {
                               layer.close(index)
                           })
                       };
                       $scope.getList();

                       $scope.changeNextPage = function (id, beginTime, endTime, curTime, index) {
                           
                           if (flag) {
                               return
                           }
                           flag = true;
                           var endTime = endTime;
                           var curTime = curTime;
                           var nextWeekTime = new Date(curTime).addDays(7).format('yyyy-MM-dd')
                         
                           doctorSchedulesServices.changePage(
                               {
                                   NumberSourceID: id,
                                   Date: nextWeekTime
                               },
                               function (response) {
                                   $scope.scheList[index] = response.Data;
                                   flag = false;
                               },
                               function (error) {
                                   flag = false;
                               }
                           )
                       }
                       $scope.changePrePage = function (id, beginTime, endTime, curTime, index) {
                           if (flag) {
                               return
                           }
                           flag = true;

                           var beginTime = beginTime;
                           var curTime = curTime;  
                           var PreWeekTime = new Date(curTime).addDays(-7).format('yyyy-MM-dd')

                           doctorSchedulesServices.changePage(
                               {
                                   NumberSourceID: id,
                                   Date: PreWeekTime
                               },
                               function (response) {
                                   $scope.scheList[index] = response.Data
                                   flag = false;
                               },
                               function (error) {
                                   flag = false;
                               }
                           )
                       }
                       $scope.delList = function (i) {
                           layer.open({
                               title: '温馨提示',
                               content: '确定删除排班表？删除后排班表无法恢复',
                               yes: function (index, layero) {
                                   var id = $scope.scheList[i].NumberSourceID
                                   doctorSchedulesServices.del(
                                       {
                                           numberSourceID: id
                                       },
                                       function (response) {
                                           console.log(response);
                                           $scope.scheList.splice(i, 1)
                                           layer.close(index);
                                       },
                                       function (err) {
                                           console.error(err)
                                           layer.close(index);
                                       }
                                   )
                               },
                               cancel: function (index, layero) {
                                   layer.close(index);
                               }
                           });

                       };

                       $scope.stopList = function (i) {
                           var id = $scope.scheList[i].NumberSourceID
                           if ($scope.scheList[i].Status === 0) {
                               doctorSchedulesServices.changeStatus({
                                   BeginDate: $scope.scheList[i].BeginDate,
                                   EndDate: $scope.scheList[i].EndDate,
                                   NumberSourceID: id,
                                   Status: 1
                               }, function (response) {
                                   if (response.Status !== 0) {
                                       layer.msg(response.Msg);
                                       return
                                   } else {
                                       $scope.scheList[i].Status = 1
                                       layer.msg('启用成功');
                                   }
                                
                               }, function (err) {
                                   console.error(err)
                               })
                               return;
                           }
                           layer.open({
                               title: '温馨提示',
                               content: '确认停用？停用后该号源表已被预约的号源将继续生效',
                               yes: function (index, layero) {
                                   
                                   doctorSchedulesServices.changeStatus({
                                       NumberSourceID: id,
                                       Status: 0
                                   }, function (response) {
                                       layer.close(index);
                                       if (response.Status !== 0) {
                                           layer.msg(response.Msg);                                          
                                           return
                                       }
                                       $scope.scheList[i].Status = 0
                                      
                                   }, function (err) {
                                       console.error(err)
                                       layer.close(index);
                                   })
                               },
                               cancel: function (index, layero) {
                                   layer.close(index);
                               }
                           });
                       };
                      
                       $scope.editList = function (index) {
                           var id = $scope.scheList[index].NumberSourceID
                           $state.go('Doctor.ScheduleSettingsAdd', {
                               id: id
                           })
                       }
                   }
            ]);

            // 过滤器
            app.filter('filterLetterT', function () {
                return function (text) {
                    return text.split("T")[0];
                }
            });
        });