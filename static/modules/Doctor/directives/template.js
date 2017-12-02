/*! 康美网络医院 - v1.0.0 - 2017-11-22 14:34:11 自动生成
 */
define(['angular'], function(angular){angular.module('templates-directive-doctor', ['/static/modules/Doctor/directives/Assistant.html', '/static/modules/Doctor/directives/chat-Session-Consults.html', '/static/modules/Doctor/directives/chat-Session-OfflineClinics.html', '/static/modules/Doctor/directives/chat-Session-OnlineClinics.html', '/static/modules/Doctor/directives/chat-detail-Diagnose.html', '/static/modules/Doctor/directives/chat-detail-Inquiries.html', '/static/modules/Doctor/directives/chat-detail-PatientInfo.html', '/static/modules/Doctor/directives/chat-detail-Recipe.html', '/static/modules/Doctor/directives/chat-view-AudioConsult.html', '/static/modules/Doctor/directives/chat-view-NotSession.html', '/static/modules/Doctor/directives/chat-view-OfflineClinic.html', '/static/modules/Doctor/directives/chat-view-TextConsult.html', '/static/modules/Doctor/directives/chat-view-VideoConsult.html', '/static/modules/Doctor/directives/editor-Diagnose-Template1.html', '/static/modules/Doctor/directives/editor-Diagnose-Template2.html', '/static/modules/Doctor/directives/editor-Patient.html', '/static/modules/Doctor/directives/editor-Recipe-Diagnosis.html', '/static/modules/Doctor/directives/editor-Recipe-Drugs.html', '/static/modules/Doctor/directives/editor-Recipe-Formular.html', '/static/modules/Doctor/directives/modal-Assistant-Diagnose.html', '/static/modules/Doctor/directives/modal-Diagnose-Summary.html', '/static/modules/Doctor/directives/modal-Service-Detail.html']);

angular.module("/static/modules/Doctor/directives/Assistant.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/Assistant.html",
    "<div class=\"modal fade\"role=\"dialog\">\n" +
    "\n" +
    "</div><!-- /.modal -->");
}]);

angular.module("/static/modules/Doctor/directives/chat-Session-Consults.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-Session-Consults.html",
    "<div>\n" +
    "    <div class=\"text-center\" ng-show=\"loading\">\n" +
    "        <img src=\"/static/images/ico_loading.gif\" /> <span>{{'Room-lblLoading'|translate}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"accept\" has-permission='KMEHosp.Doctor.Room.Task.TakeTextConsultTask'>\n" +
    "        <div class=\"center-align\">\n" +
    "            <div class=\"bubble\" ng-class=\"{'active': Statistics.TextConsultTotalCount > 0 ? true : false}\">\n" +
    "                <span>等待回答 </span><br />\n" +
    "                <span class=\"strong\">\n" +
    "                    {{(Statistics.TextConsultTotalCount || 0)}}人\n" +
    "                </span>\n" +
    "                <div class=\"wave\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"text\">\n" +
    "                今日已回答{{(Statistics.TextConsultAlreadyCount || 0)}}人\n" +
    "            </div>\n" +
    "            <button ng-disabled=\"Statistics.TextConsultTotalCount<=0 || disableTakeButton\" class=\"btn room-btn room-btn-primary\" ng-click=\"take()\"><i class=\"receivt-icon\"></i><span class=\"btn-right-text\">我来回答</span></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"chat_wrapper\" ng-repeat=\"item in Records track by item.Room.ChannelID\">\n" +
    "        <div class=\"chat_item slide-left\"\n" +
    "             ng-click=\"enter(item)\"\n" +
    "             ng-class=\"{'active': item.Room.ChannelID==room.ChannelID, 'top':item.IsTop}\">\n" +
    "            <div class=\"ext\">\n" +
    "                <p class=\"attr\">\n" +
    "                    <span>{{item.MessageTime}} </span>\n" +
    "                </p>\n" +
    "                <p class=\"attr label-status\">                 \n" +
    "                    <span ng-switch=\"item.Order.CostType\">\n" +
    "                        <span ng-switch-when=\"0\" class=\"label-info\">\n" +
    "                            {{'Room-lblConsultType-0'|translate}}\n" +
    "                        </span>\n" +
    "                        <span ng-switch-when=\"1\" class=\"label-default\">\n" +
    "                            {{'Room-lblConsultType-1'|translate}}\n" +
    "                        </span>\n" +
    "                        <span ng-switch-when=\"2\" class=\"label-info\">\n" +
    "                            {{'Room-lblConsultType-2'|translate}}\n" +
    "                        </span>\n" +
    "                        <span ng-switch-when=\"3\" class=\"label-info\">\n" +
    "                            {{'Room-lblConsultType-3'|translate}}\n" +
    "                        </span>\n" +
    "                        <span ng-switch-when=\"4\" class=\"label-info\">\n" +
    "                            {{'Room-lblConsultType-4'|translate}}\n" +
    "                        </span>\n" +
    "                        <span ng-switch-when=\"5\" class=\"label-info\">\n" +
    "                            {{'Room-lblConsultType-5'|translate}}\n" +
    "                        </span>\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "            <div class=\"avatar\">\n" +
    "                <img class=\"img\" ng-src=\"{{item.PhotoUrl}}\" alt=\"\">\n" +
    "                <i class=\"icon reddot\" ng-if=\"item.UnreadMsgNum>0\">\n" +
    "                    {{item.UnreadMsgNum}}\n" +
    "                </i>\n" +
    "            </div>\n" +
    "            <div class=\"status-default\">\n" +
    "                <span ng-if=\"item.Room.RoomState == 2 || item.Room.RoomState == 3\" class=\"info-grey\">已回复</span>\n" +
    "                <span ng-if=\"item.Room.RoomState != 2 && item.Room.RoomState != 3\" class=\"info-red\">未回复</span>\n" +
    "            </div>\n" +
    "            <div class=\"info\">\n" +
    "                <h3 class=\"nickname\">\n" +
    "                    <span class=\"nickname_text\">{{item.NickName}}</span>\n" +
    "                </h3>\n" +
    "                <p class=\"msg\">\n" +
    "                    <span ng-if=\"item.UnreadMsgNum>0\">[{{item.UnreadMsgNum}}条]</span>\n" +
    "                    <span ng-bind-html=\"item.MessageContent\"></span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"text-center\" ng-if=\"Records.length<=0\">\n" +
    "        <br />\n" +
    "        {{'Room-lblNoRecord'|translate}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/chat-Session-OfflineClinics.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-Session-OfflineClinics.html",
    "<div>\n" +
    "    <div class=\"text-center\" ng-show=\"loading\">\n" +
    "        <img src=\"/static/images/ico_loading.gif\" /> <span>{{'Room-lblLoading'|translate}}</span>\n" +
    "    </div>\n" +
    "    <div ng-if=\"Records.length>0\">\n" +
    "        <div class=\"scroll-container\">\n" +
    "            <table class=\"table table-condensed table-striped\">\n" +
    "                <thead>\n" +
    "                    <tr>\n" +
    "                        <th class=\"col-md-3 text-center\">\n" +
    "                            {{'lblMedicalCardID'|translate}}\n" +
    "                        </th>\n" +
    "                        <th class=\"col-md-3 text-center\">\n" +
    "                            {{'lblName'|translate}}\n" +
    "                        </th>\n" +
    "                        <th class=\"col-md-3 text-center\">\n" +
    "                            {{'lblSection'|translate}}\n" +
    "                        </th>\n" +
    "                        <!--<th class=\"col-md-1 text-center\">\n" +
    "                            {{'lblSex'|translate}}\n" +
    "                        </th>-->\n" +
    "                        <!--<th class=\"col-md-2 text-center\">\n" +
    "                            {{'lblAge'|translate}}\n" +
    "                        </th>-->\n" +
    "                        <th class=\"col-md-2 text-center\">\n" +
    "                            {{'lblStatus'|translate}}\n" +
    "                        </th>\n" +
    "                        <th class=\"col-md-2 text-center\">\n" +
    "                            {{'lblOperator'|translate}}\n" +
    "                        </th>\n" +
    "\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                    <tr ng-repeat=\"item in Records track by item.RegID\" title=\"{{item.RegID}}\">\n" +
    "                        <td class=\"text-center\">\n" +
    "                            {{item.MedicalcardID}}\n" +
    "                        </td>\n" +
    "                        <td class=\"text-center\">\n" +
    "                            {{item.PatientName}}\n" +
    "                        </td>\n" +
    "                        <td class=\"text-center\">\n" +
    "                            {{item.DeptName}}\n" +
    "                        </td>\n" +
    "                        <!--<td class=\"text-center\">\n" +
    "                            {{item.Sex}}\n" +
    "                        </td>\n" +
    "                        <td class=\"text-center\">\n" +
    "                            {{item.Age}}\n" +
    "                        </td>-->\n" +
    "                        <td class=\"text-center\">              \n" +
    "                            <span>\n" +
    "                                {{getState(item.State)}}\n" +
    "                            </span>\n" +
    "                        </td>\n" +
    "                        <td class=\"text-center\">\n" +
    "                            <!--当还没有连接的时候，可以呼叫候诊的患者-->\n" +
    "                            <button ng-if=\"item.State==30 || item.State==50\" class=\"btn btn-xs btn-success\"\n" +
    "                                    ng-click=\"detail(item)\">\n" +
    "                                {{'btnDetail'|translate}}\n" +
    "                            </button>\n" +
    "                        </td>\n" +
    "\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-success btn-block\" ng-click=\"CallNext()\">\n" +
    "            呼叫患者\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"text-center\" ng-if=\"Records.length<=0\">\n" +
    "        <br />\n" +
    "        {{'Room-lblNoRecord'|translate}}\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/chat-Session-OnlineClinics.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-Session-OnlineClinics.html",
    "<div>\n" +
    "    <div class=\"text-center\" ng-show=\"loading\">\n" +
    "        <img src=\"/static/images/ico_loading.gif\" /> <span>{{'Room-lblLoading'|translate}}</span>\n" +
    "    </div>\n" +
    "    <!--有领取视频咨询任务权限才显示-->\n" +
    "    <div class=\"accept\" has-permission=\"KMEHosp.Doctor.Room.Task.TakeVideoConsultTask\" ng-if=\"doctorType == 3\">\n" +
    "        <div class=\"center-align\">\n" +
    "            <div class=\"bubble\" ng-class=\"{'active': Statistics.VideoConsultTotalCount > 0 ? true : false}\">\n" +
    "                <span>等待看诊 </span><br />\n" +
    "                <span class=\"strong\">\n" +
    "                    {{(Statistics.VideoConsultTotalCount || 0)}}人\n" +
    "                </span>\n" +
    "                <div class=\"wave\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"text\">\n" +
    "                今日接诊<span>{{(Statistics.VideoConsultAlreadyCount || 0)}}</span>人\n" +
    "            </div>\n" +
    "            <button  ng-disabled=\"Statistics.VideoConsultTotalCount<=0 || disableTakeButton\" class=\"btn room-btn room-btn-primary\" ng-click=\"take()\"><i class=\"receivt-icon\"></i><span class=\"btn-right-text\">我来接诊</span></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- 此处由前端设计处理，目前仅用来调通流程用 -->\n" +
    "    <div class=\"row-list-hj\">\n" +
    "        <span class=\"text-left\">待接诊</span>\n" +
    "        <span class=\"pull-right\">\n" +
    "            <button class=\"btn room-btn room-btn-primary\" ng-click=\"call()\" ng-disabled=\"!isWaitingExist\"><i class=\"jienum-icon\"></i><span class=\"btn-right-text\">叫号</span></button>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <!-- 此处由前端设计处理，目前仅用来调通流程用 -->\n" +
    "    <div ng-if=\"Records.length<=0\" class=\"text-center success-text\">\n" +
    "        {{'Room-lblNoRecord' |translate}}\n" +
    "    </div>\n" +
    "    <div class=\"chat_wrapper\" ng-repeat=\"item in Records track by item.Room.ChannelID\">\n" +
    "        <div class=\"chat_item slide-left\"     \n" +
    "             ng-class=\"{'active': item.Room.ChannelID==room.ChannelID,\n" +
    "             'top':item.Room.RoomState==1 || item.Room.RoomState==2  || item.Room.RoomState==6 || item.Room.RoomState==7}\"\n" +
    "             ng-click=\"enter(item)\">\n" +
    "            <div class=\"ext\">\n" +
    "                <p class=\"attr\">\n" +
    "                    <span>{{item.Schedule.StartTime}}~{{item.Schedule.EndTime}}</span>\n" +
    "                </p>\n" +
    "                <p class=\"attr\">\n" +
    "                    <button ng-if=\"item.Room.RoomState == 1\" class=\"btn room-btn room-btn-primary\" ng-click=\"enter(item, $event)\"><i class=\"jzn-icon\"></i><span class=\"btn-right-text\">{{'接诊'|translate}}</span></button>\n" +
    "                    <!--<button ng-if=\"item.Room.RoomState == 6\" class=\"btn room-btn room-btn-primary\" ng-click=\"pass(item, $event)\"><i class=\"jgn-icon\"></i><span class=\"btn-right-text\">{{'过号'|translate}}</span></button>-->\n" +
    "                </p>\n" +
    "            </div>\n" +
    "            <div class=\"avatar\">\n" +
    "                <img class=\"img\" ng-src=\"{{item.PhotoUrl}}\" alt=\"\">\n" +
    "                <i class=\"icon reddot\" ng-if=\"item.UnreadMsgNum>0\">\n" +
    "                    {{item.UnreadMsgNum}}\n" +
    "                </i>\n" +
    "            </div>\n" +
    "            <span class=\"status-default\" ng-switch=\"item.Room.RoomState\">\n" +
    "                <span ng-switch-when=\"0\" class=\"text-default\">\n" +
    "                    {{'Room-lblRoomState-0'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"1\" class=\"text-info\">\n" +
    "                    {{'Room-lblRoomState-1'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"7\" class=\"text-info\">\n" +
    "                    {{'Room-lblRoomState-1'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"2\" class=\"text-success\">\n" +
    "                    {{'Room-lblRoomState-2'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"4\" class=\"text-primary\">\n" +
    "                    {{'Room-lblRoomState-4'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"5\" class=\"text-danger\">\n" +
    "                    {{'Room-lblRoomState-5'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-when=\"6\" class=\"text-danger\">\n" +
    "                    {{'Room-lblRoomState-6'|translate}}\n" +
    "                </span>\n" +
    "                <span ng-switch-default class=\"text-default\">\n" +
    "                    {{'Room-lblRoomState-0'|translate}}\n" +
    "                </span>\n" +
    "            </span>\n" +
    "            <div class=\"info clearfix\">\n" +
    "                <h3 class=\"nickname\">\n" +
    "                    <span class=\"nickname_text\" style=\"width: auto;\">{{item.NickName}}</span>\n" +
    "                </h3>\n" +
    "                <p class=\"msg\">\n" +
    "                    <span ng-if=\"item.UnreadMsgNum>0\">[{{item.UnreadMsgNum}}条]</span>\n" +
    "                    <span ng-bind-html=\"item.MessageContent\"></span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row-list-hj active\">\n" +
    "        <span class=\"text-left\">已接诊</span>\n" +
    "        <span class=\"pull-right\">总接诊<b>{{ FinishRecords.length }}</b>人</span>\n" +
    "    </div>\n" +
    "    <div ng-if=\"FinishRecords.length<=0\" class=\"text-center success-text\">\n" +
    "        {{'Room-lblNoRecord' |translate}}\n" +
    "    </div>\n" +
    "    <div ng-repeat=\"item in FinishRecords track by item.Room.ChannelID\">\n" +
    "        <div class=\"chat_item slide-left\"\n" +
    "             ng-click=\"enter(item)\">\n" +
    "            <div class=\"ext\">\n" +
    "                <p class=\"attr\">\n" +
    "                    <span>{{item.Schedule.StartTime}}~{{item.Schedule.EndTime}}</span>\n" +
    "                </p>\n" +
    "                <p class=\"attr attr-btn\">\n" +
    "                    <button class=\"btn room-btn room-btn-primary\" ng-click=\"enter(item, 'diagnose', $event)\" ng-disabled=\"item.IsDiagnosed\">\n" +
    "                        <i class=\"btm-zicon\"></i>\n" +
    "                        <span class=\"btn-right-text\" >{{'下诊断'|translate}}</span>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn room-btn room-btn-primary\" ng-click=\"enter(item, 'recipe', $event)\" ng-disabled=\"item.RecipeSignedCount >= 3\">\n" +
    "                        <i class=\"report-icon\"></i>\n" +
    "                        <span class=\"btn-right-text\">{{'开处方'|translate}}</span>\n" +
    "                    </button>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "            <div class=\"avatar\">\n" +
    "                <img class=\"img\" ng-src=\"{{item.PhotoUrl}}\" alt=\"\">\n" +
    "                <i class=\"icon reddot\" ng-if=\"item.UnreadMsgNum>0\">\n" +
    "                    {{item.UnreadMsgNum}}\n" +
    "                </i>\n" +
    "            </div>\n" +
    "            <div class=\"status-default\">\n" +
    "                <span class=\"text-default\">\n" +
    "                    {{'Room-lblRoomState-3'|translate}}\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"info clearfix\">\n" +
    "                <h3 class=\"nickname\">\n" +
    "                    <span class=\"nickname_text\" style=\"width: auto;\">{{item.NickName}}</span>\n" +
    "                </h3>\n" +
    "                <p class=\"msg\">\n" +
    "                    <span ng-if=\"item.UnreadMsgNum>0\">[{{item.UnreadMsgNum}}条]</span>\n" +
    "                    <span ng-bind-html=\"item.MessageContent\"></span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/chat-detail-Diagnose.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-detail-Diagnose.html",
    "<div class=\"col-md-12\" style=\"height:calc(100% - 135px); overflow-y:auto; \">\n" +
    "    <div class=\"diagnose-model\">\n" +
    "        <div class=\"pull-right\">\n" +
    "            <div class=\"btn-group pull-left\">\n" +
    "                <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-sm\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "                    <span class=\"glyphicon glyphicon-plus  text-success\"></span> {{'诊断模板'|translate}} <span class=\"caret\"></span>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\">\n" +
    "                    <li><a ng-click=\"onCreateDiagnoseTemplate()\">{{'新建'|translate}}</a></li>\n" +
    "                    <li><a data-toggle=\"modal\" data-target=\"#modal-diagnose-templates\">{{'模板集'|translate}}</a></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <br />\n" +
    "        <br />\n" +
    "\n" +
    "        <form id=\"form-Diagnose\" form-Validate on-submit=\"onSubmitDiagnose()\" style=\"height:100%;\">\n" +
    "            <!--<editor-Patient ng-if=\"OPDRegisterID!='' && roomType == 'online'\" is-Read-Only=\"isReadOnly\"></editor-Patient>-->\n" +
    "            <!--通过线下还是显示看诊来显示诊断编辑界面-->\n" +
    "            <editor-diagnose ng-if=\"OPDRegisterID!='' && roomType == 'online'\" templateUrl=\"/static/modules/Doctor/directives/editor-Diagnose-Template1.html\" Diagnose=\"DiagnoseInfo\" is-Read-Only=\"isReadOnly\"></editor-diagnose>\n" +
    "            <!--通过线下还是显示看诊来显示诊断编辑界面-->\n" +
    "            <editor-diagnose ng-if=\"OPDRegisterID!='' && roomType == 'offline'\" templateUrl=\"/static/modules/Doctor/directives/editor-Diagnose-Template2.html\" Diagnose=\"DiagnoseInfo\" is-Read-Only=\"isReadOnly\"></editor-diagnose>\n" +
    "\n" +
    "            <div class=\"text-right\">\n" +
    "                <button class=\"btn btn-info text-center\" ng-disabled=\"(OPDRegisterID=='' || isReadOnly)\" ng-click=\"onSaveDiagnose()\" type=\"button\">{{'btnSubmit'|translate}}</button>\n" +
    "                <!--<button class=\"btn btn-info text-center\" ng-disabled=\"(OPDRegisterID=='' || isReadOnly)\" type=\"submit\">{{'Room-btnSubmitDiagnose'|translate}}</button>-->\n" +
    "            </div>\n" +
    "            <br />\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--诊断模板新增编辑-->\n" +
    "<div class=\"modal fade\" id=\"modal-diagnose-template\" role=\"dialog\">\n" +
    "    <div class=\"modal-dialog\" role=\"document\">\n" +
    "        <div class=\"modal-content\" style=\"width: 500px;\">\n" +
    "            <div class=\"modal-header modal-header-bg\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <h4 class=\"modal-title  text-center\">{{'诊断模板'|translate}}</h4>\n" +
    "            </div>\n" +
    "\n" +
    "            <form id=\"form-diagnose-template\" form-Validate on-submit=\"onSubmitDiagnoseTemplate()\">\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"preliminaryDiagnosis\"><font class=\"text-danger\">*</font>{{'初步诊断'|translate}}：</label>\n" +
    "                        <textarea name=\"preliminaryDiagnosis\" class=\"form-control\" ng-model=\"diagnoseTempl.preliminaryDiagnosis\" style=\"resize : none;\"\n" +
    "                                  placeholder=\"{{'请输入初步诊断'|translate}}\"\n" +
    "                                  validate=\"{required:true,messages:{required:'{{'请输入初步诊断'|translate}}'}}\">\n" +
    "                            {{diagnoseSummary.MedicalRecord.PreliminaryDiagnosis}}\n" +
    "                        </textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"advised\"><font class=\"text-danger\">*</font>{{'治疗意见'|translate}}：</label>\n" +
    "                        <textarea name=\"advised\" class=\"form-control\" ng-model=\"diagnoseTempl.advised\" style=\"resize : none;\"\n" +
    "                                  placeholder=\"{{'请输入治疗意见'|translate}}\"\n" +
    "                                  validate=\"{required:true,messages:{required:'{{'请输入医生建议'|translate}}'}}\">\n" +
    "                            {{diagnoseSummary.MedicalRecord.Advised}}\n" +
    "                        </textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-info\">{{'btnSave'|translate}}</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">{{'btnClose'|translate}}</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--诊断模板集合-->\n" +
    "<div class=\"modal fade\" id=\"modal-diagnose-templates\" role=\"dialog\">\n" +
    "    <div class=\"modal-dialog\" role=\"dialog\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <div class=\"modal-header modal-header-bg\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <h4 class=\"modal-title text-center\">{{'诊断模板集合'|translate}}</h4>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body text-center\">\n" +
    "                <table class=\"table table-responsive table-bordered\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <th class=\"text-center\" width=\"60\">{{'Room-lblIndex'|translate}}</th>\n" +
    "                            <th class=\"text-left\">{{'模板名称'|translate}}</th>\n" +
    "                            <th class=\"text-center\" width=\"100\">{{'Room-lblOperator'|translate}}</th>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"item in diagnoseTemps\">\n" +
    "                            <td>{{$index+1}}</td>\n" +
    "                            <td class=\"text-left\">\n" +
    "                                {{item.Name}}\n" +
    "                            </td>\n" +
    "                            <td width=\"160\">\n" +
    "                                <button class=\"btn btn-info btn-xs\" href=\"javascript:void(0);\" ng-click=\"onEditDiagnoseTemplContent(item)\">{{'btnEdit'|translate}}</button>\n" +
    "                                <button class=\"btn btn-danger btn-xs\" href=\"javascript:void(0);\" ng-click=\"onRemoveDiagnoseTemplContent(item)\">{{'btnDelete'|translate}}</button>\n" +
    "                                <button class=\"btn btn-info btn-xs\" href=\"javascript:void(0);\" ng-click=\"onCopyDiagnoseTemplContent(item)\" ng-disabled=\"isReadOnly\">{{'lblSelect'|translate}}</button>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <!--分页控件-->\n" +
    "                <pager-nav page-list=\"[5,10]\"\n" +
    "                           page=\"diagnoseTemplPager.page\"\n" +
    "                           page-Size=\"diagnoseTemplPager.pageSize\"\n" +
    "                           total-Count=\"diagnoseTemplPager.totalCount\" loadData=\"false\" on-change=\"onGetDiagnoseTempls()\" />\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/chat-detail-Inquiries.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-detail-Inquiries.html",
    "<style>\n" +
    "    .mytb { width: 100%; margin-top: 25px; border-top: solid 1px #E7E7EB; border-left: solid 1px #E7E7EB; }\n" +
    "        .mytb td { border-right: solid 1px #E7E7EB; border-bottom: solid 1px #E7E7EB; vertical-align: middle; padding: 15px; }\n" +
    "        .mytb .tit { width: 15%; text-align: right; }\n" +
    "        .mytb .con { width: 35%; }\n" +
    "    .error { color: #a94442; }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"main-content\" style=\"margin-top:0px;\">\n" +
    "    <table class=\"mytb\" border=\"0\">\n" +
    "        <tr>\n" +
    "            <td class=\"tit\">{{'患者姓名' | translate}}</td>\n" +
    "            <td class=\"con\">{{patientInfo.MemberName}} </td>\n" +
    "            <td class=\"tit\">{{'联系电话' | translate}}</td>\n" +
    "            <td class=\"con\">{{patientInfo.Mobile}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"tit\">{{'主诉' | translate}}</td>\n" +
    "            <td class=\"con\" colspan=\"3\">{{MedicalRecord.Sympton}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"tit\">{{'现病史' | translate}}</td>\n" +
    "            <td class=\"con\" colspan=\"3\">{{MedicalRecord.PresentHistoryIllness}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"tit\">{{'既往病史' | translate}}</td>\n" +
    "            <td class=\"con\" colspan=\"3\">{{MedicalRecord.PastMedicalHistory}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"tit\">{{'初步诊断' | translate}}</td>\n" +
    "            <td class=\"con\" colspan=\"3\">{{MedicalRecord.PreliminaryDiagnosis}}</td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"tit\">{{'医嘱' | translate}}</td>\n" +
    "            <td class=\"con\" colspan=\"3\">{{MedicalRecord.Advised}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"tit\">{{'体格检查' | translate}}</td>\n" +
    "            <td class=\"con\" colspan=\"3\">\n" +
    "                <div ng-repeat=\"item in PhysicalExam\" class=\"form-group col-md-6\">\n" +
    "                    <span class=\"input-group-addon\" style=\"border:0px; text-align:left\">\n" +
    "                        <label>{{item.ItemCNName}}({{item.ItemENName}})：</label>\n" +
    "                        {{item.Result}}  {{item.Unit}}\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr ng-if=\"RecipeFiles == null || RecipeFiles.length == 0\">\n" +
    "            <td class=\"tit\">处方</td>\n" +
    "            <td class=\"con\" colspan=\"3\">\n" +
    "                暂无处方\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"recipeFile in RecipeFiles|orderBy:'RecipeType'\">\n" +
    "            <td class=\"tit\">\n" +
    "                {{recipeFile.RecipeName}}<br />\n" +
    "                ({{recipeFile.RecipeTypeName}})\n" +
    "            </td>\n" +
    "            <td class=\"con\" colspan=\"3\">\n" +
    "                <div id=\"prescriptionData\" class=\"pharmacy\">\n" +
    "                    <div>\n" +
    "                        <!--处方->诊断 -->\n" +
    "                        <table cellspacing=\"0\" class=\"table table-bordered table-striped\">\n" +
    "                            <thead>\n" +
    "                                <tr>\n" +
    "                                    <th width=\"280\">诊断名称</th>\n" +
    "                                    <th>备注</th>\n" +
    "                                </tr>\n" +
    "                            </thead>\n" +
    "                            <tbody>\n" +
    "                                <tr ng-if=\"recipeFile.DiagnoseList == null || recipeFile.DiagnoseList.length == 0\">\n" +
    "                                    <td colspan=\"2\">无</td>\n" +
    "                                </tr>\n" +
    "                                <tr ng-repeat=\"item in recipeFile.DiagnoseList\">\n" +
    "                                    <td>{{item.Detail.DiseaseName}}</td>\n" +
    "                                    <td>{{item.Description}}</td>\n" +
    "                                </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                        <div ng-if=\"recipeFile.RecipeType == 1\">\n" +
    "                            <table cellspacing=\"0\" class=\"table table-striped table-bordered\">\n" +
    "                                <thead>\n" +
    "                                    <tr>\n" +
    "                                        <th width=\"280\">药品名称</th>\n" +
    "                                        <th>剂量</th>\n" +
    "                                        <th>价格</th>\n" +
    "                                    </tr>\n" +
    "                                </thead>\n" +
    "                                <tbody>\n" +
    "                                    <tr ng-if=\"recipeFile.Details == null || recipeFile.Details.length == 0\">\n" +
    "                                        <td colspan=\"3\">无</td>\n" +
    "                                    </tr>\n" +
    "                                    <tr ng-repeat=\"drugItem in recipeFile.Details\">\n" +
    "                                        <td>{{drugItem.Drug.DrugName}}</td>\n" +
    "                                        <td>{{drugItem.Dose}}{{drugItem.Drug.DoseUnit}}</td>\n" +
    "                                        <td>￥{{((drugItem.Dose || 1) * (drugItem.Drug.UnitPrice || 0)) |number:'2'}}</td>\n" +
    "                                    </tr>\n" +
    "                                </tbody>\n" +
    "                            </table>\n" +
    "                            <div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label>剂数</label>\n" +
    "                                    <span class=\"input-group input-group-sm\">\n" +
    "                                        共{{recipeFile.TCMQuantity}}剂\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label>用法</label>\n" +
    "                                    <span class=\"input-group input-group-sm\">\n" +
    "                                        {{recipeFile.Usage}}\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"recipeFile.RecipeType ==2\">\n" +
    "                            <table cellspacing=\"0\" class=\"table table-striped table-bordered\">\n" +
    "                                <thead>\n" +
    "                                    <tr>\n" +
    "                                        <th width=\"240\">药品名称</th>\n" +
    "                                        <th>计费数量</th>\n" +
    "                                        <th>价格</th>\n" +
    "                                        <th>剂量</th>\n" +
    "                                        <th>频率</th>\n" +
    "                                        <th>用药途径</th>\n" +
    "                                    </tr>\n" +
    "                                </thead>\n" +
    "                                <tbody>\n" +
    "                                    <tr ng-if=\"recipeFile.Details == null || recipeFile.Details.length == 0\">\n" +
    "                                        <td colspan=\"6\">无</td>\n" +
    "                                    </tr>\n" +
    "                                    <tr ng-repeat=\"drugItem in recipeFile.Details\">\n" +
    "                                        <td>{{drugItem.Drug.DrugName}} </td>\n" +
    "                                        <td>{{drugItem.Quantity}} {{drugItem.Drug.Unit}}</td>\n" +
    "                                        <td>￥{{((drugItem.Quantity || 1) * (drugItem.Drug.UnitPrice || 0))|number:'2'}}</td>\n" +
    "                                        <td>{{drugItem.Dose}} {{drugItem.Drug.DoseUnit}}</td>\n" +
    "                                        <td>{{drugItem.Frequency}}</td>\n" +
    "                                        <td>{{drugItem.DrugRouteName}}</td>\n" +
    "                                    </tr>\n" +
    "                                </tbody>\n" +
    "                            </table>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "    \n" +
    "</div>");
}]);

