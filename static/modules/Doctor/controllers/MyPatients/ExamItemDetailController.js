"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            app.controller('ExamItemDetailController', [
                '$scope',
                '$http',
                "$q",
                '$location',
                '$state',
                '$translate',
                'examResultsServices',
                'userMembersServices',
                'webapiServices',
                'optionsServices',
                function ($scope, $http, $q, $location, $state, $translate, services, userMembersServices, webapiServices, optionsServices) {
                    var params = $state.params;
                    
                    $scope.memberId = params.memberId;
                    $scope.examItemTypeId = params.examItemTypeId;
                    $scope.Data = {};
                    $scope.UserMembers = [];

                    function ShowMessage(obj, msg) {
                        var $labelMsg = $('label[msgfor="{0}"]'.format($(obj).attr("id")));
                        if (msg != null) {
                            if ($labelMsg.length > 0) {
                                $labelMsg.text(msg);
                            }
                            else {
                                alert(msg);
                            }
                            try {
                                $(obj).focus();
                            } catch (e) { }
                        }
                        else {
                            $labelMsg.text('');
                        }
                    }
                    $scope.load = function () {
                        webapiServices.getExamItemWithResults({
                            memberId: params.memberId,
                            examItemTypeId: params.examItemTypeId
                        }, function (obj) {
                            $scope.Data = obj.Data;
                          
                        });
                    };
                    $scope.load();
                    $scope.reload = function () {
                        //window.location.reload();
                        $state.reload();
                    };
                    $scope.goBack = function () {
                        $state.go('User.MyExaminedMenu.ExamItems', { memberId: $scope.memberId });
                    };
                    $scope.delete = function (item) {
                        if (!confirm('您确定要删除吗？')) return;
                        var request = {
                            memberId: params.memberId,
                            //examItemTypeId: item.ExamItemTypeID,
                            //examItemTypeParentId: item.ExamItemTypeParentID,
                            examTime: item.ExamTime
                        };
                        if (item.ExamItemTypeID != null && item.ExamItemTypeID != '')
                        {
                            request.examItemTypeId = item.ExamItemTypeID;
                        }
                        if (item.ExamItemTypeParentID != null && item.ExamItemTypeParentID != '') {
                            request.examItemTypeParentId = item.ExamItemTypeParentID;
                        }
                        services.delete(request,
                        function (response) {
                            if (response.Status == 0) {
                                layer.msg("删除成功");
                                $scope.reload();
                                //$state.go("User.Home");
                                return false;
                            } else {
                                layer.msg("删除失败", { icon: 2, shade: 0.5 });
                                return false;
                            }
                        },
                        function (response) {
                            layer.msg("删除失败", { icon: 2, shade: 0.5 });
                        });
                    };
                }
            ]);

        });