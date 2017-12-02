define(["angular", "plugins-layer", "module-services-api", "module-Doctor-filter-all", "module-directive-preview"], function (angular, layer) {

    var app = angular.module("myApp", []);
    app.directive("modalServiceDetail", ["$translate", 'preview', 'userOPDRegistersServices', 'doctorDiagnosisServices', function ($translate, preview, userOPDRegistersServices, doctorDiagnosisServices) {
        return {
            restrict: 'EA',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Doctor/directives/modal-Service-Detail.html';
            },
            controller: ["$scope", function ($scope) {
                $scope.imageList = [];
                $('#modal-service-detail').on('show.bs.modal', function (event) {
                    var target = $(event.relatedTarget);
                    var id = target.data('id');

                    $(".service-detail")[0].scrollTop = 0;
                    $scope.imageList = [];

                    var loading = layer.load(0, { shade: [0.1, '#fff'] });
                    
                    userOPDRegistersServices.promise.get({ OPDRegisterID: id }).then(function (resp) {
                        $scope.opdRegister = resp.Data;

                        if (resp.Data.AttachFiles != null && resp.Data.AttachFiles.length != 0) {
                            $scope.imageList = resp.Data.AttachFiles.map(function (item) {
                                return {
                                    fileType: item.FileType,                                    
                                    url: item.UrlPrefix + "/" + item.FileUrl,
                                    remark: item.Remark
                                }
                            }).filter(function (item) {
                                return item.url != "";
                            });
                        }

                        return doctorDiagnosisServices.promise.get({ OPDRegisterID: id });

                    }).then(function (resp) {
                        layer.close(loading);
                        $scope.diagnoseRecipe = resp.Data;

                    })["catch"](function (resp) {
                        layer.close(loading);
                    });
                });

                $scope.onPreview = function (index, $event) {
                    if ($($event.target).parent().attr("href") != "")
                        return;

                    if (index >= $scope.imageList.length)
                        return;

                    if ($scope.imageList[index].fileType != 0)
                        return;

                    var imgs = $scope.imageList.map(function (item) {
                        return item;
                    }).filter(function (item) {
                        return item.fileType == 0;
                    });

                    if (imgs.length == 0)
                        return;

                    for (var i = 0; i < imgs.length; i++) {
                        if (imgs[i] == $scope.imageList[index]) {
                            index = i;
                        }
                    }

                    //打开预览窗口
                    preview.open({
                        imageList: imgs,
                        current: index
                    });
                }                
            }],
            link: function ($scope, $element, attr) {


            }
        };
    }]);
});