angular.module("/static/modules/Doctor/directives/chat-detail-PatientInfo.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-detail-PatientInfo.html",
    "<!--患者信息-->\n" +
    "<div class=\"patient-info toggle-view\">\n" +
    "    <div class=\"info-title text-center\">\n" +
    "        <div class=\"toolbar clearfix\">\n" +
    "            <a class=\"tool\" ng-class=\"{active: tabId=='PatientCondition'}\" ng-click=\"onHeaderNavClick('PatientCondition')\">{{'就诊信息'|translate}}</a>\n" +
    "            <a class=\"tool\" ng-class=\"{active: tabId=='EMR'}\" ng-click=\"onHeaderNavClick('EMR')\">{{headerNav['EMR']|translate}}</a>\n" +
    "            <span class=\"dropdown\">\n" +
    "                <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "                    {{'其他'|translate}}\n" +
    "                    <b class=\"caret\"></b>\n" +
    "                </a>\n" +
    "                <ul class=\"dropdown-menu my-dropdown-menu\" style=\"padding: 0; left: -40px;\">\n" +
    "                    <li><a ng-href=\"Doctor/GoToHealthManage\" target=\"_blank\">{{'健康档案'|translate}}</a></li>\n" +
    "                    <li><a ng-click=\"onHeaderNavClick('PACS')\">{{headerNav['PACS']}}</a></li>\n" +
    "                    <li><a ng-click=\"onHeaderNavClick('Visits')\">{{headerNav['Visits']}}</a></li>\n" +
    "                </ul>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"toggle-view tabs\">\n" +
    "    <!-- 就诊信息 -->\n" +
    "    <div ng-if=\"tabId=='PatientCondition'\">\n" +
    "        <table class=\"table table-striped patient-info-table\">\n" +
    "            <tbody>\n" +
    "                <!--<tr ng-if=\"patientInfo.MemberID == null\">\n" +
    "                    <td class=\"info-defect bg-danger\" colspan=\"2\" data-toggle=\"modal\" data-target=\"#dialog-patient-info\"><i class=\"glyphicon glyphicon-exclamation-sign\"></i> {{'就诊人信息缺失'|translate}}</td>\n" +
    "                </tr>-->\n" +
    "                <tr>\n" +
    "                    <td style=\"letter-spacing: 18px; text-align: right;\">{{'lblName'|translate}}</td>\n" +
    "                    <td>：</td>\n" +
    "                    <td>{{patientInfo.MemberName}}（{{patientInfo.Gender}}）<span ng-if=\"patientInfo.VipType\" class=\"badge badge-ex info-vip\">V<small>{{patientInfo.VipType}}</small></span> </td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td style=\"letter-spacing: 18px; text-align: right;\">{{'年龄'|translate}}</td>\n" +
    "                    <td>：</td>\n" +
    "                    <td>{{patientInfo.Age}} {{'岁'|translate}}</td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td>{{'lblDiseaseName'|translate}}</td>\n" +
    "                    <td>：</td>\n" +
    "                    <td>{{patientCondition.diseaseName|defaultValue:\"暂无数据\"}}</td>\n" +
    "                </tr>\n" +
    "                <tr><td>{{'ServiceDetail-lblDiseaseDesc'|translate}}</td><td>：</td><td>{{patientCondition.diseaseDesc|defaultValue:\"暂无数据\"}}</td></tr>\n" +
    "                <tr><td>{{'ServiceDetail-lblAllergicHistory'|translate}}</td><td>：</td><td>{{patientCondition.allergicHistory|defaultValue:\"暂无数据\"}}</td></tr>\n" +
    "                <tr>\n" +
    "                    <td style=\"letter-spacing: 18px; text-align: right;\">{{'ServiceDetail-lblAttachment'|translate}}</td>\n" +
    "                    <td>：</td>\n" +
    "                    <td>\n" +
    "                        <span ng-if=\"patientCondition.files.length == 0\" class=\"form-control-static\">{{'暂无附件'|translate}}</span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "        <div class=\"attach-wrap\" ng-if=\"patientCondition.files.length != 0\">  \n" +
    "            <div class=\"attach-scroll\" ng-if=\"patientCondition.files.length != 0\" ng-style=\"{width: 96*patientCondition.files.length+'px'}\">\n" +
    "                <a class=\"img\" href=\"\" target=\"_blank\" ng-repeat=\"item in patientCondition.files\" ng-click=\"onPreview($index, $event)\">\n" +
    "                    <img width=\"78\" height=\"78\" alt=\"\" ng-src=\"{{item.url}}\" onerror=\"this.parentNode.href = this.src + '?download=1'; this.src = '/static/images/unknow.png'\" />\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"heading text-center\">\n" +
    "            就诊信息\n" +
    "        </div>\n" +
    "        <div class=\"timelinePanel\">\n" +
    "            <div timeline time-Points=\"timePoints\" on-Time-Point-Click=\"onTimePointDetail\" ng-if=\"timePoints.length > 0\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <!--就诊记录-->\n" +
    "    <div ng-if=\"tabId=='Visits'\">\n" +
    "        <table class=\"table table-striped border-top\" cellspacing=\"0\" width=\"100%\">\n" +
    "            <thead>\n" +
    "                <tr>\n" +
    "                    <th class=\"text-center col-md-2\">{{'Room-lblIndex'|translate}}</th>\n" +
    "                    <th class=\"text-center col-md-6\">{{'Room-lblVisitDate'|translate}}</th>\n" +
    "                    <th class=\"text-center col-md-4\">{{'Room-lblVisitDoctor'|translate}}</th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-if=\"patientOPDRegisterRecords.length<=0\">\n" +
    "                    <td colspan=\"3\" class=\"text-center\">{{'Room-lblNoRecord'|translate}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"item in patientOPDRegisterRecords\">\n" +
    "                    <td class=\"text-center\">{{$index+1}}</td>\n" +
    "                    <td class=\"text-center\"><a href=\"javascript:void(0);\" ng-click=\"onOpenPatientVisitRecord(item.OPDRegisterID)\">{{item.OPDDate |date:'yyyy-MM-dd'}}</a></td>\n" +
    "                    <td class=\"text-center\" title=\"{{item.Doctor.DoctorName}}\">{{item.Doctor.DoctorName}}</td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <!--电子病历 EMR-->\n" +
    "    <div ng-if=\"tabId=='EMR'\">\n" +
    "        <table class=\"table table-condensed table-striped border-top\" cellspacing=\"0\" width=\"100%\">\n" +
    "            <tbody>\n" +
    "                <tr ng-if=\"patientEMRs.length<=0\">\n" +
    "                    <td class=\"text-center\">{{'Room-lblNoRecord'|translate}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"item in patientEMRs\">\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <a href=\"javascript:;\" ng-click=\"onOpenEMR(item)\">\n" +
    "                            <span>{{item.EMRName}}</span>\n" +
    "                            <span>{{item.HospitalName}}</span><br />\n" +
    "                            <span>{{item.Date |date:'yyyy-MM-dd'}}</span>\n" +
    "                        </a>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--PACS-->\n" +
    "    <div ng-if=\"tabId=='PACS'\">\n" +
    "        <table class=\"table table-condensed table-striped border-top\" cellspacing=\"0\">\n" +
    "            <tbody>\n" +
    "                <tr ng-if=\"patientInspectResult.length<=0\">\n" +
    "                    <td class=\"text-center\">{{'Room-lblNoRecord'|translate}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"item in patientInspectResult\">\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <a ng-click=\"onOpenCheckResult(item)\">\n" +
    "                            <span>{{item.CaseID}}</span>\n" +
    "                            <span>{{item.StudyID}}</span><br />\n" +
    "                            <span>{{item.InspectType}}</span>\n" +
    "                            <span>{{item.InspectPoint}}</span><br />\n" +
    "                            <span>1</span>\n" +
    "                            <span>{{item.InspectDate}}</span>\n" +
    "                        </a>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!--Dialog:历史就诊记录-->\n" +
    "<div class=\"modal fade\" id=\"dialog-patient_record\" ng-if=\"HistoryRecordDetail.OPDRegisterID!=''\">\n" +
    "    <div class=\"modal-dialog\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <div class=\"modal-header modal-header-bg\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <h4 class=\"modal-title  text-center\">\n" +
    "                    {{'Room-btnConsultations'|translate}}\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body\">\n" +
    "                <div class=\"main-content\" style=\"margin-top:0px;\">\n" +
    "                    <table class=\"table table-condensed table-bordered\" border=\"0\">\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'患者姓名' | translate}}</td>\n" +
    "                            <td class=\"col-md-4\">{{patientInfo.MemberName}} </td>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'联系电话' | translate}}</td>\n" +
    "                            <td class=\"col-md-4\">{{patientInfo.Mobile}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'主诉' | translate}}</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\">{{HistoryRecordDetail.MedicalRecord.Sympton}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'现病史' | translate}}</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\">{{HistoryRecordDetail.MedicalRecord.PresentHistoryIllness}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'既往病史' | translate}}</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\">{{HistoryRecordDetail.MedicalRecord.PastMedicalHistory}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'初步诊断' | translate}}</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\">{{HistoryRecordDetail.MedicalRecord.PreliminaryDiagnosis}}</td>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'医嘱' | translate}}</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\">{{HistoryRecordDetail.MedicalRecord.Advised}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "\n" +
    "                            <td class=\"col-md-2 text-right\">{{'体格检查' | translate}}</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\">\n" +
    "                                <div ng-repeat=\"item in HistoryRecordDetail.PhysicalExam\" class=\"form-group col-md-6\">\n" +
    "                                    <span class=\"input-group-addon\" style=\"border:0px; text-align:left\">\n" +
    "                                        <label>{{item.ItemCNName}}({{item.ItemENName}})：</label>\n" +
    "                                        {{item.Result}}  {{item.Unit}}\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-if=\"HistoryRecordDetail.RecipeList == null || HistoryRecordDetail.RecipeList.length == 0\">\n" +
    "                            <td class=\"tit\">处方</td>\n" +
    "                            <td class=\"con\" colspan=\"3\">\n" +
    "                                暂无处方\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-repeat=\"recipeFile in HistoryRecordDetail.RecipeList|orderBy:'RecipeType'\">\n" +
    "                            <td class=\"tit\">\n" +
    "                                {{recipeFile.RecipeName}}<br />\n" +
    "                                ({{recipeFile.RecipeTypeName}})\n" +
    "                            </td>\n" +
    "                            <td class=\"con\" colspan=\"3\">\n" +
    "                                <div id=\"prescriptionData\" class=\"pharmacy\">\n" +
    "                                    <div>\n" +
    "                                        <!--处方->诊断 -->\n" +
    "                                        <table cellspacing=\"0\" class=\"table table-bordered table-striped\">\n" +
    "                                            <thead>\n" +
    "                                                <tr>\n" +
    "                                                    <th width=\"280\">诊断名称</th>\n" +
    "                                                    <th>备注</th>\n" +
    "                                                </tr>\n" +
    "                                            </thead>\n" +
    "                                            <tbody>\n" +
    "                                                <tr ng-if=\"recipeFile.DiagnoseList == null || recipeFile.DiagnoseList.length == 0\">\n" +
    "                                                    <td colspan=\"2\">无</td>\n" +
    "                                                </tr>\n" +
    "                                                <tr ng-repeat=\"item in recipeFile.DiagnoseList\">\n" +
    "                                                    <td>{{item.Detail.DiseaseName}}</td>\n" +
    "                                                    <td>{{item.Description}}</td>\n" +
    "                                                </tr>\n" +
    "                                            </tbody>\n" +
    "                                        </table>\n" +
    "                                        <div ng-if=\"recipeFile.RecipeType == 1\">\n" +
    "                                            <table cellspacing=\"0\" class=\"table table-striped table-bordered\">\n" +
    "                                                <thead>\n" +
    "                                                    <tr>\n" +
    "                                                        <th width=\"280\">药品名称</th>\n" +
    "                                                        <th>剂量</th>\n" +
    "                                                        <th>价格</th>\n" +
    "                                                    </tr>\n" +
    "                                                </thead>\n" +
    "                                                <tbody>\n" +
    "                                                    <tr ng-if=\"recipeFile.Details == null || recipeFile.Details.length == 0\">\n" +
    "                                                        <td colspan=\"3\">无</td>\n" +
    "                                                    </tr>\n" +
    "                                                    <tr ng-repeat=\"drugItem in recipeFile.Details\">\n" +
    "                                                        <td>{{drugItem.Drug.DrugName}}</td>\n" +
    "                                                        <td>{{drugItem.Dose}}{{drugItem.Drug.DoseUnit}}</td>\n" +
    "                                                        <td>￥{{((drugItem.Dose || 1) * (drugItem.Drug.UnitPrice || 0)) |number:'2'}}</td>\n" +
    "                                                    </tr>\n" +
    "                                                </tbody>\n" +
    "                                            </table>\n" +
    "                                            <div>\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label>剂数</label>\n" +
    "                                                    <span class=\"input-group input-group-sm\">\n" +
    "                                                        共{{recipeFile.TCMQuantity}}剂\n" +
    "                                                    </span>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label>用法</label>\n" +
    "                                                    <span class=\"input-group input-group-sm\">\n" +
    "                                                        {{recipeFile.Usage}}\n" +
    "                                                    </span>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div ng-if=\"recipeFile.RecipeType ==2\">\n" +
    "                                            <table cellspacing=\"0\" class=\"table table-striped table-bordered\">\n" +
    "                                                <thead>\n" +
    "                                                    <tr>\n" +
    "                                                        <th width=\"240\">药品名称</th>\n" +
    "                                                        <th>计费数量</th>\n" +
    "                                                        <th>价格</th>\n" +
    "                                                        <th>剂量</th>\n" +
    "                                                        <th>频率</th>\n" +
    "                                                        <th>用药途径</th>\n" +
    "                                                    </tr>\n" +
    "                                                </thead>\n" +
    "                                                <tbody>\n" +
    "                                                    <tr ng-if=\"recipeFile.Details == null || recipeFile.Details.length == 0\">\n" +
    "                                                        <td colspan=\"6\">无</td>\n" +
    "                                                    </tr>\n" +
    "                                                    <tr ng-repeat=\"drugItem in recipeFile.Details\">\n" +
    "                                                        <td>{{drugItem.Drug.DrugName}} </td>\n" +
    "                                                        <td>{{drugItem.Quantity}} {{drugItem.Drug.Unit}}</td>\n" +
    "                                                        <td>￥{{((drugItem.Quantity || 1) * (drugItem.Drug.UnitPrice || 0))|number:'2'}}</td>\n" +
    "                                                        <td>{{drugItem.Dose}} {{drugItem.Drug.DoseUnit}}</td>\n" +
    "                                                        <td>{{drugItem.Frequency}}</td>\n" +
    "                                                        <td>{{drugItem.DrugRouteName}}</td>\n" +
    "                                                    </tr>\n" +
    "                                                </tbody>\n" +
    "                                            </table>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <button class=\"btn btn-default\" data-dismiss=\"modal\">{{'btnClose'|translate}}</button>\n" +
    "                <button class=\"btn btn-info\" ng-click=\"onCopyPatientVisitRecord()\">{{'btnCopy'|translate}}</button>\n" +
    "            </div>\n" +
    "        </div><!-- /.modal-content -->\n" +
    "    </div><!-- /.modal-dialog -->\n" +
    "</div>\n" +
    "\n" +
    "<!--检验检查的对话框-->\n" +
    "<div class=\"modal fade\" id=\"dialog-exam-result\" data-backdrop=\"static\">\n" +
    "    <div class=\"modal-dialog\" style=\"width:800px;\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <div class=\"modal-header\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "\n" +
    "                <h4 class=\"modal-title\">\n" +
    "                    检验检查\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body\" style=\"max-height:700px; overflow-y:auto;\">\n" +
    "                <exam-result-charts member-id=\"ExamResult.MemberID\"></exam-result-charts>\n" +
    "                <exam-result member-id=\"ExamResult.MemberID\"></exam-result>\n" +
    "            </div>\n" +
    "        </div><!-- /.modal-content -->\n" +
    "    </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->\n" +
    "<!--编辑患者信息-->\n" +
    "<div class=\"modal fade\" id=\"dialog-patient-info\" data-backdrop=\"static\">\n" +
    "    <div class=\"modal-dialog\">\n" +
    "        <div class=\"modal-content\" style=\"width:700px;\">\n" +
    "            <div class=\"modal-header modal-header-bg\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <h4 class=\"modal-title  text-center\">\n" +
    "                    {{'填写就诊人信息'|translate}}\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <form id=\"form-patient\" form-Validate on-submit=\"onSubmitPatientInfo()\">\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <div class=\"text-center\">\n" +
    "                        <label><i class=\"glyphicon glyphicon-info-sign\"></i> {{'就诊人信息缺失，请补充以下资料'|translate}}</label>\n" +
    "                    </div>\n" +
    "                    <hr />\n" +
    "                    <editor-Patient genders=\"genders\" member=\"member\"></editor-Patient>\n" +
    "                </div>\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-info\">{{'btnSave'|translate}}</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">{{'btnClose'|translate}}</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Doctor/directives/chat-detail-Recipe.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-detail-Recipe.html",
    "<div class=\"col-md-12\" style=\"height:calc(100% - 135px); overflow-y:auto; \">\n" +
    "    <!--默认显示中药处方和西药处方-->\n" +
    "    <div class=\"diagnose-model\">\n" +
    "        <div class=\"pull-right\">\n" +
    "            <div class=\"btn-group pull-left\">\n" +
    "                <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-sm\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" ng-disabled=\"$root.RecipeFiles.length >= 3\">\n" +
    "                    <span class=\"glyphicon glyphicon-plus  text-success\"></span> {{'btnAdd'|translate}} <span class=\"caret\"></span>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\" >\n" +
    "                    <li><a ng-click=\"onAddRecipeFile(1,'中药处方')\">{{'Room-lblChineseMedicine'|translate}}</a></li>\n" +
    "                    <li><a ng-click=\"onAddRecipeFile(2,'西药处方')\">{{'Room-lblWesternMedicine'|translate}}</a></li>\n" +
    "                    <!--注意：只允许网络医院的用户使用处方集，其他用户需要限制药品目录-->\n" +
    "                    <li ng-show=\"$root.OrgnazitionID=='kmwlyy' || $root.OrgnazitionID=='0'\"><a data-toggle=\"modal\" data-target=\"#dialog-RecipeFiles\">{{'Room-lblPrescriptionSet'|translate}}</a></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <button class=\"btn btn-default  btn-sm\" ng-click=\"onRefreshRecipeFiles()\" style=\"margin-left: 10px;\">\n" +
    "                <i class=\"glyphicon glyphicon-refresh\"></i> 刷新\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <br />\n" +
    "        <br />\n" +
    "        <div style=\"min-width:700px;\">\n" +
    "            <table ng-if=\"roomType=='offline'\" class=\"table table-bordered table-hover table-responsive\">\n" +
    "                <thead>\n" +
    "                    <tr>\n" +
    "                        <th nobr>处方信息</th>\n" +
    "                        <th>应收金额</th>\n" +
    "                        <th>实收金额</th>\n" +
    "                        <th>收费状态</th>\n" +
    "                        <th>配送状态</th>\n" +
    "                        <th>操作</th>\n" +
    "                        <th>处方收费</th>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody ng-show=\"$root.RecipeFiles.length<=0\">\n" +
    "                    <tr>\n" +
    "                        <td colspan=\"8\" class=\"text-center\">\n" +
    "                            {{'Room-lblNotPrescription'|translate}}\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "                <tbody>\n" +
    "                    <tr ng-repeat=\"item in $root.RecipeFiles\">\n" +
    "                        <td class=\"text-left\">\n" +
    "                            编号：<b>{{item.RecipeNo || '（无）'}}</b><br />\n" +
    "                            类型：{{item.RecipeType==1?'Room-lblChineseMedicine':'Room-lblWesternMedicine'|translate}}<br />\n" +
    "                            名称：<b><a class=\"text-info\" ng-click=\"onPreviewRecipeFile(item)\">{{item.RecipeName}}</a> <i class=\"glyphicon glyphicon-print\"></i></b>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <b class=\"text-primary\">\n" +
    "                                <!--中药处方，二维计算待煎费用-->\n" +
    "                                <span ng-if=\"item.RecipeType==1\">\n" +
    "                                    合计：￥{{item.Order.TotalFee || ((item.ReplaceDose * item.ReplacePrice)+item.Amount) |number:'2'}}\n" +
    "                                </span>\n" +
    "                                <!--西药处方-->\n" +
    "                                <span ng-if=\"item.RecipeType==2\">\n" +
    "                                    合计：￥{{item.Order.TotalFee || (item.Amount) |number:'2'}}\n" +
    "                                </span>\n" +
    "                            </b><br />\n" +
    "                            <i>药品：￥{{(item.Amount)}}<br /></i>\n" +
    "                            <span ng-if=\"item.RecipeType==1\">\n" +
    "                                <i>代煎：￥{{(item.ReplaceDose * item.ReplacePrice) |number:'2'}}<br /></i>\n" +
    "                            </span>\n" +
    "                        </td>\n" +
    "                        <td>￥{{item.BillIn.BillInOutTotalFee || 0 |number:'2'}}</td>\n" +
    "                        <td>\n" +
    "\n" +
    "                            <span class=\"text-warning\" ng-if=\"!item.Order\"><b>未申请 </b></span>\n" +
    "                            <div ng-if=\"item.Order && item.Order.RefundState==0\">\n" +
    "                                <b>\n" +
    "                                    <span class=\"text-default\" ng-if=\"item.Order.OrderState==-1\">未收费</span>\n" +
    "                                    <span class=\"text-default\" ng-if=\"item.Order.OrderState==0\">未收费</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.OrderState==1\">已收费</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.OrderState==2\">已完成</span>\n" +
    "                                    <span class=\"text-danger\" ng-if=\"item.Order.OrderState==3\">已取消</span>\n" +
    "                                </b>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"item.Order && item.Order.RefundState!=0\">\n" +
    "                                <b>\n" +
    "                                    <span class=\"text-info\" ng-if=\"item.Order.RefundState==0\">未退款</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.RefundState==1\">申请退款</span>\n" +
    "                                    <span class=\"text-primary\" ng-if=\"item.Order.RefundState==2\">已退款</span>\n" +
    "                                    <span class=\"text-danger\" ng-if=\"item.Order.RefundState==3\">拒绝退款</span>\n" +
    "                                    <span class=\"text-warning\" ng-if=\"item.Order.RefundState==4\">退款中</span>\n" +
    "                                </b>\n" +
    "                                <br />\n" +
    "                                <i>发票号：{{item.BillIn.BillInOutTickNo}}</i><br />\n" +
    "                                <i>收据号：{{item.BillIn.BillInOutNo}}</i>\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <button ng-if=\"item.Order && (item.Order.OrderState==1 || item.Order.OrderState==2 || item.Order.OrderState==3)\"\n" +
    "                                    class=\"btn btn-default btn-xs\"\n" +
    "                                    ng-click=\"onRefreshLogisticInfo(item)\">\n" +
    "                                <i class=\"glyphicon-refresh glyphicon\"></i>\n" +
    "                                &nbsp;\n" +
    "                                <b>\n" +
    "                                    <span class=\"text-danger\" ng-if=\"item.Order.LogisticState==-2\">待申请药房发药</span>\n" +
    "                                    <span class=\"text-danger\" ng-if=\"item.Order.LogisticState==-3\">药房审核失败</span>\n" +
    "                                    <span class=\"text-info\" ng-if=\"item.Order.LogisticState==-1\">药房审核中</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.LogisticState==0\">已审核</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.LogisticState==1\">已备货</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.LogisticState==2\">已发货</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.LogisticState==3\">配送中</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.LogisticState==4\">已送达</span>\n" +
    "                                    <span class=\"text-success\" ng-if=\"item.Order.LogisticState==99\">已取消</span>\n" +
    "                                </b>\n" +
    "                            </button>\n" +
    "                            <br />\n" +
    "                            <div ng-if=\"item.Order && item.Order.OrderState==1 && item.Order.OrderState==3\">\n" +
    "                                <i>收货人：<a ng-click=\"onViewLogisticInfo(item)\">{{item.Order.Consignee.Name}}</a></i>\n" +
    "                                <i ng-if=\"item.Order.LogisticState!=-2\">物流号：{{item.Order.LogisticNo}}</i><br />\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <!--未申请收费 && 未申请退款的 && 处方未签名 允许删除-->\n" +
    "                            <button type=\"button\" ng-if=\"!item.Order\" class=\"btn btn-danger btn-xs\" ng-click=\"onRemoveRecipeFile(item)\"><i class=\"glyphicon glyphicon glyphicon-trash\"></i> {{'btnDelete'|translate}}</button>\n" +
    "                            <!--未申请收费 且 处方未签名 允许编辑-->\n" +
    "                            <button type=\"button\" ng-if=\"!item.Order && item.RecipeFileStatus==0\" class=\"btn btn-info btn-xs\" ng-click=\"onEditRecipeFile(item)\"><i class=\"glyphicon glyphicon-pencil\"></i> {{'btnEdit'|translate}}</button>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <!--未申请收费，处方类型是中药处方的可以申请收费-->\n" +
    "                            <button type=\"button\" ng-if=\"!item.Order && item.RecipeType==1\" class=\"btn btn-xs btn-success\" ng-click=\"onChargeRecipe(item)\"><i class=\"glyphicon glyphicon-jpy\"></i> 申请收费</button>\n" +
    "\n" +
    "                            <!--已经收费且未退费的可以申请退费-->\n" +
    "                            <button type=\"button\" ng-if=\"item.Order && item.Order.OrderState==1 && item.Order.RefundState==0 && item.RecipeType==1 && (item.Order.LogisticState==-1 || item.Order.LogisticState==-2 || item.Order.LogisticState==-3)\" class=\"btn btn-xs btn-danger\" ng-click=\"onRefundRecipe(item)\"><i class=\"glyphicon glyphicon-jpy\"></i> 申请退款</button>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "            <table ng-if=\"roomType=='online'\" class=\"table table-bordered table-hover table-responsive\">\n" +
    "                <thead>\n" +
    "                    <tr>\n" +
    "                        <th nobr>处方信息</th>\n" +
    "                        <th>金额</th>\n" +
    "                        <th>签名状态</th>\n" +
    "                        <th>操作</th>\n" +
    "                        <th>电子签名</th>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody ng-show=\"$root.RecipeFiles.length<=0\">\n" +
    "                    <tr>\n" +
    "                        <td colspan=\"8\" class=\"text-center\">\n" +
    "                            {{'Room-lblNotPrescription'|translate}}\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "                <tbody>\n" +
    "                    <tr ng-repeat=\"item in $root.RecipeFiles\">\n" +
    "                        <td class=\"text-left\">\n" +
    "                            编号：{{item.RecipeNo}}<br />\n" +
    "                            类型：{{item.RecipeType==1?'Room-lblChineseMedicine':'Room-lblWesternMedicine'|translate}}<br />\n" +
    "                            名称：<b><a class=\"text-info\" ng-click=\"onPreviewRecipeFile(item)\">{{item.RecipeName}}</a> <i class=\"glyphicon glyphicon-print\"></i></b>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <!--中药处方，计算待煎费用-->\n" +
    "                            <span ng-if=\"item.RecipeType==1\">\n" +
    "                                合计：￥{{((item.ReplaceDose * item.ReplacePrice)+item.Amount) |number:'2'}}\n" +
    "                            </span>\n" +
    "                            <!--西药处方-->\n" +
    "                            <span ng-if=\"item.RecipeType==2\">\n" +
    "                                合计：￥{{(item.Amount) |number:'2'}}\n" +
    "                            </span>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <span class=\"text-danger\" ng-if=\"item.RecipeFileStatus==0\">未签名</span>\n" +
    "                            <span class=\"text-success\" ng-if=\"item.RecipeFileStatus==1\">已签名</span>\n" +
    "                            <span class=\"text-primary\" ng-if=\"item.RecipeFileStatus==2\">签名中</span>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <!-- 处方未签名 允许删除-->\n" +
    "                            <button type=\"button\" ng-if=\"item.RecipeFileStatus==0\" class=\"btn btn-danger btn-xs\" ng-click=\"onRemoveRecipeFile(item)\"><i class=\"glyphicon glyphicon glyphicon-trash\"></i> {{'btnDelete'|translate}}</button>\n" +
    "                            <!-- 处方未签名 允许编辑-->\n" +
    "                            <button type=\"button\" ng-if=\"item.RecipeFileStatus==0\" class=\"btn btn-info btn-xs\" ng-click=\"onEditRecipeFile(item)\"><i class=\"glyphicon glyphicon-pencil\"></i> {{'btnEdit'|translate}}</button>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <button type=\"button\" ng-if=\"item.RecipeFileStatus==0\"\n" +
    "                                    class=\"btn btn-xs btn-success\"\n" +
    "                                    ng-click=\"onSignRecipe(item)\">\n" +
    "                                <i class=\"glyphicon glyphicon-file\"></i> 提交签名\n" +
    "                            </button>\n" +
    "                            <button type=\"button\" ng-if=\"item.RecipeFileStatus==2\"\n" +
    "                                    class=\"btn btn-xs btn-danger\"\n" +
    "                                    ng-click=\"onRetractRecipe(item)\">\n" +
    "                                <i class=\"glyphicon glyphicon-file\"></i> 撤回签名\n" +
    "                            </button>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--编辑处方-->\n" +
    "<div class=\"modal fade\" id=\"dialog-RecipeFiles\" data-backdrop=\"static\">\n" +
    "    <div class=\"modal-dialog\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <div class=\"modal-header modal-header-bg\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <h4 class=\"modal-title  text-center\">\n" +
    "                    {{'lblFormulary'|translate}}\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body text-center\">\n" +
    "                <div class=\"row form-horizontal\">\n" +
    "                    <div class=\"form-group text-left\">\n" +
    "                        <label class=\"control-label col-sm-2\" for=\"keyword\">{{'lblTitle'|translate}}</label>\n" +
    "                        <div class=\"col-sm-4\">\n" +
    "                            <input class=\"form-control\"\n" +
    "                                   ng-model=\"Keyword\"\n" +
    "                                   name=\"keyword\" />\n" +
    "                        </div>\n" +
    "                        <button class=\"btn btn-info\" type=\"button\" ng-click=\"onGetRecipeFiles()\">{{'btnSearch' | translate}}</button>\n" +
    "                        <button class=\"btn btn-info\" type=\"button\" ng-click=\"onAddRecipeFormular()\">{{'btnAdd' | translate}}</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <table class=\"table table-responsive table-bordered\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <th class=\"text-center\" width=\"60\">{{'Room-lblIndex'|translate}}</th>\n" +
    "                            <th class=\"text-left\">{{'Room-lblRecipeName'|translate}}</th>\n" +
    "                            <th class=\"text-center\" width=\"100\">{{'Room-lblRecipeType'|translate}}</th>\n" +
    "                            <th class=\"text-center\" width=\"100\">{{'Room-lblOperator'|translate}}</th>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"item in RecipeFilesByDoctorID\">\n" +
    "                            <td>{{$index+1}}</td>\n" +
    "                            <td class=\"text-left\">\n" +
    "                                {{item.RecipeFormulaName}}\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                {{item.RecipeType==1?'Room-lblChineseMedicine':'Room-lblWesternMedicine'|translate}}\n" +
    "                            </td>\n" +
    "                            <td style=\"width:155px;\">\n" +
    "                                <button class=\"btn btn-info btn-xs\" href=\"javascript:void(0);\" ng-click=\"onCopyRecipeFiles(item)\">{{'lblSelect'|translate}}</button>\n" +
    "                                <button class=\"btn btn-info btn-xs\" href=\"javascript:void(0);\" ng-click=\"onEditRecipeFiles(item)\">{{'btnEdit'|translate}}</button>\n" +
    "                                <button class=\"btn btn-danger btn-xs\" href=\"javascript:void(0);\" ng-click=\"onRemoveRecipeFormular(item)\">{{'btnDelete'|translate}}</button>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <!--分页控件-->\n" +
    "                <pager-nav page-list=\"[5,10]\"\n" +
    "                           page=\"page\"\n" +
    "                           page-Size=\"pageSize\"\n" +
    "                           total-Count=\"totalCount\" loadData=\"false\" on-change=\"onGetRecipeFiles()\" />\n" +
    "            </div>\n" +
    "        </div><!-- /.modal-content -->\n" +
    "    </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->\n" +
    "<!--编辑处方-->\n" +
    "\n" +
    "<!--新建处方-->\n" +
    "<div class=\"modal fade\" id=\"modal-NewRecipeFormular\" role=\"dialog\">\n" +
    "    <div class=\"modal-dialog\" role=\"document\" style=\"width:950px;\">\n" +
    "        <div class=\"modal-content my-modal-content\">\n" +
    "            <div class=\"modal-header modal-header-bg\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <h4 class=\"modal-title text-center\">{{ ((recipeFormularID == null || recipeFormularID == '') ? 'btnAddPrescription' : 'btnEditPrescription') | translate }}</h4>\n" +
    "            </div>\n" +
    "            <form form-Validate on-submit=\"recipeFormularCallback.submitCallback()\">\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <div editor-Recipe-Formular id=\"recipeFormularID\" callback=\"recipeFormularCallback\"></div>\n" +
    "                    <div style=\"clear:both\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-info\">{{'btnSave'|translate}}</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">{{'btnClose'|translate}}</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div><!-- /.modal-content -->\n" +
    "    </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->\n" +
    "<!--新建处方-->\n" +
    "<!--处方集-->\n" +
    "<div class=\"modal fade\" id=\"dialog-EditorRecipeFile\" data-backdrop=\"static\">\n" +
    "    <div class=\"modal-dialog\" style=\"width:80%\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <form id=\"form-Diagnose\" form-Validate on-submit=\"onSaveRecipeFile(EditRecipeFile)\" style=\"height:100%;\">\n" +
    "                <div class=\"modal-header modal-header-bg\">\n" +
    "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                    <h4 class=\"modal-title text-center\">\n" +
    "                        {{EditRecipeFile.RecipeName}}\n" +
    "                    </h4>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body\">\n" +
    "\n" +
    "                    <!--处方->诊断 -->\n" +
    "                    <editor-recipe-diagnosis Diagnosis=\"EditRecipeFile.DiagnoseList\" type=\"EditRecipeFile.RecipeType\"></editor-recipe-diagnosis>\n" +
    "                    <!--处方->药品 -->\n" +
    "                    <editor-recipe-Drugs recipe=\"EditRecipeFile\"></editor-recipe-Drugs>\n" +
    "                    <!-- 设置常用处方 -->\n" +
    "                    <div style=\"height: 40px;\">\n" +
    "                        <label class=\"checkbox pull-right\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"setCommonRecipe\"> 设为常用处方\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">{{'btnClose'|translate}}</button>\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary\">{{'btnSave'|translate}}</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div><!-- /.modal-content -->\n" +
    "    </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->\n" +
    "<!--查看物流信息-->\n" +
    "<div class=\"modal fade\" id=\"dialog-ViewLogisticInfo\" data-backdrop=\"static\">\n" +
    "    <div class=\"modal-dialog\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <form id=\"form-Diagnose\" form-Validate on-submit=\"onSaveRecipeFile(EditRecipeFile)\" style=\"height:100%;\">\n" +
    "                <div class=\"modal-header modal-header-bg\">\n" +
    "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                    <h4 class=\"modal-title  text-center\">\n" +
    "                        收货人信息\n" +
    "                    </h4>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <table class=\"table table-condensed table-bordered\">\n" +
    "                        <thead>\n" +
    "                            <tr>\n" +
    "                                <td class=\"text-right\">姓名</td>\n" +
    "                                <td>{{ViewLogisticInfo.Order.Consignee.Name}}</td>\n" +
    "\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td class=\"text-right\">电话</td>\n" +
    "                                <td>{{ViewLogisticInfo.Order.Consignee.Tel}}</td>\n" +
    "\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td class=\"text-right\">地址</td>\n" +
    "                                <td>{{ViewLogisticInfo.Order.Consignee.Address}}</td>\n" +
    "                            </tr>\n" +
    "                        </thead>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">{{'btnClose'|translate}}</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div><!-- /.modal-content -->\n" +
    "    </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->\n" +
    "\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/chat-view-AudioConsult.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-view-AudioConsult.html",
    "<!--视频，语音，远程会诊才显示-->\n" +
    "<div class=\"col-xs-3 col-sm-3 col-md-3 col-lg-3 left\">\n" +
    "    <!--呼叫控制-->\n" +
    "    <chat-Call-Ctrl room=\"room\">\n" +
    "        <!--视频窗口-->\n" +
    "        <chat-audio room=\"room\"></chat-audio>\n" +
    "        <!--用户列表-->\n" +
    "        <!--<chat-users  ng-show=\"false\"  room=\"room\"></chat-users>-->\n" +
    "    </chat-Call-Ctrl>\n" +
    "</div>\n" +
    "<bg-splitter orientation=\"horizontal\"  class=\"col-xs-9 col-sm-9 col-md-9 col-lg-9\">\n" +
    "    <bg-pane min-size=\"500\" class=\"middle chat-content\">\n" +
    "        <div class=\"toolbar\">\n" +
    "            <a class=\"tool\" ng-class=\"{'active':Audio.toolbar=='comment'}\" ng-click=\"Audio.toolbarClick('comment');Audio.LazyLoad['Diagnose']=true;\"><i class=\"glyphicon glyphicon-comment\"></i> {{'Room-btnChat'|translate}}</a>\n" +
    "            <!--看诊的时候才显示诊断按钮-->\n" +
    "            <a class=\"tool\" ng-class=\"{'active':Audio.toolbar=='diagnose'}\" ng-click=\"Audio.toolbarClick('diagnose');Audio.LazyLoad['Diagnose']=true;\"><i class=\"glyphicon glyphicon-facetime-video\"></i> {{'Room-btnConsultations'|translate}}</a>\n" +
    "            <a class=\"tool\" ng-class=\"{'active':Audio.toolbar=='recipe'}\" ng-click=\"Audio.toolbarClick('recipe');Audio.LazyLoad['Diagnose']=true;\"><i class=\"glyphicon glyphicon-file\"></i> {{'Room-btnPrescription'|translate}}</a>\n" +
    "            <a class=\"tool\" ui-sref=\"HealthPlan({memberId: $root.memberID})\" target=\"_blank\"><i class=\"glyphicon glyphicon-time\"></i> {{'Room-btnHealthPlan'|translate}}</a>\n" +
    "            <a class=\"tool\" href=\"/HealthReport?MemberID={{$root.memberID}}\" target=\"_blank\"><i class=\"glyphicon glyphicon-heart\"></i> {{'Room-btnHealthReport'|translate}}</a>\n" +
    "        </div>\n" +
    "        <div class=\"border-both\" style=\"height:100%; position:relative;\">\n" +
    "            <!--就诊中-->\n" +
    "            <!--<countdown room=\"room\"></countdown>-->\n" +
    "            <!--助手-->\n" +
    "            <modal-Assistant-Diagnose room=\"room\"></modal-Assistant-Diagnose>\n" +
    "\n" +
    "            <chat-Comment ng-show=\"Audio.toolbar=='comment'\" room=\"room\" on-Msg=\"onMsg\" on-Url-Click=\"onUrlClick\" on-Answer=\"onAnswer\"></chat-Comment>\n" +
    "            <chat-diagnose ng-show=\"Audio.toolbar=='diagnose'\" ng-if=\"Audio.LazyLoad['Diagnose']\" class=\"chat-Diagnose\" room-Type=\"online\" room=\"room\"></chat-diagnose>\n" +
    "            <chat-Recipe ng-show=\"Audio.toolbar=='recipe'\" ng-if=\"Audio.LazyLoad['Diagnose']\" class=\"chat-Diagnose\" room-Type=\"online\" room=\"room\"></chat-Recipe>\n" +
    "        </div>\n" +
    "    </bg-pane>\n" +
    "    <bg-pane min-size=\"260\" class=\"no-boder-left right\">\n" +
    "        <chat-patientInfo class=\"chat-patientInfo\" room=\"room\"></chat-patientInfo>\n" +
    "    </bg-pane>\n" +
    "</bg-splitter>");
}]);

