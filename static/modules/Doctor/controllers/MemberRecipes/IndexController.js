"use strict";
define(["module-services-apiUtil","module-services-apiUtilMP","module-directive-bundling-doctor-all"], function (apiUtil,apiUtilMP) {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate",
          'ngCookies']);

            app.controller('MemberRecipesIndexController', [
                '$scope',
                '$http',
                '$location',
                '$state',
                '$translate',
                'optionsServices',
                    function ($scope,
                        $http,
                        $location,
                        $routeParams,
                        $translate,
                        optionsServices) {

                        $scope.ListItems = [];
                        $scope.pageSize = 10;
                        $scope.CurrentPage = 1;
                        $scope.totalCount = 0;
                        $scope.DrugstoreRecipeStatus = "";
                        $scope.SubmitStart = '';
                        $scope.SubmitEnd = '';
                        $scope.orgID = '';
                        $scope.orgName = '';
                        $scope.doctorDrugstores = [];

                        var EnumDrugstoreRecipeStatus = {
                            "N-5": "提交医网签失败",
                            "N4": "未提交",
                            "N5": "已提交",
                            "N6": "已签名",
                        };

                        var EnumRecipeType = {
                            "N1": "中药处方",
                            "N2": "西药处方",
                        };

                        apiUtil.requestWebApi("/users/GetMPUserID", "get", null, function (response) {
                            apiUtilMP.setLocalUerID(response.Data);
                        }, function (res) {
                        });

                        $scope.initDrugstores = function () {
                            apiUtil.requestWebApi(global_ApiConfig.DoctorApiUrl + '/DoctorDrugstore/GetDoctorDrugstore',
                                'Get', null, function (obj) {
                                    if (obj.Data != null) {
                                        $scope.doctorDrugstores = obj.Data;
                                        var orgID = $.cookie("DoctorDrugstore");
                                        var flag = false;
                                        if (orgID) {
                                            if($scope.doctorDrugstores.length>0){
                                                for(var i=0;i<$scope.doctorDrugstores.length;i++ ){
                                                    if ($scope.doctorDrugstores[i].OrgnazitionID == orgID) {
                                                        $scope.orgID = orgID;
                                                        $scope.orgName = $scope.doctorDrugstores[i].DrugstoreName;
                                                        flag = true
                                                        break;
                                                    }
                                                }

                                                if (!flag) {
                                                    $.cookie("DoctorDrugstore", '');
                                                }
                                            }
                                        }
                                        $scope.$apply();
                                    }
                            });
                        }
                        $scope.initDrugstores();
                        $scope.$watch("orgID",
                            function () {
                                $scope.onSearch();
                            });
                        $scope.onSearch = function (page) {
                            if ($scope.orgID && $scope.orgID.length <= 0) {
                                return;
                            }

                            var data = {
                                PatientName: $scope.Keyword,
                                PageSize: $scope.pageSize,
                                PageIndex: $scope.CurrentPage,
                                OrgID: $scope.orgID,
                                SubmitStart: $scope.SubmitStart,
                                SubmitEnd: $scope.SubmitEnd
                            }
                            if ($scope.DrugstoreRecipeStatus) {
                                data.StateDocEx = +$scope.DrugstoreRecipeStatus;
                            }

                            apiUtilMP.requestWebApi('RecipeForDoctor/GetRecipes', 'Post', data, function (obj) {
                                if (obj.Data != null) {
                                    $.each(obj.Data, function (i, d) {
                                        d.StatusName = EnumDrugstoreRecipeStatus["N" + d.State];
                                        if (d.SumitDate) {
                                            d.SumitDate = new Date(d.SumitDate).format("yyyy-MM-dd hh:mm:ss");
                                        }
                                        d.RecipeTypeName = EnumRecipeType["N" + d.RecipeType];
                                    });
                                }
                                $scope.ListItems = obj.Data;
                                $scope.totalCount = obj.Total;
                                $scope.$apply();
                            },
                            function (response) {
                            });
                        };
                    
                        //删除会员处方
                        $scope.Remove = function (item) {
                            //询问框
                            layer.confirm($translate.instant('msgConfirmDelete'), {
                                btn: ['是', '否'] //按钮
                            }, function () {
                                var data = { RecipeFileID: item }
                                apiUtilMP.requestWebApi('RecipeForDoctor/Delete', 'Post', data, function (obj) {
                                    if (obj.Status > 0) {
                                        layer.msg($translate.instant('msgDeleteSuccess'));
                                        //刷新数据
                                        $scope.onSearch($scope.CurrentPage);
                                    }
                                    else
                                        layer.msg(obj.Msg);
                                },
                               function (response) {
                               });
                            });
                        };

                        //编辑会员处方
                        $scope.onEdit = function (id) {
                            $.cookie("DoctorDrugstore", $scope.orgID);
                            $routeParams.go("Doctor.MemberRecipesEdit", {
                                id: id,
                                OrgID: $scope.orgID,
                                OrgName: $scope.orgName
                            });
                        }

                        //查看会员处方
                        $scope.onDetail = function (id) {
                            $.cookie("DoctorDrugstore", $scope.orgID);
                            $routeParams.go("Doctor.MemberRecipesDetail", {
                                id: id,
                                OrgID: $scope.orgID,
                                OrgName: $scope.orgName
                            });
                        }

                        //新增会员处方
                        $scope.newRecipeFile = function (RecipeType) {
                            if (!$scope.orgID || $scope.orgID.length < 1) {
                                layer.msg('请先选择坐诊药店');
                                return;
                            }

                            if($scope.doctorDrugstores.length>0){
                                for(var i=0;i<$scope.doctorDrugstores.length;i++ ){
                                    if($scope.doctorDrugstores[i].OrgnazitionID == $scope.orgID){
                                        $scope.orgName= $scope.doctorDrugstores[i].DrugstoreName;
                                    }
                                }
                            }
                            $.cookie("DoctorDrugstore", $scope.orgID);
                            $routeParams.go("Doctor.MemberRecipesEdit", {
                                RecipeType: RecipeType,
                                OrgID: $scope.orgID,
                                OrgName: $scope.orgName
                            });
                        }

                        $scope.onPreview = function (id) {

                            //查看审方平台处方
                            layer.open({
                                type: 2,
                                area: ['700px', '530px'],
                                fix: false, //不固定
                                maxmin: true,
                                content: "/SRMPRecipe?recipeid=" + id + "&orgId=" + $scope.orgID,
                            });
                        }
                        $scope.onPreview2 = function (id) {

                            //查看审方平台处方
                            layer.open({
                                type: 2,
                                area: ['700px', '530px'],
                                fix: false, //不固定
                                maxmin: true,
                                content: "/SRMPRecipePreview?recipeid=" + id + "&orgId=" + $scope.orgID,
                            });
                        }
                        $scope.onSearch();
                    }
            ]);

        });