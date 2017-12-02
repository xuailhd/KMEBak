
var telePhoneReg = /^1[3|4|5|7|8]{1}\d{9}$/;
var veriCodeReg = /^[a-zA-Z\d]{4}$/;
var msgVeriCodeReg = /^[1-9]{1}\d{5}$/;
var passwordReg = /^\w{6,20}$/;


//发送验证码
var num = 0;
var j;

var sendmsBack = function (resposeStatus) {

    if (resposeStatus == 0) {
        num = 60;
        j = setInterval("calcSmsTime()", 1000);
        layer.msg("短信验证码发送成功");
    } else {
        layer.msg("短信验证码发送失败", { icon: 2, shade: 0.5 });
    }
    return false;
};

//倒计数过60秒可发送短信
function calcSmsTime() {
    num = num - 1;
    if (num > 0) {
        $("#msgVerifyCodBtn").val(num.toString() + " 秒后重新发送");
    } else {
        clearInterval(j);
        $("#msgVerifyCodBtn").val("获取验证码");
    }
};
define(["jquery",
        "plugins-layer",
        "module-services-apiUtil",
        "jquery-validate", "css!styles/layout.userRegister.css"], function ($, layer, apiUtil) {

            var userType = $('#userType').val();

            //检查相关一些格式
            $.validator.addMethod("userMobile", function (value, element) {
                return this.optional(element) || (telePhoneReg.test(value));
            }, "请输入正确手机号");

            $.validator.addMethod("userVerifyCode", function (value, element) {
                return this.optional(element) || (veriCodeReg.test(value));
            }, "请输入正确验证码");

            $.validator.addMethod("userMsgVerifyCode", function (value, element) {
                return this.optional(element) || (msgVeriCodeReg.test(value));
            }, "请输入正确短信验证码");

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
                    locationFindPwd();
                },
                rules: {
                    Mobile: {
                        required: true,
                        userMobile: true,
                    },
                    VerificationCode: {
                        required: true,
                        userVerifyCode: true
                    },
                    MsgVerifyCode: {
                        required: true,
                        userMsgVerifyCode: true
                    },
                },
                messages: {
                    Mobile: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入您的手机号码" : "Please input your mobile number",
                    },
                    VerificationCode: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入图形验证码" : "Please input verification code",
                    },
                    MsgVerifyCode: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入短信验证码" : "Please input short message verification code",
                    },
                }

            };

            $("#myForm").validate(formValid);

            //验证码默认隐藏
            $("#imgLoginVerify").hide();

            function refreshVerifyCode() {
                apiUtil.getAppToken(function (token) {
                    //重设验证码
                    $("#imgLoginVerify").attr("src", global_ApiConfig.CommonApiUrl + "/VerifyCodes?apptoken=" + token + "&name=loginPanelCode&" + Math.random()); //刷新验证码
                });
            }

            //验证码输入获取焦点的时候显示验证码
            $("body").on("focus", "#VerificationCode", function () {

                if (!$("#imgLoginVerify").is(":visible")) {
                    $("#imgLoginVerify").show();
                    refreshVerifyCode();
                }
            });

            //点击验证码刷新验证码
            $("body").on("click", "#imgLoginVerify", function () {

                refreshVerifyCode();

            });

            //发送验证码
            var SendSmsInfo = function () {
                var validMobile = $("#Mobile").valid();
                var validCode = $("#VerificationCode").valid();

                if (validMobile == false || validCode == false) {
                    return false;
                }

                SendSms();
                        
            }

            $('#msgVerifyCodBtn').click(function () {
                SendSmsInfo();
            })

            var SendSms = function () {
                var telephone = $.trim($("#Mobile").val());
                var data = {
                    Mobile: telephone,
                    UserType: userType,
                    VerifyCode: $("#VerificationCode").val(),
                    MsgType: 2,
                };
                if (num > 0) {
                    layer.msg("验证码发送频率太快，稍后再试", { icon: 2, shade: 0.5 });
                    return false;
                }
                apiUtil.requestWebApi("/Users/SendSmsCode", "Post", data, function (response) {
                    if (response.Status == 0) {
                        sendmsBack(response.Status);
                    } else {
                        layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                    }
                },
                function (response) {
                    if (response.Msg) {
                        layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                    }
                });
            }

            
            //用户找回后台验证
            var locationFindPwd = function () {
            
                var Data = {
                    UserType: userType,
                    Mobile: $('#Mobile').val(),
                    VerificationCode : $('#VerificationCode').val(),
                    MsgVerifyCode: $('#MsgVerifyCode').val(),
                    MsgType: "2"
                };

                apiUtil.requestWebApi("/users/UserFindPwdPre", "Post", Data, function (response) {
                    if (response.Status == 0) {
                        location.href = "/UserFindPwdNext?userid=" + response.Data + "&userType=" + userType;
                        return;
                    }
                    else {
                        layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                        return false;
                    }
                },
                function (response) {
                    if (response.Msg) {
                        layer.msg(response.Msg, { icon: 2, shade: 0.5 });
                    }
                });
            }
        });