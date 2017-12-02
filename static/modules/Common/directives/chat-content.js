define(["angular"], function (angular) {

    console.log("load chat-content.js")

    var app = angular.module("myApp", []);
    var childElement = null;
    app.directive('chatContent', ["$rootScope", "$compile", function ($rootScope, $compile)
    {
        return {
            restrict: 'EA',  
            scope: {
                room: '=room',
                onCallback: '=onCallback',//通知父级更新会话列表
                onLoad: '=onLoad',//指令加载执行的方法
                onUrlClick: '=onUrlClick', // 链接消息点击事件
                onAnswer: '=onAnswer', // 链接消息点击事件
            },
            link: function ($scope, $element, attr)
            {  
                var room = $scope.room;
                var onUnload=function()
                {
                    var scope = childElement && childElement.scope();
                    scope && scope.$destroy() && childElement.remove()
                }
                //重写父类方法（重要）
                $scope.onLoad = function (state) {               
           
                    onUnload();                  

                    var tpl = '<chat-Not-Session ></chat-Not-Session>';
                    if (state && state.Room) {
                        switch (state.Room.ServiceType) {
                            case 0:
                                //线下看诊（预约挂号-》开处方）
                                tpl = '<chat-Offline-Clinic room="room" on-Callback="onCallback" on-Url-Click="onUrlClick" on-Answer="onAnswer" state=state></chat-Offline-Clinic>';
                                break;
                            case 1:
                                //图文咨询
                                tpl = '<chat-Text-Consult room="room" on-Callback="onCallback" on-Url-Click="onUrlClick" on-Answer="onAnswer" state=state></chat-Text-Consult>';
                                break;

                            case 2:
                                //语音咨询
                                tpl = '<chat-Audio-Consult room="room" on-Callback="onCallback" on-Url-Click="onUrlClick" on-Answer="onAnswer" state=state></chat-Audio-Consult>';
                                break;

                            case 3:
                                //视频咨询
                                tpl = '<chat-Video-Consult  room="room" on-Callback="onCallback" on-Url-Click="onUrlClick" on-Answer="onAnswer" state=state ></chat-Video-Consult>';
                                break;
                        }

                    }

                    var childScope = $scope.$new();
                    angular.extend(childScope, {
                        room: room,
                        state: state,
                        onCallback: $scope.onCallback,
                        onUrlClick: $scope.onUrlClick,
                        onAnswer: $scope.onAnswer,
                    });                  
                    childElement = angular.element(tpl);
                    var childContent = $compile(childElement)(childScope, null, {})
                    $element.html(childContent);
                }
                $scope.onLoad({});
            }
        };
    }]);

});