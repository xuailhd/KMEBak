define(["jquery", "plugins-layer", "jquery-cookie", "plugins-md5"], function ($, layer) {

    var loginType = "Doctor"

    //调用全局api配置
    var appkey = global_ApiConfig.AppKey;
    var webapiUrl = global_ApiConfig.WebApiUrl;
    var webStoreUrl = global_StoreConfig.UrlPrefix;
    var cookeNamePrefix = global_cookieConfig.prefix;
    var appTokenEnabled = false;  //第一为false，强制从新取

    //响应拦截器
    function getResponseInterceptor(postData, successCallBack, errorCallBack) {
        return function (result) {
            //数据验证失败
            if (result.Status == 4) {
                errorCallBack(result)
            }
                // app token过期，清除本地token，重新请求一次
            else if (result.Status == 5) {
                appTokenEnabled = false;
                setLocalAppToken("");
                requestWebApi(postData.method, postData.postType, postData.data, successCallBack, errorCallBack);
            }
                //用户登录已过期，清除本地用户数据
            else if (result.Status == 6) {
                setUserToken("")
                successCallBack(result);
            }
                //非法请求
            else if (result.Status == 3) {
                errorCallBack(result)
            }
                //业务异常
            else if (result.Status == 1) {
                errorCallBack(result)
            }
                //正常
            else {
                successCallBack(result);
            }
        }
    }

    /*
     * @method ：接口方法名称
     * @postType: GET/POST/PUT/DELETE
     * @param: 请求参数
     * @successCallBack 请求成功时的回调函数
     * @errorCallback 请求失败时的回调函数
     */
    function requestWebApi(method, postType, data, successCallBack, errorCallBack) {

        data = data || {};
        errorCallBack = errorCallBack || function (response) {
            console.error(response);
        };

        getAppToken(function (tokenStr) {
            var appToken = tokenStr;
            if (!appToken) {
                alert("获取app token失败");
                return;
            }
            //随机数(每次请求不能重复)
            var noneStr = getNonceStr();
            //登录用户token(可空，只有用户登录后才传值)
            var userToken = getUserToken();
            //生成签名
            var sign = getSign(appToken, noneStr, userToken);
            //请求API
            var postData = {
                "webapiUrl": webapiUrl,
                "method": method,
                "postType": postType,
                "data": data,
                "appToken": appToken,
                "nonceStr": noneStr,
                "userToken": userToken,
                "sign": sign
            };

            requestUrl(postData, getResponseInterceptor(postData, successCallBack, errorCallBack), errorCallBack);
        });
    }
    //请求API
    function requestUrl(postData, successCallBack, errorCallBack) {
        var data = postData.data;
        var url = postData.method;

        //如果地址不包含（http://）则附加地址
        if (!/^https?:\/\//i.test(url)) {
            url = postData.webapiUrl + "/" + postData.method;
        }

        var requestData = {
            type: postData.postType,
            url: url,
            headers: {
                "apptoken": postData.appToken,
                "noncestr": postData.nonceStr,
                "usertoken": postData.userToken,
                "sign": postData.sign
            },
            success: function (response) {
                if (successCallBack)
                    successCallBack(response);
            },
            error: function (error) {
                var response = {
                    Msg: error.responseText || error.statusText,
                    Status: 1,
                    Data: error
                };

                if (errorCallBack) {
                    errorCallBack(response)
                }
                else {
                    console.error(response);
                }
            }
        };

        if ((postData.method.toLowerCase().indexOf(webStoreUrl + "upload") >= 0 || postData.method.toLowerCase().indexOf(webStoreUrl + "/upload") >= 0) && postData.postType.toLowerCase() == 'post')//上传文件
        {
            requestData.data = data;
            requestData.contentType = false;
            requestData.processData = false;
        }
        else {
            var async = postData.data.async == false ? false : true;//默认为异步方式

            delete postData.data["async"];//去掉async属性

            var contentType = "";

            //如果是DELETE 请求则数据附加到地址栏
            if (postData.postType.toLowerCase() == "delete") {
                requestData.url = requestData.url + "?" + $.param(data);
                data = {};
            }
                //POST,PUT 采用Playload方式提交
            else if (postData.postType.toLowerCase() != "get") {
                contentType = "application/json; charset=utf-8";
                data = JSON.stringify(postData.data);
            }

            requestData.cache = true;//不能用缓存(防止请求同一个API时，返回上一次的数据)
            requestData.data = data;//请求的数据
            requestData.async = async;//是否异步
            requestData.contentType = contentType;// 很重要
            requestData.dataType = "json";//指定数据类型
            requestData.crossDomain = true;//跨域请求
        }

        $.ajax(requestData);

    }

    //获取token，没有时从api获取
    function getAppToken(callBack) {

        var appToken = getLocalAppToken();
        if (!appTokenEnabled || !appToken) {
            getAppTokenFromServer(function (tokenStr) {
                appTokenEnabled = true;
                setLocalAppToken(tokenStr);//apptoken写入本地cookie
                callBack(tokenStr);
            });
        }
        else
            callBack(appToken);
    }

    //从服务器上获取token
    function getAppTokenFromServer(callBack) {
        $.ajax({
            type: "get",
            url: "/Common/GetAppToken",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                callBack(result.Data.Token);
            },
            error: function (error) { }
        });
    }
    //获取登录用户token
    function getUserToken() {
        var userToken;

        userToken = $.cookie(cookeNamePrefix + "userToken");
        return !userToken ? "" : userToken;

    }
    //设置用户Token
    function setUserToken(userToken) {
        return $.cookie(cookeNamePrefix + "userToken", userToken, global_cookieConfig);
    }
    //设置AppToken
    function setLocalAppToken(appToken) {
        return $.cookie(cookeNamePrefix + "appToken", appToken, global_cookieConfig);
    }
    //获取AppToken
    function getLocalAppToken() {
        return $.cookie(cookeNamePrefix + "appToken");
    }
    //生成随机数
    function getNonceStr() {
        var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var result = "";
        for (var i = 0; i < 15; i++) {
            var r = Math.floor(Math.random() * 62);     //取得0-62间的随机数，目的是以此当下标取数组data里的值！  
            result += data[r];        //输出15次随机数的同时，让rrr加15次，就是15位的随机字符串了。  
        }
        var now = new Date();
        var day = now.getDate() + "" + now.getHours() + "" + now.getMinutes() + "" + now.getSeconds();
        return day + result;
    }
    //生成签名
    function getSign(apptoken, noncestr, usertoken) {

        var str = "appkey=" + appkey + "&apptoken=" + apptoken + "&noncestr=" + noncestr + (!usertoken ? "" : "&usertoken=" + usertoken);

        var sign = hex_md5(str).toUpperCase();

        return sign;
    }
    //设置登录类型
    function setloginType(type) {
        loginType = type;
    }
    function getLoginType() {
        return loginType
    }
    //设置登录信息
    function getLoginInfo() {
        var json = $.cookie(cookeNamePrefix + "loginInfo");
        return !json ? null : eval("(" + decodeURIComponent(json) + ")");
    }
    //设置登录信息x
    function setLoginInfo(obj) {

        return $.cookie(cookeNamePrefix + "loginInfo", JSON.stringify(obj), global_cookieConfig);
    }

    return {
        webapiUrl: webapiUrl,
        webStoreUrl: webStoreUrl,
        requestWebApi: requestWebApi,
        getAppToken: getAppToken,
        getNonceStr: getNonceStr,
        getUserToken: getUserToken,
        setUserToken: setUserToken,
        setLocalAppToken: setLocalAppToken,
        getSign: getSign,
        setloginType: setloginType,
        getloginType: getLoginType,
        setLoginInfo: setLoginInfo,
        getLoginInfo: getLoginInfo
    };

})