define(["angular","module-services-eventBus"], function (angular,eventBus) {

        var app = angular.module("myApp", ["ui.bootstrap"]);
        var unsubscribes = [];

        //线下咨询
        app.directive('chatSessionOfflineClinics', ["$translate", "triageServices", function ($translate,triageServices) {
         
            return {
                restrict: 'EA',
                replace:true,
                scope: {
                    room: '=room',
                
                    onSelectedCallback: "=onSelectedcallback"//选择的时候回调
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || '/static/modules/Doctor/directives/chat-Session-OfflineClinics.html';
                },
                link: function ($scope, $element, attr)
                {
                    var room = $scope.room;

                    var getSessionList = function ()
                    {
                        $scope.loading = true;
                        //获取候诊队列
                        triageServices.getQueue({}, function (resp) {

                            /*[
                                  {
                                      "Id": 161207021537396,
                                      "RegID": "2016120700003",
                                      "PatientID": "160719091392404",
                                      "Patientname": "James",
                                      "Sex": "男",
                                      "Birthday": "1979/3/1",
                                      "Age": "37岁",
                                      "Ordernum": 1,
                                      "Prefix": "A1",
                                      "MedicalcardID": "15563",
                                      "State": 30,
                                      "Deptid": "106",
                                      "Deptname": "皮肤科",
                                      "Doctorid": "297",
                                      "Doctorname": "王健松 ",
                                      "Triagetype": 0,
                                      "CreateTime": "2016-12-07T14:16:19",
                                      "IsBusy": false,
                                      "IsSelfBusy": false
                                  }
                              ]*/
                            $scope.Records = resp.Data;
                            $scope.loading = false;

                        }, function (resp) {
                            $scope.Records = [];
                            //layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
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
                    var subscribeEvent = function () {

                        unsubscribes.push(eventBus.subscribe("room-session-changed", function (eventType, eventArgs) {

                            getSessionList();
                        

                        }));

                    }
                    var onInit = function () {
                        subscribeEvent();
                        getSessionList();
                    }

                    var ENUM_State = {
                        候诊:10,
                        叫号:20,
                        接诊:30,
                        过号:40,
                        结束就诊: 50
                    }
                    $scope.getState = function (State) {

                        for (var p in ENUM_State) {
                            if (ENUM_State[p] == State) {
                                return p;
                            }
                        }
                        return "";
                    }
                    $scope.enter = function (item) {

                        if (room.ServiceID == item.OPDRegisterID) {
                            return;
                        }

                        room.ServiceType = 0;//远程会诊
                        //预约编号
                        room.ServiceID = item.OPDRegisterID;


                     
                        $scope.onSelectedCallback({
                            ItemType: "OPD",
                            Room: {
                                ChargingState:0,
                                ChannelID: 0,
                                ServiceType:0,
                                ServiceID: item.OPDRegisterID,
                                Duration:0,
                                TotalTime: 0
                            }
                        })
                       
                    }
                    $scope.detail = function (item) {

                        room.ServiceType = 0;//远程会诊
                        //预约编号
                        room.ServiceID = item.RegID;

                        $scope.onSelectedCallback({
                            ItemType:"Reg",
                            Room: {
                                ChargingState: 0,
                                ChannelID: 0,
                                ServiceType: 0,
                                ServiceID: item.OPDRegisterID,
                                Duration: 0,
                                TotalTime: 0
                            }
                        })

                    }
                
                    $scope.CallNext = function () 
                    {
                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2
                        
                        //调用分诊接口
                        triageServices.Call({
                            RegID: $scope.Records[0].RegID,
                            Type: 0
                        }, function (resp) {

                            layer.close(loading)                            
                            layer.msg($translate.instant('Room-lblSuccess'));
                            $scope.enter(resp.Data)
                            getSessionList();

                        }, function (resp) {

                            layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                            layer.close(loading)
                        })
                    }

                    $scope.$on("$destroy", function () {

                        unsubscribeEvent();
                    });

                    onInit();
                }
            };
        }]);

    });