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

                    $scope.item = {};
                    $scope.currentMember = {};
                    $scope.onConsume = function (item) {
                        confirm('是否确定扣除该项服务的剩余次数？', '提示', '确定扣除', '取消操作').then(function (yes) {
                            if (yes) {
                                consume(item).then(function (resp) {
                                    if (resp.Status === 0 && (resp.Data === 0 || resp.Data === true)) {
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

                    //确认解约
                    $scope.onsubmit = function () {
                        layer.confirm('确认解约吗？', {
                            btn: ['确认', '取消'] //按钮
                        }, function () {
                            var loading = layer.load(0, { shade: [0.1, '#000'] });
                            FamilyDoctorServices.relievetrue({
                                SignatureID: id,
                                Status: 0,//申请解约状态 改为 待签约0
                                SurrenderUserID: $scope.item.SurrenderUserID,
                                SurrenderUserName: $scope.item.SurrenderUserName,
                                SurrenderTime: $scope.item.SurrenderTime,
                                SurrenderReason: $scope.item.SurrenderReason,
                                SurrenderPaper: $scope.item.SurrenderPaper
                            }, function (resp) {
                                layer.close(loading);
                                if (resp.Status == 0) {
                                    layer.msg("解约成功");
                                    $state.go("Doctor.FamilyDoctorManage.SignatureList");
                                }
                                else {
                                    layer.msg(resp.Msg, { icon: 2, shade: 0.5 });
                                }
                            }, function (resp) {
                                layer.close(loading);
                                layer.msg(resp.Msg, { icon: 2, shade: 0.5 });
                            })
                        })
                    }

                    function consume(item) {
                        var param = {
                            "PackageDetailID": item.UserFamilyDoctorDetailID,
                            "SignatureUserID": $scope.item.SignatureID,
                            "DoctorGroupID": $scope.item.FDGroupID,
                            "SignatureUserName": $scope.item.SignatureUserName,
                            "MemberIDCardNo": $scope.currentMember.IDNumber,
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
                                //$scope.item.SurrenderTime = $scope.item.SurrenderTime.Format("yyyy-MM-dd HH:mm:ss");
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

