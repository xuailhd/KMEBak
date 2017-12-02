define(["angular", "require", "module-services-eventBus", "plugins-sdk-webim", ], function (angular, require, eventBus, webim) {

    var app = angular.module("myApp", [
    "pascalprecht.translate",
    'ui.router',
    "ui.bootstrap",
    "ngAnimate"]);

    /*聊天*/
    app.directive('chatComment', ["$sce", '$translate', "imServices", "$rootScope", "$filter", function ($sce, $translate, imServices, $rootScope, $filter) {

        var lang = $translate.use();
        var lastMsgTime = null;
        var unsubscribes = [];

        return {
            restrict: 'EA',
            controller: ["$scope", function ($scope) {
                var self = this;

                var room = $scope.room;

                //枚举消息类型
                var EnumMsgType = {
                    MSGTYPE_SYSTEM: "MSGTYPE_SYSTEM",
                    MSGTYPE_TEXT: "MSGTYPE_TEXT",
                    MSGTYPE_VIDEO: "MSGTYPE_VIDEO",//视频消息
                    MSGTYPE_MICROVIDEO: "MSGTYPE_MICROVIDEO",//小视频
                    MSGTYPE_IMAGE: "MSGTYPE_IMAGE",//图片消息                     
                    MSGTYPE_SHARECARD: "MSGTYPE_SHARECARD",//名片
                    MSGTYPE_VOICE: "MSGTYPE_VOICE",//语音消息
                    MSGTYPE_VERIFYMSG: "MSGTYPE_VERIFYMSG",//朋友验证消息
                    MSGTYPE_SHARECARD: "MSGTYPE_SHARECARD",//名片消息
                    MSGTYPE_LOCATION: "MSGTYPE_LOCATION",//地理位置  
                    MSGTYPE_READER_TYPE: "APPMSGTYPE_READER_TYPE",
                    MSGTYPE_URL: "APPMSGTYPE_URL",//链接消息
                    MSGTYPE_ATTACH: "APPMSGTYPE_ATTACH",//附件
                    MSGTYPE_RED_ENVELOPES: "APPMSGTYPE_RED_ENVELOPES",//红包
                    MSGTYPE_SURVEY_QUESTION: "MSGTYPE_SURVEY_QUESTION",//调查问卷
                };

                var unsubscribeEvent = function () {
                    //先移除之前的订阅
                    unsubscribes.forEach(function (unsubscribe) {
                        unsubscribe();
                    });
                    unsubscribes = [];
                }
                //订阅时间
                var subscribeEvent = function () {

                    if (unsubscribes.length > 0)
                        return;

                    //更新候诊队列
                    unsubscribes.push(eventBus.subscribe("im-new-c2c-msg", function (eventType, args) {
                        self.appendToMessages(args.msg, args.isNewMsg)
                    }));

                    //更新候诊队列
                    unsubscribes.push(eventBus.subscribe("room-changed", function (eventType, args) {
                        
                        room.groupMgr.getGroupUsersInfo(room.ChannelID, function (groupUsers) {
                            // 解决图文咨询诊室快速切换，导致上一个诊室的异步消息被加载到当前诊室的问题
                            if (self.messages.length != 0) {
                                self.messages = [];
                                self.sendingMessages = [];
                                lastMsgTime = null;
                                console.log("clear messages!");
                            }
                            room.syncMessage();
                        }, null);
                    }));

                }

                var onInit = function () {
                    lastMsgTime = null;
                    unsubscribeEvent();
                    subscribeEvent();
                }

                var onUnload = function () {
                    unsubscribeEvent();
                }

                //获取日志消息的时间
                var getLogMessageTime = function () {
                    var item = this;

                    return $filter('date')(item.time, "yyyy-MM-dd HH:mm:ss");
                }

                //获取试试消息的时间
                var getRealtimeMessageTime = function () {
                    var msg = this;

                    //第一条消息的时间
                    if (msg.index == 0) {
                        lastMsgTime = msg.time;
                        return webim.Tool.formatTimeStamp(lastMsgTime);
                    }

                    //如果当前消息时间和上一条消息的时间差超过1分钟
                    if (msg.time - (10 * 100) > lastMsgTime) {
                        lastMsgTime = msg.time;
                        return webim.Tool.formatTimeStamp(lastMsgTime);
                    }
                    else {
                        return "";
                    }
                }

                self.room = room;

                self.messages = [];

                self.sendingMessages = [];

                self.EnumMsgType = EnumMsgType;

                var members = {};

                //聊天页面增加一条消息
                self.appendToMessages = function (msg, isNewMsg) {


                    //收到一条新消息，单消息发送这不在当前房间用户信息缓存中则需要重新调用服务端获取。
                    if (!members[msg.fromAccount]) {

                        //当前群组缓存的用户列表中是否存在当前用户的信息
                        if (self.room.groupMgr.GroupsInfo[self.room.ChannelID] &&
                            self.room.groupMgr.GroupsInfo[self.room.ChannelID].UserIdentifiers &&
                            self.room.groupMgr.GroupsInfo[self.room.ChannelID].UserIdentifiers.some(function (item) {
                            return item == msg.fromAccount
                        })) {
                            members[msg.fromAccount] = true;
                        }
                    }

                    var delayFn = function () {

                        var message = self.messageWrapperToUIRealtimeMessage(self.messageWrapperToUIMessage(msg));

                        if (!message) {
                            return;
                        }

                        message.index = self.messages.length
                        $scope.safeApply(function () {
                            //#region 处理是否消息是否显示到聊天记录中

                            //历史消息直接显示或用户通过客户端发送的
                            self.messages.push(message);

                            if (message.isSend && self.sendingMessages.length > 0) {

                                //保留没有发送成功的消息
                                self.sendingMessages = self.sendingMessages.filter(function (item, index) {
                                    return item.status == 0;
                                });
                            }
                            //#endregion

                            //#region 更新当前消息群组的最后一条消息和最后消息发送时间

                            room.groupMgr.GroupsInfo[msg.sess.id()].LastMsg = msg;
                            room.groupMgr.GroupsInfo[msg.sess.id()].LastMsgTime = msg.time;
                            //#endregion
                        })

                        self.scrollMessageContentToBottom();

                    }

                    if (!members[msg.fromAccount]) {


                        //异步调用服务端接口获取当前房间成员信息
                        self.room.groupMgr.getGroupUsersInfo(self.room.ChannelID, function (groupUsers) {
                            //执行延时消息
                            delayFn();

                        }, function (resp) {
                            //获取房间失败，
                            delayFn();

                        });
                    }
                    else {
                        delayFn();
                    }

                }

                //重新发送
                self.resendMsg = function (message) {
                    //定义了消息重发业务
                    if (message._msg.Send) {

                        message._msg.Send(message)
                    }
                    else {
                        //发送消息
                        room.messageMgr.resendMsg(message._msg, function (msg) {
                            //重新发送后立即回调

                        }, function (msg, error) {

                            $scope.safeApply(function () {

                            })

                            if (error)
                                layer.msg($translate.instant("Room-msgSendFail") + error.ErrorInfo)
                        });
                    }
                }

                self.bytesToSize = function (bytes) {
                    if (bytes === 0) return '0 B';
                    var k = 1000, // or 1024
                        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                        i = Math.floor(Math.log(bytes) / Math.log(k));
                    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
                }

                //历史消息需包装成实时消息
                self.messageWrapperToIMMessage = function (item) {

                    var msg = {
                        fromAccount: item.FromAccount,
                        time: item.MsgTime,
                        elems: item.MsgBody.map(function (elem) {

                            return eval("(" + elem + ")");
                        })
                    };

                    msg.toHtml = function () {

                        var html = "";
                        for (var i = 0; i < this.elems.length; i++) {
                            var elem = this.elems[i];
                            html += elem.toHtml();
                        }

                        return html;
                    };

                    for (var i = 0; i < msg.elems.length; i++) {
                        var msgBody = msg.elems[i];
                        msgBody.type = msgBody.MsgType;
                        msgBody.content = msgBody.MsgContent;

                        switch (msgBody.type) {
                            case "TIMTextElem":
                                msgBody.toHtml = function () {


                                    return this.MsgContent.Text;
                                }
                                break;
                            case "TIMFaceElem":
                                msgBody.toHtml = function () {


                                    var data = this.MsgContent.Data;

                                    if (room.messageMgr.EmotionPicData[data]) {
                                        return "<img src='" + room.messageMgr.EmotionPicData[data] + "'/>";
                                    } else {
                                        return data;
                                    }
                                }
                                break;
                            case "TIMImageElem":
                                msgBody.toHtml = function () {
                                    var Image = this.MsgContent.ImageInfoArray[0];

                                    return "<img src='" + Image.URL + "' style='CURSOR: hand' />";
                                }
                                break;
                            case "TIMFileElem":
                                msgBody.content.name = msgBody.MsgContent.FileName;
                                msgBody.content.size = msgBody.MsgContent.FileSize;
                                msgBody.content.uuid = msgBody.MsgContent.UUID;
                            case "TIMSoundElem":

                                msgBody.content = new webim.Msg.Elem.Sound(
                                                                  msgBody.MsgContent.UUID,
                                                                  msgBody.MsgContent.Second,
                                                                  msgBody.MsgContent.Size,
                                                                  item.FromAccount,
                                                                  item.ToGroupId
                                                              );

                                if (msgBody.content.uuid.length == 32) {
                                    msgBody.content.voiceUrl = global_StoreConfig.UrlPrefix + "/Files/" + msgBody.content.uuid;
                                }
                                else {
                                    msgBody.content.voiceUrl = msgBody.content.downUrl;
                                }
                            case "TIMCustomElem":
                                msgBody.content.data = eval("(" + msgBody.MsgContent.Data + ")");
                                msgBody.content.desc = msgBody.MsgContent.Desc;
                                msgBody.content.ext = msgBody.MsgContent.Ext;
                            default:
                                msgBody.toHtml = function () {
                                }
                                break;
                        }

                    }
                    return msg;
                }

                //在线界面显示时需要包装
                self.messageWrapperToUIMessage = function (msg) {


                    var user = room.memberMgr.formatUser(msg.fromAccount ? msg.fromAccount : room.loginInfo.identifier, lang);

                    var message = {
                        avatar: user.avatar,//头像
                        author: user.nickName,//名称
                        html: $sce.trustAsHtml(msg.toHtml()), //内容
                        content: msg.content,
                        isSend: msg.isSend,
                        time: msg.time,
                        _msg: msg
                    };


                    //#region 处理消息的类型及格式
                    if (msg.elems[0].type == "TIMCustomElem") {

                        //自定义消息，多语言资源前缀
                        var tranlateResourcePrefix = "Room-lblIMCustomMsg" + "." + msg.elems[0].content.ext;

                        //已经生成处方订单
                        if (msg.elems[0].content.ext == 'Order.Recipe.Created') {

                            var Order = msg.elems[0].content.data.Order;

                            if (Order && Order.OrderNo) {

                                message.msgType = EnumMsgType.MSGTYPE_URL;
                                //Room-lblIMCustomMsg.Order.Recipe.Created/FileName
                                message.FileName = $translate.instant(tranlateResourcePrefix + "/FileName");
                                message.Desc = "￥" + Order.TotalFee;
                                message.FileUrl = global_WebSideUrlConfig.Home + "/Trade/Order/Confirm?OrderNo=" + Order.OrderNo;
                                message.Conver = "/static/images/bg-chat.jpg";
                            }

                        }
                            //购买处方订单
                        else if (msg.elems[0].content.ext == 'Order.Buy.Recipe') {

                            var recipes = msg.elems[0].content.data;


                            //计算总金额
                            var totalFee = recipes.reduce(function add(sumSoFar, item) {

                                if (item.RecipeType == 1) {
                                    return sumSoFar + (item.Amount) + (item.ReplacePrice * item.ReplaceDose);
                                }
                                else {
                                    return sumSoFar + (item.Amount);
                                }
                            }, 0);

                            if (recipes && recipes.length > 0) {
                                message.msgType = EnumMsgType.MSGTYPE_URL;
                                message.FileName = "[购买处方]" + recipes[0].RecipeName + "（￥" + totalFee.toFixed(2) + "）";
                                message.Desc = "由康美药业完成药品的调配、中药煎煮与配送";
                                message.FileUrl = $scope.onUrlClick == null ? "/Index#/User/MyServices/Inquiries" : "";
                                message.Conver = "/static/images/bg-chat.jpg";
                                message.RefrenceType = msg.elems[0].content.ext;
                                message.RefrenceItem = recipes;
                            }
                        }
                        // 处方预览
                        else if (msg.elems[0].content.ext == 'Recipe.Preview') {
                            message.msgType = EnumMsgType.MSGTYPE_URL;
                            message.FileName = "[处方预览]";
                            message.Desc = "医生已开具处方，请点击查看";
                            // 如果设置了url消息的点击事件，则直接处理点击事件，未设置则使用超链接方式
                            message.FileUrl = "";
                            message.Conver = "/static/images/bg-chat.jpg";
                            message.RefrenceType = msg.elems[0].content.ext;
                            message.RefrenceItem = msg.elems[0].content.data;
                        }
                        //处方已保存
                        else if (msg.elems[0].content.ext == 'Diagnose.Recipe.Saved') {
                            message.msgType = EnumMsgType.MSGTYPE_SYSTEM;
                            //Room-lblIMCustomMsg.Diagnose.Recipe.Saved/Desc
                            message.html = $translate.instant(tranlateResourcePrefix + "/Desc");
                        }
                            //系统通知
                        else if (msg.elems[0].content.ext == 'Notice') {
                            message.msgType = EnumMsgType.MSGTYPE_SYSTEM;
                            message.html = $sce.trustAsHtml(msg.elems[0].content.desc);
                        }
                            //房间状态已经变更
                        else if (msg.elems[0].content.ext == "Room.StateChanged") {
                            message.msgType = EnumMsgType.MSGTYPE_SYSTEM;

                            var data = msg.elems[0].content.data;

                            //获取多语言内容(Room-lblIMCustomMsg.Room.StateChanged/1-2)
                            var content = $translate.instant(tranlateResourcePrefix + "/" + data.ServiceType + "-" + data.State);
                            if (content != "") {
                                message.html = $sce.trustAsHtml(content)
                            }
                            else {
                                return;
                            }
                        }
                            // 问诊小结
                        else if (msg.elems[0].content.ext == 'Diagnose.Summary.Submit') {

                            message.msgType = EnumMsgType.MSGTYPE_URL;
                            message.FileName = $translate.instant(tranlateResourcePrefix + "/FileName");
                            message.Desc = msg.elems[0].content.desc;
                            // 如果设置了url消息的点击事件，则直接处理点击事件，未设置则使用超链接方式
                            message.FileUrl = "";
                            message.Conver = "/static/images/bg-chat.jpg";
                            message.RefrenceType = msg.elems[0].content.ext;
                            message.RefrenceItem = msg.elems[0].content.data;
                        }
                        else if (msg.elems[0].content.ext === 'Survey.Question') {
                            message.msgType = EnumMsgType.MSGTYPE_SURVEY_QUESTION;
                            message.Desc = msg.elems[0].content.desc;
                            message.Answer = msg.elems[0].content.data.Answer;
                        }
                        else {
                            message.msgType = EnumMsgType.MSGTYPE_SYSTEM;
                            message.html = $sce.trustAsHtml(msg.elems[0].content.desc);
                        }
                    }
                    else if (msg.elems[0].type == "TIMFaceElem" || msg.elems[0].type == "TIMTextElem") {
                        message.msgType = EnumMsgType.MSGTYPE_TEXT
                    }
                    else if (msg.elems[0].type == "TIMImageElem") {
                        message.msgType = EnumMsgType.MSGTYPE_IMAGE
                    }
                    else if (msg.elems[0].type == "TIMFileElem") {
                        message.msgType = EnumMsgType.MSGTYPE_ATTACH;
                        message.FileSize = self.bytesToSize(msg.elems[0].content.size);
                        message.FileName = msg.elems[0].content.name;

                        if (msg.elems[0].content.uuid.length == 32) {
                            message.FileUrl = global_StoreConfig.UrlPrefix + "/Files/" + msg.elems[0].content.uuid;
                        }
                        else {
                            message.FileUrl = msg.elems[0].content.downUrl;
                        }
                    }
                    else if (msg.elems[0].type == "TIMSoundElem") {
                        message.msgType = EnumMsgType.MSGTYPE_VOICE
                        message.voicePlaying = false;
                        message.voiceUnRead = false;
                        message.voiceSize = msg.elems[0].content.size;
                        message.voiceSecond = msg.elems[0].content.second;
                        if (msg.elems[0].content.uuid.length == 32) {
                            message.voiceUrl = global_StoreConfig.UrlPrefix + "/Files/" + msg.elems[0].content.uuid;
                        }
                        else {
                            message.voiceUrl = msg.elems[0].content.downUrl;
                        }
                    }

                    //#endregion

                    return message;
                }

                //包装成实时消息
                self.messageWrapperToUIRealtimeMessage = function (msg) {
                    if (msg) {
                        msg.time = getRealtimeMessageTime.call(msg);
                        return msg;
                    }
                }

                //包装成历史记录消息
                self.messageWrapperToUILogMessage = function (msg) {

                    if (msg) {
                        msg.time = getLogMessageTime.call(msg);
                        return msg;
                    }
                }

                //滚动消息记录到最底下
                self.scrollMessageContentToBottom = function () {

                    setTimeout(function () {

                        var scrollTo = $('#chatCommentMessages').height() + $('#chatCommentMessages').scrollTop();

                        $('#chatCommentMessages').slimScroll({ scrollTo: scrollTo + 'px' });
                    }, 200)
                }

                //#region 历史记录
                self.historyLog = {};
                self.historyLog.CurrentPage = 1;//历史消息当前页码
                self.historyLog.pageSize = 15;//历史消息分页数量
                self.historyLog.totalCount = 0;//历史消息总记录数
                self.historyLog.messages = [];//历史消息列表
                self.historyLog.loading = false;//历史消息加载中
                self.historyLog.opened = false;//历史消息是否已打开
                self.historyLog.onSearch = function () {

                    if (room.ChannelID != "") {
                        //加载中
                        self.historyLog.loading = true;
                        imServices.getMessages({
                            ChannelID: room.ChannelID,
                            CurrentPage: self.historyLog.CurrentPage,
                            PageSize: self.historyLog.pageSize
                        }, function (resp) {

                            self.historyLog.loading = false;
                            //总记录数
                            self.historyLog.totalCount = resp.Total;

                            //消息列表
                            self.historyLog.messages = resp.Data.map(function (item, index) {

                                //返回聊天记录内容
                                return self.messageWrapperToUILogMessage(self.messageWrapperToUIMessage(self.messageWrapperToIMMessage(item)));
                            });


                        }, function () {
                            self.historyLog.loading = false;
                        })
                    }

                }
                self.historyLog.onOpen = function () {

                    self.historyLog.opened = !self.historyLog.opened;

                    if (self.historyLog.opened) {
                        self.historyLog.onSearch();
                    }
                }

                //#endregion

                $scope.$on("$destroy", function () {

                    onUnload();

                });

                $scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase == "$apply" || phase == "$digest") {
                        if (fn && (typeof (fn) === "function")) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };

                onInit();
            }],
            controllerAs: "chatComment",
            scope: {
                room: '=room',
                onMsg: '=onMsg',
                onUrlClick: '=onUrlClick',
                onAnswer: '=onAnswer',
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/chat-detail-comment.html';
            },
            link: function ($scope, $element, attr) {


            }

        };
    }]);

    /*消息列表*/
    app.directive('chatMessages', ["$sce", '$translate', "imServices", "$rootScope", "$filter", function ($sce, $translate, imServices, $rootScope, $filter) {

        return {
            restrict: 'EAC',
            scope: {},
            controller: function () { },
            controllerAs: "chatMessages",
            require: "^chatComment",
            link: function ($scope, $element, attr, chatComment) {

                var room = chatComment.room;

                $scope.chatComment = chatComment;




            }
        };

    }]);

    /*消息回复*/
    app.directive('chatReply', ["$sce", "$rootScope", '$translate', "imServices", function ($sce, $rootScope, $translate, imServices) {

        var lang = $translate.use();

        return {
            restrict: 'EA',
            scope: {},
            replace: false,
            transclude: false,
            require: "^chatComment",
            controller: function () { },
            controllerAs: "chatReply",
            template: function () {
                return $("#tpl-chatReply").html();
            },
            link: function ($scope, $element, attr, chatComment) {

                var room = chatComment.room;


                //回复内容
                $scope.replyContent = "";

                //是否正在发送中
                $scope.Sending = false;
                //表情窗口是否打开
                $scope.EmotionDialog = false;
                //表情包
                $scope.EmotionPicData = room.messageMgr.EmotionPicData;

                $scope.chatComment = chatComment;

                $scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase == "$apply" || phase == "$digest") {
                        if (fn && (typeof (fn) === "function")) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };
                //选中表情
                $scope.onSelectEmotionImg = function (selImg) {
                    $scope.replyContent = $scope.replyContent || "";
                    $scope.replyContent = $scope.replyContent + selImg;
                    $scope.EmotionDialog = false;

                    $(".message-input").focus();
                };
                //发送文本框按下键盘事件
                $scope.onTextareaKeyDown = function (e) {
                    e = e || window.event;

                    //Ctrl+Enter 发送 或者Shift+Enter发送
                    if ((e.shiftKey || e.ctrlKey) &&  e.keyCode == 13) {
                        $scope.onSend();
                        return false;
                    }

                    return true;
                }
                //发送消息
                $scope.onSend = function () {
                    //正在发送中则返回
                    if ($scope.Sending) {
                        return;
                    }

                    //检查是否能够发送
                    if (!room.messageMgr.checkSendMsg($scope.replyContent)) {
                        return;
                    }             


                    //关闭表情窗口
                    $scope.EmotionDialog = false;

                    //设置当前状态为正在发送中，避免重复提交
                    $scope.Sending = true;
                    //发送消息
                    room.messageMgr.sendMsg($scope.replyContent, function (msg) {

                        $scope.safeApply(function () {

                            //清楚消息发送内容
                            $scope.replyContent = "";
                            //发送已完成
                            $scope.Sending = false;
                            //添加消息到聊天记录中
                            chatComment.sendingMessages.push(msg);
                        })

                        chatComment.scrollMessageContentToBottom();

                    }, function (msg, error) {

                        $scope.safeApply(function () {


                        })

                        if (error) {
                            //发送消息失败
                            layer.msg($translate.instant("Room-msgSendFail"))
                        }


                    });
                }

                $scope.onUpload = function (params, process) {
                    // 如果当前tab不是im即时聊天，则不进行文件上传操作
                    if ($("chat-comment").hasClass("ng-hide"))
                        return;

                    // 如果当前tab不是im即时聊天，则不进行文件上传操作
                    if ($("chat-comment").hasClass("ng-hide"))
                        return;

                    //#region 函数申明
                    //申明发送消息方法
                    var SendMessage = function () {

                        //默认重新上传（如果图片没有上传成功时，用户重新发送消息则重新调用上传方法）
                        FileUpload();
                    };

                    //获取一条消息
                    var GetMessage = function (params) {
                        var user = room.memberMgr.formatUser(room.loginInfo.identifier, lang);

                        var message = {
                            avatar: user.avatar,//头像
                            author: user.nickName,//名称
                            isNewMsg: true,
                            isSend: true,
                            _msg: {
                                status: -1,
                                Send: SendMessage //通过此闭包处理消息重试
                            },
                            File: params.file,
                            FileName: params.file.name,//文件明
                            FileSize: chatComment.bytesToSize(params.file.size),//文件大小
                            FileType: params.file.type,//文件类型
                            FileUrl: "",//文件下载地址
                            FileMd5: ""

                        };

                        if (params.fileType == 'File') {
                            message.msgType = chatComment.EnumMsgType.MSGTYPE_ATTACH;
                            return message;
                        }
                        else if (params.fileType == 'Image') {
                            message.msgType = chatComment.EnumMsgType.MSGTYPE_IMAGE;
                            message.html = $sce.trustAsHtml('<img class="img-thumbnail" src="' + params.reader.result + '" />') //内容                                 

                            return message;
                        }
                        else if (params.fileType == "Audio") {
                            var url = URL.createObjectURL(params.file);
                            message.msgType = chatComment.EnumMsgType.MSGTYPE_VOICE;
                            message.voicePlaying = false;
                            message.voiceUnRead = false;//
                            message.voiceSize = params.file.size;//文件大小
                            message.voiceSecond = 0;//秒
                            message.voiceUrl = url;//地址
                            return message;
                        }
                        else if (params.fileType == "Video") {
                            message.msgType = chatComment.EnumMsgType.MSGTYPE_VIDEO;
                            return message;
                        }
                        else {
                            console.error("不支持发送此类型的消息")
                        }
                    }

                    //上传方法
                    var FileUpload = function () {

                        //上传文件
                        process(function (uploadResp) {

                            //开始发送消息
                            SendMessage(message, uploadResp);

                        }, function (resp) {
                            //上传文件失败
                            console.error(resp);

                            $scope.safeApply(function () {

                                message._msg.status = 0;
                            })

                        })
                    }


                    //#region 根据文件类型实现发送消息的方法


                    //消息默认包装
                    var IMMessageWrapperDefaultHandler = function (message, uploadResp) {
                        //上传后返回文件名称，访问路径，文件MD5
                        message.FileMd5 = uploadResp.Data.MD5;
                        message.FileUrl = uploadResp.Data.UrlPrefix + uploadResp.Data.FileName;
                        return message;
                    }

                    //什么发送处理程序
                    var IMSendHandler = imServices.sendFileMessage;

                    //实时消息包装处理程序
                    var IMMessageWrapperHandler = IMMessageWrapperDefaultHandler;

                    if (params.fileType == "Image") {
                        //调用图片发送接口
                        IMSendHandler = imServices.sendImageMessage;
                    }
                    if (params.fileType == "Video") {
                        IMSendHandler = imServices.sendVideoMessage;
                    }
                    if (params.fileType == "Audio") {

                        IMSendHandler = imServices.sendAudioMessage;
                        IMMessageWrapperHandler = function (message, uploadResp) {


                            message = IMMessageWrapperDefaultHandler(message, uploadResp);
                            //语音文件需要设置播放时长
                            message.voiceSecond = uploadResp.Data.Second;
                            return message;
                        }
                    }

                    //实现发送文件消息
                    SendMessage = function (message, uploadResp) {

                        //将上传的结果包装到当前消息上（不同的消息包装方式不一样）
                        message = IMMessageWrapperHandler(message, uploadResp);
                        message._msg.status = -1;

                        //完成上传完成之后(调用服务端接口发送文件，IM客户端不支持发送文件)
                        IMSendHandler({
                            ChannelID: room.ChannelID,
                            FileMD5: message.FileMd5
                        }, function (sendFileResp) {


                            if (sendFileResp.Data) {

                                message._msg.status = 1;
                            }
                            else {
                                message._msg.status = 0;
                            }

                        }, function (err) {

                            $scope.safeApply(function () {

                                message.status = 0;
                            })
                        })
                    }

                    //#endregion

                    //#endregion

                    //#region 写入消息记录        
                    var message = GetMessage(params);
                    $scope.safeApply(function () {

                        chatComment.sendingMessages.push(message);

                    });

                    chatComment.scrollMessageContentToBottom();


                    //#endregion

                    //开始上传文件
                    FileUpload();
                };
              
            }
        };

    }]);

    //语音消息
    app.directive("chatMsgVoice", function () {

        var playing = {};
        return {
            restrict: 'EA',
            scope: { message: "=" },
            template: function () {
                return $("#tpl-MsgVoice").html();
            },
            link: function ($scope, $element, attr) {

                $scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase == "$apply" || phase == "$digest") {
                        if (fn && (typeof (fn) === "function")) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };

                //播放语音消息
                $scope.playVoice = function (message) {

                    //有正在播放的
                    if (playing) {
                        //停止上一条语音
                        if (playing.voice) {
                            playing.voice.pause();
                        }

                        //设置上一条语音的播放状态
                        if (playing.message) {
                            playing.message.voicePlaying = false;
                        }
                    }

                    playing.message = message
                    playing.voice = new Audio(message.voiceUrl);
                    playing.voice.loop = false;
                    playing.voice.addEventListener('ended', function () {

                        $scope.safeApply(function () {
                            message.voicePlaying = false;
                            playing = {};
                        })

                    }, false);
                    playing.voice.play();
                    message.voicePlaying = true;
                }

            }
        };
    })

    //图片消息
    app.directive("chatMsgImage", ["preview", function (preview) {

        window.imageClick = function () { }

        return {
            restrict: 'EA',
            scope: { message: "=" },
            require: "^chatComment",
            template: function () {
                return $("#tpl-MsgImage").html();
            },
            link: function ($scope, $element, attr, chatComment) {

                //预览图片
                $scope.previewPicture = function (message) {

                    var current = 0;

                    //找出所有图片消息
                    var imageList = chatComment.messages.filter(function (item) {

                        return item.msgType == "MSGTYPE_IMAGE";

                    }).map(function (item, index) {

                        //设置当前显示的消息
                        if (message._msg.seq == item._msg.seq) {
                            current = index;
                        }

                        if (item._msg && item._msg.elems && item._msg.elems.length && item._msg.elems.length > 0) {
                            return item._msg.elems[0].content.ImageInfoArray[0];
                        }
                        else {
                            return {
                                url: item.FileUrl
                            };
                        }
                    })

                    //打开预览窗口
                    preview.open({
                        imageList: imageList,
                        current: current////显示大图
                    });

                }

            }
        };
    }])

    //文字消息
    app.directive("chatMsgText", function () {

        return {
            restrict: 'EA',
            scope: { message: "=" },
            template: function () {
                return $("#tpl-MsgText").html();
            },
            link: function ($scope, $element, attr) {
                //替换链接
                var html = $scope.message.html.toString();
                if ('MSGTYPE_TEXT' == $scope.message.msgType) {
                    var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ig;
                    html = html.replace(reg, '<a href="$&" target="_blank">$&</a>');
                }
                $element.find('.js_message_plain').html(html);
            }
        };
    })

    //链接消息
    app.directive("chatMsgUrl", function () {

        return {
            restrict: 'EA',
            scope: {
                message: "=",
                onUrlClick: "=onUrlClick"
            },
            template: function () {
                return $("#tpl-MsgUrl").html();
            },
            link: function ($scope, $element, attr) {
                $scope.urlClick = function (message) {

                    if ($scope.onUrlClick != null)
                        $scope.onUrlClick(message);
                };
            }
        };
    })

    //调查问卷
    app.directive("chatMsgQuestion", function () {

        return {
            restrict: 'EA',
            scope: {
                message: "=",
                onAnswer: '=onAnswer',
                disable: "=disable",
            },
            template: function () {
                return $("#tpl-MsgQuestion").html();
            },
            link: function ($scope, $element, attr) {
                $scope.answerClick = function (answer) {
                    if (typeof ($scope.onAnswer) === "function") {
                        $scope.onAnswer(answer, $scope.message);
                    }
                };
            }
        };
    })

    //附件消息
    app.directive("chatMsgAttach", function () {

        return {
            restrict: 'EA',
            scope: { message: "=" },
            template: function () {
                return $("#tpl-MsgAttach").html();
            },
            link: function ($scope, $element, attr) {


            }
        };
    })


    //消息
    app.directive("chatMsg", function () {

        return {
            restrict: 'EA',
            scope: {
                message: "=",
                onAnswer: '=onAnswer',
                onUrlClick: '=onUrlClick',
            },
            require: "^chatComment",
            template: function () {
                return $("#tpl-Msg").html();
            },
            link: function ($scope, $element, attr, chatComment) {
                $scope.chatComment = chatComment;
            }
        };
    })
});