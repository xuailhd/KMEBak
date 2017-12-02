"use strict";
define(["module-services-apiUtil", "module-services-apiUtilMP","jquery-validate"], function (apiUtil, apiUtilMP) {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            app.controller('EditController', [
                '$scope',
                '$http',
                "$q",
                '$location',
                '$state',
                '$translate',
                "sysICDsServices",
                "sysDrugsServices",
                'drugstoreServices',
                function ($scope, $http, $q, $location, $state, $translate, sysICDsServices,
                    sysDrugsServices, drugstoreServices) {

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

                    //剂量 单位 (西药)
                    $scope.doseUnitEN = ["片", "粒", "袋", "ml", "g", "丸", "支", "瓶", "盒", "mg", "克", "包", "kg",
                        "合", "贴", "罐", "条", "台", "个", "滴", "喷", "IU", "卷", "只", "套", "提", "枚", "扎", "小盒", "板", "对",
                        "付", "根", "块", "斤", "小丸", "小包", "小袋", "排", "塑瓶"];

                    //剂量 单位 (中药)
                    $scope.doseUnitCN = ["g", "克", "片", "瓶", "kg", "粒", "袋", "包", "条", "支", "盒", "个", "根",
                        "对", "10G", "丸", "扎"];

                    //药品（频率）123
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
                            { shade: '洗口腔' },
                            { shade: '滴' },
                            { shade: '喷' }
                    ];


                    /*************************以下是和服务端交互的数据*****************/
                    //处方
                    $scope.selectStatus = []
                    $scope.RecipeFile = {};
                    $scope.RecipeFile.RecipeFileID = $state.params.id;

                    $scope.orgID = $state.params.OrgID;
                    $scope.orgName = $state.params.OrgName;
                    $scope.RecipeFile.RecipeType = parseInt($state.params.RecipeType);
                    $scope.RecipeFile.PatientGender = '0';
                    $scope.onLoad = function () {
                        var loading = layer.load(0, { shade: [0.1, '#000'] });
                        //获取会员处方
                        if ($scope.RecipeFile.RecipeFileID.length > 0) {
                            var data = {
                                RecipeFileID: $scope.RecipeFile.RecipeFileID,
                                OrgID: $scope.orgID
                            };
                            apiUtilMP.requestWebApi('RecipeForDoctor/GetRecipe', 'Post', data, function (obj) {
                                //处方
                                if(obj.Data.Details){
                                    $.each(obj.Data.Details, function (i, d) {
                                        d.Drug = {
                                            DrugName: d.DrugName,
                                            Specification: d.Specification,
                                            Unit: d.Unit,
                                            FactoryName: d.FactoryName
                                        };
                                    });
                                }
                                if (obj.Data.DrugSellDate) {
                                    var drugSellDate = new Date(obj.Data.DrugSellDate);
                                    obj.Data.DrugSellDate = drugSellDate.format("yyyy-MM-dd");
                                }
                                obj.Data.GenderName = EnumGender["N" + obj.Data.PatientGender];

                                // 身份证号显示*号
                                //if(obj.Data.IDNumber) {
                                //  var num = obj.Data.IDNumber.split('');
                                //  for(var i = 0; i < num.length; i++) {
                                //    if(i >= 10 && i <= 15) {
                                //      num[i] = '*';
                                //    }
                                //  }
                                //  obj.Data.IDNumber = num.join('');
                                //}

                                $scope.RecipeFile = obj.Data;
                                obj.Data.Details.forEach(function (value, index) {
                                    $scope.selectStatus[index] = true
                                })
                                $scope.RecipeFile.PatientGender = obj.Data.PatientGender + '';
                                if ($scope.RecipeFile.RecipeVerfifyLogs != null) {
                                    $.each($scope.RecipeFile.RecipeVerfifyLogs, function (i, d) {
                                        var curDate = new Date(d.OpTime);
                                        d.OpTime = curDate.format("yyyy-MM-dd hh:mm");
                                        if (d.Remark && d.Remark != null)
                                        {
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

                    $scope.getUserMember = function (val) {
                        $scope.inputIr = false;
                        if ($scope.GetStringLength($.trim(val)) > 1) {
                            var deferred = $q.defer();//声明承诺
                            $.each($scope.RecipeFile, function (k, v) {
                                $scope.RecipeFile.DrugSellDate = '';
                                $scope.RecipeFile.IDNumber = '';
                                $scope.RecipeFile.PatientAge = '';
                                $scope.RecipeFile.PatientTel = '';
                            })
                            drugstoreServices.getOrgMember({
                                Keyword: val,
                                PageSize: 65535,
                                CurrentPage: 1,
                                OrgnazitionID: $scope.orgID
                            }, function (response) {
                                response.Data.map(function (item) {
                                    return item;
                                });
                                deferred.resolve(response.Data);//请求成功

                            }, function () {

                                deferred.reject([]); //请求失败
                            });

                            return deferred.promise;
                        }
                    }

                    $scope.inputIr = false;
                    $scope.onUserMemberSelect = function ($item, $model, $label) {
                        // 身份证号显示*号
                        //if ($item.IDNumber) {
                        //    var num = $item.IDNumber.split('');
                        //    for (var i = 0; i < num.length; i++) {
                        //        if (i >= 10 && i <= 15) {
                        //            num[i] = '*';
                        //        }
                        //    }
                        //    $item.IDNumber = num.join('');
                        //}
                        $scope.RecipeFile.OutID = $item.MemberID;
                        $scope.RecipeFile.PatientName = $item.MemberName;
                        $scope.RecipeFile.PatientGender = $item.Gender + '';
                        $scope.RecipeFile.GenderName = EnumGender['N' + $item.Gender];
                        $scope.RecipeFile.PatientAge = $item.Age;
                        $scope.RecipeFile.PatientTel = $item.Mobile;
                        $scope.RecipeFile.PatientAddress = $item.Address;
                        $scope.RecipeFile.IDType = $item.IDType;
                        $scope.RecipeFile.IDNumber = $item.IDNumber;
                        if ($scope.RecipeFile.IDNumber != '') {
                            $scope.inputIr = true;
                        }
                    }

                    $scope.formatName = function (member, item) {
                        if (item == undefined) {
                            return " ";
                        }
                        else {
                            return item + '&nbsp;&nbsp;' + (member.Gender == 0 ? '男' : '女') + '&nbsp;&nbsp;' + (member.Age + '岁');
                        }
                    }

                /***********************************************************/


                    /**************************处方诊断*****************************************/

                    //添加一条诊断记录
                    $scope.onAddICDRecord = function () {

                        $scope.RecipeFile.Diagnoses.push({
                            "Detail": {
                                "ID": 0, "DiseaseCode": "", "DiseaseName": ""
                            }, "Description": ""
                        });
                    }

                    //删除一条诊断记录
                    $scope.onRemoveICDRecord = function (item) {

                        //询问框
                        var dialog = layer.confirm('确认删除吗？', { btn: ['确认', '取消'] }, function () {
                            var index = $scope.RecipeFile.Diagnoses.indexOf(item);
                            $scope.RecipeFile.Diagnoses.splice(index, 1);
                            $scope.$apply();
                            layer.close(dialog);

                        }, function () {
                        });

                    }

                    //获取诊断
                    $scope.getICDRecords = function (val, ICDType) {


                        //获取字符串长度，中文算2个，英文字符算1个
                        if ($scope.GetStringLength($.trim(val)) > 1) {
                            var deferred = $q.defer();//声明承诺

                            sysICDsServices.get({ Keyword: val, ICDType: ICDType }, function (response) {

                                response.Data.map(function (item) {
                                    return item;
                                });

                                deferred.resolve(response.Data);//请求成功
                            }, function () {
                                deferred.reject([]); //请求失败
                            })
                            return deferred.promise;

                        }
                    }

                    //自定完成选择一条诊断时
                    $scope.onDiseaseSelect = function (item, $model, $label) {
                        //如果用户选择了一个则使用系统的，支持用直接输入诊断名称
                        item.DiseaseName = $model.DiseaseName;
                        item.DiseaseCode = $model.DiseaseCode;
                        item.Description = "";
                        item.DiagnoseType = $model.ICDType
                    }

                    /**************************处方诊断*****************************************/


                    /**************************处方药品*****************************************/

                    //添加药品
                    $scope.onAddDrugDetail = function () {

                        var list = $scope.RecipeFile.Details.push({
                            "Dose": 1,//剂量
                            "Quantity": 1,//数量
                            "DrugRouteName": "",//用药途径
                            "Frequency": "",//用药频率
                            "DoseUnit": "",//剂量单位
                            "Unit": "",//计费数量 单位
                            "DrugID": "",//药品ID
                            "DrugCode": "",//药品编号
                            "DrugName": "",//药品名称
                            "Specification": "",//药品规格
                            "UnitPrice": "",//药品单价
                            "TotalDose": 0,//药品剂量
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

                            layer.close(dialog);
                            $scope.$apply();

                        }, function () {
                        });
                    }

                    $scope.loginInfo = apiUtil.getLoginInfo();
                    //获取药品
                    $scope.getDrugDetails = function (val, Type) {
                        if ($scope.GetStringLength($.trim(val)) > 1) {
                            var deferred = $q.defer();//声明承诺

                            sysDrugsServices.get({
                                Keyword: val,
                                DrugType: Type,
                                PharmacyID: $scope.orgID,
                                PageSize:25
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

                    //自动完成下拉框中选择一条药品
                    $scope.selectKeyup = function ($index, $event) {
                        $scope.selectStatus[$index] = false
                    }
                    $scope.onDrugSelect = function (item, $model, $label, $index) {
                        item.DrugID = $model.DrugID;
                        item.DrugCode = $model.DrugCode;
                        item.DrugName = $model.DrugName;
                        item.Specification = $model.Specification;
                        item.LicenseNo = $model.LicenseNo;
                        item.FactoryName = $model.FactoryName;
                        item.BatchNO = $model.BatchNO;
                        item.UnitPrice = $model.UnitPrice;
                        item.DoseUnit = $model.DoseUnit;
                        item.Unit = $model.Unit;
                        item.Quantity = 1;
                        item.Dose = $model.Quantity * $model.TotalDose;
                        //延迟执行，防止被上面selectKeyup置为false
                        setTimeout(function () {
                            $scope.selectStatus[$index] = true; 
                            $("#myForm").valid();
                        }, 150);
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


                    //保存 & 提交处方
                    $scope.nextStatus = true;
                    $scope.onSubmit = function (status) {
                        if ($("#myForm").valid()) {
                            if ($scope.RecipeFile.Details == undefined || $scope.RecipeFile.Details.length <= 0)
                            {
                                layer.msg("药品信息不能为空");
                                return;
                            }

                            if ($scope.RecipeFile.Diagnoses == undefined || $scope.RecipeFile.Diagnoses.length <= 0) {
                                layer.msg("诊断信息不能为空");
                                return;
                            }
                            var loading = layer.load(0, { shade: [0.1, '#000'] });
                            $scope.RecipeFile.OperationUserName = apiUtil.getLoginInfo().UserCNName;
                            $scope.RecipeFile.DrugSellDate = $('#DrugSellDate').val();
                            console.log($scope.nextStatus)
                            if ($scope.nextStatus) {
                                $scope.nextStatus = false;
                                if (!$scope.RecipeFile.OutID) {
                                    drugstoreServices.checkOrgMember({
                                        MemberName: $scope.RecipeFile.PatientName,
                                        IdNumber: $scope.RecipeFile.IDNumber,
                                        Gender: $scope.RecipeFile.PatientGender,
                                        Age: $scope.RecipeFile.PatientAge,
                                        Mobile: $scope.RecipeFile.PatientTel,
                                        OrgnazitionID : $scope.orgID
                                    }, function (obj) {
                                        $scope.RecipeFile.OutID = obj.Data.MemberID;
                                        $scope.save(status, loading);
                                    }, function (e) {
                                        $scope.nextStatus = true;
                                        layer.close(loading);
                                        layer.msg(e.Msg);
                                    })
                                } else {
                                    $scope.save(status, loading);
                                }
                            }
                            
                        }
                    }

                    // 保存提交处方
                    $scope.save = function (status, loading) {
                        if (status == 0) {
                            apiUtilMP.requestWebApi('RecipeForDoctor/Save', 'Post', $scope.RecipeFile, function (obj) {
                                //处方
                                if (obj.Data.Details) {
                                    $.each(obj.Data.Details, function (i, d) {
                                        d.Drug = {
                                            DrugName: d.DrugName,
                                            Specification: d.Specification,
                                            Unit: d.Unit,
                                            FactoryName: d.FactoryName
                                        };
                                    });
                                }
                                if (obj.Data.DrugSellDate) {
                                    var drugSellDate = new Date(obj.Data.DrugSellDate);
                                    obj.Data.DrugSellDate = drugSellDate.format("yyyy-MM-dd");
                                }
                                obj.Data.GenderName = EnumGender["N" + obj.Data.PatientGender];
                                $scope.RecipeFile = obj.Data
                                //if ($scope.RecipeFile.RecipeHis != null) {
                                //    $.each($scope.RecipeFile.RecipeHis, function (i, d) {
                                //        //d.OpTypeName = EnumOpType["N" + d.OpType];
                                //        //var curDate = new Date(d.OperationTime);
                                //        //d.OperationTime = curDate.format("yyyy-MM-dd hh:mm");
                                //    });
                                //}
                                layer.close(loading)
                                layer.msg("保存成功");
                                $scope.nextStatus = true;
                            }, function () {
                                layer.close(loading)
                                layer.msg("保存失败")
                                $scope.nextStatus = true;
                            });
                        }
                        else {
                            apiUtilMP.requestWebApi('RecipeForDoctor/SaveAndSubmit', 'Post', $scope.RecipeFile, function (obj) {
                                //处方
                                if (obj.Data.Details) {
                                    $.each(obj.Data.Details, function (i, d) {
                                        d.Drug = {
                                            DrugName: d.DrugName,
                                            Specification: d.Specification,
                                            Unit: d.Unit,
                                            FactoryName: d.FactoryName
                                        };
                                    });
                                }
                                if (obj.Data.DrugSellDate) {
                                    var drugSellDate = new Date(obj.Data.DrugSellDate);
                                    obj.Data.DrugSellDate = drugSellDate.format("yyyy-MM-dd");
                                }
                                obj.Data.GenderName = EnumGender["N" + obj.Data.PatientGender];
                                $scope.RecipeFile = obj.Data;
                                $scope.RecipeFile.State = 1;
                                //if ($scope.RecipeFile.RecipeHis != null) {
                                //    $.each($scope.RecipeFile.RecipeHis, function (i, d) {
                                //        //d.OpTypeName = EnumOpType["N" + d.OpType];
                                //        //var curDate = new Date(d.OperationTime);
                                //        //d.OperationTime = curDate.format("yyyy-MM-dd hh:mm");
                                //    });
                                //}
                                layer.close(loading)
                                history.back();
                                layer.msg("提交成功");
                                $scope.nextStatus = true;
                            }, function (result) {
                                if (result.Status == -106 && result.Msg) {
                                    layer.close(loading);
                                    layer.msg("药品必须是系统筛选出的药品");
                                }
                                else if (result.Status == -107 && result.Msg) {
                                    layer.close(loading);
                                    layer.msg(result.Msg);
                                }
                                else {
                                    layer.close(loading);
                                    layer.msg("保存失败");
                                }
                                $scope.nextStatus = true;
                            });
                        }
                    }

                    $scope.GoBack = function () {
                        history.back();
                    };

                    // 初始化表单验证
                    $scope.readyValidate = function () {
                        jQuery.validator.addMethod("idNumber", function (value, element) {
                            return this.optional(element) || ($scope.isIdCardNo(value));
                        }, "身份证号不正确");
                        jQuery.validator.addMethod("drugs", function (value, element) {
                            return this.optional(element) || ($scope.selectStatus[element.name.replace('DrugName', '')]);
                        }, "请选择下拉菜单药品")
                        $("#myForm").validate({
                            errorPlacement: function (error, element) {
                                if (element.parents(".input-group").length > 0) {
                                    error.appendTo(element.parents(".input-group").parent());
                                } else {
                                    error.appendTo(element.parent());
                                }
                                element.parents(".form-group").removeClass("has-success");
                                element.parents(".form-group").addClass("has-error");
                            },
                            success: function (element) {
                                element.parents(".form-group").removeClass("has-error");
                                element.parents(".form-group").addClass("has-success");
                                element.remove();
                            },
                            submitHandler: function (form) {
                                // 验证成功
                                $scope.form1 = true;
                            }
                        });
                    }

                    // 根据身份证号获取生日和性别
                    $scope.XToUp = function () {
                        var gender = $("#Gender");
                        var birthday = $("#Birthday");
                        var NumberVal = $scope.RecipeFile.IDNumber;
                        if (NumberVal.length == 15 || NumberVal.length == 18) {
                            if (!$scope.isIdCardNo($scope.RecipeFile.IDNumber)) {
                                return;
                            }
                            //处理18位的身份证号码从号码中得到生日和性别代码
                            if (NumberVal.length == 18) {
                                $scope.RecipeFile.PatientAge = $scope.ages(NumberVal.substr(6, 4) + "-" + NumberVal.substr(10, 2) + "-" + NumberVal.substr(12, 2));
                                $scope.RecipeFile.PatientGender = (NumberVal.substr(14, 3) % 2 == 0) ? '1' : '0';
                            }
                            //处理15位的身份证号码从号码中得到生日和性别代码
                            if (NumberVal.length == 15) {
                                $scope.RecipeFile.PatientAge = "19" + $scope.ages(NumberVal.substr(6, 2) + "-" + NumberVal.substr(8, 2) + "-" + NumberVal.substr(10, 2));
                                $scope.RecipeFile.PatientGender = (NumberVal.substr(12, 3) % 2 == 0) ? '1' : '0';
                            }
                            setTimeout(function () {
                                gender.attr("disabled", "disabled").valid();
                                birthday.attr("disabled", "disabled").valid();
                            }, 10)
                        } else {
                            gender.removeAttr("disabled");
                            birthday.removeAttr("disabled");
                        }
                    }

                    // 获取生日年龄
                    $scope.ages = function (str) {
                        var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
                        if (r == null) return false;
                        var d = new Date(r[1], r[3] - 1, r[4]);
                        if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
                            var Y = new Date().getFullYear();
                            return Y - r[1];
                        }
                    }
                    // 身份证号码验证
                    $scope.isIdCardNo = function (num) {
                        var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
                        var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                        var varArray = new Array();
                        var intValue;
                        var lngProduct = 0;
                        var intCheckDigit;
                        var intStrLen = num.length;
                        var idNumber = num;


                        if ((intStrLen != 15) && (intStrLen != 18)) {
                            return false;
                        }
                        // check and set value
                        for (var i = 0; i < intStrLen; i++) {
                            varArray[i] = idNumber.charAt(i);
                            if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                                return false;
                            } else if (i < 17) {
                                varArray[i] = varArray[i] * factorArr[i];
                            }
                        }
                        if (intStrLen == 18) {
                            //check date
                            var date8 = idNumber.substring(6, 14);
                            if ($scope.isDate8(date8) == false) {
                                return false;
                            }
                            // calculate the sum of the products
                            for (var i = 0; i < 17; i++) {
                                lngProduct = lngProduct + varArray[i];
                            }
                            // calculate the check digit
                            intCheckDigit = parityBit[lngProduct % 11];
                            // check last digit
                            if (varArray[17] != intCheckDigit) {
                                return false;
                            }
                        }
                        else {        //length is 15
                            //check date
                            var date6 = idNumber.substring(6, 12);
                            if ($scope.isDate6(date6) == false) {
                                return false;
                            }
                        }
                        return true;
                    }

                    /* 判断是否为“YYMMDD”式的时期 */
                    $scope.isDate6 = function (sDate) {
                        if (!/^[0-9]{6}$/.test(sDate)) {
                            return false;
                        }
                        var year, month, day;
                        year = parseInt("19" + sDate.substring(0, 2));
                        month = sDate.substring(2, 4);
                        day = sDate.substring(4, 6);
                        if (year < 1700 || year > 2500) return false;
                        if (month < 1 || month > 12) return false;
                        if (day < 1 || day > 31) return false;
                        return true
                    }

                    /* 判断是否为“YYYYMMDD”式的时期 */
                    $scope.isDate8 = function (sDate) {
                        if (!/^[0-9]{8}$/.test(sDate)) {
                            return false;
                        }
                        var year, month, day;
                        year = sDate.substring(0, 4);
                        month = sDate.substring(4, 6);
                        day = sDate.substring(6, 8);
                        var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                        if (year < 1700 || year > 2500) return false
                        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
                        if (month < 1 || month > 12) return false
                        if (day < 1 || day > iaMonthDays[month - 1]) return false
                        return true
                    }

                    $scope.readyValidate();

                    $("#drugstoreNametitle").html($scope.orgName);
                    if ($scope.RecipeFile.RecipeFileID) {
                        $("#ptitle").html("编辑处方");
                        $scope.onLoad();
                    }
                    else {

                        $scope.RecipeFile.Details = [];
                        $scope.RecipeFile.Diagnoses = [];
                        $scope.RecipeFile.OrgID = $scope.orgID;
                        $scope.RecipeFile.State = 0;
                        $scope.RecipeFile.TCMQuantity = 1;
                        if ($scope.RecipeFile.RecipeType == 1) {
                            $("#ptitle").html("添加中药处方");
                            $scope.RecipeFile.DecoctNum = 1;//几煎
                            $scope.RecipeFile.DecoctTotalWater = 500;//煎前水量
                            $scope.RecipeFile.DecoctTargetWater = 300;//煎后水量
                            $scope.RecipeFile.FreqDay = 1;
                            $scope.RecipeFile.FreqTimes = 1;
                            $scope.RecipeFile.Times = 1;

                        }
                        else {
                            $("#ptitle").html("添加西药处方");
                        }
                    }
                }
            ]);

        });
