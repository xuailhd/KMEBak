define(["module-services-api", "module-services-eventBus", "angular", "module-directive-editor-Recipe-Formular"], function (apiUtil, eventBus) {

    console.log("load chat-detail-recipe.js");
    var app = angular.module("myApp", []);
    app.directive("chatRecipe", [
        "$q",
        "$translate",
        "$rootScope",
        "doctorDiagnosisServices",
        "doctorRecipeFormulaFilesServices",
        "ordersServices",
        "webapiServices",
        "doctorPatientsServices",
        "doctorapiServices",
        function (
            $q,
            $translate,
            $rootScope,
            doctorDiagnosisServices,
            doctorRecipeFormulaFilesServices,
            ordersServices,
            webapiServices,
            doctorPatientsServices, doctorapiServices) {
        return {
            restrict: 'EA',
            scope: {
                room: '=room',
                roomType: "=roomType"
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/chat-detail-Recipe.html';
            },
            controller: ["$scope", function ($scope) {

            }],
            link: function ($scope, $element, attr) {
                var EnumRecipeType = { 中药处方: 1, 西药处方: 2 }                
                
                $scope.roomType = attr.roomType;
             
                $rootScope.RecipeFiles = $rootScope.RecipeFiles || [];

                //默认处方
                $scope.RecipeFilesByDoctorID = [];

                $scope.OPDRegisterID = $scope.room.ServiceID;
                // 设置为常用处方标记
                $scope.setCommonRecipe = false;

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

                //#region  处方管理
                //添加处方 
                $scope.onAddRecipeFile = function (RecipeType, RecipeName) {
                    var drugstoreID = $rootScope.OrgnazitionID;

                    var confirm = layer.prompt({
                        title: '请输入处方名称，并确认',
                        formType: 0,
                        value: RecipeName

                    }, function (text, index) {
                        var recipe = {
                            "Details": [{}],
                            "RecipeName": text,
                            "Usage": "",
                            "TCMQuantity": 1,
                            "ReplaceDose": 0,//代煎剂数
                            "ReplacePrice": 2.5,//待煎价格
                            "BoilWay": "",
                            "Remark": "",
                            "DecoctNum": 1,//几煎
                            "DecoctTotalWater": 500,//煎前水量
                            "DecoctTargetWater": 300,//煎后水量
                            "FreqDay": 1,
                            "FreqTimes": 1,
                            "Times": 1,
                            "DrugstoreID": drugstoreID || "",
                            "RecipeType": RecipeType,//处方类型
                            "DiagnoseList": [{
                                "Detail": {
                                    "ID": 0, "DiseaseCode": "", "DiseaseName": ""
                                }, "Description": ""
                            }],
                            "RecipeFileStatus": 0,
                            "Replace": "0",
                        };
                        $rootScope.RecipeFiles.push(recipe);
                        $scope.onEditRecipeFile(recipe)
                        $scope.$apply();

                        layer.close(confirm);
                    });
                }

                //删除处方
                $scope.onRemoveRecipeFile = function (item) {

                    //询问框
                    var dialog = layer.confirm('确认删除吗？', { btn: ['确认', '取消'] }, function () {
                        layer.close(dialog);

                        if (!item.RecipeNo) {
                            var index = $rootScope.RecipeFiles.indexOf(item);
                            $rootScope.RecipeFiles.splice(index, 1);

                            //选中第一个处方
                            if ($rootScope.RecipeFiles.length > 0) {
                                $rootScope.RecipeFiles[0].current = true;
                            }
                            $scope.$apply();

                        }
                        else {
                            var loading = layer.load(0, { shade: [0.1, '#000'] });

                            //删除处方
                            doctorPatientsServices.deletePatientRecipe({ RecipeNo: item.RecipeNo }, function (response) {

                                //删除成功
                                if (response.Data) {

                                    layer.close(loading);

                                    layer.msg($translate.instant('msgDeleteSuccess'));

                                    $scope.onRefreshRecipeFiles();

                                }
                                else {
                                    layer.close(loading);

                                    layer.msg($translate.instant('msgDeleteFail'), { icon: 2, shade: 0.5 });
                                }

                            }, function (resp) {
                                layer.close(loading);
                                layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                                //layer.msg($translate.instant('msgDeleteFail'), { icon: 2, shade: 0.5 });
                            })

                        }

                    }, function () {

                    });
                }

                //选中处方文件
                $scope.onEditRecipeFile = function (item) {
                    var drugstoreID = $rootScope.OrgnazitionID;
                    item.DrugstoreID = drugstoreID;

                    $scope.setCommonRecipe = false;
                    $scope.EditRecipeFile = item;                    

                    //根据待煎的数量，设置是否需要待煎
                    if ($scope.EditRecipeFile.ReplaceDose > 0) {
                        $scope.EditRecipeFile.Replace = '1'
                    }
                    else {
                        $scope.EditRecipeFile.Replace = '0'
                    }

                    $("#dialog-EditorRecipeFile").modal("show");
                }

                //保存处方
                $scope.onSaveRecipeFile = function (item) {
                    //删除空的诊断
                    item.DiagnoseList = item.DiagnoseList && item.DiagnoseList.filter(function (diagnoseItem) {

                        if (diagnoseItem.Detail && diagnoseItem.Detail.DiseaseName)
                            return true;
                    });

                    //删除空的药品
                    item.Details = item.Details && item.Details.filter(function (drugItem) {

                        if (drugItem.Drug && drugItem.Drug.DrugCode)
                            return true;
                    });

                    if (!item.DiagnoseList || item.DiagnoseList.length <= 0) {


                        //如果没有添加药品，高亮要添加列表3秒钟
                        $scope.LightHeightElement($(".recipeDiagnoseList"));


                        layer.msg("请添加诊断")
                        return;
                    }

                    //没有设置药品或诊断
                    if (!item.Details || item.Details.length <= 0) {

                        layer.msg("请添加药品");

                        $scope.LightHeightElement($(".recipeDrugList"));

                        return;
                    }

                    var loading = layer.load(0, { shade: [0.1, '#000'] });

                    item.OPDRegisterID = $scope.OPDRegisterID;
          
                    //保存处方
                    doctorPatientsServices.promise.savePatientRecipe(item).then(function (response) {
                      
                        layer.close(loading);
                        if (response.Data) {
                            
                            $("#dialog-EditorRecipeFile").modal("hide");                            

                            // 设置常用处方
                            if (!$scope.setCommonRecipe) {
                                layer.msg($translate.instant('msgSaveSuccess'));
                                $scope.onRefreshRecipeFiles();
                                return $q.reject();
                            }

                            return $q(function (resolve, reject) {
                                layer.prompt({ title: "填写常用处方名称", formType: 0 }, function (text, index) {
                                    layer.close(index);
                                    resolve(text);
                                });
                            });
                            
                        }
                        else {
                            layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                            return $q.reject();
                        }
                    }).then(function(name){
                        // 添加常用处方
                        loading = layer.load(0, { shade: [0.1, '#000'] });
                        item.RecipeFormulaName = name;
                        return doctorRecipeFormulaFilesServices.promise.add({ RecipeFormulaName: name, RecipeType: item.RecipeType, Details: item.Details });
                    }).then(function (response) {
                        layer.close(loading);
                        if (response.Data) {
                            layer.msg($translate.instant('msgSaveSuccess'));
                        }
                        else {
                            layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                        }
                        $scope.onRefreshRecipeFiles();
                    })["catch"](function (response) {
                        if (response != undefined) {
                            layer.close(loading);
                            layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                        }
                    });
                }

                //预览处方
                $scope.onPreviewRecipeFile = function (recipe) {

                    var loading = layer.load(0, { shade: [0.1, '#000'] });

                    //保存病历
                    doctorDiagnosisServices.preview({
                        OPDRegisterID: $scope.OPDRegisterID,
                        RecipeList: [recipe]
                    }, function (response) {
                        layer.close(loading);
                        if (response.Data) {
                          
                            layer.open({
                                type: 2,
                                area: ['700px', '530px'],
                                fix: false, //不固定
                                maxmin: true,
                                title: "预览",
                                content: response.Data
                            });

                        }
                        else {
                            layer.msg('处方无法预览', { icon: 2, shade: 0.5 });

                        }

                    }, function () {
                        layer.close(loading);
                        layer.msg('处方无法预览', { icon: 2, shade: 0.5 });
                    });
                }

                //刷新处方列表
                $scope.onRefreshRecipeFiles = function () {
                    var loading = layer.load(0, { shade: [0.1, '#000'] });

                    //获取诊断结果、处方集
                    doctorDiagnosisServices.get({
                        OPDRegisterID: $scope.OPDRegisterID
                    }, function (obj) {
                        //机构编号
                        $rootScope.OrgnazitionID = obj.Data.OrgnazitionID;
                        //处方
                        $rootScope.RecipeFiles = obj.Data.RecipeList;

                        var recipes = $rootScope.RecipeFiles.filter(function (item) {
                            return item.RecipeFileStatus == 2;
                        });

                        if (recipes.length >= 3) {
                            eventBus.dispatch("room-session-changed", {});
                        }

                        layer.close(loading)

                    }, function () {
                        layer.close(loading);
                    });
                }

                //退费
                $scope.onRefundRecipe = function (item) {
                    var confirm = layer.prompt({ title: '请输入退款原因，并确认', formType: 2 }, function (text, index) {
                        layer.close(confirm);

                        var loading = layer.load(0, { shade: [0.1, '#000'] });

                        //发送退款申请
                        doctorPatientsServices.refundPatientRecipe({
                            OPDRegisterID: item.OPDRegisterID,
                            BillInNo: item.BillIn.BillInNo,
                            Reason: text
                        }, function (resp) {

                            layer.close(loading)
                            layer.msg($translate.instant("Room-lblSuccess"))
                            $scope.onRefreshRecipeFiles();

                        }, function (resp) {
                            layer.close(loading)
                            layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                            //layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                            $scope.onRefreshRecipeFiles();

                        });
                    });
                }

                //收费
                $scope.onChargeRecipe = function (item) {

                    //询问框
                    var dialog = layer.confirm('确认提交收费？提交后不允许再修改', { btn: ['确认', '取消'] }, function () {

                        var loading = layer.load(0, { shade: [0.1, '#000'] });

                        //开始收费
                        doctorPatientsServices.chargePatientRecipe({
                            OPDRegisterID: item.OPDRegisterID,
                            RecipeNo: item.RecipeNo
                        }, function (resp) {

                            layer.close(loading)
                            layer.msg($translate.instant("Room-lblSuccess"))
                            $scope.onRefreshRecipeFiles();

                        }, function (resp) {

                            layer.close(loading)
                            layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                            //layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                            $scope.onRefreshRecipeFiles();

                        })

                    }, function () {

                    });
                }

                //提交签名
                $scope.onSignRecipe = function (item) {
                    //询问框
                    var dialog = layer.confirm('确认提交签名？提交后不允许再修改', { btn: ['确认', '取消'] }, function () {
                        var loading = layer.load(0, { shade: [0.1, '#000'] });

                        //处方签名
                        webapiServices.recipeSyn({
                            recipeId: item.RecipeFileID,
                            signType: 0
                        }, function (resp) {
                            layer.close(loading)
                            layer.msg($translate.instant("Room-lblSuccess"))
                            $scope.onRefreshRecipeFiles();
                        },
                            function (resp) {

                                layer.close(loading)
                                layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                                $scope.onRefreshRecipeFiles();
                                //layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                            });

                    }, function () {

                    });

                };
                $scope.onRetractRecipe = function (item) {
                    debugger;
                    //询问框
                    var dialog = layer.confirm('确认撤回签名？', { btn: ['确认', '取消'] }, function () {
                        var loading = layer.load(0, { shade: [0.1, '#000'] });

                        var ids = [];
                        ids.push(item.RecipeFileID);
                        //处方签名
                        doctorapiServices.retractRecipe(ids, function (resp) {
                            layer.close(loading)
                            if (resp.Status == 0)
                            {
                                layer.msg($translate.instant("Room-lblSuccess"))
                            }
                            $scope.onRefreshRecipeFiles();
                        },
                            function (resp) {

                                layer.close(loading)
                                layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                                $scope.onRefreshRecipeFiles();
                                //layer.msg($translate.instant("Room-lblFail"), { icon: 2, shade: 0.5 })
                            });

                    }, function () {

                    });

                };

                //刷新物流信息
                $scope.onRefreshLogisticInfo = function (item) {

                    var loading = layer.load(0, { shade: [0.1, '#000'] });

                    ordersServices.LogisticWithDelivery({ OrderNo: item.Order.OrderNo }, function () {

                        layer.msg($translate.instant("Room-lblSuccess"))
                        layer.close(loading)

                        $scope.onRefreshRecipeFiles();

                    }, function () {
                        layer.msg(resp.Msg, { icon: 2, shade: 0.5 })
                        layer.close(loading)
                    })
                }

                $scope.onViewLogisticInfo = function (item) {
                    $scope.ViewLogisticInfo = item;
                    $("#dialog-ViewLogisticInfo").modal("show");
                }

                //#endregion

                //#region 处方集

                $scope.pageSize = 5;
                $scope.page = 1;
                $scope.Keyword = "";
                $scope.totalCount = 0;
                $scope.recipeFormularID = null;
                $scope.recipeFormularCallback = {
                    submitCallback: null,
                    actionSuccessCallback: null,
                    resetCallback: null
                }                

                //处方集弹出窗口弹出时执行的方法
                $('#dialog-RecipeFiles').on('shown.bs.modal', function (e) {

                    $scope.onGetRecipeFiles();
                })

                //获取处方集
                $scope.onGetRecipeFiles = function () {

                    doctorRecipeFormulaFilesServices.get({
                        Keyword: $scope.Keyword,
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.page
                    }, function (obj) {
                        $scope.RecipeFilesByDoctorID = obj.Data;
                        $scope.totalCount = obj.Total || 0;
                    });
                }

                //复制处方
                $scope.onCopyRecipeFiles = function (RecipeFile) {

                    if (!$rootScope.RecipeFiles.contains(RecipeFile)) {
                        doctorRecipeFormulaFilesServices.get({ ID: RecipeFile.RecipeFormulaFileID }, function (obj) {
                            var file = obj.Data;

                            //剂数
                            file.ReplacePrice = 2.5;//代煎价格
                            file.ReplaceDose = file.RecipeType == 1 ? 1 : 0;//代煎剂数, 中药默认为1，西药默认为0
                            file.TCMQuantity = 1;
                            file.FreqDay = 1;
                            file.FreqTimes = 1;
                            file.Times = 1;//分几次服用
                            file.Usage = "内用";
                            file.BoilWay = 1;//中药制法
                            file.DecoctNum = 1;//几煎
                            file.DecoctTargetWater = 1;//煎药后水量
                            file.DecoctTotalWater = 1;//煎药前水量
                            file.FreqTimes = 1;//每日几剂频率
                            file.RecipeName = RecipeFile.RecipeFormulaName;
                            $scope.onEditRecipeFile(file);
                            $rootScope.RecipeFiles.push(file);
                            layer.msg("已复制")
                            RecipeFile.copied = true;

                        });
                    }
                    else {
                        layer.msg("已复制")
                    }
                }

                $scope.onEditRecipeFiles = function (item) {
                    $scope.recipeFormularID = item.RecipeFormulaFileID;

                    $("#dialog-RecipeFiles").modal("hide");
                    $("#modal-NewRecipeFormular").modal("show");
                }

                // 删除处方
                $scope.onRemoveRecipeFormular = function (item) {
                    return $q(function (resolve, reject) {
                        //询问框
                        layer.confirm($translate.instant('msgConfirmDelete'), {
                            btn: [$translate.instant('是'), $translate.instant('否')] //按钮
                        }, function () {
                            resolve();
                        }, function () {

                        });
                    }).then(function () {
                        return doctorRecipeFormulaFilesServices.promise.delete({ ID: item.RecipeFormulaFileID });

                    }).then(function (resp) {
                        if (resp.Status != 0) {
                            layer.msg($translate.instant('msgDeleteFail'), { icon: 2, shade: 0.5 });
                            return;
                        }

                        layer.msg($translate.instant('msgDeleteSuccess'));
                        $scope.Keyword = "";
                        $scope.onGetRecipeFiles();

                    })["catch"](function (resp) {
                        layer.msg($translate.instant('msgDeleteFail'), { icon: 2, shade: 0.5 });
                    });
                }

                $scope.onAddRecipeFormular = function (item) {
                    $scope.recipeFormularCallback.resetCallback();
                    $scope.recipeFormularID = "";
                    $("#dialog-RecipeFiles").modal("hide");
                    $("#modal-NewRecipeFormular").modal("show");
                }

                $scope.recipeFormularCallback.actionSuccessCallback = function () {
                    $("#modal-NewRecipeFormular").modal("hide");
                }
                //#endregion


                //复制患者就诊记录
                $scope.$on('CopiedPatientVisitRecord', function (event, data) {
                    for (var i = 0; i < data.RecipeList.length; i++) {
                        var RecipeFileID = data.RecipeList[i].RecipeFileID;

                        var flagNotExists = true;

                        for (var j = 0; j < $rootScope.RecipeFiles.length; j++) {

                            if ($rootScope.RecipeFiles[j].RecipeFileID == RecipeFileID) {
                                flagNotExists = false;
                            }
                        }

                        //不存在才添加
                        if (flagNotExists) {
                            $rootScope.RecipeFiles.push(data.RecipeList[i]);
                        }
                    }

                    //选中最后一个处方
                    if ($rootScope.RecipeFiles.length > 0) {
                        $rootScope.RecipeFiles[$rootScope.RecipeFiles.length - 1].current = true;
                    }
                });

            }
        };
    }]);
});