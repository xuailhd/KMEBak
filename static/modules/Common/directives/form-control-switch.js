define(["angular",
    "jquery",
    "framework/bootstrap/js/bootstrap-switch",
    "css!framework/bootstrap/css/bootstrap-switch.css",
    "css!framework/bootstrap/css/bootstrap-switch-highlight.css"], function (angular, $) {

        var app = angular.module("myApp", ["ui.bootstrap"]);

        /*开关按钮*/
        app.directive('switch', function () {

            return {
                restrict: 'EAC',
                scope: {
                    model:"=ngModel",
                    onSwitchChange: "=onswitchchange",
                    size:"@size"
                },
                link: function (scope, $element, attr) {
                    
                    $element.not("[data-switch-no-init]").bootstrapSwitch({

                        //size:scope.size,
                        onSwitchChange: function (event, state)
                        {
                            scope.onSwitchChange(state, scope.model)
                            event.preventDefault();
                            return console.log(state, event.isDefaultPrevented());
                        }
                    });
                }

            }

        });
    });