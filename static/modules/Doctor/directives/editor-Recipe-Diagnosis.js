define(["angular"], function (angular) {

    console.log("load editor-Recipe-Diagnosis.js")

    var app = angular.module("myApp", []);

    /*处方诊断*/
    app.directive('editorRecipeDiagnosis', ["$sce", '$translate', "$rootScope", "$filter", "$q", "sysDrugsServices", "sysICDsServices", function ($sce, $translate, $rootScope, $filter, $q, sysDrugsServices, sysICDsServices) {
        return {
            restrict: 'EAC',
            scope: {
                Diagnosis: "=diagnosis",
                type:"=type"
            },
            templateUrl: function (element, attrs) {
                
                return attrs.templateUrl || '/static/modules/Doctor/directives/editor-Recipe-Diagnosis.html';
            },
            link: function ($scope, $element, attr) {
           
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
               
                //添加一条诊断记录
                $scope.onAddICDRecord = function () {

                    if (!$scope.Diagnosis)
                        $scope.Diagnosis = [];

                    $scope.Diagnosis.push({
                        "Detail": {
                            "ID": 0, "DiseaseCode": "", "DiseaseName": ""
                        }, "Description": ""
                    });
                }

                //删除一条诊断记录
                $scope.onRemoveICDRecord = function (item) {


                    //询问框
                    var dialog = layer.confirm('确认删除吗？', { btn: ['确认', '取消'] }, function () {
                        var index = $scope.Diagnosis.indexOf(item);
                        $scope.Diagnosis.splice(index, 1);
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

                            response.Data=response.Data.filter(function (item) {

                                //已经存在诊断不显示
                                if ($scope.Diagnosis.filter(function (icd) {
                                 
                                    return icd.Detail.DiseaseCode == item.DiseaseCode;

                                }).length > 0) {
                                 
                                    return false;
                                }
                                else {
                                    
                                    return true;
                                }
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
                    item.Detail = $model;
                }

            
            }
        };

    }]);


});