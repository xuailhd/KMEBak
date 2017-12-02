define(["angular"], function (angular)
{
    var app = angular.module("myApp", []);

    /*
     * DCM阅读器
     * 作者：郭明
     * 日期：2016年9月29日
     */
    app.service("dcmViewer", ["$rootScope", "$document", "$compile", "$translate", function ($rootScope, $document, $compile, $translate) {

        var result = {

            //打开阅读器
            open: function (params) {
                params = params || {};

                window.open("http://ir.kmwlyy.com:6060/kmhc-viewer/viewer.do?patientID=" + params.patId + "&studyUID=" + params.stuUID, "_blank");

                return;
            }
        };

        return result
    }])

});

