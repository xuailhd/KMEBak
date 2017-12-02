/**
 * Select2 Chinese translation
 */
(function ($) {
    "use strict";
    $.fn.select2.locales['zh-CN'] = {
        formatMatches: function (matches) { if (matches === 1) { return "有一个结果可用，按回车键选择它。"; } return matches + " 结果可用，使用上下箭头键导航。"; },
        formatNoMatches: function () { return "没有找到匹配项"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "请再输入" + n + "个字符";},
        formatInputTooLong: function (input, max) { var n = input.length - max; return "请删掉" + n + "个字符";},
        formatSelectionTooBig: function (limit) { return "你只能选择最多" + limit + "项"; },
        formatLoadMore: function (pageNumber) { return "加载结果中…"; },
        formatSearching: function () { return "搜索中…"; }
    };

    $.extend($.fn.select2.defaults, $.fn.select2.locales['zh-CN']);
})(jQuery);
