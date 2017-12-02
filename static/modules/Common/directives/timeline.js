define(["angular", "jquery"], function (angular, $) {

    var app = angular.module("myApp", ["ui.bootstrap"]);
    app.directive("timeline", ["$document", "$translate", function (e, $translate) {

        return {
            restrict: "EA",
            scope: {
                timePoints: "=timePoints",
                onTimePointClick: "=onTimePointClick"
            },
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/timeline.html';
            },
            controller: ["$scope", function ($scope) {
                
            }],
            link: function ($scope, $element, attr) {
                $scope.currentIdx = 0;
                $scope.onDetail = function (item) {
                    debugger;
                    if ($scope.onTimePointClick)
                        $scope.onTimePointClick(item);
                }

                $scope.onClick = function (index) {
                    $scope.currentIdx = index;
                }
            }
        }
    }])

});

