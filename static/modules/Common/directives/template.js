/*! 康美网络医院 - v1.0.0 - 2017-11-22 自动生成
 */
 define(['angular'], function(angular){angular.module('templates-directive-common', ['/static/modules/Common/directives/Capture.html', '/static/modules/Common/directives/Recorder.html', '/static/modules/Common/directives/chat-detail-Audio.html', '/static/modules/Common/directives/chat-detail-CallCtrl.html', '/static/modules/Common/directives/chat-detail-DeviceSetting.html', '/static/modules/Common/directives/chat-detail-Video.html', '/static/modules/Common/directives/chat-detail-comment.html', '/static/modules/Common/directives/chat-detail-users.html', '/static/modules/Common/directives/countdown.html', '/static/modules/Common/directives/exam-result-charts.html', '/static/modules/Common/directives/exam-result-editor.html', '/static/modules/Common/directives/exam-result.html', '/static/modules/Common/directives/form-control.html', '/static/modules/Common/directives/grid.html', '/static/modules/Common/directives/pager.html', '/static/modules/Common/directives/preview.html', '/static/modules/Common/directives/spinner-style1.html', '/static/modules/Common/directives/spinner-style2.html', '/static/modules/Common/directives/spinner-style3.html', '/static/modules/Common/directives/spinner-style4.html', '/static/modules/Common/directives/spinner-style5.html', '/static/modules/Common/directives/spinner-style6.html', '/static/modules/Common/directives/spinner-style7.html', '/static/modules/Common/directives/timeline.html', '/static/modules/Common/directives/uploader.html']);

angular.module("/static/modules/Common/directives/Capture.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/Capture.html",
    "<div class=\"webuploader\">\n" +
    "    <label ng-click=\"onCapture()\"></label>\n" +
    "    <iframe style=\"display:none\" id=\"iframe_downCapture\"></iframe>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/static/modules/Common/directives/Recorder.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/Recorder.html",
    "<div class=\"webuploader\">\n" +
    "    <label ng-click=\"onStart()\"></label>\n" +
    "</div>\n" +
    "<script type=\"text/ng-template\" id=\"tpl-recordStatusBar\">\n" +
    "    <div class=\"recordStatusBar\">\n" +
    "        <div class=\"progress\">\n" +
    "            <div class=\"title\">正在录音...</div>\n" +
    "            <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{recordingProgressNow}}\" aria-valuemin=\"{{recordingProgressMin}}\" aria-valuemax=\"{{recordingProgressMax}}\" style=\"width: {{recordingProgressPercent()}};\">\n" +
    "                \n" +
    "            </div>\n" +
    "            <span class=\"text-right btns\">\n" +
    "                <button class=\"btn btn-xs btn-default\" ng-click=\"onStop()\">{{'btnSend'|translate}}</button>\n" +
    "                <button class=\"btn btn-xs btn-default\" ng-click=\"onCancel()\">{{'btnCancel'|translate}}</button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>");
}]);

angular.module("/static/modules/Common/directives/chat-detail-Audio.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/chat-detail-Audio.html",
    "<div class=\"chat-audio\" ng-show=\"displayVideo\">\n" +
    "    <div class=\"col-sm-12 chat-audio-local\">\n" +
    "        <!--<div class=\"title\">\n" +
    "            <h5>{{'Room-lblVoice'|translate}}({{room.videoMgr.getUsers().length}})</h5>\n" +
    "        </div>-->\n" +
    "        <div class=\"windows-list\">\n" +
    "            <!--有错误需要刷新-->\n" +
    "            <div class=\"windows text-center\" ng-if=\"errorVideoFlag\">\n" +
    "                <div class=\"tips\">\n" +
    "                    <div class=\"error\">\n" +
    "                        <div ng-bind-html=\"errorMsg\"></div>\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                        <button class=\"btn btn-default\" ng-show=\"errorRefreshBtn\" ng-click=\"onRefreshVideo()\">\n" +
    "                            重试\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!--无错误，语音人数等于0-->\n" +
    "            <div class=\"windows col-md-12 text-center\" ng-if=\"!errorVideoFlag && room.videoMgr.getUsers().length==0\">\n" +
    "                <div class=\"tips\">\n" +
    "                    <spinner type=\"style5\" class=\"center-block \"></spinner>\n" +
    "                    <br />\n" +
    "                    <span>{{'Room-lblVoiceWaiting'|translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!--无错误，语音人数大于0-->\n" +
    "            <div class=\"windows col-md-12 text-center connected\" ng-if=\"!errorVideoFlag && room.videoMgr.getUsers().length>0\">\n" +
    "                <div>\n" +
    "                    <br />\n" +
    "                    <br />\n" +
    "                    <br />\n" +
    "                    <br />\n" +
    "                    <spinner type=\"style1\" class=\"center-block \"></spinner>\n" +
    "                    <span>{{'Room-lblVoiceCalling'|translate}}</span>\n" +
    "                    <br /><br />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/chat-detail-CallCtrl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/chat-detail-CallCtrl.html",
    "<div class=\"chat-callCtrl\">\n" +
    "    <div class=\"info-title info-padding\">\n" +
    "        <span class=\"text-left\">\n" +
    "            <span ng-switch=\"room.State\">\n" +
    "                <span ng-switch-when=\"0\">\n" +
    "                    {{'Room-lblRoomState-0'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"1\">\n" +
    "                    {{'Room-lblRoomState-1'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"2\">\n" +
    "                    {{'Room-lblRoomState-2'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"3\">\n" +
    "                    {{'Room-lblRoomState-3'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"4\">\n" +
    "                    {{'Room-lblRoomState-4'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"5\">\n" +
    "                    {{'Room-lblRoomState-5'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"6\">\n" +
    "                    {{'Room-lblRoomState-6'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"7\">\n" +
    "                    {{'Room-lblRoomState-1'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-default>\n" +
    "                    {{'Room-lblRoomState-0'|translate}}\n" +
    "                </span>\n" +
    "            </span>\n" +
    "        </span>\n" +
    "        <span class=\"pull-right tools\">\n" +
    "            <a ng-if=\"connectioned || Disconnected || Waiting || Calling || Closed\" ng-click=\"toggleVolume()\" class=\"icon glyphicon\" ng-class=\"{'icon-sound-on': Volume>0,'icon-sound-off':Volume<=0}\" style=\"\"></a>\n" +
    "\n" +
    "            <!--<a ng-if=\"connectioned\" class=\"icon glyphicon icon-config-edit\"  data-toggle=\"modal\" data-target=\"#dialog-device\"></a>-->\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <div ng-show=\"connectioned\" ng-transclude></div>\n" +
    "    <div class=\"ibox-content body\">\n" +
    "\n" +
    "        <div ng-if=\"!connectioned && !Disconnected && !Waiting && !Calling && !Closed\" class=\"text-center summary default\">\n" +
    "            <span> 患者尚未进入诊室</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <!--已结束-->\n" +
    "        <div ng-if=\"Closed\" class=\"text-center summary default\">\n" +
    "            <span> 本次就诊已经结束</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <!--断开连接-->\n" +
    "        <div ng-if=\"Disconnected\" class=\"text-center summary default\">患者已离开诊室</div>\n" +
    "\n" +
    "        <!--候诊中-->\n" +
    "        <div ng-if=\"Waiting\" class=\"text-center summary success\">\n" +
    "            患者正在候诊中...\n" +
    "        </div>\n" +
    "        <!--呼叫中-->\n" +
    "        <div ng-if=\"Calling\" class=\"summary danger\">\n" +
    "            正在呼叫患者中...\n" +
    "        </div>\n" +
    "        <table class=\"table table-striped\">\n" +
    "            <tbody>\n" +
    "                <tr><td>订单编号：</td><td >{{OPDInfo.OrderNo}}</td></tr>\n" +
    "                <tr><td>就诊编号：</td><td >{{OPDInfo.ChannelID}}</td></tr>\n" +
    "                <tr><td>患者姓名：</td><td >{{OPDInfo.MemberName}}</td></tr>\n" +
    "                <tr><td>患者来源：</td><td>{{OPDInfo.OrgName}}</td></tr>\n" +
    "                <tr><td>预约时段：</td><td>{{OPDInfo.OPDDate |date:'yyyy-MM-dd'}} {{OPDInfo.OPDBeginTime}}~{{OPDInfo.OPDEndTime}}</td></tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            \n" +
    "\n" +
    "            <button ng-if=\"Waiting\" class=\"btn btn-success btn-block\" ng-click=\"onCall()\">立即呼叫</button>\n" +
    "            <button ng-if=\"Calling\" class=\"btn btn-danger btn-block\" ng-click=\"onCallCancel()\">取消呼叫</button>\n" +
    "            \n" +
    "            <button ng-if=\"Disconnected\" class=\"btn btn-danger btn-block\" ng-click=\"onHangup()\">结束看诊</button>\n" +
    "            <button ng-show=\"connectioned\" class=\"btn btn-danger btn-block\" ng-click=\"onHangup()\">结束看诊</button>\n" +
    "            <button ng-if=\"!connectioned && !Closed && !Disconnected && !Calling\" class=\"btn btn-info btn-block\" ng-click=\"onTriage()\">呼叫下一位</button>\n" +
    "        </div>\n" +
    "\n" +
    "        <!--<br />\n" +
    "        <br />\n" +
    "        <br />\n" +
    "        <br />-->\n" +
    "        <!--<center ng-if=\"connectioned || Disconnected || Waiting || Calling || Closed\">\n" +
    "            <button ng-click=\"toggleVolume()\"\n" +
    "                    class=\"btn btn-default glyphicon text-center \"\n" +
    "                    ng-class=\"{'glyphicon-volume-up': Volume>0,'glyphicon-volume-off':Volume<=0}\"></button>\n" +
    "        </center>-->\n" +
    "        <!--<br />\n" +
    "        <br />-->\n" +
    "    </div>\n" +
    "\n" +
    "    <chat-Device-Setting room=\"room\"></chat-Device-Setting>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/chat-detail-DeviceSetting.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/chat-detail-DeviceSetting.html",
    "<div class=\"modal fade\" id=\"dialog-device\" data-backdrop=\"static\" role=\"dialog\">\n" +
    "    <div class=\"modal-dialog\" style=\"width:450px;\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <div class=\"modal-header\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <h4 class=\"modal-title\">\n" +
    "                    {{'lblSetting'|translate}}\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body\" style=\"max-height:700px; overflow-y:auto;\">\n" +
    "                <ul class=\"nav nav-tabs\" role=\"tablist\">\n" +
    "                    <li role=\"presentation\" ng-class=\"{'active':deviceKind=='videoinput'}\" ng-click=\"deviceKind='videoinput'\"><a href=\"javascript:;\">{{'Room-lblCamera'|translate}}</a></li>\n" +
    "                    <li role=\"presentation\" ng-class=\"{'active':deviceKind=='audioinput'}\" ng-click=\"deviceKind='audioinput'\"><a href=\"javascript:;\">{{'Room-lblMicrophone'|translate}}</a></li>\n" +
    "                    <li role=\"presentation\" ng-class=\"{'active':deviceKind=='audiooutput'}\" ng-click=\"deviceKind='audiooutput'\"><a href=\"javascript:;\">{{'Room-lblSpeaker'|translate}}</a></li>\n" +
    "                </ul>\n" +
    "                <table class=\"table table-responsive table-bordered\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <td class=\"text-left\"> {{'Room-lblDeviceName'|translate}}</td>\n" +
    "                            <td class=\"text-center\">{{'Room-lblDeviceDefaultOption'|translate}}</td>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody ng-if=\"devices(deviceKind).length<=0\">\n" +
    "                        <tr>\n" +
    "                            <td colspan=\"2\">\n" +
    "                                {{'Room-lblNoRecord'|translate}}\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"device in devices(deviceKind)\">\n" +
    "                            <td class=\"text-left\">{{device.label}}</td>\n" +
    "                            <td class=\"text-center\">\n" +
    "                                <input type=\"radio\" name=\"device{{deviceKind}}\" ng-checked=\"device.enable\" ng-click=\"onSelectDevice(device)\" />\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div><!-- /.modal-content -->\n" +
    "    </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->");
}]);

