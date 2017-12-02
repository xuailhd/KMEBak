"use strict";
define(["module-services-apiUtil", "module-services-apiUtilMP"], function (apiUtil,apiUtilMP) {

    var app = angular.module("myApp", [
    "pascalprecht.translate",
    'ui.router',
    "ui.bootstrap",
    "ngAnimate"]);

    app.controller('DetailController', [
        '$scope',
        '$http',
        "$q",
        '$location',
        '$state',
        '$translate',
        "sysICDsServices",
        "sysDrugsServices",
        'userMembersServices',
        function ($scope, $http, $q, $location, $state, $translate, sysICDsServices,
            sysDrugsServices, userMembersServices) {

            var EnumOpType = {
                "N0": "新增",
                "N1": "保存",
                "N2": "提交",
                "N3": "提交签名",
                "N4": "开处方",
                "N5": "驳回",
            };

            var EnumGender = {
                "N0": "男",
                "N1": "女",
                "N2": "其他",
            };

            $scope.RecipeFileID = $state.params.id;
            $scope.orgID = $state.params.OrgID;
            $scope.orgName = $state.params.OrgName;
            $("#drugstoreNametitle").html($scope.orgName);

            //中药，制法枚举
            $scope.ENUM_BoilWay = [
                { shade: 1, name: '水煎' },
                { shade: 2, name: '研粉末冲服' },
                { shade: 3, name: '制作成药丸服用' }
            ];

            //中药，药品脚注
            $scope.ENUM_FootNote = [
                { shade: 2335001, name: '先煎' },
                { shade: 2335002, name: '后下' },
                { shade: 2335003, name: '包煎' },
                { shade: 2335004, name: '另煎' },
                { shade: 2335005, name: '冲服' },
                { shade: 2335006, name: '烊化' },
                { shade: 2335007, name: '打碎' },
                { shade: 2335008, name: '炒制' }
            ];

            //中药，用法枚举
            $scope.ENUM_Usage = [
                { shade: "外用" },
                { shade: "内用" }];

            //药品（频率）
            $scope.drugFrequency = [
            { shade: 'QD', name: 'QD 每日一次' },
            { shade: 'BID', name: 'BID 每日两次' },
            { shade: 'TID', name: 'TID 每日三次' },
            { shade: 'QID', name: 'QID 每日四次' },
            { shade: 'ST.', name: 'ST. 立即' },
            { shade: '连续', name: '连续' },
            { shade: 'HS', name: 'HS 睡前' },
            { shade: 'SOS', name: 'SOS 需要时' },
            { shade: 'PRN', name: 'PRN 必要时' },
            { shade: 'Q1/2H', name: 'Q1/2H 半小时一次' },
            { shade: 'Qn', name: 'Qn 每小时一次' },
            { shade: 'Q2H', name: 'Q2H 2小时一次' },
            { shade: 'Q3H', name: 'Q3H 3小时一次' },
            { shade: 'Q4h', name: 'Q4h 4小时一次' },
            { shade: 'Q6h', name: 'Q6h 6小时一次' },
            { shade: 'Q8h', name: 'Q8h 8小时一次' },
            { shade: 'Q12h', name: 'Q12h 12小时一次' },
            { shade: 'QM', name: 'QM 早晨一次' },
            { shade: 'QN', name: 'QN 晚上一次' },
            { shade: 'QW', name: 'QW 每周一次' },
            { shade: 'BIW', name: 'BIW 每周二次' },
            { shade: 'QOD', name: 'QOD 隔日一次' },
            { shade: 'Q3D', name: 'Q3D 3天一次' },
            { shade: 'Q4D', name: 'Q4D 4天一次' },
            { shade: 'Q5D', name: 'Q5D 5天一次' }
            ];
            //药品（用药途径）
            $scope.drugRoteItems = [
                    { shade: '口服' },
                    { shade: '含服' },
                    { shade: '煎服' },
                    { shade: '外用加棉签' },
                    { shade: '舌下含服' },
                    { shade: '眼用' },
                    { shade: '滴耳' },
                    { shade: '吸入' },
                    { shade: '滴鼻' },
                    { shade: '含漱' },
                    { shade: '外用' },
                    { shade: '喷喉' },
                    { shade: '喷鼻' },
                    { shade: '吸氧' },
                    { shade: '吸痰' },
                    { shade: '雾化吸入' },
                    { shade: '涂口腔' },
                    { shade: '塞肛' },
                    { shade: '阴道给药' },
                    { shade: '洗口腔' }
            ];

            /*************************以下是和服务端交互的数据*****************/
            //处方
            $scope.RecipeFile = {};
                    
            $scope.onLoad = function () {
                var loading = layer.load(0, { shade: [0.1, '#000'] });
                //获取会员处方
                if ($scope.RecipeFileID.length > 0) {
                    var data = {
                        RecipeFileID: $scope.RecipeFileID,
                        OrgID: $scope.orgID
                    };
                    apiUtilMP.requestWebApi('RecipeForDoctor/GetRecipe', 'Post', data, function (obj) {

                        obj.Data.GenderName = EnumGender["N" + obj.Data.PatientGender];
                        if (obj.Data.DrugSellDate) {
                            var drugSellDate = new Date(obj.Data.DrugSellDate);
                            obj.Data.DrugSellDate = drugSellDate.format("yyyy-MM-dd");
                        }
                        //处方
                        $scope.RecipeFile = obj.Data;
                        if ($scope.RecipeFile.RecipeVerfifyLogs != null) {
                            $.each($scope.RecipeFile.RecipeVerfifyLogs, function (i, d) {
                                var curDate = new Date(d.OpTime);
                                d.OpTime = curDate.format("yyyy-MM-dd hh:mm");
                                if (d.Remark && d.Remark != null) {
                                    d.Remarks = d.Remark.split('\n');
                                }
                            });
                        }
                        $scope.$apply();
                        layer.close(loading)
                    }, function () {
                        layer.close(loading)
                        layer.msg("加载会员处方失败")

                    });
                }
            }

            $scope.onLoad();
        /***********************************************************/

                   

            //格式化药品的显示
            $scope.formatDrugItem = function (item) {
                if (item == undefined) {
                    return " ";
                }
                else {
                    if ($scope.flag) {
                        $scope.flag = false;
                        return item.DrugName;
                    }
                    else {
                        if (item.ID == -1) {
                            return item.DrugName;
                        }
                        else {
                            if (item.FactoryName == undefined) {
                                return item.DrugName;
                            }
                            else {
                                return item.DrugName + " (" + item.Specification.trim() + "/" + item.Unit + ") (" + item.FactoryName + ")";
                            }
                        }
                    }
                }
            }

            /**************************处方药品*****************************************/

            //获取字符串长度
            $scope.GetStringLength = function (str) {
                var realLength = 0;
                var charCode = '';

                for (var i = 0; i < str.length; i++) {
                    charCode = str.charCodeAt(i);
                    if (charCode >= 0 && charCode <= 128)
                        realLength += 1;
                    else
                        realLength += 2;
                }
                return realLength;
            }
                   
            $scope.GoBack = function () {
                history.back();
            };

            $scope.onPreview = function () {

                //查看审方平台处方
                layer.open({
                    type: 2,
                    area: ['700px', '530px'],
                    fix: false, //不固定
                    maxmin: true,
                    content: "/SRMPRecipe?recipeid=" + $scope.RecipeFileID + "&orgId=" + $scope.orgID,
                });
            }
        }
    ]);

    app.filter('boilWay', function () {
        return function (val) {
            var newVal = '';
            switch (val) {
                case 1:
                    newVal = '水煎';
                    break;
                case 2:
                    newVal = '研粉末冲服';
                    break;
                case 3:
                    newVal = '制作成药丸服用';
                    break;
            }
            return newVal;
        }
    })

    app.filter('frequency', function () {
        return function (val) {
            var newVal = '';
            switch (val) {
                case 'QD':
                    newVal = 'QD 每日一次';
                    break;
                case 'BID':
                    newVal = 'BID 每日两次';
                    break;
                case 'TID':
                    newVal = 'TID 每日三次';
                    break;
                case 'QID':
                    newVal = 'QID 每日四次';
                    break;
                case 'ST.':
                    newVal = 'ST. 立即';
                    break;
                case '连续':
                    newVal = '连续';
                    break;
                case 'HS':
                    newVal = 'HS 睡前';
                    break;
                case 'SOS':
                    newVal = 'SOS 需要时';
                    break;
                case 'PRN':
                    newVal = 'PRN 必要时';
                    break;
                case 'Q1/2H':
                    newVal = 'Q1/2H 半小时一次';
                    break;
                case 'Qn':
                    newVal = 'Qn 每小时一次';
                    break;
                case 'Q2H':
                    newVal = 'Q2H 2小时一次';
                    break;
                case 'Q3H':
                    newVal = 'Q3H 3小时一次';
                    break;
                case 'Q4h':
                    newVal = 'Q4h 4小时一次';
                    break;
                case 'Q6h':
                    newVal = 'Q6h 6小时一次';
                    break;
                case 'Q8h':
                    newVal = 'Q8h 8小时一次';
                    break;
                case 'Q12h':
                    newVal = 'Q12h 12小时一次';
                    break;
                case 'QM':
                    newVal = 'QM 早晨一次';
                    break;
                case 'QN':
                    newVal = 'QN 晚上一次';
                    break;
                case 'QW':
                    newVal = 'QW 每周一次';
                    break;
                case 'BIW':
                    newVal = 'BIW 每周二次';
                    break;
                case 'QOD':
                    newVal = 'QOD 隔日一次';
                    break;
                case 'Q3D':
                    newVal = 'Q3D 3天一次';
                    break;
                case 'Q4D':
                    newVal = 'Q4D 4天一次';
                    break;
                case 'Q5D':
                    newVal = 'Q5D 5天一次';
                    break;
            }
            return newVal;
        }
    })
});