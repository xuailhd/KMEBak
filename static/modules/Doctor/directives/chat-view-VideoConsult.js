define(["angular", "module-services-eventBus", "module-directive-countdown"], function (angular, eventBus) {

    console.log("load chatVideoConsult.js")

    var app = angular.module("myApp", []);

    /*
     * 视频咨询
      * 作者：郭明
      * 日期：2016年10月23日 
     */
    app.directive("chatVideoConsult", ["imServices", function (imServices) {

        return {
            restrict: 'EA',
            scope: {
                state: '=state',
                room: '=room',
                onAnswer: "=onAnswer",
                onUrlClick: '=onUrlClick',
                onCallback: '=onCallback',//通知父级更新会话列表
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/chat-view-VideoConsult.html';
            },
            controller: ["$scope", function ($scope) {
                
                var self = this;
                var room = $scope.room;
                var state = $scope.state;

                self.toolbar = 'comment';
                self.toolbarClick = function (name) {
                    self.toolbar = name;
                }

                self.LazyLoad = {
                    Diagnose: false
                };

                //重设服务倒计时
                self.restCountDown = function (state) {
                    eventBus.dispatch("room-duration-changed", state);       
                }
             
                if (state && state.Room){         
                   

                    self.restCountDown({
                        ChannelID: state.Room.ChannelID,
                        ChargingState: state.Room.ChargingState,
                        Duration: state.Room.Duration - state.Room.TotalTime,
                        renewChannelKey: false
                    });

                  
                }

                if ($scope.state.OperType) {
                    self.toolbarClick($scope.state.OperType);
                    self.LazyLoad.Diagnose = true;
                }
            }],
            controllerAs: "Video",
            link: function ($scope, $element, attr) {


            }
        };
    }])



});