angular.module("/static/modules/Common/directives/chat-detail-Video.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/chat-detail-Video.html",
    "<div class=\"chat-video\" ng-show=\"displayVideo\">\n" +
    "    <div class=\"col-sm-12 chat-video-local\" ng-show=\"!room.videoMgr.isNative\">\n" +
    "        <!--<div class=\"title\">\n" +
    "            <h5>\n" +
    "                {{'Room-lblVideo'|translate}}\n" +
    "            </h5>\n" +
    "        </div>-->\n" +
    "        <div class=\"windows-list\">\n" +
    "            <div class=\"windows text-center max\" ng-if=\"errorVideoFlag\">\n" +
    "                <div class=\"tips\">\n" +
    "                    <div ng-bind-html=\"errorMsg\"></div>\n" +
    "                    <br />\n" +
    "                    <br />\n" +
    "                    <button class=\"btn btn-default\" ng-show=\"errorRefreshBtn\" ng-click=\"onRefreshVideo()\">\n" +
    "                        重试\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div> \n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/chat-detail-comment.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/chat-detail-comment.html",
    "<div class=\"chat-comment\" ng-class=\"{'col-lg-8 col-md-7 col-sm-6':chatComment.historyLog.opened}\" dragUploader onUpload=\"onUpload\">\n" +
    "    <bg-splitter orientation=\"vertical\">\n" +
    "        <bg-pane min-size=\"200\">\n" +
    "            <div class=\"chat-messages\">\n" +
    "                <div class=\"scrollBar\" scrollBar id=\"chatCommentMessages\" color=\"#000\" railcolor=\"#fff\">\n" +
    "                    <div ng-if=\"chatComment.messages.length<=0\" class=\"text-center\">\n" +
    "                        {{'Room-lblNotMessages'|translate}}\n" +
    "                    </div>\n" +
    "                    <div ng-repeat=\"message in chatComment.messages track by $index\">\n" +
    "                        <chat-Msg  message=\"message\" on-Url-Click=\"onUrlClick\" on-Answer=\"onAnswer\"></chat-Msg>\n" +
    "                    </div>\n" +
    "                    <div ng-repeat=\"message in chatComment.sendingMessages track by $index\">\n" +
    "                        <chat-Msg message=\"message\" on-Url-Click=\"onUrlClick\" on-Answer=\"onAnswer\"></chat-Msg>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </bg-pane>\n" +
    "        <bg-pane min-size=\"250\">\n" +
    "            <chat-reply></chat-reply>\n" +
    "        </bg-pane>\n" +
    "    </bg-splitter>\n" +
    "</div>\n" +
    "<!--历史记录-->\n" +
    "<div class=\"chat-history col-lg-4 col-md-5 col-sm-6\" ng-show=\"chatComment.historyLog.opened\">\n" +
    "    <div class=\"title\">\n" +
    "        <span class=\"pull-left\">{{'Room-lblChatHistory'|translate}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"body\">\n" +
    "        <div class=\"chat-messages\">\n" +
    "            <div class=\"scrollBar\" scrollBar color=\"#000\" railcolor=\"#fff\">\n" +
    "                <div class=\"text-center mask\" ng-show=\"chatComment.historyLog.loading\">\n" +
    "                    <img src=\"/static/images/ico_loading.gif\" /> <span>{{'Room-lblLoading'|translate}}</span>\n" +
    "                </div>\n" +
    "                <div ng-if=\"chatComment.historyLog.messages.length<=0 && !chatComment.historyLog.loading\" class=\"text-center\">\n" +
    "                    {{'Room-lblNotMessages'|translate}}\n" +
    "                </div>\n" +
    "                <div ng-repeat=\"message in chatComment.historyLog.messages track by $index\">\n" +
    "                    <div class=\"clearfix\">\n" +
    "                        <p class=\"message_system\" ng-if=\"::message.msgType == chatComment.EnumMsgType.MSGTYPE_SYSTEM\"><span class=\"content\" ng-bind-html=\"message.html\"></span></p>\n" +
    "                        <div class=\"message\" ng-if=\"::message.msgType!=chatComment.EnumMsgType.MSGTYPE_SYSTEM && message.author\">\n" +
    "                            <h4 class=\"nickname\">{{::message.author}} {{::message.time}}</h4>\n" +
    "                            <div class=\"content\">\n" +
    "                                <div class=\"bubble js_message_bubble bubble_default no_arrow\"\n" +
    "                                     ng-class=\"::{\n" +
    "                                     'arrow_primary':message.msgType == chatComment.EnumMsgType.MSGTYPE_APP,\n" +
    "                                     'no_arrow':message.msgType == chatComment.EnumMsgType.MSGTYPE_IMAGE ||message.msgType == chatComment.EnumMsgType.MSGTYPE_MICROVIDEO ||message.msgType == chatComment.EnumMsgType.MSGTYPE_VIDEO}\">\n" +
    "                                    <!--语音消息-->\n" +
    "                                    <chat-Msg-Voice message=\"message\" ng-if=\"::message.msgType == chatComment.EnumMsgType.MSGTYPE_VOICE\"></chat-Msg-Voice>\n" +
    "                                    <!--图片消息-->\n" +
    "                                    <chat-Msg-Image message=\"message\" ng-if=\"::message.msgType == chatComment.EnumMsgType.MSGTYPE_IMAGE\"></chat-Msg-Image>\n" +
    "                                    <!--纯文本消息(文字，表情)-->\n" +
    "                                    <chat-Msg-Text message=\"message\" ng-if=\"::message.msgType == chatComment.EnumMsgType.MSGTYPE_TEXT\"></chat-Msg-Text>\n" +
    "                                    <!--链接消息-->\n" +
    "                                    <chat-Msg-Url message=\"message\" ng-if=\"::message.msgType ==chatComment.EnumMsgType.MSGTYPE_URL\" on-Url-Click=\"onUrlClick\"></chat-Msg-Url>\n" +
    "                                    <!--附件-->\n" +
    "                                    <chat-Msg-Attach message=\"message\" ng-if=\"::message.msgType == chatComment.EnumMsgType.MSGTYPE_ATTACH\"></chat-Msg-Attach>\n" +
    "                                    <!--调查问卷-->\n" +
    "                                    <chat-Msg-Question message=\"message\" ng-if=\"message.msgType == chatComment.EnumMsgType.MSGTYPE_SURVEY_QUESTION\" on-answer=\"onAnswer\" disable=\"true\"></chat-Msg-Question>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"toolbar\">\n" +
    "        <!--分页控件-->\n" +
    "        <pager-nav page-list=\"[5,10,20,25]\"\n" +
    "                   page=\"chatComment.historyLog.CurrentPage\"\n" +
    "                   page-Size=\"chatComment.historyLog.pageSize\"\n" +
    "                   load-Data=\"false\"\n" +
    "                   previous-text=\"<\"\n" +
    "                   next-text=\">\"\n" +
    "                   total-Count=\"historyLog.totalCount\" on-change=\"chatComment.historyLog.onSearch()\" />\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--模板：消息回复-->\n" +
    "<script id=\"tpl-chatReply\" type=\"text/ng-template\">\n" +
    "    <div class=\"chat-reply\">\n" +
    "        <div class=\"toolbar\">\n" +
    "            <a class=\"web_wechat_face web_wechat\" ng-click=\"EmotionDialog=!EmotionDialog\" title=\"{{'Room-btnChooseEmotion'|translate}}\"></a>\n" +
    "            <!--上传文件-->\n" +
    "            <a class=\"web_wechat_pic web_wechat\" href=\"javascript:;\" title=\"{{'Room-btnSendPictute'|translate}}\">\n" +
    "                <uploader onUpload=\"onUpload\"></uploader>\n" +
    "            </a>\n" +
    "            <!--截图-->\n" +
    "            <a class=\"web_wechat_screencut web_wechat\" href=\"javascript:;\">\n" +
    "                <capture onUpload=\"onUpload\"></capture>\n" +
    "            </a>\n" +
    "            <!--语音-->\n" +
    "            <!--<a class=\"web_wechat_recorder web_wechat\" recorder onUpload=\"onUpload\" href=\"javascript:;\">\n" +
    "\n" +
    "            </a>-->\n" +
    "\n" +
    "            <!--历史记录-->\n" +
    "            <button style=\"height: 100%;\" class=\"btn btn-sm btn pull-right\" ng-click=\"chatComment.historyLog.onOpen()\">\n" +
    "                <i class=\"icon glyphicon glyphicon-time\" style=\"height: 12px;\"></i>{{'Room-lblChatHistory'|translate}}\n" +
    "            </button>\n" +
    "\n" +
    "            <div id=\"wl_faces_box\" class=\"wl_faces_box\" ng-show=\"EmotionDialog\">\n" +
    "                <div class=\"wl_faces_content\">\n" +
    "                    <div class=\"title\">\n" +
    "                        <ul>\n" +
    "                            <li class=\"title_name\">{{'Room-lblEmotionUsed'|translate}}</li>\n" +
    "                            <li class=\"wl_faces_close\"><span ng-click=\"EmotionDialog=!EmotionDialog\">&nbsp;</span></li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div id=\"wl_faces_main\" class=\"wl_faces_main\">\n" +
    "                        <ul id=\"emotionUL\">\n" +
    "                            <li ng-repeat=\"(key,value) in EmotionPicData\">\n" +
    "                                <img ng-click=\"onSelectEmotionImg(value[0])\" id=\"{{value[0]}}\" ng-src=\"{{value[1]}}\" style=\"cursor:pointer;\">\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"wlf_icon\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <textarea class=\"form-control message-input\" ng-keydown=\"onTextareaKeyDown($event)\" name=\"message\" placeholder=\"{{'Room-lblMessageInputPlaceholder'|translate}}\" ng-model=\"replyContent\"></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"btns text-right\">\n" +
    "            <button type=\"submit\" class=\"btn btn-info\" ng-click=\"onSend()\">{{'Room-btnSend'|translate}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "<!--模板：语音消息-->\n" +
    "<script id=\"tpl-MsgVoice\" type=\"text/ng-template\">\n" +
    "    <div class=\"bubble_cont\">\n" +
    "        <div class=\"voice\"\n" +
    "             ng-style=\"{'width':40 + 7*message.voiceSize/1000}\"\n" +
    "             ng-click=\"playVoice(message)\" style=\"width: 50.64px;\">\n" +
    "            <i ng-class=\"{'web_wechat_voice_green':message.isSend,\n" +
    "                    'web_wechat_voice_gray':!message.isSend,\n" +
    "                    'web_wechat_voice_playing': message.voicePlaying && message.isSend,\n" +
    "                    'web_wechat_voice_gray_playing': message.voicePlaying && !message.isSend}\"></i>\n" +
    "            <!--语音总时长-->\n" +
    "            <span class=\"duration\">{{message.voiceSecond}}''<i class=\"web_wechat_noread\" ng-show=\"message.voiceUnRead\"></i></span>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "<!--模板：图片消息-->\n" +
    "<script id=\"tpl-MsgImage\" type=\"text/ng-template\">\n" +
    "    <div class=\"bubble_cont\" ng-click=\"previewPicture(message)\">\n" +
    "        <div class=\"picture\">\n" +
    "            <div ng-bind-html=\"message.html\"></div>\n" +
    "            <p class=\"loading\" ng-show=\"message._msg.status== -1\">\n" +
    "                <img src=\"/static/images/ico_loading.gif\" alt=\"\">\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "<!--模板：纯文本消息(文字，表情)-->\n" +
    "<script id=\"tpl-MsgText\" type=\"text/ng-template\">\n" +
    "    <div class=\"bubble_cont\">\n" +
    "        <div class=\"plain\">\n" +
    "            <pre class=\"js_message_plain\"></pre>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "<!--模板：链接消息-->\n" +
    "<script id=\"tpl-MsgUrl\" type=\"text/ng-template\">\n" +
    "    <div class=\"bubble_cont primary\" ng-click=\"urlClick(message)\">\n" +
    "        <a ng-href=\"{{message.FileUrl}}\"\n" +
    "           target=\"_blank\"\n" +
    "           class=\"app\">\n" +
    "            <h4 class=\"title\" ng-bind=\"message.FileName\"></h4>\n" +
    "            <img class=\"cover\" ng-src=\"{{message.Conver}}\">\n" +
    "            <p class=\"desc\" ng-bind=\"message.Desc\"></p>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</script>\n" +
    "<!--模板：附件-->\n" +
    "<script id=\"tpl-MsgAttach\" type=\"text/ng-template\">\n" +
    "    <div class=\"bubble_cont primary\">\n" +
    "        <div class=\"attach\">\n" +
    "            <div class=\"attach_bd\">\n" +
    "                <div class=\"cover\" ng-switch=\"\" on=\"message.FileType\">\n" +
    "                    <i ng-switch-default=\"\" class=\"web_wechat_folder\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"cont\">\n" +
    "                    <p class=\"title\" ng-bind=\"message.FileName\"></p>\n" +
    "                    <div class=\"opr\">\n" +
    "                        <span ng-bind=\"message.FileSize\"></span>\n" +
    "                        <span class=\"sep\" ng-show=\"message.FileUrl!=''\">|</span>\n" +
    "                        <a target=\"_blank\" ng-show=\"message.FileUrl!=''\" ng-href=\"{{message.FileUrl}}?Download=Y\">\n" +
    "                            {{'Room-btnDownLoad'|translate}}\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "<!--模板：调查问卷-->\n" +
    "<script id=\"tpl-MsgQuestion\" type=\"text/ng-template\">\n" +
    "    <div class=\"bubble_cont primary\">\n" +
    "        <div class=\"plain\">{{message.Desc}}</div>\n" +
    "        <div class=\"question-answers\">\n" +
    "            <button class=\"btn btn-default btn-sm\" ng-disabled=\"!!disable\" ng-repeat=\"answer in message.Answer\" ng-click=\"answerClick(answer)\">{{answer}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "<!--消息-->\n" +
    "<script id=\"tpl-Msg\" type=\"text/ng-template\">\n" +
    "    <div class=\"clearfix\">\n" +
    "        <p class=\"message_system\" ng-if=\"message.msgType == chatComment.EnumMsgType.MSGTYPE_SYSTEM\"><span class=\"content\" ng-bind-html=\"message.html\"></span></p>\n" +
    "        <div class=\"message\" ng-if=\"message.msgType!=chatComment.EnumMsgType.MSGTYPE_SYSTEM && message.avatar\" ng-class=\"{'you':!message.isSend,'me':message.isSend}\">\n" +
    "            <p ng-show=\"message.time\" class=\"message_system\">\n" +
    "                <span class=\"content\" ng-bind=\"::message.time\"></span>\n" +
    "            </p>\n" +
    "            <img class=\"avatar\" ng-src=\"{{message.avatar}}\">\n" +
    "            <div class=\"content\">\n" +
    "                <h4 class=\"nickname\" ng-if=\"!message.isSend\">{{message.author}}</h4>\n" +
    "                <div class=\"bubble js_message_bubble bubble_default no_arrow\"\n" +
    "                     ng-class=\"{\n" +
    "                                       'bubble_default left':!message.isSend,\n" +
    "                                       'bubble_primary right':message.isSend,\n" +
    "                                       'arrow_primary':message.msgType == chatComment.EnumMsgType.MSGTYPE_APP,\n" +
    "                                       'no_arrow':message.msgType == chatComment.EnumMsgType.MSGTYPE_IMAGE || message.msgType == chatComment.EnumMsgType.MSGTYPE_MICROVIDEO ||message.msgType == chatComment.EnumMsgType.MSGTYPE_VIDEO}\">\n" +
    "\n" +
    "\n" +
    "                    <!--语音消息-->\n" +
    "                    <chat-Msg-Voice message=\"message\" ng-if=\"message.msgType == chatComment.EnumMsgType.MSGTYPE_VOICE\"></chat-Msg-Voice>\n" +
    "                    <!--图片消息-->\n" +
    "                    <chat-Msg-Image message=\"message\" ng-if=\"message.msgType == chatComment.EnumMsgType.MSGTYPE_IMAGE\"></chat-Msg-Image>\n" +
    "                    <!--纯文本消息(文字，表情)-->\n" +
    "                    <chat-Msg-Text message=\"message\" ng-if=\"message.msgType == chatComment.EnumMsgType.MSGTYPE_TEXT\"></chat-Msg-Text>\n" +
    "                    <!--链接消息-->\n" +
    "                    <chat-Msg-Url message=\"message\" ng-if=\"message.msgType ==chatComment.EnumMsgType.MSGTYPE_URL\" on-Url-Click=\"onUrlClick\"></chat-Msg-Url>\n" +
    "                    <!--附件-->\n" +
    "                    <chat-Msg-Attach message=\"message\" ng-if=\"message.msgType == chatComment.EnumMsgType.MSGTYPE_ATTACH\"></chat-Msg-Attach>\n" +
    "                    <!--调查问卷-->\n" +
    "                    <chat-Msg-Question message=\"message\" ng-if=\"message.msgType == chatComment.EnumMsgType.MSGTYPE_SURVEY_QUESTION\" on-answer=\"onAnswer\" disable=\"true\"></chat-Msg-Question>\n" +
    "              \n" +
    "                    <!--箭头：图片不需要-->\n" +
    "                    <div ng-if=\"message.msgType != chatComment.EnumMsgType.MSGTYPE_IMAGE\" ng-class=\"{'jt-left':!message.isSend,'jt-right':message.isSend}\"></div>\n" +
    "                </div>\n" +
    "\n" +
    "                <!--loading:图片不需要 -->\n" +
    "                <img ng-if=\"message.msgType != chatComment.EnumMsgType.MSGTYPE_IMAGE\" ng-show=\"message._msg.status== -1\" class=\"ico_loading\"\n" +
    "                     src=\"/static/images/ico_loading.gif\"\n" +
    "                     alt=\"\">\n" +
    "\n" +
    "                <!--重新发送：-->\n" +
    "                <i class=\"ico_fail web_wechat_message_fail btn\" ng-click=\"chatComment.resendMsg(message)\"\n" +
    "                   ng-show=\"message._msg.status==0\"></i>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>");
}]);

