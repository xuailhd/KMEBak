define(["angular", "jquery", "module-services-eventBus", "module-services-apiUtil"], function (angular, $, eventBus, apiUtil) {

    var app = angular.module("myApp", ["ui.bootstrap"]);
    var unsubscribes = [];
    var countdownTimer = null;
 
    app.directive("countdown", ["$document", "$translate", "imServices", "$interval", function (e, $translate, imServices, $interval) {

        return {
            restrict: "EA",
            scope:{   room: '=room'},
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/countdown.html';
            },
            link: function ($scope, $element, attr) {

                $scope.duration = 0;

                var timer = function (intDiff) {

                    if (countdownTimer) {
                        $interval.cancel(countdownTimer);
                    }

                    countdownTimer = $interval(function () {

                        if (intDiff >= 0) {

                            var day = 0,
                            hour = 0,
                            minute = 0,
                            second = 0;//时间默认值		

                            day = Math.floor(intDiff / (60 * 60 * 24));
                            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);

                            if (minute <= 9) minute = '0' + minute;
                            if (second <= 9) second = '0' + second;

                            $scope.day = day;
                            $scope.hour = hour;
                            $scope.minute = minute;
                            $scope.second = second;
                        }

                        intDiff--;

                    }, 1000);
                }
                var unsubscribeEvent = function () {
                    //先移除之前的订阅
                    unsubscribes.forEach(function (unsubscribe) {

                        unsubscribe();

                    });

                    unsubscribes = [];

                }
                var subscribeEvent = function () {

                    if (unsubscribes.length > 0) {
                        return;
                    }


                    //计时结束
                    unsubscribes.push(eventBus.subscribe("room-hangup", function (eventType, eventArgs) {
                        debugger;
                        $scope.duration = 0;

                        if (countdownTimer) {

                            $interval.cancel(countdownTimer);
                        }

                    }));


                    unsubscribes.push(eventBus.subscribe("room-duration-changed", function (eventType, eventArgs) {

                        console.log("count down:room-duration-changed", eventArgs);

                        if ($scope.room.State == 3)
                            return;

                        //计费状态
                        if (eventArgs.ChargingState ==0 || eventArgs.ChargingState == 2)
                        {
                            if (countdownTimer) {
                                $scope.duration = 0;
                                $interval.cancel(countdownTimer);
                            }
                        }
                        else if (eventArgs.ChargingState == 1)
                        {
                            $scope.duration = eventArgs.Duration;
                            timer($scope.duration);
                        }
                    }));
                };
                var onDestory = function ()
                {
                    unsubscribeEvent();
                }
                var onInit=function()
                {
                    subscribeEvent();
                }
           
                $scope.$on("$destroy", function () {

                    onDestory();

                });

                onInit();
               
            }
        }
    }])

});

