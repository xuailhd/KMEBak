define(["angular",
        "module-directive-form-validate",
        "jquery-inputmask"], function () {

    console.log("load chat-detail-diagnose.js")

    var app = angular.module("myApp", []);

    app.directive('inputmask', function () {

        return {
            restrict: 'EAC',
            scope: {
                mask: "@mask"
            },
            link: function (scope, $element, attr) {

                if (attr.mask != "")
                    $element.inputmask(attr.mask);

            }
        };
    });

    app.directive('editorDiagnose', [
                "$http",
                "$q",
               "$state",
               '$translate',
               function (
                   $http,
                   $q,
                   $state,
                   $translate,
                   $interval) {

                   return {
                       restrict: 'EA',
                       scope: {
                            Diagnose: '=diagnose',
                            isReadOnly: '=isReadOnly',
                            template: '=template'
                       },
                       templateUrl: function (element, attrs) {                    
                       
                           return attrs.templateurl || '/static/modules/Doctor/directives/editor-Diagnose-Template2.html';
                       },
                       link: function ($scope, $element, attr, pCtrls) {
                       
                           $scope.isShowMore = false;
                           /*
                           if (!$scope.Diagnose.PhysicalExam || !$scope.Diagnose.PhysicalExam.length<=0) {
                               $scope.Diagnose.PhysicalExam = [{
                                   "ItemCode": "BloodPressure",
                                   "ItemCNName": "血压",
                                   "ItemENName": "BloodPressure",
                                   "Result": "",
                                   "RefRange": "",
                                   "Unit": "mmHg",
                                   "Value": "1"
                               },
                                {
                                    "ItemCode": "Breathe",
                                    "ItemCNName": "呼吸",
                                    "ItemENName": "Breathe",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "次/分",
                                    "Value": "2"
                                },
                                {
                                    "ItemCode": "GLU",
                                    "ItemCNName": "空腹血糖",
                                    "ItemENName": "GLU",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "mmol/L",
                                    "$$hashKey": "object:261"
                                },
                                {
                                    "ItemCode": "HeartRate",
                                    "ItemCNName": "心率",
                                    "ItemENName": "HeartRate",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "次/分"
                                },
                                {
                                    "ItemCode": "Height",
                                    "ItemCNName": "身高",
                                    "ItemENName": "Height",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "cm"
                                },
                                {
                                    "ItemCode": "PBG",
                                    "ItemCNName": "餐后血糖",
                                    "ItemENName": "PBG",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "mmol/L"
                                },
                                {
                                    "ItemCode": "TC",
                                    "ItemCNName": "总胆固醇",
                                    "ItemENName": "TC",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "mmol/L"
                                },
                                {
                                    "ItemCode": "Temperature",
                                    "ItemCNName": "体温",
                                    "ItemENName": "Temperature",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "℃"
                                },
                                {
                                    "ItemCode": "Waistline",
                                    "ItemCNName": "腰围",
                                    "ItemENName": "Waistline",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "cm"
                                },
                                {
                                    "ItemCode": "Weight",
                                    "ItemCNName": "体重",
                                    "ItemENName": "Weight",
                                    "Result": "",
                                    "RefRange": "",
                                    "Unit": "kg"
                                }]
                           }*/
                       }
                   };
               }]);

});