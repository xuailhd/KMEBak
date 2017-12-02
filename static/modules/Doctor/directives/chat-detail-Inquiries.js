define(["angular",
        "module-services-api",
        "module-directive-chat-content"], function (angular, apiUtil) {

            console.log("load chat-detail-Inquiries.js")

            var app = angular.module("myApp", []);

            app.directive('chatDetailInquiries', ['$state', '$translate', 'doctorDiagnosisServices', "userMembersServices",
                       function ($state, $translate, doctorDiagnosisServices, userMembersServices) {
                           return {
                               restrict: 'EA',
                               require: "?^chatDetail",
                               scope: {
                                   OPDRegisterID: '=registerId',
                                   onLoad: '@onLoad',
                               },
                               templateUrl: function (element, attrs) {
                                   return attrs.templateUrl || '/static/modules/Doctor/directives/chat-detail-Inquiries.html';
                               },
                               link: function ($scope, $element, attr, pCtrl) {
                                   var onLoad = function (ServiceID) {
                                       //获取诊断结果、处方集
                                       doctorDiagnosisServices.get({
                                           OPDRegisterID: ServiceID
                                       }, function (obj) {

                                           //病历
                                           $scope.MedicalRecord = obj.Data.MedicalRecord;                                   
                                           //体格检查
                                           $scope.PhysicalExam = obj.Data.PhysicalExam;
                                           //处方
                                           $scope.RecipeFiles = obj.Data.RecipeList;

                                           if (obj.Data.RecipeList != null) {
                                               $.each(obj.Data.RecipeList, function (i, d) {
                                                   switch (d.RecipeType) {
                                                       case 1: d.RecipeTypeName = "中药处方"; break;
                                                       case 2: d.RecipeTypeName = "西药处方"; break;
                                                       default: d.RecipeTypeName = "其它处方"
                                                   }
                                               })
                                           }

                                           //获取患者基本信息
                                           userMembersServices.get({
                                               ID: obj.Data.MemberID
                                           }, function (response) {
                                               $scope.patientInfo = response.Data;
                                               $scope.patientInfo.GenderName = response.Data.Gender == 0 ? "男" : "女";
                                               $scope.patientInfo.Age = getAge(response.Data.Birthday);
                                           });

                                           //layer.close(loading)

                                       }, function () {
                                           //layer.close(loading)
                                           //layer.msg("加载患者病历失败")
                                       });
                                   }

                                   if (pCtrl)
                                       pCtrl[$scope.onLoad] = onLoad;

                                   if ($scope.OPDRegisterID)
                                       onLoad($scope.OPDRegisterID);
                               }
                           };
                       }]);

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