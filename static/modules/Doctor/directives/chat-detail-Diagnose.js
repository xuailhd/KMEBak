define(["module-services-api", "module-services-eventBus", "jquery-validate", "angular"], function (apiUtil, eventBus) {

    console.log("load chat-detail-diagnose.js")
    var app = angular.module("myApp", []);
    app.directive('chatDiagnose', [
        "$http",
        "$q",
        "$state",
        "$rootScope",
        '$translate',
        '$interval',
        'doctorDiagnosisServices',
        "sysICDsServices",
        "sysDrugsServices",
        "imServices",
        "doctorPatientsServices",
        function (
            $http,
            $q,
            $state,
            $rootScope,
            $translate,
            $interval,
            doctorDiagnosisServices,
            sysICDsServices,
            sysDrugsServices,
            imServices,
            doctorPatientsServices) {

            return {
                restrict: 'EA',
                scope: {
                    room: '=room',
                    roomType: "=roomType"
                },
                templateUrl: function (element, attrs) {

                    return attrs.templateUrl || '/static/modules/Doctor/directives/chat-detail-Diagnose.html';
                },
                link: function ($scope, $element, attr, pCtrls) {
                   
                    $scope.roomType = attr.roomType;

                    var room = $scope.room;
                    /***********************************************************/

                    //#region 变量定义
                    // 预约编号
                    $scope.OPDRegisterID = 0;                    
                    $scope.OrgnazitionID = "";
                    // 用户编号
                    $scope.UserID = "";
                    // 患者编号
                    $scope.MemberID = "";
                    //处方
                    //$scope.RecipeFiles = [];
                    // 是否已提交过，不可编辑
                    $scope.isReadOnly = false;

                    //诊断信息
                    $scope.DiagnoseInfo = {
                        MedicalRecord: {
                            //主诉
                            Sympton: "",
                            //现病史
                            Disease: "",
                            //现病史
                            PresentHistoryIllness: "",
                            //既往病史
                            PastMedicalHistory: "",
                            //初步诊断
                            PreliminaryDiagnosis: "",
                            //医嘱
                            Advised: ""
                        },
                        //体格检查
                        //PhysicalExam: [],
                        //标签
                        Tags: [],
                        //过敏史
                        AllergicHistory: ""
                    };

                    // 诊断模板
                    $scope.diagnoseTempl = {
                        id: null,
                        name: null,
                        preliminaryDiagnosis: null,
                        advised: null
                    };
                    
                    $scope.diagnoseTemplPager = {
                        pageSize: 5,
                        page: 1,
                        totalCount: 0
                    }
                    // 诊断模板集合
                    $scope.diagnoseTemps = null;
                    //#endregion

                    //提交诊断
                    $scope.onSaveDiagnose = function () {
                        
                        // 表单验证失败
                        if (!$("#form-Diagnose").valid()) {
                            var errorList = $("#form-Diagnose").validate().errorList;
                            errorList[0].element.focus();
                            return;
                        }

                        var loading = null;
                        return $q(function (resolve, reject) {
                            //询问框
                            layer.confirm($translate.instant('提交诊断后不可修改，您确认要提交吗？'), {
                                btn: [$translate.instant('是'), $translate.instant('否')] //按钮
                            }, function () {
                                resolve();
                            }, function () {

                            });
                        }).then(function () {
                            loading = layer.load(0, { shade: [0.1, '#000'] });

                            //转换标签成数组到后台保存 TagInfo.ASK=["A","B"]                        
                            $scope.DiagnoseInfo.Tags = [];
                            for (var tagType in $scope.DiagnoseInfo.TagInfo) {
                                $scope.DiagnoseInfo.TagInfo[tagType].forEach(function (item) {
                                    $scope.DiagnoseInfo.Tags.push({
                                        TagType: tagType,
                                        Tag: item
                                    });
                                });
                            }

                            //保存病历
                            return doctorPatientsServices.promise.submitPatientDiagnose({
                                OPDRegisterID: $scope.OPDRegisterID,
                                MemberID: $scope.MemberID,
                                MedicalRecord: $scope.DiagnoseInfo.MedicalRecord,
                                Tags: $scope.DiagnoseInfo.Tags//标签                              
                                //PhysicalExam: $scope.DiagnoseInfo.PhysicalExam //病历 体格检查    
                            });
                        }).then(function (response) {
                            layer.close(loading);

                            if (response.Data) {
                                $scope.isReadOnly = true;
                                layer.msg($translate.instant('提交成功'));
                                eventBus.dispatch("room-session-changed", {});
                            }
                            else {
                                layer.msg($translate.instant('提交失败'), { icon: 2, shade: 0.5 });
                            }

                        })["catch"](function () {
                            layer.close(loading);
                            layer.msg($translate.instant('提交失败'), { icon: 2, shade: 0.5 });
                        });
                    }

                    $scope.onCreateDiagnoseTemplate = function () {
                        $scope.diagnoseTempl.id = null;
                        $scope.diagnoseTempl.name = null;
                        $scope.diagnoseTempl.preliminaryDiagnosis = null;
                        $scope.diagnoseTempl.advised = null;

                        layer.prompt({ title: $translate.instant("填写诊断模板名称"), formType: 0 }, function (text, index) {
                            
                            $scope.diagnoseTempl.name = text;
                            layer.close(index);
                            $("#modal-diagnose-template").modal("show");
                        });
                    }

                    $scope.onSubmitDiagnoseTemplate = function () {
                     
                        
                        if ($scope.diagnoseTempl.id == null) {
                            newDiagnoeTemplContent();
                        }
                        else {
                            editDiagnoseTemplContent();
                        }
                    }
                    
                    $scope.onEditDiagnoseTemplContent = function (item) {
                        $scope.diagnoseTempl.id = item.DiagnosisFormularID;
                        $scope.diagnoseTempl.name = item.Name;
                        $scope.diagnoseTempl.preliminaryDiagnosis = item.PreliminaryDiagnosis;
                        $scope.diagnoseTempl.advised = item.Advised;

                        $("#modal-diagnose-templates").modal("hide");
                        $("#modal-diagnose-template").modal("show");
                    }

                    // 删除诊断模板
                    $scope.onRemoveDiagnoseTemplContent = function (item) {
                       
                        var loading = null;

                        return $q(function (resolve, reject) {
                            layer.confirm($translate.instant("msgConfirmDelete"), {
                                btn: [$translate.instant("是"), $translate.instant("否")] 
                            }, function () {
                                resolve();
                            }, function () {

                            });
                        }).then(function () {
                            loading = layer.load(0, { shade: [0.1, '#000'] });
                            return doctorDiagnosisServices.promise.deleteFormular({ id: item.DiagnosisFormularID });

                        }).then(function (resp) {
                            layer.close(loading);

                            if (resp.Status != 0) {
                                layer.msg($translate.instant("msgDeleteFail"), { icon: 2, shade: 0.5 });
                                return;
                            }

                            layer.msg($translate.instant('msgDeleteSuccess'), { icon: 1, shade: 0.5 });
                            $scope.onGetDiagnoseTempls();

                        })["catch"](function (resp) {
                            layer.close(loading);
                            layer.msg($translate.instant("msgDeleteFail"), { icon: 2, shade: 0.5 });
                        });
                    }

                    // 选择诊断模板，将模板内容拷贝至诊断页面
                    $scope.onCopyDiagnoseTemplContent = function (item) {
                        $scope.DiagnoseInfo.MedicalRecord.PreliminaryDiagnosis = item.PreliminaryDiagnosis;
                        $scope.DiagnoseInfo.MedicalRecord.Advised = item.Advised;
                        $("#modal-diagnose-templates").modal("hide");
                    }

                    $('#modal-diagnose-templates').on('show.bs.modal', function (event) {
                        $scope.onGetDiagnoseTempls();
                    });

                    // 获取诊断模板集合
                    $scope.onGetDiagnoseTempls = function () {
                        doctorDiagnosisServices.promise.getFormulars({
                            CurrentPage: $scope.diagnoseTemplPager.page,
                            PageSize: $scope.diagnoseTempl.pageSize
                        }).then(function (resp) {
                            if (resp.Status != 0) {
                                return;
                            }

                            $scope.diagnoseTemps = resp.Data;
                            $scope.diagnoseTemplPager.totalCount = resp.Total;

                        })["catch"](function (resp) {
                            layer.msg($translate.instant(resp.Msg), { icon: 2, shade: 0.5 });
                        });
                    }

                    // 新增诊断模板
                    var newDiagnoeTemplContent = function () {
                        var loading = layer.load(0, { shade: [0.1, '#000'] });
                        doctorDiagnosisServices.promise.insertFormular({
                            Name: $scope.diagnoseTempl.name,
                            PreliminaryDiagnosis: $scope.diagnoseTempl.preliminaryDiagnosis,
                            Advised: $scope.diagnoseTempl.advised
                        }).then(function (resp) {
                            layer.close(loading);

                            if (resp.Status != 0) {
                                layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                                return;
                            }

                            layer.msg($translate.instant('msgSaveSuccess'), { icon: 1, shade: 0.5 });

                            $("#modal-diagnose-template").modal("hide");

                        })["catch"](function (resp) {
                            layer.close(loading);
                            layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                        });
                    }

                    // 编辑诊断模板
                    var editDiagnoseTemplContent = function (item) {
                        var loading = layer.load(0, { shade: [0.1, '#000'] });
                        doctorDiagnosisServices.promise.updateFormular({
                            DiagnosisFormularID: $scope.diagnoseTempl.id,
                            Name: $scope.diagnoseTempl.name,
                            PreliminaryDiagnosis: $scope.diagnoseTempl.preliminaryDiagnosis,
                            Advised: $scope.diagnoseTempl.advised
                        }).then(function (resp) {
                            layer.close(loading);

                            if (resp.Status != 0) {
                                layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                                return;
                            }

                            layer.msg($translate.instant('msgSaveSuccess'), { icon: 1, shade: 0.5 });
                            $("#modal-diagnose-template").modal("hide");

                        })["catch"](function (resp) {
                            layer.close(loading);
                            layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                        });
                    }

                    

                    //加载数据
                    $scope.onLoad = function (ServiceID) {
                        $scope.OPDRegisterID = ServiceID;

                        if ($scope.OPDRegisterID != "") {
                            var loading = layer.load(0, { shade: [0.1, '#000'] });

                            //获取诊断结果、处方集
                            doctorDiagnosisServices.get({
                                OPDRegisterID: $scope.OPDRegisterID
                            }, function (obj) {

                                $scope.UserID = obj.Data.UserID;
                                $scope.MemberID = obj.Data.MemberID;

                                $scope.DiagnoseInfo = {
                                    MedicalRecord: obj.Data.MedicalRecord,
                                    //标签
                                    Tags: obj.Data.Tags,
                                    //PhysicalExam: obj.Data.PhysicalExam,
                                    TagInfo: {}
                                };

                                $scope.isReadOnly = obj.Data.MedicalRecord.Sympton != "";

                                //转换标签信息，有列表转成对象（字典），界面上绑定更方便
                                //TagInfo={ASK:['A',B],CUT:['1',2]}
                                $scope.DiagnoseInfo.Tags.forEach(function (item) {

                                    if (!$scope.DiagnoseInfo.TagInfo[item.TagType])
                                        $scope.DiagnoseInfo.TagInfo[item.TagType] = [];

                                    $scope.DiagnoseInfo.TagInfo[item.TagType].push(item.Tag)
                                });

                                //机构编号
                                $rootScope.OrgnazitionID = obj.Data.OrgnazitionID;

                                //处方
                                $rootScope.RecipeFiles = obj.Data.RecipeList;

                                //机构编号
                                $rootScope.OrgnazitionID = obj.Data.OrgnazitionID;
                                //$scope.RecipeFiles = obj.Data.RecipeList;

                                layer.close(loading)

                            }, function () {

                                layer.close(loading)
                                layer.msg("加载患者病历失败")

                            });
                        }
                        else {
                            //预约编号
                            $scope.OPDRegisterID = 0;

                            //用户编号
                            $scope.UserID = "";

                            $scope.DiagnoseInfo = {};

                            //处方
                            //$scope.RecipeFiles = [];
                        }
                    }

                    //复制患者就诊记录
                    $scope.$on('CopiedPatientVisitRecord', function (event, data) {


                        $scope.DiagnoseInfo = {
                            //检查项目
                            //PhysicalExam: data.PhysicalExam,
                            //病历
                            MedicalRecord: {},
                            //标签
                            Tags: data.Tags
                        };                       

                        layer.msg($translate.instant('msgCopySuccess'));

                        //关闭病历记录窗口
                        $('#dialog-patient_record').modal('hide');
                    });

                    $scope.onLoad(room.ServiceID);
                }
            };
        }]);
});