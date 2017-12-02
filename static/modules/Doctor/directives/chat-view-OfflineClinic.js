define(["angular"], function (angular) {

    console.log("load chatOfflineClinic.js")

    var app = angular.module("myApp", []);

    /*
     * 线下看诊
      * 作者：郭明
      * 日期：2016年10月23日 
     */
    app.directive("chatOfflineClinic", ["$translate", "triageServices", "userMembersServices", "userRegistrationsServices", function ($translate,triageServices, userMembersServices, userRegistrationsServices) {

        return {
            restrict: 'EA',
            scope: {
                room: '=room',
                state:"=state",
                onCallback: '=onCallback',//通知父级更新会话列表
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/chat-view-OfflineClinic.html';
            },
            controller: ["$scope", function ($scope) {                
                var self = this;
                self.toolbar = 'diagnose';
                self.toolbarClick = function (name) {
                    self.toolbar = name;
                }
            }],
            controllerAs: "Offline",
            link: function ($scope, $element, attr) {

                //加载中
                $scope.loading = false;
                //呼叫控制
                $scope.CallControl = false;
                //呼叫次数
                $scope.CallCount = 0;
                //看诊中
                $scope.Clinicing = false;

                $scope.CallNext = false;

                $scope.Call = function (TriageType)
                {
                    var delayHandler = function () {
                        var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2

                        //调用分诊接口
                        triageServices.Call({
                            TriageID: $scope.patientInfo.TriageID,
                            Type: TriageType
                        }, function (resp) {

                            $scope.CallCount++;
                            layer.close(loading)
                            layer.msg($translate.instant('Room-lblSuccess'));

                            
                            //当前患者就诊
                            if (TriageType == 1) {
                                $scope.Clinicing = true;
                            }
                            else if (TriageType == 2)
                            {
                                $scope.CallControl = false;
                                $scope.CallNext = true;
                                $socpe.CallCount = 0;
                            }

                        }, function (resp) {
                            
                            layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                            //layer.msg($translate.instant('Room-lblFail'));
                            layer.close(loading)
                        })
                    }


                    //过号
                    if (TriageType == 2) {
 
                        //询问框(确认呼叫此患者?)
                        var dialog = layer.confirm("确定过号？", {
                            btn: [
                                $translate.instant("btnOK"),
                                $translate.instant("btnCancel")]
                        }, function () {

                            delayHandler();

                            layer.close(dialog);

                        }, function () {

                        });

                    }
                    else
                    {
                        delayHandler();
                    }


                }
                $scope.Init = function ()
                {
                    if ($scope.state) {

                        var requestParams = {};

                        //候诊列表点击详情)
                        if ($scope.state.ItemType == 'Reg') {
                          
                            requestParams = {
                                RegID: $scope.room.ServiceID,//预约编号                          
                            };
                        }
                        //候诊列表（点击呼叫下一位）
                        else
                        {
                            requestParams = {
                                OPDRegisterID: $scope.room.ServiceID,//预约编号                          
                            };
                        }

                        $scope.loading = true;
                        $scope.CallCount = 0;
                        $scope.CallControl = false;
                        $scope.Clinicing = false;

                        //获取挂号信息
                        userRegistrationsServices.get(requestParams, function (obj) {

                            $scope.patientInfo = obj.Data;
                            $scope.patientInfo.Sex = $scope.patientInfo.Sex=="1"?"女":"男"

                            if ($scope.state.ItemType == 'Reg') {
                                //如果是挂号的则需要修正这个业务编号
                                $scope.room.ServiceID = obj.Data.OPDRegisterID;
                            }

                            //候诊中 或未就诊
                            if (obj.Data.Room.RoomState == 1 || obj.Data.Room.RoomState == 0)
                            {
                                                             
                            }
                            //呼叫中
                            else if (obj.Data.Room.RoomState ==4) {
                                $scope.CallCount = 1;
                                $scope.CallControl = true;
                            }
                            //正在就诊
                            if (obj.Data.Room.RoomState == 2) {
                                $scope.Clinicing = true;                            
                            }
                            //已经就诊
                            else if (obj.Data.Room.RoomState == 3)
                            {
                                $scope.Clinicing = true;
                            }
                            $scope.loading = false;

                        }, function (resp) {

                            layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                            $scope.loading = false;
                        });
                    }
                }
                $scope.Init();
            }
        };
    }])



});