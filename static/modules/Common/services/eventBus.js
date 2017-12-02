"use strict";
define(function () {

    console.log("load eventBus.js");


    /*
        定义事件总线用，统一管理事件
        作者：郭明
        日期：2016年10月31日
    */
    var EventBus = (function () {

        var listeners = [];


        function EventBus() {



        }

        //订阅事件
        EventBus.prototype.subscribe = function (eventType, listener) {


            var item = { eventType: eventType, listener: listener };

            listeners.push(item);

            //返回一个取消订阅的函数
            return function unsubscribe() {

                //找到当前的 listener
                var index = listeners.indexOf(item)

                //移除当前的 listener
                listeners.splice(index, 1)

            }
        };

        //发布事件
        EventBus.prototype.dispatch = function (eventType, eventArgs, delayCount) {

            if (!delayCount && delayCount !== 0) {
                delayCount = 100;
            }

            var self = this;

            var myListeners = listeners.filter(function (item) {

                return eventType == "" || item.eventType == eventType;

            });

            //如果没有订阅者，那么延迟处理
            if (myListeners.length == 0) {

                //重试10次，每次延迟10毫秒
                delayCount > 0 && setTimeout(function () {

                    self.dispatch(eventType, eventArgs, --delayCount);

                }, 20);
            }

            myListeners.forEach(function (item) {


                item.listener(item.eventType, eventArgs)

            })
        };

        return EventBus;

    })([]);

    //返回实例
    return new EventBus();
})