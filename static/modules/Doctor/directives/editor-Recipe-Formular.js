define(["angular", "plugins-layer", "jquery-validate", "module-services-api", "module-Doctor-filter-all"], function (angular, layer) {

    var app = angular.module("myApp", []);
    app.directive("editorRecipeFormular", [
        "$translate",
        "$q",
        "sysDrugsServices",
        'doctorRecipeFormulaFilesServices', function ($translate, $q, sysDrugsServices, doctorRecipeFormulaFilesServices) {
        return {
            restrict: 'EA',
            scope: {
                id: "=id",
                callback: "=callback"
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/editor-Recipe-Formular.html';
            },
            controller: ["$scope", function ($scope) {                

                
            }],
            link: function ($scope, $element, attr) {
                /***********************************************************/
                
                //剂量 单位 (西药)
                $scope.doseUnitEN = ["片", "粒", "袋", "ml", "g", "丸", "支", "瓶", "盒", "mg", "克", "包", "kg",
                    "合", "贴", "罐", "条", "台", "个", "滴", "喷", "IU", "卷", "只", "套", "提", "枚", "扎", "小盒", "板", "对",
                    "付", "根", "块", "斤", "小丸", "小包", "小袋", "排", "塑瓶"];

                //剂量 单位 (中药)
                $scope.doseUnitCN = ["g", "克", "片", "瓶", "kg", "粒", "袋", "包", "条", "支", "盒", "个", "根",
                    "对", "10G", "丸", "扎"];

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
                    { shade: '皮下注射' },
                    { shade: '吸氧' },
                    { shade: '吸痰' },
                    { shade: '雾化吸入' },
                    { shade: '涂口腔' },
                    { shade: '塞肛' },
                    { shade: '阴道给药' },
                    { shade: '洗口腔' }
                ];

                //处方类型
                $scope.EnumRecipeType = { 中药处方: "1", 西药处方: "2" }

                //处方                       
                $scope.RecipeFile = null;

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

                //获取药品
                $scope.getDrugDetails = function (val, Type) {
                    if ($scope.GetStringLength($.trim(val)) > 1) {
                        var deferred = $q.defer();//声明承诺                                   
                        sysDrugsServices.get({
                            Keyword: val,
                            DrugType: Type
                        }, function (response) {

                            response.Data.map(function (item) {
                                return item;
                            });


                            deferred.resolve(response.Data);//请求成功

                        }, function () {

                            deferred.reject([]); //请求失败
                        })

                        return deferred.promise;
                    }
                };

                //添加药品
                $scope.onAddDrugDetail = function () {
                  
                    $scope.RecipeFile.Details.push({
                        "Dose": 1,
                        "Quantity": 1,//数量
                        "DrugRouteName": "",//用药途径
                        "Frequency": "",//频率
                        Drug: {
                            "DrugID": 0,//药品ID
                            "DrugCode": "",//药品编号
                            "DrugName": "",//药品名称
                            "Specification": "",
                            "DoseUnit": "",//剂量单位
                            "Unit": "",//单位
                            "UnitPrice": "",//单价
                            "TotalDose": ""
                        }

                    });
                }

                //删除药品
                $scope.onRemoveDrugDetail = function (item) {

                    //询问框
                    var dialog = layer.confirm('确认删除吗？', {
                        btn: ['确认', '取消']
                    }, function () {

                        var index = $scope.RecipeFile.Details.indexOf(item);
                        $scope.RecipeFile.Details.splice(index, 1);
                        $scope.$apply();
                        layer.close(dialog);


                    }, function () {
                    });


                }

                //自动完成选择项目
                $scope.onDrugSelect = function ($item, $model, $label) {

                    //计费数量
                    $item.Quantity = 1;
                    //剂量
                    $item.Dose = $item.Quantity * $item.TotalDose;
                }

                //高亮某个元素
                $scope.LightHeightElement = function ($element) {
                    //如果没有添加药品，高亮要添加列表3秒钟
                    var interval_LightHeightRecipDrugList = setInterval(function () {
                        $element.toggleClass("alert alert-danger");
                    }, 250);

                    setTimeout(function () {
                        clearInterval(interval_LightHeightRecipDrugList);
                        $element.removeClass("alert alert-danger");
                    }, 2000);
                }

                //保存信息
                $scope.onSubmitRecipeFormular = function () {
                    
                    //获取当前药品数量
                    var drugCount = $scope.RecipeFile.Details && $scope.RecipeFile.Details.length;

                    //删除空的药品
                    $scope.RecipeFile.Details = $scope.RecipeFile.Details && $scope.RecipeFile.Details.filter(function (drugItem) {

                        if (drugItem.Drug && drugItem.Drug.DrugCode)
                            return true;
                    });

                    //删除了药品那么取消保存
                    if ($scope.RecipeFile.Details && drugCount != $scope.RecipeFile.Details.length) {
                        $scope.$apply();
                        return;
                    }

                    //没有设置药品或诊断
                    if (!$scope.RecipeFile.Details || $scope.RecipeFile.Details.length <= 0) {

                        layer.msg("请添加药品");
                        $scope.LightHeightElement($(".recipeDrugList"));
                        $scope.$apply();
                        return;
                    }

                    //显示加载中遮罩层
                    var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2
                    $scope.submiting = true;

                    if ($scope.id && $scope.id != "") {
                        doctorRecipeFormulaFilesServices.update($scope.RecipeFile, function (response) {

                            //关闭加载遮罩层
                            layer.close(loading)
                            $scope.submiting = false;

                            if (response.Data) {
                                layer.msg($translate.instant('msgSaveSuccess'));
                                
                                if ($scope.callback.actionSuccessCallback != null)
                                    $scope.callback.actionSuccessCallback();
                            }
                            else {
                                layer.msg(response.data.Message, { icon: 2, shade: 0.5 });
                            }

                        }, function (response) {
                            //关闭加载遮罩层
                            layer.close(loading)
                            $scope.submiting = false;
                            layer.msg(response.data.Message, { icon: 2, shade: 0.5 });

                        });
                    }
                    else {
                        doctorRecipeFormulaFilesServices.add($scope.RecipeFile, function (response) {
                            //关闭加载遮罩层
                            layer.close(loading)
                            $scope.submiting = false;

                            if (response.Data) {
                                layer.msg($translate.instant('msgSaveSuccess'));

                                if ($scope.callback.actionSuccessCallback != null)
                                    $scope.callback.actionSuccessCallback();
                            }
                            else {
                                layer.msg(response.data.Message, { icon: 2, shade: 0.5 });
                            }

                        }, function (response) {
                            //关闭加载遮罩层
                            layer.close(loading)
                            $scope.submiting = false;
                            layer.msg(response.data.Message, { icon: 2, shade: 0.5 });
                        });
                    }
                }

                $scope.resetRecipeFile = function () {
                    $scope.RecipeFile = {
                        "RecipeFormulaName": "中药处方",
                        "RecipeType": 1,
                        "Details": []
                    };
                }

                $scope.$watchGroup(['id'], function (n, o, scope) {
                   

                    if (scope.id == null || scope.id == "") {
                        return;
                    }

                    //显示加载中遮罩层
                    var loading = layer.load(0, { shade: [0.3, '#000'] }); //0代表加载的风格，支持0-2
                    //获取处方
                    doctorRecipeFormulaFilesServices.promise.get({ ID: scope.id }).then(function (response) {
                        //关闭加载遮罩层
                        layer.close(loading)

                        if (response.Status != 0) {
                            layer.msg(response.data.Message, { icon: 2, shade: 0.5 });
                            return;
                        }

                        $scope.RecipeFile = response.Data;                        

                    })["catch"]( function (response) {
                        layer.msg(response.data.Message, { icon: 2, shade: 0.5 });

                        //关闭加载遮罩层
                        layer.close(loading)

                    });
                });

                $scope.resetRecipeFile();
                $scope.callback.submitCallback = $scope.onSubmitRecipeFormular;
                $scope.callback.resetCallback = $scope.resetRecipeFile;
            }
        };
    }]);
});