angular.module("/static/modules/Common/directives/chat-detail-users.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/chat-detail-users.html",
    "<div class=\"chat-users\">\n" +
    "    <div class=\"ibox-title\">\n" +
    "        <span class=\"pull-left\"><h5>{{'Room-lblMembers'|translate}}({{Users.length}}) </h5></span>\n" +
    "    </div>\n" +
    "    <div class=\"users-list\">\n" +
    "        <div class=\"chat-user clearfix\" ng-repeat=\"user in Users\">\n" +
    "            <img class=\"chat-avatar\" ng-src=\"{{user.avatar}}\" alt=\"\">\n" +
    "            <div class=\"chat-user-name \">\n" +
    "                <span class=\"pull-right\" >\n" +
    "                    <i class=\"icon glyphicon btn icon-config-edit\" ng-if=\"user.me\"  data-toggle=\"modal\" data-target=\"#dialog-device\"></i>\n" +
    "                    <i class=\"icon glyphicon btn\" ng-class=\"{'icon-video-off':!user.camera,'icon-video-on':user.camera}\"></i>\n" +
    "                    <i class=\"icon glyphicon btn\" ng-class=\"{'icon-audio-off':!user.holdmic,'icon-audio-on':user.holdmic}\"></i>\n" +
    "                </span>\n" +
    "                <span>{{user.nickName}} </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal fade\" id=\"dialog-device\" data-backdrop=\"static\">\n" +
    "        <div class=\"modal-dialog\" style=\"width:450px;\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                    <h4 class=\"modal-title\">\n" +
    "                        {{'lblSetting'|translate}}\n" +
    "                    </h4>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body\" style=\"max-height:700px; overflow-y:auto;\">\n" +
    "                    <ul class=\"nav nav-tabs\" role=\"tablist\">\n" +
    "                        <li role=\"presentation\" ng-class=\"{'active':deviceKind=='videoinput'}\" ng-click=\"deviceKind='videoinput'\"><a href=\"javascript:;\">{{'Room-lblCamera'|translate}}</a></li>\n" +
    "                        <li role=\"presentation\" ng-class=\"{'active':deviceKind=='audioinput'}\" ng-click=\"deviceKind='audioinput'\"><a href=\"javascript:;\">{{'Room-lblMicrophone'|translate}}</a></li>\n" +
    "                        <li role=\"presentation\" ng-class=\"{'active':deviceKind=='audiooutput'}\" ng-click=\"deviceKind='audiooutput'\"><a href=\"javascript:;\">{{'Room-lblSpeaker'|translate}}</a></li>\n" +
    "                    </ul>\n" +
    "                    <table class=\"table table-responsive table-bordered\">\n" +
    "                        <thead>\n" +
    "                            <tr>\n" +
    "                                <td class=\"text-left\"> {{'Room-lblDeviceName'|translate}}</td>\n" +
    "                                <td class=\"text-center\">{{'Room-lblDeviceDefaultOption'|translate}}</td>\n" +
    "                            </tr>\n" +
    "                        </thead>\n" +
    "                        <tbody ng-if=\"Devices(deviceKind).length<=0\">\n" +
    "                            <tr>\n" +
    "                                <td colspan=\"2\">\n" +
    "                                    {{'Room-lblNoRecord'|translate}}\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                        <tbody>\n" +
    "                            <tr ng-repeat=\"device in Devices(deviceKind)\">\n" +
    "                                <td class=\"text-left\">{{device.label}}</td>\n" +
    "                                <td class=\"text-center\">\n" +
    "                                    <input type=\"radio\" name=\"device{{deviceKind}}\" ng-checked=\"device.enable\" ng-click=\"onSelectDevice(device)\" />\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "            </div><!-- /.modal-content -->\n" +
    "        </div><!-- /.modal-dialog -->\n" +
    "    </div><!-- /.modal -->\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/countdown.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/countdown.html",
    "<div class=\"countdown-pnl\">\n" +
    "    <div class=\"countdown\" role=\"alert\" ng-if=\"duration > 0 && room.State != 3 && room.ServiceType != -1\">\n" +
    "        <div class=\"time-item\">\n" +
    "            剩余时间：\n" +
    "            <span ng-show=\"day>0\">{{day}}天</span>\n" +
    "            <strong>{{hour}}时</strong>\n" +
    "            <strong>{{minute}}分</strong>\n" +
    "            <strong>{{second}}秒</strong>\n" +
    "        </div>\n" +
    "    </div>    \n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/exam-result-charts.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/exam-result-charts.html",
    "<div ng-show=\"memberId != null && memberId != ''\" style=\"border:1px dotted gray; margin-bottom:10px;\">\n" +
    "    <style type=\"text/css\">\n" +
    "        .chart-table\n" +
    "        {\n" +
    "            width: 100%; border-spacing: 0px; border-collapse: collapse; page-break-inside: auto;\n" +
    "        }\n" +
    "        .chart-table .chart-table-row\n" +
    "        {\n" +
    "            vertical-align: top; color: rgb(85, 85, 85);\n" +
    "        }\n" +
    "        .expander{\n" +
    "            margin-bottom:10px;padding-top: 5px;padding-bottom: 5px; padding-left: 5px; cursor:pointer;background-color:#f5f5f5; width: 100%;\n" +
    "        }\n" +
    "        .expander.expanded::before\n" +
    "        {\n" +
    "            content:'▾';\n" +
    "        }\n" +
    "        .expander.collapsed::before\n" +
    "        {\n" +
    "            content:'▸';\n" +
    "        }\n" +
    "    </style>\n" +
    "    <div class=\"expander collapsed\" for=\"divExamResultChats\">\n" +
    "        检验检查结果图表\n" +
    "    </div>\n" +
    "    <div id=\"divExamResultChats\" style=\"display:none;\">\n" +
    "        <div ng-show=\"ExamItemTypes != null && ExamItemTypes.length > 0\">\n" +
    "            <div class=\"search-ban form-inline\">\n" +
    "                <div class=\"col-label-search\">\n" +
    "                    日期：\n" +
    "                </div>\n" +
    "                <div class=\"col-date-search\">\n" +
    "                    <div class=\"input-group date\">\n" +
    "                        <input id=\"BeginDate\" class=\"form-control\" size=\"16\" datepicker type=\"text\" value=\"\" ng-model=\"BeginDate\" placeholder=\"{{'lblStartDate' | translate}}\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-label-search\">\n" +
    "                    -\n" +
    "                </div>\n" +
    "                <div class=\"col-date-search\">\n" +
    "                    <div class=\"input-group date\">\n" +
    "                        <input type=\"text\" placeholder=\"{{'lblEndDate' | translate}}\" datepicker id=\"EndDate\" class=\"form-control\" size=\"16\" value=\"\" ng-model=\"EndDate\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"div-clear\"></div>\n" +
    "            </div>\n" +
    "            <table class=\"chart-table\" id=\"chart-table\" cellspacing=\"0\" cellpadding=\"0\">\n" +
    "                <tbody ng-repeat=\"item in ExamItemTypes\" repeat-finish=\"fn.LoadExamResultCharts()\">\n" +
    "                    <tr class=\"chart_group_header\">\n" +
    "                        <td>\n" +
    "                            <div class=\"expander expanded\" for=\"trChart_{{item.ID}}\">\n" +
    "                                {{item.Name}}\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr id=\"trChart_{{item.ID}}\" class=\"chart-table-row\">\n" +
    "                        <td class=\"mobile-suppressed\">\n" +
    "                            <div class=\"row\" style=\"text-align:center;\">\n" +
    "                                <div id=\"divChart_{{item.ID}}\" examitemtypeid=\"{{item.ID}}\" style=\"width:90%; height:200px; margin:auto auto;\">\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-show=\"ExamItemTypes == null || ExamItemTypes.length == 0\">\n" +
    "            暂无数据\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/exam-result-editor.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/exam-result-editor.html",
    "<div>\n" +
    "    <style type=\"text/css\">\n" +
    "        dl.lab-widget {\n" +
    "            border: 1px dotted gray;\n" +
    "            padding: 10px;\n" +
    "        }\n" +
    "\n" +
    "        h3 {\n" +
    "            font-size: 14px !important;\n" +
    "            font-weight: bold;\n" +
    "        }\n" +
    "    </style>\n" +
    "    <div class=\"modal fade\" id=\"divAddResultModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"divAddResultModalLabel\">\n" +
    "        <div class=\"modal-dialog\" role=\"document\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <form form-validate on-submit=\"fn.save()\" id=\"formAddResultModal\">\n" +
    "                    <div class=\"modal-header\">\n" +
    "                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                        <h4 class=\"modal-title\" id=\"divAddResultModalLabel\">添加检验检查结果</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"modal-body\">\n" +
    "                        <div id=\"divExamItems\">\n" +
    "                            <div id=\"ExamItems\">\n" +
    "\n" +
    "                            </div>\n" +
    "                            <div>\n" +
    "                                <h3><label for=\"ExamTime\" class=\"required\">检查时间</label></h3>\n" +
    "                                <fieldset class=\"has-max-width\">\n" +
    "                                    <dl class='lab-widget'>\n" +
    "                                        <dd>\n" +
    "                                            <input id=\"ExamTime\" class=\"form-control\" datepicker type=\"text\" placeholder=\"请输入检查时间\" validate=\"{required:true, date:true,messages:{required:'请输入检查时间'}}\" />\n" +
    "                                        </dd>\n" +
    "                                    </dl>\n" +
    "                                </fieldset>\n" +
    "                                <h3><label for=\"HospitalName\" class=\"required\">出具检验检查结果的医院</label></h3>\n" +
    "                                <fieldset class=\"has-max-width\">\n" +
    "                                    <dl class='lab-widget'>\n" +
    "                                        <dd>\n" +
    "                                            <input type=\"text\" class=\"form-control\" id=\"HospitalName\" name=\"HospitalName\" maxlength=\"20\" placeholder=\"请输入医院\" validate=\"{required:true,messages:{required:'请输入医院'}}\" />\n" +
    "                                        </dd>\n" +
    "                                    </dl>\n" +
    "                                </fieldset>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"modal-footer\">\n" +
    "                        <button type=\"submit\" class=\"btn btn-primary\">{{'btnSave' | translate}}</button>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/exam-result.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/exam-result.html",
    "<div class=\"form-horizontal\">\n" +
    "    <style type=\"text/css\">\n" +
    "        .auto-break {\n" +
    "            word-break: break-all; /*支持IE，chrome，FF不支持*/\n" +
    "            word-wrap: break-word; /*支持IE，chrome，FF*/\n" +
    "        }\n" +
    "\n" +
    "        .indent {\n" +
    "            text-indent: 1em;\n" +
    "        }\n" +
    "    </style>\n" +
    "    <table class=\"table table-hover\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:200px;\">{{'检验检查项目' | translate}}</th>\n" +
    "                <th>{{'最近检验检查结果' | translate}}</th>\n" +
    "                <th style=\"width:150px;\">{{'最近检验检查时间' | translate}}</th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody ng-show=\"ListItems==null||ListItems.length<=0\">\n" +
    "            <tr>\n" +
    "                <td colspan=\"3\">暂无数据</td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"item in ListItems\">\n" +
    "                <td>{{item.ExamItemTypeName}}</td>\n" +
    "                <td>\n" +
    "                    <dl ng-repeat=\"res in item.Results\">\n" +
    "                        <dt>{{res.ExamItemTypeName}}</dt>\n" +
    "                        <dd class=\"auto-break indent\">\n" +
    "                            <strong><span style='cursor:pointer;color:{{res.Status == 0 ? \"green\" : \"red\"}};' title='{{res.StatusMsg}}'>{{res.Result | defaultValue : '---'}}</span>&nbsp;</strong>\n" +
    "                            {{res.UnifiedUnit}}&nbsp;\n" +
    "\n" +
    "                            <div class=\"auto-break\" ng-repeat=\"attchment in res.ExamResultAttachments\">\n" +
    "                                <a href='{{attchment.FilePath}}' target=\"_blank\">{{attchment.FilePath | fileName}}</a>&nbsp;\n" +
    "                            </div>\n" +
    "                        </dd>\n" +
    "                        <dd class=\"auto-break\" ng-show=\"$last\" style=\"font-weight:bold;\">医院：{{res.HospitalName}}</dd>\n" +
    "\n" +
    "                    </dl>\n" +
    "\n" +
    "                </td>\n" +
    "                <td>{{item.LastExamTime | date: 'yyyy-MM-dd'}}</td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/form-control.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/form-control.html",
    "<span ng-switch=\"field.type\">\n" +
    "    <!--下拉选择-->\n" +
    "    <span ng-switch-when=\"select\">\n" +
    "        <span ng-switch=\"field.formcontrol\">\n" +
    "            <span ng-switch-when=\"selecttree\">\n" +
    "                <select class=\"form-control\" selecttree=\"field.selecttree\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"field.editable==false || field.editable=='readonly'\" id=\"{{field.name}}\" name=\"{{field.name}}\" ng-multiple=\"field.multiple\" validate=\"{{field.validate}}\" value=\"{{field.defaultValue}}\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\" options=\"field.options\" ng-options=\"{{field.optionRegex}}\" ng-change=\"field.onChange(field)\"></select>\n" +
    "            </span>\n" +
    "            <span ng-switch-default>\n" +
    "                <select class=\"form-control\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"field.editable==false || field.editable=='readonly'\" id=\"{{field.name}}\" name=\"{{field.name}}\" ng-multiple=\"field.multiple\" validate=\"{{field.validate}}\" value=\"{{field.defaultValue}}\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\" ng-options=\"{{field.optionRegex}}\" ng-change=\"field.onChange(field)\"></select>\n" +
    "            </span>\n" +
    "        </span>\n" +
    "    </span>\n" +
    "    <!--编辑框-->\n" +
    "    <span ng-switch-when=\"textarea\">\n" +
    "        <span ng-switch=\"field.formcontrol\">\n" +
    "            <span ng-switch-when=\"editor\">\n" +
    "                <textarea editor ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"field.editable==false || field.editable=='readonly'\" id=\"{{field.name}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" value=\"{{field.defaultValue}}\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\"></textarea>\n" +
    "            </span>\n" +
    "            <span ng-switch-default>\n" +
    "                <textarea class=\"form-control\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"field.editable==false || field.editable=='readonly'\" id=\"{{field.name}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" value=\"{{field.defaultValue}}\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\">{{field.value}}</textarea>\n" +
    "            </span>\n" +
    "        </span>\n" +
    "    </span>\n" +
    "\n" +
    "    <!--复选框-->\n" +
    "    <span ng-switch-when=\"check\">\n" +
    "        <span ng-class=\"field.class\" ng-repeat=\"option in field.options\" ng-init=\"add ?field.value=field.defaultValue:void()\">\n" +
    "            <label for=\"{{field.name}}{{option.value}}\">\n" +
    "                <input type=\"checkbox\" id=\"{{field.name}}{{option.value}}\" ng-class=\"option.class\" ng-required=\"filed.validate.required\" ng-readonly=\"field.editable==false || field.editable=='readonly'\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" value=\"{{option.value}}\" ng-model=\"field.value\" ng-checked=\"{{field.value===option.value}}\" /> {{option.text}}\n" +
    "            </label>\n" +
    "        </span>\n" +
    "    </span>\n" +
    "\n" +
    "    <!--单选框-->\n" +
    "    <span ng-switch-when=\"radio\">\n" +
    "        <span ng-class=\"field.class\" ng-repeat=\"option in field.options\" ng-init=\"add ?field.value=field.defaultValue:void()\">\n" +
    "            <label for=\"{{field.name}}{{option.value}}\">\n" +
    "                <input type=\"radio\" id=\"{{field.name}}{{option.value}}\" ng-class=\"option.class\" ng-required=\"filed.validate.required\" ng-readonly=\"(edit && field.editable.edit=='readonly') || (add && field.editable.add=='readonly')\" title=\"{{option.text}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" value=\"{{option.value}}\" ng-model=\"field.value\" ng-checked=\"{{field.value===option.value}}\" /> {{option.text}}\n" +
    "            </label>\n" +
    "        </span>\n" +
    "    </span>\n" +
    "\n" +
    "    <!--number/date/file/text-->\n" +
    "    <span ng-switch-default>\n" +
    "        <span ng-switch=\"field.formcontrol\">\n" +
    "\n" +
    "            <span ng-switch-when=\"colorpicker\">\n" +
    "                <input type=\"text\" colorpicker class=\"form-control\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"(edit && field.editable.edit=='readonly') || (add && field.editable.add=='readonly')\" id=\"{{field.name}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" ng-value=\"field.value\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\" />\n" +
    "            </span>\n" +
    "            <span ng-switch-when=\"datepicker\">\n" +
    "                <input type=\"text\" datepicker class=\"form-control\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"(edit && field.editable.edit=='readonly') || (add && field.editable.add=='readonly')\" id=\"{{field.name}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" ng-value=\"field.value\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\" />\n" +
    "            </span>\n" +
    "            <span ng-switch-when=\"imagepicker\">\n" +
    "                <img style=\"max-height:200px;_height:200px;\" ng-show=\"field.value.length>0\" ng-src=\"{{field.value}}\" />\n" +
    "                <input type=\"file\" imagepicker class=\"form-control\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"(edit && field.editable.edit=='readonly') || (add && field.editable.add=='readonly')\" id=\"{{field.name}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" ng-value=\"field.value\" placeholder=\"{{field.placeholder}}\" />\n" +
    "            </span>\n" +
    "            <span ng-switch-when=\"file\">\n" +
    "                <input type=\"file\" file class=\"form-control\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"(edit && field.editable.edit=='readonly') || (add && field.editable.add=='readonly')\" id=\"{{field.name}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" ng-value=\"field.value\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\" />\n" +
    "            </span>\n" +
    "            <span ng-switch-when=\"addon-color\">\n" +
    "                <div class=\"input-group  colorpicker-element\">\n" +
    "                    <span>\n" +
    "                        <input type=\"{{field.type}}\" style=\"color:{{model.Color}}\" class=\"form-control\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"(edit && field.editable.edit=='readonly') || (add && field.editable.add=='readonly')\" id=\"{{field.name}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" ng-value=\"field.value\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\" />\n" +
    "                    </span>\n" +
    "                    <span class=\"input-group-addon\" colorpicker color=\"model.Color\"><i style=\"background-color:{{model.Color}}\"></i></span>\n" +
    "                </div>\n" +
    "            </span>\n" +
    "            <span ng-switch-default>\n" +
    "                <input type=\"{{field.type}}\" class=\"form-control\" ng-class=\"field.class\" ng-required=\"filed.validate.required\" ng-readonly=\"(edit && field.editable.edit=='readonly') || (add && field.editable.add=='readonly')\" id=\"{{field.name}}\" name=\"{{field.name}}\" validate=\"{{field.validate}}\" ng-value=\"field.value\" ng-model=\"field.value\" placeholder=\"{{field.placeholder}}\" />\n" +
    "            </span>\n" +
    "        </span>\n" +
    "    </span>\n" +
    "</span>");
}]);

