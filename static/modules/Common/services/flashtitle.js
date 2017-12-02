define([], function () {

    var flashTitle = {
        time: 0,
        title: document.title,
        timer: null,
        // 显示新消息提示  
        show: function () {
            var title = flashTitle.title.replace("【　　　】", "").replace("【新消息】", "");
            // 定时器，设置消息切换频率闪烁效果就此产生  
            flashTitle.timer = setTimeout(function () {
                flashTitle.time++;
                flashTitle.show();
                if (flashTitle.time % 2 == 0) {
                    document.title = "【新消息】" + title
                }

                else {
                    document.title = "【　　　】" + title
                };
            }, 600);
            return [flashTitle.timer, flashTitle.title];
        },
        // 取消新消息提示  
        clear: function () {
            clearTimeout(flashTitle.timer);
            document.title = flashTitle.title;
        }
    };

    return flashTitle;
});