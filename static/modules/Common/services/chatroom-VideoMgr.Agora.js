
"use strict";
define(["module-services-eventBus",
        "plugins-layer",
        "module-services-chatroom-videoMgr.Agora.Native",
        "module-services-chatroom-videoMgr.Agora.RTCSDK",
        "module-services-chatroom-videoMgr.Agora.RTCAgentSDK",
        "module-services-apiUtil",
], function (eventBus, layer, nativeMgr, AgoraRTCSDK_Mgr, AgoraRTCAgentSDK_Mgr, apiUtil) {

    var sdk = {};
 

    /* 
       * Agora视频插件(插件版本)
       * 作者：郭明
       * 日期：2017年4月11日
       */
    var videoMgr = (function () {

        function videoMgr(loginInfo) {
            //登录信息
            this.loginInfo = loginInfo;
       
            this.config = {
                Audio: false,
                Video: false,
                Screen: false
            };

            //默认使用非插件版本
            sdk[true] = new AgoraRTCSDK_Mgr(loginInfo);
            //降级之后，使用插件版本
            sdk[false] =new  AgoraRTCAgentSDK_Mgr(loginInfo);

            sdk['native'] = new nativeMgr(loginInfo);
        }

        //是否支持WebRTC
        videoMgr.prototype.supportWebRTC = function ()
        {

            var https = 'https:' === document.location.protocol ? true : false;

            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();

         
            try
            {
                if (window.ActiveXObject)
                    Sys.ie = ua.match(/msie ([\d.]+)/)[1]
                else if (document.getBoxObjectFor)
                    Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1]
                else if (window.MessageEvent && !document.getBoxObjectFor)
                    Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1]
                else if (window.opera)
                    Sys.opera = ua.match(/opera.([\d.]+)/)[1]
                else if (window.openDatabase)
                    Sys.safari = ua.match(/version\/([\d.]+)/)[1];

             
                if (Sys.ie)
                    console.log('IE: ' + Sys.ie);
                if (Sys.firefox)
                    console.log('Firefox: ' + Sys.firefox);
                if (Sys.chrome)
                    console.log('Chrome: ' + Sys.chrome);
                if (Sys.opera)
                    console.log('Opera: ' + Sys.opera);
                if (Sys.safari)
                    console.log('Safari: ' + Sys.safari);

                //本地是Chrome浏览器并且已经启用Https
                if (Sys.chrome && https) {
                    if (parseInt(Sys.chrome) >= 54) {
                        return true;
                    }
                    else {
                        layer.msg("当前浏览器版本过低，请升级", { icon: 2, shade: 0.5 });
                        return false;
                    }
                }
            
            }
            catch(ex)
            {

            }

            return false;
        }
        
        function getSdk()
        {
            if (nativeMgr.isNative()) {
                return sdk['native'];
            }
            var result = sdk[videoMgr.prototype.WebSdkInteroperability()];

            return result;
        }

        var _WebSdkInteroperability = true;

        //设置互操作性
        videoMgr.prototype.WebSdkInteroperability = function () {

            //没有参数则返回
            if (arguments.length <= 0) {
                return _WebSdkInteroperability;
            }
            else
            {
                //禁用互通性，高版本的的情况
                if (_WebSdkInteroperability)
                {
                    //远端的互操作状态和本地状态不一致，降级
                    if (_WebSdkInteroperability === arguments[0]) {
                        _WebSdkInteroperability = true;
                    }
                    else
                    {
                        console.warn("已切换到视频兼容模式");
                        _WebSdkInteroperability = false;
                    }
                }

                console.log("WebSdkInteroperability", _WebSdkInteroperability);

                return _WebSdkInteroperability;
            }
        }

        videoMgr.prototype.getResolutionArray = function (reso) {
           
           return getSdk().getResolutionArray(reso);
        };

        videoMgr.prototype.getResolution = function () {
            return getSdk().resolution;
        }

        videoMgr.prototype.getUsers = function () {
            return getSdk().Users;
        }

        //初始化
        videoMgr.prototype.Init = function (config, successCallback, failCallBack) {

            return getSdk().Init(config, successCallback, failCallBack);
        }

        //重新设置频道秘钥
        videoMgr.prototype.renewChannelKey = function (MediaChannelKey, successCallback, failCallBack) {
            return getSdk().renewChannelKey(MediaChannelKey, successCallback, failCallBack);
        }

        //加入房间
        videoMgr.prototype.enterRoom = function (roomid) {
            return getSdk().enterRoom(roomid);
        }

        //退出
        videoMgr.prototype.Quit = function (callback) {
            
            debugger
            _WebSdkInteroperability = true;
            sdk[true].Quit();
            sdk[false].Quit(callback);
            if (getSdk().isNative) sdk["native"].Quit();
        }

        //显示用户视频（供UI调用）
        videoMgr.prototype.displayVideo = function () {
            return getSdk().displayVideo();
        }

        //获取所有设备
        videoMgr.prototype.getDevices = function (callback) {
            return getSdk().getDevices(callback);
        }

        //选择设备
        videoMgr.prototype.selectDevice = function (device) {
            return getSdk().selectDevice(device);
        }


        //开启屏幕共享
        videoMgr.prototype.startScreenSharing = function (startCallback) {
            return getSdk().startScreenSharing(startCallback);
        }

        //停止屏幕共享
        videoMgr.prototype.stopScreenSharing = function (stopCallback) {
            return getSdk().stopScreenSharing(stopCallback);
        }

        // 启用/停止视频流
        videoMgr.prototype.enableVideo = function (enable) {
            return getSdk().enableVideo(enable);
        }

        Object.defineProperty(videoMgr.prototype,
            "isNative",
            {
                get: function () {
                    return !!(getSdk().isNative);
                }
            });

        return videoMgr;

    })();


    return videoMgr;

})

