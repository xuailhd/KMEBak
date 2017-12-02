"use strict";
require.config({
    baseUrl: '/static/',
    paths: {
        "require-text": "framework/require/require-text",
        "require-css": "framework/require/require-css",
        "jquery": "framework/jquery/jquery-1.10.2.min",
        "jquery-cookie": "framework/jquery/jquery.cookie",
        "jquery-txtCount": "framework/jquery/jquery.txtCount",
        "jquery-metisMenu": "framework/jquery/jquery.metisMenu",
        "jquery-slimscroll": "framework/jquery/jquery.slimscroll.min",
        "jquery-validate": "framework/jquery/jquery.validate",
        "jquery.metadata": "framework/jquery/jquery.metadata",
        "jquery-uploadfy": "framework/jquery/uploadfy/jquery.uploadify.min",
        "jquery-ui": "framework/jquery/jquery-ui-1.11.4.min",
        "jquery-select2": "framework/jquery/jquery.select2",
        "jquery-form": "framework/jquery/jquery-form",

        "bootstrap": "framework/bootstrap/js/bootstrap.min",
        "bootstrap-colorpicker": "framework/bootstrap/js/bootstrap-colorpicker.min",
        "bootstrap-prettyfile": "framework/bootstrap/js/bootstrap-prettyfile",
        "bootstrap-table": "framework/bootstrap/js/bootstrap-table",
        "bootstrap-select": "framework/bootstrap/js/bootstrap-select",
        "bootstrap-table-mobile": "framework/bootstrap/js/bootstrap-table-mobile.min",
        "jquery.bootstrap.newsbox.min": "framework/bootstrap/js/jquery.bootstrap.newsbox.min",

        "plugins-layer": "framework/plugins/layer/layer",
        "plugins-extend-json": "framework/plugins/extend/json2",
        "plugins-handlebars": "framework/plugins/handlebars.min",
        "plugins-pace": "framework/plugins/pace/pace.min",
        "plugins-laydate": "framework/plugins/laydate/laydate",
        "plugins-md5": "framework/plugins/md5",
        "plugins-citySelecter": "framework/plugins/citySelecter",
        "module-services-apiUtil": "modules/Common/services/api.Util",
        "module-services-location": "modules/Common/services/location",
        "module-services-validate": "modules/Common/services/validate",
    },
    map:
        {
            "*": {
                "css": "require-css",
                "text": "require-text",
            }
        },
    //配置模块依赖关系
    shim: {
        "jquery": {
            exports: "jQuery"
        },
        "jquery-cookie": {
            deps: ["jquery"],
            exports: "jquery-cookie"
        },
        "jquery-metisMenu": {
            deps: ["jquery"],
            exports: "jquery-metisMenu"
        },
        "jquery-slimscroll": {
            deps: ["jquery"],
            exports: "jquery-slimscroll"
        },
        "jquery-select2": {
            deps: ["css!framework/jquery/jquery.select2.css"],
            exports: "jquery-slimscroll"
        },
        "jquery.bootstrap.newsbox.min": {
            deps: ["jquery", "bootstrap"]
        },
        "jquery-txtCount": { deps: ["jquery"] },
        "jquery-metadata": { deps: ["jquery"] },
        "jquery-validate": { deps: ["jquery"] },
        "jquery-uploadfy": { deps: ["jquery", "css!framework/jquery/uploadfy/jquery.uploadify.css"] },
        "jquery-form": { deps: ["jquery"] },
        'bootstrap': { deps: ["jquery"] },
        'bootstrap-select': { deps: ["jquery", "bootstrap"] },

        'bootstrap-table': { deps: ["jquery", "bootstrap"] },
        'bootstrap-colorpicker': { deps: ["jquery", "bootstrap", "css!framework/bootstrap/css/bootstrap-colorpicker.min.css"] },
        'bootstrap-prettyfile': { deps: ["jquery", "bootstrap"] },
        'bootstrap-table-mobile': {
            deps: ["jquery", "bootstrap"],
        },

        //插件弹出层
        'plugins-layer': { deps: ["jquery", "css!framework/plugins/layer/skin/layer.css"] },
        //插件弹出层扩展
        'plugins-layer-ext': { deps: ["jquery", "plugins-layer"] },
        //插件-加载进度
        'plugins-pace': {
            deps: ["jquery", "css!framework/plugins/pace/themes/pace-theme-barber-shop.css"]
        },
        //插件日期控件
        'plugins-laydate': { deps: ["jquery", "css!framework/plugins/laydate/need/laydate.css", "css!framework/plugins/laydate/skins/default/laydate.css"] }

    }
});