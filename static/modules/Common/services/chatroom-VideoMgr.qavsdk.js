//视频通话,依赖loginInfo
var videoMgr = (function () {

    function videoMgr(loginInfo) {
        var self = this;

        //当前用户所处的状态
        this.currentStatus = null;

        this.loginInfo = loginInfo;

        //当前进入房间ID
        this.curentRoomId = null;

        //已显示视频的用户
        this.OpenedViewUserIds = [];

        //当前成员
        this.Users = [];

        //是否切换摄像头标记
        this.changeCameraFlag = false;
        //当前使用的摄像头索引
        this.curCameraIndex = 0;

        //是否切换摄像头标记
        this.changeMicFlag = false;
        //当前使用的麦克风索引
        this.curMicIndex = 0;

        //是否切换摄像头标记
        this.changePlayerFlag = false;
        //当前使用的扬声器索引
        this.curPlayerIndex = 0;

        //是否点击【观看成员视频画面】按钮
        this.checkViewFlag = false;
        //要观看画面的成员ID
        this.checkViewMemberId = null;
        //用于显示成员视频画面的div标签ID
        this.checkViewDiv = null;
        //用于显示成员视频画面X坐标
        this.checkViewPosX = 0;
        //用于显示成员视频画面Y坐标
        this.checkViewPosY = 0;
        //用于显示成员视频画面宽度
        this.checkViewWidth = 0;
        //用于显示成员视频画面高度
        this.checkViewHeight = 0;
        //是否全屏显示标记
        this.isFullScreen = false;
        //全屏显示时用户ID
        this.fullScreenMemberId = null;
        //全屏显示时div标签ID
        this.fullScreenMemberViewDiv = null;
        //截图保存路径
        this.snapShotFilePath = "d:\\qavsdkPic";
        //当前录制视频类型
        this.curRecordVideoType = null;
        //事件通知条数计数
        this.noticeCount = 0;





        //视频SDK回调，需要注册全局
        window.qavsdk_eventcallback = function (evt, result, oper, vcnt, vusers, info, picBase64Str) {

            console.info("evt = " + evt + " result = " + result + " oper = " + oper + " vcnt = " + vcnt);

            if (result == 0) {
                if (vcnt > 0) {
                    //房间成员列表
                    var userIds = vusers.toArray();;
                    var newUserIds = [];

                    for (var i = 0; i < userIds.length; i++) {
                        if (userIds[i] != null && userIds[i] != "") {
                            newUserIds.push(userIds[i]);
                        }
                    }

                    self.Users = newUserIds;

                }


                switch (evt) {
                    //登录成功
                    case EventType.LOGIN:
                        {
                            //设置当前状态处于登录成功态
                            self.currentStatus = StatusType.login;

                            console.info('[登录][成功]用户ID:' + self.loginInfo.identifier);


                            //只有SDK登录成功，才可以启动SDK
                            self.startContext();

                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                        //启动SDK成功
                    case EventType.START_CONTEXT:
                        {
                            //设置当前状态处于启动SDK成功态
                            self.currentStatus = StatusType.context;

                            console.info('[启动SDK][成功]');

                            self.onStatusChanged(evt, EventType)

                            break;
                        }
                        //停止SDK成功
                    case EventType.STOP_CONTEXT:
                        {
                            console.info('[停止SDK][成功]');

                            //设置当前状态处于登录成功态
                            self.currentStatus = StatusType.login;

                            self.resetView();

                            self.onStatusChanged(evt, EventType)

                            break;
                        }
                        //进入房间成功
                    case EventType.ENTER_ROOM:
                        {
                            console.info('[加入房间][成功]:' + "操作者:" + oper + ",当前成员数:" + vcnt);

                            //设置当前状态处于加入房间成功态
                            self.currentStatus = StatusType.enter_room;

                            //已进入房间，设置当前房间编号
                            self.curentRoomId = self.inputRoomId;

                            ////默认选中第一个摄像头
                            self.setSelectedCameraIndex(0);

                            ////打开摄像头
                            self.openCamera();

                            ////默认选中第一个麦克风
                            self.setSelectedMicIndex(0);

                            ////打开麦克风
                            self.openMic();

                            ////默认选中第一个扬声器
                            self.setSelectedPlayerIndex(0);

                            ////打开扬声器
                            self.openPlayer();

                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                        //退出房间成功
                    case EventType.EXIT_ROOM:
                        {
                            console.info('[退出房间][成功]:' + "操作者:" + oper + ",当前成员数:" + vcnt);

                            //设置当前状态处于启动SDK成功态
                            self.currentStatus = StatusType.context;
                            self.curentRoomId = null;
                            self.inputRoomId = null;

                            //清空成员视频画面
                            self.resetView();
                            self.stopContext();
                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                        //房间成员变化通知
                    case EventType.ROOM_MEMBERS_CHANGE:
                        {
                            console.info('[房间成员变化]:' + "操作者:" + oper + ",当前成员数:" + vcnt);

                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                        //查看其他成员列表画面成功
                    case EventType.REQUEST_VIEW_LIST:
                        {
                            console.info('[查看其他成员列表画面][成功]:' + "操作者:" + oper);

                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                        //取消所有成员画面成功
                    case EventType.CANCEL_ALL_VIEW:
                        {
                            console.info('[取消所有成员画面][成功]:' + "操作者:" + oper);

                            self.onStatusChanged(evt, EventType)

                            break;
                        }
                        //打开/关闭麦克风结果通知 oper 1-打开，2-关闭
                    case EventType.MIC_STATUS_CHANGE:
                        {
                            if (oper == 1) {
                                msg = '[打开麦克风]';

                            } else if (oper == 2) {
                                msg = '[关闭麦克风]';

                                if (self.changeMicFlag) {
                                    self.changeMicFlag = false;

                                    self.setSelectedMicIndex(self.curMicIndex);

                                    self.openMic();
                                }
                            }

                            console.info(msg + '[成功]');

                            self.onStatusChanged(evt, EventType)


                            break;
                        }
                        //打开/关闭扬声器结果通知 oper 1-打开，2-关闭
                    case EventType.PLAYER_STATUS_CHANGE:
                        {
                            var msg = "";

                            if (oper == 1) {
                                msg = '[打开扬声器]';
                            } else if (oper == 2) {
                                msg = '[关闭扬声器]';
                                if (self.changePlayerFlag) {
                                    self.changePlayerFlag = false;
                                    self.setSelectedPlayerIndex(self.curPlayerIndex);
                                    self.openPlayer();
                                }
                            }
                            console.info(msg + '[成功]');

                            self.onStatusChanged(evt, EventType)

                            break;
                        }
                        //打开/关闭摄像头通知 oper 1-打开，2-关闭
                    case EventType.CAMERA_STATUS_CHANGE:
                        {
                            if (oper == 1) {
                                msg = '[打开摄像头]';

                            } else if (oper == 2) {
                                msg = '[关闭摄像头]';

                                if (self.changeCameraFlag) {
                                    self.changeCameraFlag = false;
                                    self.setSelectedCameraIndex(self.curCameraIndex);
                                    self.openCamera();
                                }

                            }
                            console.info(msg + '[成功]');
                            self.onStatusChanged(evt, EventType)

                            break;
                        }
                        //截图成功通知
                    case EventType.SCREEN_SHOT:
                        {
                            console.info('[截图][成功]:' + '图片存放路径: ' + info);

                            if (self.picBase64Str) {
                                console.info('[截图][成功]:' + '图片base64编码: ' + self.picBase64Str);
                            }
                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                        //开始录制视频成功通知
                    case EventType.START_RECORD_VIDEO:
                        {
                            console.info('[开始录制视频][成功]:' + '录制视频类型: curRecordVideoType=' + self.curRecordVideoType);
                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                        //停止录制视频成功通知
                    case EventType.STOP_RECORD_VIDEO:
                        {
                            self.curRecordVideoType = null;

                            console.info('[停止录制视频][成功]');
                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                    default:
                        {
                            console.info("[未知通知类型]evt=" + evt);
                            self.onStatusChanged(evt, EventType)
                            break;
                        }
                }
            }
            else {
                
                var errInfo = getEventErrorInfo(evt, oper, info);
                console.error(errInfo);
            }
        }

        //状态变化的事件(需重写)
        this.onStatusChanged = function (evt, params) {

        }

    }

    //sdk回调事件类型
    var EventType = {
        'LOGIN': 3144,//登录SDK成功通知
        'START_CONTEXT': 3146,//启动sdk通知
        'STOP_CONTEXT': 3147,//停止sdk成功通知
        'ENTER_ROOM': 3148,//进入房间成功通知
        'EXIT_ROOM': 3149,//退出房间成功通知
        'ROOM_MEMBERS_CHANGE': 3150,//房间成员变化通知
        'REQUEST_VIEW_LIST': 3153,//请求其他成员列表视频画面成功通知
        'CANCEL_ALL_VIEW': 3154,//取消全部成员视频画面成功通知
        'MIC_STATUS_CHANGE': 3155,//麦克风状态变化通知
        'PLAYER_STATUS_CHANGE': 3156,//扬声器状态变化通知
        'CAMERA_STATUS_CHANGE': 3158,//摄像头状态变化通知
        'SCREEN_SHOT': 3160,//截图成功通知
        'START_RECORD_VIDEO': 3161,//开始录制视频成功通知
        'STOP_RECORD_VIDEO': 3162//结束录制视频成功通知
    };

    //事件名称
    var EventName = {
        '3144': '登录',//登录SDK成功通知
        '3146': '初始化上下文',//启动sdk通知
        '3147': '销毁上下文',//停止sdk成功通知
        '3148': '进入房间',//进入房间成功通知
        '3149': '退出房间',//退出房间成功通知
        '3150': '房间成员变化',//房间成员变化通知
        '3153': '请求其他成员列表视频画面',//请求其他成员列表视频画面成功通知
        '3154': '取消全部成员视频画面',//取消全部成员视频画面成功通知
        '3155': '麦克风状态变化',//麦克风状态变化通知
        '3156': '扬声器状态变化',//扬声器状态变化通知
        '3158': '摄像头状态变化',//摄像头状态变化通知
        '3160': '截图',//截图成功通知
        '3161': '开始录制视频',//开始录制视频成功通知
        '3162': '停止录制视频'//结束录制视频成功通知
    };



    //房间成员音视频状态
    var AVStatus = {
        'NONE': 0,//没有音视频
        'ONLY_VIDEO': 1,//只有视频
        'ONLY_AUDIO': 2,//只有音频
        'BOTH_AUDIO_AND_VIDEO': 3//都有音视频
    };

    //状态类型
    var StatusType = {
        'login': 1,//已登录SDK
        'context': 2,//已启动SDK
        'enter_room': 3//已进入房间
    };


    //视频区域占比
    var ViewRatio = {
        'HEIGHT_WIDTH_RATIO': 0.75//视频画面高度和宽度占比
    };


    //获取操作错误信息
    function getEventErrorInfo(evtType, oper, info) {

        var eventName = EventName[evtType];
        if (!eventName) {
            eventName = '未知事件';
        }
        var errInfo = "[" + eventName + "][回调发生错误], 事件类型evt=" + evtType + ", 错误码oper=" + oper + ", 错误信息info=" + info;
        return errInfo;
    }

    //qavsdk登录
    videoMgr.prototype.Login = function () {
        try {
            console.log('start qavSdk login');
            qavSdk.Login(this.loginInfo.sdkAppID, this.loginInfo.accountType, this.loginInfo.sdkAppID, this.loginInfo.identifier, this.loginInfo.userSig);
            console.log('after qavSdk login');
        }
        catch (e)
        { }
    }

    //启动qavsdk
    videoMgr.prototype.startContext = function () {
        console.log('start StartContext');
        qavSdk.StartContext(this.loginInfo.sdkAppID, this.loginInfo.accountType, this.loginInfo.sdkAppID, this.loginInfo.identifier, this.loginInfo.userSig);
        console.log('after StartContext');
    }

    //停止qavsdk
    videoMgr.prototype.stopContext = function () {
        console.log('start StopContext');
        qavSdk.StopContext();
        console.log('after StopContext');
    }

    //加入房间
    videoMgr.prototype.enterRoom = function (room_id) {
        var self = this;

        //设置当前房间号
        self.inputRoomId = room_id;

        if (self.currentStatus < StatusType.context) {

            layer.msg('加入房间失败：未创建上下文');
            return;
        }

        if (room_id == 0) {
            layer.msg('房间号必须大于0');
            return;
        }

        if (room_id > 4294967295) {
            layer.msg('房间号超出限制(最大为4294967295)');
            return;
        }

        if (self.currentStatus == StatusType.enter_room) {
            if (self.curentRoomId == room_id) {
                layer.msg('您已加入该房间');
                return;
            }
            else {
                layer.msg('您已加入一个房间(房间号：' + self.curentRoomId + '),如果想加入其他房间，请先退出当前房间.');
                return;
            }
        }


        var room_type = 2;//房间类型， 多人音视频为2
        var relation_type = 6;//关系类型，多人房间专用，第三方App固定填6
        var relation_id = room_id;//关系Id，多人房间专用（房间号）
        //var mode = $('input[name="chat_type_radio"]:checked').val();
        var mode = 1;//视频通话模式，视频为1
        var auther = 0;//音视频权限bitmap，多人房间专用,暂时没有用到，默认我填0
        qavSdk.EnterRoom(room_type, relation_type, relation_id, mode, auther);
    }

    //退出房间
    videoMgr.prototype.exitRoom = function () {
        var self = this;

        if (self.currentStatus < StatusType.enter_room) {
            // layer.msg('退出房间失败：未加入房间');
            return;
        }
        //先取消所有成员视频
        this.cancelAllView();

        //再退出房间
        qavSdk.ExitRoom();

        this.stopContext();
    }

    //请求观看多位成员视频画面
    videoMgr.prototype.requestViewList = function (userIds) {

        if (!userIds || userIds.length == 0) {
            return;
        }

        console.info('start RequestViewList,userIds=' + userIds);


        qavSdk.requestViewList(userIds);

        console.info('after RequestViewList');
    }

    //取消所有成员视频画面
    videoMgr.prototype.cancelAllView = function () {
        console.info('start CancelAllView');
        qavSdk.CancelAllView();
        console.info('after CancelAllView');
    }

    //取消成员视频画面
    videoMgr.prototype.cancelView = function (userId) {

        var self = this;

        console.log('start CancelView,userId=' + userId);

        var newUserIds = [];

        //先获取当前已打开视频的成员ID            
        if (self.OpenedViewUserIds.length == 0) {
            self.cancelAllView();
            return;
        }

        //排除取消的用户
        for (var i = 0; i < self.OpenedViewUserIds.length; i++) {
            //剔除要关闭画面的成员ID
            if (list[i] != userId) {
                newUserIds.push(list[i]);
            }
        }

        //剔除要关闭的成员ID后，重新请求剩下的已打开视频的成员画面
        self.requestViewList(newUserIds);
        console.log('after CancelView');
    }
    //清空成员视频画面
    videoMgr.prototype.resetView = function () {
        var self = this;

        for (var i = 0; i < self.OpenedViewUserIds; i++) {
            var userId = self.OpenedViewUserIds[i];

            qavSdk.SetVideoWinPos(userId, 0, 0, 0, 0);

        }

        self.cancelAllView();
        self.OpenedViewUserIds = [];
        self.Users = [];

    }
    //获取选中麦克风ID
    videoMgr.prototype.getSelectedMicId = function () {
        console.info('start GetSelectedMicId');
        var devName = qavSdk.GetSelectedMicId();
        console.info('after GetSelectedMicId=' + devName);
    }
    //设置选中麦克风索引
    videoMgr.prototype.setSelectedMicIndex = function (index) {
        if (index == null || index == "undefined") {
            index = 0;
        }
        console.info('start SetSelectedMicIndex,index=' + index);
        qavSdk.SetSelectedMicIndex(index);
        console.info('after SetSelectedMicIndex');
    }
    //打开麦克风
    videoMgr.prototype.openMic = function () {
        console.info('start OpenMic');
        qavSdk.OpenMic();
        console.info('after OpenMic');
    }
    //关闭麦克风
    videoMgr.prototype.closeMic = function () {
        console.info('start CloseMic');
        qavSdk.CloseMic();
        console.info('after CloseMic');

    }

    //获取选中扬声器ID
    videoMgr.prototype.getSelectedPlayerId = function () {
        console.info('start GetSelectedPlayerId');
        var devName = qavSdk.GetSelectedPlayerId();
        console.info('after GetSelectedPlayerId=' + devName);
    }
    //设置选中扬声器索引
    videoMgr.prototype.setSelectedPlayerIndex = function (index) {
        if (index == null || index == "undefined") {
            index = 0;
        }
        console.info('start SetSelectedPlayerIndex,index=' + index);
        qavSdk.SetSelectedPlayerIndex(index);
        console.info('after SetSelectedPlayerIndex')
    }
    //打开扬声器
    videoMgr.prototype.openPlayer = function () {
        console.info('start OpenPlayer');
        qavSdk.OpenPlayer();
        console.info('after OpenPlayer');
    }
    //关闭扬声器
    videoMgr.prototype.closePlayer = function () {
        console.info('start ClosePlayer');
        qavSdk.ClosePlayer();
        console.info('after ClosePlayer');
    }

    //获取选中摄像头ID
    videoMgr.prototype.GetSelectedCameraId = function () {
        console.info('start GetSelectedCameraId');
        var devName = qavSdk.GetSelectedCameraId();
        console.info('after GetSelectedCameraId=' + devName);
    }
    //设置选中摄像头索引
    videoMgr.prototype.setSelectedCameraIndex = function (index) {
        if (index == null || index == "undefined") {
            index = 0;
        }
        console.info('start SetSelectedCameraIndex,index=' + index);
        qavSdk.SetSelectedCameraIndex(index);
        console.info('after SetSelectedCameraIndex');
    }

    //打开摄像头
    videoMgr.prototype.openCamera = function () {
        console.info('start OpenCamera,cameraIndex=' + self.curCameraIndex);
        qavSdk.OpenCamera();
        console.info('after OpenCamera');
    }
    //关闭摄像头
    videoMgr.prototype.closeCamera = function () {
        console.info('start closeCamera,cameraIndex=' + curCameraIndex);
        qavSdk.CloseCamera();
        console.info('after CloseCamera');
    }


    //获取操作系统版本
    function detectOS() {
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
            var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
            if (isWin10) return "Win10";
        }
        return "other";
    }

    function getViewDivPosX(viewDiv, isRelocation) {
        var posx = $("#" + viewDiv).offset().left;
        if (isRelocation) {
            posx -= getDocLeft();
        }

        return Math.round(posx);
    }

    //根据div获取div的左上角x坐标
    function getViewDivPosY(viewDiv, isRelocation) {
        //视频画面Y坐标修正值
        var FIX_POSITION_Y = 0;

        var posy = $("#" + viewDiv).offset().top + FIX_POSITION_Y;
        if (isRelocation) {
            posy -= getDocTop();
        }
        return Math.round(posy);
    }

    function getViewDivWidth(viewDiv) {
        return $("#" + viewDiv).outerWidth()

    }

    //获取操作系统类型
    var osName = detectOS();

    /*
     * 显示视频信号
     * params:
     * viewDiv -dom元素id
     * memberId -成员编号，如果是本人为空
     */
    videoMgr.prototype.displayVideo = function (viewDiv, memberId) {

        console.log("显示视频信号，memberId=" + memberId + " to " + viewDiv);

        //获取dom元素宽度
        var width = getViewDivWidth(viewDiv);
        //为了放置视频变形，根据宽高比计算视频高度
        var height = Math.round(width * ViewRatio.HEIGHT_WIDTH_RATIO);
        //获取dom元素的坐标
        var posx = getViewDivPosX(viewDiv);
        var posy = getViewDivPosY(viewDiv);

        //修正dom元素的高度，根据视频的高度修正
        $("#" + viewDiv).css("height", height);

        //显示视频
        console.log("posx=" + posx + ", posy=" + posy + ", width=" + width + ", height=" + height + "，memberid=" + memberId);

        if (memberId == self.loginInfo.identifier || memberId == "") {
            //显示本人的
            qavSdk.SetVideoWinPos("", posx, posy, width, height);
        }
        else {
            //查看状态
            var avStatus = qavSdk.GetEndpointAVMode(memberId);

            if (avStatus == "undefined" || avStatus == AVStatus.NONE || avStatus == AVStatus.ONLY_AUDIO) {
                //没有音视频或只有音频
                $("#" + viewDiv).html("无法观看该用户视频画面(1、未插入或已关闭摄像头)，请选择其他用户进行观看");
                return;
            }
            else {
                $("#" + viewDiv).html("");
            }

            qavSdk.SetVideoWinPos(memberId, posx, posy, width, height);
        }
    }


    if (window.qavSdk && qavSdk.Login) {
        videoMgr.support = true;
    }
    else {
        videoMgr.support = false;
    }

    return videoMgr;



})();