"use strict";
define(["module-services-eventBus",
        "plugins-sdk-webim",
        "plugins-sdk-webim-tls",
        "module-services-chatroom-videoMgr.Agora",
        "module-services-apiUtil",
        "plugins-layer"], function (eventBus, webim, TLSHelper, videoMgr, apiUtil) {

            console.log("load chatroom.js");


            //定义聊天室相关类
            var module = (function (window, webim, TLSHelper) {

                //枚举会话类型
                var SessionType = { //聊天类型，C2C : 私聊，GROUP：群聊
                    'C2C': 'C2C',
                    'GROUP': 'GROUP'
                };

                //腾讯登录服务错误码（用于托管模式）
                var TlsErrorCode = {
                    'OK': 0,//功成
                    'SIGNATURE_EXPIRATION': 11//用户身份凭证过期
                };

                //最大能发送消息长度
                var MaxMsgLen = {//消息最大长度（字节），
                    'C2C': 12000,//私聊消息
                    'GROUP': 8898//群聊
                };

                //图片业务类型
                var UploadPicBussinessType = {
                    'GROUP_MSG': 1,//私聊图片
                    'C2C_MSG': 2,//群聊图片
                    'USER_HEAD': 3,//用户头像
                    'GROUP_HEAD': 4//群头像
                };

                //会话
                var session = (function () {
                    function session(selType, selToID) {
                        this.selType = selType || SessionType.GROUP;//当前聊天类型
                        this.selToID = selToID || null;//当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
                        this.selSess = ensureSession(this.selType, this.selToID);//当前聊天会话

                    }

                    /*
                     * 确保会话存在
                     */
                    var ensureSession = function (selType, selToID) {


                        if (selToID != null && selType != null && selToID != "" && selType != "") {


                            if (webim.MsgStore.sessCount() > 0) {

                                var sessMap = webim.MsgStore.sessMap();

                                for (var i in sessMap) {

                                    var sess = sessMap[i];

                                    if (selToID == sess.id()) {

                                        return sess;

                                        break;
                                    }

                                }
                            }


                            //创建会话
                            var session = new webim.Session(
                                selType,
                                selToID,
                                selToID,
                                "1.jpg",
                                Math.round(new Date().getTime() / 1000));

                            return session;
                        }
                        else {
                            return null;
                        }
                    }

                    return session;

                })();

                //当前用户身份
                var loginInfo = (function () {

                    function loginInfo(config) {
                        this.copy(config);
                        this.headurl = 'img/2016.gif'//当前用户默认头像
                    }

                    loginInfo.prototype.copy = function (config) {

                        this.sdkAppID = config.sdkAppID;//用户所属应用id
                        this.appIDAt3rd = config.sdkAppID;//用户所属应用id
                        this.accountType = config.accountType;//用户所属应用帐号类型
                        this.identifier = config.identifier;//当前用户ID
                        this.userSig = config.userSig;//当前用户身份凭证
                    }

                    return loginInfo;

                })();

                //消息管理,依赖session,loginInfo,
                var messageMgr = (function () {

                    //当前消息总数
                    var _curMsgCount = 0;

                    //普通消息
                    function Message(session, msgContent) {

                        //创建等待发送的消息
                        var msg = new webim.Msg(session.selSess, true);

                        var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
                        //解析文本和表情
                        var expr = /\[[^[\]]{1,3}\]/mg;
                        var emotions = msgContent.match(expr);
                        if (!emotions || emotions.length < 1) {
                            text_obj = new webim.Msg.Elem.Text(msgContent);
                            msg.addText(text_obj);
                        } else {
                            for (var i = 0; i < emotions.length; i++) {
                                tmsg = msgContent.substring(0, msgContent.indexOf(emotions[i]));
                                if (tmsg) {
                                    text_obj = new webim.Msg.Elem.Text(tmsg);
                                    msg.addText(text_obj);
                                }
                                emotionIndex = webim.EmotionDataIndexs[emotions[i]];
                                emotion = webim.Emotions[emotionIndex];

                                if (emotion) {
                                    face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
                                    msg.addFace(face_obj);
                                } else {
                                    text_obj = new webim.Msg.Elem.Text(emotions[i]);
                                    msg.addText(text_obj);
                                }
                                restMsgIndex = msgContent.indexOf(emotions[i]) + emotions[i].length;
                                msgContent = msgContent.substring(restMsgIndex);
                            }
                            if (msgContent) {
                                text_obj = new webim.Msg.Elem.Text(msgContent);
                                msg.addText(text_obj);
                            }
                        }

                        return msg;

                    }

                    //发送图片消息
                    function MessagePic(session, images) {
                        var msg = new webim.Msg(session.selSess, true);

                        var images_obj = new webim.Msg.Elem.Images(images.File_UUID);

                        for (var i in images.URL_INFO) {
                            var img = images.URL_INFO[i];
                            var newImg;
                            var type;
                            switch (img.PIC_TYPE) {
                                case 1://原图
                                    type = 1;//原图
                                    break;
                                case 2://小图（缩略图）
                                    type = 3;//小图
                                    break;
                                case 4://大图
                                    type = 2;//大图
                                    break;
                            }
                            newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width, img.PIC_Height, img.DownUrl);
                            images_obj.addImage(newImg);
                        }
                        msg.addImage(images_obj);

                        return msg;
                    }

                    //自定义消息
                    function MessageCust(session, data, desc, ext) {
                        var msg = new webim.Msg(session.selSess, true);
                        var custom_obj = new webim.Msg.Elem.Custom(data, desc, ext);
                        msg.addCustom(custom_obj);

                        return msg;
                    }


                    function messageMgr(session, loginInfo) {
                        this.session = session;
                        this.loginInfo = loginInfo;

                    }

                    messageMgr.prototype.reset = function () {
                        _curMsgCount = 0;
                    }

                    messageMgr.prototype.increment = function () {
                        _curMsgCount++;
                    }

                    messageMgr.prototype.msgCount = function () {
                        return _curMsgCount;
                    }




                    //确保会话存在
                    messageMgr.prototype.ensureSession = function () {
                        //如果还没有创建会话则创建
                        if (!this.session.selSess) {
                            //创建会话
                            this.session.selSess = new webim.Session(
                                this.session.selType,
                                this.session.selToID,
                                this.session.selToID,
                                "1.jpg",
                                Math.round(new Date().getTime() / 1000));
                        }

                        //未加入群组则提示
                        if (!this.session.selToID) {
                            return false
                        }
                        else {

                            return true
                        }
                    }

                    /*
                     * 检查发送
                     */
                    messageMgr.prototype.checkSendMsg = function (send_msg_text) {

                        send_msg_text = send_msg_text || "";

                        var msgLen = webim.Tool.getStrBytes(send_msg_text);

                        //消息内容长度是否为空
                        if (send_msg_text.length < 1) {
                            layer.msg("发送的消息不能为空");
                            return false;
                        }

                        var maxLen, errInfo;

                        //根据不同的业务类型检查允许发送的消息长度
                        if (this.session.selType == SessionType.C2C) {
                            maxLen = MaxMsgLen.C2C;
                            errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";

                        }
                        else {
                            maxLen = MaxMsgLen.GROUP;
                            errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
                        }

                        //如果当前消息长度超过最大长度提示错误
                        if (msgLen > maxLen) {
                            layer.msg(errInfo);
                            return false;
                        }

                        return true;

                    }

                    /*
                     * 发送消息（文字、表情）
                     */
                    messageMgr.prototype.sendMsg = function (send_msg_text, sendAfterCallback, sendCompletedCallback) {
                        var self = this;

                        //确保会话存在
                        if (!this.ensureSession()) {
                            return;
                        }
                        //创建消息
                        var msg = new Message(this.session, send_msg_text);

                        msg.status = -1;

                        sendAfterCallback(msg)

                        //发送
                        webim.sendMsg(msg, function () {
                            msg.status = 1;
                            sendCompletedCallback(msg)

                        }, function (err) {
                            msg.status = 0;
                            sendCompletedCallback(msg, err)
                        });
                    }

                    /*
                     * 发送消息（重试）
                     */
                    messageMgr.prototype.resendMsg = function (msg, sendAfterCallback, sendCompletedCallback) {

                        //确保会话存在
                        if (!this.ensureSession()) {
                            return;
                        }

                        //设置消息状态（发送中）
                        msg.status = -1;

                        //立刻回调
                        sendAfterCallback(msg)

                        //发送
                        webim.sendMsg(msg, function () {
                            msg.status = 1;

                            sendCompletedCallback(msg)

                        }, function (err) {
                            msg.status = 0;
                            sendCompletedCallback(msg, err)
                        });
                    }

                    /*
                     * 发送图片消息
                     */
                    messageMgr.prototype.sendPicMsg = function (ele, onProgressCallBack, sendAfterCallback, sendCompletedCallback) {
                        var self = this;
                        self.session.selToID = self.session.selToID + "";
                        self.loginInfo.identifier = self.loginInfo.identifier + "";

                        //确保会话存在
                        if (!self.ensureSession()) {
                            return;
                        }

                        var uploadFiles = document.getElementById(ele);
                        var file = uploadFiles.files[0];
                        var businessType  //业务类型，1-发群图片，2-向好友发图片;

                        if (self.session.selType == SessionType.C2C) {
                            //向好友发图片
                            businessType = UploadPicBussinessType.C2C_MSG;
                        }
                        else if (self.session.selType == SessionType.GROUP) {
                            //发群图片
                            businessType = UploadPicBussinessType.GROUP_MSG;
                        }

                        //封装上传图片请求
                        var opt = {
                            'file': file, //图片对象
                            'onProgressCallBack': onProgressCallBack,
                            //'abortButton': document.getElementById('upd_abort'), //停止上传图片按钮
                            'From_Account': self.loginInfo.identifier + "", //发送者帐号
                            'To_Account': self.session.selToID + "", //接收者
                            'businessType': businessType//业务类型
                        };


                        //上传图片
                        webim.uploadPic(opt, function (resp) {
                            //创建消息
                            var msg = new MessagePic(self.session, resp);

                            msg.status = -1;

                            sendAfterCallback(msg);

                            //发送
                            webim.sendMsg(msg, function () {

                                msg.status = 1;
                                sendCompletedCallback(msg)

                            }, function (err) {
                                msg.status = 0;
                                sendCompletedCallback(msg, err)
                            });

                        },
                        function (err) {
                            layer.msg(err.ErrorInfo);
                        });
                    }

                    /*
                          * 发送图片消息
                          */
                    messageMgr.prototype.sendFileMsg = function (ele, onProgressCallBack, sendAfterCallback, sendCompletedCallback) {
                        var self = this;
                        self.session.selToID = self.session.selToID + "";
                        self.loginInfo.identifier = self.loginInfo.identifier + "";

                        //确保会话存在
                        if (!self.ensureSession()) {
                            return;
                        }

                        var uploadFiles = document.getElementById(ele);
                        var file = uploadFiles.files[0];
                        var businessType  //业务类型，1-发群图片，2-向好友发图片;

                        if (self.session.selType == SessionType.C2C) {
                            //向好友发图片
                            businessType = UploadPicBussinessType.C2C_MSG;
                        }
                        else if (self.session.selType == SessionType.GROUP) {
                            //发群图片
                            businessType = UploadPicBussinessType.GROUP_MSG;
                        }

                        //封装上传图片请求
                        var opt = {
                            'file': file, //图片对象
                            'onProgressCallBack': onProgressCallBack,
                            //'abortButton': document.getElementById('upd_abort'), //停止上传图片按钮
                            'From_Account': self.loginInfo.identifier + "", //发送者帐号
                            'To_Account': self.session.selToID + "", //接收者
                            'businessType': businessType//业务类型
                        };


                        //上传图片
                        webim.uploadPic(opt, function (resp) {
                            //创建消息
                            var msg = new MessagePic(self.session, resp);

                            msg.status = -1;

                            sendAfterCallback(msg);

                            //发送
                            webim.sendMsg(msg, function () {

                                msg.status = 1;
                                sendCompletedCallback(msg)

                            }, function (err) {
                                msg.status = 0;
                                sendCompletedCallback(msg, err)
                            });

                        },
                        function (err) {
                            layer.msg(err.ErrorInfo);
                        });
                    }


                    //发送自定义消息
                    messageMgr.prototype.sendCustomMsg = function (msgObj, okFn, errFn) {

                        var self = this;

                        //确保会话存在
                        if (!this.ensureSession()) {
                            return;
                        }
                        //创建自定义消息对象
                        var msg = new MessageCust(self.session, msgObj.data, msgObj.desc, msgObj.ext);

                        //发送消息
                        webim.sendMsg(msg, function () {
                            if (okFn)
                                okFn(msg)

                        }, function () {
                            if (errFn)
                                errFn(msg)
                        });
                    }


                    return messageMgr;

                })();

                //群组管理,依赖session,loginInfo,
                var groupMgr = (function () {

                    function groupMgr(session, loginInfo) {
                        this.session = session;
                        this.loginInfo = loginInfo;
                        this.GroupsInfo = {};


                    }

                    /*
                     * 读取群组基本资料-高级接口
                     * 作者：郭明
                       日期：2016年5月25日
                       params:
                     * @group_id 群组编号
                     * @cbok 调用成功回调函数
                     * @cbErr 调用失败回调函数
                     */
                    groupMgr.prototype.getGroupInfo = function (group_id, cbOK, cbErr) {

                        var options = {
                            'GroupIdList': [
                                group_id
                            ],
                            'GroupBaseInfoFilter': [
                                'Type',
                                'Name',
                                'Introduction',
                                'Notification',
                                'FaceUrl',
                                'CreateTime',
                                'Owner_Account',
                                'LastInfoTime',
                                'LastMsgTime',
                                'NextMsgSeq',
                                'MemberNum',
                                'MaxMemberNum',
                                'ApplyJoinOption'
                            ],
                            'MemberInfoFilter': [
                                'Account',
                                'Role',
                                'JoinTime',
                                'LastSendMsgTime',
                                'ShutUpUntil',
                                "NameCard"
                            ]
                        };
                        webim.getGroupInfo(
                                options,
                                function (resp) {
                                    if (cbOK) {
                                        cbOK(resp);
                                    }
                                },
                                function (err) {
                                    layer.msg(err.ErrorInfo);
                                }
                        );
                    };

                    /*
                     * 获取成员列表  
                       作者：郭明
                       日期：2016年5月25日
                       params:
                       group_id 群组编号
                       okFunCallBack - function()类型, 成功时回调函数
                       failFunCallBack - function(err)类型, 失败时回调函数, err 为错误对象
                     */
                    groupMgr.prototype.getGroupMemberInfo = function (group_id, okFunCallBack, failFunCallBack) {
                        var options = {
                            'GroupId': group_id,
                            'Offset': 0, //必须从0开始
                            'Limit': 50000,
                            'MemberInfoFilter': [
                                'Account',
                                'Role',
                                'JoinTime',
                                'LastSendMsgTime',
                                'ShutUpUntil'
                            ]
                        };

                        webim.getGroupMemberInfo(
                                options,
                                function (resp) {
                                    if (resp.MemberNum <= 0) {

                                        if (okFunCallBack)
                                            okFunCallBack([]);
                                        return;
                                    }

                                    var data = [];
                                    for (var i = 0; i < resp.MemberList.length; i++) {
                                        var account = resp.MemberList[i].Member_Account;
                                        var role = webim.Tool.groupRoleEn2Ch(resp.MemberList[i].Role);
                                        var join_time = webim.Tool.formatTimeStamp(resp.MemberList[i].JoinTime);
                                        var shut_up_until = webim.Tool.formatTimeStamp(resp.MemberList[i].ShutUpUntil);
                                        if (shut_up_until == 0) {
                                            shut_up_until = '-';
                                        }
                                        data.push({
                                            GroupId: group_id,
                                            Member_Account: account,
                                            Role: role,
                                            JoinTime: join_time,
                                            ShutUpUntil: shut_up_until
                                        });
                                    }

                                    if (okFunCallBack)
                                        okFunCallBack(data)
                                },
                                function (err) {
                                    console.error(err);

                                    if (failFunCallBack)
                                        failFunCallBack(err)
                                }
                        );
                    };

                    /*
                       创建群
                       作者：郭明
                       日期：2016年5月25日
                       params:
                       member_list 初始成员列表
                       okFunCallBack - function()类型, 成功时回调函数
                       failFunCallBack - function(err)类型, 失败时回调函数, err 为错误对象
                     */
                    groupMgr.prototype.createGroup = function (options, okFunCallBack, failFunCallBack) {

                        var self = this;

                        //创建组
                        webim.createGroup(options, function (resp) {

                            console.log("创建组成功，组编号:" + resp.GroupId);

                            //设置当前会话编号（群编号）
                            self.session.selToID = resp.GroupId

                            if (okFunCallBack) {
                                okFunCallBack(resp.GroupId)
                            }

                        },
                        function (err) {
                            console.error(err)

                            if (failFunCallBack)
                                failFunCallBack(err)
                        });
                    }


                    /* 
                    * 解散群
                    * params:
                    * options - 请求参数，详见 api 文档
                    * okFunCallBack - function()类型, 成功时回调函数
                    * failFunCallBack - function(err)类型, 失败时回调函数, err 为错误对象
                    * return:(无)
                    */
                    groupMgr.prototype.destroyGroup = function (group_id, okFunCallBack, failFunCallBack) {

                        if (group_id == null) {
                            console.error("解散群时，群组 ID 非法");
                            return;
                        }

                        var options = { 'GroupId': group_id };

                        webim.destroyGroup(options, function (resp) {

                            if (okFunCallBack)
                                okFunCallBack(group_id);
                        },
                        function (err) {
                            console.err(err);

                            if (failFunCallBack)
                                failFunCallBack(err);
                        }
                        );
                    };

                    //加入群组
                    groupMgr.prototype.applyJoinGroup = function (GroupId, ApplyMsg, okCallBack, failCallBack) {


                        var options = {
                            'GroupId': GroupId,
                            'ApplyMsg': ApplyMsg || "",
                            'UserDefinedField': ''
                        };

                        webim.applyJoinGroup(options, function (resp) {

                            if (okCallBack) {
                                okCallBack(resp);
                            }

                        }, function (err) {
                            if (failCallBack)
                                failCallBack(err);


                        });
                    }

                    //获取我已经加入的群组
                    groupMgr.prototype.getJoinedGroupListHigh = function (cbOK, cbErr) {

                        var self = this;
                        var totalCount = 5000;

                        var options = {
                            'Member_Account': self.loginInfo.identifier,
                            'Limit': totalCount,
                            'Offset': 0,
                            //'GroupType':'',
                            'GroupBaseInfoFilter': [
                                'Type',
                                'Name',
                                'Introduction',
                                'Notification',
                                'FaceUrl',
                                'CreateTime',
                                'Owner_Account',
                                'LastInfoTime',
                                'LastMsgTime',
                                'NextMsgSeq',
                                'MemberNum',
                                'MaxMemberNum',
                                'ApplyJoinOption'
                            ],
                            'SelfInfoFilter': [
                                'Role',
                                'JoinTime',
                                'MsgFlag',
                                'UnreadMsgNum'
                            ]
                        };

                        webim.getJoinedGroupListHigh(options, function (resp) {

                            if (cbOK) {
                                cbOK(resp, SessionType);
                            }

                        },
                        function (err) {

                            layer.msg(err.ErrorInfo);

                        });

                    };

                    //删除群组成员
                    groupMgr.prototype.deleteGroupMember = function (group_id, account_id, okCallBack, failCallBack) {

                        var options = {
                            'GroupId': group_id,
                            //'Silence': $('input[name="dgm_silence_radio"]:checked').val(),//只有ROOT用户采用权限设置该字段（是否静默移除）
                            'MemberToDel_Account': [account_id]
                        };

                        webim.deleteGroupMember(options, function (resp) {
                            if (okCallBack)
                                okCallBack()
                        },
                        function (err) {
                            failCallBack(err)
                        });
                    };


                    //邀请好友加群
                    groupMgr.prototype.addGroupMember = function (group_id, accountIds, okCallBack, failCallBack) {

                        var MemberList = [];

                        for (var i = 0; i < accountIds.length; i++) {
                            MemberList.push({
                                'Member_Account': accountIds[i]
                            });
                        }

                        var options = {
                            'GroupId': group_id,
                            'MemberList': MemberList
                        };

                        webim.addGroupMember(options, function (resp) {

                            if (okCallBack)
                                okCallBack();
                        },
                        function (err) {

                            if (failCallBack)
                                failCallBack(err);
                        });
                    };


                    //获取用户信息
                    groupMgr.prototype.getGroupUsersInfo = function (groupId, okCallBack, failCallBack) {
                    
                        var self = this;
                        var ids = [];

                        if (!self.GroupsInfo[groupId]) {
                            if (failCallBack) {
                                failCallBack([]);
                            }
                        }                  

                        //从服务端加载用户的资料，然后写入本地
                        apiUtil.requestWebApi("/IM/Users", "POST", { ChannelID: groupId, Identifiers: [] }, function (resp) {
                            if (!self.GroupsInfo[groupId])
                                self.GroupsInfo[groupId] = {};

                            self.GroupsInfo[groupId].UsersInfo = resp.Data;
                            self.GroupsInfo[groupId].UserIdentifiers = resp.Data.map(function (item) {
                                return item.identifier;
                            });

                            if (okCallBack) {
                                okCallBack(resp.Data);
                            }
                        }, function () {

                            if (failCallBack) {
                                failCallBack([]);
                            }

                        })
                        
                    }


                    return groupMgr;

                })();

                //成员管理
                var memberMgr = (function () {

                    function memberMgr(session, groupMgr) {
                        this.session = session;
                        this.groupMgr = groupMgr;
                    }

                    //格式化昵称
                    memberMgr.prototype.formatUser = function (identifier, lang) {
                  
                        var self = this;
                        var groupId = self.session.selToID;
                        var defaultAvator = "/static/images/unknow.png";

                        if (self.groupMgr.GroupsInfo[groupId]) {

                            if (self.groupMgr.GroupsInfo[groupId].UsersInfo) {
                                var user = self.groupMgr.GroupsInfo[groupId].UsersInfo.filter(function (user) {

                                    return user.identifier == identifier;

                                })[0];

                                if (user) {
                                    return { nickName: lang == 'zh-cn' ? user.UserCNName : user.UserENName, avatar: user.PhotoUrl || defaultAvator };
                                }
                            }

                        }
                        return { nickName: "-", avatar: defaultAvator, status: "在线" };;
                    };

                    return memberMgr;

                })()
                /*
                    聊天室
                    作者：郭明
                    日期：2016年5月23日
                 */
                var imMgr = (function () {

                    /*
                      初始化配置
                      params:
                      config - {sdkAppID:'应用ID',accountType:'账号类型',callBackUrl:'TLS登录成功回调地址'}
                    */
                    function imMgr(onInitCompleted) {
                        var self = this;

                        self.onInitCompleted = onInitCompleted || function () { };

                        //设置SDK编号，回调地址，账户类型
                        self.config = {};

                        //登录信息
                        self.loginInfo = new loginInfo(self.config);

                        //会话
                        self.session = new session();

                        //事件监听
                        self.listeners = {
                            "onGroupSystemNotifys": groupSystemNotifys.call(self),
                            "onGroupInfoChangeNotify": function () { onGroupInfoChangeNotify.call(self) },
                            "onConnNotify": function (resp) { onConnNotify.call(self, resp) },//监听连接状态回调变化事件,必填
                            "onMsgNotify": function (newMsg) { onMsgNotify.call(self, newMsg) },//监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
                            "jsonpCallback": function () { jsonpCallback.call(self) },
                            "onKickedEventCall": function () { onKickedEventCall.call(self) }//被其他登录实例踢下线
                        };

                        self.ServiceType = -1;
                        self.ServiceID = "";
                        self.ChannelID = "";

                        //群组管理
                        self.groupMgr = new groupMgr(self.session, self.loginInfo);

                        //成员管理
                        self.memberMgr = new memberMgr(self.session, self.groupMgr);

                        //消息管理
                        self.messageMgr = new messageMgr(self.session, self.loginInfo);

                        
                        //视频组件
                        self.videoMgr = new videoMgr(self.loginInfo);

                        window.loginInfo = self.loginInfo;

                        //注册全局,SDK需要
                        window.tlsGetUserSig = function (res) {

                            //成功拿到凭证
                            if (res.ErrorCode == TlsErrorCode.OK) {


                                //从当前 URL 中获取参数为 identifier 的值
                                self.loginInfo.identifier = TLSHelper.getQuery("identifier");
                                //拿到正式身份凭证
                                self.loginInfo.userSig = res.UserSig;
                                //从当前 URL 中获取参数为 sdkappid 的值
                                self.loginInfo.sdkAppID = self.loginInfo.appIDAt3rd = Number(TLSHelper.getQuery("sdkappid"));


                                //初始化房间
                                self.onInit();

                            }
                            else {
                                //签名过期，需要重新登录
                                if (res.ErrorCode == TlsErrorCode.SIGNATURE_EXPIRATION) {
                                    window.tlsLogin();
                                }
                                else {
                                    layer.msg("[" + res.ErrorCode + "]" + res.ErrorInfo);
                                }
                            }
                        }

                        //注册成全局
                        window.tlsLogin = function () {
                            //跳转到TLS登录页面
                            TLSHelper.goLogin({
                                sdkappid: self.loginInfo.sdkAppID,
                                acctype: self.loginInfo.accountType,
                                url: self.config.callBackUrl
                            });
                        }



                        //表情
                        self.messageMgr.EmotionPicData = webim.EmotionPicData;

                        return this;
                    }



                    imMgr.prototype.setup = function (config, onInitCompleted) {

                     
                        var self = this;

                        self.onInitCompleted = onInitCompleted || self.onInitCompleted;

                        self.config = config;

                        //设置SDK编号，回调地址，账户类型
                        self.loginInfo.copy(self.config);

                        
                        //使用独立身份验证模式
                        if (this.loginInfo.identifier != "" && this.loginInfo.userSig != "") {
                            //初始化房间
                            self.onInit();
                        }
                            //使用托管身份验证模式
                        else {
                            //判断是否已经拿到临时身份凭证
                            if (TLSHelper.getQuery('tmpsig')) {
                                if (this.loginInfo == null || this.loginInfo.identifier == null) {
                                    console.info('start fetchUserSig');

                                    //获取正式身份凭证，成功后会回调tlsGetUserSig(res)函数
                                    TLSHelper.fetchUserSig();
                                }
                            }
                            else {

                                if (!this.config.callBackUrl) {
                                    layer.msg('callBackUrl非法，请在index.html中将其修改为您的网站首页地址!');
                                    return;
                                }

                                window.tlsLogin();

                            }
                        }
                    }

                    /*
                        退出聊天室
                        作者：郭明
                        日期：2016年5月23日
                     */
                    imMgr.prototype.Quit = function () {

                        var self = this;
                        //退出视频
                        self.videoMgr.Quit();
                     
                        self.session.selToID = "";
                        self.ServiceID = "";
                        self.ServiceType = -1;
                        self.ChannelID = "";
                    }

                    /*
                        初始化事件
                        作者：郭明
                        日期：2016年5月23日
                     */
                    imMgr.prototype.onInit = function () {

                        var self = this;


                        //websdk 初始化
                        webim.init(self.loginInfo, self.listeners, groupSystemNotifys.call(self), function (resp) {

                            self.onInitCompleted.call(self);

                            eventBus.dispatch("im-init", {
                                config: self.config,
                                im: self
                            });

                        }, function (err) {

                            layer(err.ErrorInfo);
                        });


                    }

                    //恢复会话（处理历史会话）
                    imMgr.prototype.restoreSession = function (selToID, selType) {
                        //特别要注意的是，此处会实例化一个会话，如果直接给当前会话赋值会存在引用问题
                        var newsession = new session(selType, selToID);

                        //设置之前会话的已读消息标记
                        webim.setAutoRead(newsession.selSess, false, false);
                    }

                    //切换会话
                    imMgr.prototype.toggleSession = function (selToID, selType, options, cbOK) {
                                                
                        selToID = selToID + "";

                        var self = this;

                        //没有指定频道，无效请求
                        if (selToID == "") {
                            return;
                        }

                        //重复的请求                        
                        if (self.session.selToID == selToID) {
                            return;
                        }

                        try
                        {
                            if (self.session.selToID && self.session.selToID != "" && self.session.selToID != undefined) {
                                //设置之前会话的已读消息标记
                                webim.setAutoRead(self.session.selSess, false, false);
                            }
                        }
                        catch (e)
                        {
                            console.error(e);
                        }


                        var delayFn = function () {

                            //特别要注意的是，此处会实例化一个会话，如果直接给当前会话赋值会存在引用问题
                            var newsession = new session(selType, selToID);
                            self.session.selType = newsession.selType;
                            self.session.selToID = newsession.selToID;
                            self.session.selSess = newsession.selSess;
                            //2016年7月8日 增加，多个会话直接切换时需要重新设置当前消息的总数。不然会导致新的会话收不到消息
                            self.messageMgr.reset();
                            //设置之前会话的已读消息标记
                            webim.setAutoRead(self.session.selSess, true, true);

                            if (SessionType.C2C == selType)
                            {
                                if (cbOK) {
                                    cbOK();
                                }
                            }
                            else
                            {
                                if (!self.groupMgr.GroupsInfo[selToID]) {
                                    self.groupMgr.GroupsInfo[selToID] = {};
                                }
                                //更新未读消息数量
                                self.groupMgr.GroupsInfo[selToID].UnreadMsgNum = 0;
                                //当前会话未读消息为0
                                self.onUnreadMsgCountChanged(self.session.selType, selToID, 0);

                                eventBus.dispatch("room-changed", self.groupMgr.GroupsInfo[selToID]);

                                if (cbOK) {
                                    cbOK();
                                }

                            }
                        }

                        if (SessionType.C2C == selType) {
                            delayFn();
                        }
                        else
                        {
                            
                            //如果群组信息不存在则获取
                            if (!self.groupMgr.GroupsInfo[selToID] || !self.groupMgr.GroupsInfo[selToID].MemberList) {

                                //获取群信息
                                self.groupMgr.getGroupInfo(selToID, function (resp) {

                                    //拉取最新消息
                                    var opts = {
                                        'GroupId': selToID,
                                        'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1,
                                        'ReqMsgNumber': 1000
                                    };

                                    if (resp.GroupInfo[0].MemberList) {
                                        //群组信息
                                        self.groupMgr.GroupsInfo[selToID] = resp.GroupInfo[0];
                                    }

                                    //增加延迟很重要
                                    setTimeout(delayFn, 200);
                                });
                            }
                            else
                            {
                                //增加延迟很重要
                                setTimeout(delayFn, 200);
                            }
                        }

                    }

                    //获取历史记录
                    imMgr.prototype.syncMessage = function () {
                        var self = this;
                        var groupInfo = self.groupMgr.GroupsInfo[self.ChannelID];
                        var sess = new session(SessionType.GROUP, self.ChannelID);
                        var msgCount = sess.selSess.msgCount();

                        if (msgCount <= 0) {
                            //拉取最新消息
                            var opts = {
                                'GroupId': self.ChannelID,
                                'ReqMsgSeq': groupInfo.NextMsgSeq - 1,
                                'ReqMsgNumber': 1000
                            };

                            if (opts.ReqMsgSeq == null || opts.ReqMsgSeq == undefined) {
                                layer.msg('群消息序列号非法');
                                return;
                            }

                            webim.syncGroupMsgs(opts, function () {
                                syncMsgsCallbackOK.call(self)
                            });
                        }
                        else
                        {
                            syncMsgsCallbackOK.call(self)
                        }
                    }

               

                    /*
                     * 新消息
                     */
                    imMgr.prototype.onNewMsg = function (msg, isNewMsg) {

                        //触发im-new-c2c-extmsg
                        if (msg.elems[0].type == "TIMCustomElem") {

                            var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/

                            if (msg.elems[0].content &&
                                msg.elems[0].content.data &&
                                msg.elems[0].content.data != "") {
                                var data = msg.elems[0].content.data;
                                var ext = msg.elems[0].content.ext;
                                var desc = msg.elems[0].content.desc;

                                var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

                                if (typeof (data) == "string") {
                                    if (rbrace.test(data)) {

                                        //自定义消息中的内容是JSON
                                        data = msg.elems[0].content.data = $.parseJSON(data);
                                    }
                                }

                                eventBus.dispatch("im-new-c2c-extmsg", {
                                    ext: ext,
                                    data: data,
                                    desc: desc,
                                    newMsg: isNewMsg
                                });
                            }
                            else {
                                console.warn(msg);
                            }



                        }

                        eventBus.dispatch("im-new-c2c-msg", { msg: msg, isNewMsg: isNewMsg });
                    }

                    /*
                     * 新系统消息
                     */
                    imMgr.prototype.onNewGroupSystemMsg = function (msg) {

                        eventBus.dispatch("im-new-group-msg", { msg: msg });
                    }

                    /*
                     * 未读消息发送变化时
                     * params:
                     * @sessionType 会话类型
                     * @sessionId 会话唯一标识
                     * @unreadcount 未读消息数量
                     */
                    imMgr.prototype.onUnreadMsgCountChanged = function (sessionType, sessionId, unreadCount) {

                        eventBus.dispatch("im-unread-msg", { sessionType: sessionType, sessionId: sessionId, unreadCount: unreadCount });
                    }

                    imMgr.prototype.onJoinedGroupListChanged = function () { }

                    //监听新消息(私聊，群聊，群提示消息)事件
                    var onMsgNotify = function (newMsgList) {

                        var self = this;

                        for (var k = 0; k < newMsgList.length; k++) {
                            var newMsg = newMsgList[k];


                            for (var j = 0; j < newMsg.length; j++) {
                                if (newMsg[j].sess) {
                                    //恢复会话，例如刷新页面后。会话是没得的这时候收到可能导致收不到消息
                                    self.restoreSession(newMsg[j].sess.id(), newMsg[j].sess.type())

                                } else if (newMsg[j].msg.sess) {
                                    //恢复会话，例如刷新页面后。会话是没得的这时候收到可能导致收不到消息
                                    self.restoreSession(newMsg[j].msg.sess.id(), newMsg[j].msg.sess.type())

                                }
                            }


                            var sess = newMsg.getSession();

                            //处于当前聊天界面
                            if (self.session.selToID == sess.id()) {


                                self.session.selSess = sess;
                                //新消息
                                self.onNewMsg(newMsg, true);
                                self.messageMgr.increment()

                                //消息已读上报，以及设置会话自动已读标记
                                webim.setAutoRead(sess, true, true);
                            }
                            else {


                                if (!self.groupMgr.GroupsInfo[sess.id()]) {
                                    self.groupMgr.GroupsInfo[sess.id()] = {};
                                }

                                //当前群组最后消息
                                self.groupMgr.GroupsInfo[sess.id()].LastMsg = sess.msg(sess.msgCount() - 1);
                                //更新未读消息数量
                                self.groupMgr.GroupsInfo[sess.id()].UnreadMsgNum = sess.unread();
                                //更新最后消息时间
                                self.groupMgr.GroupsInfo[sess.id()].LastMsgTime = sess.time();

                                //设置未读消息数量
                                self.onUnreadMsgCountChanged(sess.type(), sess.id(), sess.unread());
                            }
                        }


                    }

                    ////监听群资料变化事件
                    var onGroupInfoChangeNotify = function (notify) {
                        console.info("执行 群资料变化 回调： %s", JSON.stringify(notify));

                        //var groupId = notify.GroupId;
                        //var newFaceUrl = notify.GroupFaceUrl;//新群组图标, 为空，则表示没有变化
                        //var newName = notify.GroupName;//新群名称, 为空，则表示没有变化
                        //var newOwner = notify.OwnerAccount;//新的群主id, 为空，则表示没有变化
                        //var newNotification = notify.GroupNotification;//新的群公告, 为空，则表示没有变化
                        //var newIntroduction = notify.GroupIntroduction;//新的群简介, 为空，则表示没有变化

                        //if (newName) {
                        //    //更新群组列表的群名称
                        //    var groupNameDivId = "nameDiv_" + groupId;
                        //    var groupNameDiv = document.getElementById(groupNameDivId);
                        //    if (groupNameDiv) {
                        //        if (newName.length > maxNameLen) {//帐号或昵称过长，截取一部分
                        //            newName = newName.substr(0, maxNameLen) + "...";
                        //        }
                        //        groupNameDiv.innerHTML = newName;
                        //    } else {
                        //        console.warn("不存在该群组div: groupNameDivId=" + groupNameDivId);
                        //    }
                        //}
                    }

                    var onKickedEventCall = function () {

                        var self = this;

                        self.Quit();

                        eventBus.dispatch("im-kicked", {});
                    }

                    //监听连接状态回调变化事件
                    var onConnNotify = function (resp) {
                        var info;
                        switch (resp.ErrorCode) {
                            case webim.CONNECTION_STATUS.ON:
                                eventBus.dispatch("im-connection-on",resp);
                                webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
                                break;
                            case webim.CONNECTION_STATUS.OFF:
                                eventBus.dispatch("im-connection-off", resp);
                                info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;                                
                                webim.Log.warn(info);                               
                                break;
                            case webim.CONNECTION_STATUS.RECONNECT:
                                eventBus.dispatch("im-connection-reconnect", resp);
                                info = '连接状态恢复正常: ' + resp.ErrorInfo;                              
                                webim.Log.warn(info);                           
                                break;
                            default:
                                webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
                                break;
                        }
                    };

                    //IE9(含)以下浏览器用到的jsonp回调函数
                    var jsonpCallback = function (rspData) {
                        webim.setJsonpLastRspData(rspData);
                    }

                
                    //获取C2C最新消息或群漫游消息成功回调函数
                    var syncMsgsCallbackOK = function () {
                        var self = this;

                        if (webim.MsgStore.sessCount() > 0) {
                            var sessMap = webim.MsgStore.sessMap();

                            for (var i in sessMap) {
                                var sess = sessMap[i];

                                if (self.session.selToID == sess.id()) {
                                    //处于当前聊天界面
                                    self.session.selSess = sess;

                                    var msgCount = sess.msgCount();

                                    console.log("onMsgNotify:已接收的消息数量=" + self.messageMgr.msgCount() + ",获取当前会话消息数=" + msgCount);

                                    if (msgCount > self.messageMgr.msgCount()) {

                                        for (var mj = self.messageMgr.msgCount() ; mj < msgCount; mj++) {
                                            var msg = sess.msg(mj);

                                            //历史消息
                                            self.onNewMsg(msg, false);

                                            self.messageMgr.increment();
                                        }
                                        //消息已读上报，以及设置会话自动已读标记
                                        webim.setAutoRead(self.session.selSess, true, true);
                                    }
                                }
                                else {
                                    console.log("onUnreadMsgCountChanged(" + sess.type() + "," + sess.id() + "," + sess.unread() + ")");

                                    if (!self.groupMgr.GroupsInfo[sess.id()]) {
                                        self.groupMgr.GroupsInfo[sess.id()] = {};
                                    }

                                    //当前群组最后消息
                                    self.groupMgr.GroupsInfo[sess.id()].LastMsg = sess.msg(sess.msgCount() - 1);
                                    //更新未读消息数量
                                    self.groupMgr.GroupsInfo[sess.id()].UnreadMsgNum = sess.unread();
                                    //更新最后消息时间
                                    self.groupMgr.GroupsInfo[sess.id()].LastMsgTime = sess.time();

                                    self.onUnreadMsgCountChanged(sess.type(), sess.id(), sess.unread())
                                }

                            }
                        }
                    }
              

                    ////监听（多终端同步）群系统消息事件
                    var groupSystemNotifys = function () {

                        var self = this;

                        //监听 申请加群 系统消息
                        function onApplyJoinGroupRequestNotify(notify) {
                            console.info("执行 加群申请 回调： %s", JSON.stringify(notify));

                            var timestamp = notify.MsgTime;
                            notify.MsgTimeStamp = timestamp;
                            notify.MsgTime = webim.Tool.formatTimeStamp(notify.MsgTime);

                            var reportTypeCh = "[申请加群]";
                            var content = notify.Operator_Account + "申请加入你的群";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, timestamp);
                        }

                        //监听 申请加群被同意 系统消息
                        function onApplyJoinGroupAcceptNotify(notify) {
                            console.info("执行 申请加群被同意 回调： %s", JSON.stringify(notify));
                            //刷新我的群组列表
                            //getJoinedGroupListHigh(syncSessionGroupMsgs);
                            var reportTypeCh = "[申请加群被同意]";
                            var content = notify.Operator_Account + "同意你的加群申请，附言：" + notify.RemarkInfo;
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);

                        }

                        //监听 申请加群被拒绝 系统消息
                        function onApplyJoinGroupRefuseNotify(notify) {
                            console.info("执行 申请加群被拒绝 回调： %s", JSON.stringify(notify));
                            var reportTypeCh = "[申请加群被拒绝]";
                            var content = notify.Operator_Account + "拒绝了你的加群申请，附言：" + notify.RemarkInfo;
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }

                        //监听 被踢出群 系统消息
                        function onKickedGroupNotify(notify) {
                            console.info("执行 被踢出群  回调： %s", JSON.stringify(notify));
                            //刷新我的群组列表
                            //getJoinedGroupListHigh(syncSessionGroupMsgs);
                            var reportTypeCh = "[被踢出群]";
                            var content = "你被管理员" + notify.Operator_Account + "踢出该群";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }

                        //监听 解散群 系统消息
                        function onDestoryGroupNotify(notify) {
                            console.info("执行 解散群 回调： %s", JSON.stringify(notify));
                            //刷新我的群组列表
                            //getJoinedGroupListHigh(syncSessionGroupMsgs);
                            var reportTypeCh = "[群被解散]";
                            var content = "群主" + notify.Operator_Account + "已解散该群";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }
                        //监听 创建群 系统消息
                        function onCreateGroupNotify(notify) {
                            console.info("执行 创建群 回调： %s", JSON.stringify(notify));
                            var reportTypeCh = "[创建群]";
                            var content = "你创建了该群";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }
                        //监听 被邀请加群 系统消息
                        function onInvitedJoinGroupNotify(notify) {
                            console.info("执行 被邀请加群  回调： %s", JSON.stringify(notify));
                            //刷新我的群组列表
                            //getJoinedGroupListHigh(syncSessionGroupMsgs);
                            var reportTypeCh = "[被邀请加群]";
                            var content = "你被管理员" + notify.Operator_Account + "邀请加入该群";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }
                        //监听 主动退群 系统消息
                        function onQuitGroupNotify(notify) {
                            console.info("执行 主动退群  回调： %s", JSON.stringify(notify));
                            var reportTypeCh = "[主动退群]";
                            var content = "你退出了该群";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }
                        //监听 被设置为管理员 系统消息
                        function onSetedGroupAdminNotify(notify) {
                            console.info("执行 被设置为管理员  回调： %s", JSON.stringify(notify));
                            var reportTypeCh = "[被设置为管理员]";
                            var content = "你被群主" + notify.Operator_Account + "设置为管理员";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }
                        //监听 被取消管理员 系统消息
                        function onCanceledGroupAdminNotify(notify) {
                            console.info("执行 被取消管理员 回调： %s", JSON.stringify(notify));
                            var reportTypeCh = "[被取消管理员]";
                            var content = "你被群主" + notify.Operator_Account + "取消了管理员资格";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }
                        //监听 群被回收 系统消息
                        function onRevokeGroupNotify(notify) {
                            console.info("执行 群被回收 回调： %s", JSON.stringify(notify));
                            //刷新我的群组列表
                            //getJoinedGroupListHigh(syncSessionGroupMsgs);
                            var reportTypeCh = "[群被回收]";
                            var content = "该群已被回收";
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }
                        //监听 用户自定义 群系统消息
                        function onCustomGroupNotify(notify) {
                            console.info("执行 用户自定义系统消息 回调： %s", JSON.stringify(notify));
                            var reportTypeCh = "[用户自定义系统消息]";
                            var content = notify.UserDefinedField;//群自定义消息数据
                            addGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
                        }

                        //增加一条群组系统消息
                        function addGroupSystemMsg(type, typeCh, group_id, group_name, msg_content, msg_time) {


                            self.onNewGroupSystemMsg({
                                "ReportType": type,
                                "ReportTypeCh": typeCh,
                                "GroupId": group_id,
                                "GroupName": group_name,
                                "MsgContent": msg_content,
                                "MsgTime": webim.Tool.formatTimeStamp(msg_time)
                            })


                        }


                        //注意每个数字代表的含义，比如，
                        var groupSystemNotifys = {
                            "1": onApplyJoinGroupRequestNotify,//申请加群请求（只有管理员会收到）
                            "2": onApplyJoinGroupAcceptNotify,//申请加群被同意（只有申请人能够收到）
                            "3": onApplyJoinGroupRefuseNotify,//申请加群被拒绝（只有申请人能够收到）
                            "4": onKickedGroupNotify,//被管理员踢出群(只有被踢者接收到)
                            "5": onDestoryGroupNotify,//群被解散(全员接收)
                            "6": onCreateGroupNotify,//创建群(创建者接收)
                            "7": onInvitedJoinGroupNotify,//邀请加群(被邀请者接收)
                            "8": onQuitGroupNotify,//主动退群(主动退出者接收)
                            "9": onSetedGroupAdminNotify,//设置管理员(被设置者接收)
                            "10": onCanceledGroupAdminNotify,//取消管理员(被取消者接收)
                            "11": onRevokeGroupNotify,//群已被回收(全员接收)
                            "255": onCustomGroupNotify//用户自定义通知(默认全员接收)
                        };

                        return groupSystemNotifys;

                    };

                    return imMgr;

                })();

                return { imMgr: imMgr }

            })(window, webim, TLSHelper);

            return module;
        });