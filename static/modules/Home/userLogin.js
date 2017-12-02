define(["jquery",
        "plugins-layer",
        "module-services-apiUtil",
        "jquery-validate",
        "css!styles/layout.login.css"], function ($, layer, apiUtil) {

            //登录提交按钮
            var login = function () {

                var Data = {};

                //用户账号
                Data.Mobile = $("#UserID").val();
                //密码
                Data.Password = $("#Password").val();
                //验证码
                Data.VerifyCode = $("#VerificationCode").val();

                Data.UserType = $('#UserType').val();


                //请求 网络医院验证
                apiUtil.requestWebApi("/users/Login", "post", Data, function (response) {

                    //显示验证码
                    if (response.Data != null && response.Data.IsInputVerifyCode) {
                        $("#divLoginVerify").show();
                    } else {
                        $("#divLoginVerify").hide();
                    }

                    //登录成功
                    if (response.Status == 0) {
                        //记录登录状态，在路由状态改变事件中会对此状态进行验证保证用户已登录                          
                        apiUtil.setUserToken(response.Data.UserToken)
                        //SPA应用需要使用
                        apiUtil.setLoginInfo(response.Data);
                        if (response.Data.UserType == '2') {
                            location.href = '/Index';
                        }
                        else if (response.Data.UserType == '4') {
                            location.href = '/Index';
                        }
                        else if (response.Data.UserType == '1') {
                            location.href = '/Index';
                        }
                        return;
                    }
                    else {
                        refreshVerifyCode();
                        layer.msg(response.Msg);
                    }
                }, function (response) {
                    // layer.msg(res.Msg, { icon: 2, shade: 0.5 });
                    refreshVerifyCode();
                    layer.msg(response.Msg);
                });

                return false;
            }

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
                submitHandler: login,
                rules: {
                    UserID: {
                        required: true,
                        minlength: 2
                    },
                    Password: {
                        required: true,
                        minlength: 6
                    },
                    VerificationCode: {
                        required: true
                    },
                },
                messages: {
                    UserID: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入登陆账号或手机号" : "Please input your login account or mobile number",
                        minlength: global_CheckCurrentLang('zh-cn') ? "长度不能小于2" : "The length should be more than 2"
                    },
                    Password: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入登陆密码" : "Please input the login password",
                        minlength: global_CheckCurrentLang('zh-cn') ? "长度不能小于6" : "The length should be more than 6"
                    },
                    VerificationCode: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入图形验证码" : "Please input a graphic verification code",
                    },
                }

            };

            //验证码默认隐藏
            $("#imgLoginVerify").hide();
            $("#divLoginVerify").hide();

            $("#loginform").validate(formValid);

            //点击验证码刷新验证码
            $("body").on("click", "#imgLoginVerify", function () {

                refreshVerifyCode();

            });

            //验证码输入获取焦点的时候显示验证码
            $("body").on("focus", "#VerificationCode", function () {

                if (!$("#imgLoginVerify").is(":visible")) {
                    $("#imgLoginVerify").show();
                    refreshVerifyCode();
                }
            });

            function refreshVerifyCode() {
           
                apiUtil.getAppToken(function (token) {
                    //重设验证码
                    $("#imgLoginVerify").attr("src", global_ApiConfig.CommonApiUrl + "/VerifyCodes?apptoken=" + token + "&name=loginPanelCode&" + Math.random()); //刷新验证码
                });
            }
        });