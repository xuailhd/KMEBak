/**
 *citySelecter.js
 *2016/9/22
 *城市选择器
 *return setObjectIDCallBack
 *需要调用 setObjectIDCallBack 设置点击触发元素 的id 和 callback(cityname, cityid)
 */
define(["jquery"], function () {
    var htmlStr = "";
    var webapiUrl = global_ApiConfig.WebApiUrl;
    var objectid = "";
    var changeCityCallback;
    var isShow = false;     //是否已显示城市列表
    var isclickselect = false;  //是否是点击城市列表，（用于点击 别的地方隐藏 城市列表）

    var load = function (data) {
        var citys = ["ABCDE", "FGHJ", "KLMNP", "QRSTW", "XYZ"]

        htmlStr = htmlStr + '<div class="search-citys-pop" id="select-cityarea" style="display: none"> <div class="search-citys-tt click">'
        //国内热门，港澳台 单独处理
        htmlStr = htmlStr + '<a class="click" data-tab="s-citysHot" href="javascript:void(0)">国内热门<span></span></a>'

        for (var i = 0; i < citys.length; i++) {
            htmlStr = htmlStr + '<a class="click" data-tab="s-citys' + i + '" href="javascript:void(0)">' + citys[i] + '<span></span></a>'
        }

        //国内热门，港澳台 单独处理
        htmlStr = htmlStr + '<a class="click" data-tab="s-citysGAT" href="javascript:void(0)">港澳台<span></span></a>'
        htmlStr = htmlStr + '</div>'

        htmlStr = htmlStr + '<div class="search-citys-list" id="citylist">'

        //国内热门，港澳台 单独处理
        htmlStr = htmlStr + '<div id="s-citysHot" style="display: none"><dl><dt></dt><dd><ul>'
        for (var i = 0; i < data.length; i++) {
            if (data[i].IsHot) {
                htmlStr = htmlStr + '<li class="click"><a href="javascript:;" class="click" data-cityid="' + data[i].CITY_ID + '" data-cityname="' + data[i].CITY_NAME + '" >' + data[i].CITY_NAME + '</a></li>'
            }
        }
        htmlStr = htmlStr + '</ul> </dd></dl> </div>'
        for (var i = 0; i < citys.length; i++) {
            htmlStr = htmlStr + '<div id="s-citys' + i + '" style="display: none">'
            for (var j = 0; j < citys[i].length; j++) {
                var tempChar = citys[i].substr(j, 1);
                htmlStr = htmlStr + '<dl><dt>' + tempChar + '</dt><dd><ul>'
                for (var m = 0; m < data.length; m++) {
                    if (data[m].FirstChar == tempChar) {
                        htmlStr = htmlStr + '<li class="click"><a href="javascript:;" class="click" data-cityid="' + data[m].CITY_ID + '" data-cityname="' + data[m].CITY_NAME + '" >' + data[m].CITY_NAME + '</a></li>'
                    }
                }
                htmlStr = htmlStr + '</ul></dd></dl>'
            }
            htmlStr = htmlStr + '</div>'
        }

        //国内热门，港澳台 单独处理
        htmlStr = htmlStr + '<div id="s-citysGAT" style="display: none"><dl><dt></dt><dd><ul>'
        for (var i = 0; i < data.length; i++) {
            if (data[i].CITY_NAME == "香港" || data[i].CITY_NAME == "澳门" || data[i].CITY_NAME == "台湾") {
                htmlStr = htmlStr + '<li class="click"><a href="javascript:;" class="click" data-cityid="' + data[i].CITY_ID + '" data-cityname="' + data[i].CITY_NAME + '" >' + data[i].CITY_NAME + '</a></li>'
            }
        }
        htmlStr = htmlStr + '</ul> </dd></dl> </div><input type="hidden" id="selectedTab" value="" />'
    }

    //切换 tab
    var tabCutover = function (tabid) {
        $($('#selectedTab').val()).hide();
        $("#" + tabid).show()
        $('#selectedTab').val('#' + tabid);
    };


    var change_city_val = function (cityname, cityid) {
        isShow = false;
        $('#select-cityarea').hide();
        changeCityCallback(cityname, cityid);
    };

    //绑定点击事件
    var bindClick = function () {
        $('#select-cityarea').find('.search-citys-tt .click').click(function () {
            tabCutover($(this).attr("data-tab"));
        })

        $('#select-cityarea').find('.search-citys-list a[class="click"]').click(function () {
            change_city_val($(this).attr("data-cityname"), $(this).attr("data-cityid"))
        })

        $('#' + objectid).click(function () {
            showlocations(objectid);
        })

        $('#select-cityarea').click(function () {
            isclickselect = true;
        })

        //点击别的地方 隐藏城市列表
        $(document).click(function () {
            if (!isclickselect && isShow) {
                isShow = false;
                $('#select-cityarea').hide();
            }
            isclickselect = false;
        })

    }
    //显示 隐藏 城市列表
    var showlocations = function(objid) {
        if (!isShow) {
            var obj = $('#' + objid);
            var top = obj.offset().top + obj.height() + 6;
            var left = obj.offset().left;

            $('#select-cityarea').show();
            $('#select-cityarea').offset({ top: top, left: left + obj.width() - $('#select-cityarea').width() })

            if ($('#selectedTab').val().length > 0){
                $($('#selectedTab').val()).show();
            }
            else{
                $('#s-citysHot').show();
                $('#selectedTab').val('#s-citysHot');
            }
            isclickselect = true;
        } else {
            $('#select-cityarea').hide();
        }
        isShow = !isShow;
    }
    //加载 城市数据
    var loadCityData = function () {
        var supoptioan = {
            url: webapiUrl + "/Appointment/GetCity",
            type: 'Get',
            dataType: 'json',
            context: this,
            success: function (result) {
                if (result.Status = "0") {
                    load(result.Data);
                    $(document.body).append(htmlStr);
                    bindClick()
                }
            },
        }
        $.ajax(supoptioan);
    }
    //设置 触发元素id，回调方法
    var setObjectIDCallBack = function (value, callback) {
        changeCityCallback = callback;
        objectid = value;
        loadCityData();
    }

    return {
        setObjectIDCallBack: setObjectIDCallBack,
    };
});
