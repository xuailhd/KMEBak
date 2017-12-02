define([
    "module-services-api",
    "module-services-eventBus",
    "plugins-fullCalendar",
    "plugins-echarts",
    "plugins-layer",
    "plugins-localAll",
    "css!styles/layout.space.min.css",
    "bootstrap-notify",
    "css!styles/layout.space.healthServiceStation.min.css"
], function (apiUtil, eventBus, fullCalendar, echarts, layer) {


    var healthwebapiUrl = global_ApiConfig.HealthstationApiUrl,
        webapiUrl = apiUtil.webapiUrl;

    var app = angular.module("myApp", [
        "pascalprecht.translate",
        'ui.router',
        "ui.bootstrap",
        "ngAnimate"
    ]);


    //国际化控制器
    app.controller('HealthServiceStationController', [
        '$scope', '$translate', "$state", "$rootScope", "$q",
        "webapiServices", "hospitalsServices", "UserNoticeServices",
        "doctorsServices", "userMembersServices", "doctorPatientsServices",
        "doctorDiagnosisServices", "HealthStationExamServices",
        function ($scope, $translate, $state, $rootScope, $q,
            webapiServices, hospitalsServices, UserNoticeServices,
            doctorsServices, userMembersServices, doctorPatientsServices,
            doctorDiagnosisServices, HealthStationExamServices) {


            var memberId = $state.params.memberId;
            //当前语言
            $scope.lang = $translate.use();
            $scope.unreadCount = 0; //未读消息数量
            $scope.fn = {};

            //#region 检查医生是否已通过认证
            try {

                //获取登录信息
                $scope.loginInfo = apiUtil.getLoginInfo();

                if ($scope.loginInfo == "" || $scope.loginInfo.UserType != 2) {
                    location.href = "/Login";
                    return;
                }
            } catch (e) {

                location.href = "/Login";
                return;
            }


            //彼爱医疗Tag
            if ($scope.loginInfo.UserLevel == 5) {
                $scope.PierTag = 'PierTag';
            } else {
                $scope.PierTag = '';
            }


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
                    if ($scope.PierTag.length > 0) {
                        location.href = "/LoginPier";
                        return;
                    }
                    location.href = "/Login";
                })
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
            };

            $scope.myMsgs = [];
            $scope.unreadCount = 0;
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

            //订阅时间
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

                //#region 设置默认首页
                if ($state.current.name == "Doctor")
                    $state.go("Doctor.MyServices.Inquiries");
            };


            var notify = function (text) {
                $('.top-right').notify({
                    message: { text: text }
                }).show(); // for the ones that aren't closable and don't fade out there is a .hide() function.
            };

            //页面初始化
            var pageInit = function () {

                gotoDefaultPage();
                subscribeEvent();
                getNotice();
            };


            pageInit();


            //获取医生登录信息
            var loginInfo = apiUtil.getLoginInfo();
            //初始化
            $scope.eventsArr = [];
            $scope.eventsArr1 = [];
            $scope.DoctorID = "";

            doctorsServices.get({ UserID: loginInfo.UserID }, function (respDoctorInfo) {
                $scope.DoctorID = respDoctorInfo.Data.DoctorID;
            });

            $scope.UserHealthPlanID = ""; //健康ID
            $scope.setEventType = {
                "N0": "服药",
                "N1": "针灸",
                "N2": "体检",
                "N3": "跑步",
                "N101": "瑜伽",
                "N102": "羽毛球",
                "N103": "太极拳",
                "N104": "慢跑",
            }

            $scope.getEventType = {
                "服药": "0",
                "针灸": "1",
                "体检": "2",
                "跑步": "3",
                "瑜伽": "101",
                "羽毛球": "102",
                "太极拳": "103",
                "慢跑": "104",
            }

            //$scope.setEventType = ["服药","针灸","体检","跑步"];
            //$scope.setEventType= [{ name: "服药", type: "1" }, { name: "针灸", type: "2" }, { name: "体检", type: "3" }, { name: "跑步", type: "4" }];

            $scope.MemberID = "1"; //患者ID，从上一个页面过来的时候获取
            $scope.idnos = "";
            $scope.patientInfo = {};


            $(document).ready(function () {

                userMembersServices.get({ ID: memberId, async: false }, function (response) {
                    $scope.idnos = response.Data.IDNumber;
                    $scope.patientInfo = {
                        name: response.Data.MemberName,
                        sex: response.Data.GenderName,
                        age: response.Data.Age
                    };
                });

                //获取患者就诊记录
                $scope.patientOPDRegisterRecords = "无";
                doctorPatientsServices.getPatientVisitList({ MemberID: memberId }, function (list) {
                    if (list.Data && list.Data.length > 0) {

                        $scope.patientOPDRegisterRecords = list.Data[0].UserMedicalRecord.PastMedicalHistory == "" ? "无" : list.Data[0].UserMedicalRecord.PastMedicalHistory;

                    }
                });

                /* initialize the chart
               -----------------------------------------------------------------*/
                function initChart(id, option) {
                    var chart = echarts.init(document.getElementById(id), null, {
                        renderer: 'canvas'
                    });
                    chart.setOption(option);
                };

                var option1 = {
                        title: {
                            text: '血压情况',
                            textStyle: {
                                fontSize: 18
                            }
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['收缩压', '舒张压']
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                magicType: { show: true, type: ['stack', 'tiled'] },
                                saveAsImage: { show: true }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            min: "60",
                            max: "180"
                        },
                        series: [
                            {
                                name: '收缩压',
                                type: 'line',
                                smooth: true,
                                data: []
                            }, {
                                name: '舒张压',
                                type: 'line',
                                smooth: true,
                                data: []
                            }
                        ]
                    },
                    option2 = {
                        title: {
                            text: '血糖情况'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['血糖']
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                magicType: { show: true, type: ['stack', 'tiled'] },
                                saveAsImage: { show: true }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            min: "0",
                            max: "12"
                        },
                        series: [
                            {
                                name: '血糖',
                                type: 'line',
                                smooth: true,
                                data: []
                            }
                        ]
                    },
                    option3 = {
                        title: {
                            text: '血氧情况',
                            subtext: ''
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['血氧']
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                magicType: { show: true, type: ['stack', 'tiled'] },
                                saveAsImage: { show: true }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            min: '80',
                            max: '120'
                        },
                        series: [
                            {
                                name: '血氧',
                                type: 'line',
                                smooth: true,
                                data: []
                            }
                        ]
                    },
                    option4 = {
                        title: {
                            text: '体温情况',
                            subtext: ''
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['体温']
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                magicType: { show: true, type: ['stack', 'tiled'] },
                                saveAsImage: { show: true }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            min: "34",
                            max: "42"
                        },
                        series: [
                            {
                                name: '体温',
                                type: 'line',
                                smooth: true,
                                data: []
                            }
                        ]
                    },
                    option5 = {
                        title: {
                            text: '体重情况',
                            subtext: ''
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['体重']
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                magicType: { show: true, type: ['stack', 'tiled'] },
                                saveAsImage: { show: true }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            min: '',
                            max: ''
                        },
                        series: [
                            {
                                name: '体重',
                                type: 'line',
                                smooth: true,
                                data: []
                            }
                        ]
                    };
                //format date
                Date.prototype.Format = function (fmt) { //author: meizz 
                    var o = {
                        "M+": this.getMonth() + 1, //月份 
                        "d+": this.getDate(), //日 
                        "h+": this.getHours(), //小时 
                        "m+": this.getMinutes(), //分 
                        "s+": this.getSeconds(), //秒 
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                        "S": this.getMilliseconds() //毫秒 
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                };
                //  initChart("chartmain", option1);
                var loadChartData = function (index, option, items) {
                    if (!$scope.idnos) {
                        layer.msg("暂无数据");
                        return;
                    }
                    HealthStationExamServices.GetExamItem({
                        IdNo: $scope.idnos,
                        CurrentPage: 1,
                        PageSize: 5,
                        Unit: 1, //count
                        Items: items, //血压（收缩压：554，舒张压：556），血糖：776，血氧：1000，体温：566，体重：568
                    }, function (data) {
                        if (data && data.Data) {
                            var data = data.Data;
                            if (index == 0) {
                                for (var i = 0; i < data.length; i++) {
                                    option.xAxis.data[i] = new Date(data[i].CreateDate + "+08:00").Format("M/d");
                                    if (data[i].ItemId == "554") {
                                        console.log(option.xAxis.data[i], 11);
                                        option.series[0].data[i] = data[i].Result; //收缩压
                                    } else {
                                        console.log(option.xAxis.data[i], 22);
                                        option.series[1].data[i] = data[i].Result; //舒张压
                                    }

                                    //if (data[i].ItemId == items[0]) {
                                    //    option.series[0].data[i] = data[i].Result;//收缩压
                                    //} else {
                                    //    option.series[1].data[i] = data[i].Result;//舒张压
                                    //}

                                    // console.log(data[i], option1, 333333);
                                }
                            } else if (index == 4) { //体重
                                var minMaxArr = [];
                                for (var i = 0; i < data.length; i++) {
                                    option.xAxis.data[i] = new Date(data[i].CreateDate + "+08:00").Format("M/d");
                                    option.series[0].data[i] = data[i].Result;
                                }
                                option.yAxis.min = Math.min.apply(null, option.series[0].data) - 1;
                                option.yAxis.max = Math.max.apply(null, option.series[0].data) + 1;

                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    option.xAxis.data[i] = new Date(data[i].CreateDate + "+08:00").Format("M/d");
                                    option.series[0].data[i] = data[i].Result;
                                }
                            };
                            initChart("chartmain", option);
                        } else {
                            layer.msg("暂无数据");
                        }
                    })
                };

                var reloadChart = function (index) {
                    switch (index) {
                        case 0:
                            loadChartData(0, option1, "554");
                            loadChartData(0, option1, "556");
                            //initChart("chartmain", option1);
                            break;
                        case 1:
                            loadChartData(1, option2, "776");

                            //initChart("chartmain", option2);
                            break;
                        case 2:
                            loadChartData(2, option3, "1000");
                            //initChart("chartmain", option3);
                            break;
                        case 3:
                            loadChartData(3, option4, "566");
                            //initChart("chartmain", option4);
                            break;
                        case 4:
                            loadChartData(4, option5, "568");
                            //initChart("chartmain", option5);
                            break;

                    };
                };
                reloadChart(0); //初始化图表
                $(".prev-chart").on("click", function () {
                    var liLen = $(".chart-lists li").length,
                        curIndex = $(".chart-lists li.active").index(),
                        prevIndex = curIndex == 0 ? liLen - 1 : curIndex - 1;
                    $(".chart-lists li").eq(prevIndex).addClass("active").siblings().removeClass("active");
                    reloadChart(prevIndex);
                });
                $(".next-chart").on("click", function () {
                    var liLen = $(".chart-lists li").length,
                        curIndex = $(".chart-lists li.active").index(),
                        nextIndex = curIndex == liLen - 1 ? 0 : curIndex + 1;
                    $(".chart-lists li").eq(nextIndex).addClass("active").siblings().removeClass("active");
                    reloadChart(nextIndex);
                });

                $(".chart-lists li").on("click", function () {
                    var index = $(this).index();
                    console.log(index);
                    $(this).addClass("active").siblings().removeClass("active");
                    options = "option" + index;
                    reloadChart(index);
                });


                /* initialize the external events
                -----------------------------------------------------------------*/
                $('#external-events .fc-event').each(function () {

                    // store data so the calendar knows to render an event upon drop
                    $(this).data('event', {
                        title: $.trim($(this).text()), // use the element's text as the event title
                        stick: true // maintain when user navigates (see docs on the renderEvent method)
                    });

                    // make the event draggable using jQuery UI
                    $(this).draggable({
                        zIndex: 999,
                        revert: true, // will cause the event to go back to its
                        revertDuration: 0 //  original position after the drag
                    });

                });

                /* initialize the calendar
                -----------------------------------------------------------------*/

                var initFullCalendar = function (eventsArr) {
                    var calendarOptions = {
                        header: {
                            left: 'prev',
                            center: 'title',
                            right: 'next'
                        },
                        locale: 'zh-cn',
                        editable: true,
                        eventDurationEditable: false,
                        resourceEditable: true,
                        events: [],
                        eventSources: [{ events: eventsArr }],
                        droppable: true, // this allows things to be dropped onto the calendar
                        eventLimit: true, // allow "more" link when too many events
                        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                            var ExeType = $scope.getEventType[event.title];
                            var existData = {
                                "MemberID": memberId,
                                "Start": event._start._d.format("yyyy-MM-dd"),
                                "End": event._start._d.format("yyyy-MM-dd"),
                                "ExeType": ExeType
                            }
                            //判断是否  同一日期不能添加同一项
                            apiUtil.requestWebApi("/UserHealthPlan/ExistHealthPlan", "Get", existData,
                                function (response) {
                                    if (response.Data == false) {
                                        var olddate = new Date(event._start._d.getTime() - 1000 * 60 * 60 * 24 * delta._days);
                                        var updateData = {
                                            "MemberID": memberId,
                                            "Start": olddate,
                                            "End": olddate,
                                            "NewStart": event._start._d.format("yyyy-MM-dd"),
                                            "NewEnd": event._start._d.format("yyyy-MM-dd"),
                                            "ExeType": ExeType
                                        };

                                        apiUtil.requestWebApi("/UserHealthPlan/DropUpdateHealthPlan", "POST", updateData, function (response) {

                                        }, function (requese) {
                                            layer.msg("更新数据失败");
                                            revertFunc();
                                        });
                                    } else {
                                        layer.msg("同一日期不能添加同一项");
                                        revertFunc();
                                    }

                                }, function (error) {
                                    if (error.Msg) {
                                        layer.msg(error.Msg);
                                    }
                                    revertFunc();
                                });
                        },
                        drop: function (date, jsEvent, ui, resourceId) {

                        },
                        eventReceive: function (event) {
                        
                            var ExeType = $scope.getEventType[event.title];
                            var existData = {
                                "MemberID": memberId,
                                "Start": event.start._d.format("yyyy-MM-dd"),
                                "End": event.start._d.format("yyyy-MM-dd"),
                                "ExeType": ExeType
                            };

                            apiUtil.requestWebApi("/UserHealthPlan/ExistHealthPlan", "Get", existData, function (response) {
                                if (response.Data == false) {
                                    var addPlanData = {
                                        "UserID": loginInfo.UserID,
                                        "MemberID": memberId,
                                        "DoctorID": $scope.DoctorID,
                                        "Start": event.start._d.format("yyyy-MM-dd"),
                                        "End": event.start._d.format("yyyy-MM-dd"),
                                        "ExeType": ExeType
                                    };

                                    apiUtil.requestWebApi("/UserHealthPlan/AddHealthPlan", "POST", addPlanData, function (response) {
                                        if (response.Data) {
                                            $scope.UserHealthPlanID = response.Data;
                                        }
                                    });
                                } else {
                                    layer.msg("同一日期不能添加同一项");
                                    $('#fullCalendar').fullCalendar('removeEvents', event._id);
                                    //revertFunc();
                                }
                            }, function (error) {
                                if (error.Msg) {
                                    layer.msg(error.Msg);
                                }
                                $('#fullCalendar').fullCalendar('removeEvents', event._id);
                                //revertFunc();
                            });
                        },
                        eventClick: function (calEvent, jsEvent, view) {
                            var ExeType = $scope.getEventType[calEvent.title];
                            if (ExeType > 100) { //用患者配置的 不能删除
                                layer.msg("对不起，您不能删除患者自己设置的项目。");
                            } else {
                                if (confirm("确定删除" + calEvent.title + "这一项吗?")) {
                                    $('#fullCalendar').fullCalendar('removeEvents', calEvent._id);
                                    var deleteData = {
                                        "UserHealthPlanID": $scope.UserHealthPlanID,
                                        "UserID": loginInfo.UserID,
                                        "MemberID": memberId,
                                        "DoctorID": $scope.DoctorID,
                                        "Start": calEvent._start._d.format("yyyy-MM-dd"),
                                        "End": calEvent._start._d.format("yyyy-MM-dd"),
                                        "ExeType": ExeType
                                    };
                                    apiUtil.requestWebApi("/UserHealthPlan/DeleteHealthPlan", "POST", deleteData, function (response) {
                                    });
                                };
                            }
                        }
                    };
                    $('#fullCalendar').fullCalendar(calendarOptions);
                };

                var getEventsArr = function (ownFlag) {
                    var getData = {
                        "UserID": loginInfo.UserID,
                        "MemberID": memberId,
                        "BeginDate": "",
                        "EndDate": ""
                    };
                    apiUtil.requestWebApi("/UserHealthPlan/GetHealthPlan", "GET", getData, function (response) {
                        if (response.Status == 0) {
                            console.log(ownFlag);
                            $scope.eventsArr = response.Data.UserHealthPlanDetails;
                            $scope.UserHealthPlanID = response.Data.UserHealthPlanID;

                            if (response.Data.UserHealthPlanDetails.length > 0) {
                                //获取doctorID
                                //获取医生登录信息
                                var loginInfo = apiUtil.getLoginInfo();
                                //获取医生信息
                                doctorsServices.get({ UserID: loginInfo.UserID }, function (respDoctorInfo) {
                                    $scope.eventsArr1 = [];
                                    $.each(response.Data.UserHealthPlanDetails, function (i, val) {
                                        $scope.eventsArr[i].start = new Date(val.Start).Format("yyyy-MM-dd");
                                        $scope.eventsArr[i].end = new Date(val.End).Format("yyyy-MM-dd");
                                        $scope.eventsArr[i].title = $scope.setEventType["N" + val.ExeType];
                                        if (val.DoctorID) {
                                            $scope.eventsArr[i].DoctorID = val.DoctorID;
                                            if (val.DoctorID == $scope.DoctorID) {
                                                $scope.eventsArr1.push($scope.eventsArr[i]);
                                            };
                                        }
                                    });
                                    console.log($scope.eventsArr, 81, $scope.DoctorID);
                                    $('#fullCalendar').fullCalendar('destroy');
                                    if (!ownFlag) {
                                        initFullCalendar($scope.eventsArr);
                                    } else {
                                        initFullCalendar($scope.eventsArr1);
                                    }
                                });

                            } else {
                                //  initFullCalendar([]);
                            };
                            //console.log($scope.eventsArr, 81,$scope.DoctorID );
                            //console.log($scope.eventsArr1, 91);
                            //initFullCalendar($scope.eventsArr);

                        } else {
                            //initFullCalendar([]);
                        }
                    }, function () {

                        // initFullCalendar([]);
                    });
                };
                //初始化日历
                initFullCalendar([]);
                //初始化日程内容
                var ownFlag = false;
                getEventsArr(ownFlag);


                /*save set*/
                //$(".schedule-save-btn").on("click", function () {
                //    $('#fullCalendar').fullCalendar('getEventSources');
                //    console.log($('#fullCalendar').fullCalendar('getResources')[0], 66);
                //});

                /*show own set*/

                $("#ownSet").on("click", function () {
                    //destroy old calendar
                    $('#fullCalendar').fullCalendar('destroy');
                    ownFlag = !ownFlag
                    getEventsArr(ownFlag);
                });

                //$(".showOwnLabel").on("click", function () {
                //    //destroy old calendar
                //    $('#fullCalendar').fullCalendar('destroy');
                //    
                //    ownFlag = !ownFlag
                //    getEventsArr(ownFlag);
                //    //if (!$('#ownSet').is(':checked')) {
                //    //    ownFlag = true;
                //    //    getEventsArr(ownFlag);
                //    //    //console.log("arr:",$scope.eventsArr);
                //    //    //console.log("arr1:", $scope.eventsArr1);
                //    //    //initFullCalendar($scope.eventsArr1);
                //    //    //if ($scope.eventsArr1.length > 0) {
                //    //    //    $('#fullCalendar').fullCalendar('updateEvent', $scope.eventsArr1);
                //    //    //}

                //    //} else {
                //    //    ownFlag = false;
                //    //    getEventsArr(ownFlag);
                //    //    // initFullCalendar($scope.eventsArr);
                //    //    //if ($scope.eventsArr.length > 0) {
                //    //    //$('#fullCalendar').fullCalendar('updateEvent', $scope.eventsArr);
                //    //    //}
                //    //}
                //});


                /* 加载医生体质数据
                -----------------------------------------------------------------*/
                $scope.mainPhysique = "暂无";
                $scope.referPhysique = "暂无";

                function loadPhysique(idno) {
                    if (!idno) {
                        layer.msg("暂无数据");
                        return;
                    }
                    HealthStationExamServices.GetTMCItem({ idNumber: $scope.idnos }, function (data) {
                        if (data == null)
                            return;
                        console.log(data);

                        var ReferencePhysique = "";
                        for (var i = 0; i < data.Data.length; i++) {
                            if (i == 0) {
                                //$(".mainPhysique").html(data.questionnaires[0].type);//主体质内容
                                $scope.mainPhysique = data.Data[0].type == "" ? "暂无" : data.Data[0].type;
                            } else {
                                ReferencePhysique = ReferencePhysique + data.Data[i].type + " ";
                                // $(".referPhysique").html(ReferencePhysique);//参考体质内容
                                $scope.referPhysique = ReferencePhysique == "" ? "暂无" : ReferencePhysique;
                            };

                        };

                    });
                };

                loadPhysique($scope.idnos);


            });


        }
    ]);
});