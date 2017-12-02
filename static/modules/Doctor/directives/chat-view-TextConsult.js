define(["angular", "module-services-eventBus", "module-directive-countdown"], function (angular, eventBus) {

    console.log("load chatTextConsult.js")

    var app = angular.module("myApp", []);

    /*
     * 图文咨询
     * 日期：2016年10月23日
     * 作者：郭明     
     */
    app.directive("chatTextConsult", ["imServices", function (imServices) {

        return {
            restrict: 'EA',
            scope: {
                state: '=state',
                room: '=room',
                onUrlClick: '=onUrlClick',
                onAnswer: "=onAnswer",
                onCallback: '=onCallback',//通知父级更新会话列表
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
                 
                    eventBus.dispatch("room-duration-changed",state);
                }
                self.onInit = function () {
                    
                    self.restCountDown({
                        ChannelID: state.Room.ChannelID,
                        ChargingState: state.Room.ChargingState,
                        Duration: state.Room.Duration - state.Room.TotalTime,
                        renewChannelKey: false
                    });
                }

         
                self.onInit();
            }],
            controllerAs:"TextConsult",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/chat-view-TextConsult.html';
            },
            link: function ($scope, $element, attr) {
                
              
            }
        };
    }])

 
  
 


});