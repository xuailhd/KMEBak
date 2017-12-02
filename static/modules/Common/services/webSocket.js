define(["jquery"], function($) {

    var wsocket = null;

    function initWebSocket(onmessageCallBack) {
        if (window.WebSocket) {
            try {
                var socket = new WebSocket("ws://127.0.0.1:21398");
                socket.onmessage = onmessageCallBack;

                socket.onopen = function(event) {
                    console.log("Web Socket opened!" + this.readyState);
                };
                socket.onclose = function(event) {
                    console.log("Web Socket closed.");
                };
                socket.onerror = function(event) {
                    console.log("Web Socket 连接出错.");
                };
                return socket;
            } catch (ex) {
                console.log(ex.message);
            }
        } else {
            console.log("您的浏览器不支持 Web Socket.");
        }
    }


    return {
        initWebSocket: initWebSocket,
        wsocket: wsocket
    };
});