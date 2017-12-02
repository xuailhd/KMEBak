define(["angular", "module-services-eventBus", "module-services-debounce"], function (angular, eventBus, debounceService) {

        var app = angular.module("myApp", ["ui.bootstrap"]);
        var timer_getStatistics = null;
        var unsubscribes = [];

        //线下咨询
        app.directive('chatSessionOnlineClinics', ["$rootScope", "$sce", "$filter", "$translate", "doctorTaskServices", "imServices", function ($rootScope,$sce, $filter, $translate, doctorTaskServices, imServices) {
         
            return {
                restrict: 'EA',
                replace:true,
                scope: {
                    room: '=room',
                    onSelectedCallback: "=onSelectedcallback"//选择的时候回调
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || '/static/modules/Doctor/directives/chat-Session-OnlineClinics.html';
                },
                link: function ($scope, $element, attr)
                {
                    var room = $scope.room;
                    //枚举候诊状态
                    var enumState = {
                        未就诊: 0,
                        候诊中: 1,
                        就诊中: 2,
                        已就诊: 3,
                        呼叫患者: 4,
                        断开连接: 6,
                        重新候诊: 7
                    }
                    
                    // 医生类型
                    $scope.doctorType = global_doctorInfo.DoctorType;

                    //格式化历史消息
                    var wrapperToUIMsg = function (msg) {


                        var html = "";
                        var MsgType = msg.MsgType || msg.type;
                        var MsgContent = msg.MsgContent || msg.content;


                        //文字消息
                        if (MsgType == "TIMTextElem") {
                            var text = MsgContent.Text || MsgContent.text;
                            html = text;
                        }
                            //表情消息
                        else if (MsgType == "TIMFaceElem") {
                            var Data = MsgContent.Data || MsgContent.data;

                            if (room.messageMgr.EmotionPicData[Data]) {
                                html = "<img src='" + room.messageMgr.EmotionPicData[Data] + "'/>";
                            }
                            else {
                                html = Data;
                            }
                        }
                            //图片消息
                        else if (MsgType == "TIMImageElem") {
                            html = "[图片]";
                        }
                            //文件消息
                        else if (MsgType == "TIMFileElem") {
                            html = "[文件]";
                        }
                            //声音消息
                        else if (MsgType == "TIMSoundElem") {
                            html = "[声音]";
                        }
                            //自定义消息
                        else if (MsgType == "TIMCustomElem") {
                            var Ext = MsgContent.Ext || MsgContent.ext;
                            var Desc = MsgContent.Desc || MsgContent.desc;
                            var Data = MsgContent.Data || MsgContent.data;
                            var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

                            if (typeof (Data) == "string") {
                                if (rbrace.test(Data)) {
                                    Data = $.parseJSON(Data);
                                }
                            }

                            //处方订单
                            if (Ext == 'Order.Recipe.Created') {

                                html = "[通知]处方订单已生成";
                            }
                                //系统通知
                            else if (Ext == 'Notice') {
                                html = "[通知]" + Desc;
                            }
                            else if (Ext == "Room.StateChanged") {
                                //图文咨询
                                if (Data.ServiceType == 1) {
                                    if (Data.State == 2) {
                                        html = "[通知]正在咨询，等待医生回复";
                                    }
                                    else if (Data.State == 3) {
                                        html = "[通知]本次咨询已结束";
                                    }
                                    else {
                                        html = "[通知]";
                                    }
                                }
                                else {
                                    if (Data.State == 1) {
                                        html = "[通知]患者正在候诊";
                                    }
                                    else if (Data.State == 2) {
                                        html = "[通知]患者已进入诊室";
                                    }
                                    else if (Data.State == 3) {
                                        html = "[通知]就诊结束，患者已离开诊室";
                                    }
                                    else if (Data.State == 4) {
                                        html = "[通知]正在呼叫患者进入诊室，等待患者确认";
                                    }
                                    else if (Data.State == 5) {
                                        html = "[通知]已请求患者离开诊室，等待患者确认";
                                    }
                                }
                            }
                            else {
                                html = Desc;
                            }
                        }

                        return html;
                    }

                    //更新当前会话未读消息数量
                    var updateCurrentSessionUnreadMsgNum = function (ChannelID, UnreadMsgNum) {

                        $scope.Records && $scope.Records.forEach(function (item, index) {

                            if (item.Room.ChannelID == ChannelID) {

                                item.UnreadMsgNum = UnreadMsgNum;

                                return;
                            }
                        });
                    }

                    //更新当前会话最后最后聊天记录
                    var updateCurrentSessionLastMsg = function (ChannelID, msg) {

                        $scope.Records && $scope.Records.forEach(function (item, index) {

                            if (item.Room.ChannelID == ChannelID) {
                                item.MessageTime = $filter('date')(msg.time * 1000, "MM-dd HH:mm");
                                item.MessageContent = $sce.trustAsHtml(wrapperToUIMsg({ MsgType: msg.elems[0].type, MsgContent: msg.elems[0].content }));
                                return;
                            }
                        });



                    }

                    //更新当前会话是否为选中
                    var updateCurrentSessionActive = function (ChannelID) {

                        $scope.Records && $scope.Records.forEach(function (item, index) {

                            if (item.Room.ChannelID == ChannelID) {
                                item.IsActive = true;
                            }
                            else {
                                item.IsActive = false;
                            }

                            return
                        });

                    }

                    var getStatistics = function () {
                       
                      
                        doctorTaskServices.getStatistics({}, function (resp) {

                       
                            $scope.Statistics = resp.Data;

                        }, function () {


                        })
                    }
                    
                    var mapTaskToSession = function (item) {

                        var resultItem = {
                            PhotoUrl: item.Member.PhotoUrl || '/static/images/unknow.png',
                            NickName: item.Member.MemberName,
                            UnreadMsgNum: 0,
                            MessageContent: "",
                            MessageTime: $filter('date')(item.RegDate, "MM-dd HH:mm"),
                            IsTop: (item.Room.RoomState == 2),
                            IsActive: (item.Room.ServiceID == room.ServiceID),
                            Schedule: item.Schedule,
                            IsDiagnosed: item.IsDiagnosed,
                            RecipeSignedCount: item.RecipeSignedCount,
                            Order: { CostType: item.Order.CostType },
                            Room: {
                                ChargingState: item.Room.ChargingState,
                                RoomState: item.Room.RoomState,
                                Priority: item.Room.Priority,
                                ServiceID: item.Room.ServiceID,
                                ChannelID: item.Room.ChannelID,
                                ServiceType: item.Room.ServiceType,
                                Duration: item.Room.Duration,
                                TotalTime: item.Room.TotalTime
                            }
                        };

                        //历史消息获取
                        if (item.Messages[0] && item.Messages[0].MessageTime) {

                            resultItem.MessageTime = $filter('date')(item.Messages[0].MessageTime, "MM-dd HH:mm");
                        }

                        //历史消息内容
                        if (item.Messages[0] && item.Messages[0].MessageTime) {

                            var html = "";

                            if (item.Messages[0].MessageContent) {
                                var content = item.Messages[0].MessageContent;
                                var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

                                if (typeof (content) == "string") {
                                    if (content != "" && rbrace.test(content)) {
                                        html = wrapperToUIMsg($.parseJSON(content));
                                    }
                                }
                                else {
                                    html = wrapperToUIMsg(content);
                                }
                            }

                            resultItem.MessageContent = $sce.trustAsHtml(html);
                        }

                        if (room.groupMgr.GroupsInfo[item.Room.ChannelID]) {

                            resultItem.UnreadMsgNum = room.groupMgr.GroupsInfo[item.Room.ChannelID].UnreadMsgNum;
                        }

                        return resultItem;
                    }

                    var pushTaskToSessionList = function (item) {
                        $scope.Records.push(mapTaskToSession(item))
                    }

                    //加载咨询我的列表
                    var getSessionList = function (callNextChannelID) {

                        $scope.loading = true;

                        //获取咨询列表
                        doctorTaskServices.getTaskList({
                            CurrentPage: 1,
                            PageSize: 100,
                            ResponseFilters: ["AttachFiles", "RecipeFiles"],
                            RoomState: [0, 1, 2, 3, 4, 6,7],//已经就诊的不显示
                            OPDType: [2, 3],//查询出预约挂号
                            BeginDate: new Date().format("yyyy-MM-dd"),
                            EndDate: new Date().format("yyyy-MM-dd"),
                            IncludeDiagnoseStatus: true,
                            IncludeRecipeSignedCount: true
                        }, function (resp) {                                                      


                            var records = resp.Data.map(mapTaskToSession);
                            
                            $scope.Records = records.filter(function (item) {
                                return item.Room.RoomState != 3;
                            });

                            // 已就诊列表
                            $scope.FinishRecords = records.filter(function (item) {
                                return item.Room.RoomState == 3;
                            });

                            $scope.loading = false;
                            $scope.isWaitingExist = isWaitingExist(resp.Data);

                            //自动呼叫
                            if (callNextChannelID)
                            {
                                if ($scope.Records.length > 0)
                                {
                                    for (var i = 0; i < $scope.Records.length; i++)
                                    {
                                        //就诊中候诊中的都自动呼叫
                                        if ($scope.Records[i].Room.ChannelID != callNextChannelID &&
                                            (
                                                $scope.Records[i].Room.RoomState == 7 ||
                                                $scope.Records[i].Room.RoomState == 2 ||
                                                $scope.Records[i].Room.RoomState == 1)
                                            )
                                        {
                                                $scope.enter($scope.Records[i]);
                                                break;
                                        }
                                    }
                                }
                            }
                        })
                    }

                    $scope.isWaitingExist = false;
                    // 是否存在候诊的患者
                    var isWaitingExist = function (sessions) {
                        var filters = sessions.filter(function (elem) {
                            return elem.Room.RoomState == 1;
                        });

                        return filters.length > 0;
                    }
                  

                    var unsubscribeEvent = function () {
                        //先移除之前的订阅
                        unsubscribes.forEach(function (unsubscribe) {
                            unsubscribe();
                        });
                        unsubscribes = [];
                    }

                    var subscribeEvent = function () {

                        unsubscribes.push(eventBus.subscribe("im-unread-msg", function (eventType, eventArgs) {

                            var sessionType = eventArgs.sessionType;
                            var sessionId = eventArgs.sessionId;
                            var unreadCount = eventArgs.unreadCount;

                            //不是当前会话
                            if (sessionId != room.ChannelID) {
                                if (room.groupMgr.GroupsInfo[sessionId] &&
                                   room.groupMgr.GroupsInfo[sessionId].LastMsg) {
                                    var msg = room.groupMgr.GroupsInfo[sessionId].LastMsg;

                                    updateCurrentSessionLastMsg(sessionId, msg)
                                }
                            }

                            updateCurrentSessionUnreadMsgNum(sessionId, unreadCount);

                            if (!$rootScope.$$phase)
                                $rootScope.$apply();

                        }));

                        unsubscribes.push(eventBus.subscribe("im-new-c2c-msg", function (eventType, eventArgs) {

                            //当前会话消息
                            updateCurrentSessionLastMsg(room.ChannelID, eventArgs.msg)
                        }))

                        unsubscribes.push(eventBus.subscribe("room-changed", function (eventType, eventArgs) {

                            updateCurrentSessionActive(room.ChannelID);

                            if (!$rootScope.$$phase)
                                $rootScope.$apply();

                        }));

                 
                        //限流，重复获取任务列表不能太快。
                        var debounce_getSessionList = debounceService.debounce(function () {
                            getSessionList();
                        }, 1000, false)

                        unsubscribes.push(eventBus.subscribe("room-session-changed", function (eventType, eventArgs) {

                            debounce_getSessionList();
                        }))

                        //重新分诊
                        eventBus.subscribe("room-triage", function (eventType, eventArgs) {

                            var ChannelID = eventArgs.ChannelID;
                            getSessionList(ChannelID)

                        })

                    }

                    var onInit = function ()
                    {
                        subscribeEvent();
                        getStatistics();
                        getSessionList();

                        if (timer_getStatistics) {
                            clearInterval(timer_getStatistics);
                        }

                        timer_getStatistics = setInterval(function () { getStatistics(); }, 5000);

                    }

                    $scope.$on("$destroy", function () {
                        
                        unsubscribeEvent();

                        if (timer_getStatistics) {
                            clearInterval(timer_getStatistics);
                        }
                    });
                  
                    $scope.Statistics = {};
    
                    $scope.enter = function (item, operType, $event) {

                        if (item.Room.ChannelID == room.ChannelID) {
                            return;
                        }
                        else {

                            imServices.getChannel({ ChannelID: item.Room.ChannelID }, function (channelResp) {

                                //转换成字符类型非常重要，IM接口对类型有要求（********）
                                room.ChannelID = item.Room.ChannelID + "" + "";
                                room.ServiceType = item.Room.ServiceType;
                                room.ServiceID = item.Room.ServiceID;
                                room.State = channelResp.Data.RoomState;

                                //回调给父级
                                $scope.onSelectedCallback({
                                    Room: {
                                        ChannelID: item.Room.ChannelID,
                                        ServiceType: item.Room.ServiceType,
                                        ServiceID: item.Room.ServiceID,
                                        ChargingState: channelResp.Data.ChargingState,
                                        Duration: channelResp.Data.Duration,
                                        TotalTime: channelResp.Data.TotalTime
                                    },
                                    OperType: operType
                                })


                                room.videoMgr.WebSdkInteroperability(channelResp.Data.DisableWebSdkInteroperability);

                                setTimeout(function ()
                                {
                                    //切换会话
                                    room.toggleSession(room.ChannelID + "", null, {}, function () {});

                                }, 1000)


                            }, function () {

                                layer.msg("操作失败")

                            });
                        }
                        if ($event)
                            $event.stopPropagation();
                    }

                    //$scope.pass = function (item, $event) {
                    //    $event.stopPropagation();
                    //}

                    $scope.disableTakeButton = false;

                    $scope.take = function () {

                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2
                        $scope.disableTakeButton = true;
                        doctorTaskServices.take({ ServiceType: 3 }, function (takeResp) {

                            $scope.disableTakeButton = false;
                            layer.close(loading);
                            
                            if (takeResp.Data) {

                                layer.msg("接诊成功");
                                
                                $scope.Statistics.VideoConsultTotalCount--;
                                $scope.Statistics.VideoConsultAlreadyCount++;
                                $scope.Statistics.VideoConsultTotalCount = $scope.Statistics.VideoConsultTotalCount < 0 ? 0 : $scope.Statistics.VideoConsultTotalCount;

                                pushTaskToSessionList(takeResp.Data);

                                $scope.enter({
                                    Room: {
                                        ServiceID: takeResp.Data.Room.ServiceID,
                                        ChannelID: takeResp.Data.Room.ChannelID,
                                        ServiceType: takeResp.Data.Room.ServiceType,
                                        Duration: takeResp.Data.Room.Duration,
                                        RoomState: takeResp.Data.Room.RoomState,
                                        TotalTime: takeResp.Data.Room.TotalTime
                                    }
                                });
                            }
                            else
                            {
                                layer.msg("没有需要接诊的患者")
                            }

                        }, function () {
                            $scope.disableTakeButton = false;
                            layer.close(loading);
                            layer.msg("操作失败");

                        })
                    }

                    /// 叫号操作
                    $scope.call = function () {

                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2
                        doctorTaskServices.promise.call().then(function (resp) {
                            layer.close(loading);

                            if (resp.Status != 0) {
                                layer.msg("操作失败");
                                return;
                            }

                            if (!resp.Data) {
                                layer.msg("没有等待就诊的患者");
                                return;
                            }

                            $scope.enter({
                                Room: {
                                    ServiceID: resp.Data.Room.ServiceID,
                                    ChannelID: resp.Data.Room.ChannelID,
                                    ServiceType: resp.Data.Room.ServiceType,
                                    Duration: resp.Data.Room.Duration,
                                    RoomState: resp.Data.Room.RoomState,
                                    TotalTime: resp.Data.Room.TotalTime
                                }
                            });

                        })["catch"](function (resp) {
                            layer.close(loading);
                            layer.msg("操作失败");
                        });

                    }

                    onInit();
                }
            };
        }]);

    });