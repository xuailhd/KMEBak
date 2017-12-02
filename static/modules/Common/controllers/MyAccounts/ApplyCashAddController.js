"use strict";
define(["module-services-api",
        "module-directive-bundling-doctor-all"],
        function (apiUtil) {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            //国际化控制器
            app.controller('ApplyCashAddController', ['$scope', "$state", '$translate', "webapiServices",
                function ($scope, $state, $translate, webapiServices) {
                    $scope.model = {};
                    $scope.bankCardListItems = [];
                    $scope.BankCard = "";

                    //获取银行卡列表
                    webapiServices.getBankCardList({}, function (response) {
                        $scope.bankCardListItems = response.Data;
                    });

                    //获取银行列表
                    webapiServices.getBankList({}, function (response) {
                        $scope.bankList = response.Data;
                    });

                    //获取余额和可提现余额
                    webapiServices.getUserAccount({}, function (obj) {
                        if (obj.Status == 0 && obj.Data) {
                            $scope.Available = obj.Data.Available;
                            $scope.AvailableTxt = $scope.Available + "元";
                            $scope.config = obj.Data.Config;
                            //数据验证
                            jQuery.validator.addMethod("userAmountMin", function (value, element) {
                                return !isNaN(value) && parseFloat(value) >= $scope.config.CashMinLimit;
                            }, "提现金额不能小于" + $scope.config.CashMinLimit + "元");
                            jQuery.validator.addMethod("userAmountMax", function (value, element) {
                                if ($scope.config.CashMaxLimit > 0)
                                    return parseFloat(value) <= $scope.config.CashMaxLimit;
                                return true;
                            }, "提现金额不能大于" + $scope.config.CashMaxLimit + "元");
                        }
                    });

                    //选择银行卡
                    $scope.selectBankCard = function (item) {
                        $scope.BankCard = item.BankCardID;
                        $scope.model.CardCode = item.CardCode;
                        $scope.model.AccountName = item.AccountName;
                        $scope.model.Bank = item.Bank;
                        $scope.model.BankBarnch = item.BankBarnch || item.BankBranch;
                    };

                    //数据验证
                    jQuery.validator.addMethod("ltAmount", function (value, element) {
                        return parseFloat(value) <= $scope.Available;
                    }, "提现金额不能大于可用余额");

                    jQuery.validator.addMethod("selectBank", function (value, element) {
                        return $scope.model && $scope.model.Bank;
                    }, "请选择银行");

                    jQuery.validator.addMethod("bankCardCheck", function (value, element) {
                        return $scope.luhnCheck(value);
                    }, "银行卡号格式错误");

                    //表单验证
                    $("#myForm").validate({
                        submitHandler: function (form) {
                            $scope.onSave();
                        }
                    });

                    //保存方法
                    $scope.onSave = function () {
                        $scope.model.BankBranch = $scope.model.BankBarnch;
                        webapiServices.addUserCash($scope.model, function (result) {
                            if (result.Status == 0) {
                                layer.msg("申请成功,请耐心等待处理", { icon: 1 });
                                var loginInfo = apiUtil.getLoginInfo();
                                if (loginInfo.UserType == 1)
                                    $state.go("User.MyAccount");
                                else if (loginInfo.UserType == 2)
                                    $state.go("Doctor.MyAccount")

                            } else {
                                layer.msg(result.Msg, { icon: 2, shade: 0.5 });
                                return false;
                            }
                        },
                        function (response) {
                            layer.msg(response.Data.responseState, { icon: 2, shade: 0.5 });
                        });
                    }

                    //返回
                    $scope.onBack = function () {
                        history.back();
                    };

                    //luhn校验规则：16位银行卡号（19位通用）:
                    // 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
                    // 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
                    // 3.将加法和加上校验位能被 10 整除。
                    //bankno位银行卡号
                    $scope.luhnCheck = function (bankno) {

                        if (bankno)
                            bankno = bankno.replace(/ /g, '');

                        if (bankno.length < 16 || bankno.length > 19) {
                            return false;
                        }
                        var num = /^\d*$/; //全数字
                        if (!num.exec(bankno)) {
                            return false;
                        }
                        //开头6位
                        var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
                        if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
                            //银行卡号开头6位不符合规范
                            return false;
                        }

                        var lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhn进行比较）
                        var first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
                        var newArr = new Array();
                        for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
                            newArr.push(first15Num.substr(i, 1));
                        }
                        var arrJiShu = new Array();  //奇数位*2的积 <9
                        var arrJiShu2 = new Array(); //奇数位*2的积 >9

                        var arrOuShu = new Array();  //偶数位数组
                        for (var j = 0; j < newArr.length; j++) {
                            if ((j + 1) % 2 == 1) {//奇数位
                                if (parseInt(newArr[j]) * 2 < 9)
                                    arrJiShu.push(parseInt(newArr[j]) * 2);
                                else
                                    arrJiShu2.push(parseInt(newArr[j]) * 2);
                            }
                            else //偶数位
                                arrOuShu.push(newArr[j]);
                        }

                        var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
                        var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
                        for (var h = 0; h < arrJiShu2.length; h++) {
                            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
                            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
                        }

                        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
                        var sumOuShu = 0; //偶数位数组之和
                        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
                        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
                        var sumTotal = 0;
                        for (var m = 0; m < arrJiShu.length; m++) {
                            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
                        }

                        for (var n = 0; n < arrOuShu.length; n++) {
                            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
                        }

                        for (var p = 0; p < jishu_child1.length; p++) {
                            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
                            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
                        }
                        //计算总和
                        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

                        //计算luhn值
                        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
                        var luhn = 10 - k;

                        if (lastNum == luhn) {
                            //$("#banknoInfo").html("luhn验证通过");
                            return true;
                        }
                        else {
                            //$("#banknoInfo").html("银行卡号必须符合luhn校验");
                            return false;
                        }

                    }

                }]);
        });
