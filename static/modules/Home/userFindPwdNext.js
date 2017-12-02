var passwordReg = /^[\w\d]{6,20}$/;
var conformPasswordReg = /^[\w\d]{6,20}$/;

define(["jquery",
        "plugins-layer",
        "module-services-apiUtil",
        "jquery-validate", "css!styles/layout.userRegister.css"], function ($, layer, apiUtil) {

            var userType = $('#userType').val();
            var Id = $('#userID').val();

            //检查相关一些格式
            $.validator.addMethod("userPassword", function (value, element) {
                return this.optional(element) || (passwordReg.test(value));
            }, "密码为6－20位字母、字数、下划线");
            $.validator.addMethod("userConfirmPassword", function (value, element) {
                return this.optional(element) || (passwordReg.test(value));
            }, "确认密码为6－20位字母、字数、下划线");

            var formValid = {

                errorElement: 'label',
                errorClass: 'error',
                focusInvalid: true,
                onfocusout: function (element) {
                    var t = $(element).valid();
                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent());
                    element.parents(".loginInput").addClass("has-error");
                },
                success: function (element) {
                    element.parents(".loginInput").removeClass("has-error");
                    element.remove();
                },
                submitHandler: function (form) {
                    userSetPwd();
                },
                rules: {
                    Password: {
                        required: true,
                        userPassword: true,
                    },
                    ConfirmPassword: {
                        required: true,
                        userConfirmPassword: true,
                        equalTo:'#Password'
                    },
                },
                messages: {
                    Mobile: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入密码" : "Please input your password",
                    },
                    ConfirmPassword: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入确认密码" : "Please input verification code",
                        equalTo: global_CheckCurrentLang('zh-cn') ? "确认密码必须与密码一致": "Comfirm password should equal to password"
                    },
                }

            };

            $("#myForm").validate(formValid);

            

            var userSetPwd = function () {
                var Data = {
                    Id: Id,
                    Password: $('#Password').val(),
                };
              
                apiUtil.requestWebApi("/users/userFindPwdNext", "Post", Data, function (response) {
               
                    if (response.Status == 0) {
                        layer.msg(response.Msg);
                        if (userType == 1){
                            location.href = "/Login";
                        }
                        else if (userType == 2){
                            location.href = "/Login";
                        }
                        else if (userType == 4) {
                            location.href = "/Login";
                        }
                        // $state.go("User.Home");
                    }
                    else {
                        layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                        return false;
                    }
                },
                function (response) {
                
                    layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                });
            }
        });