angular.module("/static/modules/Doctor/directives/chat-view-NotSession.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-view-NotSession.html",
    "<div class=\"block text-center\">\n" +
    "        <div class=\"vcenter\">\n" +
    "            <img src=\"/static/images/bg-chat-room.png\" />\n" +
    "            <br />\n" +
    "            <label>{{'Room-lblNotSession'|translate}}</label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/chat-view-OfflineClinic.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-view-OfflineClinic.html",
    "<div style=\"height:100%\" ng-if=\"!Clinicing\">\n" +
    "    <div class=\"text-center\" ng-show=\"loading\">\n" +
    "        <img src=\"/static/images/ico_loading.gif\" /> <span>{{'Room-lblLoading'|translate}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-show=\"!loading\">\n" +
    "        <br />\n" +
    "        <h2 ng-if=\"CallCount>0 && !CallNext\" class=\"text-center text-primary\">您已呼叫患者 {{CallCount}} 次，请耐心等待</h2>\n" +
    "\n" +
    "        <h2 ng-if=\"CallNext\" class=\"text-center text-danger\">当前患者已过号，请呼叫下一位</h2>\n" +
    "        <br />\n" +
    "        <table class=\"table table-condensed table-bordered\" border=\"0\">\n" +
    "            <tbody>\n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'lblMedicalCardID'|translate}}：</td><td>{{patientInfo.MedicalCardID}}</td></tr>\n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'lblSection'|translate}}：</td><td>{{patientInfo.DepartmentName}}</td></tr>\n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'Room-lblVisitDoctor'|translate}}：</td><td>{{patientInfo.DoctorName}}</td></tr>\n" +
    "                \n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'lblName'|translate}}：</td><td>{{patientInfo.Name}}</td></tr>\n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'lblSex'|translate}}：</td><td>{{patientInfo.Sex}}</td></tr>\n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'lblTel'|translate}}：</td><td>{{patientInfo.Mobile}}</td></tr>\n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'lblEmail'|translate}}：</td><td>{{patientInfo.Email}}</td></tr>\n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'lblIDCode'|translate}}：</td><td>{{patientInfo.IDNumber}}</td></tr>\n" +
    "                <tr><td class=\"col-md-3 text-right\">{{'Room-lblVisitDate'|translate}}：</td><td>{{patientInfo.OPDDate}}</td></tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "        <div ng-if=\"CallControl\">\n" +
    "            <button class=\"btn btn-primary btn-block\" ng-click=\"Call(0)\">\n" +
    "                继续呼叫\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-success btn-block\" ng-click=\"Call(1)\">\n" +
    "                当前患者就诊\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-danger btn-block\" ng-click=\"Call(2)\">\n" +
    "                过号\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<bg-splitter ng-if=\"Clinicing\" orientation=\"horizontal\" class=\"col-md-12 col-lg-12\">\n" +
    "    <bg-pane min-size=\"500\" class=\"middle chat-content\">\n" +
    "        <div class=\"toolbar\">\n" +
    "            <a class=\"tool\" ng-class=\"{'active':Offline.toolbar=='diagnose'}\" ng-click=\"Offline.toolbarClick('diagnose');\"><i class=\"glyphicon glyphicon-heart\"></i> {{'Room-btnConsultations'|translate}}</a>\n" +
    "            <a class=\"tool\" ng-class=\"{'active':Offline.toolbar=='recipe'}\" ng-click=\"Offline.toolbarClick('recipe');\"><i class=\"glyphicon glyphicon-facetime-video\"></i> {{'Room-btnPrescription'|translate}}</a>\n" +
    "            <a class=\"tool\" ui-sref=\"HealthPlan({memberId: $root.memberID})\" target=\"_blank\"><i class=\"glyphicon glyphicon-time\"></i> {{'Room-btnHealthPlan'|translate}}</a>\n" +
    "            <a class=\"tool\" href=\"/HealthReport?MemberID={{$root.memberID}}\" target=\"_blank\"><i class=\"glyphicon glyphicon-time\"></i> {{'Room-btnHealthReport'|translate}}</a>\n" +
    "        </div>\n" +
    "        <div style=\"height:100%;\">\n" +
    "\n" +
    "\n" +
    "            <chat-diagnose ng-show=\"Offline.toolbar=='diagnose'\"  class=\"chat-Diagnose\" room-Type=\"offline\" room=\"room\"></chat-diagnose>\n" +
    "            <chat-Recipe ng-show=\"Offline.toolbar=='recipe'\" class=\"chat-Diagnose\" room-Type=\"offline\" room=\"room\"></chat-Recipe>\n" +
    "\n" +
    "        </div>\n" +
    "    </bg-pane>\n" +
    "    <bg-pane min-size=\"260\" class=\"right\">\n" +
    "        <chat-patientInfo class=\"chat-patientInfo\" room=\"room\"></chat-patientInfo>\n" +
    "    </bg-pane>\n" +
    "</bg-splitter>\n" +
    "\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/chat-view-TextConsult.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-view-TextConsult.html",
    "<bg-splitter orientation=\"horizontal\">\n" +
    "\n" +
    "    <bg-pane min-size=\"500\" class=\"middle chat-content\">\n" +
    "        <div class=\"toolbar ng-scope\">\n" +
    "            <a class=\"tool ng-binding active\" ng-class=\"{'active':TextConsult.toolbar=='comment'}\" ng-click=\"TextConsult.toolbarClick('comment')\" style=\"\">{{'Room-btnChat'|translate}}</a>\n" +
    "            <!--看诊的时候才显示诊断按钮-->\n" +
    "            <a class=\"tool ng-binding\" ng-class=\"{'active':TextConsult.toolbar=='diagnose'}\" ng-click=\"TextConsult.toolbarClick('diagnose');TextConsult.LazyLoad['Diagnose']=true;\">{{'Room-btnConsultations'|translate}}</a>\n" +
    "            <a class=\"tool ng-binding\" ng-class=\"{'active':TextConsult.toolbar=='recipe'}\" ng-click=\"TextConsult.toolbarClick('recipe');TextConsult.LazyLoad['Diagnose']=true;\">{{'Room-btnPrescription'|translate}}</a>\n" +
    "            <a class=\"tool\" ui-sref=\"HealthPlan({memberId: $root.memberID})\" target=\"_blank\">{{'Room-btnHealthPlan'|translate}}</a>\n" +
    "            <a class=\"tool\" href=\"/HealthReport?MemberID={{$root.memberID}}\" target=\"_blank\">{{'Room-btnHealthReport'|translate}}</a>\n" +
    "        </div>\n" +
    "        <div class=\"border-both\" style=\"height:100%; position:relative;\">\n" +
    "            <!--就诊中-->\n" +
    "            <!--<countdown room=\"room\"></countdown>-->\n" +
    "            <!--助手-->\n" +
    "            <modal-Assistant-Diagnose room=\"room\"></modal-Assistant-Diagnose>\n" +
    "\n" +
    "            <chat-Comment ng-show=\"TextConsult.toolbar=='comment'\" room=\"room\" on-Msg=\"onMsg\" on-Url-Click=\"onUrlClick\" on-answer=\"onAnswer\"></chat-Comment>\n" +
    "            <chat-diagnose ng-show=\"TextConsult.toolbar=='diagnose'\" ng-if=\"TextConsult.LazyLoad['Diagnose']\" class=\"chat-Diagnose\" room-Type=\"online\" room=\"room\"></chat-diagnose>\n" +
    "            <chat-Recipe ng-show=\"TextConsult.toolbar=='recipe'\" ng-if=\"TextConsult.LazyLoad['Diagnose']\" class=\"chat-Diagnose\" room-Type=\"online\" room=\"room\"></chat-Recipe>\n" +
    "        </div>\n" +
    "    </bg-pane>\n" +
    "    <bg-pane min-size=\"260\" class=\"no-boder-left right\">\n" +
    "        <chat-patientInfo class=\"chat-patientInfo\" room=\"room\"></chat-patientInfo>\n" +
    "    </bg-pane>\n" +
    "</bg-splitter>\n" +
    "\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/chat-view-VideoConsult.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/chat-view-VideoConsult.html",
    "<!--视频，语音，远程会诊才显示-->\n" +
    "<div class=\"no-boder-right left col-xs-3 col-sm-3 col-md-3 col-lg-3\">\n" +
    "    <!--呼叫控制-->\n" +
    "    <chat-Call-Ctrl room=\"room\">\n" +
    "        <!--视频窗口-->\n" +
    "        <chat-video room=\"room\"></chat-video>\n" +
    "        <!--用户列表-->\n" +
    "        <!--<chat-users ng-show=\"false\" room=\"room\"></chat-users>-->\n" +
    "    </chat-Call-Ctrl>\n" +
    "</div>\n" +
    "<bg-splitter orientation=\"horizontal\"class=\"col-xs-9 col-xs-9 col-md-9 col-lg-9\">\n" +
    "    <bg-pane min-size=\"500\" class=\"middle chat-content\">\n" +
    "        <div class=\"toolbar\">\n" +
    "            <a class=\"tool\" ng-class=\"{'active':Video.toolbar=='comment'}\" ng-click=\"Video.toolbarClick('comment')\">{{'Room-btnChat'|translate}}</a>\n" +
    "            <a class=\"tool\" ng-class=\"{'active':Video.toolbar=='diagnose'}\" ng-click=\"Video.toolbarClick('diagnose');Video.LazyLoad['Diagnose']=true;\">{{'Room-btnConsultations'|translate}}</a>\n" +
    "            <a class=\"tool\" ng-class=\"{'active':Video.toolbar=='recipe'}\" ng-click=\"Video.toolbarClick('recipe');Video.LazyLoad['Diagnose']=true;\">{{'Room-btnPrescription'|translate}}</a>\n" +
    "            <a class=\"tool\" ui-sref=\"HealthPlan({memberId: $root.memberID})\" target=\"_blank\">{{'Room-btnHealthPlan'|translate}}</a>\n" +
    "            <a class=\"tool\" href=\"/HealthReport?MemberID={{$root.memberID}}\" target=\"_blank\">{{'Room-btnHealthReport'|translate}}</a>\n" +
    "        </div>\n" +
    "        <div class=\"border-both\" style=\"height:100%; position:relative;\">\n" +
    "            <!--就诊中-->\n" +
    "            <!--<countdown room=\"room\"></countdown>-->\n" +
    "            <!--助手-->\n" +
    "            <modal-Assistant-Diagnose room=\"room\"></modal-Assistant-Diagnose>\n" +
    "\n" +
    "            <chat-Comment ng-show=\"Video.toolbar=='comment'\" room=\"room\" on-Msg=\"onMsg\" on-Url-Click=\"onUrlClick\" on-answer=\"onAnswer\"></chat-Comment>\n" +
    "            <chat-diagnose ng-show=\"Video.toolbar=='diagnose'\" ng-if=\"Video.LazyLoad['Diagnose']\" class=\"chat-Diagnose\" room-Type=\"online\" room=\"room\"></chat-diagnose>\n" +
    "            <chat-Recipe ng-show=\"Video.toolbar=='recipe'\" ng-if=\"Video.LazyLoad['Diagnose']\" class=\"chat-Diagnose\" room-Type=\"online\" room=\"room\"></chat-Recipe>\n" +
    "        </div>\n" +
    "    </bg-pane>\n" +
    "    <bg-pane min-size=\"260\" class=\"no-boder-left right\">\n" +
    "        <chat-patientInfo class=\"chat-patientInfo\" room=\"room\"></chat-patientInfo>\n" +
    "    </bg-pane>\n" +
    "</bg-splitter>");
}]);

