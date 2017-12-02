define(["angular", "module-services-eventBus", "module-directive-countdown"], function (angular, eventBus) {

    console.log("load chatAudioConsult.js")

    var app = angular.module("myApp", []);


    /* 
    *  语音咨询
    *  作者：郭明
    *  日期：2016年10月23日 
    */
    app.directive("chatAudioConsult", ["imServices", function (imServices) {

        return {
            restrict: 'EA',
            scope: {
                state: '=state',
                room: '=room',
                onUrlClick: '=onUrlClick',
                onAnswer: "=onAnswer",
                onCallback: '=onCallback',//通知父级更新会话列表
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/chat-view-AudioConsult.html';
            },
            controller: ["$scope", function ($scope) {

                var self = this;
                var room = $scope.room;
                var state = $scope.state;
                self.toolbar = 'comment';
                self.toolbarClick = function (name) {
                    self.toolbar = name;
                }            
                //重设服务倒计时
                self.restCountDown = function (state) {
                    
                    eventBus.dispatch("room-duration-changed", state);
                }

                
                if (state && state.Room) {

                        self.restCountDown({
                            ChannelID: state.Room.ChannelID,
                            ChargingState: state.Room.ChargingState,
                            Duration: state.Room.Duration - state.Room.TotalTime,
                            renewChannelKey: false
                        });

                 
                }
            }],
            controllerAs: "Audio",
            link: function ($scope, $element, attr) {
                

            }
        };
    }])

 


});