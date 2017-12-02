define(["module-services-apiUtil"], function (apiUtil) {

    var timer = null;

    //发送心跳包（用户登录后）
    function heartbeat(typeName) {

        //apiUtil.requestWebApi(global_ApiConfig.CommonApiUrl + "/heartbeat?type=" + typeName, "GET", { }, function (result) {
        //    timer = setTimeout(function () { heartbeat(typeName) }, 10000);
        //}, function (result)
        //{
        //    console.warn(result.Msg);

        //    if (result.Status == 6 || result.Status == 5) {
        //        console.warn("用户未登录，停止发送心跳")
        //        stop()
        //    }
        //    else
        //    {
        //        timer = setTimeout(function () { heartbeat(typeName) }, 5000);
        //    }
        //});
    }

    function start(type)
    {
        
        if (!timer) {
            heartbeat(type)
        }
    }

    function stop()
    {
        clearTimeout(timer);
        timer = null;
    }

    return {
        start: start,
        stop: stop
    };
})