angular.module("/static/modules/Doctor/directives/editor-Diagnose-Template1.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/editor-Diagnose-Template1.html",
    "<div class=\"form-group\">\n" +
    "    <label><font class=\"text-danger\">*</font>{{'Room-lblComplained'|translate}}</label>\n" +
    "    <textarea class=\"form-control\"\n" +
    "              rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.Sympton\"\n" +
    "              name=\"Sympton\" placeholder=\"{{'Room-lblComplainedPlaceholder'|translate}}\"\n" +
    "              validate=\"{required:true,messages:{required:'{{'Room-lblComplainedPlaceholder'|translate}}'}}\"></textarea>\n" +
    "</div>\n" +
    "<!--初步诊断-->\n" +
    "<div class=\"form-group\">\n" +
    "    <label><font class=\"text-danger\">*</font>{{'Room-lblPreliminaryDiagnosis'|translate}}</label>\n" +
    "    <textarea class=\"form-control\" rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.PreliminaryDiagnosis\"\n" +
    "              name=\"PreliminaryDiagnosis\"\n" +
    "              placeholder=\"{{'Room-lblPreliminaryDiagnosisPlaceholder'|translate}}\"\n" +
    "              validate=\"{required:true,messages:{required:'{{'Room-lblPreliminaryDiagnosisPlaceholder'|translate}}'}}\"></textarea>\n" +
    "</div>\n" +
    "<!--治疗意见-->\n" +
    "<div class=\"form-group\">\n" +
    "    <label>{{'Room-lblDoctorAdvised'|translate}}</label>\n" +
    "    <textarea class=\"form-control\" rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.Advised\"\n" +
    "              name=\"Advised\"\n" +
    "              placeholder=\"{{'Room-lblAdvisedPlaceholder'|translate}}\"></textarea>\n" +
    "</div>\n" +
    "<div ng-if=\"isShowMore\" class=\"more-info\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>{{'Room-lblHPI'|translate}}</label>\n" +
    "        <textarea class=\"form-control\"\n" +
    "                  rows=\"3\"\n" +
    "                  ng-readonly=\"isReadOnly\"\n" +
    "                  ng-model=\"Diagnose.MedicalRecord.PresentHistoryIllness\"\n" +
    "                  name=\"PresentHistoryIllness\"\n" +
    "                  placeholder=\"{{'Room-lblHPIPlaceholder'|translate}}\"></textarea>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>{{'Room-lblPMH'|translate}}</label>\n" +
    "        <textarea class=\"form-control\" rows=\"3\"\n" +
    "                  ng-readonly=\"isReadOnly\"\n" +
    "                  ng-model=\"Diagnose.MedicalRecord.PastMedicalHistory\"\n" +
    "                  name=\"PastMedicalHistory\"\n" +
    "                  placeholder=\"{{'Room-lblPHHPlaceholder'|translate}}\"></textarea>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>{{'Room-lblAH'|translate}}</label>\n" +
    "        <textarea class=\"form-control\" rows=\"3\"\n" +
    "                  ng-readonly=\"isReadOnly\"\n" +
    "                  ng-model=\"Diagnose.MedicalRecord.AllergicHistory\"\n" +
    "                  name=\"PastMedicalHistory\"\n" +
    "                  placeholder=\"{{'Room-lblAHPlaceholder'|translate}}\"></textarea>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--<div class=\"form-group\" style=\"overflow:hidden\">\n" +
    "        <label>{{'Room-lblPhysicalExamination'|translate}}</label>\n" +
    "        <hr />\n" +
    "        <div ng-repeat=\"item in Diagnose.PhysicalExam\" class=\"form-group-sm col-md-4\">\n" +
    "            <label>{{item.ItemCNName}}({{item.ItemENName}})：</label>\n" +
    "            <span class=\"input-group\">\n" +
    "                <input type=\"text\"\n" +
    "                       ng-if=\"item.ItemName=='BloodPressure'\"\n" +
    "                       inputmask\n" +
    "                       mask=\"999/999\"\n" +
    "                       ng-readonly=\"isReadOnly\"\n" +
    "                       ng-model=\"item.Result\"\n" +
    "                       placeholder=\"\"\n" +
    "                       class=\"form-control\" />\n" +
    "                <input type=\"text\"\n" +
    "                       ng-if=\"item.ItemName!='BloodPressure'\"\n" +
    "                       ng-readonly=\"isReadOnly\"\n" +
    "                       ng-model=\"item.Result\"\n" +
    "                       placeholder=\"\"\n" +
    "                       class=\"form-control\" />\n" +
    "                <span class=\"input-group-addon\">{{item.Unit}}</span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>-->\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"more-info-collapse text-center\">\n" +
    "    <label>\n" +
    "        <input type=\"checkbox\" ng-model=\"isShowMore\" style=\"display: none;\">\n" +
    "        <span ng-show=\"!isShowMore\" class=\"\" style=\"\">\n" +
    "            展开填写更多<br />            \n" +
    "            <i class=\"glyphicon glyphicon-triangle-bottom\"></i>\n" +
    "        </span>\n" +
    "        <span ng-show=\"isShowMore\" class=\"ng-hide\" style=\"\">\n" +
    "            收起<br />\n" +
    "            <i class=\"glyphicon glyphicon-triangle-top\"></i>\n" +
    "        </span>\n" +
    "    </label>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/editor-Diagnose-Template2.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/editor-Diagnose-Template2.html",
    "<div class=\"form-group\">\n" +
    "    <label><font class=\"text-danger\">*</font>{{'Room-lblComplained'|translate}}</label>\n" +
    "    <textarea class=\"form-control\"\n" +
    "              rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.Sympton\"\n" +
    "              name=\"Sympton\" placeholder=\"{{'Room-lblComplainedPlaceholder'|translate}}\"\n" +
    "              validate=\"{required:true,messages:{required:'{{'Room-lblComplainedPlaceholder'|translate}}'}}\"></textarea>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "    <label>{{'Room-lblHPI'|translate}}</label>\n" +
    "    <textarea class=\"form-control\"\n" +
    "              rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.PresentHistoryIllness\"\n" +
    "              name=\"PresentHistoryIllness\"\n" +
    "              placeholder=\"{{'Room-lblHPIPlaceholder'|translate}}\"></textarea>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "    <label>{{'Room-lblPMH'|translate}}</label>\n" +
    "    <textarea class=\"form-control\" rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.PastMedicalHistory\"\n" +
    "              name=\"PastMedicalHistory\"\n" +
    "              placeholder=\"{{'Room-lblPHHPlaceholder'|translate}}\"\n" +
    "\n" +
    "              ></textarea>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "    <label>{{'Room-lblAH'|translate}}</label>\n" +
    "    <textarea class=\"form-control\" rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.AllergicHistory\"\n" +
    "              name=\"PastMedicalHistory\"\n" +
    "              placeholder=\"{{'Room-lblAHPlaceholder'|translate}}\"\n" +
    "\n" +
    "              ></textarea>\n" +
    "</div>\n" +
    "<table style=\"width:100%\">\n" +
    "    <tr>\n" +
    "        <td width=\"50%\">\n" +
    "            <div class=\"form-group\" style=\"margin-right:10px;\">\n" +
    "                <label>望诊</label>\n" +
    "                <br />\n" +
    "                <select multiple ui-select2 ng-model=\"Diagnose.TagInfo.LOOK\" data-placeholder=\"请选择\" ng-required=\"true\" ng-readonly=\"isReadOnly\" style=\"width:100%;\">\n" +
    "                    <optgroup label=\"1.神志\">\n" +
    "                        <option value=\"[神志]清楚有神\">[神志]清楚有神</option>\n" +
    "                        <option value=\"[神志]清楚倦怠\">[神志]清楚倦怠</option>\n" +
    "                        <option value=\"[神志]嗜睡\">[神志]嗜睡</option>\n" +
    "                        <option value=\"[神志]浅昏迷\">[神志]浅昏迷</option>\n" +
    "                        <option value=\"[神志]深昏迷\">[神志]深昏迷</option>\n" +
    "                        <option value=\"[神志]意识模糊\">[神志]意识模糊</option>\n" +
    "                        <option value=\"[神志]谵妄\">[神志]谵妄</option>\n" +
    "                        <option value=\"[神志]其他\">[神志](其他)</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"2.形态\">\n" +
    "                        <option value=\"[形态]活动自如\">[形态]活动自如</option>\n" +
    "                        <option value=\"[形态]步履艰难\">[形态]步履艰难</option>\n" +
    "                        <option value=\"[形态]肢体瘫痪(左上)\">[形态]肢体瘫痪(左上)</option>\n" +
    "                        <option value=\"[形态]肢体瘫痪(左下)\">[形态]肢体瘫痪(左下)</option>\n" +
    "                        <option value=\"[形态]肢体瘫痪(右上)\">[形态]肢体瘫痪(右上)</option>\n" +
    "                        <option value=\"[形态]肢体瘫痪(右下)\">[形态]肢体瘫痪(右下)</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"3.体位\">\n" +
    "                        <option value=\"[体位]主动\">[体位]主动</option>\n" +
    "                        <option value=\"[体位]被动\">[体位]被动</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"4.皮肤\">\n" +
    "                        <option value=\"[皮肤]正常\">[皮肤]正常</option>\n" +
    "                        <option value=\"[皮肤]黄染\">[皮肤]黄染</option>\n" +
    "                        <option value=\"[皮肤]苍白\">[皮肤]苍白</option>\n" +
    "                        <option value=\"[皮肤]红斑\">[皮肤]红斑</option>\n" +
    "                        <option value=\"[皮肤]紫绀\">[皮肤]紫绀</option>\n" +
    "                        <option value=\"[皮肤]潮红\">[皮肤]潮红</option>\n" +
    "                        <option value=\"[皮肤]水肿\">[皮肤]水肿</option>\n" +
    "                        <option value=\"[皮肤]破损\">[皮肤]破损</option>\n" +
    "                        <option value=\"[皮肤]褥疮\">[皮肤]褥疮</option>\n" +
    "                        <option value=\"[皮肤]造痿\">[皮肤]造痿</option>\n" +
    "                        <option value=\"[皮肤]其他\">[皮肤]其他</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"5.舌象\">\n" +
    "                        <option value=\"[舌象]正常\">[舌象]舌质</option>\n" +
    "                        <option value=\"[舌象]黄染\">[舌象]淡红</option>\n" +
    "                        <option value=\"[舌象]苍白\">[舌象]淡白</option>\n" +
    "                        <option value=\"[舌象]红斑\">[舌象]红</option>\n" +
    "                        <option value=\"[舌象]紫绀\">[舌象]绛</option>\n" +
    "                        <option value=\"[舌象]潮红\">[舌象]紫暗</option>\n" +
    "                        <option value=\"[舌象]水肿\">[舌象](其他)</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"6.舌苔\">\n" +
    "                        <option value=\"[舌苔]薄白\">[舌苔]薄白</option>\n" +
    "                        <option value=\"[舌苔]薄黄\">[舌苔]薄黄</option>\n" +
    "                        <option value=\"[舌苔]黄厚\">[舌苔]黄厚</option>\n" +
    "                        <option value=\"[舌苔]滑\">[舌苔]滑</option>\n" +
    "                        <option value=\"[舌苔]燥\">[舌苔]燥</option>\n" +
    "                        <option value=\"[舌苔]腐\">[舌苔]腐</option>\n" +
    "                        <option value=\"[舌苔]腻\">[舌苔]腻</option>\n" +
    "                        <option value=\"[舌苔]其他\">[舌苔]其他</option>\n" +
    "                    </optgroup>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td width=\"50%\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-lable\">闻诊</label>\n" +
    "                <select multiple ui-select2 ng-model=\"Diagnose.TagInfo.SMELLS\" data-placeholder=\"请选择\" ng-required=\"true\" ng-readonly=\"isReadOnly\" style=\"width:100%;\">\n" +
    "                    <optgroup label=\"1.语言\">\n" +
    "                        <option value=\"[语言]清楚\">[语言]清楚</option>\n" +
    "                        <option value=\"[语言]声音低微\">[语言]声音低微</option>\n" +
    "                        <option value=\"[语言]失语\">[语言]失语</option>\n" +
    "                        <option value=\"[语言]语蹇\">[语言]语蹇</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"2.呼吸\">\n" +
    "                        <option value=\"[呼吸]平顺\">[呼吸]平顺</option>\n" +
    "                        <option value=\"[呼吸]气促\">[呼吸]气促</option>\n" +
    "                        <option value=\"[呼吸]缓慢\">[呼吸]缓慢</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"3.咳嗽\">\n" +
    "                        <option value=\"[咳嗽]薄白\">[咳嗽]无</option>\n" +
    "                        <option value=\"[咳嗽]薄黄\">[咳嗽]有</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"4.咳痰\">                  \n" +
    "                        <option value=\"[咳痰]黄厚\">[咳痰]无痰</option>\n" +
    "                        <option value=\"[咳痰]滑\">[咳痰]难咳</option>\n" +
    "                        <option value=\"[咳痰]燥\">[咳痰]易咳</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"5.痰\">\n" +
    "                        <option value=\"[痰色]白\">[痰色]白</option>\n" +
    "                        <option value=\"[痰色]黄\">[痰色]黄</option>\n" +
    "                        <option value=\"[痰色]血丝\">[痰色]血丝</option>\n" +
    "                        <option value=\"[痰色]红\">[痰色]红</option>\n" +
    "                        <option value=\"[痰色]铁锈色\">[痰色]铁锈色</option>\n" +
    "\n" +
    "                        <option value=\"[痰量]多\">[痰量]多</option>\n" +
    "                        <option value=\"[痰量]中\">[痰量]中</option>\n" +
    "                        <option value=\"[痰量]少\">[痰量]少</option>\n" +
    "\n" +
    "                        <option value=\"[痰质]清晰\">[痰质]清晰</option>\n" +
    "                        <option value=\"[痰质]粘稠\">[痰质]粘稠</option>\n" +
    "\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"6.嗅气味\">\n" +
    "                        <option value=\"[嗅气味]无异味\">[嗅气味]无异味</option>\n" +
    "                        <option value=\"[嗅气味]酸臭\">[嗅气味]酸臭</option>\n" +
    "                        <option value=\"[嗅气味]腐臭\">[嗅气味]腐臭</option>\n" +
    "                        <option value=\"[嗅气味]烂苹果味\">[嗅气味]烂苹果味</option>\n" +
    "                        <option value=\"[嗅气味]肝臭\">[嗅气味]肝臭</option>\n" +
    "                        <option value=\"[嗅气味]其他\">[嗅气味]其他</option>\n" +
    "                    </optgroup>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "    </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <td>\n" +
    "            <div class=\"form-group\" style=\"margin-right:10px;\" >\n" +
    "                <label>问诊</label>\n" +
    "                <select multiple ui-select2 ng-model=\"Diagnose.TagInfo.ASK\" data-placeholder=\"请选择\" ng-required=\"true\" ng-readonly=\"isReadOnly\" style=\"width:100%;\">\n" +
    "                    <optgroup label=\"1.嗜好\">\n" +
    "                        <option value=\"[嗜好]无特殊\">[嗜好]无特殊</option>\n" +
    "                        <option value=\"[嗜好]吸烟\">[嗜好]吸烟</option>\n" +
    "                        <option value=\"[嗜好]饮酒\">[嗜好]饮酒</option>\n" +
    "                        <option value=\"[嗜好]酸\">[嗜好]酸</option>\n" +
    "                        <option value=\"[嗜好]甜辣\">[嗜好]甜辣</option>\n" +
    "                        <option value=\"[嗜好]肥甘\">[嗜好]肥甘</option>\n" +
    "                        <option value=\"[嗜好]其他\">[嗜好]其他</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"2.饮食\">\n" +
    "                        <option value=\"[饮食]正常\">[饮食]正常</option>\n" +
    "                        <option value=\"[饮食]纳呆\">[饮食]纳呆</option>\n" +
    "                        <option value=\"[饮食]恶心呕吐\">[饮食]恶心呕吐</option>\n" +
    "                        <option value=\"[饮食]禁食\">[饮食]禁食</option>\n" +
    "                        <option value=\"[饮食]多食易饥\">[饮食]多食易饥</option>\n" +
    "                        <option value=\"[饮食]异食癖\">[饮食]异食癖</option>\n" +
    "                        <option value=\"[饮食]管喂饮食\">[饮食]管喂饮食</option>\n" +
    "                        <option value=\"[饮食]其他\">[饮食]其他</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"3.口渴\">\n" +
    "                        <option value=\"[口渴]口不渴\">[口渴]口不渴</option>\n" +
    "                        <option value=\"[口渴]口渴欲饮\">[口渴]口渴欲饮</option>\n" +
    "                        <option value=\"[口渴]渴不欲饮\">[口渴]渴不欲饮</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"4.睡眠\">\n" +
    "                        <option value=\"[睡眠]正常\">[睡眠]正常</option>\n" +
    "                        <option value=\"[睡眠]难寝\">[睡眠]难寝</option>\n" +
    "                        <option value=\"[睡眠]易醒\">[睡眠]易醒</option>\n" +
    "                        <option value=\"[睡眠]多梦\">[睡眠]多梦</option>\n" +
    "                        <option value=\"[睡眠]早醒\">[睡眠]早醒</option>\n" +
    "                        <option value=\"[睡眠]彻夜不眠\">[睡眠]彻夜不眠</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"5.大便\">\n" +
    "                        <option value=\"[大便]排便规律（有）\">[大便]排便规律（有）</option>\n" +
    "                        <option value=\"[大便]排便规律（无）\">[大便]排便规律（无）</option>\n" +
    "                        <option value=\"[大便]便秘\">[大便]便秘</option>\n" +
    "                        <option value=\"[大便]干结\">[大便]干结</option>\n" +
    "                        <option value=\"[大便]便溏\">[大便]便溏</option>\n" +
    "                        <option value=\"[大便]泄泻\">[大便]泄泻</option>\n" +
    "                        <option value=\"[大便]完古不化\">[大便]完古不化</option>\n" +
    "                        <option value=\"[大便]便血\">[大便]便血</option>\n" +
    "                        <option value=\"[大便]里急后重\">[大便]里急后重</option>\n" +
    "                        <option value=\"[大便]失禁\">[大便]失禁</option>\n" +
    "                        <option value=\"[大便]人工肛\">[大便]人工肛</option>\n" +
    "                        <option value=\"[大便]其他\">[大便]其他</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"6.小便\">\n" +
    "                        <option value=\"[小便]排尿（如常）\">[小便]排尿（如常）</option>\n" +
    "                        <option value=\"[小便]排尿（癃闭）\">[小便]排尿（癃闭）</option>\n" +
    "                        <option value=\"[小便]排尿（尿少）\">[小便]排尿（尿少）</option>\n" +
    "                        <option value=\"[小便]排尿（频数）\">[小便]排尿（频数）</option>\n" +
    "                        <option value=\"[小便]排尿（失禁）\">[小便]排尿（失禁）</option>\n" +
    "                        <option value=\"[小便]排尿（留置尿管）\">[小便]排尿（留置尿管）</option>\n" +
    "                        <option value=\"[小便]排尿（造痿）\">[小便]排尿（造痿）</option>\n" +
    "\n" +
    "                        <option value=\"[小便]尿液（淡黄血尿）\">[小便]尿液（淡黄血尿）</option>\n" +
    "                        <option value=\"[小便]尿液（浑浊）\">[小便]尿液（浑浊）</option>\n" +
    "                    </optgroup>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label>切诊</label>\n" +
    "                <select multiple ui-select2 ng-model=\"Diagnose.TagInfo.CUT\" data-placeholder=\"请选择\" ng-required=\"true\" ng-readonly=\"isReadOnly\" style=\"width:100%;\">\n" +
    "                    <optgroup label=\"1.脉象\">\n" +
    "                        <option value=\"[脉象]和缓有力\">[脉象]和缓有力</option>\n" +
    "                        <option value=\"[脉象]缓\">[脉象]缓</option>\n" +
    "                        <option value=\"[脉象]数\">[脉象]数</option>\n" +
    "                        <option value=\"[脉象]弦\">[脉象]弦</option>\n" +
    "                        <option value=\"[脉象]涩\">[脉象]涩</option>\n" +
    "                        <option value=\"[脉象]细\">[脉象]细</option>\n" +
    "                        <option value=\"[脉象]弱\">[脉象]弱</option>\n" +
    "                        <option value=\"[脉象]结\">[脉象]结</option>\n" +
    "                        <option value=\"[脉象]代\">[脉象]代</option>\n" +
    "                        <option value=\"[脉象]浮\">[脉象]浮</option>\n" +
    "                        <option value=\"[脉象]沉\">[脉象]沉</option>\n" +
    "                        <option value=\"[脉象]濡\">[脉象]濡</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"2.脘腹\">\n" +
    "                        <option value=\"[脘腹]正常\">[脘腹]正常</option>\n" +
    "                        <option value=\"[脘腹]胀满\">[脘腹]胀满</option>\n" +
    "                        <option value=\"[脘腹]腹痛喜按\">[脘腹]腹痛喜按</option>\n" +
    "                        <option value=\"[脘腹]腹痛拒按\">[脘腹]腹痛拒按</option>\n" +
    "                    </optgroup>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "\n" +
    "        <td>\n" +
    "            <div class=\"form-group\"  style=\"margin-right:10px;\" >\n" +
    "                <label>心理社会方面</label>\n" +
    "                <select multiple ui-select2 ng-model=\"Diagnose.TagInfo.SOCIETY\" data-placeholder=\"请选择\" ng-required=\"true\" ng-readonly=\"isReadOnly\" style=\"width:100%;\">\n" +
    "                    <optgroup label=\"1.情志\">\n" +
    "                        <option value=\"[情志]平和\">[情志]平和</option>\n" +
    "                        <option value=\"[情志]易怒\">[情志]易怒</option>\n" +
    "                        <option value=\"[情志]忧郁\">[情志]忧郁</option>\n" +
    "                        <option value=\"[情志]恐惧\">[情志]恐惧</option>\n" +
    "                        <option value=\"[情志]开朗\">[情志]开朗</option>\n" +
    "                        <option value=\"[情志]孤僻\">[情志]孤僻</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"2.家庭照顾者\">\n" +
    "                        <option value=\"[家庭照顾者]独居\">[家庭照顾者]独居</option>\n" +
    "                        <option value=\"[家庭照顾者]配偶\">[家庭照顾者]配偶</option>\n" +
    "                        <option value=\"[家庭照顾者]子女\">[家庭照顾者]子女</option>\n" +
    "                        <option value=\"[家庭照顾者]保姆\">[家庭照顾者]保姆</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"3.医疗费\">\n" +
    "                        <option value=\"[医疗费]公费\">[医疗费]公费</option>\n" +
    "                        <option value=\"[医疗费]自费\">[医疗费]自费</option>\n" +
    "                        <option value=\"[医疗费]社保\">[医疗费]社保</option>\n" +
    "                        <option value=\"[医疗费]劳保\">[医疗费]劳保</option>\n" +
    "                        <option value=\"[医疗费]医疗保险\">[医疗费]医疗保险</option>\n" +
    "                    </optgroup>\n" +
    "                    <optgroup label=\"4.对疾病的认识\">\n" +
    "                        <option value=\"[对疾病的认识]认识\">[对疾病的认识]认识</option>\n" +
    "                        <option value=\"[对疾病的认识]一般认识\">[对疾病的认识]一般认识</option>\n" +
    "                        <option value=\"[对疾病的认识]不认识\">[对疾病的认识]不认识</option>\n" +
    "                    </optgroup>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "     <td></td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "<div class=\"form-group\">\n" +
    "    <label><font class=\"text-danger\">*</font>{{'Room-lblChinesePreliminaryDiagnosis'|translate}}</label>\n" +
    "    <textarea class=\"form-control\" rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.PreliminaryDiagnosis\"\n" +
    "              placeholder=\"{{'Room-lblChinesePreliminaryDiagnosisPlaceholder'|translate}}\"\n" +
    "              validate=\"{required:true,messages:{required:'{{'Room-lblChinesePreliminaryDiagnosisPlaceholder'|translate}}'}}\"\n" +
    "              name=\"PreliminaryDiagnosis\"></textarea>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "    <label><font class=\"text-danger\">*</font>{{'Room-lblDoctorAdvised'|translate}}</label>\n" +
    "    <textarea class=\"form-control\" rows=\"3\"\n" +
    "              ng-readonly=\"isReadOnly\"\n" +
    "              ng-model=\"Diagnose.MedicalRecord.Advised\"\n" +
    "              placeholder=\"{{'Room-lblDoctorAdvisedPlaceholder'|translate}}\"\n" +
    "              validate=\"{required:true,messages:{required:'{{'Room-lblDoctorAdvisedPlaceholder'|translate}}'}}\"\n" +
    "              name=\"Advised\"></textarea>\n" +
    "</div>");
}]);