angular.module("/static/modules/Common/directives/grid.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/grid.html",
    "<div class=\"fixed-table-container\" style=\"padding-bottom: 0px;\">\n" +
    "        <div class=\"fixed-table-header\" style=\"display: none;\"><table></table></div>\n" +
    "        <div class=\"fixed-table-body\">\n" +
    "            <div class=\"fixed-table-loading\" style=\"top: 37px;\" ng-show=\"datalist.columns.length<=0\">正在努力地加载数据中，请稍候……</div>\n" +
    "\n" +
    "            <table data-toggle=\"table\" data-mobile-responsive=\"true\" class=\"table table-hover\" ng-show=\"datalist.columns.length>0\">\n" +
    "                <thead ng-if=\"!cardView\">\n" +
    "                    <tr>\n" +
    "                        <th class=\"bs-checkbox\"\n" +
    "                            data-field=\"ID\">\n" +
    "                            <div class=\"th-inner ui-grid-sortable\">\n" +
    "                                <input ng-change=\"fn.onSelectedAllRecotd()\" ng-model=\"isSelectAll\" type=\"checkbox\" />\n" +
    "                            </div>\n" +
    "                            <div class=\"fht-cell\" style=\"width: 36px;\"></div>\n" +
    "                        </th>\n" +
    "                        <th ng-class=\"{'bs-checkbox':column.uniqueId}\"\n" +
    "                            data-field=\"{{column.field}}\"\n" +
    "                            ng-repeat=\"column in datalist.columns\"\n" +
    "                            ng-if=\"column.display  && !column.uniqueId\">\n" +
    "                            <div ng-click=\"fn.onSortBy(column)\"\n" +
    "                                 ng-model=\"column.sortBy\"\n" +
    "                                 class=\"th-inner ui-grid-sortable\">\n" +
    "                                <!--<input ng-change=\"fn.onSelectedAllRecotd()\" ng-model=\"isSelectAll\" ng-if=\"column.uniqueId\" type=\"checkbox\" />-->\n" +
    "                                <span ng-if=\"!column.uniqueId\">{{column.title}}</span>\n" +
    "                                <!--标识列不显示排序-->\n" +
    "                                <span class=\"s-ico\" ng-show=\"!column.uniqueId && column.field==sortBy\">\n" +
    "                                    <span sort=\"asc\" class=\"ui-grid-ico-sort ui-icon-asc ui-sort-ltr glyphicon glyphicon-triangle-top\" ng-class=\"{'ui-disabled':sortReverse}\"></span>\n" +
    "                                    <span sort=\"desc\" class=\"ui-grid-ico-sort ui-icon-desc ui-sort-ltr glyphicon glyphicon-triangle-bottom\" ng-class=\"{'ui-disabled':!sortReverse}\"></span>\n" +
    "                                </span>\n" +
    "\n" +
    "                            </div>\n" +
    "                            <div class=\"fht-cell\" style=\"width: 36px;\"></div>\n" +
    "                        </th>\n" +
    "                        <th>\n" +
    "                            <div class=\"th-inner ui-grid-sortable\">操作</div>\n" +
    "                         \n" +
    "                        </th>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                    <tr ng-if=\"datalist.list.length<=0\" class=\"no-records-found\">\n" +
    "                        <td colspan=\"{{datalist.columns.length}}\">没有任何记录</td>\n" +
    "                    </tr>\n" +
    "                    <tr ng-repeat=\"item in datalist.list |orderBy:sortBy:sortReverse\"\n" +
    "                        ng-if=\"cardView && datalist.list.length>0 \">\n" +
    "                        <td colspan=\"5\">\n" +
    "                            <div ng-repeat=\"column in datalist.columns\" ng-if=\"column.display\" class=\"card-view\">\n" +
    "                                <span class=\"title\" style=\"\">{{column.title}}</span>\n" +
    "                                <span class=\"value\">{{fn.link(item,column.field)}}</span>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr ng-if=\"!cardView && datalist.list.length>0\"\n" +
    "                        ng-dblclick=\"fn.onDblClickSelectedRecord(item)\"\n" +
    "                        ng-repeat=\"item in datalist.list |orderBy:sortBy:sortReverse\">\n" +
    "                        <td class =\"bs-checkbox\">\n" +
    "                            <input ng-click=\"fn.onSelectedRecord(item)\" ng-model=\"item.selected\" type=\"checkbox\" value=\"{{fn.link(item,column.field)}}\" />\n" +
    "                            </td>\n" +
    "                        <td ng-class=\"{'bs-checkbox':column.uniqueId}\"\n" +
    "                            ng-if=\"column.display && !column.uniqueId\"\n" +
    "                            ng-repeat=\"column in datalist.columns\">\n" +
    "                            <!--<input ng-click=\"fn.onSelectedRecord(item)\" ng-if=\"column.uniqueId\" ng-model=\"item.selected\" type=\"checkbox\" value=\"{{fn.link(item,column.field)}}\" />-->\n" +
    "                            {{fn.link(item,column.field)}}\n" +
    "                        </td>\n" +
    "\n" +
    "                            <td><a ng-click=\"fn.onEdit(item)\">编辑</a></td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div class=\"fixed-table-footer\" ng-hide=\"true\">\n" +
    "            <table>\n" +
    "                <tbody>\n" +
    "                    <tr>\n" +
    "                        <td></td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div class=\"fixed-table-pagination\">\n" +
    "            <!--分页控件-->\n" +
    "            <pager-nav page-list=\"[5,10,20,25]\" \n" +
    "                       page=\"page\" \n" +
    "                       page-Size=\"pageSize\" \n" +
    "                       total-Count=\"totalCount\"               \n" +
    "\n" +
    "                        />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "");
}]);

