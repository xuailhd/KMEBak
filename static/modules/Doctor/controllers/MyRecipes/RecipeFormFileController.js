"use strict";
/*
 * 添加常用处方
 * 作者：郭明
 * 日期：2016年7月6日
 */
define(["module-directive-bundling-doctor-all",
        "module-services-api",
        "module-directive-editor-Recipe-Formular"], function () {

    var app = angular.module("myApp", [
        "pascalprecht.translate",
        'ui.router',
        "ui.bootstrap",
        "ngAnimate"]);

    app.controller('RecipeFormFileController', [
        '$scope',
        "$http",
        "$state",
        '$translate',
    function ($scope, $http, $state, $translate) {
      
        $scope.recipeFormularID = $state.params.id;
        $scope.recipeFormularCallback = {
            submitCallback: null,
            actionSuccessCallback: null,
            resetCallback: null
        }
        
        $scope.recipeFormularCallback.actionSuccessCallback = function () {
            $state.go("Doctor.RecipeFormFiles");
        }
    }]);
});