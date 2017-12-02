"use strict";
define([
//        "module-services-eventBus",
//        "plugins-layer",
    ],
    function () {
        /*****视频模块私有变量*******/
        function isDebug() {
            return window.__debug__ || location.href.match(/debugger/);
        }

        function log() {
            if (isDebug()) {
                console.log.apply(console, arguments);
            }
        }

        function fnDebugger() {
            if (isDebug()) {
                (function () { debugger; })();
            }
        }

        function callCefLib(name) {
            if (!window.cefLib || !window.cefLib[name]) {
                throw new Error("cefLib." + name + " not found");
            }
            var args = [].slice.call(arguments, 1);
            log("calling cefLib " + name, args);
            var fn = window.cefLib[name];
            var ret = fn.apply(window.cefLib, args);
            if (typeof ret === "string") {
                try {
                    return JSON.parse(ret);
                } catch (e) {
                    
                }
            }
            return ret;
        }

        //出错重试
        var TryAgain = true;

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

        //sdk回调事件类型
        var EventType = {
            "streamAdded": "room-stream-added",
            "streamRemoved": "room-stream-removed",
            "peerMuteVideo": "room-peer-mute-video",
            "peerMuteAudio": "room-peer-mute-audio",
        };

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
            var self = this;
            this.config = config;
            var emit = false;
            try {
                var res = callCefLib('init', config.MediaChannelKey, config.RecordingKey, config.Audio, config.Video, config.AppID, !!config.AudioOnly);
                emit = true;
                if (res && res.success) {
                    // 仅用于语音问诊的UI
                    self.Users = [];
                    successCallback && successCallback(true);
                } else {
                    failCallBack && failCallBack(res.errorReason);
                }
            } catch (e) {
                console.error(e);
                fnDebugger();
                if (!emit) failCallBack(e);
            }
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
        }

        //加入房间
        videoMgr.prototype.enterRoom = function (roomid) {
            var self = this;
            this.roomId = roomid;
            try {
                callCefLib('enterRoom', this.loginInfo.identifier, roomid);

                // 仅用于语音问诊的UI
                if (self.Users.length == 0) {
                    self.Users.push({
                        camera: 1,//视频状态
                        holdmic: 1,//音频状态
                        recording: 1,//录音状态
                        deviceType: 0//设备类型
                    });
                }

            } catch (e) {
                console.error(e);
                fnDebugger();
            }
        }
        //退出
        videoMgr.prototype.Quit = function (callback) {
            var self = this;
            self.config.Video = false;
            self.config.Audio = false;
            self.config.Screen = false;
            self.roomId = null;
            try {
                callCefLib('quit');
                // 仅用于语音问诊的UI
                self.Users = [];
            } catch (e) {
                console.error(e);
                fnDebugger();
            }
            callback && callback();
        }
        //显示用户视频（供UI调用）
        videoMgr.prototype.displayVideo = function () {
            //显示视频信号
        }

        //获取所有设备
        videoMgr.prototype.getDevices = function (callback) {
            try {
                var devices = callCefLib('getDevices');
                var cb = callback;
                callback = null;
                cb && cb(devices);
            } catch (e) {
                console.error(e);
                fnDebugger();
                callback && callback([]);
            }
        }

        //选择设备
        videoMgr.prototype.selectDevice = function (device) {
            try {
                callCefLib('selectDevice', device.kind, device.deviceId);
            } catch (e) {
                console.error(e);
                fnDebugger();
            }
        }

        //开启屏幕共享
        videoMgr.prototype.startScreenSharing = function (startCallback) {

        }

        //停止屏幕共享
        videoMgr.prototype.stopScreenSharing = function (stopCallback) {

        }

        // 启用/停止视频流
        videoMgr.prototype.enableVideo = function (enable) {
            try {
                callCefLib('enableVideo', enable);
            } catch (e) {
                console.error(e);
                fnDebugger();
            }
        }

        // 启用/停止麦克风
        videoMgr.prototype.enableAudio = function (enable) {
//            try {
//                callCefLib('enableAudio', enable);
//            } catch (e) {
//                console.error(e);
//                fnDebugger();
//            }
        }

        // 移动视频窗口
        videoMgr.prototype.moveVideo = function (top, right, bottom, left) {
            try {
                callCefLib('moveVideo', top, right, bottom, left);
            } catch (e) {
                console.error(e);
                fnDebugger();
            }
        }

        videoMgr.prototype.isNative = true;

        videoMgr.isNative = function () {
            return !!window.cefLib;
        }

        return videoMgr;

    })