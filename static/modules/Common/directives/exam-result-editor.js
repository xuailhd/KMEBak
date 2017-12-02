define(["jquery", "angular", "module-services-apiUtil"], function ($,angular, apiUtil) {

    var app = angular.module("myApp", ["ui.bootstrap"]);


    app.directive('examResultEditor', ['$translate', '$compile', 'examResultsServices', 'webapiServices', function ($translate, $compile, services, webapiServices) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/exam-result-editor.html';
            },
            scope: {
                memberId: "=",
                examItemTypeId: "=",
                onSaved:"&"
            },
            link: function (scope, elem, attrs) {
                scope.fn = {};
                //保存
                scope.fn.save = function () {
                    var data = [];
                    var dds = $(elem).find('dd.ExamItem');
                    for (var i = 0; i < dds.length; i++) {
                        var inputs = $(dds[i]).find('*.value[name="ExamItem"][id^="ExamItem_"]');
                        for (var j = 0; j < inputs.length; j++) {
                            var item = $(inputs[j]);
                            var value = $.trim(item.val());
                            var id = item.attr('id').split('_')[1];
                            var status = item.attr('status');
                            status = status && status == null ? 0 : parseInt(status, 10);
                            var statusMessage = item.attr('statusMsg');
                            var attachs = [];
                            var attachCtlId = item.attr('attachments');
                            if (attachCtlId != null) {
                                var links = $(elem).find('#' + attachCtlId).find('a[name="Attachments"][href]');
                                if (links.length > 0) {
                                    attachs.push({ FilePath: $(links[0]).attr('href') });
                                }
                            }
                            var dataItem = {
                                ExamItemTypeID: id,
                                MemberID: scope.memberId,
                                ExamTime: $(elem).find('#ExamTime').val(),
                                Result: value,
                                Status: status,
                                StatusMsg: statusMessage,
                                ExamResultAttachments: attachs,
                                HospitalName: $(elem).find('#HospitalName').val()
                            };

                            var label = $(elem).find('label[for="' + item.attr('id') + '"]').text();
                            webapiServices.getExamResultByHospitalAndDate(
                                {
                                    memberId: dataItem.MemberID,
                                    examItemTypeId: dataItem.ExamItemTypeID,
                                    examDate: dataItem.ExamTime,
                                    hospitalName: dataItem.HospitalName,
                                    async: false //非异步执行
                                },
                                function (response) {
                                    if (response && response.Data != null) {
                                        if (confirm(label + '检查结果已存在，上次填写的结果是：' + response.Data.Result + '。是否更新上次结果？')) {
                                            dataItem.ExamResultID = response.Data.ExamResultID;
                                            data.push(dataItem);
                                        }
                                    }
                                    else {
                                        data.push(dataItem);
                                    }
                                },
                                function (response) {
                                    console.log(response);
                                });
                        }
                    }
                    services.save(data,
                        function (response) {
                            if (response.Status == 0) {
                                //layer.msg("保存成功");
                                $('#divAddResultModal').modal('hide');
                                if (scope.onSaved)
                                {
                                    scope.onSaved();
                                }
                                //$state.go("User.Home");
                                //return false;
                            } else {
                                layer.msg("保存失败", { icon: 2, shade: 0.5 });
                                //return false;
                            }
                        },
                        function (response) {
                            layer.msg("保存失败", { icon: 2, shade: 0.5 });
                        }
                    );
                };
                scope.fn.load = function () {
                    if (scope.examItemTypeId == null || scope.examItemTypeId == '')
                        return;
                    webapiServices.getExamItemTypesHTML({
                        id: scope.examItemTypeId
                    }, function (obj) {
                        var html = obj.Data;
                        var divExamItems = $(elem).find('#divExamItems');
                        //divExamItems.hide();
                        divExamItems.find('#ExamItems').html('');
                        divExamItems.find('#ExamItems').html(html);
                        var ctls = divExamItems.find('#ExamItems').find('input[regularrange]');
                        ctls.change(function () {
                            var v = $.trim($(this).val());
                            if (v == '')
                                return;
                            var regularrange = $.trim($(this).attr('regularrange'));
                            switch (regularrange) {
                                case '@@EMPTY': {
                                    var msg = '此结果请咨询医生';
                                    $(this).attr('status', 1);
                                    $(this).attr('statusMsg', msg);
                                    scope.fn.ShowMessage(this, msg);
                                }; break;
                                default: {
                                    var reg = /^((\d+(\.\d*)?)|((\d*\.)?\d+))?\-((\d+(\.\d*)?)|((\d*\.)?\d+))?$/;
                                    if (!reg.test(regularrange)) {
                                        var data = {};
                                        if (regularrange != '') {
                                            data = JSON.parse(regularrange);
                                            if (data['SEX']) {
                                                regularrange = data['SEX']['1'];//['@KM.PatientsLikeMe.Business.Entity.SecurityHelper.CurrentAccount.Sex'];
                                                //TODO:根据性别获取正常值范围
                                            }
                                        }
                                    }
                                    if (regularrange && reg.test(regularrange)) {
                                        v = parseFloat(v);
                                        var values = regularrange.split('-');
                                        var status = 0;
                                        var msg = '';
                                        if (values[0] != '') {
                                            msg += '大于等于' + values[0];
                                            if (v < values[0])
                                                status = -1;
                                        }
                                        if (values[1] != '') {
                                            if (msg != '')
                                                msg += '且';
                                            msg += '小于等于' + values[1];
                                            if (v > values[1])
                                                status = 1;
                                        }
                                        msg = '正常值范围：' + msg;
                                        if (status != 0) {
                                            $(this).attr('status', status);
                                            $(this).attr('statusMsg', msg);
                                            scope.fn.ShowMessage(this, msg);
                                        }
                                        else {
                                            $(this).attr('status', 0);
                                            $(this).attr('statusMsg', '');
                                        }
                                    }
                                }; break;
                            }
                        });
                        divExamItems.find('#ExamItems').find('[category][showAreaSelector]:file').each(function () {
                            $(this).change(function () {
                                UploadAndShowFile(this, $(this).attr('category'), $(this).attr('showAreaSelector'), false)
                            });
                        });
                    });
                };
                scope.fn.ShowMessage = function(obj, msg) {
                    var $labelMsg = $('label[msgfor="{0}"]'.format($(obj).attr("id")));
                    if (msg != null) {
                        if ($labelMsg.length > 0) {
                            $labelMsg.text(msg);
                        }
                        else {
                            alert(msg);
                        }
                        try {
                            $(obj).focus();
                        } catch (e) { }
                    }
                    else {
                        $labelMsg.text('');
                    }
                };
                scope.$parent.$watch(attrs.examItemTypeId, function (newValue, oldValue) {
                    //if (newValue == oldValue)
                    //    return;
                    scope.fn.load();
                });


                function UploadAndShowFile(fileSelector, category, showAreaSelector, isAppend) {
                    var obj = $(fileSelector)[0];
                    if ($.trim(obj.value) != '') {
                        UploadFile(obj, category, function (data) {
                            var name = data.FileName;

                            var start = name.lastIndexOf('/');
                            if (start > 0) {
                                if (name.lastIndexOf('\\') > start)
                                    start = name.lastIndexOf('\\');
                            }
                            else {
                                start = name.lastIndexOf('\\');
                            }
                            if (start >= 0)
                            {
                                name = name.substring(start + 1);
                            }
                            var html = '<span><a name="Attachments" href="' + data.UrlPrefix + '/' + data.FileName + '" target="_blank">' + name + '</a>&nbsp;&nbsp;<a name="DeleteAttachment" style="color:red" href="javascript:void(0);" >x</a></span>';
                            if (isAppend) {
                                $(showAreaSelector).append(html);
                            }
                            else {
                                $(showAreaSelector).html(html);
                            }
                            var delBtns = $(showAreaSelector).find('a[name="DeleteAttachment"]');
                            delBtns.unbind('click');
                            delBtns.click(function () {
                                if (confirm('您确定要删除吗？')) {
                                    $(this).parent().remove();
                                    $(obj).val("");
                                }
                            });
                        })
                    }
                };

                function UploadFile(fileSelector, category, fnSuccess) {
                    var data = new FormData();
                    var files = $(fileSelector).get(0).files;

                    // Add the uploaded image content to the form data collection
                    if (files.length > 0) {
                        data.append("file", files[0]);
                    }
                    apiUtil.requestWebApi(apiUtil.webStoreUrl + '/Upload/Image', 'POST', data, function (response) {
                        if (response != null) {
                            var data = response.Data;
                            if (response.Status == 0) {
                                fnSuccess(data);
                            }
                            else {
                                alert(response.Msg);
                            }
                        }
                    },
                    function (response) {
                        if (response != null) {
                            alert(response.Msg);
                        }
                    });
                }
            }
        };
    }])


});