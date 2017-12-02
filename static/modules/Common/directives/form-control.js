define(["jquery", "angular"], function ($, angular) {

            var app = angular.module("myApp", ["ui.bootstrap"]);


            /*angular 将form-control 转换成驼峰形式*/
            app.directive('formControl', function () {

                return {
                    restrict: 'EA',
                    scope: {
                        field: '=ngModel',
                        edit: "@",
                        add: "@",
                        model: "=model"
                    },
                    transclude: true,
                    replace: true,
                    templateUrl: function (element, attrs) {
                        return attrs.templateUrl || '/static/modules/Common/directives/form-control.html';
                    },
                    link: function (scope, $element, attr) {

                    }
                };
            });
        });