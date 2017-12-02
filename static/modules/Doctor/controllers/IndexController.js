define(["module-services-api",
        "module-services-eventBus",
          "module-services-heartbeat",
        "css!styles/layout.space.min.css",
        "bootstrap-notify"], function (apiUtil, eventBus, heartbeat) {


            var app = angular.module("myApp", [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"]);


            //国际化控制器
            app.controller('DoctorIndexController', ['$scope',
                '$translate',
                "$state",
                "webapiServices",
                "hospitalsServices",
                "UserNoticeServices",
                "$rootScope",
                function ($scope,
                    $translate,
                    $state,
                    webapiServices,
                    hospitalsServices,
                    UserNoticeServices,
                    $rootScope) {

                    //当前语言
                    $scope.lang = $translate.use();
                    $scope.unreadCount = 0;  //未读消息数量                 
                    $scope.myMsgs = [];
                    $scope.fn = {};
                    $scope.loginInfo = {};

                    //远程会诊系统地址
                    $scope.RemoteConsultationUrl = global_WebSideUrlConfig.RemoteConsultation;
                    $scope.FamilyPlatform = global_WebSideUrlConfig.FamilyPlatform;
                    //审方系统接口地址
                    $scope.SmartDoctorUrl = "";
                    //系统角色
                    $scope.Roles = global_Roles;
                    //系统权限
                    $scope.Modules = golbal_Modules;

                    $scope.isPierRole = global_Roles[101];//101     

                    $scope.isFamily = global_IsFamily;

                    //当前菜单特殊显示
                    $scope.currentMenu = $state.current.name;
                    //设置语言
                    $scope.fn.onSetLang = function (lang) {
                        $scope.lang = lang

                        $translate.use(lang)
                    }
                    //退出
                    $scope.fn.onLogout = function () {
                        //退出登录
                        webapiServices.logout({}, function () {
                            apiUtil.setLoginInfo({})
                            apiUtil.setLocalAppToken('');
                            if ($scope.isFamily == 'True') {
                                location.href = $scope.FamilyPlatform;
                                return;
                            }

                            if ($scope.isPierRole) {
                                location.href = "/LoginPier";
                                return;
                            }
                            location.href = "/Login";
                        })
                    }

                    $scope.fn.onOpenMenu = function (item)
                    {
                        $scope.currentMenu = item.href;
                    }
                    //设置消息已读
                    $scope.setReaded = function (messageID) {
                        UserNoticeServices.updateMsgToReaded([messageID], function (obj) {
                            if (obj.Status == 0) {
                                getNotice();
                                //$state.go("Doctor.MyNotice");
                            } else {
                                layer("操作失败");
                            }
                        })
                    }

                    $scope.fn.OA = function (e) {
                        $('#myModal').modal({
                            keyboard: true
                        })
                    }
                    // 刷新模态框
                    $('#myModal').on('hidden.bs.modal', function () {
                       document.getElementById('oaIframe').contentWindow.location.reload()
                    })
                    var notify = function (text) {
                        $('.top-right').notify({
                            message: { text: text }
                        }).show(); // for the ones that aren't closable and don't fade out there is a .hide() function.
                    }
                    //获取通知
                    var getNotice = function () {
                        //获取未读消息列表
                        UserNoticeServices.getMyMsg({ ReadStatus: 2, PageSize: 5 }, function (obj) {
                            if (obj.Data != null) {
                                $.each(obj.Data, function (i, d) {
                                    //页面打开方式 
                                    if (d.WebExtrasConfig != null && d.WebExtrasConfig.PageTarget)
                                        d.openTarget = d.WebExtrasConfig.PageTarget;
                                    else
                                        d.openTarget = "_self";
                                    //详细页面跳转地址
                                    var sref = "";
                                    if (d.WebExtrasConfig != null && d.WebExtrasConfig.PageUrl) {
                                        sref = d.WebExtrasConfig.PageUrl;
                                        if (d.PageArgs)
                                            sref = sref + "(" + d.PageArgs + ")";
                                    } else {
                                        sref = "Doctor.NoticeDetail({id:\"" + d.MessageID + "\"})";
                                    }
                                    d.openUrl = sref;
                                });
                            }
                            $scope.myMsgs = obj.Data;
                            $scope.unreadCount = obj.Total;
                            //console.log($scope.myMsgs, 6666666666);
                        })
                    }
                    //订阅事件
                    var subscribeEvent = function () {
                        eventBus.subscribe("im-init", function (eventType, eventArgs) {

                            var config = eventArgs.config;
                            var im = eventArgs.im;

                            //接收管理员下发C2C的消息
                            im.toggleSession(config.manageSessId, "C2C", null, function () {


                            })


                        })

                        eventBus.subscribe("im-unread-msg", function (eventType, eventArgs) {

                            $scope.unreadCount = eventArgs.unreadCount;

                            if (!$rootScope.$$phase)
                                $rootScope.$apply();

                        })

                        eventBus.subscribe("im-new-c2c-extmsg", function (eventType, eventArgs) {

                            var ext = eventArgs.ext;
                            var data = eventArgs.data;
                            var desc = eventArgs.desc;

                            if (ext == 'Notice') {


                                getNotice();

                                /*
                                 * {   
                                          "MsgID": 1287657, 
                                          "MsgTimeStamp": 5454457, 
                                          "MsgBody": [
                                           {        
                                                "MsgTitle":"用户张三购买了你的图文咨询",
                                                "MsgContent": {              
                                                    "PageUrl:"",
                                                    "PageType":"HTML",//页面类型（可选）               
                                                    "PageArgs":""，//页面参数可选    
                                                    "PageTarget":"",//打开目标(_Blank/_Parent/_Self/_Top)
                                                },
                                            }
                                        ]
                                    }
                                 */
                                data.MsgBody.forEach(function (item) {

                                    notify(item.MsgTitle)

                                })
                            }
                        })

                        //读取了消息
                        eventBus.subscribe("read-msg", function (eventType, eventArgs) {

                            //$scope.unreadCount--;

                            //刷新未读消息列表
                            getNotice();

                            if (!$rootScope.$$phase)
                                $rootScope.$apply();

                        });
                    }
                    //跳转到默认页面
                    var gotoDefaultPage = function () {

                        if ($state.current.name == "Doctor") 
                        {
                            window.location.href = $scope.Modules[0].href;
                        }
                    }

                    var getLoginInfo=function()
                    {
                        try
                        {
                            //获取登录信息
                            $scope.loginInfo = apiUtil.getLoginInfo();
                        
                            if ($scope.isPierRole) {
                                document.title = '个人中心-美国彼爱医疗';
                                var $body = $('body');
                                var $iframe = $("<iframe style='display:none;' src='/favicon.ico'></iframe>");
                                $iframe.on('load', function () {
                                    setTimeout(function () {
                                        $iframe.off('load').remove();
                                    }, 0);
                                }).appendTo($body);
                            }
                        }
                        catch (e)
                        {
                            location.href = "/Login";
                            return;
                        }
                    }

                    var sendHeartbeat = function (type) {
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

                    // 火狐乱码
                    var firexFlashingHide = function () {
                        document.getElementsByTagName('html')[0].style.display = 'none';
                    }
                    var firexFlashingShow = function () {
                        document.getElementsByTagName('html')[0].style.display = 'block';
                    }

                    //页面初始化
                    var pageInit = function () {
                        firexFlashingHide();
                        sendHeartbeat("doctor.homepage");
                        gotoDefaultPage();
                        subscribeEvent();
                        getLoginInfo();
                        getNotice();
                        firexFlashingShow();

                        var timeout = null;
                        $("#space .messages").hover(function () {
                            if (timeout)
                                clearTimeout(timeout);

                            $("#space .messages .messages-list").show();
                        }, function () {
                            timeout = setTimeout(function () {
                                $("#space .messages .messages-list").hide();
                                timeout = null;
                            }, 800);
                        });
                    }

                    pageInit();

                }]);
        });