define(["angular"], function (angular) {

    console.log("load chat-detail.js")

    var app = angular.module("myApp", []);

   

    //没有会话
    app.directive("chatNotSession", [function () {

        return {
            restrict: 'EA',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/chat-view-NotSession.html';
            },
            link: function ($scope, $element, attr, pCtrl) {

                


            }
        };
    }])

});