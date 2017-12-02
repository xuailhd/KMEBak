define(["jquery", "angular", "module-filter-all", "jquery-flot", "jquery-flot-time", "jquery-flot-resize"], function ($, angular) {

    var app = angular.module("myApp", ["ui.bootstrap"]);

    //ng-repeat 显示完成后执行的事件
    app.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                if (scope.$last == true) {
                    console.log('repeatFinish');
                    scope.$eval(attr.repeatFinish)
                }
            }
        }
    });

    app.directive('examResultCharts', ['$translate', 'examResultsServices', 'webapiServices', function ($translate, services, webapiServices) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/exam-result-charts.html';
            },
            scope: {
                examItemTypeId: '=',
                memberId: '='
            },
            link: function (scope, elem, attrs) {
                //$(elem).hide();
                scope.fn = {};
                scope.StartLoad = false;
                scope.ExamItemTypes = [];
                scope.BeginDate = scope.BeginDate || (new Date()).addDays(-30).format('yyyy-MM-dd');
                scope.EndDate = scope.EndDate || (new Date()).format('yyyy-MM-dd');
                scope.fn.LoadExamItemTypes = function () {
                    if (scope.memberId == undefined || scope.memberId == null || scope.memberId == '')
                        return;
                    console.log('LoadExamItemTypes');
                    scope.ExamResultCharts = [];
                    webapiServices.getExamItemTypesForChart({
                        memberId: scope.memberId,
                        examItemTypeId: scope.examItemTypeId,
                        loadSubItems: true//,
                        //async: false //非异步执行
                    }, function (response) {
                        var items = [];
                        var charts = [];
                        if (response != null && response.Data != null) {
                            var data = response.Data;
                            for (var i = 0; i < data.length; i++) {
                                var item = data[i];
                                if (item.SubExamItemTypes == null || item.SubExamItemTypes.length == 0) {
                                    items.push({ ID: item.ExamItemTypeID, Name: item.ExamItemTypeName });
                                }
                                else {
                                    for (var j = 0; j < item.SubExamItemTypes.length; j++) {
                                        var subItem = item.SubExamItemTypes[j];
                                        items.push({ ID: subItem.ExamItemTypeID, Name: subItem.ExamItemTypeName });
                                    }
                                }
                            }
                        }
                        if (items.length > 0)
                        {
                            for (var i = 0; i < items.length; i++) {
                                var id = items[i].ID;
                                charts.push(new ExamResultChart('divChart_' + id, id, false));
                            }
                        }
                        scope.ExamItemTypes = items;
                        scope.ExamResultCharts = charts;
                    });
                };
                function InitExpander() {
                    //隐藏&展开
                    $('.expander[for]').unbind('click');
                    $('.expander[for]').click(function () {
                        var target = $('#' + $.trim($(this).attr('for')));
                        if (target.length > 0) {
                            if (target.is(':visible')) {
                                target.hide();
                                $(this).removeClass('expanded');
                                $(this).addClass('collapsed');
                            }
                            else {
                                target.show();
                                $(this).removeClass('collapsed');
                                $(this).addClass('expanded');
                                if(target.is('#divExamResultChats'))
                                {
                                    scope.fn.LoadExamItemTypes();
                                }
                            }
                        }
                    });
                }
                InitExpander();
                scope.fn.LoadExamResultCharts = function () {
                   
                    InitExpander();
                    var startDate = scope.BeginDate;
                    var endDate = scope.EndDate;
                    for (var i = 0; i < scope.ExamResultCharts.length; i++) {
                        scope.ExamResultCharts[i].Load(scope.memberId, startDate, endDate);
                    }
                    console.log('LoadExamResultCharts');
                }
                AddToolTip = function (id) {
                    id = 'tooltip_' + id;
                    $('<div id="' + id + '"></div>').css({
                        position: 'absolute',
                        display: 'none',
                        border: '1px solid #fdd',
                        padding: '2px',
                        'background-color': '#fee',
                        opacity: 0.80
                    }).appendTo('body');
                    return id;
                };
                ExamResultChart = function (id, examItemTypeId, isEditable) {
                    var toolTipId = AddToolTip(id);
                    $("#" + id).bind("plothover", function (event, pos, item) {
                        if (item) {
                            var x = item.datapoint[0].toFixed(2),
                                y = item.datapoint[1].toFixed(2);
                            var data = item.series.source[item.dataIndex].Data;
                            $("#" + toolTipId).html(data.Tooltip)
                                .css({ top: item.pageY + 5, left: item.pageX + 5 }).css("z-index", 99999999)
                                .show();
                        } else {
                            $("#" + toolTipId).fadeOut(3000);
                        }

                    });
                    this.Load = function (memberId, startDate, endDate) {
                        webapiServices.getExamResultPlotChartData({ memberId: memberId, examItemTypeId: examItemTypeId, start: startDate, end: endDate }, function (response) {
                            if (response != null && response.Data != null) {
                                var data = response.Data;
                                var seriesData = [];
                                var yAxisTicks = [];
                                if (data.Series.length > 0) {
                                    for (var i = 0; i < data.Series.length; i++) {
                                        var item = data.Series[i];
                                        var points = [];
                                        for (var j = 0; j < item.Data.length; j++) {
                                            var point = item.Data[j];
                                            points.push([point.X, point.Y]);
                                        }
                                        seriesData.push({ label: item.Label, data: points, source: item.Data });
                                    }
                                }
                                if (data.YAxisTicks != null && data.YAxisTicks.length > 0) {
                                    for (var i = 0; i < data.YAxisTicks.length; i++) {
                                        var item = data.YAxisTicks[i];
                                        yAxisTicks.push([item.Value, item.Label]);
                                    }
                                }
                                var plot = $.plot("#" + id, seriesData, {
                                    series: {
                                        lines: {
                                            show: true
                                        },
                                        points: {
                                            show: true
                                        }
                                    },
                                    grid: {
                                        hoverable: true,
                                        clickable: true,
                                        labelMargin: 10
                                    },
                                    yaxis: {
                                        ticks: yAxisTicks.length == 0 ? null : yAxisTicks
                                    },
                                    xaxis: {
                                        mode: "time",
                                        minTickSize: [1, "day"],
                                        min: startDate.toDate().getTimestamp(),
                                        max: endDate.toDate().getTimestamp(1),
                                        timeformat: "%m/%d"//,
                                    }, legend: {
                                        position: "se",//,"nw" or "nw" or "se" or "sw"
                                        show: true,
                                        noColumns: seriesData.length
                                    }
                                });
                            }
                        });
                    }
                };

                //if (scope.memberId != null && scope.memberId != '') {
                //    scope.fn.load();
                //}
                var watch_memberId = scope.$watch('memberId', function (newValue, oldValue, scope) {
                    if (newValue == oldValue)
                        return;
                    console.log('memberId changed');
                    $(elem).find('#divExamResultChats').hide();
                    var expander = $(elem).find('div[for="divExamResultChats"]');
                    expander.removeClass('expanded');
                    expander.addClass('collapsed');
                    scope.ExamItemTypes = [];
                    scope.ExamResultCharts = [];
                    //scope.fn.LoadExamItemTypes();
                    //watch_memberId();//注销监听

                });
                scope.$watch('BeginDate', function (newValue, oldValue, scope) {
                    if (newValue == oldValue)
                        return;
                    console.log('BeginDate changed');
                    scope.fn.LoadExamResultCharts();
                });
                
                scope.$watch('EndDate', function (newValue, oldValue, scope) {
                    if (newValue == oldValue)
                        return;
                    console.log('EndDate changed');
                    scope.fn.LoadExamResultCharts();
                });
            }
        };
    }])


});