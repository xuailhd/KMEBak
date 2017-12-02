define(["angular", "module-services-api"], function (angular) {

    var app = angular.module("myApp", []);

    app.directive("assistant", ["$translate", 'preview', 'doctorDiagnosisServices', function ($translate, preview,  doctorDiagnosisServices) {
        return {
            restrict: 'EA',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/Assistant.html';
            },
            controller: ["$scope", function ($scope) {
               
                               
            }],
            link: function ($scope, $element, attr) {


            }
        };
    }]);
});