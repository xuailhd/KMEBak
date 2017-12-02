define(["angular", "jquery", "jquery-slimscroll"], function (angular, $)
{
    var app = angular.module("myApp", ["ui.bootstrap"]);

    app.directive('scrollbar', ["$timeout", function ($timeout) {

        return {
            restrict: 'EAC',
            scope: {
                color: '@',
                railcolor: '@'
            },
            link: function (scope, $element, attr) {
                // 解决部分浏览器存在的兼容性问题：DOM还没渲染完成就执行本指令的link，导致调用$element.height()返回为0
                $timeout(function () {

                    if (!scope.color) {
                        scope.color = "#fff";
                    }
              
                    if (!scope.railcolor){
                        scope.railcolor = "#222";
                    }

                    var boxHeight = $element.height();

                    $element.slimScroll({
                        height: boxHeight,
                        size: '10px',                  
                        color: scope.color,
                        alwaysVisible: false,                  
                        railVisible: true,
                        railColor: scope.railcolor,
                        railOpacity: 0.3,
                        wheelStep: 10,
                        allowPageScroll: false,
                        disableFadeOut: false
                    });

                }, 0);
            }
        }        
    }]);
});