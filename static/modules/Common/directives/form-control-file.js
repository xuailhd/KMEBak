define(["jquery", "angular", "bootstrap", "bootstrap-prettyfile"], function ($, angular)
{
    var app = angular.module("myApp", ["ui.bootstrap"]);

    app.directive('file', function () {

        return {
            restrict: 'EAC',
            scope: {
                ngsubmit: '&'
            },
            link: function (scope, $element, attr) {
                
                $element.prettyFile();
            }
        };
    });
});