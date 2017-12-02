"use strict";

define([
        "module-services-api",
], function () {

    var app = angular.module("myApp", [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
    ]);

    app.controller("EditController", ["$scope", "$state", "FamilyDoctorServices", "webapiServices", function ($scope, $state, FamilyDoctorServices, webapiServices) {   
        // 下拉列表
        $scope.mask = false;
        // 机构列表
        $scope.groupList = []

        //当前机构
        $scope.Group = {
            Value: '',
            Text: '所属社区'
        }
        $scope._index = 0;
        $scope.dropDown = []
        // teamName
        $scope.teamName = '';
        $scope.teamTel = '';
        $scope.teamIntro = '';
        // 成员
        $scope.DoctorGroupMembers = [];

        $scope.fn = {};

        $scope.fn.init = function () {
            $scope.fn.getGroupList()
        };

        // 新增一行成员
        $scope.addGroup = function () {
            $scope.DoctorGroupMembers.push({
                "DoctorName": '',
                "DoctorID": "",
                "Position": ''
            })
            console.log($scope.DoctorGroupMembers)     
        }
        // 删除元素
        $scope.deleteGroup = function (index) {
            $scope.DoctorGroupMembers.splice(index, 1);
        };

        // 获取医生团队机构
        $scope.fn.getGroupList = function () {    
            webapiServices.getGroupList({}, function (res) {
                if (res.Data != null) {
                    $scope.groupList = res.Data;
                    console.log($scope.groupList)
                }
            }, function () {
                console.error("获取医生团队机构失败")
            })
        };

        $scope.onSubmitDiagnoseTemplate = function () {

        };
        $scope.chooseDoctorName = function () {

        }

        // 团队成员下拉列表
        $scope.chooseDoctorDropList = function (item, index) {

            $("#modal-selectDoctor").modal("show");

            $scope.Group = item;
            if (!$scope.Group.Value) {
                layer.msg('没有机构编号');
                return false;
            }        
            $scope._index = index;
            $scope.mask = true;
            var keyword = undefined;
            webapiServices.getDoctorList({ OrgnazitionId: $scope.Group.Value, Keyword: keyword }, function (res) {
                if (res.Data.length > 0) {
                    console.log(res.Data)
                    $scope.dropDown = res.Data;
                } else {
                    layer.msg('暂时没有成员');
                }
               
            })
        };

        // 成员下拉列表点击
        $scope.chooseDoctorName = function (index) {          
            $scope.DoctorGroupMembers[$scope._index].DoctorID = $scope.dropDown[index].DoctorID;
            $scope.DoctorGroupMembers[$scope._index].DoctorName = $scope.dropDown[index].DoctorName;
            $scope.mask = false;
        }

        $scope.fn.verification = function() {
            if(!$scope.teamName) {
                layer.msg('没有团队名称');
            }
            if(!$scope.teamIntro) {
                layer.msg('没有团队介绍');
            }
            if(DoctorGroupMembers.length<=0) {
                layer.msg('没有团队成员');
            }
        }

        // 新增或者编辑
        $scope.setDoctorGroup = function () {
           
            // position 转化   
            //TODO 待优化     
            for (var i = 0; i < $scope.DoctorGroupMembers.length; i++) {
                $scope.DoctorGroupMembers[i].Position = ($scope.DoctorGroupMembers[i].Position == '队长' ? '2' : '1')
            }

            FamilyDoctorServices.EditDoctorGroup(
                {
                    DoctorGroupID: '',
                    GroupName: $scope.teamName,
                    OrgnazitionID: $scope.Group.Value,
                    Telephone: $scope.teamTel,
                    Remark: $scope.teamIntro,
                    DoctorGroupMembers: $scope.DoctorGroupMembers
                },
                function (obj) {
                    if (obj.Data != null) {
                        layer.msg('保存成功');
                        $state.to('/FamilyDoctor')
                        console.log(obj);
                    }
            })
        }



   
        $scope.fn.init();
    }])

})