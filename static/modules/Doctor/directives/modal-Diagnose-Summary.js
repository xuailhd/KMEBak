define(["angular", "plugins-layer", "module-services-api", "module-Doctor-filter-all"], function (angular, layer) {

    var app = angular.module("myApp", []);
    app.directive("modalDiagnoseSummary", ["$translate", function ($translate) {
        return {
            restrict: 'EA',
            scope: {
                diagnoseSummary: "=diagnoseSummary"
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/modal-Diagnose-Summary.html';
            },
            controller: ["$scope", function ($scope) {
                $('#modal-diagnose-summary').on('show.bs.modal', function (event) {
                    var target = $(event.relatedTarget);
                    

                });                
            }],
            link: function ($scope, $element, attr) {


            }
        };
    }]);
});