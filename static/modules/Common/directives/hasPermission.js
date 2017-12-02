define(["angular"], function (angular) {

    //权限控制指令
    angular.module('myApp').directive('hasPermission',["permissions", function (permissions)
    {
        return {
            link: function (scope, element, attrs)
            {
                var value = attrs.hasPermission.trim();
                var notPermissionFlag = value[0] === '!';

                if (notPermissionFlag) {
                    value = value.slice(1).trim();
                }

                function toggleVisibilityBasedOnPermission()
                {
                    var hasPermission = permissions.hasPermission(value);

                    if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
                        element.show();
                    else
                        element.hide();
                }

                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    }]);

})