define(["module-services-api",
        "module-directive-bundling-doctor-all"], function (apiUtil) {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);

            app.controller('MyAccountController', ['$scope', 'webapiServices', "$state", '$translate', function ($scope, webapiServices, $state) {

                $scope.loginInfo = apiUtil.getLoginInfo();

                $scope.TransType = "0";
                $scope.Balance = 0;
                $scope.Available = 0;

                //获取账户的余额、可提现余额
                $scope.getMyAccount = function () {
                    webapiServices.getUserAccount({}, function (obj) {
                        if (obj.Status == 0 && obj.Data) {
                            $scope.Balance = obj.Data.Balance;
                            $scope.Available = obj.Data.Available;
                        }
                    });
                };
                $scope.getMyAccount();

                $scope.getShortCardCode = function (cardCode) {
                    if (cardCode == null || cardCode == "")
                        return "";
                    if (cardCode.length < 7)
                        return cardCode;
                    return cardCode.substr(0, 4) + "*****" + cardCode.substring(cardCode.length - 3);
                };

                //交易记录
                //查询条件
                $scope.page = 1;
                $scope.pageSize = 10;
                $scope.totalCount = 0;
                $scope.ListItems = [];
                $scope.getMyTrans = function () {
                    $scope.TransTypeTitle = EnumTransType[$scope.TransType] + "账单";
                    webapiServices.getUserTransPagelist({
                        TransType: $scope.TransType,
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.page
                    }, function (obj) {
                        if (obj.Data != null) {
                            $.each(obj.Data, function (i, d) {
                                d.TransTypeName = EnumTransType[d.TransType + ""];
                                d.Desc = d.TransTypeName;
                                switch (d.TransType) {
                                    case 1: d.TransTypeName += " (" + EnumOrderType[d.OrderType + ""] + ")";
                                        break;
                                    case 2: d.TransTypeName += " (" + EnumPayType[d.PayType + ""] + ")";
                                        break;
                                    case 3: d.TransTypeName += " (" + EnumOrderType[d.OrderType + ""] + "," + EnumPayType[d.PayType + ""] + ")";
                                        break;
                                    case 4: d.TransTypeName += " (" + $scope.getShortCardCode(d.CardCode) + ")";
                                        break;
                                    case 5: d.TransTypeName += " (" + EnumPayType[d.PayType + ""] + ")";
                                        break;
                                }
                                switch (d.Status) {
                                    case 0:
                                        d.StatusColor = { color: "green" };
                                        d.StatusName = "处理中";
                                        break;
                                    case 1:
                                        d.StatusColor = {};
                                        d.StatusName = "已完成";
                                        break;
                                    case 2:
                                        d.StatusColor = { color: "red" };
                                        d.StatusName = "已驳回";
                                        break;
                                }

                            });
                        }
                        $scope.ListItems = obj.Data;
                        $scope.totalCount = obj.Total;
                    });
                }

                var EnumTransType = {
                    "0": "全部",
                    "1": "收入",
                    "2": "充值",
                    "3": "消费",
                    "4": "提现",
                    "5": "退款",
                    "6": "中转",
                    "7": "补贴"
                }

                var EnumOrderType = {
                    "0": "挂号",
                    "1": "图文咨询",
                    "2": "语音问诊",
                    "3": "视频问诊",
                    "4": "处方支付",
                    "5": "家庭医生",
                    "6": "会员套餐",
                    "7": "远程会诊",
                    "8": "影像判读",
                    "9": "充值",
                    "10": "大师手法",
                    "11": "续费升级",
                    "100": "其他"
                }
                var EnumPayType = {
                    "0": "康美支付",
                    "1": "微信支付",
                    "2": "支付宝",
                    "3": "中国银联",
                    "4": "MasterCard",
                    "5": "PayPal",
                    "6": "VISA",
                    "7": "HIS",
                    "8": "余额付款",
                    "9": "线下付款"
                }


            }]);

        });


