"use strict";
define(["jquery",
        "module-services-apiUtil",
        'plugins-layer',
        'bootstrap-typeahead',
        "module-directive-bundling-doctor-all",
        "module-services-api"], function ($, apiUtil, layer) {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            app.controller('FeedbacksController', [
                '$scope',
                '$http',
                "$q",
                '$location',
                '$state',
                '$translate',
                '$filter',
                'webapiServices',
                function ($scope, $http, $q, $location, $state, $translate, $filter, webapiServices) {
                    var params = $state.params;

                    $scope.id = params.id;
                    $scope.Data = {};

                    $scope.ListItems = [];
                    $scope.pageSize = 10;
                    $scope.CurrentPage = 1;
                    $scope.totalCount = 0;
                    //查询列表
                    $scope.onSearch = function (page) {
                        webapiServices.getMyFeedbacks({ Keyword: $scope.Keyword, PageSize: $scope.pageSize, CurrentPage: $scope.CurrentPage }, function (obj) {
                            $scope.ListItems = obj.Data;
                            $scope.totalCount = obj.Total;
                        });
                    }
                    $scope.onAdd = function ()
                    {
                        var type = apiUtil.getloginType();
                        $state.go(type + '.Feedback');
                    };
                    //详细页面
                    $scope.showDetail = function (id) {
                        var type = apiUtil.getloginType();
                        $state.go(type + '.Feedback', { id: id });
                    };
                    $scope.onDelete = function (id) {
                   
                        return $q(function (resolve, reject) {
                            var index = layer.confirm($translate.instant("msgConfirmDelete"), {
                                btn: [$translate.instant("是"), $translate.instant("否")]
                            }, function () {
                                layer.close(index);
                                resolve();
                            }, function () {

                            });
                        }).then(function () {
                            return webapiServices.promise.deleteUserFeedback({ id: id });

                        }).then(function(resp){
                            if (resp.Status == 0) {
                                $scope.onSearch();
                            } else {
                                layer.msg($translate.instant("msgDeleteFail"), { icon: 2, shade: 0.5 });
                                return false;
                            }
                            
                        })["catch"](function(resp){
                            layer.msg($translate.instant("msgDeleteFail"), { icon: 2, shade: 0.5 });
                        });
                    };
                    
                }
            ]);

        });