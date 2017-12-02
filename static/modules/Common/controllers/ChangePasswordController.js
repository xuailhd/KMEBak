define(["module-services-api",
        "module-directive-form-validate"], function () {

            var app = angular.module("myApp", [
            "pascalprecht.translate",
            'ui.router',
            "ui.bootstrap",
            "ngAnimate"]);

            app.controller('ChangePasswordController', [
                '$scope',
                 '$state',
                '$translate',
                'webapiServices',
            function ($scope, $state, $translate, webapiServices) {
                $scope.Data = {};
                $scope.Data.OldPassword = "";
                $scope.Data.NewPassword = "";
                $scope.Data.ConfirmPassword = "";

                //表单验证
                $("#myForm").validate({
                    submitHandler: function (form) {
                        $scope.onSubmit();
                    }
                });

                $scope.onSubmit = function () {
                    //检查密码和新密码
                    if ($scope.Data.NewPassword == $scope.Data.OldPassword) {
                        layer.msg("新密码不能与旧密码相同", { icon: 2, shade: 0.5 });
                        return false;
                    }
                    webapiServices.changePassword($scope.Data,
                        function (response) {
                            if (response.Status == 0) {
                                layer.msg(response.Msg);
                            } else {
                                layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                            }
                            $scope.Data.OldPassword = "";
                            $scope.Data.NewPassword = "";
                            $scope.Data.ConfirmPassword = "";
                        },
                        function (response) {
                            layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                        }
                    );
                }
            }
            ]);

        });

