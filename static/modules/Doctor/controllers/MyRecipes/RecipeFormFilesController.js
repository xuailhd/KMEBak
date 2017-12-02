"use strict";

/*
 * 常用处方
 * 作者：郭明
 * 日期：2016年7月6日
 */
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
            "pascalprecht.translate",
            'ui.router',
            "ui.bootstrap",
            "ngAnimate"]);
            

            //处方列表控制器
            app.controller('RecipeFormFilesController', ['$scope',
                '$http',
                '$state',
                '$translate',          
                "doctorRecipeFormulaFilesServices",
                
            function (
                $scope,
                $http,
                $state,
                $translate,                  
                doctorRecipeFormulaFilesServices) {

                
                //查询条件
                $scope.page = 1;
                $scope.pageSize = 20;
                $scope.Keyword = ""; //处方名称，搜索条          
                $scope.Type = "";//处方类型，搜索条件

                //列表
                $scope.ListItems = [];  

                //搜索
                $scope.onSearch = function () {
                    
                    doctorRecipeFormulaFilesServices.get({
                        Keyword: $scope.Keyword,                     
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.page
                    }, function (obj) {
                      
                        $scope.ListItems = obj.Data;
                        $scope.totalCount = obj.Total || 0;                       
                    });
                };  

                //编辑
                $scope.onEdit = function (id)
                {
                    $state.go("Doctor.RecipeFormFileEdit", { id: id });
                };

                //删除
                $scope.onRemove = function (item)
                {

                    //询问框
                    layer.confirm($translate.instant('msgConfirmDelete'), {
                        btn: ['是', '否'] //按钮
                    }, function () {


                        doctorRecipeFormulaFilesServices.delete({ ID: item.RecipeFormulaFileID }, function (response) {
                            layer.msg($translate.instant('msgDeleteSuccess'));
                           
                            $scope.onSearch();
                          
                        }, function () {

                            layer.msg($translate.instant('msgDeleteFail'), { icon: 2, shade: 0.5 });
                        });

                    }, function () {

                    });



                };


     

            }
        ]);
   });