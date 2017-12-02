define(["angular", "module-services-eventBus", "module-services-apiUtil"], function (angular, eventBus, apiUtil) {

    
        var app = angular.module("myApp", ["ui.bootstrap"]);
        var unsubscribes = [];
        var voices = {};

        app.directive('chatCallCtrl', ["$rootScope", '$state', "imServices", "$translate", "userOPDRegistersServices", "doctorTaskServices", function ($rootScope, $state, imServices, $translate, userOPDRegistersServices, doctorTaskServices) {

            return {
                restrict: 'EA',           
                transclude: true,
                scope: {
                    room: '=room'
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || '/static/modules/Common/directives/chat-detail-CallCtrl.html';
                },
                link: function ($scope, $element, attr)
                {
                    var room = $scope.room;
                 

                    $scope.Calling = false;
                    $scope.connectioned = false;
                    $scope.Disconnected = false;
                    $scope.Waiting = false;
                    $scope.Closed = false;

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
                
                    $scope.Volume = 1;
                    $scope.cameraOn = true;
                    $scope.audioOn = true;

                    $scope.toggleVolume = function (){
                        $scope.Volume = $scope.Volume<=0 ? 1 : 0;

                        //先停止其他的声音
                        for (var index in voices) {
                            
                            voices[index].setVolume($scope.Volume)
                        }
                    }

                    $scope.toggleCamera = function () {
                        $scope.cameraOn = !$scope.cameraOn;
                        room.videoMgr.enableVideo($scope.cameraOn);
                    }

                    $scope.toggleAudio = function () {
                        $scope.audioOn = !$scope.audioOn;
                        room.videoMgr.enableAudio($scope.audioOn);
                    }

                    var enumVoice = {
                        Calling: 0,
                        Waiting: 1,
                        Huangup:2
                    };
                    var stopVoice = function ()
                    {                        
                        //先停止其他的声音
                        for (var index in voices) {
                            voices[index].pause();
                        }
                    }
                    var playVoice = function (VoiceType) {
                    
                        stopVoice();

                      

                        var voiceUrl = "";

                        if (VoiceType == enumVoice.Calling) {
                            voiceUrl = "/static/musics/calling.wav";
                        }
                        else if (VoiceType == enumVoice.Waiting) {
                            voiceUrl = "/static/musics/waiting.wav";
                        }
                        else if (VoiceType == enumVoice.Huangup) {
                            voiceUrl = "/static/musics/Hangup.wav";
                        }

                        var voice = new Audio(voiceUrl);
                        voice.loop = true;
                        voice.addEventListener('ended', function () { }, false);
                 
                        voice.volume = $scope.Volume;
                        voice.play();
                          

                        voices[VoiceType] = {
                            pause: function () {
                                voice.pause();
                            },
                            setVolume:function(volume)
                            {
                            
                                voice.volume = volume;
                            }
                        };
                        
                    }

                    //#region 操作语音和视频控制方法

                    var toggleUIToNoTreatment = function () {
                        stopVoice();
                        $scope.Closed = false;
                        $scope.Calling = false;
                        $scope.connectioned = false;
                        $scope.Waiting = false;
                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
                    }

                    var toggleUIToCalling = function ()
                    {
                        $scope.Closed = false;
                        $scope.Calling = true;
                        $scope.connectioned = false;
                        $scope.Waiting = false;
                        playVoice(enumVoice.Calling);                        

                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
                    }

                    var toggleUIToWaiting = function () {
                        $scope.Calling = false;
                        $scope.connectioned = false;
                        $scope.Waiting = true;
                        $scope.Disconnected = false;
                        $scope.Closed = false;
                        //候诊铃声
                        playVoice(enumVoice.Waiting);
                   

                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
                    }

                    var toggleUIToConnected = function () {
                        $scope.Calling = false;
                        $scope.connectioned = true;
                        $scope.Waiting = false;
                        $scope.Disconnected = false;
                        $scope.Closed = false;
                        stopVoice();

                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
                    }

                    var toggleUIToClosed = function () {
                        $scope.Calling = false;
                        $scope.connectioned = false;
                        $scope.Waiting = false;
                        $scope.Disconnected = false;
                        $scope.Closed = true;
                        room.videoMgr.Quit();

                        stopVoice();

                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
                    }

                    var toggleUIToDisconnected = function () {
                        $scope.Calling = false;
                        $scope.connectioned = false;
                        $scope.Waiting = false;
                        $scope.Disconnected = true;
                        $scope.Closed = false;
                        room.videoMgr.Quit();
                        stopVoice();

                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
                    }

                    var loadInfo = function () {
                        //获取语句信息
                        userOPDRegistersServices.get({ OPDRegisterID: room.ServiceID }, function (obj) {

                            $scope.OPDInfo = {
                                ChannelID:room.ChannelID,
                                OrderNo:obj.Data.Order?obj.Data.Order.OrderNo:"",
                                DoctorName: obj.Data.Doctor?obj.Data.Doctor.DoctorName:"-",
                                OPDDate: obj.Data.OPDDate,
                                OPDBeginTime: obj.Data.OPDBeginTime,
                                OPDEndTime: obj.Data.OPDEndTime,
                                MemberName: obj.Data.Member?obj.Data.Member.MemberName:"-",
                                ConsultDisease: obj.Data.ConsultDisease,
                                ConsultContent: obj.Data.ConsultContent,
                                OrgName: obj.Data.OrgName
                            };
                        });                        
                    }

                    //呼叫患者
                    $scope.onCall = function () {                    

                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2

                        //更新状态（呼叫中）
                        imServices.setStatus({
                            ChannelID: room.ChannelID,
                            State: enumState.呼叫患者,
                            ExpectedState: room.State,
                            DisableWebSdkInteroperability: room.videoMgr.supportWebRTC() //如果本地支持webRTC则禁用
                        }, function (resp)
                        {
                            layer.close(loading)

                            //操作成功
                            if (resp.Status == 0) {

                                //正在呼叫
                                layer.msg($translate.instant("Room-lblProcessing"))

                                toggleUIToCalling();
                            }
                            //拒绝设置状态，当前状态不是预期状态.
                            //设置状态出错，预期的状态和服务端状态不一致。可能存在并发操作。需要客户端重试
                            else if (resp.Status == 702) {

                                syncRoomState(resp.Data);
                            }
                            //拒绝设置状态，设置状态超时(并发等待锁超时).客户端重试
                            else if (resp.Status == 703) {

                                //重试
                                $scope.onCall();
                            }
                            //拒绝设置状态，当前诊室已失效.用户已经取消订单                                
                            else if (resp.Status == 704)
                            {
                                eventBus.dispatch("room-triage", {});
                                layer.msg("用户已取消订单", { icon: 2, shade: 0.5 })                                
                            }
                            else
                            {
                                layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                            }

                        }, function (err) {
                            layer.close(loading)
                            //呼叫失败
                            layer.msg(err.Msg, { icon: 2, shade: 0.5 })
                        });
                    }

                    //取消呼叫
                    $scope.onCallCancel = function (item) {
                  
                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2

                        //更新状态（候诊中）
                        imServices.setStatus({
                            ChannelID: room.ChannelID,
                            State: enumState.候诊中,
                            ExpectedState: room.State,
                            DisableWebSdkInteroperability: room.videoMgr.supportWebRTC() //如果本地支持webRTC则禁用
                        }, function (resp) {

                            layer.close(loading)

                            //操作成功
                            if (resp.Status == 0) {
                                layer.msg($translate.instant("Room-lblSuccess"))
                                toggleUIToWaiting();
                            }
                            //拒绝设置状态，当前状态不是预期状态.可能存在并发操作。需要客户端重试
                            else if (resp.Status == 702) {

                                syncRoomState(resp.Data);
                            }
                            //拒绝设置状态，设置状态超时(并发等待锁超时).客户端重试
                            else if (resp.Status == 703) {

                                //重试
                                $scope.onCallCancel();
                            }
                                //拒绝设置状态，当前诊室已失效.用户已经取消订单                                
                            else if (resp.Status == 704) {
                                eventBus.dispatch("room-triage", {});
                                layer.msg("用户已取消订单", { icon: 2, shade: 0.5 })
                            }
                            else {
                                layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                            }

                        }, function () {

                            layer.close(loading)
                            layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                        });

                    }

                    //挂断（结束就诊）
                    $scope.onHangup = function () {                   

                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2

                        //更新状态（已就诊）
                        imServices.setStatus({
                            ChannelID: room.ChannelID,
                            State: enumState.已就诊,
                            ExpectedState: room.State,
                            DisableWebSdkInteroperability: room.videoMgr.supportWebRTC() //如果本地支持webRTC则禁用
                        }, function (resp) {

                            layer.close(loading)

                            //操作成功
                            if (resp.Status == 0) {
                             
                                toggleUIToClosed();
                                eventBus.dispatch("room-triage", {});
                            }
                            //拒绝设置状态，当前状态不是预期状态.可能存在并发操作。需要客户端重试
                            else if (resp.Status == 702)
                            {
                                room.State = resp.Data;
                                $scope.onHangup();
                            }
                            //拒绝设置状态，设置状态超时(并发等待锁超时).客户端重试
                            else if (resp.Status == 703) {

                                //重试
                                $scope.onHangup();
                            }
                                //拒绝设置状态，当前诊室已失效.用户已经取消订单                                
                            else if (resp.Status == 704) {
                                eventBus.dispatch("room-triage", {});
                                layer.msg("用户已取消订单", { icon: 2, shade: 0.5 })
                            }
                            else {
                                layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                            }

                        }, function () {

                            layer.close(loading)
                            layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })

                        })

                    }

                    //分诊
                    $scope.onTriage = function ()
                    {
                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2

                        //更新状态（已就诊）
                        doctorTaskServices.triage({
                            ChannelID: room.ChannelID
                        }, function (resp) {

                            eventBus.dispatch("room-triage", { ChannelID: room.ChannelID });

                            layer.close(loading)

                            room.videoMgr.Quit();
                            stopVoice();
                        }, function () {
                            layer.close(loading)
                            layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                        })
                    }
                    //#endregion                  

                    var unsubscribeEvent = function () {
                        //先移除之前的订阅
                        unsubscribes.forEach(function (unsubscribe) {                      
                            unsubscribe();
                        });
                        unsubscribes = [];
                    }
                    //订阅时间
                    var subscribeEvent = function ()
                    {
                        if (unsubscribes.length > 0)
                            return;


                        //频道切换之后
                        unsubscribes.push(eventBus.subscribe("room-changed", function (eventType, args) {

                            //如果当前正在候诊中则自动呼叫患者
                            if (autoCalling && (room.State == 1 || room.State == 7)) {
                                autoCalling = false;
                                $scope.onCall();
                            }

                        }));


                        //更新候诊队列
                        unsubscribes.push(eventBus.subscribe("room-state-changed", function (eventName, eventArgs) {
                          
                            var ChannelID = eventArgs.ChannelID;
                            var State = eventArgs.State;
                            var DisableWebSdkInteroperability = eventArgs.DisableWebSdkInteroperability || false;

                            //更新SDK互操作性
                            room.videoMgr.WebSdkInteroperability(DisableWebSdkInteroperability)

                            syncRoomState(State);
                        }));
                    }

                    var syncRoomState = function (State)
                    {
                        room.State = State;

                        if (State == 0)
                        {
                            toggleUIToNoTreatment();

                            //5秒钟刷新一次状态
                            setTimeout(function () {

                                imServices.getChannel({ ChannelID: room.ChannelID }, function (channelResp) {

                                    syncRoomState(channelResp.Data.RoomState);
                                });

                            }, 5000);

                        }
                        //候诊中
                        else if (State == 1 || State == 7) {
                            toggleUIToWaiting();
                        }
                            //就诊中
                        else if (State == 2) {
                            toggleUIToConnected();
                        }
                        else if (State == 3) {

                            toggleUIToClosed();
                        }
                            //呼叫
                        else if (State == 4) {

                            toggleUIToCalling();
                        }
                            //断开连接
                        else if (room.State == 6) {

                            toggleUIToDisconnected();
                        }
                    }                  

                    var autoCalling = true;

                    //初始化时
                    var onInit = function ()
                    {
                        unsubscribeEvent();
                        subscribeEvent();
                        stopVoice();
                        loadInfo();

                        syncRoomState(room.State);
                    }

                    //释放资源
                    var onDestory = function () {
                        unsubscribeEvent();
                        stopVoice();
                    }

                    //指令被销毁时执行
                    $scope.$on("$destroy", function () {

                        onDestory();

                    });

                    onInit();

                }
            };
        }]);

    });