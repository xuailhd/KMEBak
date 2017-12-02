define(["angular", "plugins-layer", "module-services-eventBus"], function (angular, layer, eventBus) {

    var app = angular.module("myApp", []);
    var unsubscribe = null;

    app.directive("chatDeviceSetting", ["$translate", function ($translate) {
        return {
            restrict: 'EA',
            scope: {
                room: '=room',
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/chat-detail-DeviceSetting.html';
            },
            controller: ["$scope", function ($scope) {
                $scope.imageList = [];
                $("#dialog-device").on('show.bs.modal', function (event) {
                    $scope.onConfigDevice($scope.deviceKind);                  
                });
            }],
            link: function ($scope, $element, attr) {
            
                var room = $scope.room;

                $scope.deviceKind = "videoinput";
                $scope.devices = null;

                if (unsubscribe != null)
                    unsubscribe();

                var checkDevice = function ()
                {
                    function getDevices() {
                        room.videoMgr.getDevices(function (devices) {
                                                      
                            var camerDevices = devices && !devices.error && devices.filter(function (item, index) {

                                return item.kind == "videoinput";
                            });

                            var microphoneDevice = devices && !devices.error && devices.filter(function (item, index) {

                                return item.kind == "audioinput";
                            });

                            var audiooutputDevice = devices && !devices.error && devices.filter(function (item, index) {
                                return item.kind == "audiooutput";
                            });

                            if (camerDevices.length <= 0)
                            {
                                eventBus.dispatch("room-video-error", { reason: "DEVICES_NOT_FOUND", kind: "videoinput" })
                            }

                            if (microphoneDevice.length <= 0) {
                             
                                eventBus.dispatch("room-video-error", { reason: "DEVICES_NOT_FOUND", kind: "audioinput" })
                            }

                            //if (audiooutputDevice.length <= 0) {                             
                            //    eventBus.dispatch("room-video-error", { reason: "DEVICES_NOT_FOUND", kind: "audiooutput" })
                            //}

                        });
                    }
                    
                    if (room.videoMgr.isNative) {
                        return function () {};
                    }

                    var timer = setInterval(getDevices, 5000);

                    return function ()
                    {
                        clearTimeout(timer);
                    }
                }

                var destroyCheckDevice = null;

                unsubscribe = eventBus.subscribe("room-changed", function (eventType, eventArgs)
                {
                    if (!$scope.devices) {
                        $scope.onConfigDevice($scope.deviceKind);
                    }

                
                    destroyCheckDevice = checkDevice();
                     
                });

                //指令被销毁时执行
                $scope.$on("$destroy", function () {

                    if (destroyCheckDevice)
                        destroyCheckDevice();
                });

                var currentDevicesId = "";

                $scope.onSelectDevice = function (device) {
                    currentDevicesId = device.deviceId;
                    room.videoMgr.selectDevice(device);
                    layer.msg($translate.instant('Room-lblSuccess'));
                }

                $scope.onConfigDevice = function (kind) {
                    room.videoMgr.getDevices(function (devices) {
                        $scope.devices = function (kind) {

                            var result = devices && !devices.error &&  devices.filter(function (item, index) {

                                return item.kind == kind;
                            });

                            var p = result && result.find(function (a) {
                                return a.deviceId === currentDevicesId;
                            });
                            if (p) {
                                p.enable = true;
                            }
                            if (!p && result && result.length > 0) {
                                result[0].enable = true;
                            }
                            return result;
                        }

                    });
                }
            }
        };
    }]);
});