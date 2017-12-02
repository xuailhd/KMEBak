define(["angular",
    "module-directive-chat-content"], function (angular) {

        console.log("load chat-detail-patientInfo.js")

        var app = angular.module("myApp", ["ui.bootstrap"])


        //分支修改
        app.directive('chatPatientinfo', [
        "$http",
        "$state",
        "$q",
        "$rootScope",
        '$translate',
        '$interval',
        "preview",
        "doctorMembersServices",
        "doctorDiagnosisServices",
        "userOPDRegistersServices",
        "optionsServices",
        'doctorPatientsServices',
        "userConsultsServices",      
        "imServices",
        "dcmViewer"
        , function (
            $http,
            $state,
            $q,
            $rootScope,
            $translate,
            $timeout,
            preview,
            doctorMembersServices,
            doctorDiagnosisServices,
            userOPDRegistersServices,
            optionsServices,
            doctorPatientsServices,
            userConsultsServices,         
            imServices,
            dcmViewer
            ) {

            return {
                restrict: 'EA',
                scope: {
                    room: '=room',
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || '/static/modules/Doctor/directives/chat-detail-PatientInfo.html';
                },
                controllerAs: "PatientInfo",
                controller: ["$scope", function ($scope) {
                    $scope.onHeaderNavClick = function (name) {
                        $scope.tabId = name;

                        if ($scope.tabId == "Visits") {
                            $scope.onRefreshOPDRegisterRecords();
                        }
                        else if ($scope.tabId == "PACS") {
                            $scope.onRefreshCheckList();
                        }
                        else if ($scope.tabId == "EMR") {
                            $scope.onRefreshEMRs();
                        }
                        $scope.headerTitle = $scope.headerNav[name];
                    }

                }],
                link: function ($scope, $element, attr) {

                    var room = $scope.room;

                    //#region 变量定义
                    $scope.headerNav = {
                        "PatientCondition": $translate.instant("就诊信息"),
                        "EMR": $translate.instant("电子病历"),
                        "PACS": $translate.instant("影像资料"),
                        "Visits": $translate.instant("就诊记录"),
                        "HealthRecords": $translate.instant("健康档案")
                    }
                    $scope.headerTitle = $scope.headerNav["PatientCondition"];
                    //患者基本信息
                    $scope.patientInfo = { MemberID: "" };
                    //患者病情
                    $scope.patientCondition = {};
                    //患者检查结果
                    $scope.patientInspectResult = [];
                    //患者就诊记录
                    $scope.patientOPDRegisterRecords = [];
                    //患者电子病历
                    $scope.patientEMRs = [];

                    $scope.ExamResult = { MemberID: '' };

                    //就诊记录时间轴信息
                    $scope.timePoints = [];
                    $scope.isScrolled = true;

                    $scope.tabId = "PatientCondition";
                    $scope.genders = null;
                    $scope.member = {
                        MemberName: null,
                        Mobile: null,
                        Gender: null,
                        Birthday: null,
                        IDNumber: null,
                        Age: null
                    };
                    //#endregion

                    // 时间轴详情
                    $scope.onTimePointDetail = function (item) {
                        debugger;
                        if (item) {
                            $scope.onOpenPatientVisitRecord(item.opdRegisterID);
                        }
                    }

                    ///加载会员资料
                    var onLoadMemberProfie = function (Data, OPDRegisterID) {
                      
                        OPDRegisterID = OPDRegisterID || "";

                        // 患者基本信息
                        $scope.patientInfo = Data.Member;
                        $scope.patientInfo.MemberID = Data.MemberID;
                        $rootScope.memberID = Data.MemberID;
                        if (Data.Member.Gender != null ) {
                            $scope.patientInfo.Gender = Data.Member.Gender.toString() == "1" ? "女" : "男";
                        }
                        if (Data.Member.Birthday) {
                            $scope.patientInfo.Age = Data.Member.Age;
                        }

                        // 用户分类
                        $scope.patientInfo.VipType = Data.User.UserLevel;

                        // 患者病情
                        $scope.patientCondition = {
                            diseaseName: Data.ConsultDisease,
                            diseaseDesc: Data.ConsultContent,
                            allergicHistory: Data.UserMedicalRecord == null ? null : Data.UserMedicalRecord.AllergicHistory,
                            files: Data.AttachFiles.map(function (item) {
                                return {
                                    fileType: item.FileType,                                    
                                    url: item.UrlPrefix + "/" + item.FileUrl
                                }
                            }).filter(function (item) {
                                return item.url != "";
                            })
                        }

                        //获取患者基本信息
                        /*
                        doctorMembersServices.GetMemberInfo({
                            MemberID: PatientMemberID,
                            UserID: PatientUserID
                        }, function (response) {

                            $scope.patientInfo = response.Data;

                            if(response.Data.Gender)
                            {
                                $scope.patientInfo.Gender = response.Data.Gender == "1" ? "女" : "男";
                            }

                            if (response.Data.Birthday)
                            {
                                $scope.patientInfo.Age = (new Date()).getFullYear() - parseInt(response.Data.Birthday.substring(0, 4));
                            }

                        });
                        */



                        $scope.onRefreshOPDRegisterRecords = function () {

                            var data = { MemberID: Data.MemberID };

                            if (OPDRegisterID != "")
                                data.OPDRegisterID = OPDRegisterID;

                            //获取患者就诊记录
                            doctorPatientsServices.getPatientVisitList(data, function (list) {
                                $scope.patientOPDRegisterRecords = list.Data;
                                $scope.timePoints = $scope.patientOPDRegisterRecords.map(function (item) {
                                    return {
                                        opdRegisterID: item.OPDRegisterID,
                                        datetime: item.OPDDate,
                                        title: item.Doctor.DoctorName + "  " + item.Doctor.DepartmentName,
                                        showDetail: true//,
                                        //contents: ["暂无内容"]
                                    };
                                });
                                $scope.timePoints = $scope.timePoints.slice(0, Math.min(20, $scope.timePoints.length ));
                            });


                        }
                        $scope.onRefreshEMRs = function () {
                            doctorPatientsServices.getPatientEMRPageList({ MemberID: Data.MemberID }, function (obj) {


                                $scope.patientEMRs = obj.Data;

                            })
                        }
                        $scope.onRefreshCheckList = function () {


                            //获取患者检查清单
                            doctorPatientsServices.getPatientInspectResult({
                                MemberId: Data.MemberID
                            }, function (obj) {

                                $scope.patientInspectResult = obj.Data;

                            })

                        }
                        $scope.onOpenExamResultRecord = function () {
                            $scope.ExamResult.MemberID = Data.MemberID;
                            $('#dialog-exam-result').modal('show');
                        }
                    }

                    //#region 网络医院病历

                    //打开病历（就诊记录）
                    $scope.onOpenPatientVisitRecord = function (id) {

                        //获取诊断结果、处方集
                        doctorDiagnosisServices.get({
                            OPDRegisterID: id
                        }, function (obj) {
                            
                            $scope.HistoryRecordDetail = obj.Data;
                            $('#dialog-patient_record').modal('show');
                        });
                    }

                    //复制病历（就诊记录）
                    $scope.onCopyPatientVisitRecord = function () {

                        $scope.$emit('CopiedPatientVisitRecord', $scope.HistoryRecordDetail);
                    }

                    //#endregion

                    //#region 检查清单
                    //打开检查结果
                    $scope.onOpenCheckResult = function (item) {

                        dcmViewer.open({
                            patId: item.CaseID,
                            patName: $scope.patientInfo.MemberName,
                            stuUID: item.StuUID,
                            studyDate: item.InspectDate,
                        });
                    }

                    //#endregion

                    //#region 电子病历

                    $scope.onOpenEMR = function (item) {

                        doctorPatientsServices.getPatientEMRRecord({ ID: item.UserMemberEMRID }, function (obj) {
                            var imageList = obj.Data.Files.map(function (item) {

                                return { url: item.UrlPrefix + "/" + item.FileUrl }

                            }).filter(function (item) {
                                return item.url != ""

                            });

                            //打开预览窗口
                            preview.open({
                                imageList: imageList,
                                current: 0////显示大图
                            });
                        })

                    }

                    //#endregion

                    $scope.onPreview = function (index, $event) {
                        if ($($event.target).parent().attr("href") != "")
                            return;

                        if (index >= $scope.patientCondition.files.length)
                            return;

                        if ($scope.patientCondition.files[index].fileType != 0)
                            return;

                        var imgs = $scope.patientCondition.files.map(function (item) {
                            return item;
                        }).filter(function (item) {
                            return item.fileType == 0;
                        });

                        if (imgs.length == 0)
                            return;

                        //打开预览窗口
                        preview.open({
                            imageList: imgs,
                            current: index
                        });

                    }

                    $scope.onSubmitPatientInfo = function () {
                        var loading = layer.load(0, { shade: [0.1, '#000'] });
                        doctorPatientsServices.promise.savePatientInfo({
                            OPDRegisterID: room.ServiceID,
                            MemberName: $scope.member.MemberName,
                            Mobile: $scope.member.Mobile,
                            Gender: $scope.member.Gender,
                            Birthday: $scope.member.Birthday,
                            IDNumber: $scope.member.IDNumber
                        }).then(function (item) {
                            layer.close(loading);
                            if (item.Status != 0) {
                                layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                                return;
                            }

                            layer.msg($translate.instant('msgSaveSuccess'), { icon: 1, shade: 0.5 });                            

                            $("#dialog-patient-info").modal("hide");
                            $scope.patientInfo.MemberID = "";

                            $scope.member = {
                                MemberName: null,
                                Mobile: null,
                                Gender: null,
                                Birthday: null,
                                IDNumber: null,
                                Age: null
                            };

                        })["catch"](function (item) {
                            layer.close(loading);
                            layer.msg($translate.instant('msgSaveFail'), { icon: 2, shade: 0.5 });
                        });
                    }

                    $scope.onLoad = function (ServiceID) {
                        var ChannelID = room.ChannelID;
                        var ServiceType = room.ServiceType;
                        var ServiceID = room.ServiceID;

                        if (ServiceID == "") {
                            //患者基本信息
                            $scope.patientInfo = {}
                            //患者检查结果
                            $scope.patientInspectResult = [];
                            //患者就诊记录
                            $scope.patientOPDRegisterRecords = [];
                        }
                        else {
                            userOPDRegistersServices.get({ OPDRegisterID: ServiceID }, function (obj) {
                                if (obj.Data) {
                                    $scope.MemberID = obj.Data.MemberID;
                                    onLoadMemberProfie(obj.Data, ServiceID);
                                    $scope.onRefreshOPDRegisterRecords();
                                }
                            });

                            /*
                            if (ServiceType == 2 || ServiceType == 3 || ServiceType == 0) {


                                //获取语句信息
                                userOPDRegistersServices.get({ OPDRegisterID: ServiceID }, function (obj) {

                                    if (obj.Data) {
                                        $scope.MemberID = obj.Data.MemberID;
                                        onLoadMemberProfie(obj.Data.MemberID, obj.Data.UserID, ServiceID);

                                    }

                                });
                            }
                                //图文咨询
                            else if (ServiceType == 1) {
                                var ID = ServiceID;
                                userConsultsServices.get({ ID: ID }, function (resp) {

                                    $scope.MemberID = resp.Data.MemberID;
                                    onLoadMemberProfie(resp.Data.MemberID, resp.Data.UserID);

                                })
                                //获取咨询
                            }*/

                        }
                    }

                    $('#dialog-patient-info').on('show.bs.modal', function (event) {
                        optionsServices.promise.get({ optionName: 'Gender' }).then(function (resp) {
                            if ($scope.genders != null)
                                return;

                            $scope.genders = resp.Data;

                        });
                    });
                    
                    $scope.onLoad(room.ServiceID);
                }
            };
        }]);

    });