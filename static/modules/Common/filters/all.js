define(["angular"], function (angular) {
    var app = angular.module("myApp", ["ui.bootstrap"]);
    var dict = {};
    app.filter('option', ["$q", "optionsServices", "$rootScope", function ($q, optionsServices, $rootScope) {

        function getNameByKey(options, key) {
            if (options == null || options.length == 0 || key == null || $.trim(key) == "") {
                return "";
            }

            for (var i = 0; i < options.length; i++) {
                if (options[i].Key == key)
                    return options[i].Value;
            }

            return "";
        }

        //获取字典中的名称
        function GetOptions(optionName, key) {
            var deferred = $q.defer();//声明承诺      
            var name = "";

            if (dict[optionName]) {
                name = getNameByKey(dict[optionName], key);
                deferred.resolve(name);//请求成功
            }
            else {
                //服务器获取数据
                optionsServices.get({ optionName: $.trim(optionName) }, function (response) {
                    if (response.Data != null) {
                        dict[optionName] = response.Data;
                    }
                    else {
                        dict[optionName] = [];
                    }

                    name = getNameByKey(dict[optionName], key);


                    deferred.resolve(name);

                }, function () {

                    deferred.reject(name); //请求失败
                });
            }

            return deferred.promise;
        }

        function optionFilter(input, optionName) {
            var promise = GetOptions(optionName, input);

            return promise;
        }

        optionFilter.$stateful = true;

        return optionFilter;

    }]);
    //截取路径文件名称
    app.filter('fileName', function () {
        return function (value) {
            if (!value) return '';

            var start = value.lastIndexOf('/');
            if (start > 0) {
                if (value.lastIndexOf('\\') > start)
                    start = value.lastIndexOf('\\');
            }
            else {
                start = value.lastIndexOf('\\');
            }
            if (start >= 0) {
                return value.substring(start + 1);
            }
            return value;
        };
    });
    //设置显示的默认值
    app.filter('defaultValue', function () {
        return function (value, defaultValue) {
            if (value == undefined || value == null || value == '')
                return defaultValue;

            return value;
        };
    });
    //订单支付状态
    app.filter('orderPayType', function () {
        return function (order, defaultValue) {
            if (order == undefined || order == null)
                return defaultValue || '';
            var value = '';
            switch(order.PayType)
            {
                case 0: value = '康美支付'; break;
                case 1: value = '微信支付'; break;
                case 2: value = '支付宝支付'; break;
                case 3: value = '中国银联支付'; break;
                case 4: value = 'MasterCard'; break;
                case 5: value = 'PayPal'; break;
                case 6: value = 'VISA'; break;
                case 7: value = 'HIS'; break;
                case 8: value = '余额支付'; break;
                case 9: value = '线下支付'; break;
                case -1: {
                    value = '免支付';
                    switch(order.CostType)
                    {
                        case 1: value = '免费'; break;
                        case 2: value = '义诊'; break;
                        case 3: value = '套餐消费'; break;
                        case 4: value = '会员'; break;
                        case 5: value = '家庭医生'; break;
                        case 6: value = '机构套餐'; break;
                        case 7: value = '余额'; break;
                    }
                }; break;
            }
            return value;
        };
    });
    //限制显示的最大字符数
    app.filter('maxLength', function () {
        return function (value, maxLength) {
            if (!value) return '';
            if (value.length > maxLength) {
                value = value.substring(0, maxLength) + "...";
            }
            return value;
        };
    });
    app.directive('typeaheadFocus', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                element.bind('click', function () {
                    if (ngModel.$viewValue == undefined || ngModel.$viewValue == '')
                    {
                        ngModel.$viewValue = '*';
                    }
                    ngModel.$parsers[0](ngModel.$viewValue);
                    var width = element.width();
                    element.parent().find('.dropdown-menu').css({ 'max-height': '300px', 'overflow-y': 'scroll', 'width': width + 'px' });
                });
                element.bind('blur', function () {
                    if (ngModel.$viewValue == '*') {
                        ngModel.$viewValue = '';
                    }
                });
            }
        };
    });
});