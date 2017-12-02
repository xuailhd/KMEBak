define(["angular", "module-services-eventBus", "module-services-debounce", "module-services-api"], function (angular, eventBus, debounceService, apiUtil) {

    
        var app = angular.module("myApp", ["ui.bootstrap"]);
        var timer_getStatistics = null;
        var unsubscribes = [];
        //问诊
        app.directive('chatSessionConsults', [       
      
            "doctorTaskServices",
            "imServices",
            "$rootScope",
            "$sce",
            "$filter", function (doctorTaskServices, imServices,$rootScope, $sce, $filter) {
         
            return {
                restrict: 'EA',
                replace:true,
                scope: {
                    room: '=room',//当前房间
                    filter: "@filter",//过滤条件
                    onSelectedCallback: "=onSelectedcallback"//选择的时候回调
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || '/static/modules/Doctor/directives/chat-Session-Consults.html';
                },
                link: function ($scope, $element, attr)
                {
                    var room = $scope.room;

                  

                    //格式化历史消息
                    var wrapperToUIMsg = function (msg) {

                   
                        var html = "";
                        var MsgType = msg.MsgType || msg.type;
                        var MsgContent = msg.MsgContent || msg.content;
                        
                        
                        //文字消息
                        if (MsgType == "TIMTextElem")
                        {
                            var text = MsgContent.Text || MsgContent.text;
                            html = text;
                        }
                        //表情消息
                        else if (MsgType == "TIMFaceElem")
                        {
                            var Data = MsgContent.Data || MsgContent.data;

                            if (room.messageMgr.EmotionPicData[Data])
                            {
                                html= "<img src='" + room.messageMgr.EmotionPicData[Data] + "'/>";
                            }
                            else
                            {
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
                        else if (MsgType == "TIMCustomElem")
                        {
                                var Ext = MsgContent.Ext || MsgContent.ext;
                                var Desc = MsgContent.Desc || MsgContent.desc;
                                var Data = MsgContent.Data || MsgContent.data;
                                var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
                                       
                                if (typeof(Data) == "string") {
                                    if (rbrace.test(Data)) {
                                        Data = $.parseJSON(Data);
                                    }
                                }

                                //处方订单
                                if (Ext == 'Order.Recipe.Created') {

                                    html = "[通知]处方订单已生成";
                                }
                                    //系统通知
                                else if (Ext == 'Notice')
                                {
                                    html = "[通知]" + Desc;
                                }
                                else if (Ext == "Room.StateChanged")
                                {
                                    //图文咨询
                                    if (Data.ServiceType == 1)
                                    {
                                        if (Data.State == 2) 
                                        {
                                            html = "[通知]正在咨询，等待医生回复";
                                        }
                                        else if (Data.State == 3) 
                                        {
                                            html = "[通知]本次咨询已结束";
                                         }
                                         else
                                        {
                                            html = "[通知]";
                                        }
                                    }
                                    else
                                    {
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
                                else
                                {
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
                    var updateCurrentSessionLastMsg = function (ChannelID, msg, isCurrentSession) {
                        
                        $scope.Records && $scope.Records.forEach(function (item, index) {
                         
                            if (item.Room.ChannelID == ChannelID) {
                                item.MessageTime = $filter('date')(msg.time * 1000, "MM-dd HH:mm");
                                item.MessageContent = $sce.trustAsHtml(wrapperToUIMsg({ MsgType: msg.elems[0].type, MsgContent: msg.elems[0].content }));

                                var loginInfo = apiUtil.getLoginInfo();
                                var identifier = loginInfo ? loginInfo.Identifier : null;

                                if (isCurrentSession)
                                    item.Room.RoomState = room.State;

                                if (item.Room.ServiceType == 1 && msg.isSend && msg.fromAccount == identifier) {                                    
                                    item.Room.RoomState = 2;
                                }
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
                            else
                            {
                                item.IsActive = false;
                            }
                           
                            return
                        });

                    }

                    //加载时执行
                    var onInit = function () {
                        subscribeEvent();
                        getSessionList();
                        getStatistics();

                        if (timer_getStatistics) {
                            clearInterval(timer_getStatistics);
                          
                        }

                        timer_getStatistics = setInterval(function () {
                            getStatistics();

                        }, 5000);
                    }

                    //获取统计信息
                    var getStatistics = function () {


                        doctorTaskServices.getStatistics({}, function (resp) {


                            $scope.Statistics = resp.Data;

                        }, function () {


                        })
                    }

                    var mapTaskToSession = function (item)
                    {
                        var resultItem = {
                            PhotoUrl: item.Member.PhotoUrl || '/static/images/unknow.png',
                            NickName: item.Member.MemberName,
                            UnreadMsgNum: 0,
                            MessageContent: null,
                            MessageTime: null,
                            IsTop: (item.Room.Priority == 5),
                            IsActive: (item.Room.ServiceID == room.ServiceID),
                            Order: { CostType: item.Order.CostType },
                            Room: {
                                ChargingState: item.Room.ChargingState,
                                RoomState: item.Room.RoomState,
                                ServiceID: item.Room.ServiceID,
                                ChannelID: item.Room.ChannelID,
                                ServiceType: item.Room.ServiceType,
                                Duration: item.Room.Duration,
                                TotalTime: item.Room.TotalTime,
                                Priority: item.Room.Priority
                            }
                        };

                        //历史消息获取
                        if (item.Messages[0] && item.Messages[0].MessageTime) {

                            resultItem.MessageTime = $filter('date')(item.Messages[0].MessageTime, "MM-dd HH:mm");
                        }
                            //咨询时间
                        else {
                            resultItem.MessageTime = $filter('date')(item.ConsultTime, "MM-dd HH:mm");
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
                            //预约时的咨询内容
                        else {
                            resultItem.MessageContent = $sce.trustAsHtml(item.ConsultContent);;
                        }

                        if (room.groupMgr.GroupsInfo[item.Room.ChannelID]) {

                            resultItem.UnreadMsgNum = room.groupMgr.GroupsInfo[item.Room.ChannelID].UnreadMsgNum;
                        }

                        return resultItem
                    }

                    var pushTaskToSessionList = function (item) {
                        $scope.Records.push(mapTaskToSession(item))
                    }

                    //加载咨询我的列表
                    var getSessionList = function (ConsultType) {
                        $scope.loading = true;

                        //获取咨询列表
                        doctorTaskServices.getTaskList({
                            PageSize: $scope.pageSize,
                            CurrentPage: $scope.page,
                            Keyword: $scope.Keyword,
                            ResponseFilters: ["AttachFiles", "RecipeFiles"],
                            RoomState: [0, 1, 2, 4, 6, 7],//已经就诊的不显示
                            OPDType: [1]//查询出预约挂号              
                        }, function (resp) {
                            debugger;
                            $scope.Records = resp.Data.map(mapTaskToSession);
                            $scope.loading = false;
                        })
                    }

                    var unsubscribeEvent = function () {
                        //先移除之前的订阅
                        unsubscribes.forEach(function (unsubscribe) {
                            unsubscribe();
                        });
                        unsubscribes = [];
                    }

                    //订阅事件
                    var subscribeEvent = function ()
                    {
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
                            updateCurrentSessionLastMsg(room.ChannelID, eventArgs.msg, true);
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
                      
                    }

                    $scope.Statistics = {};
                    $scope.pageSize = 100;
                    $scope.page = 1;
                    $scope.Keyword = "";
                    $scope.totalCount = 0;
                    $scope.disableTakeButton = false;
 
                    //切换
                    $scope.enter = function (item) {
                     
                        if (item.Room.ChannelID == room.ChannelID) {
                            return;
                        }

                        imServices.getChannel({ ChannelID: item.Room.ChannelID }, function (channelResp) {

                            room.ServiceType = 1;//图文咨询
                            room.ServiceID = item.Room.ServiceID;
                            room.ChannelID = item.Room.ChannelID + "";
                            room.State = channelResp.Data.RoomState;

                            $scope.onSelectedCallback({
                                Room: {
                                    ChargingState: channelResp.Data.ChargingState,
                                    ServiceID: item.Room.ServiceID,
                                    ChannelID: item.Room.ChannelID,
                                    ServiceType: item.Room.ServiceType,
                                    Duration: channelResp.Data.Duration,
                                    TotalTime: channelResp.Data.TotalTime
                                }
                            });

                            room.videoMgr.WebSdkInteroperability(channelResp.Data.DisableWebSdkInteroperability);


                            setTimeout(function () {

                                //切换会话
                                room.toggleSession(room.ChannelID + "", null, {}, function () {



                                }, function () {

                                });

                            }, 1000)
                            

                        }, function () {

                            layer.msg("操作失败")

                        });
                     
                    }
                 
                    $scope.take = function () {

                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2
                        $scope.disableTakeButton = true;
                        doctorTaskServices.take({ ServiceType: 1 }, function (takeResp) {

                            $scope.disableTakeButton = false;
                            layer.close(loading)
                            
                            if (takeResp.Data) {

                                layer.msg("领取成功")
                                $scope.Statistics.TextConsultTotalCount--;
                                $scope.Statistics.TextConsultAlreadyCount++;
                                $scope.Statistics.TextConsultTotalCount = $scope.Statistics.TextConsultTotalCount < 0 ? 0 : $scope.Statistics.TextConsultTotalCount;

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
                                layer.msg("暂无问题可领取")
                             
                            }

                        }, function () {
                          
                            $scope.disableTakeButton = false;
                            layer.close(loading)
                            layer.msg("操作失败")
                        })
                    }

                    $scope.$on("$destroy", function () {
                        
                        unsubscribeEvent();

                        if (timer_getStatistics) {
                            clearInterval(timer_getStatistics);
                        }
                    });

                    onInit();
                }
            };
        }]);

    });