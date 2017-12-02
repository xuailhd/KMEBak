define(["angular","jquery","module-services-apiUtil"], function (angular,$,apiUtil)
{
    var app = angular.module("myApp", ["ui.bootstrap"]);

    var captureObj = null;

    app.directive("capture", ["$document", "$translate", function (e, $translate) {
        
        return {
            restrict: "EA",
            replace:true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/Capture.html';
            },
            scope: {
                onUpload: "=onupload"               
            },
            link: function (scope, $element, attr)
            {

                //不支持Edge浏览器
                if (window.navigator.userAgent.indexOf("Edge") !== -1) {
                    $element.remove();
                }

                //用户点击截图按钮
                scope.onCapture = function (handler) {
                  
                    handler = handler || StartCapture;

                    if (!captureObj)
                    {
                        console.log("网页截图：开始加载插件")

                        //加载插件
                        require(["plugins-sdk-Capture"], function (NiuniuCaptureObject) {

                            console.log("网页截图：开始初始化")

                            captureObj = new NiuniuCaptureObject();
                            captureObj.NiuniuAuthKey = "niuniu";
                            //此处可以设置相关参数 
                            captureObj.TrackColor = rgb2value(255, 0, 0);
                            captureObj.EditBorderColor = rgb2value(0, 0, 255);
                            //设置控件加载完成以及截图完成的回调函数
                            captureObj.FinishedCallback = function (type, x, y, width, height, info, content, localpath) {

                                
                                if (type < 0) {
                                    //需要重新安装控件
                                    InstallPlugin();
                                    return;
                                }

                                switch (type) {
                                    case 1:
                                        {
                                            UploadData(content);
                                            break;
                                        }
                                    case 2:
                                        {
                                            //您取消了截图
                                            break;
                                        }
                                    case 3:
                                        {
                                            //您保存了截图到本地                                          
                                            break;
                                        }
                                    case 4:
                                        {
                                            if (info == '0')
                                            {
                                                console.log("网页截图：从剪贴板获取到了截图")                                             
                                                UploadData(content);                 
                                            }
                                            else
                                            {
                                                //从剪贴板获取图片失败
                                            }
                                            break;
                                        }
                                }
                            };
                            captureObj.PluginLoadedCallback = function (success) {

                            };
                            //初始化控件 
                            captureObj.InitNiuniuCapture();

                          
                            handler();
                        })
                    }
                    else
                    {
                        handler();
                    }

                }

                //上传Base64数据到服务端保存
                var UploadData = function (content) {
                 
                    if (scope.onUpload) {

                        scope.onUpload({
                            file: { name: "", size: 0 },
                            fileType: "Image",
                            reader: { result: "data:image/jpg;base64," + content }
                        }, function (okCallback, failCallback) {


                            apiUtil.getAppToken(function (tokenStr) {
                                var appToken = tokenStr;
                                var noneStr = apiUtil.getNonceStr();
                                var userToken = apiUtil.getUserToken();
                                var sign = apiUtil.getSign(appToken, noneStr, userToken);
                                //上传的数据除了图片外，还可以包含自己需要传递的参数 
                                var data = "content=" + encodeURIComponent(content);

                                //上传
                                $.ajax({
                                    type: "POST",
                                    url: apiUtil.webStoreUrl + "/Upload/ImageByBase64",
                                    dataType: "json",
                                    data: data,
                                    headers: {
                                        "apptoken": appToken,
                                        "noncestr": noneStr,
                                        "usertoken": userToken,
                                        "sign": sign
                                    },
                                    success: function (response) {

                                        if (response.Status == 0) {

                                            console.log("upload success")

                                            if (okCallback)
                                                okCallback(response)

                                        }
                                        else {
                                            console.log("upload fail")

                                            if (failCallback)
                                                failCallback(response)
                                        }

                                    },
                                    error: function (err) {

                                        console.error("upload error")

                                        if (failCallback)
                                            failCallback(err)
                                    },
                                });
                            }, function (err) {
                                if (scope.failCallback)
                                    scope.failCallback(err)

                                console.error("get app token error")
                            });


                        });

                    }
                    else
                    {
                        console.error("not Implement onUpload Function")
                    }
                }

                //开始截图
                var StartCapture = function ()
                {
                    console.log("网页截图：开始截图")

                    var captureRet = captureObj.DoCapture("1.jpg", 0, 0, 0, 0, 0, 0);

                    if (!captureRet) {

                        console.log("网页截图：没有安装控件")

                        //提示用户安装插件
                        InstallPlugin();
                    }
                }

                var ParseImageClipboard = function ()
                {
                    console.log("网页截图：开始从剪贴板获取图片")

                    var captureRet = captureObj.DoCapture("", 0, 4, 0, 0, 0, 0);

                    
                    if (!captureRet) {

                        console.log("网页截图：没有安装控件")

                        //提示用户安装插件
                        InstallPlugin();
                    }
                }

                //根据是否是Chrome新版本来控制下载不同的控件安装包
                var InstallPlugin = function () {

                    var downloadUrl = "";
                    var message = $translate.instant("Room-lblCaptureInstallMessage");
                    //开始下载安装包
                    var date = new Date();

                    if (!captureObj.IsNeedCrx())
                    {
                        downloadUrl = "http://www.ggniu.cn/download/CaptureInstall.exe";
                    }
                    else
                    {
                        downloadUrl = "http://www.ggniu.cn/download/CaptureInstallChrome.exe";
                    }

                    $('#iframe_downCapture').attr('src', downloadUrl + "?" + date.getMinutes() + date.getSeconds());

                    var dialog = layer.confirm(message, {
                        //暗转提示
                        title: $translate.instant("lblInstallTitle"),
                        btn: [
                            $translate.instant("btnClose"),//关闭
                            $translate.instant("btnInstallCompleted")//安装完成
                        ] //按钮
                       
                    }, function ()
                    {
                        layer.close(dialog)
                    }, function ()
                    {
                        ReloadPlugin();
                    });
                }

                /*
                    当提示安装控件后，需要重新加载控件来使用截图；
                    也有部分是需要刷新浏览器的
                */
                var ReloadPlugin = function ()
                {
                    //如果是Chrome42以上版本，此处需要刷新页面才能让扩展在此页面上生效 
                    if (captureObj.IsNeedCrx())
                    {
                        //刷新页面
                        location.reload();
                        return;
                    }

                    //重新加载插件
                    captureObj.LoadPlugin();

                    //检查插件是否有效
                    if (captureObj.pluginValid())
                    {   
                        StartCapture();

                        console.log("截图插件：截图控件已经安装完毕，您可以进行截图了。");
                    }
                    else
                    {
                        
                        //查看控件是否被浏览器阻止
                        var browserInfo = $translate.instant("Room-lblCaptureInstallFailMessage_defaultBrowserInfo");
                        var brow = $.browser;
                        var bInfo = "";
                        try {
                            if (brow.msie) {
                                // "通过浏览器设置中的加载项查看NiuniuCapture是否加载并正常运行";
                                browserInfo = $translate.instant("Room-lblCaptureInstallFailMessage_msieBrowserInfo")
                            }
                            else if (brow.mozilla) {
                                //"请检查浏览器地址拦下是否有询问是否启用控件的提示，如果有，则允许控件运行；或者在地址拦中键入<strong>about:addons</strong>来启用NiuniuCapture控件";
                                browserInfo = $translate.instant("Room-lblCaptureInstallFailMessage_mozillaBrowserInfo");
                            }
                            else if (brow.safari) {
                                //"请检查浏览器地址拦下是否有询问是否启用控件的提示，如果有，则允许控件运行；或者在地址拦中键入<strong>chrome://plugins</strong>来启用NiuniuCapture控件";
                                browserInfo = $translate.instant("Room-lblCaptureInstallFailMessage_safariBrowserInfo")
                            }
                        }
                        catch (e)
                        {
                            console.error(e);
                        }

                        // '截图控件未能识别到，请按如下步骤检查:<br/>1. 确定您已经下载控件安装包并正常安装 <br/>2. <br/>3. 刷新页面或重新启动浏览器试下<br/>';
                        var message = $translate.instant("lblCaptureInstallFailMessage_Prefix") + browserInfo + $translate.instant("lblCaptureInstallFailMessage_Suffix")

                        var dialog = layer.confirm(message, {
                            title: $translate.instant("lblInstallTitle"),
                            btn: [$translate.instant("btnClose"), $translate.instant("btnInstallCompleted")] //按钮

                        }, function ()
                        {
                            layer.close(dialog)

                        }, function ()
                        {
                            ReloadPlugin();

                        });
                    }
                }

                // 读取剪贴板Image数据
                var readImage = function (item, onLoadCallback) {
                    var file = item.getAsFile();
                    var reader = new FileReader();

                    // 读取文件后将其显示在网页中
                    reader.onload = function (e) {
                        if (onLoadCallback != null)
                            onLoadCallback(e.target.result);
                    };
                    // 读取文件
                    reader.readAsDataURL(file);
                };

                if (window.pasteEvent == undefined) {
                    window.pasteEvent = function (e) {
                        if (!(e.clipboardData && e.clipboardData.items)) {
                            return;
                        }

                        var item = null;
                        var types = e.clipboardData.types || [];
                        for (var i = 0; i < types.length; i++) {
                            if (types[i] === 'Files') {
                                item = e.clipboardData.items[i];
                                break;
                            }
                        }

                        if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
                            // 读取该图片            
                            readImage(item, function (content) {


                                UploadData(content.replace("data:image/png;base64,", ""));
                            });
                        }
                    }
                }

                $(document)[0].removeEventListener("paste", window.pasteEvent);
                $(document)[0].addEventListener("paste", window.pasteEvent);
            }
        }
    }])

});

