
/**
 *dateTime.js
 *2016/8/31
 *params introduction
 *curDate:设置起始显示的年月日期
 *dateFormat:格式化头部日期
 *minDate:从哪天开始可选
 *minMonthNum:当前往前显示几个月
 *maxMonthNum:当前往后显示几个月
 *disabledClass:不可点击表单classname
 *enabledClass:可点击表单classname
 *activeObj:已选择的日期对象
 */
(function (win, $) {
    var DateTime = function (options) {
        this.opts = $.extend({}, Defaults, options || {});
        this.recordActiveArr = this.opts.activeObj;
        try{
            this.init(this.opts);
        } catch (e) {

        }
        
    },
        Defaults = {
            curDate: new Date(),
            dateFormat: "yyyy年mm",
            minDate: new Date(),
            minMonthNum: 1,
            maxMonthNum: 1,
            disabledClass: "disabledClick",
            enabledClass: "enabledClick",
            activeObj: {}
        };
    DateTime.prototype = {
        init: function (settings) {
            var date = settings.curDate,
                o = this,
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                week = date.getDay(),
                minMonth = o.opts.minMonthNum,
                maxMonth = o.opts.maxMonthNum;

            var arrObjKey = "" + year + ((month < 10) ? ("0" + month) : month);
            o.recordActiveArr[arrObjKey] = o.recordActiveArr[arrObjKey] || [];


            //初始化表结构
            o.addDaysHtml(year, month);

            //初始化表数据
            o.initDate(year, month, o.opts.activeObj);

            var minusMonthNum = 0, addMonthNum = 0;
            //change month
            $(".prev").on("click", function () {
                if (minusMonthNum < minMonth) {
                    
                    minusMonthNum += 1;
                    addMonthNum -= 1;
                    o.changeMonth("minus", o.recordActiveArr);
                    if (minusMonthNum < minMonth) {
                        if ($(this).hasClass("disabled")) {
                            $(this).removeClass("disabled");
                        };
                    } else {
                        $(this).addClass("disabled");
                    };
                    if (addMonthNum < maxMonth) {
                        if ($(".next").hasClass("disabled")) {
                            $(".next").removeClass("disabled");
                        };
                    } else {
                        $(".next").addClass("disabled");
                    }
                }
            });
            $(".next").on("click", function () {
                if (addMonthNum < maxMonth) {
                    
                    addMonthNum += 1;
                    minusMonthNum -= 1;
                    o.changeMonth("add", o.recordActiveArr);
                    if (addMonthNum < maxMonth) {
                        if ($(this).hasClass("disabled")) {
                            $(this).removeClass("disabled");
                        };
                    } else {
                        $(this).addClass("disabled");
                    };

                    if (minusMonthNum < minMonth) {
                        if ($(".prev").hasClass("disabled")) {
                            $(".prev").removeClass("disabled");
                        };
                    } else {
                        $(".prev").addClass("disabled");
                    };

                }
            });

            //click to opo date
            var tarClass = ".day." + o.opts.enabledClass;
            $("table").on("click", tarClass, function () {
                var curDate = $(".dateSwitch").html(),
            	curYear = curDate.slice(0, 4),
            	curMonth = curDate.slice(5, 7),
            	arrObjKey = "" + curYear + curMonth;
                o.recordActiveArr[arrObjKey] = o.recordActiveArr[arrObjKey] || [];

                
                if (!$(this).hasClass(o.opts.disabledClass)) {
                    var Arrindex = Number($(this).html()) < 10 ? "0" + Number($(this).html()) : $(this).html();
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                        //o.recordActiveArr[arrObjKey][Number($(this).html()) - 1] = 0;
                        o.recordActiveArr[arrObjKey] = o.removeArrVal(o.recordActiveArr[arrObjKey], Arrindex);
                        //o.removeArrVal(o.recordActiveArr[arrObjKey], Arrindex);
                    } else {
                        $(this).addClass("active");
                        o.recordActiveArr[arrObjKey].push(Arrindex);
                    }

                };
                o.recordActiveArr[arrObjKey] = o.unique(o.recordActiveArr[arrObjKey]);//去重
            });

        },
        removeArrVal: function (arr, val) {
            var i = 0;
            for (i in arr) {
                if (arr[i] == val) break;
            }
            return arr.slice(0, i).concat(arr.slice(parseInt(i, 10) + 1));

            /*for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                }
            }*/
        },
        unique: function(arr) {
            var res = [];
            var json = {};
            for (var i = 0; i < arr.length; i++) {
                if (!json[arr[i]]) {
                    res.push(arr[i]);
                    json[arr[i]] = 1;
                }
            }
            return res;
        },
        getRecordDate: function () {
            var o = this;
            // console.log(o.recordActiveArr);
            return o.recordActiveArr;
        },
        formatDate: function (date) {
            var fullyear = date.getFullYear(),
                year = date.getYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                week = date.getDay(),
                o = this,
                format = o.opts.dateFormat,
                formatDateVal = format.replace(/yyyy|mm|dd|HH|MM|ss/g, function (reg) {
                    switch (reg) {
                        case "yyyy":
                            return fullyear;
                        case "mm":
                            return month < 10 ? "0" + month : month;
                        case "dd":
                            return day;
                        case "HH":
                            return date.getHours();
                        case "MM":
                            return date.getMinutes();
                        case "ss":
                            return date.getSeconds();
                        default:
                            return reg.substr(1, reg.length - 2);
                    }
                });
            return formatDateVal;
        },
        initDate: function (year, month, curSelectDate) {
            var o = this;
            o.addDays(year, month, curSelectDate);
        },
        updateDate: function (year, month, curSelectDate) {
            var o = this;
            o.addDays(year, month, curSelectDate);
        },
        getDays: function (year, month) {
            var days;
            //当月份为二月时，根据闰年还是非闰年判断天数
            if (month == 2) {
                days = year % 4 == 0 ? 29 : 28;
            } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                days = 31;
            } else {
                days = 30;
            }  
            return days; 

        },
        addDaysHtml: function (year, month) {
            var o = this,
                weeks = ["日", "一", "二", "三", "四", "五", "六"],
                weeksHTML = "",
                daysHTML = "",
                tableBodyHTML = "",
                theadHTML = "",
                tbodyHTML = "";

            theadHTML = '<thead><tr>' +
                '<th class="prev">&lt;</th>' +
                '<th class="dateSwitch" colspan="5">' + o.formatDate(new Date(year + "/" + month + "/1")) + '</th>' +
                '<th class="next">&gt;</th>' +
                '</tr><tr>';
            for (var i = 0; i < 6; i++) {
                daysHTML += "<tr>";
                weeksHTML = "";
                for (var j = 0; j < 7; j++) {
                    weeksHTML += '<th class="dow">星期' + weeks[j] + '</th>';
                    daysHTML += '<td class="day"></td>';
                }
                daysHTML += "</tr>";
            }
            weeksHTML += "</tr></thead>";
            theadHTML += weeksHTML;
            tbodyHTML = '<tbody>' + daysHTML + '</tbody>';
            tableBodyHTML = theadHTML + tbodyHTML;

            $(".calendarTable").html(tableBodyHTML);
        },
        addDays: function (year, month, curSelectDate) {
            var o = this,
                dayLen = 42,
                first = this.getFirstDay(year, month),
                j = 0,
                days = o.getDays(year, month),
                arrObjKey = "" + year + ((month < 10) ? ("0" + month) : month),
                arr = curSelectDate[arrObjKey];

           
            //将原来的activeClass都去掉
            if ($(".day").hasClass("active")) {
                $(".day").removeClass("active");
            };
            //初始化日期并加上操作样式及突出默认选中的日期
            for (var i = 0; i < dayLen; i++) {
                //判断从第几行开始
                first = first == 0 ? 7 : first;
                if (i < first || i >= days + first) {
                    $(".day").eq(i).html("");
                } else {
                    j = i - first + 1;
                    j = j < 10 ? ("0" + j) : j;
                    $(".day").eq(i).html(j);
                };
                o.disabledDays($(".day").eq(i));

                $(".day").eq(first + i).removeClass("active");
                if (arr) {
                    for (var k = 0; k < arr.length; k++) {
                        if (arr[k] == $(".day").eq(i).html()) {
                            $(".day").eq(i).addClass("active");
                        }

                    }
                }


            }


        },
        getFirstDay: function (year, month) {
            var firstDay = new Date(Date.UTC(year, month - 1, 1)).getDay();
            return firstDay;
        },
        changeMonth: function (type, curSelectDate) {
            var oldDate = $(".dateSwitch").html(),
                oldYear = oldDate.slice(0, 4),
                oldMonth = oldDate.slice(5, 7),
                oldDateString = oldYear + "/" + oldMonth + "/1",

                curDate = new Date(oldDateString),
                curYear = curDate.getFullYear(),
                curMonth = curDate.getMonth(),
                dealDate, o = this;
            if (type == "add") {
                curMonth += 1;

                if (curMonth > 11) {
                    curYear += 1;
                    curMonth = curMonth - 12;
                };
                dealDate = o.formatDate(new Date(curYear, curMonth))
                $(".dateSwitch").html(dealDate);
            } else if (type == "minus") {
                curMonth -= 1;
                if (curMonth < 0) {
                    curYear -= 1;
                    curMonth = curMonth + 12;
                };
                dealDate = o.formatDate(new Date(curYear, curMonth))
                $(".dateSwitch").html(dealDate);
            };
            curMonth += 1;
            o.updateDate(curYear, curMonth, curSelectDate);
        },
        disabledDays: function (curThis) {
            var o = this,
                oldDate = $(".dateSwitch").html(),
                oldYear = oldDate.slice(0, 4),
                oldMonth = oldDate.slice(5, 7),
                curDay = curThis.html(),
                minDateTime = o.opts.minDate.getTime(),
                curClickDate = curDay == "" ? 0 : (new Date(oldYear + "/" + oldMonth + "/" + curDay + " 23:59:59")).getTime(),
                compareTime = curClickDate - minDateTime;

            if (compareTime < 0) {
                if (!curThis.hasClass(o.opts.disabledClass)) {
                    curThis.addClass(o.opts.disabledClass);
                };

                if (curThis.hasClass(o.opts.enabledClass)) {
                    curThis.removeClass(o.opts.enabledClass);
                };
            } else {
                if (curThis.hasClass(o.opts.disabledClass)) {
                    curThis.removeClass(o.opts.disabledClass);
                };
                if (!curThis.hasClass(o.opts.enabledClass)) {
                    curThis.addClass(o.opts.enabledClass);
                };
            }
        }
    };

    win.DateTime = DateTime;
    /*$.fn.dateTime = function(options) {
        new DateTime(options);
    };*/
})(window, jQuery);
