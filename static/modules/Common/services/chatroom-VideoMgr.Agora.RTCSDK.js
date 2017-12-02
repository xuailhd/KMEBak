"use strict";
define(["module-services-eventBus",
        "plugins-layer",
        "plugins-sdk-AgoraRTCSDK",
        "module-services-apiUtil",
], function (eventBus, layer, AgoraRTCSDK, apiUtil) {

    /* 
      * Agora视频插件(非插件版本)
      * 作者：郭明
      * 日期：2017年4月11日
      */
    var AgoraRTCSDK_Mgr = (function () {

        /*****视频模块私有变量*******/
        var client = null;

        //本地流
        var localStream;

        //流列表
        var StreamList = {};

        //sdk回调事件类型
        var EventType = {
            "streamAdded": "room-stream-added",
            "streamRemoved": "room-stream-removed",
            "peerMuteVideo": "room-peer-mute-video",
            "peerMuteAudio": "room-peer-mute-audio",
        };

        //出错重试
        var TryAgain = true;

        var listeners = [];


        var syncEnterRoomLock = false;

        //视频分辨率
        var resolution = "360p";
        //帧率
        var maxFrameRate = "15";

        /**************************/

        function videoMgr(loginInfo) {
            //登录信息
            this.loginInfo = loginInfo;

            //当前成员（UI需要使用）
            this.Users = [];

            this.config = {
                Audio: false,
                Video: false,
                Screen: false
            };
        }


        //支持的事件类型
        videoMgr.prototype.EventType = EventType;

        videoMgr.prototype.resolution = resolution;

        videoMgr.prototype.getResolutionArray = function (reso) {
            switch (reso) {
                case "120p":
                    return [160, 120];
                case "240p":
                    return [320, 240];
                case "360p":
                    return [640, 360];
                case "480p":
                    return [640, 480];
                case "720p":
                    return [1280, 720];
                case "1080p":
                    return [1920, 1080];
                default:
                    return [1280, 720];
            }
        };
        //初始化
        videoMgr.prototype.Init = function (config, successCallback, failCallBack) {

            if (!config.Model) {
                config.Model = 'communication';//live-broadcasting
                console.error("Init videoMgr miss Param communication")
            }

            var self = this;

            self.config = config;

            if (successCallback)
                successCallback(true);
        }

        //生成视频配置
        videoMgr.prototype.generateVideoProfile = function (resolution, frameRate) {
            var result = "480P";
            switch (resolution) {
                case '120p':
                    result = "120P";
                    break;
                case '240p':
                    result = "240P";
                    break;
                case '360p':
                    result = "360P";
                    break;
                case '480p':
                    if (frameRate === "15") {
                        result = "480P";
                    } else {
                        result = "480P_2";
                    }
                    break;
                case '720p':
                    if (frameRate === "15") {
                        result = "720P";
                    } else {
                        result = "720P_2";
                    }
                    break;
                case '1080p':
                    if (frameRate === "15") {
                        result = "1080P";
                    } else {
                        result = "1080P_2";
                    }
                    break;
                default:
                    // 480p, 30
                    // Do nothing
                    break;
            }

            return result;
        }

        //重新设置频道秘钥
        videoMgr.prototype.renewChannelKey = function (MediaChannelKey, successCallback, failCallBack) {
            console.log("renewChannelKey=" + MediaChannelKey)

            client.renewChannelKey(MediaChannelKey, function (data) {
                console.log("renewChannelKey successfully.");

                if (successCallback)
                    successCallback();

            }, function (err) {
                console.error("renewChannelKey failed", err);

                if (failCallBack)
                    failCallBack(err)
            });
        }

        //加入房间
        videoMgr.prototype.enterRoom = function (roomid) {

            var self = this;

            //让进入房间的操作同步
            if (syncEnterRoomLock) {

                console.warn("有一个 enterRoom 操作正在执行，稍后重试");
                //如果有一个线程正在加载，则延迟执行
                setTimeout(function () { self.enterRoom(roomid) }, 50);
                return;
            }

            if (roomid + "" == "") {
                return;
            }

            //重复请求（忽略）
            if (roomid == self.roomId) {
                return;
            }

            var failCallback = function (err) {
                console.error(err);
                //出现错误，需要前端进行重试
                self.roomId = "";
                syncEnterRoomLock = false;
                ExceptionHandler.call(self, err);
            }

            try
            {
                syncEnterRoomLock = true;

                //用户编号
                var uid = self.loginInfo.identifier;

                self.roomId = roomid;

                self.Users = [];

                for (var uid in StreamList) {
                    StreamList[uid].stream.stop();
                }

                //清空视频流
                StreamList = {};

                var joinCallback = function () {               

                    if (localStream) {
                        // local stream exist already
                        client.unpublish(localStream, function (err) {
                            console.log("Unpublish failed with error: ", err);
                        });
                        localStream.close();
                    }

                    //重新建立视频流
                    localStream = AgoraRTCSDK.createStream({
                        streamID: uid,
                        local: true,
                        audio: true,
                        video: true,
                        screen: false,
                        attributes:{
                            minFrameRate:15,
                            maxFrameRate:30,
                            resolution: "sif"
                        }
                    });

                    //设置视频的配置
                    localStream.setVideoProfile(self.generateVideoProfile(resolution, maxFrameRate));

                    //初始化视频流
                    localStream.init(function () {

                        console.log("getUserMedia successfully");

                        client.publish(localStream, function (err) {
                            console.error("Publish local stream error: " + err);

                            failCallback(err);

                        });

                        client.on('stream-published', function (evt) {
                            console.log("Publish local stream successfully"+new Date().toTimeString());
                        });

                        syncEnterRoomLock = false;
                        addUser.call(self, uid, localStream);

                    }, function (err) {

                        //打开摄像头失败
                        console.error("getUserMedia failed", err);

                        failCallback(err);
                    });
                }

                client = AgoraRTCSDK.createClient({ mode: 'interop' })

                //初始化客户端
                client.init(self.config.AppID, function (obj) {

                    console.log("AgoraRTC client initialized");

                    //加入房间
                    client.join(self.config.MediaChannelKey, roomid + "", parseInt(uid), function () {

                        console.log("User " + uid + " join channel successfully");

                        joinCallback();

                    }, function (err) {

                        console.error("User " + uid + " join channel failed", err);

                        failCallback(err);

                    });

                }, function (error) {

                    ExceptionHandler.call(self, error, function () { });

                    if (failCallBack) {
                        failCallBack(error);
                    }
                });

                //通知应用程序远程语音/视频流已添加。
                client.on('stream-added', function (evt) {


                    var stream = evt.stream;
                    console.log("New stream added: " + stream.getId());
                    console.log("Timestamp: " + Date.now());
                    console.log("Subscribe ", stream);
                    client.subscribe(stream, function (err) {
                        console.log("Subscribe stream failed", err);
                    });


                });

                client.on("stream-removed", function (evt) {

                    var stream = evt.stream;
                    console.log("Stream removed: " + evt.stream.getId());
                    console.log("Timestamp: " + Date.now());
                    console.log(evt);
                });

                //通知应用程序远端用户已离开房间 (例如对方用户调用了 client.leave())，可以停止播放
                client.on('peer-leave', function (evt) {
                    console.log("Peer has left: " + evt.uid);
                    console.log("Timestamp: " + Date.now());
                    console.log(evt);

                    //删除用户
                    removeUser.call(self, evt.uid);

                });

                //通知应用程序已订阅远程语音/视频流，可以开始播放远端视频。
                client.on('stream-subscribed', function (evt) {
                    var stream = evt.stream;
                    var uid = stream.getId();
                    console.log("Got stream-subscribed event");
                    console.log("Timestamp: " + Date.now());
                    console.log("Subscribe remote stream successfully: " + uid);
                    console.log(evt);


                    //添加用户
                    addUser.call(self, uid, stream)
                });

                //通知应用程序远端用户已选择不发送或者重新发送视频流。
                client.on("peer-mute-video", function (event) {
                    var message = event.msg;

                    setUserVideo.call(self, message.uid, message.muted);

                    if (message.muted) {
                        console.log("remote user " + message.uid + " muted video");
                    }
                    else {
                        console.log("remote user " + message.uid + " unmuted video");
                    }
                });

                //通知应用程序远端用户已选择不发送或重新发送语音流。
                client.on("peer-mute-audio", function (event) {
                    var message = event.msg;

                    setUserAudio.call(self, message.uid, message.muted);

                    if (message.muted) {
                        console.log("remote user " + message.uid + " muted audio");
                    } else {
                        console.log("remote user " + message.uid + " unmuted audio");
                    }
                });

                client.on("error", function (event) {

                    ExceptionHandler.call(self, event, function () { });

                });

           
            }
            catch (err)
            {
                failCallback(err);
            }
        }
        //退出
        videoMgr.prototype.Quit = function (callback) {
            var self = this;
            self.config.Video = false;
            self.config.Audio = false;
            self.config.Screen = false;
            self.roomId = null;
            //清空用户
            self.Users = [];

            try
            {
                if (client)
                {
                    client.leave();

                    //如果本地视频流已经存在则停止发布并关闭
                    if (localStream) {
                        // local stream exist already
                        client.unpublish(localStream, function (err) {
                            console.log("Unpublish failed with error: ", err);
                        });
                        localStream.close();
                    }

                    for (var uid in StreamList) {
                        StreamList[uid].stream.stop();
                    }

                    localStream = null;
                    //清空视频流
                    StreamList = {};

                    if (callback)
                        callback()
                }
                else {
                    localStream = null;
                    //清空视频流
                    StreamList = {};

                    if (callback)
                        callback()
                }
            }
            catch (e) {

                console.error(e);

                if (callback)
                    callback()
            }
        }
        //显示用户视频（供UI调用）
        videoMgr.prototype.displayVideo = function () {


            //显示视频信号
            for (var i = 0; i < this.Users.length; i++) {
                if (this.Users[i].dwUserId) {
                    requestVideo("video-user-" + this.Users[i].dwUserId, this.Users[i].dwUserId);
                }
            }
        }

        //获取所有设备
        videoMgr.prototype.getDevices = function (callback) {
            var self = this;
            
            AgoraRTCSDK.getDevices(function (devices) {
                if (callback)
                    callback(devices);

            });           
        }

        //选择设备
        videoMgr.prototype.selectDevice = function (device) {
            client.selectDevice(device);
        }

        //开启屏幕共享
        videoMgr.prototype.startScreenSharing = function (startCallback) {
            var self = this;

            //允许屏幕共享且，客户端存在
            if (client && self.config.Screen) {
                client.startScreenSharing("", function () {

                    if (startCallback)
                        startCallback();
                });
            }
        }

        //停止屏幕共享
        videoMgr.prototype.stopScreenSharing = function (stopCallback) {
            var self = this;

            //允许屏幕共享且，客户端存在
            if (client && self.config.Screen) {
                client.stopScreenSharing(function () {

                    if (stopCallback)
                        stopCallback();

                });

            }
        }

        // 启用/停止视频流
        videoMgr.prototype.enableVideo = function (enable) {
            if (!localStream)
                return;

            if (enable) {
                localStream.enableVideo();
            }
            else {
                localStream.disableVideo();
            }
        }

        // 启用/停止麦克风
        videoMgr.prototype.enableAudio = function (enable) {
            if (!localStream)
                return;

            if (enable) {
                localStream.enableAudio();
            }
            else {
                localStream.disableAudio();
            }
        }

        //添加到远程视频流列表
        function addUser(uid, stream) {

            var self = this;
            var userExistsFlag = false;
            if (stream) {
                //检查是否有重复的用户存在，避免重复添加
                for (var i = 0; i < self.Users.length; i++) {

                    //如果用户已经存在则返回
                    if (self.Users[i].userId == uid) {
                        userExistsFlag = true;
                        break;
                    }
                }


                //用户不存在才添加
                if (!userExistsFlag) {

                    StreamList[uid] = {
                        id: uid,
                        stream: stream,
                        videoEnabled: true,
                        audioEnabled: true
                    };

                    self.Users.push({
                        userId: uid,
                        dwUserId: uid,
                        camera: 1,//视频状态
                        holdmic: 1,//音频状态
                        recording: 1,//录音状态
                        deviceType: 0//设备类型
                    });

                    eventBus.dispatch(EventType.streamAdded, { uid: uid, stream: stream })
                }
            }
        }

        //删除用户
        function removeUser(uid) {
            var self = this;

            for (var i = 0; i < self.Users.length; i++) {
                if (self.Users[i].userId == uid) {
                 
                    eventBus.dispatch(EventType.streamRemoved, { uid: uid, stream: StreamList[uid].stream })

                    //移除用户
                    self.Users.removeByIndex(i);

                    //删除视频
                    StreamList[uid] = null

                    delete StreamList[uid];
                }
            }


        }

        //设置用户语音状态
        function setUserAudio(uid, muted) {
            var self = this;

            for (var i = 0; i < self.Users.length; i++) {
                if (self.Users[i].userId == uid) {
                    self.Users[i].audio = muted ? 1 : 0;


                    eventBus.dispatch(EventType.peerMuteAudio, { uid: muted });
                }
            }
        }

        //设置用户视频状态
        function setUserVideo(uid, muted) {
            var self = this;

            for (var i = 0; i < self.Users.length; i++) {
                if (self.Users[i].userId == uid) {
                    self.Users[i].video = muted ? 1 : 0;

                    eventBus.dispatch(EventType.peerMuteVideo, { uid: muted });

                }
            }
        }

        function ExceptionHandler(err, callback) {
            var self = this;

            eventBus.dispatch("room-video-error", err);

            if (err) {
                switch (err.reason) {
                    /*
                     * 表明无法连接到 AgoraWebAgent。可能的原因有：
                        无可用网络。由于采用了安全的 websocket 本地连接，
                        连接 AgoraWebAgent 需要 DNS 服务，当 DNS 服务不可用时连不上 AgoraWebAgent。
                        未启动 AgoraWebAgent。
                        未安装 AgoraWebAgent。
                        使用了代理，导致无法连接 AgoraWebAgent
                     */
                    case 'CLOSE_BEFORE_OPEN':
                        {
                            NotInstallPlugin(self)
                            break;
                        }
                        /* 可能的原因是 1.6 版的 JS 与之前版本的AgoraWebAgent 不兼容，需根据回调里返回的 URL 升级AgoraWebAgen*/
                    case "INCOMPATIBLE_WEBAGENT":
                        {
                            console.log("web agent version does not match");
                            NotInstallPlugin(self);
                            break;
                        }
                        //客户端代理被关闭
                    case "LOST_CONNECTION_TO_AGENT":
                        {
                            NotInstallPlugin(self);
                            break;
                        }
                    case "CHANNEL_KEY_EXPIRED":
                    case "DYNAMIC_KEY_TIMEOUT":
                    case "INVALID_DYNAMIC_KEY":
                        {
                            //重新设置房间动态秘钥
                            self.renewChannelKey(self.config.MediaChannelKey);
                        }
                    default:
                        {
                            console.error(err)

                        }
                }
            }

        }

        function getInstallUrl() {
            if (navigator.appVersion.indexOf("Mac") != -1) {
                return AgoraRTCSDK.macAgentInstallUrl;
            }

            return AgoraRTCSDK.winAgentInstallUrl;
        }

        function getInstallGuideUrl() {
            var userLang = navigator.language || navigator.userLanguage;
            if (userLang.indexOf("zh") != -1) {
                return AgoraRTCSDK.cnAgentInstallGuideUrl;
            }
            return AgoraRTCSDK.enAgentInstallGuideUrl;
        }

        function NotInstallPlugin(self) {

            //var message = 'To use voice/video functions, you need to run Agora Media Agent first.<ul><li> If you do not have it installed, please visit url <a style="font-weight:bold;" href="' + err.agentInstallUrl + '">AgoraWebAgent</a> to install it. Please refer to the <a style="font-weight:bold;" href="' + err.agentInstallGuideUrl + '">installation guide</a> if you encounter any questions.</li><li>If you have installed it, please double click the icon to run this app.</li><li>If it has been running, please check if the internet connection is working or not.</li></ul>'
            var message = '使用语音/视频功能，您需要运行视频插件.<ul><li>如果您没有安装，请<a target=_blank style="font-weight:bold;" href="' + getInstallUrl() + '">安装</a> 它。</li><li>如果您遇到任何问题，请参阅<a  target=_blank style="font-weight:bold;" href="' + getInstallGuideUrl() + '">安装指南</a>。</li><li>如果您已经安装了它，请双击该图标来运行这个应用程序。如果它一直在运行，请检查网络连接是否正常。</li></ul>'

            var dialog = layer.confirm(message, {
                title: "您需要运行视频插件",
                btn: ['不再提醒', '重试'] //按钮

            }, function () {
                layer.close(dialog)

                TryAgain = false;

            }, function () {

                if (TryAgain) {

                    setTimeout(function () {

                        //重新初始化SDK
                        self.Init(self.config, function () {

                            //重新进入房间
                            self.enterRoom(self.ChannelID)

                        });

                    }, 1000);
                }
            });
        }

        /*
          * 显示视频信号
          * params:
          * viewDiv -dom元素id
          * memberId -成员编号，如果是本人为空
        */
        function requestVideo(viewDiv, dwUserId) {

            try {

                console.log("requestVideo(dwUserId:" + dwUserId + ",viewDiv:" + viewDiv + ")");

                if ($("#" + viewDiv).length <= 0) {

                    console.warn("video view " + viewDiv + " not found");

                    setTimeout(function () { requestVideo(viewDiv, dwUserId) }, 1000);

                    return;
                }
                else {
                    var stream = StreamList[dwUserId].stream;

                    stream.play(viewDiv, function (err) {
                        layer.msg(err.error);
                    });
                }

            }
            catch (e) {
                console.error(e)
            }
        }

        return videoMgr;

    })();

    return AgoraRTCSDK_Mgr;
})