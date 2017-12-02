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

            app.controller('FeedbackController', [
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
                    $scope.ReadOnly = $scope.id != undefined && $scope.id != null && $scope.id != '';
                    $scope.Data = {};

                    $scope.load = function () {
                        if ($scope.id) {
                            webapiServices.getMyFeedback({ id: $scope.id },
                                function (response) {
                                    if (response.Status == 0) {
                                        $scope.Data = response.Data;
                                    }
                                },
                                function (response) {

                                });
                        }
                    };
                    $scope.load();
                    $scope.deleteImage = function (fileUrl) {
                        if (!confirm('您确定要删除吗？')) return;
                        for (var i = 0; i < $scope.Data.Attachments.length; i++) {
                            var item = $scope.Data.Attachments[i];
                            if (item.URL == fileUrl) {
                                $scope.Data.Attachments.splice(i, 1);
                                $scope.$apply();
                                break;
                            }
                        }
                    };

                    $scope.Uploading = false;
                    $scope.selectImage = function () {
                        if ($scope.Uploading) {
                            return;
                        }
                        if ($scope.Data.Attachments == undefined || $scope.Data.Attachments == null) {
                            $scope.Data.Attachments = [];
                        }
                        if ($scope.Data.Attachments.length >= 6) {
                            alert('最多只能上传6张图片！');
                            return;
                        }
                        $("#fileUpload").click();
                    };
                    $('#fileUpload').change(function () {
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
                            UploadFile(obj, 'Feedback', function (data) {
                                $scope.Data.Attachments.push({ URL: data.FileName, FileName: filename, FullUrl: data.UrlPrefix + '/' + data.FileName });
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
                        apiUtil.requestWebApi(apiUtil.webStoreUrl + '/Upload/Image', 'POST', data, function (response) {
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
                    $scope.onSubmit = function () {
                        webapiServices.addUserFeedback({
                            UserFeedbackID: $scope.id,
                            Subject: $scope.Data.Subject,
                            Content: $scope.Data.Content,
                            Attachments: $scope.Data.Attachments
                        },
                        function (response) {
                            if (response.Status == 0) {
                                layer.msg("保存成功");
                                $scope.goBack();
                            } else {
                                layer.msg("保存失败", { icon: 2, shade: 0.5 });
                            }
                        },
                        function (response) {
                            layer.msg("保存失败", { icon: 2, shade: 0.5 });
                        });
                    };
                    $scope.goBack = function () {
                        var type = apiUtil.getloginType();
                        $state.go(type + '.Feedbacks');
                    };


                    $scope.addServiceEvaluation = function () {
                        webapiServices.addServiceEvaluation({
                            OuterID: '28436ba2f35445a7aea035cd409d597a',
                            Score: 5,
                            EvaluationTags: '医术高明;很有医德',
                            Content: '好牛B的医生！！！'
                        },
                        function (response) {
                            if (response.Status == 0) {
                                layer.msg("保存成功");
                            } else {
                                layer.msg("保存失败", { icon: 2, shade: 0.5 });
                            }
                        },
                        function (response) {
                            layer.msg("保存失败", { icon: 2, shade: 0.5 });
                        });
                    };
                    $scope.getServiceEvaluations = function () {
                        webapiServices.getServiceEvaluations({
                            OuterID: '28436ba2f35445a7aea035cd409d597a'
                        },
                        function (response) {
                            if (response.Status == 0) {
                                layer.msg("保存成功");
                            } else {
                                layer.msg("保存失败", { icon: 2, shade: 0.5 });
                            }
                        },
                        function (response) {
                            layer.msg("保存失败", { icon: 2, shade: 0.5 });
                        });
                    };
                    $scope.getAllServiceEvaluationTags = function () {
                        webapiServices.getAllServiceEvaluationTags(null,
                        function (response) {
                            if (response.Status == 0) {
                                layer.msg("保存成功");
                            } else {
                                layer.msg("保存失败", { icon: 2, shade: 0.5 });
                            }
                        },
                        function (response) {
                            layer.msg("保存失败", { icon: 2, shade: 0.5 });
                        });
                    };
                    $scope.saleUserPackage = function () {
                        webapiServices.saleUserPackage({
                            UserPackageID: 'JK666TC',
                            UserID: '54e169e1604943c991b1be48b5d5fa85'
                        },
                        function (response) {
                            if (response.Status == 0) {
                                layer.msg("保存成功");
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