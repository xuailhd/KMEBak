"use strict";
define(["module-directive-bundling-doctor-all",
        "module-services-api"], function () {

            var app = angular.module("myApp", [
            "pascalprecht.translate",
            'ui.router',
            "ui.bootstrap",
            "ngAnimate"]);

            //选项卡
            app.controller('MyPatientDetailController', ['$scope', '$state', function ($scope, $state) {
                $scope.tab = $state.params.tab || "myMember";
                $scope.id = $state.params.id;

                //返回
                $scope.onBack = function () {
                    $state.go("Doctor.MyPatients");
                };

            }]);

            //基本资料
            app.controller('MemberInfoController', ['$scope', '$state', '$location', '$translate', 'optionsServices', 'doctorMembersServices', function (
                $scope, $state, $location, $translate, optionsServices, doctorMembersServices) {

                var id = $state.params.id;
                $scope.MyMember = {};
                //查询
                $scope.onSearch = function (page) {
                    doctorMembersServices.get({ doctorMemberID: id }, function (obj) {
                        var d = obj.Data;
                        if (d != null) {
                            d.Age = getAge(d.Birthday);
                        }
                        $scope.MyMember = d;

                    });
                }
                $scope.onSearch();

            }
            ]);

            //就诊记录
            app.controller('OPDRegisterRecordsController', ['$scope', '$state', '$location', '$translate', 'optionsServices', 'doctorMembersServices', function (
                $scope, $state, $location, $translate, optionsServices, doctorMembersServices) {

                $scope.pageSize = 10;
                $scope.CurrentPage = 1;
                $scope.totalCount = 0;
                var id = $state.params.id;

                //查询就诊记录
                $scope.onSearch = function (page) {
                    doctorMembersServices.GetMyMemberVisitList({ DoctorMemberID: id, PageSize: $scope.pageSize, CurrentPage: $scope.CurrentPage }, function (obj) {

                        $scope.OPDRegisterRecords = obj.Data;
                        $scope.totalCount = obj.Total;

                    });
                }
            }
            ]);

            //会诊记录
            app.controller('ConsultationRecordsController', ['$scope', '$state', '$location', '$translate', 'optionsServices', 'consultationServices', function (
                $scope, $state, $location, $translate, optionsServices, consultationServices) {

                $scope.pageSize = 10;
                $scope.CurrentPage = 1;
                $scope.totalCount = 0;
                var id = $state.params.id;

                //查询会诊记录
                $scope.onSearch = function (page) {

                    consultationServices.getMemberConsultationRecords({
                        DoctorMemberID: id,
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.CurrentPage
                    }, function (obj) {

                        [].map.call(obj.Data, function (i) { i.GenderName = $scope.EnumGender[i.Gender]; });

                        $scope.ConsultationRecords = obj.Data;
                        $scope.totalCount = obj.Total;

                    });
                }

                $scope.EnumGender = {
                    "0": "男",
                    "1": "女",
                    "2": "未知"
                }

            }
            ]);

            //检查清单
            app.controller('CheckListController', ['$scope', '$state', '$location', '$translate', 'optionsServices', 'doctorMembersServices', 'UserInspectResultsServices', 'dcmViewer', function (
                $scope, $state, $location, $translate, optionsServices, doctorMembersServices, UserInspectResultsServices, dcmViewer) {

                var id = $state.params.id;
                $scope.pageSize = 10;
                $scope.CurrentPage = 1;
                $scope.totalCount = 0;

                //查询
                $scope.onSearch = function (page) {
                    UserInspectResultsServices.GetDoctorMemberInspectResults({
                        DoctorMemberID: id,
                        PageSize: $scope.pageSize,
                        CurrentPage: $scope.CurrentPage
                    }, function (obj) {
                        $scope.CheckListItems = obj.Data;
                        $scope.totalCount = obj.Total;
                    });
                };

                //打开影像
                $scope.onOpenCheckResult = function (item) {


                    dcmViewer.open({
                        patId: item.CaseID,
                        patName: item.CaseID,
                        stuUID: item.StuUID,
                        studyDate: item.InspectDate,
                    });
                }

                //显示更多
                $scope.audioFileClickMoreShow = function (content) {
                    angular.element('.doctor-introduction-allInformation-content').html(content);
                    $(".doctor-introduction-allInformation").fadeIn();
                }
                $scope.audioFileClickMoreHide = function ($event) {
                    $($event.target).closest('.doctor-introduction-allInformation').fadeOut();
                }
                //捕获 emited event(用来完成影像文件点击更多以后出现的弹出层)
                $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                    $('.more-parentTbody tr').each(function () {
                        var audioFile = $(this).find('.audioFile-status');
                        var doctorMore = audioFile.siblings('.doctor-introduction-more');
                        if (audioFile.height() > 60) {
                            audioFile.css({ height: 60 });
                            doctorMore.css({ display: 'inline-block' });
                        } else {
                            doctorMore.css({ display: 'none' });
                        }
                    })
                })
            }
            ]);

            //ng-repeat循环完成回调(用来完成影像文件点击更多以后出现的弹出层)
            app.directive('onFinishRender', ['$timeout', '$parse', function ($timeout, $parse) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        if (scope.$last === true) {
                            $timeout(function () {
                                scope.$emit('ngRepeatFinished'); //事件通知
                            });
                        }
                    }
                }
            }])

            //检验检查表
            app.controller('ExamineListController', ['$scope', '$state', '$location', '$translate', 'examItemsServices', 'doctorMembersServices', function (
                $scope, $state, $location, $translate, examItemsServices, doctorMembersServices) {

                //查询
                var id = $state.params.id;
                $scope.onSearch = function (page) {
                    doctorMembersServices.get({ doctorMemberID: id }, function (obj) {
                        var d = obj.Data;

                        $scope.MemberID = d.MemberID;
                        $scope.ExamineList = [];
                        $scope.UserMembers = [];
                        $scope.search = function () {
                            $scope.ExamineList = [];
                            if ($scope.MemberID) {

                                examItemsServices.query({ memberId: $scope.MemberID }, function (obj) {
                                    $scope.ExamineList = obj.Data;

                                });
                            }
                        };
                        //$scope.search();

                    });
                }
                $scope.onSearch();

            }
            ]);

            //健康档案
            app.controller('MyFamiliesController', ['$scope', '$state', '$location', '$translate', 'optionsServices', 'doctorMembersServices', function (
                $scope, $state, $location, $translate, optionsServices, doctorMembersServices) {

                $scope.pageSize = 10;
                $scope.CurrentPage = 1;
                $scope.totalCount = 0;
                var id = $state.params.id;

                //患者体验记录
                $scope.onSearch = function (page) {
                    doctorMembersServices.GetMemberExaminedList({ DoctorMemberID: id, PageSize: $scope.pageSize, CurrentPage: $scope.CurrentPage }, function (obj) {
                        $scope.MyFamiliesList = obj.Data.list.Data;
                        $scope.totalCount = obj.Data.list.Total;
                        $scope.idNumber = obj.Data.idNumber;

                    });
                }

                $scope.getExamType = function (str) {
                    switch (str) {
                        case "E01": return "一体机KM9000";
                        case "E02": return "中医体质";
                        case "E05": return "双佳KM9200";
                        case "E07": return "HIS";
                        case "E11": return "手表";
                        default: return "其它";
                    }
                }

                $scope.formatDate = function (dateStr) {
                    if (dateStr != null && dateStr != "")
                        return dateStr.substring(0, 10);
                    return "";
                }

                //体检详细
                $scope.showDetail = function (examId, examDate, doctor) {
                    $state.go("Doctor.ExaminedDetail", {
                        examId: examId,
                        idNo: $scope.idNumber,
                        examDate: encodeURIComponent((examDate != null && examDate != "") ? examDate.substring(0, 10) : ""),
                        doctor: encodeURIComponent(doctor == null ? "" : doctor)
                    });
                }
            }
            ]);

            //电子病历
            app.controller('MemberEMRsController', [
                '$scope',
                '$http',
                "$q",
                '$location',
                '$state',
                '$translate',
                'doctorMembersServices',
                'userMembersServices',
                'webapiServices',
                'optionsServices',
                function ($scope, $http, $q, $location, $state, $translate, services, userMembersServices, webapiServices, optionsServices) {

                    var id = $state.params.id;
                    $scope.IsDetail = false;
                    $scope.DoctorMemberID = id;
                    $scope.ListItems = [];
                    $scope.UserMembers = [];
                    $scope.pageIndex = 1;
                    $scope.pageSize = 10;
                    $scope.totalCount = 0;
                    $scope.search = function (page) {
                        $scope.IsDetail = false;
                        if (page) {
                            $scope.pageIndex = page;
                        }
                        services.GetDoctorMemberEMRs({
                            DoctorMemberID: id,
                            PageIndex: $scope.pageIndex,
                            PageSize: $scope.pageSize
                        }, function (obj) {
                            $scope.ListItems = obj.Data;
                            $scope.totalCount = obj.Total;
                        });
                    };

                    //详细
                    $scope.Data = {};
                    $scope.showDetail = function (id) {
                        services.GetDoctorMemberEMR({ userMemberEMRID: id },
                            function (response) {
                                if (response.Status == 0) {
                                    $scope.IsDetail = true;
                                    $scope.Data = response.Data;
                                }
                            },
                            function (response) {

                            });
                    };
                    $scope.goBack = function () {
                        $scope.IsDetail = false;
                    };
                }
            ]);

            //计算年龄
            function getAge(str) {

                var age = -1;
                if (str == null || str == "")
                    return age;

                var today = new Date();
                var todayYear = today.getFullYear();
                var todayMonth = today.getMonth() + 1;
                var todayDay = today.getDate();

                var birthday = new Date(str.substring(0, 4) + '/' + str.substring(5, 7) + '/' + str.substring(8));
                var birthdayYear = birthday.getFullYear();
                var birthdayMonth = birthday.getMonth() + 1;
                var birthdayDay = birthday.getDate();
                if (todayYear - birthdayYear < 0)
                    return age;

                if (todayMonth - birthdayMonth < 0) {
                    age = (todayYear - birthdayYear) - 1;
                } else if (todayMonth == birthdayMonth) {

                    if (todayDay - birthdayDay >= 0)
                        age = todayYear - birthdayYear;
                    else
                        age = todayYear - birthdayYear - 1;
                } else {
                    age = todayYear - birthdayYear;
                }

                return age;
            }

        });