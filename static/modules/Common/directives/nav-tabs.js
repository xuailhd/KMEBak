define(["jquery","angular"], function ($,angular) {

    var app = angular.module("myApp", ["ui.bootstrap"]);
    
    app.directive('navTabs', function () {

        return {
            restrict: 'EAC',
            scope: { active: "=active" },
            link: function (scope, $element, attr)
            {

                $element.addClass("radio-ban-list");

                $element.find("ul li a").click(function ()
                {
                    $element.find("ul li a").removeClass("current");
                    $(this).addClass("current");
                });

            }
        };
    });
});