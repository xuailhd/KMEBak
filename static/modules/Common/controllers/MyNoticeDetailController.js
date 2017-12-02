"use strict";
define(["module-services-api",
        "module-services-eventBus", 
        "module-directive-bundling-doctor-all",
        "module-services-api"], function (apiUtil,eventBus) {

          var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            //我的消息
            app.controller('MyNoticeDetailController', ['$scope',
                '$http',
                '$state',
                '$translate',               
                "UserNoticeServices",
            function (
                $scope,
                $http,
                $state,
                $translate,            
                UserNoticeServices) {

                var id = $state.params.id;

                var NoticeType = {
                    "0": "系统公告",
                    "1": "系统公告",
                    "2": "订单消息",
                    "3": "业务消息",
                    "4": "系统公告",
                    "5": "服务消息"
                };

                 //我的消息列表
                $scope.onSearch = function () {
                    UserNoticeServices.getMyMsg({
                        MessageID:id,
                        PageSize: 1,
                        CurrentPage: 1
                    }, function (obj) {
                        if (obj.Data != null && obj.Data.length>0) {
                            var model = obj.Data[0];
                            model.NoticeFirstTypeText=NoticeType["" + model.NoticeFirstType];
                            model.IsReadText=model.IsRead?"已读":"未读";
                            //跳到业务页面
                            if(model.WebExtrasConfig != null 
                               && model.WebExtrasConfig.PageUrl
                               && model.WebExtrasConfig.PageUrl.toLowerCase() != $state.current.name.toLowerCase())
                            {
                                var pageArgs = {};
                                if(model.PageArgs)
                                    pageArgs = $.parseJSON(model.PageArgs);
                                $state.go(model.WebExtrasConfig.PageUrl, pageArgs);
                            }
                            else{
                                $scope.model = model;
                            }

                          //设置消息已读
                          if(model.IsRead == false){
                              UserNoticeServices.updateMsgToReaded([model.MessageID], function (obj) {
                                  if (obj.Data > 0) {
                                      eventBus.dispatch("read-msg", { id: model.MessageID });
                                  }
                              })
                          }
                        }
                    });
                };

                $scope.onSearch();

            //返回
            $scope.goBack = function () {
                history.back();
            };

       }]);
});