"use strict";
define(["bootstrap-select",
    "module-services-api",
    "module-directive-bundling-doctor-all",
    ], function (select) {

    var app = angular.module("myApp", [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
    ]);

    app.controller("OrgDoctorGroupEditController", [
        "$scope",
        "$state",
        "FamilyDoctorServices", function ($scope, $state, FamilyDoctorServices) {

            $scope.page = 1;
            $scope.pageSize = 10;
            $scope.totalCount = 2;
            // 机构列表
            $scope.OrgList = []

            $scope.DoctorList = [];
            $scope.Regions = [];
            $scope.RegionIDs = [];

            //团队信息
            $scope.TeamInfo = {
                teamName: "", teamTel: "", teamIntro: "", DoctorGroupMembers: []
            };
            //提交表单
            $scope.fn.onSubmit = function () {
                for(var i= 0;i<$scope.OrgList.length;i++){  
                    if($scope.OrgList[i].Value == $scope.TeamInfo.OrgnazitionID){
                        $scope.TeamInfo.HospitalName = $scope.OrgList[i].Text
                        break;
                    }
                }

                $scope.TeamInfo.GroupRegions = [];
                if($scope.RegionIDs.length>0){
                    for(var i =0 ; i<$scope.RegionIDs.length;i++){
                        $scope.TeamInfo.GroupRegions.push({VillageRegionID:$scope.RegionIDs[i]});
                    }
                }

                var loading = layer.load(0, { shade: [0.1, '#000'] });
                FamilyDoctorServices.EditDoctorGroup($scope.TeamInfo,
                    function (resp) {
                        layer.close(loading);
                        if (resp.Status == 0) {
                            layer.msg(resp.Msg, { icon: 1, shade: 0.5 });
                            $state.go('Doctor.FamilyDoctorManage.OrgDoctorGroup')
                        }
                        else {
                            layer.msg(resp.Msg, { icon: 2, shade: 0.5 });
                        }
                    }, function (resp) {

                        layer.msg(resp.Msg, { icon: 2, shade: 0.5 });
                        layer.close(loading);
                    });
            }

            $scope.fn.onEdit = function (id)
            {
                FamilyDoctorServices.getDoctorGroupDetail({
                    DoctorGroupID:id,
                }, function (resp) {
                    if (resp.Status == 0) {
                        $scope.TeamInfo = resp.Data;
                        $scope.fn.getRegions($scope.TeamInfo.OrgnazitionID);
                        debugger;
                        $scope.RegionIDs = [];
                        if($scope.TeamInfo.GroupRegions.length>0){
                            for(var i =0 ; i<$scope.TeamInfo.GroupRegions.length;i++){
                                $scope.RegionIDs.push($scope.TeamInfo.GroupRegions[i].VillageRegionID);
                            }
                        }
                    }
                    else
                    {
                        layer.msg("获取医生团队信息失败", { icon: 2, shade: 0.5 });
                    }
                })
            }

            // 获取医生团队机构
            $scope.fn.getOrgList = function ()
            {
                FamilyDoctorServices.getOrgList({}, function (res) {
                    if (res.Data != null) {
                        $scope.OrgList = res.Data;
                        console.log($scope.groupList)
                    }
                }, function ()
                {
                    layer.msg("获取医生团队机构失败", { icon: 2, shade: 0.5 });
                })
            };

            $scope.fn.onAddGroupMember = function ()
            {
                var formIsValid = $("#formOrgDoctorGroupEdit").validate().element($("#OrgnazitionID"))

                if (formIsValid)
                {
                    $scope.fn.onQueryDoctorList();
                
                    $("#modal-selectDoctor").modal("show")
                }
            }

            $scope.fn.onQueryDoctorList = function ()
            {
                
                FamilyDoctorServices.getOrgDoctorList({
                    CurrentPage: $scope.page,
                    PageSize: $scope.pageSize,
                    OrgnazitionId: $scope.TeamInfo.OrgnazitionID
                }, function (res) {
                    $scope.DoctorList = res.Data;
                    $scope.totalCount = res.Total;

                    $scope.DoctorList.forEach(function (doctor) {

                        if (!doctor.GroupIsEmpty) {
                            doctor.Disabled = true;
                        }
                        else
                        {
                            doctor.Disabled = $scope.TeamInfo.DoctorGroupMembers.some(function (member) {

                                return member.DoctorID == doctor.DoctorID
                            });
                        }
                    });


                })

            }

            $scope.fn.onRemoveGroupMember = function (item)
            {
                $scope.TeamInfo.DoctorGroupMembers.remove(item);
            }

            $scope.fn.onSelectLeader = function (item)
            {
                $scope.TeamInfo.DoctorGroupMembers.forEach(function (doctor) {

                    doctor.Position = 1;

                });

                item.Position = 2;

            }

            $scope.fn.onConfirmSelect = function ()
            {
                var list = $scope.DoctorList.filter(function (item) {
                    return item.Selected;
                }).map(function (item) {
                    return {
                        Selected: false,
                        DoctorID:item.DoctorID,
                        HospitalName: item.HospitalName,
                        TitleName: item.TitleName,
                        DoctorName: item.DoctorName,
                        DepartmentName: item.DepartmentName,
                        Specialty : item.Specialty,
                        Mobile : item.Mobile,
                        PhotoUrl : item.PhotoUrl,
                        Title : item.Title,
                    };
                });

                $scope.TeamInfo.DoctorGroupMembers.addAll(list);

                $("#modal-selectDoctor").modal("hide")
            }



            $scope.fn.onOrgChanged = function ()
            {
                $scope.TeamInfo.DoctorGroupMembers = [];
                $scope.fn.getRegions($scope.TeamInfo.OrgnazitionID);
            }

            $scope.fn.getRegions = function (orgid) {
                $scope.RegionIDs = [];
                FamilyDoctorServices.getOrgRegionDetail({orgID : orgid}, function (obj) {
                    debugger;
                    if(obj.Status == 0 && obj.Data.Details && obj.Data.Details.length>0){
                        for(var i = 0;i<obj.Data.Details.length;i++){
                            if(obj.Data.Details[i].VillageRegionID){
                                $scope.Regions.push(obj.Data.Details[i]);
                            }
                        }
                    }
                    
                })
            }
            $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                // 下拉菜单多选
                $('.selectpicker').selectpicker({
                    size: 'auto',
                    noneSelectedText: '尚未选择服务区域'
                })
            });

            //初始化
            $scope.fn.onInit = function () {
                $scope.fn.getOrgList()
                if($state.params.id)
                {
                    $scope.fn.onEdit($state.params.id)
                }
            };


            $scope.fn.onInit();
        }])

        app.directive('onFinishRenderFilters', ["$timeout", function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit('ngRepeatFinished');
                        });
                    }
                }
            };
        }]);

})