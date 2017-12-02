define(["jquery",
    "angular",
    "plugins-laydate"], function ($, angular) {

        var app = angular.module("myApp", ["ui.bootstrap"]);

        app.directive('datepicker', function () {

            return {
                restrict: 'EAC',
                scope: {
                    value: '=ngModel',
                    format: "@format",
                    minDateNow: "=mindatenow"
                },
                link: function (scope, $element, attr) {
                    $element.attr("id", attr.id);
                    $element.addClass("layer-date laydate-icon");
                    $element.click(function () {
                        laydate({
                            elem: "#" + $element[0].id,
                            festival: true, //显示节日
                            min: scope.minDateNow ? laydate.now() : null,
                            format: scope.format || "YYYY-MM-DD",
                            choose: function (datas) {
                                scope.value = datas
                                scope.$apply();
                            }
                        });

                    });

                    $element.bind('blur', function () {
                        var v = $element.val();
                        if (v != '' && v != scope.value) {
                            scope.value = $element.val();
                            scope.$apply();
                        }
                    });



                }
            };
        });
    });