define(["angular", "require", "jquery", "module-services-apiUtil", "module-Services-uploader"], function (angular, require, $, apiUtil, uploader)
{
    var app = angular.module("myApp", ["ui.bootstrap"]);

    var recordStatusBar = null;//录音状态栏
    var audio_context;//路由设备上下文
    var Recorder;
    var recorderObj;//录音对象
    var recording = false;//是否正在录音

    app.directive("recorder", ["$document", "$translate", "$rootScope" , "$compile", function (e, $translate, $rootScope, $compile) {
        
    
            return {
                restrict: "EA",
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || '/static/modules/Common/directives/recorder.html';
                },
                scope: {
                    onUpload: "=onupload",
                    support: "@support"
                },
                link: function (scope, $element, attr) {

                    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia
                 
                    //不支持UserMedia接口或Chrome浏览器则不支持录音
                    //切换到Https后谷歌可兼容
                    if (!navigator.getUserMedia) {
                        $element.remove();
                    }

                    //#region 控制栏 &倒计时
                
                   

                    scope.recordingProgressPercent = function () {

                        return ((scope.recordingProgressNow / scope.recordingProgressMax) * 100) + "%";
                    }
                    scope.recordingProgressNow = 0;
                    scope.recordingProgressMax = 30;
                    scope.recordingProgressMin = 0;                  

                    //显示录音状态栏
                    var showRecordStatusBar = function () {

                        if (!recordStatusBar) {
                            var $parentElement = $element.parents(".chat-reply");

                            //在文档Body中动态添加指令
                            var $tpl = angular.element($element.children("#tpl-recordStatusBar").html());

                            //编译指令
                            recordStatusBar = $compile($tpl)(scope);

                            $parentElement.append(recordStatusBar);
                        }
                        else {
                            recordStatusBar.show();
                        }
                    }

                    //隐藏路由状态栏
                    var hideRecordingStatusBar = function () {
                        if (recordStatusBar) {

                            recordStatusBar.hide();
                        }
                    }


                    var countdownTimer;
                    var resetCountDown = function () {
                        clearTimeout(countdownTimer)
                        scope.recordingProgressNow = 0;
                        scope.recordingProgressMax = 30;
                        scope.recordingProgressMin = 0;
                        countdownTimer = null;
                    }

                    //倒计时30秒
                    var startCountdown = function () {
                        countdownTimer = setTimeout(function () {

                            if (scope.recordingProgressNow < scope.recordingProgressMax) {
                                scope.recordingProgressNow++;
                                startCountdown();

                            }
                            else {
                                //停止路由
                                scope.onStop();

                            }

                            scope.$apply();
                        }, 1000);
                    }

                    //#endregion

                    //#region 录音插件的操作   

                    function startUserMedia(stream) {

                    

                        var input = audio_context.createMediaStreamSource(stream);

                        console.log('Media stream created.');

                        // Uncomment if you want the audio to feedback directly
                        //input.connect(audio_context.destination);
                        //console.log('Input connected to audio context destination.');

                        recorderObj = new Recorder(input);
                        console.log('Recorder initialised.');
                    }

                    //开始录音
                    function startRecording() {

                        if (!recording) {
                            recording = true;

                            recorderObj && recorderObj.record();
                            console.log('Recording...');

                            return true;
                        }
                        else
                        {
                            return false;
                        }
                        
                    }

                    //停止录音
                    function stopRecording() {

                        recording = false;

                        recorderObj && recorderObj.stop();

                        console.log('Stopped recording.');

                        // create WAV download link using audio data blob
                        exportRecordFile();

                        recorderObj.clear();
                    }

                    //取消录音
                    function cancelRecording() {
                        recording = false;
                        recorderObj && recorderObj.stop();
                        console.log('Stopped recording.');
                        recorderObj.clear();
                    }

                    //导出录音文件
                    function exportRecordFile() {
                        recorderObj && recorderObj.exportWAV(function (blob) {
                            uploader.onFileUpload(blob, scope.onUpload);

                        });
                    }


                    function initRecorderPlugin(callback) {

                        if (!recorderObj) {

                            require(["plugins-recorder"], function (pluginPlugin) {

                                Recorder = pluginPlugin;

                                try {
                                    // webkit shim
                                    window.AudioContext = window.AudioContext || window.webkitAudioContext || navigator.mozAudioContext;
                                    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
                                    window.URL = window.URL || window.webkitURL;

                                    audio_context = new AudioContext;
                                    console.log('Audio context set up.');
                                    console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
                                } catch (e) {
                                    console.error('No web audio support in this browser!');
                                }

                                navigator.getUserMedia({ audio: true }, function (stream) {

                                    startUserMedia(stream)

                                    if (callback)
                                        callback();

                                }, function (e) {
                                    console.error('No live audio input', e);
                                });


                            });
                        }
                        else {
                            if (callback)
                                callback();
                        }
                    };

                    //#endregion

                    //开始
                    scope.onStart = function (handler) {

                        console.log("录音：点击了录音按钮")

                        console.log("录音：开始初始化路由插件")

                        initRecorderPlugin(function () {

                            console.log("录音：初始化路由插件完成")

                            //开始录音
                            if (startRecording()) {

                                //显示状态栏
                                showRecordStatusBar();

                                console.log("录音：初始化路由组件")



                                console.log("录音：开始录音")

                                //重设倒计时
                                resetCountDown();

                                //开始倒计时
                                startCountdown();

                                console.log("录音：开始倒计时")
                            }

                        });

                    }

                    //停止
                    scope.onStop = function () {
                        hideRecordingStatusBar();

                        //结束录音
                        stopRecording();

                        //重新设置倒计时
                        resetCountDown();

                        console.log("录音：结束录音");
                    }

                    //取消
                    scope.onCancel = function () {

                        hideRecordingStatusBar();

                        cancelRecording();

                        //重新设置倒计时
                        resetCountDown();

                        console.log("录音：取消录音")
                    }

                }
            }
        
    }])

});

