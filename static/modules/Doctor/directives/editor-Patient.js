define(["angular", "plugins-layer", "jquery-validate", "module-services-api", "module-Doctor-filter-all"], function (angular, layer) {

    var app = angular.module("myApp", []);
    app.directive("editorPatient", ["$translate", function ($translate) {
        return {
            restrict: 'EA',
            scope: {
                genders: "=genders",
                member: "=member"
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/editor-Patient.html';
            },
            controller: ["$scope", function ($scope) {                

                $scope.isInputIDNumber = false;

                $scope.$watchGroup(['member.IDNumber'], function (n, o, scope) {
                    $scope.isInputIDNumber = false;

                    if (!isIDNumberValid(n[0])) {
                        return;
                    }
                    
                   
                    scope.member.Birthday = n[0].substring(6, 14).match(/(\d{4})(\d{2})(\d{2})/).slice(1, 4).join('-');
                    var gender = (+n[0][16] & 1 ^ 1);

                    //scope.member.Gender = gender;
                    $("#Gender").val("string:" + gender).valid();

                    $scope.isInputIDNumber = true;
                    
                });

                $scope.$watchGroup(['member.Birthday'], function (n, o, scope) {
                    var date = /(\d+)\-(\d+)\-(\d+)/.exec(n[0]);
                    var now = new Date();
                    if (!date) {
                        scope.member.Age = 0;
                        return;
                    }
                    var g = (now.getMonth() + 1) * 100 + now.getDay() > +date[2] * 100 + +date[3];
                    var y = now.getFullYear() - +date[1];
                    scope.member.Age = y - (y <= 0 || g ? 0 : 1);
                });

                $.validator.addMethod("idNumber", function (value, element) {
                    if (value == null) value = "";
                    return this.optional(element) || isIDNumberValid(value.toUpperCase());
                }, $translate.instant("身份证号不正确"));

                $.validator.addMethod("phone", function (value, element) {
                    var tel = /^1[34578]\d{9}$/;
                    return this.optional(element) || (tel.test(value));
                }, $translate.instant("电话号码格式错误"));

                function isIDNumberValid(idNo) {
                    var factorArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
                    var parityBit = '10X98765432';
                    var lngProduct = 0;
                    if (!/\d{6}(19|2\d)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[10])\d{3}[\dx]/i.test(idNo)) {
                        return false;
                    }

                    var date8 = idNo.substring(6, 14);
                    if (!isDate8(date8)) {
                        return false;
                    }

                    for (var i = 0; i < 17; i++) {
                        lngProduct += +idNo[i] * factorArr[i];
                    }

                    return idNo[17] === parityBit[lngProduct % 11];
                }

                function isDate8(date) {
                    if (!/^[0-9]{8}$/.test(date)) {
                        return false;
                    }

                    var year, month, day;
                    year = date.substring(0, 4);
                    month = date.substring(4, 6);
                    day = date.substring(6, 8);
                    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                    if (year < 1700 || year > 2500)
                        return false;

                    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
                        iaMonthDays[1] = 29;

                    if (month < 1 || month > 12)
                        return false;

                    if (day < 1 || day > iaMonthDays[month - 1])
                        return false;

                    return true;
                }
            }],
            link: function ($scope, $element, attr) {


            }
        };
    }]);
});