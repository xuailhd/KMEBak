"use strict";

define([
        "module-services-api",
         "module-directive-bundling-doctor-all"
], function () {

    var app = angular.module("myApp", [
        "pascalprecht.translate",
        'ui.router',
        "ui.bootstrap",
        "ngAnimate"
    ]);

    app.controller("SignatureEditController", ["$scope", "$state", "$interval", "webapiServices", "FamilyDoctorServices", function ($scope, $state, $interval, webapiServices, FamilyDoctorServices) {
        var infoObj = null;
        var id = (function () {
            if ($state.params.id == 'add') {
                return '';
            }

            var status = ''

            try {
                if (JSON.parse(unescape($state.params.id))) {
                    infoObj = JSON.parse(unescape($state.params.id))
                    status = ''
                }
            } catch (err) {
                status = $state.params.id
            }

            return status
        })()

        // 甲方信息
        $scope.firstParty = {
            select: []
        }

        // 医生团队
        $scope.doctorTeam = {
            select: []
        }

        // 家庭医生列表
        $scope.doctorList = {
            select: []
        }

        // 家庭成员关系（0-自己、1-配偶、2-父亲、3-母亲、4-儿子、5女儿、6-其他）
        $scope.relationList = { "配偶": 1, "父亲": 2, "母亲": 3, "儿子": 4, "女儿": 5, "其他": 6 };

        // 省、市、区、街道
        $scope.address = {
            province: [],
            city: [],
            area: [],
            street: []
        }

        // 确认签约信息
        $scope.signInfo = {
            VerificationCode: "",
            SignatureID: "",
            //FDGroupID: global_doctorInfo.DoctorGroupIdList[0],
            DoctorID: global_doctorInfo.DoctorID,
            OrgnazitionID: global_doctorInfo.HospitalID,
            SignatureUserName: "",
            SignatureUserIDNumber: "",
            SignatureURL: "",
            FamilyFN: "",
            Mobile: "",
            Province: "",
            City: "",
            District: "",
            Subdistrict: "",
            Address: "",
            Status: 0,
            Members: []
        }

        // 增加家庭成员行
        $scope.addFamilyRow = function () {
            $scope.signInfo.Members.push({
                MemberName: "",
                IDNumber: "",
                Relation: 6
            })
        }

        // 删除家庭成员行
        $scope.deleteFamilyRow = function ($index) {
            $scope.signInfo.Members.splice($index, 1)
        }

        // 获取甲方信息
        $scope.getGroupList = function (funSetDefault) {
            FamilyDoctorServices.getOrgList({}, function (response) {

                $scope.firstParty.select = response.Data

                if (funSetDefault) {
                    funSetDefault();
                }

            })
        }

        //// 获取医生团队
        //$scope.getDropdownList = function (funSetDefault) {
        //    FamilyDoctorServices.getDoctorGroup({
        //        OrgnazitionID: $scope.signInfo.OrgnazitionID
        //    }, function (response) {
        //        var options = [];
        //        for (var i = 0, count = response.Data.length; i < count; i++) {
        //            var item = response.Data[i];
        //            options.push({ Value: item.DoctorGroupID, Text: item.GroupName + '(' + item.DoctorGroupMembers.length + ' 人, 队长：' + item.LeaderName + ') ' });
        //        }

        //        $scope.doctorTeam.select = options;

        //        if (funSetDefault) {
        //            funSetDefault();
        //        }

        //    })
        //}

        // 获取家庭医生列表
        $scope.getDoctorDropdownList = function (funSetDefault) {
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

                if (funSetDefault) {
                    funSetDefault();
                }

            })
        }

        // 获取验证码
        $scope.smsNum = ""
        $scope.smsText = "获取验证码"
        $scope.smsDisabled = false
        $scope.getSmsCode = function () {
            var smsValidate = $("#myForm").validate().element($("#Mobile"))
            var timeLeft = 60

            if (smsValidate) {
                var timer = $interval(function () {
                    if (timeLeft > 0) {
                        $scope.smsDisabled = true
                        timeLeft -= 1
                        $scope.smsText = timeLeft + '秒后重新发送'
                    } else {
                        $scope.smsDisabled = false
                        $scope.smsText = "获取验证码"
                        $interval.cancel(timer);
                    }
                }, 1000)

                webapiServices.sendSmsCode({
                    Mobile: $scope.signInfo.Mobile,
                    MsgType: 7
                }, function (response) {
                    if (response.Status == 1) {
                        layer.msg("发送验证码失败", { icon: 2, shade: 0.5 });
                    }
                }, function (resp) {

                    layer.msg("发送验证码失败", { icon: 2, shade: 0.5 });

                })
            }
        }

        // 获取省
        $scope.getProvince = function (funSetDefault) {
            webapiServices.getRegions({
                RegionLevel: 1
            }, function (response) {
                $scope.address.province = response.Data;
                if (funSetDefault) {
                    funSetDefault();
                }
            })
        }
        // 获取市
        $scope.getCity = function (funSetDefault) {
            webapiServices.getRegions({
                RegionLevel: 2,
                ParentID: $scope.signInfo.Province
            }, function (response) {
                $scope.address.city = response.Data
                if (funSetDefault) {
                    funSetDefault();
                }
            })
        }
        // 获取区
        $scope.getDistrict = function (funSetDefault) {
            webapiServices.getRegions({
                RegionLevel: 3,
                ParentID: $scope.signInfo.City
            }, function (response) {
                $scope.address.area = response.Data
                if (funSetDefault) {
                    funSetDefault();
                }
            })
        }
        // 获取街道
        $scope.getSubdistrict = function (funSetDefault) {
            webapiServices.getRegions({
                RegionLevel: 4,
                ParentID: $scope.signInfo.District
            }, function (response) {
                $scope.address.street = response.Data
                if (funSetDefault) {
                    funSetDefault();
                }
            })
        }

        //选择机构
        $scope.fn.onOrgnazitionChange = function () {
            //$scope.getDropdownList()
            $scope.getDoctorDropdownList();
        }

        // 选择省
        $scope.fn.onProvinceChange = function () {
            $scope.getCity(function () {
                $scope.signInfo.City = ""
                $scope.signInfo.District = ""
                $scope.address.area = []
                $scope.address.street = []
            });
        }

        // 选择市
        $scope.fn.onCityChange = function () {
            $scope.getDistrict(function () {
                $scope.signInfo.District = ""
                $scope.address.street = []
            });
        }

        // 选择县区
        $scope.fn.onDistrictChange = function () {
            $scope.getSubdistrict(function () {
                $scope.signInfo.Subdistrict = ""
            });
        }

        function loadData(id) {
            if ($state.params.id == 'add') {
                return;
            }
            if (id && id != '') {
                FamilyDoctorServices.getSignature({ ID: id }, function (response) {
                    if (response.Status == 0) {
                        console.log(response.Data)
                        $scope.signInfo = response.Data;
                        $scope.fn.onOrgnazitionChange();
                        //$scope.getProvince();
                        $scope.getCity();
                        $scope.getDistrict();
                        $scope.getSubdistrict();
                    }
                });
            } else {
                infoObj.Mobile = infoObj.FamilyMobile;
                infoObj.SignatureUserIDNumber = infoObj.SignatureUserIDCard;
                $scope.signInfo = infoObj;
            }
        }

        // 初始化
        $scope.fn.init = function () {
            $scope.getGroupList(function () {

                $scope.signInfo.OrgnazitionID = global_doctorInfo.HospitalID;

                //$scope.getDropdownList(function () {
                //    if (global_doctorInfo.DoctorGroupIdList.length > 0)
                //    {
                //        $scope.signInfo.FDGroupID = global_doctorInfo.DoctorGroupIdList[0];
                //    }
                //})

                $scope.getDoctorDropdownList(function () {
                    if (global_doctorInfo.DoctorID) {
                        $scope.signInfo.DoctorID = global_doctorInfo.DoctorID;
                    }
                })
            });

            $scope.getProvince(function () {

                $scope.signInfo.Province = "20";

                $scope.getCity(function () {
                    $scope.signInfo.City = "232"

                    $scope.getDistrict(function () {
                        $scope.signInfo.District = "2316"

                        $scope.getSubdistrict(function () {

                            $scope.signInfo.Subdistrict = "5001";

                        })

                    });

                });

            });

            loadData(id);
        };

        // 确认签约
        $scope.fn.onSubmit = function () {
            for(var i= 0;i<$scope.firstParty.select.length;i++){  
                if($scope.firstParty.select[i].Value == $scope.signInfo.OrgnazitionID){
                    $scope.signInfo.OrgnazitionName = $scope.firstParty.select[i].Text
                    break;
                }
            }
            var loading = layer.load(0, { shade: [0.1, '#000'] });
            FamilyDoctorServices.signatureSave($scope.signInfo, function (resp) {
                console.log(resp)

                layer.close(loading);
                if (resp.Status == 0) {
                    layer.msg("添加成功");
                    $state.go("Doctor.FamilyDoctorManage.SignatureList");
                }
                else {
                    layer.msg(resp.Msg, { icon: 2, shade: 0.5 });
                }
            }, function (resp) {

                layer.close(loading);
                layer.msg(resp.Msg, { icon: 2, shade: 0.5 });

            })
        }

        //初始化websocket
        var socket;
        var initWebSocket = function () {
            if (window.WebSocket) {
                try {
                    socket = new WebSocket("ws://127.0.0.1:21398");

                    socket.onopen = function (event) {
                        console.log("Web Socket opened!" + this.readyState);
                    };
                    socket.onclose = function (event) {
                        console.log("Web Socket closed.");
                    };
                    socket.onerror = function (event) {
                        console.log("Web Socket error.");
                    };
                } catch (ex) {
                    console.log(ex.message);
                }
            } else {
                console.log("Your browser does not support Web Socket.");
            }
        }

        $scope.fn.readIdCard = function () {
            try {
                socket.onmessage = function (event) {
                    //alert(event.data)
                    var idCardData = JSON.parse(event.data);
                    if (idCardData.status == 0) {
                        $scope.$apply(function () {
                            $scope.signInfo.SignatureUserName = idCardData.name;
                            $scope.signInfo.SignatureUserIDNumber = idCardData.number;
                        })
                    } else if (idCardData.status == 1) {
                        layer.msg("读卡器端口初始化失败", { icon: 2, shade: 0.5 });

                    } else {
                        console.log("status:" + idCardData.status);
                    }

                };
                socket.onerror = function () {
                    layer.msg("读取身份证失败", { icon: 2, shade: 0.5 });
                }
                socket.send("ReadCardInfo");
            }
            catch (ex) {
                layer.msg("读取身份证失败，" + ex.message, { icon: 2, shade: 0.5 });
            }
        };

        $scope.fn.readMemberIdCard = function () {
            try {
                socket.onmessage = function (event) {
                    var idCardData = JSON.parse(event.data);
                    if (idCardData.status == 0) {
                        $scope.$apply(function () {
                            $scope.signInfo.Members.push({
                                MemberName: idCardData.name,
                                IDNumber: idCardData.number,
                                Relation: 6
                            });
                        })
                    } else if (idCardData.status == 1) {
                        layer.msg("读卡器端口初始化失败", { icon: 2, shade: 0.5 });
                    } else {
                        console.log("status:" + idCardData.status);
                    }

                };
                socket.send("ReadCardInfo");
            } catch (ex) {
                alert(ex.message);
            }
        };
        $scope.fn.init();

        initWebSocket();
    }])

})