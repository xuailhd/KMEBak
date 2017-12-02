"use strict";

define([
        "module-services-api",
], function () {
    
    var app = angular.module("myApp",[
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
    ]);

    app.controller("OrgDoctorGroupController", ["$scope", "$state", "FamilyDoctorServices", function ($scope, $state, FamilyDoctorServices) {

        $scope.CurrentPage = 1;
        $scope.PageSize = 10;
        $scope.OrgID = "";
        $scope.GroupList = []

        // 获取医生团队机构
        $scope.fn.getOrgList = function ()
        {
            FamilyDoctorServices.getOrgList({}, function (res)
            {
                if (res.Status == 0)
                {
                    $scope.OrgList = res.Data;
                    console.log($scope.groupList)
                }
                else
                {
                    layer.msg("获取医生团队机构失败", { icon: 2, shade: 0.5 });
                }
            }, function () {

                layer.msg("获取医生团队机构失败", { icon: 2, shade: 0.5 });

            })
        };
        
        $scope.fn.onSearch = function ()
        {
            
            $scope.loading = true;

            FamilyDoctorServices.getDoctorGroup({
                PageSize: $scope.PageSize,
                CurrentPage: $scope.CurrentPage,
                OrgnazitionID: $scope.OrgnazitionID
            }, function (response) {

                $scope.loading = false;

                if (response.Status == 0) {
                    $scope.GroupList = response.Data;
                    $scope.TotalCount = response.Total;
                }
                else
                {
                    layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });

                }
            }, function () {

                $scope.loading = false;
                layer.msg("服务器在打盹，请稍后重试", { icon: 2, shade: 0.5 });
            })
        }

        $scope.fn.onDelete = function (item)
        {
            FamilyDoctorServices.DeleteDoctorGroup({
                DoctorGroupID: item.DoctorGroupID
            }, function (resp) {

                if (resp.Status == 0) {
                    layer.msg(resp.Msg, { icon: 1, shade: 0.5 });
                }
                else
                {
                    layer.msg(resp.Msg, { icon: 2, shade: 0.5 });
                }

                $scope.fn.onSearch();

            }, function (resp) {

                layer.msg(resp.Msg, { icon: 2, shade: 0.5 });
            })
        }

        $scope.fn.getOrgList();
    }])

})