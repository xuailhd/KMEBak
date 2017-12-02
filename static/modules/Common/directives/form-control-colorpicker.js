define(["jquery", "bootstrap", "bootstrap-colorpicker"], function (app, $)
{
    var app = angular.module("myApp", ["ui.bootstrap"]);

    app.directive('colorpicker', function () {

        return {
            restrict: 'EAC',
            scope: {
                color: '='
            },
            link: function (scope, $element, attr) {
                
                $element.colorpicker().on('changeColor', function (e)
                {
                    scope.color = e.color.toHex();

                    scope.$apply();
                });

            }
        };
    });
});