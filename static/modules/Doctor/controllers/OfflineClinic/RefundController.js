"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            //我的咨询（列表控制器）
            app.controller('OfflineClinicRefundController', ['$scope',
                '$http',
                '$state',
                '$translate',               
                "doctorPatientsServices",
            function (
                $scope,
                $http,
                $state,
                $translate,            
                doctorPatientsServices) {

             
                $scope.CurrentPage = 1;
                $scope.pageSize = 10;
                $scope.totalCount = 0;
                $scope.RefundState = "0";
                $scope.OrderState = "0";

                //返回结果
                $scope.ListItems = [];

                //后台医生之我的问题
                $scope.onSearch = function () {
                    $scope.ListItems = [];
                

                    //未退款（查询未退款的时候仅查询已经支付的订单）
                    if ($scope.RefundState == 0) {
                        //已经支付
                        $scope.OrderState = 1;
                    }
                    //查询退款中、已退款、退款失败、已申请退款(订单状态是已取消)
                    else
                    {
                        //已经取消
                        $scope.OrderState = 3;
                    }
                  
                    doctorPatientsServices.getPatientRecipePageList({
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.CurrentPage,
                        Keyword: $scope.AllKeyword,
                        BeginDate: $scope.AllBeginDate,
                        EndDate: $scope.AllEndDate,
                        RefundState: $scope.RefundState,
                        OrderState: $scope.OrderState
                    }, function (obj) {

                        $scope.ListItems = obj.Data;
                        $scope.totalCount = obj.Total;
                    });
                };
                //退费
                $scope.onRefund = function (item)
                {
                    var confirm=layer.prompt({ title: '请输入退款原因，并确认', formType: 2 }, function (text, index)
                    {
                        layer.close(confirm);

                        var loading = layer.load(0, { shade: [0.1, '#000'] });
                      
                        //发送退款申请
                        doctorPatientsServices.refundPatientRecipe({
                            OPDRegisterID: item.BillIn.ServiceID,
                            BillInNo: item.BillIn.BillInNo,
                            Reason: text
                        }, function (resp) {
                                               
                            $scope.onSearch();
                            layer.close(loading)
                            layer.msg($translate.instant("Room-lblSuccess"))

                        }, function () {
                            layer.close(loading)
                            layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })

                        })
                       
                       
                    });
                }

            }
]);
          
});