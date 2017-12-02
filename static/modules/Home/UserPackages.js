"use strict";
define(["jquery",
        "module-services-apiUtil",
        "plugins-layer",
        "bootstrap"
], function ($, apiUtil, layer) {

    $('.btn-buy[user-package-id]').each(function () {
        $(this).click(function () {
            buyPackage($(this).attr('user-package-id'));
        });
    });
    var buyPackage = function (userPackageId) {
        //加载层
        var loading = layer.load(0, { shade: false }); //0代表加载的风格，支持0-2
        ///检查登录
        apiUtil.requestWebApi("users/IsLogin", "get", { userType: 1 }, function (response) {
            //验证是否登录了
            if (response.Status == 0 && response.Data == true) {
                apiUtil.requestWebApi("UserPackageConsumes/CreateOrder?userPackageId=" + userPackageId, "POST", null, function (response) {
                    if (response.Status == 0) {
                        if (response.Data && response.Data.OrderNO && response.Data.OrderNO != "") {
                            //确认订单
                            window.location.href = '/Trade/Order/Confirm?OrderNo=' + response.Data.OrderNO
                        }
                        else {
                            layer.msg('订单号无效！', { icon: 2, shade: 0.5 })
                        }
                    }
                    else {
                        layer.msg(response.Msg, { icon: 2, shade: 0.5 })
                    }
                    layer.close(loading);

                }, function (response) {
                    layer.close(loading);
                    layer.msg(response.Msg, { icon: 2, shade: 0.5 })
                });

            }//没登录进行跳转到登录页面
            else if (response.Data == false) {
                layer.close(loading);
                $("#imgLoginVerify").attr("src", $("#imgLoginVerify").attr("src") + "?" + Math.random()); //刷新验证码
                $('#LoginModal').modal('show');
            } else {
                layer.msg(response.Msg, { icon: 2, shade: 0.5 })
            }
        }, function () {
            layer.close(loading);
        });
    };
    /*add active*/
    var navLen = $(".nav-ban ul li a").length - 5;
    $(".nav-ban ul li a").eq(navLen).addClass("active").siblings().removeClass("active");
    $(".personCenter").removeClass("active");
});