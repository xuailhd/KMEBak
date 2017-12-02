define(["angular",
        "angular-ui-bootstrap",
        "module-directive-pager"], function (angular) {

            var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

            app.controller("gridController", ["$scope", "$attrs", "$parse", function ($scope, $attrs, $parse) {

              
                //方法
                $scope.fn = {};

     

                //搜索关键字
                $scope.searchText = "";

                //排序列
                $scope.sortBy = "";

                //倒序
                $scope.sortReverse = false;
          

                //是否已经全选（默认没有）
                $scope.isSelectAll = false;

                $scope.fn.link = function (item, column) {

                    return item[column];

                }

                $scope.fn.linkUnique = function (item) {

                    var uid = "";

                    for (var i = 0; i <= $scope.datalist.columns.length; i++) {

                        if ($scope.datalist.columns[i].uniqueId) {

                            uid = item[$scope.datalist.columns[i].field];
                            break;
                        }

                    }


                    return uid;

                }

                //选择一条
                $scope.fn.onSelectedRecord = function (item) {
                    var p = $scope.datalist.list.contains(item);

                    p.selected = true;

                }

                //双击选中行
                $scope.fn.onDblClickSelectedRecord = function (item) {
                    item.selected = !item.selected;
                }

                //选择所有
                $scope.fn.onSelectedAllRecotd = function () {

                    $scope.fn.isSelectAll = !$scope.fn.isSelectAll;

                    var list = $scope.datalist.list;

                    for (var i = 0; i < list.length; i++) {
                        list[i].selected = $scope.fn.isSelectAll;
                    }
                }

                //排序
                $scope.fn.onSortBy = function (column) {
                    //不按照标识列排序
                    if (!column.uniqueId) {

                        $scope.sortBy = column.field;
                        $scope.sortReverse = !$scope.sortReverse;
                    }
                }

                //编辑
                $scope.fn.onEdit = function (item) {                  
                    
                    $scope.$emit("onEdit", item);
                }

                var watch = $scope.$watch('pageSize', function (newValue, oldValue, scope) {
                    
                    if (newValue != oldValue) {
                        $scope.ngChange();
                    }
                });

                var watch = $scope.$watch('page', function (newValue, oldValue, scope) {
                    
                    if (newValue != oldValue) {
                        $scope.ngChange();
                    }
                });

            }])
            .directive('grid', ["$parse", function ($parse) {

                return {
                    restrict: 'EA',
                    transclude: true,
                    replace: true,
                    templateUrl: function (element, attrs) {
                        return attrs.templateUrl || 'module/directives/grid.html';
                    },
                    scope: {
                        page: "=",
                        pageSize: "=",
                        totalCount: "=",
                        datalist: "=ngModel",
                        ngChange: "&",
                        cardView:"="
                    },
                    controller: "gridController",
                    require: ["ngModel"],
                    link: function (scope, elem, attrs, rs) {

                        

                    }
                };

            }]);


        });