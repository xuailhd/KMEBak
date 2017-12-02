"use strict";
define(["jquery",
        "plugins-layer",
        "module-services-apiUtil",
        "jquery-validate"], function ($, layer, apiUtil) {


            $("body").on("click", "#btn-Logout", function () {
                apiUtil.requestWebApi("/users/logout", "post", {}, function (response) {
                    //记录登录状态，在路由状态改变事件中会对此状态进行验证保证用户已登录
                    apiUtil.setloginType("Doctor");
                    apiUtil.setLoginInfo("loginInfo", "");
                    apiUtil.setLocalAppToken('');
                    location.href = '/Login';
                });
            });

            var VerificationID = "";

            var formValid = {

                errorElement: 'label',
                errorClass: 'error',
                focusInvalid: true,
                onfocusout: function (element) {
                    var t = $(element).valid();
                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent());
                    element.parents(".form-group").addClass("has-error");
                },
                success: function (element) {
                    element.parents(".form-group").removeClass("has-error");
                    element.remove();
                },
                submitHandler: function (form) {
                    //验证证件照
                    var uploadImgNum = $(".IDPhoto-cont img").length;
                    if (uploadImgNum < 3) {
                        layer.msg("请上传证件照，谢谢！");
                    } else {
                        onSubmit();
                    }

                },
                rules: {
                    DoctorName:{
                        required: true,
                    },
                    Title: {
                        required: true,
                        selected:true
                    },
                    IDNumber: {
                        required: true,
                        idNumber: true
                    },
                    Gender: {
                        required: true,
                        selected: true
                    },
                    DepartmentName: {
                        required: true
                    },
                    HospitalName: {
                        required: true
                    },
                    CertificateNo: {
                        required: true
                    },
                    Specialty: {
                        required: true
                    },
                    Intro: {
                        required: true
                    },
                },
                messages: {
                    DoctorName: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入您的姓名" : "Please input your name",
                    },
                    Title: {
                        required: global_CheckCurrentLang('zh-cn') ? "请选择您的职称" : "Please select your title",
                    },
                    IDNumber: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入身份证号码" : "Please input ID Card Number",
                    },
                    Gender: {
                        selected: global_CheckCurrentLang('zh-cn') ? "请选择您的性别" : "Please select your gender",
                    },
                    DepartmentName: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入您所在科室的名称" : "Please input your departmemt name",
                    },
                    HospitalName:{
                        required: global_CheckCurrentLang('zh-cn') ? "请输入您所在医院的名称" : "Please input your hospital name",
                    },
                    CertificateNo: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入您的执业证书编码" : "Please input your Certificate Number",
                    },
                    Specialty: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入个人擅长领域" : "Please input your personal specialty",
                    },
                    Intro: {
                        required: global_CheckCurrentLang('zh-cn') ? "请输入个人介绍" : "Please input your personal information",
                    }
                }

            };

            $("#myForm").validate(formValid);

            //获取数据。
            apiUtil.requestWebApi("/DoctorVerifications/GetVerificationInfo", "GET", null, function (response) {
                if (response.Data != undefined && response.Data.DoctorName != null) {
                    VerificationID = response.Data.VerificationID;
                    $('#DoctorName').val(response.Data.DoctorName);
                    $('#HospitalName').val(response.Data.HospitalName);
                    $('#DepartmentName').val(response.Data.DepartmentName);
                    $('#Title').val(response.Data.Title);
                    $('#Intro').val(response.Data.Intro);
                    $('#Specialty').val(response.Data.Specialty);
                    $('#IDNumber').val(response.Data.IDNumber);
                    $('#CertificateNo').val(response.Data.CertificateNo);
                    $('#IDURL').val(response.Data.IDURL);
                    $('#HandheldIDURL').val(response.Data.HandheldIDURL);
                    $('#CertificateURL').val(response.Data.CertificateURL);
                    $('#IDURLImg').attr('src', global_StoreConfig.UrlPrefix + response.Data.IDURL);
                    $('#HandheldIDURLImg').attr('src', global_StoreConfig.UrlPrefix + response.Data.HandheldIDURL);
                    $('#CertificateURLImg').attr('src', global_StoreConfig.UrlPrefix + response.Data.CertificateURL);
                    $('#Gender').val(response.Data.Gender);
                } 
            }, function () {
                //新增
                $(".IDPhoto-cont").find("img").remove();
            });

            $('#IDNumber').change(function () {
                setSex();
            })

            $('#IDNumber').mouseleave(function () {
                setSex();
            })

            $('#IDNumber').keyup(function () {
                setSex();
            })


            //根据身份证号自动填充性别
            var setSex = function () {
                if ($('#IDNumber').val() != "" && $("#IDNumber").valid()) {
                    var value = $('#IDNumber').val();
                    var Sex = GetSexFromIdCard(value);
                    $("#Gender").val(Sex).attr("disabled", "disabled").valid();
                    if ($("#Gender").siblings(".error").length>0) {
                        $("#Gender").siblings(".error").remove();
                    }
                } else {
                    $("#Gender").removeAttr("disabled");
                }
            };
            //根据身份证获取性别
            function GetSexFromIdCard(idCard) {
                var sex = "";
                if (idCard == null || (idCard.length != 15 && idCard.length != 18))
                    return false;
                //处理18位的身份证号码从号码中得到性别代码
                if (idCard.length == 18) {
                    sex = idCard.substr(14, 3);
                }
                //处理15位的身份证号码从号码中得到性别代码
                if (idCard.length == 15) {
                    sex = idCard.substr(12, 3);
                }
                //性别代码为偶数是女性奇数为男性
                if (parseInt(sex) % 2 == 0)
                    sex = "1";//女
                else
                    sex = "0";//男

                return sex;
            };
            var XToUp = function () {
                var number = $('#IDNumber').val().replace(/\s/g, '');
                if (number != null && (number.length == 15 || number.length == 18) && $("#IDNumber").valid()) {
                    $('#IDNumber').val(number.toUpperCase());
                }
            };
                
            $.validator.addMethod("idNumber", function (value, element) {
                if (value == null)
                    value = "";
                return this.optional(element) || (isIdCardNo(value.toUpperCase()));
            }, "身份证号不正确");

            $.validator.addMethod("selected", function (value, element) {
                if (value != "?") {
                    return true;
                }
                else {
                    return false;
                }

            }, "必须选择一项");
            /**
                * 身份证号码验证
                *
                */
            function isIdCardNo(num) {
                var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
                var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                var varArray = new Array();
                var intValue;
                var lngProduct = 0;
                var intCheckDigit;
                var intStrLen = num.length;
                var idNumber = num;
                if ((intStrLen != 15) && (intStrLen != 18)) {
                    return false;
                }

                // check and set value
                for (var i = 0; i < intStrLen; i++) {
                    varArray[i] = idNumber.charAt(i);
                    if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                        return false;
                    } else if (i < 17) {
                        varArray[i] = varArray[i] * factorArr[i];
                    }
                }

                if (intStrLen == 18) {
                    //check date
                    var date8 = idNumber.substring(6, 14);
                    if (isDate8(date8) == false) {
                        return false;
                    }
                    // calculate the sum of the products
                    for (var i = 0; i < 17; i++) {
                        lngProduct = lngProduct + varArray[i];
                    }
                    // calculate the check digit
                    intCheckDigit = parityBit[lngProduct % 11];
                    // check last digit
                    if (varArray[17] != intCheckDigit) {
                        return false;
                    }
                }
                else {        //length is 15
                    //check date
                    var date6 = idNumber.substring(6, 12);
                    if (isDate6(date6) == false) {

                        return false;
                    }
                }
                return true;
            };/**
                    * 判断是否为“YYMMDD”式的时期
                    *
                    */
            function isDate6(sDate) {
                if (!/^[0-9]{6}$/.test(sDate)) {
                    return false;
                }
                var year, month, day;
                year = parseInt("19" + sDate.substring(0, 2));
                month = sDate.substring(2, 4);
                day = sDate.substring(4, 6);
                if (year < 1700 || year > 2500) return false;
                if (month < 1 || month > 12) return false;
                if (day < 1 || day > 31) return false;
                return true
            };
            /**
              * 判断是否为“YYYYMMDD”式的时期
              *
              */
            function isDate8(sDate) {
                if (!/^[0-9]{8}$/.test(sDate)) {
                    return false;
                }
                var year, month, day;
                year = sDate.substring(0, 4);
                month = sDate.substring(4, 6);
                day = sDate.substring(6, 8);
                var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                if (year < 1700 || year > 2500) return false
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
                if (month < 1 || month > 12) return false
                if (day < 1 || day > iaMonthDays[month - 1]) return false
                return true
            };

            //upload photo
            var Uploading = false;

            function uploadFile(fileSelector, category, fnSuccess) {
                if ($.trim($(fileSelector).val()) != '') {
                    var filename = $.trim($(fileSelector).val());
                    filename = filename.substring(filename.lastIndexOf('\\') + 1);
                    var extStart = filename.lastIndexOf(".");
                    var ext = filename.substring(extStart, filename.length).toUpperCase();
                    if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                        alert("图片限于bmp,png,gif,jpeg,jpg格式");
                        return false;
                    }else{
                        Uploading = true;
                        var data = new FormData();
                        var files = $(fileSelector).get(0).files;

                        // Add the uploaded image content to the form data collection
                        if (files.length > 0) {
                            data.append("file", files[0]);
                        }
                        //加载层
                        var loading = layer.load(0, { shade: false }); //0代表加载的风格，支持0-2
                        apiUtil.requestWebApi(apiUtil.webStoreUrl+'/Upload/Image', 'POST', data, function (response) {
                            if (response != null) {
                                var data = response.Data;
                                if (response.Status == 0) {
                                    fnSuccess(data);
                                    var targetImgParent = $(fileSelector).parent().siblings(".IDPhoto-cont");
                                    if (targetImgParent.find("img").length > 0) {
                                        targetImgParent.find("img").attr("src", data.UrlPrefix + "/" + data.FileName);
                                    } else {
                                        var imgSrcVal = data.UrlPrefix + "/" + data.FileName,
                                            imgHTML = '<img src="' + imgSrcVal + '"/>';
                                        targetImgParent.append(imgHTML);
                                    };
                                }
                                else {
                                    layer.msg('上传文件:' + filename + '失败', { icon: 2, shade: 0.5, time: 1000 });
                                }
                            }
                            layer.close(loading);
                            Uploading = false;
                        },
                    function (response) {
                        if (response != null) {
                            // alert(response.Msg);
                        }
                        layer.close(loading);
                        Uploading = false;
                    });
                    }
                }
            };
            $("#IDCardfileinput").change(function () {
                var obj = this;
                uploadFile(obj, 'Certificate', function (data) {
                    $('#IDURL').val(data.FileName);
                    $('#IDURLImg').attr('src', data.UrlPrefix + data.FileName);
                });
                    
            });
            $("#handIDCardfileinput").change(function () {
                var obj = this;
                uploadFile(obj, 'Certificate', function (data) {
                    $('#HandheldIDURL').val(data.FileName);
                    $('#HandheldIDURLImg').attr('src', data.UrlPrefix + data.FileName);
                });
            });
            $("#praCertificatefileinput").change(function () {
                var obj = this;
                uploadFile(obj, 'Certificate', function (data) {
                    $('#CertificateURL').val(data.FileName);
                    $('#CertificateURLImg').attr('src', data.UrlPrefix + data.FileName);
                });
            });


            

            //submit
            var onSubmit = function () {
                var Data = {
                    VerificationID: VerificationID,
                    DoctorName: $('#DoctorName').val(),
                    HospitalName: $('#HospitalName').val(),
                    DepartmentName: $('#DepartmentName').val(),
                    Title: $('#Title').val(),
                    Intro: $('#Intro').val(),
                    Specialty: $('#Specialty').val(),
                    IDNumber: $('#IDNumber').val(),
                    CertificateNo: $('#CertificateNo').val(),
                    IDURL: $('#IDURL').val(),
                    HandheldIDURL: $('#HandheldIDURL').val(),
                    CertificateURL: $('#CertificateURL').val(),
                    Gender: parseInt($('#Gender').val())
                };

                apiUtil.requestWebApi("/DoctorVerifications/SubmitVerificationInfo", "POST", Data, function (response) {
                    if (response.Status == 0) {
                        //状态修改为 等待认证
                        var loginInfo = apiUtil.getLoginInfo();
                        loginInfo.CheckState = 4;
                        apiUtil.setLoginInfo(loginInfo);
                        layer.msg("操作成功");
                        location.href = "/AuthenticationWait"
                        return;
                    } else {
                        layer.msg("操作失败");
                    }
                }, function () {
                    layer.msg("操作失败");
                });
            };

        });