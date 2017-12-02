"use strict";
define(["jquery",
        "module-services-apiUtil",
        'plugins-layer',
        'bootstrap-typeahead',
        "jquery-form",
        "module-directive-bundling-doctor-all",
        "module-services-api"], function ($, apiUtil, layer) {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            app.controller('PersonalInfoController', [
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

                    $scope.Data = {};
                    $scope.load = function () {
                        webapiServices.getUserInfo(null,
                            function (response) {
                                if (response.Status == 0) {
                                    $scope.Data = response.Data;
                                    if (response.Data.PhotoUrl != null && response.Data.PhotoUrl != '') {
                                 
                                        $scope.Data.PhotoFullUrl = response.Data.PhotoUrl;
                                    }
                                }
                            },
                            function (response) {

                            });
                    };
                    $scope.load();

                    $scope.Uploading = false;
                    $('#filePhotoUrl').change(function () {
                        var obj = this;
                        if ($.trim(obj.value) != '') {
                            var filename = $.trim(obj.value);
                            filename = filename.substring(filename.lastIndexOf('\\') + 1);
                            var extStart = filename.lastIndexOf(".");
                            var ext = filename.substring(extStart, filename.length).toUpperCase();
                            if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                                alert("图片限于bmp,png,gif,jpeg,jpg格式");
                                return false
                            }
                            UploadFile(obj, 'UserPhotos', function (data) {
                                $scope.Data.PhotoUrl = data.FileName;
                                $scope.Data.PhotoFullUrl = data.UrlPrefix + '/' + data.FileName;
                                $scope.$apply();
                            })
                        }
                    });

                    function UploadFile(fileSelector, category, fnSuccess) {
                        $scope.Uploading = true;
                        var data = new FormData();
                        var files = $(fileSelector).get(0).files;

                        // Add the uploaded image content to the form data collection
                        if (files.length > 0) {
                            data.append("file", files[0]);
                        }
                        //加载层
                        var loading = layer.load(0, { shade: false }); //0代表加载的风格，支持0-2

                        apiUtil.requestWebApi(apiUtil.webStoreUrl+'/Upload/Image', 'POST', data, function (response) {
                            if (response != null) {
                                var data = response.Data;
                                if (response.Status == 0) {
                                    fnSuccess(data);
                                }
                                else {
                                    alert(response.Msg);
                                }
                            }
                            layer.close(loading);
                            $scope.Uploading = false;
                        },
                        function (response) {
                            if (response != null) {
                                alert(response.Msg);
                            }
                            layer.close(loading);
                            $scope.Uploading = false;
                        });
                    }
                    $scope.save = function () {
                        webapiServices.updateUserInfo($scope.Data,
                        function (response) {
                            if (response.Status == 0) {
                                layer.msg("保存成功");
                                var loginInfo = apiUtil.getLoginInfo();
                                loginInfo.UserCNName = $scope.Data.UserCNName;
                                loginInfo.UserENName = $scope.Data.UserENName;
                                loginInfo.PhotoUrl = $scope.Data.PhotoFullUrl;
                                apiUtil.setLoginInfo(loginInfo);
                                $scope.$parent.loginInfo.UserCNName = loginInfo.UserCNName;
                                $scope.$parent.loginInfo.PhotoUrl = loginInfo.PhotoUrl;
                            } else {
                                layer.msg("保存失败", { icon: 2, shade: 0.5 });
                            }
                        },
                        function (response) {
                            layer.msg("保存失败", { icon: 2, shade: 0.5 });
                        });
                    };
                }
            ]);

        });