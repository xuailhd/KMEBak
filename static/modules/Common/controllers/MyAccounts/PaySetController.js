define(["module-services-api",
        "module-directive-bundling-doctor-all"], function (apiUtil) {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);

            app.controller('PaySetController', ['$scope', 'webapiServices', "$state", '$translate', function ($scope, webapiServices, $state) {

                $scope.loginInfo = apiUtil.getLoginInfo();

                $scope.TransType = "0";
                $scope.Balance = 0;
                $scope.Available = 0;

                //获取账户的余额、可提现余额
                $scope.getMyAccount = function () {
                    webapiServices.getUserAccount({}, function (obj) {
                        if (obj.Status == 0 && obj.Data) {
                            $scope.Data = obj.Data;
                        }
                    });
                };
                $scope.getMyAccount();

                //刷新验证码
                $scope.refreshVerifyCode = function () {
                    apiUtil.getAppToken(function (token) {
                        $scope.VerificationCodeSrc = global_ApiConfig.CommonApiUrl + "/VerifyCodes?apptoken=" + token + "&" + Math.random();
                    });
                };
                $scope.refreshVerifyCode();

                //表单验证
                $("#myForm").validate({
                    submitHandler: function (form) {
                        $scope.onSubmit();
                    }
                });

                //提交
                $scope.onSubmit = function () {
                    if (!$scope.Data || !$scope.Data.User || !$scope.Data.User.Mobile) {
                        layer.msg("您还未绑定手机号，请先绑定手机号码", { icon: 2, shade: 0.5 });
                        return false;
                    }
                    webapiServices.setPayPassword($scope.Data, function (obj) {
                        if (obj.Data == 1) {
                            layer.msg("支付密码设置成功");
                            clearInterval(j);
                            history.back();
                        }

                    }, function (obj) {
                        if (obj.Data == "-1")
                            layer.msg("支付密码为6位字符串", { icon: 2, shade: 0.5 });
                        else if (obj.Data == "-2")
                            layer.msg("两次输入的密码不一致", { icon: 2, shade: 0.5 });
                        else if (obj.Data == "-3")
                            layer.msg("您还未绑定手机号，请先绑定手机号码", { icon: 2, shade: 0.5 });
                        else if (obj.Data == "-4")
                            layer.msg("对不起此短信验证码不存在或已经过期", { icon: 2, shade: 0.5 });
                        else
                            layer.msg("操作失败", { icon: 2, shade: 0.5 });
                    });
                };

                var z = 0;
                //发送验证码
                $scope.sendSmsInfo = function () {
                    var telephone = $scope.Data.User.Mobile;
                    if (telephone == null || telephone == "") {
                        layer.msg("您还未绑定手机号，请先绑定手机号码", { icon: 2, shade: 0.5 });
                        return false;
                    }

                    if ($("#myForm").validate().element($("#VerificationCode")) == false)
                        return false;

                    if (num > 0) {
                        layer.msg("验证码发送频率太快，稍后再试", { icon: 2, shade: 0.5 });
                        return false;
                    }

                    if (z != 0)
                        return false;
                    z = 1;
                    //发短信
                    webapiServices.sendSmsCode({ Mobile: telephone, MsgType: 3, VerifyCode: $scope.VerificationCode }, function (obj) {
                        if (obj.Status == 0) {
                            sendmsBack(obj.Status);
                        } else {
                            layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
                        }
                        z = 0;
                    }, function (obj) {
                        z = 0;
                        layer.msg(obj.Msg, { icon: 2, shade: 0.5 });
                    });
                }

                //发送验证码
                var num = 0;
                var j;
                var sendmsBack = function (resposeStatus) {
                    if (resposeStatus == 0) {
                        num = 60;
                        j = setInterval(calcSmsTime, 1000);
                        layer.msg("短信验证码发送成功");
                    } else {
                        layer.msg("短信验证码发送失败", { icon: 2, shade: 0.5 });
                    }
                    return false;
                };

                //倒计数过60秒可发送短信
                var calcSmsTime = function () {
                    num = num - 1;
                    if (num > 0) {
                        $("#msgVerifyCodBtn").val(num.toString() + " 秒后重新发送");
                    } else {
                        clearInterval(j);
                        $("#msgVerifyCodBtn").val("获取验证码");
                    }
                }

                //返回
                $scope.onBack = function () {
                    clearInterval(j);
                    history.back();
                };


            }]);

        });