angular.module("/static/modules/Common/directives/pager.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/pager.html",
    "<div>\n" +
    "\n" +
    "    <div class=\"pull-left pagination-detail\">\n" +
    "        <span class=\"pagination-info\">显示第 {{ 1+(pageSize * (page-1))}} 到第 {{pageSize * page}} 条记录，总共 {{totalCount}} 条记录</span>\n" +
    "        <span class=\"page-list\">\n" +
    "            每页显示 <span class=\"btn-group dropup\">\n" +
    "                <button type=\"button\" class=\"btn btn-default  btn-outline dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "                    <span class=\"page-size\">{{pageSize}}</span>\n" +
    "                    <span class=\"caret\"></span>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                    <li ng-repeat=\"s in pageList\" ng-class=\"fn.cssClass(s,pageSize)\">\n" +
    "                        <a ng-click=\"fn.onPageSizeChanged(s)\" href=\"javascript:void(0)\">{{s}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </span> 条记录\n" +
    "        </span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pull-right pagination\" Pagination\n" +
    "         ng-model=\"page\"      \n" +
    "         ng-change=\"fn.onPageChanged()\"   \n" +
    "         total-items=\"totalCount\"\n" +
    "         max-size=\"5\"\n" +
    "         previous-text=\"{{previousText}}\"\n" +
    "         next-text=\"{{nextText}}\"\n" +
    "         items-Per-Page=\"pageSize\">\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/preview.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/preview.html",
    "<div class=\"mask preview_mask\"></div>\n" +
    "<div class=\"img_preview_container\" id=\"preview_container\" ng-class=\"{loading: !isLoaded}\" ng-style=\"containerStyle\">\n" +
    "    <div class=\"img_container\" id=\"img_container\">\n" +
    "        <div class=\"img_wrp\" id=\"img_dom\">\n" +
    "            <!-- webkit 的 transform 有导致不 reflow 的bug，强行改变其子元素来强制reflow-->\n" +
    "            <span ng-if=\"reflowFlag\"></span>\n" +
    "            <img class=\"rotate{{rotateDeg}}\" ng-show=\"isLoaded\" id=\"img_preview\" />\n" +
    "            <a href=\"javascript:\" ng-click=\"actions.close();\" class=\"img_preview_close\" title=\"关闭\"><i class=\"web_wechat_close-window\"></i></a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"img_opr_container\" id=\"img_opr_container\">\n" +
    "        <ul class=\"img_opr_list\">\n" +
    "            <li class=\"img_opr_item\">\n" +
    "                <a ng-click=\"actions.prev()\" href=\"javascript:\" title=\"查看上一个\">\n" +
    "                    <i class=\"web_wechat_left\" ng-class=\"{'web_wechat_left_disable': current <= 0}\"></i>&nbsp;\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"img_opr_item\">\n" +
    "                <a download href=\"{{imageList[current].url + '?fun=download'}}\" title=\"下载图片\">\n" +
    "                    <i class=\"web_wechat_download\"></i>&nbsp;\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"img_opr_item\" ng-hide=\"isIE\">\n" +
    "                <a ng-click=\"actions.rotate()\" href=\"javascript:\" title=\"旋转图片\">\n" +
    "                    <i class=\"web_wechat_turn\"></i>&nbsp;\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"img_opr_item\">\n" +
    "                <a ng-click=\"actions.next()\" href=\"javascript:\" title=\"查看下一个\">\n" +
    "                    <i class=\"web_wechat_right\" ng-class=\"{'web_wechat_right_disable': current >= imageList.length - 1}\"></i>&nbsp;\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/static/modules/Common/directives/spinner-style1.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/spinner-style1.html",
    "<div class=\"spinner style1\">\n" +
    "    <div class=\"rect1\"></div>\n" +
    "    <div class=\"rect2\"></div>\n" +
    "    <div class=\"rect3\"></div>\n" +
    "    <div class=\"rect4\"></div>\n" +
    "    <div class=\"rect5\"></div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/spinner-style2.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/spinner-style2.html",
    "<div class=\"spinner style2\"></div>");
}]);

