define(["angular",
        "jquery",
        "jquery-validate", ], function (angular,$, validatePlugin) {
       
            var app = angular.module("myApp", []);

            app.directive('formValidate', function () {
                return {
                    restrict: 'A',
                    scope: {
                        onsubmit: '&onSubmit'
                    },
                    link: function (scope, $element, attr) {

                        $.validator.addMethod("selected", function (value, element, params) {

                            if (value != "string:" && value != "?" && value != "") {
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                        $.validator.addMethod("mobile", function (value, element) {
                            var length = value.length;
                            var mobile = /^(1[34578]\d{9})$/
                            return this.optional(element) || (length == 11 && mobile.test(value));
                        }, "手机号码格式错误");
                        $.validator.addMethod("zipCode", function (value, element) {
                            var tel = /^[0-9]{6}$/;
                            return this.optional(element) || (tel.test(value));
                        }, "邮政编码格式错误");

                        $.validator.addMethod("idNumber", function (value, element) {
                            if (value == null)
                                value = "";
                            return this.optional(element) || (isIdNumber(value.toUpperCase()));
                        }, "身份证号不正确");
                        //身份证号码验证
                        function isIdNumber(num) {
                            var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
                            var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                            var varArray = new Array();
                            var intValue;
                            var lngProduct = 0;
                            var intCheckDigit;
                            var intStrLen = num.length;
                            var idNumber = num;
                            if ((intStrLen != 15) && (intStrLen != 18)) {
                                return false;
                            }

                            // check and set value
                            for (var i = 0; i < intStrLen; i++) {
                                varArray[i] = idNumber.charAt(i);
                                if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                                    return false;
                                } else if (i < 17) {
                                    varArray[i] = varArray[i] * factorArr[i];
                                }
                            }

                            if (intStrLen == 18) {
                                //check date
                                var date8 = idNumber.substring(6, 14);
                                if (isDate8(date8) == false) {
                                    return false;
                                }
                                // calculate the sum of the products
                                for (var i = 0; i < 17; i++) {
                                    lngProduct = lngProduct + varArray[i];
                                }
                                // calculate the check digit
                                intCheckDigit = parityBit[lngProduct % 11];
                                // check last digit
                                if (varArray[17] != intCheckDigit) {
                                    return false;
                                }
                            }
                            else {        //length is 15
                                //check date
                                var date6 = idNumber.substring(6, 12);
                                if (isDate6(date6) == false) {

                                    return false;
                                }
                            }
                            return true;
                        };

                        //判断是否为“YYMMDD”式的时期
                        function isDate6(sDate) {
                            if (!/^[0-9]{6}$/.test(sDate)) {
                                return false;
                            }
                            var year, month, day;
                            year = parseInt("19" + sDate.substring(0, 2));
                            month = sDate.substring(2, 4);
                            day = sDate.substring(4, 6);
                            if (year < 1700 || year > 2500) return false;
                            if (month < 1 || month > 12) return false;
                            if (day < 1 || day > 31) return false;
                            return true
                        };
                        //判断是否为“YYYYMMDD”式的时期
                        function isDate8(sDate) {
                            if (!/^[0-9]{8}$/.test(sDate)) {
                                return false;
                            }
                            var year, month, day;
                            year = sDate.substring(0, 4);
                            month = sDate.substring(4, 6);
                            day = sDate.substring(6, 8);
                            var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                            if (year < 1700 || year > 2500) return false
                            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
                            if (month < 1 || month > 12) return false
                            if (day < 1 || day > iaMonthDays[month - 1]) return false
                            return true
                        };

                        $.extend($.validator.messages, {
                            required: "必选字段",
                            remote: "请修正该字段",
                            email: "请输入正确格式的电子邮件",
                            url: "请输入合法的网址",
                            date: "请输入合法的日期",
                            dateISO: "请输入合法的日期 (ISO).",
                            number: "请输入合法的数字",
                            digits: "只能输入整数",
                            creditcard: "请输入合法的信用卡号",
                            equalTo: "请再次输入相同的值",
                            accept: "请输入拥有合法后缀名的字符串",
                            maxlength: jQuery.validator.format("输入的字符串长度不能大于{0}"),
                            minlength: jQuery.validator.format("输入的字符串长度不能小于{0}"),
                            rangelength: jQuery.validator.format("输入的字符串长度应该介于{0}和{1}之间"),
                            range: jQuery.validator.format("请输入一个介于{0}和{1}之间的值"),
                            max: jQuery.validator.format("请输入一个最大为{0} 的值"),
                            min: jQuery.validator.format("请输入一个最小为{0} 的值")
                        });

                        $.metadata.setType("attr", "validate")
                  
                        var formValid={

                            errorElement: 'label',
                            errorClass: 'error',
                            focusInvalid: true,
                            onfocusout: function (element) {
                                var t = $(element).valid();
                            },
                            errorPlacement: function (error, element) {
                                if (element.parents(".input-group").length > 0)
                                    error.appendTo(element.parents(".input-group").parent());
                                else
                                    error.appendTo(element.parent());

                                element.parents(".form-group").removeClass("has-success");
                                element.parents(".form-group").addClass("has-error");
                            },
                            success: function (element) {

                                element.parents(".form-group").removeClass("has-error");
                                element.parents(".form-group").addClass("has-success");
                                element.remove();
                            },
                            submitHandler: function (form) {

                                
                                scope.onsubmit()

                            }
                        };
                       
                        //修正 require打包后验证控件失效 郭明 2016年9月13日 添加
                        $element.validate = validatePlugin.validate;
                        $element.validateDelegate = validatePlugin.validateDelegate;                       
                        $element.submit = validatePlugin.submit;
                        var $element = $($element);
                      
                        if ($element.validate)
                        {
                            $element.validate(formValid);
                        }
                        else
                        {
                            $element.on("submit", function () {
                                
                                scope.onsubmit()
                            })
                        }
                    }
                };
            });
        });