angular.module("/static/modules/Doctor/directives/editor-Patient.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/editor-Patient.html",
    "<div class=\"row form-horizontal\">\n" +
    "    <div class=\"form-group col-sm-12 col-md-6\">\n" +
    "        <label class=\"control-label col-sm-4\" for=\"MemberName\"><font class=\"text-danger\">*</font>{{'lblName'|translate}}</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input class=\"form-control\"\n" +
    "                    ng-model=\"member.MemberName\"\n" +
    "                    name=\"MemberName\" \n" +
    "                    placeholder=\"{{'FamiliesEdit-msgEnterName'|translate}}\"\n" +
    "                    validate=\"{required:true,messages:{required:'{{'FamiliesEdit-msgEnterName'|translate}}'}}\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group col-sm-12 col-md-6\">\n" +
    "        <label class=\"control-label col-sm-4\" for=\"Mobile\"><font class=\"text-danger\">*</font>{{'lblTel'|translate}}</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input class=\"form-control\"\n" +
    "                   ng-model=\"member.Mobile\"\n" +
    "                   name=\"Mobile\"\n" +
    "                   placeholder=\"{{'FamiliesEdit-msgEnterPhone'|translate}}\"\n" +
    "                   validate=\"{required:true,phone:true,messages:{required:'{{'FamiliesEdit-msgEnterPhone'|translate}}'}}\" />\n" +
    "        </div>\n" +
    "    </div>    \n" +
    "</div>\n" +
    "<div class=\"row form-horizontal\">\n" +
    "    <div class=\"form-group col-sm-12 col-md-6\">\n" +
    "        <label class=\"control-label col-sm-4\" for=\"Gender\"><font class=\"text-danger\">*</font>{{'lblSex'|translate}}</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <select class=\"form-control\"\n" +
    "                    id=\"Gender\"\n" +
    "                    name=\"Gender\"\n" +
    "                    ng-model=\"member.Gender\"\n" +
    "                    ng-disabled=\"isInputIDNumber\"\n" +
    "                    ng-readonly=\"isInputIDNumber\"\n" +
    "                    ng-options=\"item.Key as item.Value for item in genders\"\n" +
    "                    placeholder=\"{{'请选择性别'|translate}}\"\n" +
    "                    validate=\"{required:true,selected:true,messages:{required:'{{'请选择性别'|translate}}',selected:'{{'请选择性别'|translate}}'}}\">\n" +
    "            </select>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group col-sm-12 col-md-6\">\n" +
    "        <label class=\"control-label col-sm-4\" for=\"Birthday\"><font class=\"text-danger\">*</font>{{'lblBirth'|translate}}</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input name=\"Birthday\" class=\"form-control\"\n" +
    "                   datepicker\n" +
    "                   type=\"text\"\n" +
    "                   id=\"Birthday\"\n" +
    "                   ng-model=\"member.Birthday\"\n" +
    "                   ng-readonly=\"isInputIDNumber\"\n" +
    "                   placeholder=\"{{'请选择出生日期'|translate}}\" \n" +
    "                   validate=\"{required:true,messages:{required:'{{'请选择出生日期'|translate}}'}}\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row form-horizontal\">\n" +
    "    <div class=\"form-group col-sm-12 col-md-6\">\n" +
    "        <label class=\"control-label col-sm-4\" for=\"IDNumber\">{{'lblIDCode'|translate}}</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input class=\"form-control\"\n" +
    "                   ng-model=\"member.IDNumber\"\n" +
    "                   name=\"IDNumber\" placeholder=\"{{'FamiliesEdit-msgEnterIDNumber'|translate}}\" \n" +
    "                   validate=\"{idNumber:true}\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group col-sm-12 col-md-6\">\n" +
    "        <label class=\"control-label col-sm-4\" for=\"Email\">{{'lblAge'|translate}}</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input class=\"form-control\"\n" +
    "                   ng-readonly=\"true\"\n" +
    "                   ng-model=\"member.Age\"\n" +
    "                   name=\"Age\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Doctor/directives/editor-Recipe-Diagnosis.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/editor-Recipe-Diagnosis.html",
    "<table cellspacing=\"0\" class=\"table table-bordered table-striped recipeDiagnoseList\">\n" +
    "    <thead>\n" +
    "        <tr style=\"background-color:#f4f5f9\">\n" +
    "            <th width=\"120\">{{'Room-lblTCD'|translate}}</th>\n" +
    "            <th>{{'Room-lblDiagnosisCode'|translate}}</th>\n" +
    "            <th>{{'Room-lblNotes'|translate}}</th>\n" +
    "            <th width=\"30\" align=\"center\">\n" +
    "            </th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr ng-show=\"Diagnosis.length<=0\">\n" +
    "            <td colspan=\"4\">\n" +
    "                <center>{{'Room-lblNotDiagnosis'|translate}}</center>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"item in Diagnosis\">\n" +
    "            <td align=\"center\">\n" +
    "                {{item.Detail.DiseaseCode}}\n" +
    "                <input type=\"hidden\" name=\"DiseaseCode\" ng-model=\"item.Detail.DiseaseCode\" />\n" +
    "                <input type=\"hidden\" name=\"ID\" ng-model=\"item.Detail.ID\" />\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <div class=\"td-full form-group-sm form-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\"\n" +
    "                           name=\"DiseaseName{{$index}}\"\n" +
    "                           autocomplete=\"off\"\n" +
    "                           ng-readonly=\"item.Detail.DiseaseCode!=''\"\n" +
    "                           ng-model=\"item.Detail.DiseaseName\"\n" +
    "                           placeholder=\"{{'Room-lblDiseaseNamePlaceholder'|translate}}\"\n" +
    "                           typeahead=\"diagnose as diagnose.DiseaseName for diagnose in getICDRecords($viewValue,type)\"\n" +
    "                           typeahead-editable=\"true\"\n" +
    "                           typeahead-on-select=\"onDiseaseSelect(item,$model,$label)\"\n" +
    "                           validate=\"{required:true,messages:{required:'{{'Room-lblDiseaseNamePlaceholder'|translate}}'}}\" />\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <div class=\"td-full form-group-sm form-group\">\n" +
    "                    <input class=\"form-control\"\n" +
    "                           autocomplete=\"off\"\n" +
    "                           type=\"text\" name=\"Description{{$index}}\"\n" +
    "                           ng-model=\"item.Description\"\n" +
    "                           placeholder=\"{{'Room-lblDescriptionPlaceholder'|translate}}\" />\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td align=\"center\">\n" +
    "                <center> <a class=\"delete_button\" href=\"javascript:void(0);\" ng-click=\"onRemoveICDRecord(item)\">-</a></center>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td colspan=\"4\">\n" +
    "                <div class=\"td-full form-group-sm\">\n" +
    "                    <button type=\"button\" class=\"btn btn-block btn-default btn-sm\" ng-click=\"onAddICDRecord()\"><span class=\"glyphicon glyphicon-plus text-success\"></span> {{'btnAdd'|translate}}</button>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>");
}]);

