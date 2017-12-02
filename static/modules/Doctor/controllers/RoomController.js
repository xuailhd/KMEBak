"use strict";
/*
 * 医生诊室
 * 作者：郭明
 * 日期：2016年7月6日
 */
define(["module-services-chatroom",
        "module-services-api",
        "module-services-eventBus",
        "module-services-heartbeat",
        "module-directive-bundling-doctor-all",
        "module-directive-bundling-doctor-im",
        "css!styles/layout.room.min.css"], function (im, apiUtil, eventBus, heartbeat) {

            var app = angular.module("myApp", [
            "pascalprecht.translate",
            'ui.router',
            "ui.bootstrap",
            "ngAnimate"]);

            /*
            * 主治医生候诊模块
            * 说明：候诊队列,处理队列显示（呼叫患者，中断通话等操作）
            * 作者：郭明
            * 日期：2016年6月3日
            */
            app.controller('ConsultingRoomWaitingController', [
            '$scope',
            "$rootScope",
            "$http",
            "$state",
            '$translate',
            '$interval',
            '$timeout',
            "userMembersServices",
            "userOPDRegistersServices",
            "doctorPatientsServices",
            'webapiServices',
            "doctorsServices",
            "doctorConfigsServices",
            "doctorDiagnosisServices",
            "imServices",
            function ($scope,
                $rootScope,
                $http,
                $state,
                $translate,
                $interval,
                $timeout,
                userMembersServices,
                userOPDRegistersServices,
                doctorPatientsServices,
                webapiServices,
                doctorsServices,
                doctorConfigsServices,
                doctorDiagnosisServices,
                imServices) {

                //#region变量定义
                //创建房间，并设置房间初始化后的回调函数
                var room = new im.imMgr();
                $scope.room = room;
                $scope.lang = $translate.use();  
                // 是否已经打开声音
                $scope.isSoundOpen = true;
                // 医生配置信息
                //$scope.isDiagnoseOff = false;
                $scope.diagnoseOff = { isDiagnoseOff: false };
                // 医生诊断小结
                $scope.diagnoseSummary = null;
                // 
                $scope.delayEnable = true;
                // 会话列表是否展开
                $scope.isSessionExpand = false;

                //#endregion/                
            
                //会话列表被改变时(回调方法)
                $scope.LoadSessionListCallback = function () {
                    
                    eventBus.dispatch("room-session-changed", {});
                    
                    $scope.LoadSessionListLastTime = new Date();//加载会话列表的最后时间
                }
                //#endregion

                //#region 定义钩子方法

                //会话详情(钩子方法)

                $scope.ChatDetailLoaded = function () { console.error("Not Implement ConsultingRoomController ChatDetailLoaded") }
                //#endregion

                // 点击IM链接回调
                $scope.onUrlClick = function (message) {
                    if (message.RefrenceType == "Diagnose.Summary.Submit") {
                        $scope.diagnoseSummary = message.RefrenceItem;
                        $("#modal-diagnose-summary").modal("show");
                    }
                    if (message.RefrenceType == "Order.Buy.Recipe") {
                        previewRecipeFile(message.RefrenceItem[0].OPDRegisterID);
                    }
                    if (message.RefrenceType == "Recipe.Preview") {
                        previewRecipeFile(message.RefrenceItem[0].RecipeNo);
                    }
                }

                //#region 界面视图控制
                $scope.toggleView = function (viewName) {

                    if (viewName) {
                        _viewName = viewName;
                    }
                    else
                    {
                        if (_viewName == "xs") {
                            _viewName = "md";
                        }
                        else {
                            _viewName = "xs";
                        }
                    }
                }

                var _viewName = "md";
                $scope.viewName = function () {
                    return _viewName;
                }
                //#endregion

                //#region 界面菜单
                $scope.fn = {};

                //设置语言
                $scope.fn.onSetLang = function (lang) {
                    $scope.lang = lang

                    $translate.use(lang)
                }

                // 返回
                $scope.fn.onBack = function () {
                    // 如果不是音视频问诊，则不能进行返回操作
                    if (room.ServiceType != 2 && room.ServiceType != 3) {
                        return;
                    }


                    //询问框
                    var index = layer.confirm($translate.instant('您确认要离开诊室吗？'), {
                        btn: [$translate.instant('是'), $translate.instant('否')] //按钮
                    }, function () {
                        layer.close(index);
                        //退出视频
                        room.videoMgr.Quit();
                        room.session.selToID = "";
                        room.ServiceID = "";
                        room.ServiceType = -1;
                        room.ChannelID = "";

                        $scope.ChatDetailLoaded({
                            Room: {
                                ChannelID: "",
                                ServiceType: -1,
                                ServiceID: ""
                            }
                        });
                        $scope.toggleView("md");                        

                    }, function () {
                        layer.close(index);
                    });
                }

                //退出
                $scope.fn.onLogout = function () {
                    if (window.cefLib) {
                        return window.cefLib.logout();
                    }
                    //退出登录
                    webapiServices.logout({}, function () {
                        apiUtil.setLoginInfo({})
                        apiUtil.setLocalAppToken('');
                        location.href = "/Login";
                    })

                }

                $scope.fn.openSound = function ()
                { $scope.isSoundOpen = !$scope.isSoundOpen; }

                $scope.fn.closeSound = function () {
                    $scope.isSoundOpen = !$scope.isSoundOpen;
                }

                // 休诊/开诊切换
                $scope.fn.toggleDiagnosis = function (value) {
                    var isDiagnoseOff = $scope.diagnoseOff.isDiagnoseOff;

                    if (value != undefined)
                        isDiagnoseOff = value;
                    else
                        isDiagnoseOff = !isDiagnoseOff;

                    doctorConfigsServices.promise.updateDiagnoseState({ IsDiagnoseOff: isDiagnoseOff }).then(function (resp) {
                        if (resp.Status != 0)
                            return;

                        $scope.diagnoseOff.isDiagnoseOff = resp.Data.IsDiagnoseOff;

                        if ($scope.diagnoseOff.isDiagnoseOff) {
                            $scope.delayEnable = true;
                            $scope.diagnoseOff.startTime = resp.Data.StartTime;
                            $scope.diagnoseOff.endTime = resp.Data.EndTime;
                            $("#modal-diagnoseOff").modal("show");
                        }
                        else
                            $("#modal-diagnoseOff").modal("hide");

                    })["catch"](function (resp) {
                        
                    });
                }

                // 延长休诊时间
                $scope.fn.delayDiagnosis = function () {
                    doctorConfigsServices.promise.updateDiagnoseOffDuration().then(function (resp) {
                        if (resp.Status != 0)
                            return;

                        if (resp.Data.ActionStatus == "DurationLimit") {
                            layer.msg("休诊时间延长不可超过3小时!");
                            $scope.delayEnable = false;
                            return;
                        }

                        if (resp.Data.ActionStatus == "DiagnoseOn") {
                            layer.msg("开诊状态不可延长休诊时间!");
                            return;
                        }

                        layer.msg("延长休诊时间成功!");
                        $scope.diagnoseOff.startTime = resp.Data.StartTime;
                        $scope.diagnoseOff.endTime = resp.Data.EndTime;


                    })["catch"](function (resp) {

                    });

                }

                // 展开/收起会话列表
                $scope.fn.sessionExpand = function (expand) {
                    if (expand)
                        $scope.isSessionExpand = expand;
                    else
                        $scope.isSessionExpand = !$scope.isSessionExpand;

                    if ($scope.isSessionExpand) {
                        $scope.toggleView("md");
                    }                        
                    else {
                        $scope.toggleView("none");
                    }                        
                }

                //#endregion

                var previewRecipeFile = function (opdRegisterID) {
                    layer.open({
                        type: 2,
                        area: ['700px', '530px'],
                        fix: false, //不固定
                        maxmin: true,
                        title: "预览",
                        content: "/Jump?url=" + global_ApiConfig.CommonApiUrl + "/File/Download/" + opdRegisterID + "/5"
                    });
                }

                var subscrbeEvent = function () {

                    window.onbeforeunload = function () {
                        var warning = "确认退出?";
                        return warning;
                    };

                    //复制了病历
                    $scope.$on('CopiedPatientVisitRecord', function (event, data) {
                        if (event.targetScope != $scope)
                            $scope.$broadcast("CopiedPatientVisitRecord", data);

                    });

                    //已连接
                    eventBus.subscribe("im-connection-on", function (eventType, eventArgs) {
                        $("#modal-internetConnectionOff").modal("hide");
                    });

                    //重新建立了连接
                    eventBus.subscribe("im-connection-reconnect", function (eventType, eventArgs) {
                        $("#modal-internetConnectionOff").modal("hide");
                    });

                    //连接已关闭
                    eventBus.subscribe("im-connection-off", function (eventType, eventArgs) {

                        $("#modal-internetConnectionOff").modal("show");

                    });

                    eventBus.subscribe("im-unread-msg", function (eventType, eventArgs) {

                        
                        var sessionType = eventArgs.sessionType;
                        var sessionId = eventArgs.sessionId;
                        var unreadCount = eventArgs.unreadCount;

                        console.debug("onUnreadMsgCountChanged(" + sessionType + "," + sessionId + "," + unreadCount + ")");


                        //#region 通过最后一条未读消息,如果是房间状态被改变的消息触发事件
                        if (room.groupMgr.GroupsInfo[sessionId] && room.groupMgr.GroupsInfo[sessionId].LastMsg) {
                            var msg = room.groupMgr.GroupsInfo[sessionId].LastMsg;

                            if (msg && msg.elems[0].type == 'TIMCustomElem') {
                                if (msg.elems[0].content &&
                                  msg.elems[0].content.data &&
                                  msg.elems[0].content.data != "") {

                                    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
                                    var data = msg.elems[0].content.data;
                                    var ext = msg.elems[0].content.ext;

                                    if (ext == "Room.StateChanged") {
                                        if (typeof (data) == "string") {
                                            if (rbrace.test(data)) {
                                                //自定义消息中的内容是JSON
                                                data = $.parseJSON(data);
                                            }
                                        }

                                        if (data.State != 3) {

                                            if ($scope.LoadSessionListCallback)
                                                $scope.LoadSessionListCallback(data);
                                        }
                                    }

                                }
                            }
                        }
                        //#endregion

                        if (unreadCount > 0) {

                        }
                        else {

                        }

                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
                    })

                    eventBus.subscribe("im-new-c2c-extmsg", function (eventType, eventArgs) {

                       
                        var data = eventArgs.data;
                        var desc = eventArgs.desc;
                        var ext = eventArgs.ext;                        
                        var isNewMsg = eventArgs.newMsg;

                       

                            //接收了，进入诊室的邀请
                            if (ext == "Room.StateChanged") {

                                if (isNewMsg)
                                {
                                    room.State = data.State;
                                    eventBus.dispatch("room-state-changed", {
                                        ChannelID: room.ChannelID,
                                        State: room.State,
                                        DisableWebSdkInteroperability: data.DisableWebSdkInteroperability || false
                                    });                                
                                    $scope.LoadSessionListCallback();
                                }
                            }
                                //服务时长变更
                            else if (ext == "Room.DurationChanged") {

                                if (isNewMsg) {
                                    eventBus.dispatch("room-duration-changed", {
                                        ChannelID: data.ChannelID,
                                        ChargingState: data.ChargingState,
                                        Duration: data.Duration - data.TotalTime,
                                        renewChannelKey:true
                                    });
                                }
                            }
                                //挂断
                            else if (ext == "Room.Hangup") {
                                if (isNewMsg) {
                                    eventBus.dispatch("room-hangup", { ChannelID: data.ChannelID });
                                }
                            }                       
                   
                       
                    });

                    eventBus.subscribe("im-new-c2c-msg", function (eventType, eventArgs) {


                    })

                    eventBus.subscribe("im-kicked", function (eventType, eventArgs) {

                        var self = this;

                        //询问框
                        var dialog=layer.confirm('您已在另一处登录，是否重新登录？', {
                            closeBtn:false,
                            btn: ['是', '否'] //按钮
                        }, function () {

                            window.onbeforeunload = null;
                            window.location.reload(true);                            

                        }, function () {

                            window.onbeforeunload = null;
                            window.close();
                        });
                    });

                    eventBus.subscribe("im-new-group-msg", function (eventType, eventArgs) {

                        var msg = eventArgs.msg;

                        /*{
                            "ReportType": type,
                            "ReportTypeCh": typeCh,
                            "GroupId": group_id,
                            "GroupName": group_name,
                            "MsgContent": msg_content,
                            "MsgTime": webim.Tool.formatTimeStamp(msg_time)
                        }*/
                        //标识为系统消息
                        msg.sysNotice = true;

                        /*GroupId:"1353"
                         GroupName:"邱浩强(图文咨询)"
                         MsgContent:"你被管理员km2016邀请加入该群"
                         MsgTime:"2016-08-31 16:12:18"
                         ReportType:7
                         ReportTypeCh:"[被邀请加群]"
                         sysNotice:true*/
                        if (msg.ReportType == 7 || msg.ReportType == 255) {
                            $scope.LoadSessionListCallback();
                        }

                    })

                    //切换了频道
                    eventBus.subscribe("room-changed", function (eventType, eventArgs) {
                        if (room.ServiceType == 2 || room.ServiceType == 3) {
                            $scope.toggleView("none");
                            $scope.isSessionExpand = false;
                        }
                        else {
                            $scope.isSessionExpand = true;
                        }                           
                        
                    })

                    //重新分诊
                    eventBus.subscribe("room-triage", function (eventType, eventArgs) {
                       
                        room.Quit();

                        $scope.toggleView("md");

                        $scope.ChatDetailLoaded({
                            Room: {
                                ChannelID: "",
                                ServiceType: -1,
                                ServiceID: ""
                            }
                        });
                    })
                }

                //发送新系统阿宝
                var sendHeartbeat = function(type)
                {
                    try {

                        //获取登录信息
                        $scope.loginInfo = apiUtil.getLoginInfo();
                        if ($scope.loginInfo != "") {
                            heartbeat.start(type);
                        }
                    }
                    catch (e) {
                        return;
                    }

                }

                //初始化IM
                var setupIM = function ()
                {

                    //获取医生登录信息
                    var loginInfo = apiUtil.getLoginInfo();

                    var fn = function () {

                     
                        //获取医生信息
                        doctorsServices.get({ UserID: loginInfo.UserID }, function (resp) {

                            $scope.doctorInfo = resp.Data;

                            // 获取休诊/开诊配置
                            if (resp.Data.DiagnoseState) {
                                $scope.diagnoseOff.isDiagnoseOff = resp.Data.DiagnoseState.IsDiagnoseOff;
                                $scope.diagnoseOff.startTime = resp.Data.DiagnoseState.StartTime;
                                $scope.diagnoseOff.endTime = resp.Data.DiagnoseState.EndTime;
                            }
                            else
                                $scope.diagnoseOff.isDiagnoseOff = false;

                            if ($scope.diagnoseOff.isDiagnoseOff)
                                $("#modal-diagnoseOff").modal("show");                            

                            $scope.LoadSessionListCallback();

                            //分诊医生（进入时）
                            if ($state.params.ChannelID && $state.params.ChannelID != "") {

                                imServices.getChannel({ ChannelID: $state.params.ChannelID }, function (resp) {

                                    
                                    if (resp.Data && resp.Data.ChannelID) {


                                        //转换成字符类型非常重要，IM接口对类型有要求（********）
                                        room.ChannelID =  resp.Data.ChannelID + "" + "";
                                        room.ServiceType =  resp.Data.ServiceType;
                                        room.ServiceID =  resp.Data.ServiceID;
                                        room.State = resp.Data.RoomState;
                                   
                                        $scope.ChatDetailLoaded({                         
                                            Room: {
                                                ChannelID: room.ChannelID,
                                                ServiceType: room.ServiceType,
                                                ServiceID: room.ServiceID,
                                                Duration: resp.Data.Duration,
                                                TotalTime:resp.Data.TotalTime
                                            }
                                        });

                                        room.videoMgr.WebSdkInteroperability(resp.Data.DisableWebSdkInteroperability);

                                        setTimeout(function () {
                                            //切换会话
                                            room.toggleSession(room.ChannelID + "", null, {}, function () { });
                                        }, 1000);
                                    };
                                });
                            }

                        })
                    }

                    //第一次进入房间，需要初始化房间
                    if (!room.loginInfo.identifier || typeof (room.loginInfo.identifier) == "undefined") {
                        imServices.getIMConfig({}, function (response) {

                            var config = response.Data;

                            //创建聊天室实例                
                            room.setup({
                                sdkAppID: config.sdkAppID,
                                accountType: config.accountType,
                                identifier: config.identifier,
                                identifierNick: config.identifier,
                                userSig: config.userSig,
                            }, function () {
                                //房间初始化后，执行以下代码
                                fn();

                            });

                        }, function () {

                            window.location.href = window.location.href;

                        });
                    }
                    else {
                        fn();
                    }
                }
               
                var onInit=function()
                {
                    subscrbeEvent();
                    setupIM();
                    sendHeartbeat("doctor.room");
                };

                onInit();

            }]);

        });