angular.module("/static/modules/Common/directives/spinner-style3.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/spinner-style3.html",
    "<div class=\"spinner style3\">\n" +
    "    <div class=\"bounce1\"></div>\n" +
    "    <div class=\"bounce2\"></div>\n" +
    "    <div class=\"bounce3\"></div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/spinner-style4.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/spinner-style4.html",
    "<div class=\"spinner style4\">\n" +
    "    <div class=\"spinner-container container1\">\n" +
    "        <div class=\"circle1\"></div>\n" +
    "        <div class=\"circle2\"></div>\n" +
    "        <div class=\"circle3\"></div>\n" +
    "        <div class=\"circle4\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"spinner-container container2\">\n" +
    "        <div class=\"circle1\"></div>\n" +
    "        <div class=\"circle2\"></div>\n" +
    "        <div class=\"circle3\"></div>\n" +
    "        <div class=\"circle4\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"spinner-container container3\">\n" +
    "        <div class=\"circle1\"></div>\n" +
    "        <div class=\"circle2\"></div>\n" +
    "        <div class=\"circle3\"></div>\n" +
    "        <div class=\"circle4\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/spinner-style5.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/spinner-style5.html",
    "<div class=\"spinner style5\">\n" +
    "    <div class=\"double-bounce1\"></div>\n" +
    "    <div class=\"double-bounce2\"></div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/spinner-style6.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/spinner-style6.html",
    "<div class=\"spinner style6\">\n" +
    "    <div class=\"cube1\"></div>\n" +
    "    <div class=\"cube2\"></div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/spinner-style7.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/spinner-style7.html",
    "<div class=\"spinner style7\">\n" +
    "    <div class=\"dot1\"></div>\n" +
    "    <div class=\"dot2\"></div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Common/directives/timeline.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/timeline.html",
    "<ul class=\"timeline\" >\n" +
    "    <li ng-repeat=\"item in timePoints\" class=\"{{$index%2===0?'':'timeline-inverted'}}\" ng-class=\"{'active': currentIdx == $index}\" style=\"z-index: {{1000 + timePoints.length - $index}}\">\n" +
    "        <div class=\"timeline-badge\"><i ng-if=\"item.icon\" class=\"glyphicon {{item.icon}}\"></i></div>\n" +
    "        <div class=\"timeline-panel\"  ng-click=\"onClick($index);\">\n" +
    "            <div class=\"timeline-heading\">\n" +
    "                <p><small class=\"text-muted\"><i class=\"glyphicon glyphicon-time\"></i>{{item.datetime|date:'yyyy-MM-dd'}}</small></p>\n" +
    "                <h4 class=\"timeline-title\">{{item.title}}</h4>\n" +
    "            </div>\n" +
    "            <div class=\"timeline-body\">\n" +
    "                <p ng-repeat=\"p in item.contents\">{{p}}</p>\n" +
    "                <p ng-if=\"item.showDetail\" class=\"detail\"><a ng-click=\"onDetail(item);\" style=\"z-index:500;\">{{'查看详情' | translate}}<i class=\"glyphicon glyphicon-circle-arrow-right\"></i></a></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("/static/modules/Common/directives/uploader.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Common/directives/uploader.html",
    "<div class=\"webuploader\">\n" +
    "    <form  enctype=\"multipart/form-data\" id=\"{{formName}}\" name=\"{{formName}}\">\n" +
    "        <input type=\"file\"\n" +
    "               multiple\n" +
    "               class=\"form-control\" \n" +
    "               accept=\"{{accept}}\"\n" +
    "               name=\"{{formName}}_file\" \n" +
    "               ng-model=\"uploadFile\" \n" +
    "               onchange=\"angular.element(this).scope().onFileChange(this)\" />\n" +
    "        <label></label>\n" +
    "    </form>\n" +
    "</div>");
}]);
});