define(["module-services-api",
        "module-directive-bundling-doctor-all"], function (apiUtil) {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);

            app.controller('RechargeController', ['$scope', 'webapiServices', "$state", '$translate', function ($scope, webapiServices, $state) {
                //充值方式
                $scope.PayWayList = [
                    { imgSrc: "/static/images/icon-payment_km.png", payWay: "0" },
                    { imgSrc: "/static/images/icon-payment_alipay.png", payWay: "2" },
                    { imgSrc: "/static/images/icon_payment_wechat.png", payWay: "1" }
                ];
                $scope.pay = {
                    OrderNo: "",
                    Subject: "",
                    TotalFee: 0,
                    Body: ""
                };

                $scope.PayWay = $scope.PayWayList[0].payWay;
                $scope.selectPayWay = function (payWay) {
                    $scope.PayWay = payWay;
                }

                $scope.recharge = function () {
                    $("#btnSubmit").attr("disabled", "disabled");
                    var data = {
                        RechargeAmount: $scope.RechargeAmount,
                        RechargeType: $scope.PayWay
                    };
                    webapiServices.userRecharge(data, function (result) {
                        if (result.Status == 0 && result.Data && result.Data.OrderNo) {
                            window.location.href = '/Trade/Order/Confirm?OrderNo=' + result.Data.OrderNo;
                            //$scope.pay = result.Data;
                            ////跳至支付
                            //var payForm = $("#payForm");
                            //switch ($scope.PayWay) {
                            //    case "0": payForm.action = "/Cashier/KMpay/Pay"; break;
                            //    case "1": payForm.action = "/Cashier/WxPay/Pay"; break;
                            //    case "2": payForm.action = "/Cashier/Alipay/Pay"; break;
                            //}
                            //payForm.submit();

                        }
                        else {
                            $("#btnSubmit").removeAttr("disabled");
                            layer.msg(result.Msg, { icon: 2, shade: 0.5 })
                        }

                    }, function (response) {
                        $("#btnSubmit").removeAttr("disabled");
                        layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                    });
                }

                //表单验证
                $("#myForm").validate({
                    submitHandler: function (form) {
                        $scope.recharge();
                    }
                });

                //获取余额和可提现余额
                webapiServices.getUserAccount({}, function (obj) {
                    if (obj.Status == 0 && obj.Data) {
                        $scope.config = obj.Data.Config;
                        $("#RechargeAmount").attr("placeholder", "请输入充值金额(" + $scope.config.RechargeMinLimit + "-" + $scope.config.RechargeMaxLimit + "元)");
                        //数据验证
                        jQuery.validator.addMethod("rechargeAmount", function (value, element) {
                            return !isNaN(value) && parseFloat(value) >= $scope.config.RechargeMinLimit && parseFloat(value) <= $scope.config.RechargeMaxLimit;
                        }, "充值金额限制在" + $scope.config.RechargeMinLimit + "-" + $scope.config.RechargeMaxLimit + "之间");
                    }

                });


                //返回
                $scope.onBack = function () {
                    var loginInfo = apiUtil.getLoginInfo();
                    if (loginInfo.UserType == 1)
                        $state.go("User.MyAccount");
                    else if (loginInfo.UserType == 2)
                        $state.go("Doctor.MyAccount")
                    //history.back();
                };



            }]);
        });
