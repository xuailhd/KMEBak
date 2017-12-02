Date.prototype.format = function (fmt) {
    if (this.toString() == 'Invalid Date')
        return '';
    var o = {
        "M+": this.getMonth() + 1,//.getUTCMonth() + 1,                 //月份 
        "d+": this.getDate(),//.getUTCDate(),                    //日 
        "h+": this.getHours(),//.getUTCHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.getDiff = function (startTime, diffType) {
    if (this.toString() == 'Invalid Date')
        return 0;
    startTime = new Date(startTime.toString());
    diffType = diffType.toLowerCase();
    //作为除数的数字
    var divNum = 1;
    switch (diffType) {
        case 'second':
            divNum = 1000;
            break;
        case 'minute':
            divNum = 1000 * 60;
            break;
        case 'hour':
            divNum = 1000 * 3600;
            break;
        case 'day':
            divNum = 1000 * 3600 * 24;
            break;
        case 'year':
            divNum = 1000 * 3600 * 24 * 365;
            var y = (this.getFullYear() - startTime.getFullYear()) - 1;
            if ((this.getMonth() > startTime.getMonth()) || (this.getMonth() == startTime.getMonth() && this.getDate() >= startTime.getDate())) {
                y = y + 1;
            }
            return y;
        default:
            break;
    }
    return parseInt((this.getTime() - startTime.getTime()) / parseInt(divNum));
}
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};

Date.prototype.addMonths = function (months) {
    this.setMonth(this.getMonth() + months);
    return this;
};

Date.prototype.getTimestamp = function (days) {
    if (days) {
        this.addDays(days);
    }
    var diff = this.getTimezoneOffset() * 60 * 1000;
    return this.getTime() - diff;
};

String.prototype.toDate = function () {
    var reg = /^(\d{4})[-|\/](\d{2})[-|\/](\d{2}).*$/;
    var datetime = this;
    if (reg.test(datetime)) {
        var reTime = /[+-]{1}\d{2}:\d{2}/gi;
        datetime = datetime.replace(/\//g, '-').replace(reTime, '');
        if (datetime.indexOf('T') > -1) {
            datetime += '+08:00';
        }
        else if (datetime.indexOf(' ') > -1) {
            datetime = datetime.replace(' ', 'T') + '+08:00';
        }
        datetime = datetime.replace('T0:', 'T00:')
    }
    return new Date(datetime);
}