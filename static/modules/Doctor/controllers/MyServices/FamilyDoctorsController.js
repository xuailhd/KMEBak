"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            /*
       家庭医生            
   */
            app.controller('MyFamilyDoctorController', [
               '$scope',
               '$state',
               '$location',
               '$translate',
               'webapiServices',
           function (
               $scope,
               $state,
               $location,
               $translate,
               webapiServices) {

               $scope.ListItems = [];
               $scope.pageSize = 10;
               $scope.CurrentPage = 1;
               $scope.totalCount = 0;
               //查询列表
               $scope.onSearch = function (page) {

                   webapiServices.doctorGetForWeb({
                       Keyword: $scope.Keyword,
                       PageSize: $scope.pageSize,
                       CurrentPage: $scope.CurrentPage,
                       IsContainExpire: 1,
                       IsContainEnable: 1
                   }, function (obj) {
                       if (obj.Data != null) {
                           $.each(obj.Data, function (i, d) {
                               var curDate = new Date(d.EndDate);
                               d.EndDate = curDate.format("yyyy-MM-dd");
                               curDate = new Date(d.StartDate);
                               d.StartDate = curDate.format("yyyy-MM-dd");
                           });
                       }
                       $scope.ListItems = obj.Data;
                       $scope.totalCount = obj.Total;
                   });
               }
           }
            ]);
        });