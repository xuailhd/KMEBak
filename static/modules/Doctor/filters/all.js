define(["angular"], function (angular) {
    var app = angular.module("myApp", ["pascalprecht.translate", "ui.bootstrap"]);

    //设置显示的默认值
    app.filter('orderState', ['$translate', function ($translate) {
        return function (value) {
            if (value == -1) {
                return $translate.instant("Inquiries-lblToBeConfirmed"); // 待确认
            }
            else if(value == 0){
                return $translate.instant("Inquiries-lblToBePaid"); // 待支付
            }
            else if(value == 1){
                return $translate.instant("Inquiries-lblAlreadyPaid"); // 已支付
            }
            else if (value == 2) {
                return $translate.instant("Inquiries-lblHasBeenCompleted"); // 已完成
            }
            else if (value == 3) {
                return $translate.instant("Inquiries-lblHasBeenCanceled"); // 已取消
            }

            return $translate.instant("Inquiries-lblToBeConfirmed"); // 待确认;
        };
    }]);
});
