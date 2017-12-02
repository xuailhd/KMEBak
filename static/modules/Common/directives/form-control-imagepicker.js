define(["jquery", "angular", "bootstrap", "jquery-uploadfy"], function ($, angular)
{
    var app = angular.module("myApp", [
          "pascalprecht.translate",
          'ui.router',
          "ui.bootstrap",
          "ngAnimate"]);

    app.directive('imagepicker', function () {

        return {
            restrict: 'EAC',
            scope: {
                value: '=ngValue'
            },
            link: function (scope, $element, attr) {
                
                $element.attr("id", attr.id);
                
                $element.uploadify({
                    'height': 27,
                    'width': 80,
                    'buttonText': '上传图片',
                    'swf': 'framework/plugins/uploadfy/uploadify.swf',
                    "uploader": "../api/Ueditor?action=uploadimage",
                    'auto': true,
                    'multi': false,
                     fileObjName:"upfile",
                    'removeCompleted': false,
                    'cancelImg': 'framework/plugins/uploadfy/uploadify-cancel.png',
                    'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png',
                    'fileSizeLimit': '2MB',
                    'onUploadSuccess': function (file, data, response)
                    {
                        //"{"state":"SUCCESS","url":"/image/20160508/6359826364202208739832548.jpg","title":"德润堂微信订阅号二维码8cm.jpg","original":"德润堂微信订阅号二维码8cm.jpg","error":null}"

                        data = eval("(" + data + ")");
                        
                        if (data.state == "SUCCESS")
                        {
                            scope.value = "/upload"+data.url
                            scope.$apply();
                        }
                    },
                    //加上此句会重写onSelectError方法【需要重写的事件】
                    'overrideEvents': ['onSelectError', 'onDialogClose'],
                    //返回一个错误，选择文件的时候触发
                    'onSelectError': function (file, errorCode, errorMsg) 
                    {
                        switch (errorCode)
                        {
                            case -110:
                                alert("文件 [" + file.name + "] 大小超出系统限制的" + $element.uploadify('settings', 'fileSizeLimit') + "大小！");
                                break;
                            case -120:
                                alert("文件 [" + file.name + "] 大小异常！");
                                break;
                            case -130:
                                alert("文件 [" + file.name + "] 类型不正确！");
                                break;
                        }
                    },
                });


            }
        };
    });
});