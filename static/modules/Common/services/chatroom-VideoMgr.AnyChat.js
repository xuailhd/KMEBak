define(["plugins-sdk-anychat"], function ()
{

    var videoMgr = (function () {

        //是否已经初始化
        var mInited = false;
        //重试标记
        var TryAgain = true;
        //检查是否安装了插件,定义业务层需要的AnyChat API Level
        var NEED_ANYCHAT_APILEVEL = "0";
        //sdk回调事件类型
        var EventType = {
            "ROOM_MEMBERS_CHANGE": 4,
        };

        function videoMgr(loginInfo) {
            this.mDefaultServerAddr = "112.74.101.192";    // 默认服务器地址 112.74.101.192
            this.mDefaultServerPort = 8906;					// 默认服务器端口号
            this.mSelfUserId = -1; 							// 本地用户ID
            this.loginInfo = loginInfo;
            //已显示视频的用户
            this.OpenedViewUserIds = [];
            //当前成员
            this.Users = [];


            //状态变化的事件(需重写)
            this.onStatusChanged = function (evt, params) {
                console.error("请重写videoMgr.onStatusChanged方法")
            }

            var EventHandlers = (function (self) {


                //设置AnyChat参数，需要在收到登录成功回调之后调用
                function ConfigAnyChatParameter() {

                }

                // 客户端连接服务器，bSuccess表示是否连接成功，errorcode表示出错代码
                function OnAnyChatConnect(bSuccess, errorcode) {
                    console.log("OnAnyChatConnect(errorcode=" + errorcode + ")");
                }

                // 客户端登录系统，dwUserId表示自己的用户ID号，errorcode表示登录结果：0 成功，否则为出错代码，参考出错代码定义
                function OnAnyChatLoginSystem(dwUserId, errorcode) {

                    //dwUserID为anyChat的用户编号，跟登录时的账号无关
                    console.log("OnAnyChatLoginSystem(userid=" + dwUserId + ", errorcode=" + errorcode + ")");

                    if (errorcode == 0) {
                        ConfigAnyChatParameter();
                        self.mSelfUserId = dwUserId;
                        self.Users.push({
                            userId: BRAC_GetUserName(dwUserId),
                            dwUserId: dwUserId,
                            camera: BRAC_QueryUserStateInt(dwUserId, BRAC_USERSTATE_CAMERA),//视频状态
                            holdmic: BRAC_QueryUserStateInt(dwUserId, BRAC_USERSTATE_HOLDMIC),//音频状态
                            recording: BRAC_QueryUserStateInt(dwUserId, BRAC_USERSTATE_RECORDING),//录音状态
                            deviceType: BRAC_QueryUserStateInt(dwUserId, BRAC_USERSTATE_DEVICETYPE)//设备类型
                        });
                        self.onStatusChanged(EventType.ROOM_MEMBERS_CHANGE, EventType);
                    }
                    else {

                    }
                }

                // 客户端进入房间，dwRoomId表示所进入房间的ID号，errorcode表示是否进入房间：0成功进入，否则为出错代码
                function OnAnyChatEnterRoom(dwRoomId, errorcode) {
                    console.log("OnAnyChatEnterRoom(roomid=" + dwRoomId + ", errorcode=" + errorcode + ")");

                    if (errorcode == 0) {
                        self.onStatusChanged(EventType.ENTER_ROOM, EventType);
                    }
                    else {

                    }
                }

                // 收到当前房间的在线用户信息，进入房间后触发一次，dwUserCount表示在线用户数（包含自己），dwRoomId表示房间ID
                function OnAnyChatRoomOnlineUser(dwUserCount, dwRoomId) {

                    console.log("OnAnyChatRoomOnlineUser(count=" + dwUserCount + ", roomid=" + dwRoomId + ")");

                    var dwUserIds = BRAC_GetOnlineUser();

                    //返回的用户编号数量，小于在线总人数则把自己算上
                    if (dwUserIds.length < dwUserCount) {
                        dwUserIds.push(self.mSelfUserId);
                    }

                    self.Users = [];
                    for (var i = 0; i < dwUserIds.length; i++) {
                        var newUser = {
                            userId: BRAC_GetUserName(dwUserIds[i]),
                            dwUserId: dwUserIds[i],
                            camera: BRAC_QueryUserStateInt(dwUserIds[i], BRAC_USERSTATE_CAMERA),//视频状态
                            holdmic: BRAC_QueryUserStateInt(dwUserIds[i], BRAC_USERSTATE_HOLDMIC),//音频状态
                            recording: BRAC_QueryUserStateInt(dwUserIds[i], BRAC_USERSTATE_RECORDING),//录音状态
                            deviceType: BRAC_QueryUserStateInt(dwUserIds[i], BRAC_USERSTATE_DEVICETYPE)//设备类型
                        };
                        self.Users.push(newUser);

                    }

                    self.onStatusChanged(EventType.ROOM_MEMBERS_CHANGE, EventType);

                }

                // 用户进入（离开）房间，dwUserId表示用户ID号，bEnterRoom表示该用户是进入（1）或离开（0）房间
                function OnAnyChatUserAtRoom(dwUserId, bEnterRoom) {

                    console.log("OnAnyChatUserAtRoom(userid=" + dwUserId + ", benter=" + bEnterRoom + ")");

                    if (bEnterRoom) {
                        var newUser = {
                            userId: BRAC_GetUserName(dwUserId),
                            dwUserId: dwUserId,
                            camera: BRAC_QueryUserStateInt(dwUserId, BRAC_USERSTATE_CAMERA),//视频状态
                            holdmic: BRAC_QueryUserStateInt(dwUserId, BRAC_USERSTATE_HOLDMIC),//音频状态
                            recording: BRAC_QueryUserStateInt(dwUserId, BRAC_USERSTATE_RECORDING),//录音状态
                            deviceType: BRAC_QueryUserStateInt(dwUserId, BRAC_USERSTATE_DEVICETYPE)//设备类型
                        };

                        if (!self.Users.contains(newUser)) {
                            self.Users.push(newUser);
                        }
                    }
                    else {
                        for (var i = 0; i < self.Users.length; i++) {
                            if (self.Users[i].dwUserId == dwUserId) {
                                self.Users.removeByIndex(i);
                            }
                        }
                    }

                    self.onStatusChanged(EventType.ROOM_MEMBERS_CHANGE, EventType);


                }

                // 网络连接已关闭，该消息只有在客户端连接服务器成功之后，网络异常中断之时触发，reason表示连接断开的原因
                function OnAnyChatLinkClose(reason, errorcode) {
                    console.log("OnAnyChatLinkClose(reason=" + reason + ", errorcode=" + errorcode + ")");
                }

                // 用户的音频设备状态变化消息，dwUserId表示用户ID号，State表示该用户是否已打开音频采集设备（0：关闭，1：打开）
                function OnAnyChatMicStateChange(dwUserId, State) {
                    console.log("OnAnyChatMicStateChange(dwUserId=" + dwUserId + ", State=" + State + ")");
                }

                // 用户摄像头状态发生变化，dwUserId表示用户ID号，State表示摄像头的当前状态（0：没有摄像头，1：有摄像头但没有打开，2：打开）
                function OnAnyChatCameraStateChange(dwUserId, State) {
                    console.log("OnAnyChatCameraStateChange(dwUserId=" + dwUserId + ", State=" + State + ")");



                }

                // 本地用户与其它用户的P2P网络连接状态发生变化，dwUserId表示其它用户ID号，State表示本地用户与其它用户的当前P2P网络连接状态（0：没有连接，1：仅TCP连接，2：仅UDP连接，3：TCP与UDP连接）
                function OnAnyChatP2PConnectState(dwUserId, State) {
                    console.log("OnAnyChatP2PConnectState(dwUserId=" + dwUserId + ", State=" + State + ")");

                }

                // 用户发起私聊请求，dwUserId表示发起者的用户ID号，dwRequestId表示私聊请求编号，标识该请求
                function OnAnyChatPrivateRequest(dwUserId, dwRequestId) {
                    // console.log("OnAnyChatPrivateRequest(dwUserId=" + dwUserId + ", dwRequestId=" + dwRequestId + ")");
                }

                // 用户回复私聊请求，dwUserId表示回复者的用户ID号，errorcode为出错代码
                function OnAnyChatPrivateEcho(dwUserId, errorcode) {
                    //console.log("OnAnyChatPrivateEcho(dwUserId=" + dwUserId + ", errorcode=" + errorcode + ")");

                }

                // 用户退出私聊，dwUserId表示退出者的用户ID号，errorcode为出错代码
                function OnAnyChatPrivateExit(dwUserId, errorcode) {
                    //console.log("OnAnyChatPrivateExit(dwUserId=" + dwUserId + ", errorcode=" + errorcode + ")");

                }

                // 视频通话消息通知回调函数
                function OnAnyChatVideoCallEvent(dwEventType, dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
                    // console.log("OnAnyChatVideoCallEvent(dwEventType=" + dwEventType + ", dwUserId=" + dwUserId + ", dwErrorCode=" + dwErrorCode + ", dwFlags=" + dwFlags + ", dwParam=" + dwParam + ", szUserStr=" + szUserStr + ")");

                }

                // 用户信息更新通知，dwUserId表示用户ID号，dwType表示更新类别
                function OnAnyChatUserInfoUpdate(dwUserId, dwType) {
                    //console.log("OnAnyChatUserInfoUpdate(dwUserId=" + dwUserId + ", dwType=" + dwType + ")");
                }

                // 好友在线状态变化，dwUserId表示好友用户ID号，dwStatus表示用户的当前活动状态：0 离线， 1 上线
                function OnAnyChatFriendStatus(dwUserId, dwStatus) {
                    //console.log("OnAnyChatFriendStatus(dwUserId=" + dwUserId + ", dwStatus=" + dwStatus + ")");

                }

                // 用户视频分辩率发生变化，dwUserId（INT）表示用户ID号，dwResolution（INT）表示用户的视频分辨率组合值（低16位表示宽度，高16位表示高度）
                function OnAnyChatVideoSizeChange(dwUserId, dwResolution) {
                    return;
                    var divId = "";

                    for (var i = 0; i < self.Users.length; i++) {
                        if (self.Users[i].dwUserId == dwUserId) {
                            divId = self.Users[i].divId;
                            break;
                        }

                    }

                    var height = dwResolution >> 16;
                    var width = dwResolution & 0x0000ffff;
                    var divWidth = GetID(divId).offsetWidth;
                    var divHeight = GetID(divId).offsetHeight;


                    //如果采用视频显示裁剪模式是动态模式，可根据分辨率的情况，动态改变div布局，使得画面不变形。
                    if (width > height) {
                        if (divWidth < divHeight) {
                            //竖屏切换到横屏情况
                            GetID(divId).style.width = (4.0 / 3 * divHeight) + "px";
                            GetID(divId).style.height = divHeight + "px";
                        }
                    }
                    else {
                        if (divWidth > divHeight) {
                            //横屏切换到竖屏情况
                            GetID(divId).style.width = (3.0 / 4 * divHeight) + "px";
                            GetID(divId).style.height = divHeight + "px";
                        }
                    }
                }

                function RefreshUsers() {


                }
                // 异步消息通知，包括连接服务器、登录系统、进入房间等消息
                window.OnAnyChatNotifyMessage = function (dwNotifyMsg, wParam, lParam) {

                    switch (dwNotifyMsg) {
                        // 客户端连接服务器，bSuccess表示是否连接成功，errorcode表示出错代码
                        case WM_GV_CONNECT: OnAnyChatConnect(wParam, lParam); break;
                            //客户端登录系统，dwUserId表示自己的用户ID号，errorcode表示登录结果：0 成功，否则为出错代码，参考出错代码定义
                        case WM_GV_LOGINSYSTEM: OnAnyChatLoginSystem(wParam, lParam); break;
                            //客户端进入房间，dwRoomId表示所进入房间的ID号，errorcode表示是否进入房间：0成功进入，否则为出错代码
                        case WM_GV_ENTERROOM: OnAnyChatEnterRoom(wParam, lParam); break;
                            //收到当前房间的在线用户信息，进入房间后触发一次，dwUserCount表示在线用户数（包含自己），dwRoomId表示房间ID
                        case WM_GV_ONLINEUSER: OnAnyChatRoomOnlineUser(wParam, lParam); break;
                            //用户进入（离开）房间，dwUserId表示用户ID号，bEnterRoom表示该用户是进入（1）或离开（0）房间
                        case WM_GV_USERATROOM: OnAnyChatUserAtRoom(wParam, lParam); break;
                            //网络连接已关闭，该消息只有在客户端连接服务器成功之后，网络异常中断之时触发，reason表示连接断开的原因
                        case WM_GV_LINKCLOSE: OnAnyChatLinkClose(wParam, lParam); break;
                            //用户的音频设备状态变化消息，dwUserId表示用户ID号，State表示该用户是否已打开音频采集设备（0：关闭，1：打开）
                        case WM_GV_MICSTATECHANGE: OnAnyChatMicStateChange(wParam, lParam); break;
                            //用户摄像头状态发生变化，dwUserId表示用户ID号，State表示摄像头的当前状态（0：没有摄像头，1：有摄像头但没有打开，2：打开）
                        case WM_GV_CAMERASTATE: OnAnyChatCameraStateChange(wParam, lParam); break;
                            // 本地用户与其它用户的P2P网络连接状态发生变化，dwUserId表示其它用户ID号，State表示本地用户与其它用户的当前P2P网络连接状态（0：没有连接，1：仅TCP连接，2：仅UDP连接，3：TCP与UDP连接）
                        case WM_GV_P2PCONNECTSTATE: OnAnyChatP2PConnectState(wParam, lParam); break;
                            // 用户发起私聊请求，dwUserId表示发起者的用户ID号，dwRequestId表示私聊请求编号，标识该请求
                        case WM_GV_PRIVATEREQUEST: OnAnyChatPrivateRequest(wParam, lParam); break;
                            //用户回复私聊请求，dwUserId表示回复者的用户ID号，errorcode为出错代码
                        case WM_GV_PRIVATEECHO: OnAnyChatPrivateEcho(wParam, lParam); break;
                            //用户退出私聊，dwUserId表示退出者的用户ID号，errorcode为出错代码
                        case WM_GV_PRIVATEEXIT: OnAnyChatPrivateExit(wParam, lParam); break;
                            //用户信息更新通知，dwUserId表示用户ID号，dwType表示更新类别
                        case WM_GV_USERINFOUPDATE: OnAnyChatUserInfoUpdate(wParam, lParam); break;
                            //好友在线状态变化，dwUserId表示好友用户ID号，dwStatus表示用户的当前活动状态：0 离线， 1 上线
                        case WM_GV_FRIENDSTATUS: OnAnyChatFriendStatus(wParam, lParam); break;
                            //用户视频分辩率发生变化，dwUserId（INT）表示用户ID号，dwResolution（INT）表示用户的视频分辨率组合值（低16位表示宽度，高16位表示高度）
                        case WM_GV_VIDEOSIZECHG: OnAnyChatVideoSizeChange(wParam, lParam); break;
                        default:
                            break;
                    }
                }

                //修正视频位置
                $(window).resize(function () {

                    self.displayVideo();
                });

                //修正视频位置
                $(window).scroll(function () {
                    self.displayVideo();
                });



            })(this);

        }

        //初始化组件
        videoMgr.prototype.Init = function () {

            try {
                //已经初始化
                if (mInited) {
                    return;
                }

                var self = this;

                //获取浏览器信息，并匹配Edge浏览器
                var ua = window.navigator.userAgent.toLowerCase();

                var info = { edge: /edge/.test(ua) };
                if (info.edge)
                {
                    NotSupportEdgeBrowser.call(self);
                    return;
                }
                else {

                    if (navigator.plugins && navigator.plugins.length) {
                        window.navigator.plugins.refresh(false);
                    }

                    // 初始化插件
                    var errorcode = BRAC_InitSDK(NEED_ANYCHAT_APILEVEL);

                    console.log("BRAC_InitSDK(" + NEED_ANYCHAT_APILEVEL + ")=" + errorcode);

                    if (errorcode == GV_ERR_SUCCESS) {
                        errorcode = BRAC_SetSDKOption(BRAC_SO_VIDEOBKIMAGE, "/static/images/bg-video.jpg");
                        console.log("BRAC_SetSDKOption(" + BRAC_SO_VIDEOBKIMAGE + ",'/static/images/bg-video.jpg')=" + errorcode);

                        if (errorcode == GV_ERR_SUCCESS) {
                            //已经初始化
                            mInited = true;                        

                            console.log("AnyChat Plugin Version:" + BRAC_GetVersion(0));
                            console.log("AnyChat SDK Version:" + BRAC_GetVersion(1));
                            console.log("Build Time:" + BRAC_GetSDKOptionString(BRAC_SO_CORESDK_BUILDTIME));
                            var errorcode = BRAC_Connect(this.mDefaultServerAddr, this.mDefaultServerPort); //连接服务器
                            console.log("BRAC_Connect(" + NEED_ANYCHAT_APILEVEL + ")=" + errorcode);

                            if (errorcode == GV_ERR_SUCCESS) {
                                self.Login();
                            }
                            else {

                            }
                        }
                        else
                        {
                           
                            InstallPlugin.call(self)
                        }
                    }
                    else
                    {
                        InstallPlugin.call(self)
                    }


                }

            }
            catch (e) {
                console.error(e);

            }
        }

        //登录到服务器
        videoMgr.prototype.Login = function () {

            try {
                /*
                    * AnyChat支持多种用户身份验证方式，包括更安全的签名登录，
                    * 详情请参考：http://bbs.anychat.cn/forum.php?mod=viewthread&tid=2211&highlight=%C7%A9%C3%FB
                    */
                var errorcode = BRAC_Login(this.loginInfo.identifier, "", 0);

                console.log("BRAC_Login(" + NEED_ANYCHAT_APILEVEL + ")=" + errorcode);

                if (errorcode == 0) {

                }
                return errorcode;
            }
            catch (e) {
                console.error(e);

            }
        }

        //加入房间
        videoMgr.prototype.enterRoom = function (roomid) {

            try {
                var self = this;

                if (roomid + "" != "") {

                    self.roomId = roomid;

                    var errorcode = BRAC_EnterRoom(roomid, "", 0); //进入房间

                    console.log("BRAC_EnterRoom(" + roomid + ")=" + errorcode);



                }
            }
            catch (e) {
                console.error(e);
            }

        }

     
        videoMgr.prototype.Quit = function () {

            var self = this;

            if (self.roomId && self.roomId != "") {

                var errorcode = BRAC_LeaveRoom(self.roomId)

                console.log("BRAC_LeaveRoom(" + self.roomId + ")=" + errorcode);
            }
        }

        //显示用户视频
        videoMgr.prototype.displayVideo = function () {
            //显示视频信号
            for (var i = 0; i < this.Users.length; i++) {
                requestVideo("video-user-" + this.Users[i].dwUserId, this.Users[i].dwUserId);
            }
        }


        /*
          * 显示视频信号
          * params:
          * viewDiv -dom元素id
          * memberId -成员编号，如果是本人为空
        */
        function requestVideo(viewDiv, dwUserId) {
            setTimeout(function () {

                // 设置远程视频显示位置
                BRAC_SetVideoPos(dwUserId, GetID(viewDiv), dwUserId);

                BRAC_UserCameraControl(dwUserId, 1); 		// 请求对方视频
                BRAC_UserSpeakControl(dwUserId, 1); 		// 请求对方语音



                //获取dom元素宽度
                var width = getViewDivWidth(viewDiv);
                //为了放置视频变形，根据宽高比计算视频高度
                var height = Math.round(width * 0.75);

                //修正dom元素的高度，根据视频的高度修正
                $("#" + viewDiv).css("height", height);

                console.log("显示视频信号，dwUserId=" + dwUserId + " to " + viewDiv);

            }, 1000)
        }

        function GetID(id) {
            if (document.getElementById) {
                return document.getElementById(id);
            } else if (window[id]) {
                return window[id];
            }
            return null;
        }

        function getViewDivWidth(viewDiv) {
            return $("#" + viewDiv).outerWidth()

        }

        //不支持Edge浏览器
        function NotSupportEdgeBrowser()
        {
            var self = this;

            var message = '语音/视频功能，不支持Edge浏览器'

            var dialog = layer.confirm(message, {
                title:"不支持Edge浏览器",
                btn: ['确定'] //按钮

            }, function ()
            {
                layer.close(dialog)

            }, function () {

            });
        }

        function InstallPlugin()
        {
            var self = this;

            var message = '使用语音/视频功能，你需要安装浏览器插件.<ul><li>如果您没有安装，请<a style="font-weight:bold;" href="http://anychat.oss-cn-hangzhou.aliyuncs.com/AnyChatWebSetup.exe">安装</a> 它。</li><li>如果您已经安装了它，仍然不能正常使用请检查浏览器设置并重启浏览器。</li></ul>'

            var dialog = layer.confirm(message, {
                title: "你需要安装浏览器插件",
                btn: ['不再提醒', '重试'] //按钮

            }, function ()
            {
                layer.close(dialog)

                TryAgain = false;

            }, function ()
            {
                if (TryAgain) {
                    setTimeout(function () { self.Init() }, 1000);
                }



            });
        }

        return videoMgr;

    })();

    return videoMgr;

})