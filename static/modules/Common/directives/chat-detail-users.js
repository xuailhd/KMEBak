define(["angular", "module-services-eventBus", "module-services-api"], function (angular,eventBus, apiUtil) {

        var app = angular.module("myApp", ["ui.bootstrap"]);
        var unsubscribes = [];
        app.directive('chatUsers', ["imServices", '$translate', "$rootScope", function (imServices, $translate, $rootScope) {

            return {
                restrict: 'EA',
                scope: {
                    room: '=room',
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || '/static/modules/Common/directives/chat-detail-users.html';
                },
                link: function ($scope, $element, attr)
                {
                    var lang = $translate.use();
                    var room = $scope.room;               
                    var Refresh = function ()
                    {
                        if (room.ChannelID) {
                            var GroupId = room.ChannelID;
                            //获取医生登录信息
                            var loginInfo = apiUtil.getLoginInfo();
                            var Identifiers = room.groupMgr.GroupsInfo[GroupId].MemberList.map(function (item) {
                                return item.Member_Account;
                            });
                            //获取群组成员的资料
                            room.groupMgr.getGroupUsersInfo(room.ChannelID, Identifiers, function (groupUsers) {
                                
                                $scope.Users = groupUsers.map(function (groupUser) {

                                    
                                    var user = room.memberMgr.formatUser(groupUser.identifier, lang);


                                    return {
                                        nickName: user.nickName,
                                        avatar: user.avatar,
                                        identifier: groupUser.identifier,
                                        me: loginInfo.UserID == groupUser.UserID,
                                        camera: room.videoMgr.getUsers().some(function (videoUser) {
                                            return videoUser.dwUserId == groupUser.identifier && videoUser.camera;
                                        }),
                                        holdmic: room.videoMgr.getUsers().some(function (videoUser) {
                                            return videoUser.dwUserId == groupUser.identifier && videoUser.holdmic;
                                        })
                                    };

                                })

                                if (!$rootScope.$$phase)
                                    $rootScope.$apply();
                            });

                        }
                    }
                    var unsubscribeEvent = function () {
                        //先移除之前的订阅
                        unsubscribes.forEach(function (unsubscribe) {

                            unsubscribe();

                        });

                        unsubscribes = [];

                    }
                    var subscribeEvent = function () {

                        if (unsubscribes.length > 0)
                            return;

                        unsubscribes.push(eventBus.subscribe("stream-added", function (eventType, eventArgs) {

                            Refresh();
                        }));
                        unsubscribes.push(eventBus.subscribe("stream-removed", function (eventType, eventArgs) {
                            Refresh();

                        }));
                        unsubscribes.push(eventBus.subscribe("peer-mute-video", function (eventType, eventArgs) {

                            Refresh();
                        }));
                        unsubscribes.push(eventBus.subscribe("peer-mute-audio", function (eventType, eventArgs) {

                            Refresh();
                        }));
                        unsubscribes.push(eventBus.subscribe("room-changed", function (eventType, eventArgs) {

                            Refresh();

                            if (!$scope.Devices)
                                $scope.onConfigDevice($scope.deviceKind);

                        }));
                    }
                    var onInit = function ()
                    {
                        unsubscribeEvent();
                        subscribeEvent();
                    }
                    onInit();

                    $scope.Users = [];
                    $scope.deviceKind = 'videoinput'
                    $scope.onSelectDevice = function (device) {
                        room.videoMgr.selectDevice(device);
                        layer.msg($translate.instant('Room-lblSuccess'));

                    }
                    $scope.onConfigDevice = function (kind)
                    {
                        room.videoMgr.getDevices(function (devices) {

                            $scope.Devices = function (kind) {
                               
                                var result = devices && !devices.error && devices.filter(function (item, index) {

                                    return item.kind == kind;
                                });

                                if (result && result.length > 0) {
                                    result[0].enable = true;
                                }
                                return result;
                            }

                        })

                    }
                  
                }
            };
        }]);




    });