"use strict";
define([
        "module-directive-bundling-doctor-all",
        "module-services-api"
],
    function () {

        var app = angular.module("myApp",
            [
                "pascalprecht.translate",
                'ui.router',
                "ui.bootstrap",
                "ngAnimate"
            ]);

        app.controller('FamilyServiceDetailController',
            [
                '$scope',
                '$http',
                "$q",
                '$location',
                '$state',
                '$translate',
                'familySignatureServices',
                'FamilyDoctorServices',
                function ($scope, $http, $q, $location, $state, $translate, familySignatureServices, FamilyDoctorServices) {

                    var id = $state.params.id;
                    $scope.CommonApiUrl = global_ApiConfig.CommonApiUrl;

                    // 甲方信息
                    $scope.firstParty = {
                        select: []
                    }

                    // 家庭医生列表
                    $scope.doctorList = {
                        select: []
                    }

                    //更换签约信息
                    $scope.signInfo = {
                        SignatureID: id,
                        OrgnazitionID: '',
                        DoctorID: '',
                        Reason: ''
                    }

                    // 获取甲方信息
                    $scope.getGroupList = function () {
                        FamilyDoctorServices.getOrgList({}, function (response) {
                            $scope.firstParty.select = response.Data
                        })
                    }

                    // 获取家庭医生列表
                    $scope.getDoctorDropdownList = function () {
                        FamilyDoctorServices.getOrgDoctorList({
                            OrgnazitionID: $scope.signInfo.OrgnazitionID,
                            GroupIsEmpty: false,
                            CurrentPage: 1,
                            PageSize: 100
                        }, function (response) {
                            var options = [];
                            for (var i = 0, count = response.Data.length; i < count; i++) {
                                var item = response.Data[i];
                                options.push({ Value: item.DoctorID, Text: item.DoctorName + '【' + item.DoctorGroupName + '】' }); //+ '(' + item.DoctorGroupMembers.length + ' 人, 队长：' + item.LeaderName + ') '
                            }
                            $scope.doctorList.select = options;
                        })
                    }

                    //选择机构
                    $scope.fn.onOrgnazitionChange = function () {
                        $scope.getDoctorDropdownList();
                    }

                    //初始化
                    $scope.fn.init = function () {
                        $scope.getGroupList()
                    }

                    //保存更改签约
                    $scope.fn.onSubmit = function () {
                        var loading = layer.load(0, { shade: [0.1, '#000'] });
                        FamilyDoctorServices.changeSignture($scope.signInfo, function (response) {
                            layer.close(loading);
                            if (response.Status === 0) {
                                $('#services-modal').modal('hide');
                                layer.msg("更换成功");
                                $state.go("Doctor.FamilyDoctorManage.SignatureList");
                            } else {
                                layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                            }
                        }, function (response) {
                            layer.close(loading);
                            layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                        })
                    }

                    $scope.fn.init();

                    $scope.item = {};
                    $scope.currentMember = {};
                    $scope.onConsume = function (item) {
                        confirm('是否确定扣除该项服务的剩余次数？', '提示', '确定扣除', '取消操作').then(function (yes) {
                            if (yes) {
                                consume(item).then(function (resp) {
                                    if (resp.Status == 0) {
                                        item.ConsumeCount += 1;
                                        return;
                                    }
                                    throw resp;
                                })
                                    .catch(function (e) {
                                        console.log(e);
                                        layer.alert('操作失败，请刷新页面后重试。');
                                    });
                            }
                        });
                    }
                    $scope.onChooseMember = function (member) {
                        $scope.currentMember = member;
                    }
                    loadData(id);

                    $scope.ContractFileView = function () {
                        window.open($scope.item.ContractFileUrl);
                    }

                    function consume(item) {
                        var param = {
                            "ServiceType": item.ServiceType,
                            "SignatureUserID": $scope.item.SignatureUserID,
                            "DoctorGroupID": $scope.item.FDGroupID,
                            "SignatureUserName": $scope.item.SignatureUserName,
                            "IDNumber": $scope.currentMember.IDNumber,
                            "MemberName": $scope.currentMember.MemberName,
                            "MemberID": $scope.currentMember.MemberID,
                            "ConsumeCount": item.ConsumeCount,
                        };
                        return callApi(familySignatureServices.consume, param).catch(function (e) {
                            return e.Status ? e : { Status: -1, Msg: '网络错误', Data: e };
                        });;
                    }

                    function loadData(id) {
                        callApi(familySignatureServices.getDetail, { ID: id })
                            .then(function (resp) {
                                $scope.item = resp.Data;
                                $scope.item.StatusName = { '0': '待签约', "1": "已签约", "2": "申请解约", "3": "已解约" }[$scope.item.Status] || '-';
                                $scope.onChooseMember($scope.item.Members[0]);
                            });
                    }

                    function confirm(msg, title, btnOk, btnCancel) {
                        function warp(fn, v) {
                            return function (i) {
                                layer.close(i);
                                fn(v);
                            }
                        }

                        return new $q(function (ok, cancel) {
                            layer.confirm(msg, { title: title, btn: [btnOk, btnCancel] }, warp(ok, true), warp(ok, false));
                        })
                    }

                    function callApi(fn, param, ms) {
                        var ix = layer && layer.load('2');
                        var t = Date.now() + (ms || 600);

                        function d(f, o) { setTimeout(function () { layer && layer.close(ix), f(o) }, t - Date.now()) }

                        return $q(function (resolve, reject) {
                            fn.apply(null, [param, resolve, reject]);
                        }).then(function (e) { return new Promise(function (a, b) { d(a, e) }); },
                            function (e) { return new Promise(function (a, b) { d(b, e); }); });
                    }
                }
            ]);
    }
);