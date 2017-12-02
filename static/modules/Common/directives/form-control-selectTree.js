define(["jquery", "angular", "bootstrap", "bootstrap-select"], function ($, angular)
{
    var app = angular.module("myApp", ["ui.bootstrap"]);


    app.directive('selecttree', function () {

        return {
            restrict: 'EAC',
            scope: {
                value: "=ngModel",
                options: "=options",
                selecttree: "=selecttree"
            },
            replace:true,               
            link: function (scope, $element, attr)
            {
                scope.$watch("selecttree.options", function () {
                    
                    var parent = scope.selecttree.parent;
                    var text = scope.selecttree.text;
                    var value = scope.selecttree.value;

                    function BindTree(ParentId, result, options, prefix)
                    {
                        prefix = prefix || "";

                        for (var i = 0; i < options.length; i++) {

                            
                            if (options[i][parent] == ParentId) {
                                options[i][text] = prefix + options[i][text];

                                result.push(options[i]);

                                BindTree(options[i][value], result, options, prefix + '┊┈')
                            }

                        }
                    }

                    var newOptions = [];

                    
                    if (scope.selecttree.append) {
                        newOptions.push(scope.selecttree.append)
                    }

                    //树形下拉选择
                    BindTree(null, newOptions, scope.options)

                    scope.options = newOptions
                })
               
            }
        };
    });
});