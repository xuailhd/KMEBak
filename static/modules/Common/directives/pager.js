define(["angular", "angular-ui-bootstrap"], function (angular) {

    var app = angular.module("myApp", ["ui.bootstrap"]);


    app.directive('pagerNav', ["$parse", function ($parse)
    {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: function (element, attrs)
            {
                return attrs.templateUrl || '/static/modules/Common/directives/pager.html';
            },
            scope: {
                page: "=",
                pageSize: "=",
                pageList: "=",
                totalCount: "=",
                previousText: '@',
                nextText: '@',
                onChange: "&"              
            },
            link: function (scope, elem, attrs)
            {
                if (!scope.previousText)
                    scope.previousText = "<"

                if (!scope.nextText)
                    scope.nextText = ">"

                scope.fn = {};

             
                var loadData = attrs.loadData || true;

                if (loadData==true)
                    //默认执行加载
                    scope.onChange();

                //比较
                scope.fn.equals = function (p1, p2) {

                    return p1 === p2;

                }

                scope.fn.cssClass = function (p1, p2) {

                    var isActive = scope.fn.equals(p1, p2);


                    if (isActive) {

                        return { 'active': true };
                    }
                    else {
                        return { '': false };
                    }
                }

                //切换分页大小
                scope.fn.onPageSizeChanged = function (pageSize)
                {
                    
                    scope.pageSize = pageSize;
                }

                scope.$parent.$watch($parse(attrs.pageSize), function (value,newValue)
                {
                    
                    if (scope.pageSize != newValue)
                    scope.onChange();
                });

                scope.$parent.$watch($parse(attrs.page), function (value, newValue) {
                
                    if (scope.page != newValue)
                    scope.onChange();
                });

               
            }
        };
    }])


});