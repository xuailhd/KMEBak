require.config({
    baseUrl: '/static/',
    waitSeconds: 0,
    urlArgs: "bust=V4.2.0" + Math.random(),
    packages: [
    {
        name: 'echarts',
        location: 'framework/plugins/echarts',
        main: 'echarts'
    }
    ],
    paths: {
        "require-text": "framework/require/require-text",
        "require-css": "framework/require/require-css",
        "jquery": "framework/jquery/jquery-1.10.2",
        "jquery-cookie": "framework/jquery/jquery.cookie",
        "jquery-inputmask": "framework/jquery/jquery.inputmask",
        "jquery-metisMenu": "framework/jquery/jquery.metisMenu",
        "jquery-slimscroll": "framework/jquery/jquery.slimscroll.min",
        "jquery-validate": "framework/jquery/jquery.validate",
        "jquery.metadata": "framework/jquery/jquery.metadata",
        "jquery-uploadfy": "framework/jquery/uploadfy/jquery.uploadify",
        "jquery-ui": "framework/jquery/jquery-ui-1.11.4",
        "jquery-select2": "framework/jquery/jquery.select2",
        "jquery-select2_locale_zh-CN": "framework/jquery/jquery.select2_locale_zh-CN",
        "jquery-form": "framework/jquery/jquery-form",
        "jquery-flot": "framework/jquery/flot/jquery.flot.min",
        "jquery-flot-time": "framework/jquery/flot/jquery.flot.time",
        "jquery-flot-resize": "framework/jquery/flot/jquery.flot.resize",
        "jquery-splitter": "framework/jquery/jquery.splitter",

        "bootstrap": "framework/bootstrap/js/bootstrap",
        "bootstrap-colorpicker": "framework/bootstrap/js/bootstrap-colorpicker.min",
        "bootstrap-prettyfile": "framework/bootstrap/js/bootstrap-prettyfile",
        "bootstrap-table": "framework/bootstrap/js/bootstrap-table",
        "bootstrap-select": "framework/bootstrap/js/bootstrap-select",
        "bootstrap-table-mobile": "framework/bootstrap/js/bootstrap-table-mobile",
        "bootstrap-typeahead": "framework/bootstrap/js/bootstrap-typeahead.min",
        "bootstrap-notify": "framework/bootstrap/js/bootstrap-notify",



        "angular": "framework/angular/angular",
        "angular-resource": "framework/angular/angular-resource",
        "angular-amd": "framework/angular/angular-amd",
        "angular-cookies": "framework/angular/angular-cookies",
        "angular-ui-route": "framework/angular/angular-ui-route",
        "angular-ui-bootstrap": "framework/angular/angular-ui/ui-bootstrap",
        "angular-route": "framework/angular/angular-route",
        "angular-translate": "framework/angular/angular-translate",
        "angular-translate-loader-static-files": "framework/angular/angular-translate-loader-static-files",
        "angular-animate": "framework/angular/angular-animate",
        "angular-animate-css": "framework/angular/angular-animate-css",
        "angular-upload-shim": "framework/angular/angular-upload/angular-upload-shim.min",
        "angular-upload": "framework/angular/angular-upload/angular-upload.min",

        "plugins-iscroll": "framework/plugins/iscroll",
        "plugins-md5": "framework/plugins/md5",
        "plugins-recorder": "framework/plugins/recorder/recorder",
        "plugins-pace": "framework/plugins/pace/pace",
        "plugins-laydate": "framework/plugins/laydate/laydate",
        "plugins-layer": "framework/plugins/layer/layer",/*这里不能使用压缩*/
        "plugins-pdf": "framework/plugins/pdf/pdf",
        "plugins-ueditor": "framework/plugins/ueditor/ueditor.all",        
        "plugins-sdk-webim": "framework/plugins/sdk/webim/webim",
        "plugins-sdk-webim-tls": "framework/plugins/sdk/webim/tsl-api",
        "plugins-sdk-webim-json2": "framework/plugins/sdk/webim/json2",
        "plugins-sdk-webim-base64": "framework/plugins/sdk/webim/base64", 
        "plugins-sdk-webim-sparkmd5": "framework/plugins/sdk/webim/spark-md5",
        "plugins-sdk-anychat": "framework/plugins/sdk/anychat/anychatsdk",
        "plugins-sdk-AgoraRTCSDK": "framework/plugins/sdk/Agora/AgoraRTCSDK-1.13.0",
        "plugins-sdk-AgoraRTCAgentSDK": "framework/plugins/sdk/Agora/AgoraRtcAgentSDK-1.9.1",
        "plugins-sdk-Capture": "/static/framework/plugins/ScreenCapture/capture",

        "plugins-extend-array": "framework/plugins/extend/array",
        "plugins-extend-date": "framework/plugins/extend/Date",
        "plugins-extend-string": "framework/plugins/extend/String",
        "plugins-dateTime": "framework/plugins/dateTime",
        "plugins-echarts": "framework/plugins/echarts/echarts",
        "plugins-localAll": "framework/plugins/fullCalendar/locale-all",
        "plugins-fullCalendar": "framework/plugins/fullCalendar/fullcalendar.min",

        "moment": "framework/plugins/fullCalendar/moment.min",

        "module-config": "modules/Common/config",        
        "module-Doctor-bootstrap": "modules/Doctor/bootstrap.min",
        "module-Doctor-routes": "modules/Doctor/Routes",
        "module-services-eventBus": "modules/Common/services/eventBus",
        "module-services-api": "modules/Common/services/api",
        "module-services-apiUtil": "modules/Common/services/api.Util",
        "module-services-apiUtilMP": "modules/Common/services/api.Util.MP",
        "module-Services-uploader": "modules/Common/services/uploader",
        "module-services-flashTitle": "modules/Common/services/flashTitle",
        "module-services-chatroom": "modules/Common/Services/chatroom",
        "module-services-debounce": "modules/Common/Services/debounce",
        "module-services-heartbeat": "modules/Common/Services/heartbeat",
        "module-services-chatroom-videoMgr.Agora": "modules/Common/Services/chatRoom-VideoMgr.Agora",
        "module-services-chatroom-videoMgr.Agora.Native": "modules/Common/Services/chatRoom-VideoMgr.Agora.Native",
        "module-services-chatroom-videoMgr.Agora.RTCAgentSDK": "modules/Common/Services/chatroom-VideoMgr.Agora.RTCAgentSDK",
        "module-services-chatroom-videoMgr.Agora.RTCSDK": "modules/Common/Services/chatroom-VideoMgr.Agora.RTCSDK",
        "module-services-chatroom-videoMgr.AnyChat": "modules/Common/Services/chatRoom-VideoMgr.AnyChat",

        "module-filter-all": "modules/Common/filters/all",
        "module-Doctor-filter-all": "modules/Doctor/filters/all",
        //医生用户指令
        "module-directive-bundling-doctor-all": "modules/Doctor/directives/bundling-all",
        "module-directive-bundling-doctor-im": "modules/Doctor/directives/bundling-im", 
        "module-directive-exam-result-editor": "modules/Common/directives/exam-result-editor",
        "module-directive-exam-result-charts": "modules/Common/directives/exam-result-charts",
        "module-directive-exam-result": "modules/Common/directives/exam-result",
        "module-directive-hasPermission": "modules/Common/directives/hasPermission",
        "module-directive-spinner": "modules/Common/directives/spinner",
        "module-directive-pager": "modules/Common/directives/pager",
        "module-directive-grid": "modules/Common/directives/grid",
        "module-directive-countdown": "modules/Common/directives/countdown",
        "module-directive-scrollbar": "modules/Common/directives/scrollbar",
        "module-directive-preview": "modules/Common/directives/preview",
        "module-directive-dcmViewer": "modules/Common/directives/dcmViewer",
        "module-directive-uploader": "modules/Common/directives/uploader",
        "module-directive-capture": "modules/Common/directives/capture",
        "module-directive-recorder": "modules/Common/directives/recorder",
        "module-directive-nav-tabs": "modules/Common/directives/nav-tabs",
        "module-directive-splitter": "modules/Common/directives/splitter",
        // 时间轴指令
        "module-directive-timeline": "modules/Common/directives/timeline",
        // 助手
        "module-directive-modal-assistant-diagnose": "modules/Doctor/directives/modal-assistant-diagnose",

        "module-directive-form-validate": "modules/Common/directives/form-validate",
        "module-directive-form-control": "modules/Common/directives/form-control",
        "module-directive-form-control-switch": "modules/Common/directives/form-control-switch",
        "module-directive-form-control-colorpicker": "modules/Common/directives/form-control-colorpicker",
        "module-directive-form-control-inputmask": "modules/Common/directives/form-control-inputmask",
        "module-directive-form-control-datepicker": "modules/Common/directives/form-control-datepicker",
        "module-directive-form-control-imagepicker": "modules/Common/directives/form-control-imagepicker",
        "module-directive-form-control-select": "modules/Common/directives/form-control-select",
        "module-directive-form-control-selectTree": "modules/Common/directives/form-control-selectTree",
        "module-directive-form-control-file": "modules/Common/directives/form-control-file",
        "module-directive-form-control-editor": "modules/Common/directives/form-control-editor",
     
        "module-directive-chat-detail-comment": "modules/Common/directives/chat-detail-comment",
        "module-directive-chat-detail-video": "modules/Common/directives/chat-detail-video",
        "module-directive-chat-detail-audio": "modules/Common/directives/chat-detail-audio",
        "module-directive-chat-detail-users": "modules/Common/directives/chat-detail-users",        
        "module-directive-chat-detail-CallCtrl": "modules/Common/directives/chat-detail-CallCtrl",
        "module-directive-chat-detail-DeviceSetting": "modules/Common/directives/chat-detail-DeviceSetting",
        "module-directive-chat-content": "modules/Common/directives/chat-content",
        "module-directive-chat-Session-Consults": "modules/Doctor/directives/chat-Session-Consults",        
        "module-directive-chat-Session-OfflineClinics": "modules/Doctor/directives/chat-Session-OfflineClinics",
        "module-directive-chat-Session-OnlineClinics": "modules/Doctor/directives/chat-Session-OnlineClinics",
        
        //处方编辑》诊断部分
        "module-directive-editor-Recipe-Diagnosis": "modules/Doctor/directives/editor-Recipe-Diagnosis",
        //处方编辑》药品部分
        "module-directive-editor-Recipe-Drugs": "modules/Doctor/directives/editor-Recipe-Drugs",
        //处方模板
        "module-directive-editor-Recipe-Formular": "modules/Doctor/directives/editor-Recipe-Formular",

        //诊断（病历）
        "module-directive-editor-Diagnose": "modules/Doctor/directives/editor-Diagnose",
        //患者信息
        "module-directive-editor-Patient": "modules/Doctor/directives/editor-Patient",        
        //服务详情信息弹出窗口
        "module-directive-modal-Service-Detail": "modules/Doctor/directives/modal-Service-Detail",
        //诊断小结信息弹出窗口
        "module-directive-modal-Diagnose-Summary": "modules/Doctor/directives/modal-Diagnose-Summary",

        "module-directive-chat-view-DoctorAudioConsult": "modules/Doctor/directives/chat-view-AudioConsult",
        "module-directive-chat-view-DoctorVideoConsult": "modules/Doctor/directives/chat-view-VideoConsult",
        "module-directive-chat-view-DoctorTextConsult": "modules/Doctor/directives/chat-view-TextConsult",
        "module-directive-chat-view-DoctorNotSession": "modules/Doctor/directives/chat-view-NotSession",        
        "module-directive-chat-view-DoctorOfflineClinic": "modules/Doctor/directives/chat-view-OfflineClinic",

        "module-directive-chat-detail-patientInfo": "modules/Doctor/directives/chat-detail-patientInfo",
        "module-directive-chat-detail-Diagnose": "modules/Doctor/directives/chat-detail-Diagnose",        
        "module-directive-chat-detail-Inquiries": "modules/Doctor/directives/chat-detail-Inquiries",
        "module-directive-chat-detail-Recipe": "modules/Doctor/directives/chat-detail-Recipe"
    },
    map:
        {
            "*": {
                "css": "require-css",
                "text": "require-text"
            }
        },
    //配置模块依赖关系
    shim: {
        "jquery": {
        },
        "jquery-inputmask": {
            deps: ["jquery"]
        },
        "jquery-cookie":{
            deps: ["jquery"],
        },
        "jquery-metisMenu": {
            deps: ["jquery"]
        },
        "jquery-slimscroll": {
            deps: ["jquery"]
        },
        "jquery-select2": {
            deps: ["css!framework/jquery/jquery.select2.css"]
        },
        "jquery-select2_locale_zh-CN": {
            deps: ["jquery-select2"]
        },
        "jquery-metadata": { deps: ["jquery"] },
        "jquery-splitter": { deps: ["jquery"] },
        "jquery-validate": { deps: ["jquery", "jquery.metadata"], exports: "$.fn" },
        "jquery-uploadfy": { deps: ["jquery", "css!framework/jquery/uploadfy/jquery.uploadify.css"] },
        "jquery-flot-time": { deps: ["jquery", "jquery-flot"] },
        "jquery-flot-resize": { deps: ["jquery", "jquery-flot"] },

        'bootstrap': { deps: ["jquery"] },
        'bootstrap-select': { deps: ["jquery", "bootstrap", "css!framework/bootstrap/css/bootstrap-select.css"] },
        'bootstrap-table': { deps: ["jquery", "bootstrap"] },
        'bootstrap-colorpicker': { deps: ["jquery", "bootstrap", "css!framework/bootstrap/css/bootstrap-colorpicker.min.css"] },
        'bootstrap-prettyfile': { deps: ["jquery", "bootstrap"] },
        'bootstrap-table-mobile': {
            deps: ["jquery", "bootstrap"],
        },
        "bootstrap-notify": {
            deps: [
                "jquery",
                "bootstrap",
                "css!framework/bootstrap/css/bootstrap-notify.css"
            ]
        },

        'angular': {
            deps:["jquery"],
            exports: "angular"
        },
        'angular-amd': {
            deps: ["angular"],
        },
        'angular-cookies': {
            deps: ["angular"],
        },
        'angular-ui-route': {
            deps: ["angular", "angular-amd"],
        },
        "angular-ui-bootstrap": { deps: ["angular", "bootstrap"] },
        'angular-route': {
            deps: ["angular"],
        },
        "angular-resource": { deps: ["angular"] },
        'angular-animate': {
            deps: ["angular"],
        },
        'angular-animate-css': {
            deps: ["angular", "angular-animate", "css!framework/plugins/animate/animate.css"],
        },
        'angular-translate': {
            deps: ["angular"],
        },
        'angular-translate-loader-static-files': {
            deps: ["angular", "angular-translate"],
        },
        "angular-upload": { deps: ["angular", "angular-upload-shim"] },

        //插件-加载进度
        'plugins-pace': {
            deps: ["jquery", "css!framework/plugins/pace/themes/pace-theme-minimal.css"]
        },
        //插件日期控件
        'plugins-laydate': { deps: ["jquery", "css!framework/plugins/laydate/need/laydate.css", "css!framework/plugins/laydate/skins/default/laydate.css"] },
        //插件弹出层
        'plugins-layer': { deps: ["jquery", "css!framework/plugins/layer/skin/layer.css"] },
        //插件-编辑器
        'plugins-ueditor': { deps: ["jquery", "framework/plugins/ueditor/ueditor.config", "css!framework/plugins/ueditor/themes/default/css/ueditor.css"] },
        'plugins-sdk-webim-tls': { deps: [], exports: "TLSHelper" },

        //声网插件版本SDK
        "plugins-sdk-AgoraRTCAgentSDK": { exports: "AgoraRTC" },
        //声网非插件版本SDK
        "plugins-sdk-AgoraRTCSDK": { exports: "AgoraRTCSDK" },

        'plugins-sdk-webim': {
            deps: [
                "plugins-sdk-webim-json2",
                "plugins-sdk-webim-sparkmd5",
                "plugins-sdk-webim-base64"], exports: "webim"
        },
     
        "plugins-sdk-anychat": {
            deps: [       
                "framework/plugins/sdk/anychat/anychatobject"]
        },
        "plugins-fullCalendar": {
            deps: ["css!framework/plugins/fullCalendar/fullcalendar.css", "jquery", "jquery-ui", "moment"]
        },
        "plugins-localAll":{
            deps:["plugins-fullCalendar"]
        },
        "plugins-sdk-Capture": { exports: "NiuniuCaptureObject" },

        //路由
        "module-routes": { deps: ["angular", "angular-ui-route"] },
        //接口
        "module-services-api": { deps: ["angular"] },
        'module-services-chatroom': {},
        "module-Services-uploader": {
            deps: ["plugins-sdk-webim-sparkmd5"], exports: "webim"
        },
        //指令-表单验证
        "module-directive-form-validate": { deps: ["jquery", "jquery-validate"] }
    }
});