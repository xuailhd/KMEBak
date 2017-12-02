define(["angular"], function (angular) {

    var app = angular.module("myApp", []);

    app.directive('spinner', ["$parse", function ($parse)
    {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: function (element, attrs)
            {
                return attrs.templateUrl || '/static/modules/Common/directives/spinner-' + attrs.type + '.html';
            },
            scope: {
               
            },
            link: function (scope, elem, attrs)
            {
               
            }
        };
    }])


});