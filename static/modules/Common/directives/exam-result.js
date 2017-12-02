define(["jquery", "angular", "module-filter-all"], function ($, angular) {

    var app = angular.module("myApp", ["ui.bootstrap"]);

    //ng-repeat 显示完成后执行的事件
    app.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                if (scope.$last == true) {
                    console.log('repeatFinish');
                    scope.$eval(attr.repeatFinish)
                }
            }
        }
    });

    app.directive('examResult', ['$translate', 'examItemsServices', function ($translate, services) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/exam-result.html';
            },
            scope: {
                memberId: '='
            },
            link: function (scope, elem, attrs) {
            
                scope.ListItems = [];
                scope.load = function () {
                    scope.ListItems = [];
                    services.query({
                        memberId: scope.memberId
                    }, function (obj) {
                        scope.ListItems = obj.Data;                      
                    });
                };
                if (scope.memberId != null && scope.memberId != '') {
                    scope.load();
                }
                var watch_memberId = scope.$watch('memberId', function (newValue, oldValue, scope) {
                    if (newValue == oldValue)
                        return;
                    console.log('memberId changed');
                    scope.load();
                });
            }
        };
    }])
});

