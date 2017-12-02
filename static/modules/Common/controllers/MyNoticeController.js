"use strict";
define(["module-services-api",
        "module-services-eventBus",    
        "module-directive-bundling-doctor-all",
        "module-services-api"], function (apiUtil, eventBus) {

          var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            //我的消息
            app.controller('MyNoticeController', ['$scope',
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

                $scope.CurrentPage = 1;
                $scope.pageSize = 10;
                $scope.totalCount = 0;
                $scope.ListItems = [];
                $scope.noSelectFlag = false;//有没有选中的项
                $scope.$allChecked = false;
                $scope.selectArr = [];
                $scope.ReadStatus = 0; //0所有，1已读，2未读

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
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.CurrentPage,
                        ReadStatus: $scope.ReadStatus
                    }, function (obj) {
                        if (obj.Data != null) {
                            //当前登录用户
                            var loginUser=apiUtil.getLoginInfo();
                            $.each(obj.Data, function (i, d) {
                                d.NoticeFirstTypeText = NoticeType["" + d.NoticeFirstType];
                                d.IsReadText = d.IsRead ? "已读" : "未读";
                                //页面打开方式 
                                if(d.WebExtrasConfig!=null && d.WebExtrasConfig.PageTarget)
                                    d.openTarget = d.WebExtrasConfig.PageTarget;
                                else
                                    d.openTarget="_self";
                                //详细页面跳转地址
                                var sref="";
                                if(d.WebExtrasConfig != null && d.WebExtrasConfig.PageUrl)
                                {
                                   sref=d.WebExtrasConfig.PageUrl;
                                   if(d.PageArgs)
                                      sref=sref + "(" + d.PageArgs + ")";
                                }else{
                                    if(loginUser.UserType == 2)
                                        sref="Doctor.NoticeDetail({id:\"" + d.MessageID + "\"})";
                                    else if(loginUser.UserType == 1)
                                        sref="User.NoticeDetail({id:\"" + d.MessageID + "\"})";
                                 }
                                d.openUrl=sref;
                            });

                            $scope.ListItems = obj.Data;
                            $scope.totalCount = obj.Total;
                          }
                        
                    });
                };

            //消息详情
             $scope.readNotice=function(item){
                //消息标为已读
                if(item.IsRead == false){
                     UserNoticeServices.updateMsgToReaded([item.MessageID],function(obj){
                         if(obj.Data > 0){ 
                            item.IsRead = true;
                            item.IsReadText = "已读";
                            eventBus.dispatch("read-msg", { id: item.MessageID });
                        }
                     });
                 }
             };

             //未读消息
             $scope.unreadNotices = function () {
                  $scope.ReadStatus = 2;
                  $scope.onSearch();
             };
            
             //所有消息
             $scope.allNotices = function () {
                 $scope.ReadStatus = 0;
                 $scope.onSearch();
             };

             function judgeIsSelect() {
                 //监听有没有选中项
                 var selectL = false;
                 var $listLen = $scope.ListItems.length;
                     $scope.selectArr = [];
                 for (var i = 0; i < $listLen; i++) {
                     if ($scope.ListItems[i].$checked) {
                         selectL = true;
                         $scope.selectArr.push($scope.ListItems[i].MessageID);
                     };
                 };
                 if ($scope.selectArr.length < 0) {
                     selectL = false;
                 };
                 console.log($listLen,$scope.selectArr, 2222);
                 if (selectL) {
                     $scope.noSelectFlag = true;//有选中的项
                 } else {
                     $scope.noSelectFlag = false;//没有选中的项
                 };
             };

             //选中全部
             $scope.checkAll = function () {
                 $scope.ListItems.forEach(function (it) {
                     it.$checked = $scope.$allChecked;
                 });
                 //监听有没有选中项
                 judgeIsSelect();
                 
             };

             //单行选中
             $scope.checkItem = function (item) {
                 judgeIsSelect();
                 $scope.$allChecked = $scope.ListItems.every(function (it) {
                     return it.$checked;
                 });
             };

             //新增数据同步
             $scope.$watchCollection("ListItems", function (val) {
                 $scope.$allChecked = $scope.ListItems.every(function (it) {
                     return it.$checked;
                 });
                
             });
               
             //删除消息
             $scope.deleteNotice = function () {
                 var selectLen = $("input[name='noticesSelect']:checked").length;
                 if (selectLen < 1) {
                     $scope.noSelectFlag = false;
                    // layer.msg("请选择您要操作的项", { icon: 2, shade: 0.5, time: 1000 });
                 } else {
                     $scope.noSelectFlag = true;
                     UserNoticeServices.deleteMsg($scope.selectArr,function(obj){
                        if(obj.Data > 0){ 
                              eventBus.dispatch("read-msg", { id: $scope.selectArr });
                              $scope.onSearch();
                         }
                     });
                 }

             };

             //标记为已读
             $scope.markRead = function () {
                 var selectLen = $("input[name='noticesSelect']:checked").length;
                 if (selectLen < 1) {
                     $scope.noSelectFlag = false;
                    // layer.msg("请选择您要操作的项", { icon: 2, shade: 0.5, time: 1000 });
                 } else {
                     $scope.noSelectFlag = true;
                     UserNoticeServices.updateMsgToReaded($scope.selectArr,function(obj){
                         if(obj.Data > 0){ 
                              eventBus.dispatch("read-msg", { id: $scope.selectArr });
                              $scope.onSearch();
                         }
                     });
                 }
             };
             $scope.markAllRead = function () {

                 UserNoticeServices.updateAllToReaded(null, function (obj) {
                     if (obj.Data > 0) {
                         eventBus.dispatch("read-msg", { id: '*' });
                         $scope.onSearch();
                     }
                 });
             };
     }]);
});