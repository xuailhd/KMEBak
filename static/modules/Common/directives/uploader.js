define(["angular","module-Services-uploader"], function (angular,uploader)
{
    var app = angular.module("myApp", ["ui.bootstrap"]);

    /*
     * 文件上传指令
     * 作者：郭明
     * 日期：2016年9月29日
     */
    /*
        example:
            html:
              <uploader onUpload="onUpload"></uploader>
            js:
            $scope.onUpload = function (params, process)
             {
                //上传文件
                process(function (uploadResp) {                      
                    //删除成功   
                }, function (resp)
                {       
                    //上传文件失败
                    console.error(resp);
                })
            };
     */
    app.directive("uploader", ["$document", "$translate", function (e, $translate) {
        
        return {
            restrict: "EA",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/uploader.html';
            },
            scope: {
                onUpload: "=onupload"      
            },
            link: function (scope, $element, attr)
            {
                scope.formName = "uploader" + $element.$id;
                scope.onFileChange = function (uploadFile) {
                    
                    for (var i = 0; i < uploadFile.files.length; i++) {

                        uploader.onFileUpload(uploadFile.files[i], scope.onUpload);
                        
                    }
                 
                    //重置表单
                    document.forms[scope.formName].reset();

                }

                

            }
        }
    }])

    /*
    * 文件拖拽上传
    * 作者：郭明
    * 日期：2016年9月29日
    */
    app.directive("draguploader", ["$document", "$translate", function (e, $translate) {

        return {
            restrict: "ECA",
            scope: {
                onUpload: "=onupload",
            },
            link: function (scope, $element, attr)
            {
                //阻止浏览器默认行。
                $(document).on({
                    dragleave: function (e) {		//拖离
                        e.preventDefault();
                    },
                    drop: function (e) {			//拖后放
                        e.preventDefault();
                    },
                    dragenter: function (e) {		//拖进
                        e.preventDefault();
                    },
                    dragover: function (e) {		//拖来拖去
                        e.preventDefault();
                    }
                });

                ////拖拽区域 
                $element.on("drop", function (event)
                {
                    var e = event.originalEvent;                
                    e.preventDefault(); //取消默认浏览器拖拽效果
                    var fileList = e.dataTransfer.files; //获取文件对象

                    //检测是否是拖拽文件到页面的操作
                    if (fileList.length == 0) {
                        return false;
                    }

                    for(var  i=0;i<fileList.length;i++)
                    {
                        uploader.onFileUpload(fileList[i], scope.onUpload);
                    }
                });

            }
        }
    }])

});

