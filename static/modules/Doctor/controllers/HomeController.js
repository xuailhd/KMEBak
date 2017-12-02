"use strict";
define(["plugins-echarts", "module-directive-bundling-doctor-all",
        "module-filter-all",
        "css!styles/layout.schedules.min.css",
        "module-services-api"], function (echarts) {

            var app = angular.module("myApp", [
             "pascalprecht.translate",
             'ui.router',
             "ui.bootstrap",
             "ngAnimate"]);

            app.controller('HomeController', ['$scope', "$state", '$translate', 'doctorsServices', 'doctorServiceServices', 'doctorSchedulesServices',
                function ($scope, $state, $translate, services, doctorServiceServices, doctorSchedulesServices) {
                    //0-挂号、1-图文咨询、2-语音问诊、3-视频问诊、4-处方支付、5-家庭医生、6-会员套餐、7-远程会诊、8-影像判读、100-其它
                    var SerivceTypeData = {
                        "N1": { name: "图文咨询", color: "#d72130" },
                        "N2": { name: "语音问诊", color: "#f2a43b" },
                        "N3": { name: "视频问诊", color: "#53a8e6" },
                        "N5": { name: "家庭医生", color: "#0cb4b2" },
                        "N7": { name: "远程会诊", color: "#81c04e" }
                    };
                    var flag = false;
                    $scope.searchBeginDate = null;
                    $scope.searchEndDate = null;               
                    $scope.scheList = [];
                    $scope.total = 0;
                    $scope.page = 1;
                    $scope.pageSize = 10;
                    $scope.AppointmentCount = 0;

                    $scope.changeAnimate = function (e) {
                        var $target = $(e.target);
                        var $preWeek = $($target.parent().parent().children('.pre-week')[0])
                        var $nextWeek = $($target.parent().parent().children('.next-week')[0]);
                        var $table = $(e.target.parentElement.nextElementSibling);
                        if ($table.css('display') !== 'none') {
                            $preWeek.hide()
                            $nextWeek.hide();
                            $table.slideUp();
                            $target.css({
                                transform: 'rotateX(180deg)'
                            })
                        } else {
                            $table.slideDown('normal', function () {
                                $preWeek.show()
                                $nextWeek.show();
                            })
                            $target.css({
                                transform: 'rotateX(0deg)'
                            })
                        }


                    }
                    $scope.getList = function () {
                        doctorSchedulesServices.getList({
                            PageSize: $scope.pageSize,
                            CurrentPage: $scope.page,
                            Status: 1,
                            RemoveExpire:true
                        }, function (response) {
                            var count = 0;
                            if (response.Status === 0) {                               
                                $scope.total = response.Total;
                                $scope.scheList = response.Data;
                                if ($scope.total > 0) {
                                    for (var i = 0; i < $scope.total; i++) {
                                        var num = i;
                                        var list = $scope.scheList[num].TableSchedule.ScheduleList;                                        
                                        for (var n = 0; n < list.length; n++) {
                                            var x = n;
                                            var DoctorSchedule = list[x].DoctorSchedule;
                                            for (var m = 0; m < DoctorSchedule.length; m++) {            
                                                count += DoctorSchedule[m].AppointNumber;                                                
                                            }
                                        }
                                    }
                                }

                            }
                            $scope.AppointmentCount = count;                         
                        }, function (ex) {

                        })
                       
                    };
                   

                    $scope.changeNextPage = function (id, beginTime, endTime, curTime, index) {

                        if (flag) {
                            return
                        }
                        flag = true;
                        var endTime = endTime;
                        var curTime = curTime;
                        var nextWeekTime = new Date(curTime).addDays(7).format('yyyy-MM-dd')

                        doctorSchedulesServices.changePage(
                            {
                                NumberSourceID: id,
                                Date: nextWeekTime
                            },
                            function (response) {
                                $scope.scheList[index] = response.Data;
                                flag = false;
                            },
                            function (error) {
                                flag = false;
                            }
                        )
                    }
                    $scope.changePrePage = function (id, beginTime, endTime, curTime, index) {
                        if (flag) {
                            return
                        }
                        flag = true;

                        var beginTime = beginTime;
                        var curTime = curTime;
                        var PreWeekTime = new Date(curTime).addDays(-7).format('yyyy-MM-dd')

                        doctorSchedulesServices.changePage(
                            {
                                NumberSourceID: id,
                                Date: PreWeekTime
                            },
                            function (response) {
                                $scope.scheList[index] = response.Data
                                flag = false;
                            },
                            function (error) {
                                flag = false;
                            }
                        )
                    }

                    $scope.onSearch = function () {
                        getServiceTypeIncomes($scope.searchBeginDate, $scope.searchEndDate, true);
                    }
                    // echart 图片
                    var getServiceTypeIncomes = function (startDate, endDate, showLoading) {

                        var param = {};
                        if (startDate) {
                            param.startDate = startDate;
                        }

                        if (endDate) {
                            param.endDate = endDate
                        }

                        var loading = null
                        if (showLoading) {
                            var loading = layer.load(0, { shade: [0.3, '#000'] });
                        }

                        services.getSerivceTypeIncomes(param, function (obj) {
                            if (loading != null) {
                                layer.close(loading);
                            }

                            if (obj.Data != null) {
                                var times = [], incomes = [], colors = [];
                                var totalIncome = 0;
                                $.each(obj.Data, function (i, d) {
                                    var std = SerivceTypeData["N" + d.SerivceType];
                                    if (std != null) {
                                        times.push({ name: std.name, value: d.TimesCount });
                                        incomes.push({ name: std.name, value: d.Income });
                                        colors.push(std.color);
                                        totalIncome += d.Income;
                                    }
                                });


                                drawCharts('divSerivceTimes', '接诊量', '接诊次数', times, { min: 0, minInterval: 1 });
                                drawCharts('divIncomes', '总收入（' + totalIncome.toFixed(2).toString() + "元）", '收入（元）', incomes, { min: 0, minInterval: 0.01 }, colors);
                            }
                        }, function (response) {
                            if (loading != null) {
                                layer.close(loading);
                            }
                        });
                    }

                    getServiceTypeIncomes(null, null);

                    //获取医生价格服务列表                  
                    doctorServiceServices.get(null, function (response) {
                        if (response.Status == 0) {
                            for (var i = 0; i < response.Data.length; i++) {
                                var docModel = response.Data[i];
                                if (docModel.ServiceSwitch) {
                                    var li = $('#ServiceType_{0}'.format(docModel.ServiceType));
                                    li.removeClass('off');
                                    li.find('.price').text('{0} 元/次'.format(docModel.ServicePrice));
                                }
                            }
                        }
                    });

                            

                    var chartTable = {};

                    function drawCharts(id, title, uint, data, config, colors) {
                        if (config.minInterval <= 0)
                            config.minInterval = 1;

                        var chart = chartTable[id];
                        if (chart == null) {
                            chart = echarts.init(document.getElementById(id));
                            $("#" + id).on("resize", function () {
                                chart.resize();
                            });
                            chartTable[id] = chart;
                        }

                        var names = [], values = [], minValue = 0, maxValue = 0;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].value > maxValue)
                                maxValue = data[i].value;
                            if (data[i].value < minValue)
                                minValue = data[i].value;

                            names.push(data[i].name);
                            values.push(data[i].value);
                        }

                        colors = colors || data.map(function (item) {
                            return "#0acdce";
                        });
      
                        var option = {
                            title: {
                                text: title,
                                x: 'center',
                                top: -10
                            },
                            tooltip: {},
                            //legend: {
                            //    data: [uint]
                            //},
                            xAxis: {
                                data: names
                            },
                            yAxis: {
                                type: 'value',
                                show: false,
                                splitNumber: Math.max(Math.min(Math.ceil(maxValue / config.minInterval), 5), 1),
                                minInterval: config.minInterval,
                                min: config.min

                            },
                            series: [{
                                name: uint,
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                    color: function (params) {
                                            var colorList = colors;
                                            return colorList[params.dataIndex]
                                        },
                                        label: {
                                            show: true,
                                            position: 'top',
                                            formatter: '{c}'//'{b}\n{c}'
                                        }
                                    }
                                },
                                data: values
                            }]
                        };

                        chart.setOption(option);
                    }

                    $scope.getList();
            }]);

            // 过滤器
            app.filter('filterLetterT', function () {
                return function (text) {
                    return text.split("T")[0];
                }
            });
        });