angular.module("/static/modules/Doctor/directives/editor-Recipe-Drugs.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/editor-Recipe-Drugs.html",
    "<!--中药处方-->\n" +
    "<div ng-if=\"recipe.RecipeType == 1\">\n" +
    "    <table cellspacing=\"0\" class=\"table table-striped table-bordered recipeDrugList\">\n" +
    "        <thead>\n" +
    "            <tr style=\"background-color:#f4f5f9\">\n" +
    "                <th>{{'Room-lblDrugName'|translate}}</th>\n" +
    "                <th width=\"100\">{{'Room-lblFootNote'|translate}}</th>\n" +
    "                <th width=\"150\">{{'Room-lblDosage'|translate}}</th>\n" +
    "                <th width=\"70\">{{'Room-lblPrice'|translate}}</th>\n" +
    "                <th width=\"30\" align=\"center\"></th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-show=\"recipe.Details.length<=0\">\n" +
    "                <td colspan=\"5\">\n" +
    "                    <center>\n" +
    "                        {{'Room-lblNotDrugs'|translate}}\n" +
    "                    </center>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"drugItem in recipe.Details\" ng-class=\"{'has-error':!drugItem.Drug || !drugItem.Drug.DrugCode,'has-success':drugItem.Drug}\">\n" +
    "                <td class=\"form-group-sm form-group col-md-5\">\n" +
    "                    <input type=\"text\" class=\"form-control\"\n" +
    "                           autocomplete=\"off\"\n" +
    "                           name=\"{{'DrugDetailName'+$index}}\"\n" +
    "                           ng-readonly=\"drugItem.Drug && drugItem.Drug.DrugCode!=''\"\n" +
    "                           ng-model=\"drugItem.Drug\"\n" +
    "                           placeholder=\"{{'Room-lblDrugNamePlaceholder'|translate}}\"\n" +
    "                           typeahead=\"drugItem as formatDrugItem(drugItem) for drugItem in getDrugDetails($viewValue,1,recipe.DrugstoreID)\"\n" +
    "                           typeahead-editable=\"false\"\n" +
    "                           typeahead-on-select=\"onDrugSelect($item, $model, $label) \"\n" +
    "                           validate=\"{required:true,messages:{required:'{{'Room-lblDrugNamePlaceholder'|translate}}'}}\" />\n" +
    "                </td>\n" +
    "                <td class=\"form-group-sm form-group col-md-2\">\n" +
    "                    <select class=\"form-control\"\n" +
    "                            ng-model=\"drugItem.FootNote\"\n" +
    "                            name=\"{{'FootNote'+$index}}\"\n" +
    "                            ng-options=\"item.name as item.name for item in ENUM_FootNote\">\n" +
    "                        <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                    </select>\n" +
    "                </td>\n" +
    "                <td class=\"form-group-sm form-group col-md-2\">\n" +
    "                    <div class=\"input-group input-group-sm prel doseInputWid\">\n" +
    "                        <input class=\"form-control doseInput\"\n" +
    "                               type=\"number\"\n" +
    "                               name=\"{{'Dose'+$index}}\"\n" +
    "                               value=\"1\"\n" +
    "                               min=\"1\"\n" +
    "                               ng-model=\"drugItem.Dose\"\n" +
    "                               validate=\"{required:true,min:1,messages:{required:'{{'Room-lblDosePlaceholder'|translate}}'}}\" />\n" +
    "                        <select class=\"form-control doseUnitSel\"\n" +
    "                                disabled\n" +
    "                                ng-model=\"drugItem.Drug.DoseUnit\"\n" +
    "                                name=\"{{'DoseUnit'+$index}}\"\n" +
    "                                validate=\"{required:true, selected:true,messages:{required:'{{'Room-lblChoosePlaceholder'|translate}}',selected:'{{'Room-lblChoosePlaceholder'|translate}}'}}\"\n" +
    "                                ng-options=\"doseUnit as doseUnit for doseUnit in ENUM_doseUnitCN\">\n" +
    "                            <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td class=\"col-md-2\">\n" +
    "                    ￥{{((drugItem.Dose || 1) * (drugItem.Drug.UnitPrice || 0)) |number:3}}\n" +
    "                </td>\n" +
    "                <td align=\"center\" class=\"text-center col-md-1\">\n" +
    "                    <a class=\"delete_button\" href=\"javascript:void(0);\" ng-click=\"onRemoveDrugDetail(drugItem,recipe)\">-</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td colspan=\"5\">\n" +
    "                    <div class=\"td-full form-group-sm\">\n" +
    "                        <button type=\"button\" class=\"btn btn-block btn-default btn-sm\" ng-click=\"onAddDrugDetail(recipe)\"><span class=\"glyphicon glyphicon-plus\" style=\"color:#6BBD3D\"></span> {{'btnAdd'|translate}}</button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "\n" +
    "    </table>\n" +
    "    <div>\n" +
    "        <table cellspacing=\"0\" class=\"table table-striped table-bordered\">\n" +
    "            <tr>\n" +
    "                <td class=\"text-right\">\n" +
    "                    <label>{{'Room-lblTCMQuantity'|translate}}：</label>\n" +
    "                </td>\n" +
    "                <td class=\"text-center\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <span class=\"input-group input-group-sm\">\n" +
    "                            <span class=\"input-group-addon\" id=\"basic-addon2\">{{'Room-lblTCMQuantityPrefix'|translate}}</span>\n" +
    "                            <input type=\"number\" class=\"form-control\"\n" +
    "                                   name=\"TCMQuantity\"\n" +
    "                                   ng-model=\"recipe.TCMQuantity\"\n" +
    "                                   ng-change=\"onTCMQuantityChange()\"\n" +
    "                                   required\n" +
    "                                   min=\"1\"\n" +
    "                                   validate=\"{required:true,number:true,messages:{required:'{{'Room-lblTCMQuantityPlaceholder'|translate}}'}}\" />\n" +
    "                            <span class=\"input-group-addon\" id=\"basic-addon2\">{{'Room-lblTCMQuantitySuffix'|translate}}</span>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div class=\"input-group form-group\">\n" +
    "                        <div class=\"input-group-addon\">代煎</div>\n" +
    "                        <div class=\"form-group-sm\">\n" +
    "                            <select class=\"form-control\"\n" +
    "                                    id=\"Recipe_Replace\"\n" +
    "                                    name=\"Replace\"\n" +
    "                                    ng-model=\"recipe.Replace\"                                    \n" +
    "                                    ng-change=\"recipe.Replace=='0'?(recipe.ReplaceDose=0):(recipe.ReplaceDose=recipe.TCMQuantity)\"\n" +
    "                                    validate=\"{tcmQuantity:true,messages:{tcmQuantity:'剂数大于等于3才可以选择代煎'}}\">\n" +
    "                                <option value=\"1\">是（{{recipe.ReplacePrice}}元/剂）</option>\n" +
    "                                <option value=\"0\">否</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"col-md-1 text-right\"><label>制法：</label></td>\n" +
    "                <td class=\"col-md-2\">\n" +
    "                    <div class=\"form-group form-group-sm\">\n" +
    "                        <!--制法-->\n" +
    "                        <select class=\"form-control\"\n" +
    "                                ng-model=\"recipe.BoilWay\"\n" +
    "                                name=\"BoilWay\"\n" +
    "                                validate=\"{required:true, selected:true,messages:{required:'{{'Room-lblChoosePlaceholder'|translate}}',selected:'{{'Room-lblChoosePlaceholder'|translate}}'}}\"\n" +
    "                                ng-options=\"item.shade as item.name for item in ENUM_BoilWay\">\n" +
    "                            <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                        </select>\n" +
    "\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td class=\"col-md-3 form-group-sm\">\n" +
    "                    <!--几煎-->\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input class=\"form-control\"\n" +
    "                               name=\"DecoctNum\"\n" +
    "                               type=\"number\"\n" +
    "                               value=\"1\"\n" +
    "                               min=\"1\"\n" +
    "                               max=\"10\"\n" +
    "                               placeholder=\"1\"\n" +
    "                               required\n" +
    "                               validate=\"{required:true,number:true,messages:{required:'请输入几煎数量'}}\"\n" +
    "                               ng-model=\"recipe.DecoctNum\" />\n" +
    "                        <div class=\"input-group-addon\">煎</div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td class=\"col-md-3 form-group-sm\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <!--煎前水量-->\n" +
    "                        <div class=\"input-group-addon\">清水</div>\n" +
    "                        <input class=\"form-control\"\n" +
    "                               type=\"number\"\n" +
    "                               min=\"1\"\n" +
    "                               value=\"500\"\n" +
    "                               max=\"9999\"                               \n" +
    "                               placeholder=\"500\"\n" +
    "                               name=\"DecoctTotalWater\"\n" +
    "                               ng-model=\"recipe.DecoctTotalWater\"\n" +
    "                               required\n" +
    "                               validate=\"{required:true,min:1,max:9999,messages:{required:'请输入煎前的水量'}}\" />\n" +
    "                        <div class=\"input-group-addon\">毫升</div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td class=\"col-md-3 form-group-sm\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <div class=\"input-group-addon\">煎至</div>\n" +
    "                        <!--煎后水量-->\n" +
    "                        <input class=\"form-control\" type=\"number\"\n" +
    "                               placeholder=\"300\"\n" +
    "                               required\n" +
    "                               value=\"300\"\n" +
    "                               name=\"DecoctTargetWater\"\n" +
    "                               ng-model=\"recipe.DecoctTargetWater\"\n" +
    "                               max=\"{{recipe.DecoctTotalWater}}\"\n" +
    "                               min=\"1\"\n" +
    "                               validate=\"{required:true,min:1,max:9999,messages:{required:'请输入煎后的水量'}}\" />\n" +
    "                        <div class=\"input-group-addon\">毫升</div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"text-right\">\n" +
    "                    <label>用法：</label>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div class=\"form-group form-group-sm\">\n" +
    "                        <select class=\"form-control\"\n" +
    "                                ng-model=\"recipe.Usage\"\n" +
    "                                name=\"Usage\"\n" +
    "                                validate=\"{required:true, selected:true,messages:{required:'{{'Room-lblChoosePlaceholder'|translate}}',selected:'{{'Room-lblChoosePlaceholder'|translate}}'}}\"\n" +
    "                                ng-options=\"item.shade as item.shade for item in ENUM_Usage\">\n" +
    "                            <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div class=\"input-group input-group-sm\">\n" +
    "                        <div class=\"input-group-addon\">每</div>\n" +
    "                        <!--每日几剂频率-->\n" +
    "                        <input class=\"form-control\" type=\"number\"\n" +
    "                               placeholder=\"1\"\n" +
    "                               min=\"1\"\n" +
    "                               value=\"1\"\n" +
    "                               required\n" +
    "                               name=\"FreqDay\"\n" +
    "                               max=\"10\"\n" +
    "                               validate=\"{required:true,min:1,max:10}\"\n" +
    "                               ng-model=\"recipe.FreqDay\" />\n" +
    "                        <div class=\"input-group-addon\">日</div>\n" +
    "                        <input class=\"form-control\" type=\"number\" placeholder=\"1\"\n" +
    "                               min=\"1\"\n" +
    "                               required\n" +
    "                               max=\"10\"\n" +
    "                               value=\"1\"\n" +
    "                               name=\"FreqTimes\"\n" +
    "                               validate=\"{required:true,min:1,max:10}\"\n" +
    "                               ng-model=\"recipe.FreqTimes\" />\n" +
    "                        <div class=\"input-group-addon\">剂</div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div class=\"input-group input-group-sm\">\n" +
    "                        <div class=\"input-group-addon\">分</div>\n" +
    "                        <!--分几次服-->\n" +
    "                        <input class=\"form-control\" type=\"number\"\n" +
    "                               placeholder=\"1\"\n" +
    "                               min=\"1\"\n" +
    "                               max=\"10\"\n" +
    "                               required\n" +
    "                               value=\"1\"\n" +
    "                               name=\"Times\"\n" +
    "                               validate=\"{required:true,min:1,max:10}\"\n" +
    "                               ng-model=\"recipe.Times\" />\n" +
    "                        <div class=\"input-group-addon\">次服</div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "        </table>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>嘱托</label>\n" +
    "            <textarea class=\"form-control\" name=\"Remark\" ng-model=\"recipe.Remark\"></textarea>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!--西药处方-->\n" +
    "<div ng-if=\"recipe.RecipeType ==2\">\n" +
    "    <table cellspacing=\"0\" class=\"table table-striped table-bordered\">\n" +
    "        <thead>\n" +
    "            <tr style=\"background-color:#f4f5f9\">\n" +
    "                <th>{{'Room-lblDrugName'|translate}}</th>\n" +
    "                <th width=\"100\">{{'Room-lblBillingAmount'|translate}}</th>\n" +
    "                <th width=\"100\">{{'Room-lblDosage'|translate}}</th>\n" +
    "                <th width=\"100\">{{'Room-lblFrequency'|translate}}</th>\n" +
    "                <th width=\"100\">{{'Room-lblRoute'|translate}}</th>\n" +
    "                <th width=\"70\">{{'Room-lblPrice'|translate}}</th>\n" +
    "                <th width=\"30\" align=\"center\"></th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-show=\"recipe.Details.length<=0\">\n" +
    "                <td colspan=\"7\">\n" +
    "                    <center>\n" +
    "                        {{'Room-lblNotDrugs'|translate}}\n" +
    "                    </center>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"drugItem in recipe.Details\" ng-class=\"{'has-error':!drugItem.Drug  || !drugItem.Drug.DrugCode,'has-success':drugItem.Drug}\">\n" +
    "                <td class=\"form-group  form-group-sm\">\n" +
    "                    <input class=\"form-control\" type=\"hidden\"\n" +
    "                           name=\"{{'DrugCode'+$index}}\"\n" +
    "                           ng-model=\"drugItem.Drug.DrugCode\" />\n" +
    "                    <input class=\"form-control\"\n" +
    "                           type=\"text\"\n" +
    "                           autocomplete=\"off\"\n" +
    "                           ng-readonly=\"drugItem.Drug && drugItem.Drug.DrugCode!=''\"\n" +
    "                           name=\"{{'DrugName'+$index}}\"\n" +
    "                           placeholder=\"{{'Room-lblDrugNamePlaceholder'|translate}}\"\n" +
    "                           ng-model=\"drugItem.Drug\"\n" +
    "                           typeahead=\"drugItem as formatDrugItem(drugItem) for drugItem in getDrugDetails($viewValue,2,recipe.DrugstoreID)\"\n" +
    "                           typeahead-editable=\"false\"\n" +
    "                           typeahead-on-select=\"onDrugSelect($item, $model, $label) \"\n" +
    "                           validate=\"{required:true,messages:{required:'{{'Room-lblDrugNamePlaceholder'|translate}}'}}\" />\n" +
    "                </td>\n" +
    "                <td class=\"form-group  form-group-sm\">\n" +
    "                    <div class=\"input-group input-group-sm\">\n" +
    "                        <input class=\"form-control\"\n" +
    "                               type=\"number\"\n" +
    "                               name=\"{{'Quantity'+$index}}\"\n" +
    "                               ng-model=\"drugItem.Quantity\"\n" +
    "                               ng-change=\"drugItem.Dose=drugItem.Drug.TotalDose*drugItem.Quantity\"\n" +
    "                               required\n" +
    "                               min=\"1\"\n" +
    "                               validate=\"{required:true,min:1,messages:{required:'{{'Room-lblQuantityPlaceholder'|translate}}'}}\" />\n" +
    "                        <span class=\"input-group-addon\">{{drugItem.Drug.Unit}}</span>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td class=\"form-group  form-group-sm\">\n" +
    "                    <div class=\"input-group  input-group-sm prel doseInputWid\">\n" +
    "                        <input class=\"form-control doseInput\"\n" +
    "                               type=\"number\"\n" +
    "                               name=\"{{'Dose'+$index}}\"\n" +
    "                               ng-model=\"drugItem.Dose\"\n" +
    "                               validate=\"{required:true,messages:{required:'{{'Room-lblDosePlaceholder'|translate}}'}}\" />\n" +
    "                        <select class=\"form-control doseUnitSel\"\n" +
    "                                ng-model=\"drugItem.Drug.DoseUnit\"\n" +
    "                                name=\"{{'DoseUnit'+$index}}\"\n" +
    "                                validate=\"{required:true, selected:true,messages:{required:'{{'Room-lblChoosePlaceholder'|translate}}',selected:'{{'Room-lblFrequencyPlaceholder'|translate}}'}}\"\n" +
    "                                ng-options=\"doseUnit as doseUnit for doseUnit in ENUM_doseUnitEN\">\n" +
    "                            <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                </td>\n" +
    "                <td class=\"form-group  form-group-sm\">\n" +
    "\n" +
    "                    <div class=\"input-group input-group-sm\">\n" +
    "                        <select class=\"form-control\"\n" +
    "                                ng-model=\"drugItem.Frequency\"\n" +
    "                                name=\"{{'Frequency'+$index}}\"\n" +
    "                                ng-options=\"drugItem.shade as drugItem.name for drugItem in ENUM_drugFrequency\"\n" +
    "                                validate=\"{required:true, selected:true,messages:{required:'{{'Room-lblFrequencyPlaceholder'|translate}}',selected:'{{'Room-lblFrequencyPlaceholder'|translate}}'}}\">\n" +
    "                            <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                </td>\n" +
    "                <td class=\"form-group  form-group-sm\">\n" +
    "                    <select class=\"form-control\"\n" +
    "                            name=\"{{'DrugRouteName'+$index}}\"\n" +
    "                            ng-model=\"drugItem.DrugRouteName\"\n" +
    "                            ng-options=\"drugRoteItem.shade as drugRoteItem.shade for drugRoteItem in ENUM_drugRoteItems\"\n" +
    "                            validate=\"{required:true,selected:true,messages:{required:'{{'Room-lblRoutePlaceholder'|translate}}',selected:'{{'Room-lblRoutePlaceholder'|translate}}'}}\">\n" +
    "                        <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                    </select>\n" +
    "                </td>\n" +
    "                <td class=\"form-group  form-group-sm\">\n" +
    "                    ￥{{((drugItem.Quantity || 1) * (drugItem.Drug.UnitPrice || 0))|number:'2'}}\n" +
    "                </td>\n" +
    "                <td class=\"form-group  form-group-sm\">\n" +
    "                    <a class=\"delete_button\" href=\"javascript:void(0);\" ng-click=\"onRemoveDrugDetail(drugItem,recipe)\">-</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td colspan=\"7\">\n" +
    "                    <div class=\"td-full form-group-sm\">\n" +
    "                        <button type=\"button\" class=\"btn btn-block btn-default btn-sm\" style=\"background-color: #0accce; border: none; color: #fff;\" ng-click=\"onAddDrugDetail(recipe)\"><span class=\"glyphicon glyphicon-plus\" style=\"color:#fff\"></span> {{'btnAdd'|translate}}</button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/editor-Recipe-Formular.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/editor-Recipe-Formular.html",
    "<div class=\"form-group\">\n" +
    "    <label>{{'Room-lblRecipeType'|translate}}：</label>\n" +
    "    <span>\n" +
    "        <select class=\"form-control\"\n" +
    "                name=\"RecipeTypeID\"\n" +
    "                ng-model=\"RecipeFile.RecipeType\"\n" +
    "                validate=\"{selected:true,messages:{selected:'请选择处方类型'}}\">\n" +
    "            <option value=\"1\" ng-selected=\"RecipeFile.RecipeType==1\">{{'tabCnPrescription'|translate}}</option>\n" +
    "            <option value=\"2\" ng-selected=\"RecipeFile.RecipeType==2\">{{'tabWestPrescription'|translate}}</option>\n" +
    "        </select>\n" +
    "    </span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label>{{'lblPrescriptionName'|translate}}：</label>\n" +
    "    <span>\n" +
    "        <input type=\"text\"\n" +
    "               class=\"form-control\"\n" +
    "               ng-model=\"RecipeFile.RecipeFormulaName\"\n" +
    "               name=\"RecipeFormulaName\"\n" +
    "               validate=\"{required:true,messages:{required:'请输入处方名称！'}}\" />\n" +
    "    </span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <table cellspacing=\"0\" class=\"table table-bordered\" ng-if=\"RecipeFile.RecipeType ==1\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th>{{'Room-lblDrugName'|translate}}</th>\n" +
    "                <th>{{'lblSpecification'|translate}}</th>\n" +
    "                <th width=\"100\">{{'lblDose'|translate}}</th>\n" +
    "\n" +
    "                <th width=\"30\" align=\"center\">\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-show=\"RecipeFile.Details.length<=0\">\n" +
    "                <td colspan=\"5\">\n" +
    "                    <center>\n" +
    "                        {{'Room-lblNotDrugs'|translate}}\n" +
    "                    </center>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"drugItem in RecipeFile.Details\" ng-class=\"{'has-error':!drugItem.Drug || !drugItem.Drug.DrugCode,'has-success':drugItem.Drug}\">\n" +
    "                <td class=\"form-group form-group-sm\">\n" +
    "\n" +
    "                    <input type=\"text\"\n" +
    "                           class=\"form-control\"\n" +
    "                           name=\"{{'DrugDetailName'+$index}}\"\n" +
    "                           ng-model=\"drugItem.Drug\"\n" +
    "                           placeholder=\"{{'Room-lblDrugNamePlaceholder'|translate}}\"\n" +
    "                           typeahead=\"drugItem as formatDrugItem(drugItem) for drugItem in getDrugDetails($viewValue,1)\"\n" +
    "                           typeahead-editable=\"false\"\n" +
    "                           typeahead-on-select=\"onDrugSelect($item, $model, $label) \"\n" +
    "                           validate=\"{required:true,messages:{required:'请输入药品名称或拼音首拼，如：红花，HH'}}\" />\n" +
    "\n" +
    "                </td>\n" +
    "                <td class=\"form-group form-group-sm\">\n" +
    "\n" +
    "                    {{drugItem.Drug.Specification}}\n" +
    "\n" +
    "                </td>\n" +
    "                <td class=\"form-group form-group-sm\">\n" +
    "\n" +
    "                    <div class=\"input-group input-group-sm prel doseInputWid\">\n" +
    "                        <input class=\"form-control doseInput\" type=\"number\" name=\"{{'Dose'+$index}}\" value=\"1\" ng-model=\"drugItem.Dose\" required min=\"0.01\" />\n" +
    "                        <!--<span class=\"input-group-addon\">{{drugItem.DoseUnit}}</span>-->\n" +
    "                        <select class=\"form-control doseUnitSel\"\n" +
    "                                ng-model=\"drugItem.Drug.DoseUnit\"\n" +
    "                                name=\"{{'DoseUnit'+$index}}\"\n" +
    "                                ng-options=\"doseUnit as doseUnit for doseUnit in doseUnitCN\">\n" +
    "                            <!--  validate=\"{required:true, selected:true,messages:{required:'请选择用药频率',selected:'请选择用药频率'}}\"> -->\n" +
    "                            <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                </td>\n" +
    "                <td align=\"center\">\n" +
    "                    <a class=\"btn btn-danger btn-xs\" href=\"javascript:void(0);\" ng-click=\"onRemoveDrugDetail(drugItem)\">{{'btnDelete'|translate}}</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr>\n" +
    "                <td colspan=\"5\">\n" +
    "                    <button type=\"button\" class=\"btn btn-block btn-default btn-sm\" ng-click=\"onAddDrugDetail()\"><span class=\"glyphicon glyphicon-plus\" style=\"color:#6BBD3D\"></span> {{'btnAddDrug'|translate}}</button>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "\n" +
    "    </table>\n" +
    "\n" +
    "    <!--西药处方-->\n" +
    "    <table cellspacing=\"0\" class=\"table table-bordered col-md-12\" ng-if=\"RecipeFile.RecipeType == 2\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th>{{'Room-lblDrugName'|translate}}</th>\n" +
    "                <th>{{'lblSpecification'|translate}}</th>\n" +
    "\n" +
    "                <th width=\"100\">{{'lblDose'|translate}}</th>\n" +
    "                <th width=\"150\">{{'lblFrequency'|translate}}</th>\n" +
    "                <th width=\"150\">{{'Room-lblRoute'|translate}}</th>\n" +
    "                <th width=\"30\" align=\"center\">\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-show=\"RecipeFile.Details.length<=0\">\n" +
    "                <td colspan=\"7\">\n" +
    "                    <center>\n" +
    "\n" +
    "                        {{'Room-lblNotDrugs'|translate}}\n" +
    "\n" +
    "                    </center>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"drugItem in RecipeFile.Details\">\n" +
    "                <td class=\"form-group form-group-sm\">\n" +
    "                    <input class=\"form-control\" type=\"text\" name=\"{{'DrugDetailName'+$index}}\" placeholder=\"{{'Room-lblDrugNamePlaceholder'|translate}}\" required\n" +
    "                           ng-model=\"drugItem.Drug\"\n" +
    "                           typeahead=\"drugItem as formatDrugItem(drugItem) for drugItem in getDrugDetails($viewValue,2)\"\n" +
    "                           typeahead-editable=\"true\"\n" +
    "                           typeahead-on-select=\"onDrugSelect($item, $model, $label) \"\n" +
    "                           validate=\"{required:true,messages:{required:'输入药品名称或拼音首拼：如：红花，HH'}}\" />\n" +
    "                </td>\n" +
    "                <td class=\"form-group form-group-sm\">\n" +
    "\n" +
    "                    <input class=\"form-control\"\n" +
    "                           type=\"hidden\"\n" +
    "                           name=\"{{'DrugCode'+$index}}\"\n" +
    "                           ng-model=\"drugItem.Drug.DrugCode\" />\n" +
    "                    {{drugItem.Drug.Specification}}\n" +
    "                </td>\n" +
    "\n" +
    "                <td class=\"form-group form-group-sm\">\n" +
    "\n" +
    "                    <div class=\"input-group  input-group-sm  prel doseInputWid\">\n" +
    "                        <input class=\"form-control doseInput\"\n" +
    "                               type=\"number\"\n" +
    "                               name=\"{{'Dose'+$index}}\"\n" +
    "                               ng-model=\"drugItem.Dose\"\n" +
    "                               required\n" +
    "                               min=\"0.01\"\n" +
    "                               validate=\"{required:true,min:0.01,messages:{required:'请输入剂量'}}\" />\n" +
    "                        <!--<span class=\"input-group-addon\">{{drugItem.Drug.DoseUnit}}</span>-->\n" +
    "                        <select class=\"form-control doseUnitSel\"\n" +
    "                                ng-model=\"drugItem.Drug.DoseUnit\"\n" +
    "                                name=\"{{'DoseUnit'+$index}}\"\n" +
    "                                ng-options=\"doseUnit as doseUnit for doseUnit in doseUnitEN\">\n" +
    "                            <!--  validate=\"{required:true, selected:true,messages:{required:'请选择用药频率',selected:'请选择用药频率'}}\"> -->\n" +
    "                            <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                </td>\n" +
    "                <td class=\"form-group form-group-sm\">\n" +
    "\n" +
    "                    <div class=\"input-group input-group-sm\">\n" +
    "                        <select class=\"form-control\"\n" +
    "                                name=\"{{'Frequency'+$index}}\"\n" +
    "                                ng-model=\"drugItem.Frequency\"\n" +
    "                                validate=\"{required:true, selected:true,messages:{required:'请选择用药频率',selected:'请选择用药频率'}}\">\n" +
    "                            <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                            <option ng-selected=\"drugItem.Frequency == freItem.name\"\n" +
    "                                    ng-repeat=\"freItem in drugFrequency\"\n" +
    "                                    ng-value=\"freItem.name\">\n" +
    "                                {{freItem.name}}\n" +
    "                            </option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                </td>\n" +
    "                <td class=\"form-group form-group-sm\">\n" +
    "                    <select class=\"form-control\"\n" +
    "                            name=\"{{'DrugRouteName'+$index}}\"\n" +
    "                            ng-model=\"drugItem.DrugRouteName\"\n" +
    "                            validate=\"{required:true,selected:true,messages:{required:'请选择用药途径',selected:'请选择用药途径'}}\">\n" +
    "                        <option value=\"\">{{'Room-lblChoosePlaceholder'|translate}}</option>\n" +
    "                        <option ng-selected=\"drugItem.DrugRouteName == drugRoteItem.shade\"\n" +
    "                                ng-repeat=\"drugRoteItem in drugRoteItems\"\n" +
    "                                ng-value=\"drugRoteItem.shade\">\n" +
    "                            {{drugRoteItem.shade}}\n" +
    "                        </option>\n" +
    "                    </select>\n" +
    "\n" +
    "\n" +
    "                </td>\n" +
    "                <td align=\"center\">\n" +
    "                    <a class=\"btn btn-danger btn-xs\" href=\"javascript:void(0);\" ng-click=\"onRemoveDrugDetail(drugItem,RecipeFile.GroupNo)\">{{'btnDelete'|translate}}</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td colspan=\"7\">\n" +
    "                    <div class=\"td-full form-group-sm\">\n" +
    "                        <button type=\"button\" class=\"btn btn-block btn-default btn-sm\" ng-click=\"onAddDrugDetail()\"><span class=\"glyphicon glyphicon-plus\" style=\"color:#6BBD3D\"></span> {{'btnAddDrug'|translate}}</button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("/static/modules/Doctor/directives/modal-Assistant-Diagnose.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/modal-Assistant-Diagnose.html",
    "<div class=\"assistant\" ng-show=\"AnswerSheet.length>0\">\n" +
    "     <div class=\"alert alert-info text-center\" role=\"alert\" data-toggle=\"modal\" data-target=\"#modal-assistant-diagnose\">\n" +
    "         <b class=\"btn\">智能问诊结果，请点击查看</b>\n" +
    "     </div>\n" +
    "      <div class=\" modal fade\" id=\"modal-assistant-diagnose\" role=\"dialog\">\n" +
    "          <div class=\"modal-dialog\" role=\"document\" style=\"width:70%\">\n" +
    "              <div class=\"modal-content\">\n" +
    "                  <div class=\"modal-header\">\n" +
    "                      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                      <h4 class=\"modal-title\">问诊结果</h4>\n" +
    "                  </div>\n" +
    "                  <div class=\"modal-body\">\n" +
    "                      <div class=\"survey\">\n" +
    "\n" +
    "                              <dl ng-repeat=\"item in AnswerSheet\">\n" +
    "                                  <dt>Q{{$index+1}}：{{item.Question}}</dt>\n" +
    "                                  <dd>回复：{{item.Answer}}</dd>\n" +
    "                              </dl>                            \n" +
    "                      </div>\n" +
    "                          <table class=\"table table-striped table-responsive table-hover table-bordered\">\n" +
    "                              <tr ng-repeat=\"item in Summaries\">\n" +
    "                                  <td class=\"col-md-2\">{{item.Title}}:</td>\n" +
    "                                  <td>{{item.Summary}}</td>\n" +
    "                               \n" +
    "                              </tr>\n" +
    "                          </table>                      \n" +
    "                      </div>             \n" +
    "              </div><!-- /.modal-content -->\n" +
    "          </div>\n" +
    "\n" +
    " \n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/static/modules/Doctor/directives/modal-Diagnose-Summary.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/modal-Diagnose-Summary.html",
    "<div class=\"modal fade\" id=\"modal-diagnose-summary\" role=\"dialog\">\n" +
    "    <div class=\"modal-dialog\" role=\"document\">\n" +
    "        <div class=\"modal-content\" style=\"width: 500px;\" >\n" +
    "            <div class=\"modal-header\" style=\"border-bottom: none;\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <!--<h4 class=\"modal-title  text-center\">{{'问诊小结'|translate}}</h4>-->\n" +
    "            </div>\n" +
    "            <div class=\"modal-body diagnose-summary\">\n" +
    "                <h5 class=\"text-center\">康美网络医院</h5>\n" +
    "                <h4 class=\"text-center\">问诊小结</h4>\n" +
    "\n" +
    "                <table>\n" +
    "                    <tr>\n" +
    "                        <td>{{'姓名'|translate}}：</td>\n" +
    "                        <td>{{diagnoseSummary.MemberName}}</td>       \n" +
    "                        <td>{{'性别'|translate}}：</td>\n" +
    "                        <td>{{diagnoseSummary.Gender == 0 ? '男': '女'}}</td>\n" +
    "                        <td>{{'年龄'|translate}}：</td>\n" +
    "                        <td>{{diagnoseSummary.Age}} 岁</td>\n" +
    "                        <td>{{'科室'|translate}}：</td>\n" +
    "                        <td>{{diagnoseSummary.DepartmentName}} </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "\n" +
    "                <hr />\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"preliminaryDiagnosis\">{{'初步诊断'|translate}}：</label>\n" +
    "                    <textarea name=\"preliminaryDiagnosis\" class=\"form-control\" readonly=\"readonly\" style=\"resize : none;\">{{diagnoseSummary.MedicalRecord.PreliminaryDiagnosis}}</textarea>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"advised\">{{'医生建议'|translate}}：</label>\n" +
    "                    <textarea name=\"advised\" class=\"form-control\" readonly=\"readonly\" style=\"resize : none;\">{{diagnoseSummary.MedicalRecord.Advised}}</textarea>\n" +
    "                </div>\n" +
    "                <div class=\"text-right\">\n" +
    "                    <label>{{'医生'|translate}}：</label>{{diagnoseSummary.DoctorName}}\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"remark text-center small\">\n" +
    "                    注意：本问诊小结仅供就诊人参考之用，医生建议3日内有效。\n" +
    "                </div>\n" +
    "                <!--<h3 class=\"text-center\">\n" +
    "                    {{'康美网络医院'}}\n" +
    "                    <small>{{'问诊小结'}}</small>\n" +
    "                </h3>\n" +
    "                <section>\n" +
    "                    <table class=\"table table-condensed table-bordered\" border=\"0\">\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'就诊人'|translate}}：</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\" >{{diagnoseSummary.MemberName}}</td>                            \n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'性别'|translate}}：</td>\n" +
    "                            <td class=\"col-md-4\">{{diagnoseSummary.Gender == 0 ? '男': '女'}}</td>\n" +
    "                            <td class=\"col-md-2 text-right\">{{'年龄'|translate}}：</td>\n" +
    "                            <td class=\"col-md-4\">{{diagnoseSummary.Age}} 岁</td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"textarea\" >\n" +
    "                            <td class=\"col-md-2 text-right\">{{'初步诊断'|translate}}：</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\" >\n" +
    "                                <textarea class=\"form-control blod\" readonly=\"readonly\" style=\"resize : none;\">{{diagnoseSummary.MedicalRecord.PreliminaryDiagnosis}}</textarea>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"textarea\">\n" +
    "                            <td class=\"col-md-2 text-right\">{{'医生建议'|translate}}：</td>\n" +
    "                            <td class=\"col-md-10\" colspan=\"3\" >\n" +
    "                                <textarea class=\"form-control blod\" readonly=\"readonly\" style=\"resize : none;\">{{diagnoseSummary.MedicalRecord.Advised}}</textarea>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "\n" +
    "\n" +
    "                    </table>\n" +
    "\n" +
    "                    <div class=\"text-right\">\n" +
    "                        <label>{{'医生'|translate}}：</label>{{diagnoseSummary.DoctorName}}\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div >\n" +
    "                        注意：本问诊小结仅供就诊人参考之用，医生建议3日内有效。\n" +
    "                    </div>\n" +
    "                </section>-->\n" +
    "            </div>\n" +
    "            <!--<div class=\"modal-footer\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">{{'btnClose'|translate}}</button>\n" +
    "            </div>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/static/modules/Doctor/directives/modal-Service-Detail.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("/static/modules/Doctor/directives/modal-Service-Detail.html",
    "<div class=\"modal fade\" id=\"modal-service-detail\" role=\"dialog\">\n" +
    "    <div class=\"modal-dialog\" role=\"document\" style=\"width:950px;\">\n" +
    "        <div class=\"modal-content my-modal-content\" >\n" +
    "            <div class=\"modal-header modal-header-bg\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "                <h4 class=\"modal-title text-center\">{{'ServiceDetail-lblServerDetail'|translate}}</h4>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body service-detail\">\n" +
    "                <div class=\"detail-header\">\n" +
    "                    {{'ServiceDetail-lblOrderInfo'|translate}}\n" +
    "                </div>\n" +
    "                <section>\n" +
    "                    <table>\n" +
    "                        <tr>\n" +
    "                            <td class=\"field\">{{'Inquiries-lblOrderNumber'|translate}}：</td>\n" +
    "                            <td class=\"value\" colspan=\"3\">{{opdRegister.Order.OrderNo}}</td>\n" +
    "                            <td class=\"field\">{{'Inquiries-lblState'|translate}}：</td>\n" +
    "                            <td class=\"value mid-space\">{{opdRegister.Order.OrderState|orderState}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td class=\"field\">{{'ServiceDetail-lblPatientName'|translate}}：</td>\n" +
    "                            <td class=\"value\">{{opdRegister.Member.MemberName}}</td>\n" +
    "                            <td class=\"field\">{{'RemoteConsults-lblGender'|translate}}：</td>\n" +
    "                            <td class=\"value\">{{opdRegister.Member.Gender == 0 ? \"男\" : \"女\"}}</td>\n" +
    "                            <td class=\"field\">{{'RemoteConsults-lblAge'|translate}}：</td>\n" +
    "                            <td class=\"value mid-space\">{{opdRegister.Member.Age}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td class=\"field\">{{'ServiceDetail-lblPayDate'|translate}}：</td>\n" +
    "                            <td class=\"value\" colspan=\"3\">{{opdRegister.Order.TradeTime|date:'yyyy-MM-dd'}}</td>\n" +
    "                            <td class=\"field\">{{'ServiceDetail-lblOPDTimeSpan'|translate}}：</td>\n" +
    "                            <td class=\"value mid-space\">{{opdRegister.OPDDate|date:'yyyy-MM-dd'}} {{opdRegister.OPDBeginTime}}-{{opdRegister.OPDEndTime}}</td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </section>\n" +
    "                <div class=\"detail-header\">\n" +
    "                    {{'ServiceDetail-lblPatientConditionInfo'|translate}}\n" +
    "                </div>\n" +
    "                <section>\n" +
    "                    <table>\n" +
    "                        <tr>\n" +
    "                            <td class=\"field\">{{'lblDiseaseName'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\">{{opdRegister.ConsultDisease}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"textarea\" style=\"resize : none;\">\n" +
    "                            <td class=\"field\">{{'ServiceDetail-lblDiseaseDesc'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\">\n" +
    "                                <textarea class=\"form-control blod\" readonly=\"readonly\">{{opdRegister.ConsultContent}}</textarea>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"image\">\n" +
    "                            <td class=\"field\">{{'ServiceDetail-lblAttachment'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\" ng-if=\"imageList.length != 0\">\n" +
    "                                <a class=\"img\" href=\"\" target=\"_blank\"  ng-click=\"onPreview($index, $event)\" ng-repeat=\"item in imageList\">\n" +
    "                                    <img width=\"80\" height=\"80\" alt=\"\" ng-src=\"{{item.url}}\" onerror=\"this.parentNode.href = this.src + '?download=1'; this.src = '/static/images/unknow.png';\" />\n" +
    "                                </a>\n" +
    "                            </td>      \n" +
    "                            <td class=\"value large-space padding-left\" ng-if=\"imageList.length == 0\">\n" +
    "                                {{'暂无附件'|translate}}\n" +
    "                            </td>                      \n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </section>\n" +
    "                <div class=\"detail-header\">\n" +
    "                    {{'ServiceDetail-lblMyDiagnosis'|translate}}\n" +
    "                </div>\n" +
    "                <section>\n" +
    "                    <table>\n" +
    "                        <tr class=\"input\">\n" +
    "                            <!--主诉-->\n" +
    "                            <td class=\"field\">{{'Room-lblComplained'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\"><input class=\"form-control\" value=\"{{diagnoseRecipe.MedicalRecord.Sympton}}\" readonly=\"readonly\" /></td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"input\">\n" +
    "                            <!--现病史-->\n" +
    "                            <td class=\"field\">{{'Room-lblHPI'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\"><input class=\"form-control\" value=\"{{diagnoseRecipe.MedicalRecord.PresentHistoryIllness}}\" readonly=\"readonly\" /></td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"input\">\n" +
    "                            <!--过敏史-->\n" +
    "                            <td class=\"field\">{{'Room-lblAH'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\"><input class=\"form-control\" value=\"{{diagnoseRecipe.MedicalRecord.AllergicHistory}}\" readonly=\"readonly\" /></td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"input\">\n" +
    "                            <!--既往病史-->\n" +
    "                            <td class=\"field\">{{'Room-lblPMH'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\"><input class=\"form-control\" value=\"{{diagnoseRecipe.MedicalRecord.PastMedicalHistory}}\" readonly=\"readonly\" /></td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"textarea\">\n" +
    "                            <!--初步诊断-->\n" +
    "                            <td class=\"field\">{{'Room-lblPreliminaryDiagnosis'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\">\n" +
    "                                <textarea class=\"form-control\" readonly=\"readonly\">{{diagnoseRecipe.MedicalRecord.PreliminaryDiagnosis}}</textarea>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"input\">\n" +
    "                            <!--治疗意见-->\n" +
    "                            <td class=\"field\">{{'Room-lblDoctorAdvised'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\">\n" +
    "                                <input class=\"form-control\" value=\"{{diagnoseRecipe.MedicalRecord.Advised}}\" readonly=\"readonly\" />\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </section>\n" +
    "                <div class=\"detail-header\">\n" +
    "                    {{'ServiceDetail-lblPhysicalExam'|translate}}\n" +
    "                </div>\n" +
    "                <section>\n" +
    "                    <table>\n" +
    "                        <tr>\n" +
    "                            <td class=\"field\">{{'ServiceDetail-lblPhysiqueExam'|translate}}：</td>\n" +
    "                            <td class=\"value large-space padding-left\">\n" +
    "                                <div ng-repeat=\"item in diagnoseRecipe.PhysicalExam\" class=\"form-group col-md-6\">\n" +
    "                                    <span class=\"form-control\" style=\"text-align:left\">\n" +
    "                                        <label>{{item.ItemCNName}}({{item.ItemENName}})：</label>\n" +
    "                                        {{item.Result}}  {{item.Unit}}\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </section>\n" +
    "                <div class=\"detail-header\">\n" +
    "                    {{'ServiceDetail-lblRecipe'|translate}}\n" +
    "                </div>\n" +
    "                <section>\n" +
    "                    <table>\n" +
    "                        <tr ng-if=\"diagnoseRecipe.RecipeList == null || diagnoseRecipe.RecipeList.length == 0\">\n" +
    "                            <td class=\"field\">处方</td>\n" +
    "                            <td class=\"value large-space padding-left\">\n" +
    "                                暂无处方\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-repeat=\"recipeFile in diagnoseRecipe.RecipeList|orderBy:'RecipeType'\">\n" +
    "                            <td class=\"field\">\n" +
    "                                {{recipeFile.RecipeName}}({{recipeFile.RecipeTypeName}})：                                \n" +
    "                            </td>\n" +
    "                            <td class=\"value large-space padding-left\">\n" +
    "                                <div class=\"pharmacy\">\n" +
    "                                    <div>\n" +
    "                                        <!--处方->诊断 -->\n" +
    "                                        <table cellspacing=\"0\" class=\"table table-bordered\">\n" +
    "                                            <tbody>\n" +
    "                                                <tr>\n" +
    "                                                    <th width=\"280\">诊断名称</th>\n" +
    "                                                    <th>备注</th>\n" +
    "                                                </tr>\n" +
    "                                                <tr ng-if=\"recipeFile.DiagnoseList == null || recipeFile.DiagnoseList.length == 0\">\n" +
    "                                                    <td colspan=\"2\">无</td>\n" +
    "                                                </tr>\n" +
    "                                                <tr ng-repeat=\"item in recipeFile.DiagnoseList\">\n" +
    "                                                    <td>{{item.Detail.DiseaseName}}</td>\n" +
    "                                                    <td>{{item.Description}}</td>\n" +
    "                                                </tr>\n" +
    "                                            </tbody>\n" +
    "                                        </table>\n" +
    "                                        <div ng-if=\"recipeFile.RecipeType == 1\">\n" +
    "                                            <table cellspacing=\"0\" class=\"table table-bordered\">\n" +
    "                                                <tbody>\n" +
    "                                                    <tr>\n" +
    "                                                        <th width=\"280\">药品名称</th>\n" +
    "                                                        <th>剂量</th>\n" +
    "                                                        <th>价格</th>\n" +
    "                                                    </tr>\n" +
    "                                                    <tr ng-if=\"recipeFile.Details == null || recipeFile.Details.length == 0\">\n" +
    "                                                        <td colspan=\"3\">无</td>\n" +
    "                                                    </tr>\n" +
    "                                                    <tr ng-repeat=\"drugItem in recipeFile.Details\">\n" +
    "                                                        <td>{{drugItem.Drug.DrugName}}</td>\n" +
    "                                                        <td>{{drugItem.Dose}}{{drugItem.Drug.DoseUnit}}</td>\n" +
    "                                                        <td>￥{{((drugItem.Dose || 1) * (drugItem.Drug.UnitPrice || 0)) |number:'2'}}</td>\n" +
    "                                                    </tr>\n" +
    "                                                </tbody>\n" +
    "                                            </table>\n" +
    "                                            <div>\n" +
    "                                                <div>\n" +
    "                                                    <label>剂数</label>\n" +
    "                                                    <span class=\"padding-left\">共{{recipeFile.TCMQuantity}}剂</span>\n" +
    "                                                </div>\n" +
    "                                                <div >\n" +
    "                                                    <label>用法</label>\n" +
    "                                                    <span class=\"padding-left\">{{recipeFile.Usage}}</span>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div ng-if=\"recipeFile.RecipeType ==2\">\n" +
    "                                            <table cellspacing=\"0\" class=\"table table-bordered\">\n" +
    "                                                <tbody>\n" +
    "                                                    <tr>\n" +
    "                                                        <th width=\"240\">药品名称</th>\n" +
    "                                                        <th>计费数量</th>\n" +
    "                                                        <th>价格</th>\n" +
    "                                                        <th>剂量</th>\n" +
    "                                                        <th>频率</th>\n" +
    "                                                        <th>用药途径</th>\n" +
    "                                                    </tr>\n" +
    "                                                    <tr ng-if=\"recipeFile.Details == null || recipeFile.Details.length == 0\">\n" +
    "                                                        <td colspan=\"6\">无</td>\n" +
    "                                                    </tr>\n" +
    "                                                    <tr ng-repeat=\"drugItem in recipeFile.Details\">\n" +
    "                                                        <td>{{drugItem.Drug.DrugName}} </td>\n" +
    "                                                        <td>{{drugItem.Quantity}} {{drugItem.Drug.Unit}}</td>\n" +
    "                                                        <td>￥{{((drugItem.Quantity || 1) * (drugItem.Drug.UnitPrice || 0))|number:'2'}}</td>\n" +
    "                                                        <td>{{drugItem.Dose}} {{drugItem.Drug.DoseUnit}}</td>\n" +
    "                                                        <td>{{drugItem.Frequency}}</td>\n" +
    "                                                        <td>{{drugItem.DrugRouteName}}</td>\n" +
    "                                                    </tr>\n" +
    "                                                </tbody>\n" +
    "                                            </table>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </section>\n" +
    "            </div>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">{{'btnClose'|translate}}</button>\n" +
    "            </div>\n" +
    "        </div><!-- /.modal-content -->\n" +
    "    </div><!-- /.modal-dialog -->\n" +
    "\n" +
    "</div><!-- /.modal -->");
}]);
});