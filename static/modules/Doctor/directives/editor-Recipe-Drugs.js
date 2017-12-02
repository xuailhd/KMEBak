define(["angular"], function (angular) {

    console.log("load editor-Recipe-Drugs.js")

    var app = angular.module("myApp", []);

    /*处方药品*/
    app.directive('editorRecipeDrugs', ["$sce", '$translate', "$rootScope", "$filter", "$q", "sysDrugsServices", "sysICDsServices", function ($sce, $translate, $rootScope, $filter, $q, sysDrugsServices, sysICDsServices) {

        return {
            restrict: 'EAC',
            scope: {
                recipe: "=recipe"
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/editor-Recipe-Drugs.html';
            },
            link: function ($scope, $element, attr) {
                //剂量 单位 (西药)
                $scope.ENUM_doseUnitEN = ["片", "粒", "袋", "ml", "g", "mg", "ug", "丸", "支", "瓶", "盒", "克", "包", "kg",
                    "合", "贴", "罐", "条", "台", "个", "滴", "喷", "IU", "卷", "只", "套", "提", "枚", "扎", "喷", "小盒", "板", "对",
                    "付", "根", "块", "斤", "小丸", "小包", "小袋", "排", "塑瓶"];                

                //剂量 单位 (中药)
                $scope.ENUM_doseUnitCN = ["g", "克", "片", "瓶", "kg", "粒", "袋", "包", "条", "支", "盒", "个", "根","对", "10G", "丸", "扎"];

                //中药，制法枚举
                $scope.ENUM_BoilWay = [
                    { shade: 1, name: '水煎' }
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
                 { shade: 2335008, name: '炒制' },
                { shade: 2335009, name: '打碎先煎' },
                { shade: 2335010, name: '打碎后下' },
                 { shade: 2335011, name: '打碎冲服' },
                ];

                //中药，用法枚举
                $scope.ENUM_Usage = [
                    { shade: "外用" },
                    { shade: "内用" }];

                //西药，频率枚举
                $scope.ENUM_drugFrequency = [
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

                //西药，用药途径 枚举
                $scope.ENUM_drugRoteItems = [
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
                        { shade: '皮下注射' },
                        { shade: '吸氧' },
                        { shade: '吸痰' },
                        { shade: '雾化吸入' },
                        { shade: '涂口腔' },
                        { shade: '塞肛' },
                         { shade: '阴道给药' },
                        { shade: '洗口腔' }
                ];

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


                //剂数
                $.validator.addMethod("tcmQuantity", function (value, element) {
                    if (value == "1" && $scope.recipe.TCMQuantity < 3) {
                        return false;
                    }
                    return true;
                });

                $scope.onTCMQuantityChange = function () {
                    $scope.recipe.Replace == '0' ? ($scope.recipe.ReplaceDose = 0) : ($scope.recipe.ReplaceDose = $scope.recipe.TCMQuantity);
                    $('#Recipe_Replace').valid();
                }

                //#region 处方药品

                //添加药品
                $scope.onAddDrugDetail = function (recipe) {
                    console.log("Replace:" + recipe.Replace);
                    recipe.Details.push({
                        "Dose": 1,//剂量
                        "Quantity": 1,//数量
                        "DrugRouteName": "",//用药途径
                        "Frequence": "",//用药频率
                        "Drug": {
                            "DrugID": "",//药品ID
                            "DrugCode": "",//药品编号
                            "DrugName": "",//药品名称
                            "Specification": "",//药品规格
                            "DoseUnit": "",//药品剂量单位
                            "UnitPrice": "",//药品单价
                            "TotalDose": 0,//药品剂量
                            "Unit": ""//单位                                                    
                        }

                    });
                }

                //删除药品
                $scope.onRemoveDrugDetail = function (item, recipe) {

                    //询问框
                    var dialog = layer.confirm('确认删除吗？', {
                        btn: ['确认', '取消']
                    }, function () {
                        var index = recipe.Details.indexOf(item);
                        recipe.Details.splice(index, 1);

                        layer.close(dialog);
                        $scope.$apply();

                    }, function () {
                    });


                }

                //获取药品
                $scope.getDrugDetails = function (val, DrugType, DrugstoreID) {

                
                    if ($scope.GetStringLength($.trim(val)) > 1) {
                        var deferred = $q.defer();//声明承诺

                        var postData = {
                            PageSize: 200,
                            CurrentPage: 1
                        };

                        if (DrugstoreID) {
                            postData = {
                                PageSize: 200,
                                CurrentPage: 1,
                                Keyword: val,
                                DrugType: DrugType,//药品类型                             
                                PharmacyID: DrugstoreID || "" //药房编号
                            }
                        }
                        else
                        {
                            postData = {
                                PageSize: 200,
                                CurrentPage: 1,
                                Keyword: val,
                                DrugType: DrugType//药品类型                           
                            };
                        }
                        
                        sysDrugsServices.get(postData, function (response) {

                            response.Data=response.Data.filter(function (item) {

                               //已经在处方中的药品，不显示
                                if ($scope.recipe.Details.filter(function (recipeDrug) {
                                    return recipeDrug.Drug && recipeDrug.Drug.DrugID == item.DrugID;

                                }).length > 0) {
                                    return false;
                                }
                                else
                                {
                                    return true;
                                }
                            });


                            deferred.resolve(response.Data);//请求成功

                        }, function () {

                            deferred.reject([]); //请求失败
                        })

                        return deferred.promise;
                    }
                };

                //自动完成下拉框中选择一条药品
                $scope.onDrugSelect = function ($item, $model, $label) {


                    //计费数量
                    $item.Quantity = 1;
                    //剂量
                    $item.Dose = $item.Quantity * $item.TotalDose;

                }

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

                //#endregion
            }
        };

    }]);
});