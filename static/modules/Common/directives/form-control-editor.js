define(["jquery", "angular", "plugins-ueditor"], function ($, angular) {
    
    var app = angular.module("myApp", ['$timeout', "ui.bootstrap"]);

    app.directive('editor', function ($timeout) {

        return {
            restrict: 'EAC',
            scope: { content: "=ngModel" },
            link: function (scope, element, attr, ctrl) {
                
                element.attr("id", attr.id);

                var editor = new UE.ui.Editor({
                    minFrameHeight: 150,
                    imagePath: "",
                    elementPathEnabled: false
                });
                editor.render(element[0].id);

                //有时间差，慢的时候 scope.content 还没有值。最多等待30次
                var count = 1;
                var init = function(time){
                    if(scope.content!= undefined){
                        editor.ready(function () {
                            editor.setContent(scope.content);
                        });
                        return;
                    }
                    if(count>30){
                        return;
                    }
                    $timeout(init,time);
                }
                init(init, 300);
                //内容发送变化时
                editor.addListener("contentChange", function () {
                    //设置内容
                    scope.content = editor.getContent();
                    scope.$apply();
                });
            
            }
        };
    });
});