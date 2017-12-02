define(["module-services-eventBus", "angular", "module-services-apiUtil", "module-services-debounce"], function (eventBus, angular, apiUtil, debounceService) {

    var app = angular.module("myApp", ["ui.bootstrap"]);
    var unsubscribes = [];

    app.directive('chatVideo', ["$q", "$translate", "$state", "$rootScope", "$sce", "imServices", function ($q, $translate, $state,$rootScope, $sce, imServices) {

        return {
            restrict: 'EA',
            scope: {
                room: '=room'
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/chat-detail-Video.html';
            },
            link: function ($scope, $element, attr) {


                var isFullScreen = false;
                var room = $scope.room;
                function copy(obj) {
                    var newobj = {};
                    for (var attr in obj) {
                        newobj[attr] = obj[attr];
                    }
                    return newobj;
                }
                var loginInfo = apiUtil.getLoginInfo();

                var toggleScreen = function ($element) {

                    isFullScreen = !isFullScreen;

                    room.videoMgr.displayVideo();

                    if (isFullScreen) {

                        $($element).addClass("fullscreen");


                    }
                    else {

                        $($element).removeClass("fullscreen");
                    }
                }
                //获取视频的宽度
                var getViewDivWidth = function (viewDiv) {
                    return $("#" + viewDiv).outerWidth()

                }
                //重新设置视频大小
                var resizeVideo = function () {
                    console.debug("resizeVideo resolution=" + room.videoMgr.getResolution());

                    var pencent = (room.videoMgr.getResolutionArray(room.videoMgr.getResolution())[1] / room.videoMgr.getResolutionArray(room.videoMgr.getResolution())[0]);

                    room.videoMgr.getUsers().forEach(function (user) {
                        var viewDiv = "video-user-" + user.dwUserId;

                        //获取dom元素宽度
                        var width = getViewDivWidth(viewDiv);
                        //为了放置视频变形，根据宽高比计算视频高度
                        var height = Math.round(width * pencent);
                        //修正dom元素的高度，根据视频的高度修正
                        $("#" + viewDiv).css("height", height);

                        console.debug("resizeVideo #" + viewDiv + " to width=" + width + "、height=" + height);
                    })


                }
                var unsubscribeEvent = function () {
                    //先移除之前的订阅
                    unsubscribes.forEach(function (unsubscribe) {
                        unsubscribe();
                    });

                    unsubscribes = [];

                }
                var events = {};
                var subscribeEvent = function () {

                    if (unsubscribes.length > 0)
                        return;

                    unsubscribes.push(eventBus.subscribe("room-video-error", function (eventType, eventArgs) {
                        console.debug("room-video-error", eventArgs)
                        events[eventType] = eventArgs;

                        if (eventArgs.msg)
                            eventArgs = eventArgs.msg;

                        if (eventArgs.reason)
                        {
                            switch (eventArgs.reason) {
                                /*
                                 * 表明无法连接到 AgoraWebAgent。可能的原因有：
                                    无可用网络。由于采用了安全的 websocket 本地连接，
                                    连接 AgoraWebAgent 需要 DNS 服务，当 DNS 服务不可用时连不上 AgoraWebAgent。
                                    未启动 AgoraWebAgent。
                                    未安装 AgoraWebAgent。
                                    使用了代理，导致无法连接 AgoraWebAgent
                                 */
                                case 'CLOSE_BEFORE_OPEN':
                                    /* 可能的原因是 1.6 版的 JS 与之前版本的AgoraWebAgent 不兼容，需根据回调里返回的 URL 升级AgoraWebAgen*/
                                case "INCOMPATIBLE_WEBAGENT":
                                    //客户端代理被关闭
                                case "LOST_CONNECTION_TO_AGENT":
                                    {
                                        $scope.errorVideoFlag = true;
                                        $scope.errorRefreshBtn = true;

                                        var message = '<div style="text-align:left;padding-left:20px;padding-right:20px;margin-top:-80px;height:80px;">使用语音/视频功能，您需要运行视频插件.<ul><li>如果您没有安装，请<a target=_blank style="font-weight:bold;" href="' + eventArgs.agentInstallUrl + '">安装</a> 它。</li><li>如果您遇到任何问题，请参阅<a  target=_blank style="font-weight:bold;" href="' + eventArgs.agentInstallGuideUrl + '">安装指南</a>。</li><li>如果您已经安装了它，请双击该图标来运行这个应用程序。如果它一直在运行，请检查网络连接是否正常。</li></ul></div>'
                                        $scope.errorMsg = $sce.trustAsHtml(message)                                    
                                        break;
                                    }
                                case "SOCKET_DISCONNECTED":
                                    layer.msg("当前网络指令较差")
                                    return;
                                    break;
                                case "DEVICES_NOT_FOUND":
                                    var message = '请检查设备连接是否正常，稍后重试'
                                    $scope.errorMsg = $sce.trustAsHtml(message)
                                    $scope.errorVideoFlag = true;
                                    $scope.errorRefreshBtn = true;                                   
                                    break;            
                            }
                        }
                        else
                        {
                            var message = '视频加载失败，请稍后重试'
                            $scope.errorMsg = $sce.trustAsHtml(message)
                            $scope.errorVideoFlag = true;
                            $scope.errorRefreshBtn = true;                                                
                        }

                        $(".windows-list .connected").remove();
                       
                    }));

                    unsubscribes.push(eventBus.subscribe("room-stream-added", function (eventType, eventArgs) {
                        console.debug("room-stream-added", eventArgs)
                        events[eventType] = eventArgs;

                        $scope.errorVideoFlag = false;
                        $scope.errorRefreshBtn = false;
                        $scope.errorMsg = "";

                        var stream = eventArgs.stream;
                        var videoId = eventArgs.uid;
                        var videoSize = loginInfo.Identifier == videoId ? "min" : "max";
            
                        if ($('#video-user-' + videoId).length <= 0) {

                            $(".windows-list").append('<div class="windows connected ' + videoSize + '" id="video-user-' + videoId + '"></div>')
                        }
                        else
                        {
                            $('#video-user-' + videoId).show()
                        }

                        stream.play('video-user-' + videoId);

                    }));

                    unsubscribes.push(eventBus.subscribe("room-stream-removed", function (eventType, eventArgs) {

                        console.debug("room-stream-removed", eventArgs)
                        events[eventType] = eventArgs;

                        var stream = eventArgs.stream;
                        var videoId = eventArgs.uid;

                        if (stream) {
                            stream.stop();
                        }
                        $('#video-user-' + videoId).remove();

                    }));

                    unsubscribes.push(eventBus.subscribe("room-peer-mute-video", function (eventType, eventArgs) {
                        console.debug("room-peer-mute-video", eventArgs)
                        events[eventType] = eventArgs;

                    }));

                    unsubscribes.push(eventBus.subscribe("room-peer-mute-audio", function (eventType, eventArgs) {
                        console.debug("room-peer-mute-audio", eventArgs)
                        events[eventType] = eventArgs;

                    }));

                    unsubscribes.push(eventBus.subscribe("room-changed", function (eventType, eventArgs) {
                        console.debug("room-changed", eventArgs)
                        events[eventType] = eventArgs;

                        if (room.State == 2) {
                            loadVideo(false);
                        }
                    }));

                    //进入房间之后显示视频
                    unsubscribes.push(eventBus.subscribe("room-state-changed", function (eventType, eventArgs) {

                        console.debug("room-state-changed", eventArgs)
                        events[eventType] = eventArgs;

                        var ChannelID = eventArgs.ChannelID;
                        var State = eventArgs.State;

                        if (State == 2) {
                            loadVideo(false);
                        }

                    }));

                    //服务开始计时时显示视频
                    unsubscribes.push(eventBus.subscribe("room-duration-changed", function (eventType, eventArgs) {
                        console.debug("room-duration-changed", eventArgs)
                        events[eventType] = eventArgs;

                        if (room.State == 2) {
                            loadVideo(eventArgs.renewChannelKey);
                        }

                    }));

                    //挂断消息的时候切断视频
                    unsubscribes.push(eventBus.subscribe("room-hangup", function (eventType, eventArgs) {
                        console.debug("room-hangup", eventArgs)
                        events[eventType] = eventArgs;
                        room.State = 3;
                        room.videoMgr.Quit();
                        $scope.displayVideo = false;
                    }));

                    //双击切换全屏
                    $element.on("click", ".windows", function () {

                        if ($(this).hasClass("connected")) {
                            toggleScreen($(this));
                        }
                    })
                    $(document).keydown(function (e) {

                        //ESC
                        if (e.which == 27) {
                            var videos = $element.find(".windows.connected");
                            toggleScreen(videos[0]);
                        }
                        else {
                            //屏蔽了快捷键
                            //return false;
                        }

                    });
                    //修正视频位置
                    $(window).resize(function () {

                        resizeVideo();
                    });
                    //修正视频位置
                    $(window).scroll(function () {
                        resizeVideo();
                    });
                };

                var loadVideo = function (renewChannelKey) {

                    debounceService
                    $scope.displayVideo = true;

                    //没有正在连接中的视频就提示加载提示
                    if ($(".windows-list .connected").length <= 0)
                    {
                        $scope.errorVideoFlag = true;
                        $scope.errorRefreshBtn = false;
                        $scope.errorMsg = $sce.trustAsHtml("正在加载视频,请稍后");
                    }

                    var fn = function (tryAgainCount) {

                            //获取媒体配置
                            apiUtil.requestWebApi("/IM/MediaConfig", "GET", {
                                ChannelID: room.ChannelID,
                                Identifier: room.loginInfo.identifier
                            }, function (resp) {

                                if (resp.Data && resp.Data.MediaChannelKey && resp.Data.MediaChannelKey != "") {

                                    var config = {
                                        MediaChannelKey: resp.Data.MediaChannelKey,
                                        RecordingKey: resp.Data.RecordingKey,
                                        Secret: resp.Data.Secret,
                                        Audio: resp.Data.Audio,
                                        Video: resp.Data.Video,
                                        Screen: resp.Data.Screen,
                                        AppID: resp.Data.AppID,
                                        ChannelID: room.ChannelID,
                                        Model: 'communication'//communication:通信模式,live-broadcasting：直播模式
                                    }

                                    if (resp.Data.Duration - resp.Data.TotalTime > 0 || resp.Data.Duration <= 0) {

                                        //初始化视频组件                                
                                        room.videoMgr.Init(copy(config), function () {

                                            $scope.errorVideoFlag = false;
                                            $scope.errorRefreshBtn = false;
                                            $scope.errorMsg = "";

                                            console.log("init videoMgr success");

                                            //进入房间
                                            room.videoMgr.enterRoom(room.ChannelID);

                                        }, function (error) {

                                            console.error("init videoMgr fail", error);

                                            if (error.reason == "ALREADY_IN_USE") {

                                                var WebSdkInteroperability = room.videoMgr.WebSdkInteroperability();



                                                room.videoMgr.Quit(function () {
                                                    room.videoMgr.WebSdkInteroperability(WebSdkInteroperability)
                                                    $scope.errorVideoFlag = true;
                                                    $scope.errorRefreshBtn = true;
                                                    $scope.errorMsg = $sce.trustAsHtml("摄像头已被另一个程序占用。请关闭后重试");

                                                });

                                            }

                                        });


                                    }
                                    else {
                                        $scope.displayVideo = false;
                                        room.videoMgr.Quit();
                                    }
                                }
                                else {
                                    $scope.errorVideoFlag = true;
                                    $scope.errorRefreshBtn = true;
                                    $scope.errorMsg = $sce.trustAsHtml("服务器打盹了，再试一下叫醒他");
                                    room.videoMgr.Quit();
                                }
                            }, function (resp) {
                                if (tryAgainCount > 0) {
                                    tryAgainCount--;
                                    fn(tryAgainCount)
                                }
                                else {
                                    $scope.errorVideoFlag = true;
                                    $scope.errorRefreshBtn = true;
                                    $scope.errorMsg = $sce.trustAsHtml("服务器打盹了，再试一下叫醒他");
                                }
                            });
                    }

                    //如果出错自动重试的次数
                    fn(3);
                }

                //释放视频
                var unloadVideo = function () {

                    $scope.displayVideo = false;
                    room.videoMgr.Quit();
                }

                //释放资源
                var onDestory = function () {
                    unsubscribeEvent();
                    unloadVideo();
                }

                var onInit = function () {
                    unsubscribeEvent();
                    subscribeEvent();
                    onVideoLoadCountdown();
                }

                var onVideoLoadCountdown = function () {
                    //加载成功后，如果没有接收到此消息
                    if (!events["room-duration-changed"] && room.State == 2) {

                        //延迟1秒钟检测
                        setTimeout(function () {

                            if (!events["room-duration-changed"]) {

                                loadVideo(true);
                            }

                        }, 3000)
                    }
                }

                $scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase == "$apply" || phase == "$digest") {
                        if (fn && (typeof (fn) === "function")) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };

                //指令被销毁时执行
                $scope.$on("$destroy", function () {

                    onDestory();

                });

                //错误消息
                $scope.errorMsg = "";
                //是否存在错误
                $scope.errorVideoFlag = false;
                //是否显示刷新按钮
                $scope.errorRefreshBtn = true;
                //是否显示视频模块
                $scope.displayVideo = true;

                //刷新视频
                $scope.onRefreshVideo = function () {

                    var WebSdkInteroperability = room.videoMgr.WebSdkInteroperability();
               
                    room.videoMgr.Quit(function () {
                        room.videoMgr.WebSdkInteroperability(WebSdkInteroperability)
                        $scope.errorVideoFlag = false;
                        loadVideo(false);
                    });
                }

                onInit();
            }
        };
    }]);

    app.directive("chatVideoWindow", ["$q", "$translate", "$rootScope", function ($q, $translate, $rootScope) {

        return {
            restrict: 'EAC',
            template: function (element, attrs) {
                return $("#tpl-chatVideoWindow").html()
            },
            link: function ($scope, $element, attr) {
            }
        };
    }])
});