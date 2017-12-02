"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            app.controller('MyMemberController', [
                '$scope',
                '$state',
                '$location',
                '$translate',
                'doctorMembersServices',
                'optionsServices',
            function (
                $scope,
                $state,
                $location,
                $translate,
                doctorMembersServices,
                optionsServices) {

                $scope.ListItems = [];
                $scope.pageSize = 10;
                $scope.CurrentPage = 1;
                $scope.totalCount = 0;
                //查询列表
                $scope.onSearch = function (page) {
                    
                    doctorMembersServices.query({ Keyword: $scope.Keyword, PageSize: $scope.pageSize, CurrentPage: $scope.CurrentPage }, function (obj) {
                        $scope.ListItems = obj.Data;
                        $scope.totalCount = obj.Total;
                    
                       
                    });
                }

                //患者详细页面
                $scope.showDetail = function (item) {
                    $state.go("Doctor.MyPatientDetail", { id: item.DoctorMemberID });
                }

                ////发起会诊
                //$scope.consultation = function (item) {
                //    $state.go("Doctor.ConsultationEdit", { id: item.DoctorMemberID });
                //}

            }
            ]);
        });