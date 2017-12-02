define(["angular", "module-services-api"], function (angular) {


    var app = angular.module("myApp", []);

    app.directive("modalAssistantDiagnose", ["$translate", 'preview', 'doctorDiagnosisServices', function ($translate, preview,  doctorDiagnosisServices) {
        return {
            restrict: 'EA',
            replace:true,
            scope:{
                room: '=room'
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/modal-Assistant-Diagnose.html';
            },
            controller: ["$scope", function ($scope) {
               
                doctorDiagnosisServices.getAssistantDiagnosis({OPDRegisterID:$scope.room.ServiceID},function(rsp){

                    $scope.AnswerSheet=rsp.Data.AnswerSheet;
                    $scope.Summaries=rsp.Data.Summaries;

                },function(rsp){

                  

                });

                 $scope.$emit('CopiedPatientVisitRecord', $scope.HistoryRecordDetail);
               
            }],
            link: function ($scope, $element, attr) {

                
            }
        };
    }]);
});