define(["angular"], function (angular) {
    var app = angular.module("myApp", ["ui.bootstrap"]);

    app.factory("utilFactory", ["$q", "$rootScope", "confFactory",
        function (e, t, o) {
            function n(e, t, o, n) {
                var r;
                (r = l[e]) ? (r.intervalSum += o, n && n <= r.intervalSum && (setTimeout(t, 0), l[e].intervalSum = 0), clearTimeout(r.timer), r.timer = setTimeout(function () {
                    delete l[e], setTimeout(t, 0)
                }, o)) : (setTimeout(t, 0), l[e] = {
                    intervalSum: 0,
                    timer: setTimeout(function () {
                        delete l[e]
                    }, o)
                })
            }

            var u = {
                isLog: !1,
                log: function () {
                    this.isLog && console.log(arguments)
                }, now: function () {
                    return +new Date
                }, browser: function () {
                    var e, t = navigator.userAgent.toLowerCase();
                    if (null != t.match(/trident/)) e = {
                        browser: "msie",
                        version: null != t.match(/msie ([\d.]+)/) ? t.match(/msie ([\d.]+)/)[1] : t.match(/rv:([\d.]+)/)[1]
                    };
                    else {
                        var o = /(msie) ([\w.]+)/.exec(t) || /(chrome)[ \/]([\w.]+)/.exec(t) || /(webkit)[ \/]([\w.]+)/.exec(t) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) || t.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t) || [];
                        e = {
                            browser: o[1] || "",
                            version: o[2] || "0"
                        }
                    }
                    var n = {};
                    return e.browser && (n[e.browser] = !0, n.version = e.version), n.chrome ? n.webkit = !0 : n.webkit && (n.safari = !0), n
                }(),
                initMsgNoticePlayer: function (e) {
                    var t = jQuery("#msgNoticePlayer");
                    require.async(["jplayer"], function () {
                        t.jPlayer({
                            ready: function () { }, swfPath: window.MMSource.jplayerSwfPath,
                            solution: "html, flash",
                            supplied: "mp3",
                            wmode: "window"
                        }), t.jPlayer("stop"), t.jPlayer("setMedia", {
                            mp3: e
                        }), t.jPlayer("play")
                    })
                },
                isMacOS: /macintosh/gi.test(navigator.userAgent),
                isIPad: /ipad/gi.test(navigator.userAgent)
            };
            return u
        }
    ])

    app.factory("confFactory", ["$q", function () {

        var a = {

            KEYCODE_BACKSPACE: 8,
            KEYCODE_ENTER: 13,
            KEYCODE_SHIFT: 16,
            KEYCODE_ESC: 27,
            KEYCODE_DELETE: 34,
            KEYCODE_ARROW_LEFT: 37,
            KEYCODE_ARROW_UP: 38,
            KEYCODE_ARROW_RIGHT: 39,
            KEYCODE_ARROW_DOWN: 40,
            KEYCODE_NUM2: 50,
            KEYCODE_AT: 64,
            KEYCODE_NUM_ADD: 107,
            KEYCODE_NUM_MINUS: 109,
            KEYCODE_ADD: 187,
            KEYCODE_MINUS: 189

        };

        return a;
    }
    ])

    app.directive("preview", ["$document", "confFactory", "utilFactory", function (e, t, o) {

        return {
            restrict: "EA",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/static/modules/Common/directives/preview.html';
            },
            scope: { imageList: "=", current: "=" },
            link: function (n, r) {
                function a(e) {
                    
                    switch (e.keyCode) {
                        case t.KEYCODE_ARROW_UP:
                        case t.KEYCODE_ARROW_LEFT: n.actions.prev(); break;
                        case t.KEYCODE_ARROW_DOWN: case t.KEYCODE_ARROW_RIGHT:
                            n.actions.next(); break;
                        case t.KEYCODE_ESC:
                            n.actions.close()
                    } n.$digest(), e.preventDefault(), e.stopPropagation()
                }

                function i(e) {

                    switch (e.keyCode) {
                        case t.KEYCODE_NUM_ADD:
                        case t.KEYCODE_ADD: c({ delta: 1 }); break;
                        case t.KEYCODE_NUM_MINUS:
                        case t.KEYCODE_MINUS: c({ delta: -1 })
                    } e.preventDefault(), e.stopPropagation()
                }

                function c(e) {
                    var t, o; if (e.scale) t = e.scale, o = { x: .5, y: .5 }; else {
                        var n = e.delta; o = e.posRatio || { x: .5, y: .5 }, t = y.scale, t = n > 0 ? t + w : t - w
                    } t = t > S ? S : 1 / S > t ? 1 / S : t; var r = {
                        width: Math.round(M.width * t),
                        height: Math.round(M.height * t), scale: t
                    }; r.top = Math.round(y.top - o.y * (r.height - y.height)), r.left = Math.round(y.left - o.x * (r.width - y.width)), y = r, d.css(r)
                }

                function s(e) {

                    angular.extend(y, e), d.css(e)

                }

                function l(e) {
                    s({ top: e.clientY - C.y + v.top, left: e.clientX - C.x + v.left }), e.preventDefault()
                }

                function u() {

                    d.on("mousedown", function (e) {
                        return N ? void n.actions.close() : (C = { x: e.clientX, y: e.clientY }, v = { top: y.top, left: y.left }, g.css("display", "none"), d.on("mousemove", l), void e.stopPropagation())
                    }).on("mouseup", function () { d.off("mousemove", l), g.css("display", "block") }).on(P, function (e) { var t, o = e.originalEvent; ("mousewheel" == o.type || "DOMMouseScroll" == o.type) && (t = o.wheelDelta ? o.wheelDelta / 120 : -(o.detail || 0) / 3), void 0 !== t && (c(N ? { delta: t } : { delta: t, posRatio: { x: o.offsetX / y.width, y: o.offsetY / y.height } }), e.preventDefault(), e.stopPropagation()) }), e.keydown(i)
                }

                function f() {

                    var e = n.imageList[n.current].preview; n.isLoaded = !1, n.rotateDeg = 0, e && (n.containerStyle = {
                        background: "url(" + e + ") no-repeat center center", "background-size": "auto"
                    });

                    var t = new Image; t.onload = function ()
                    {
                        t.onload = null,
                        M = { width: t.width, height: t.height },
                            y = { width: M.width, height: M.height, top: (h - M.height) / 2, left: (p - M.width) / 2, scale: 1 };
                        var e = T / t.height, o = b / t.width; 1 > e && 1 > o ? c({ scale: o > e ? e : o }) : 1 > e ? c({ scale: e }) : 1 > o ? c({ scale: o }) : d.css(y), angular.extend(E, y), m[0].src = t.src, n.isLoaded = !0, n.containerStyle = null, n.$digest()
                    }, t.onerror = function (e) {
                     
                        t.onerror = null
                        //alert(MM.context("845ec73"))
                    }, t.src = n.imageList[n.current].url

                }

                var d = r.find("#img_dom"), g = r.find("#img_opr_container"),
                    m = d.find("#img_preview"),
                    p = document.documentElement.clientWidth,
                    h = document.documentElement.clientHeight - parseInt(g.css("bottom")) - parseInt(g.height());
                n.isLoaded = !1, n.rotateDeg = 0, n.isIE = !!(o.browser.msie && o.version < 10), n.actions = { next: function () { n.current < n.imageList.length - 1 && (n.current++, f()) }, prev: function () { n.current > 0 && (n.current--, f()) }, rotate: function () { n.rotateDeg = (n.rotateDeg + 90) % 360, c({ scale: E.scale }), s({ top: (h - y.height) / 2, left: (p - y.width) / 2 }), n.reflowFlag = !n.reflowFlag }, close: function () { r.remove(), n.$destroy() } }, n.$on("$destroy", function () { e.unbind("keyup", a), e.unbind("keydown", i) }), e.keyup(a); var M, y, C, v, S = 5, w = .1, b = .8 * p, T = .8 * h, E = {}, N = void 0 !== document.mozHidden, P = N ? "DOMMouseScroll" : "mousewheel"; d.on("click", function (e) { e.stopPropagation() }), g.on("click", function (e) { e.stopPropagation() }), $("#preview_container").on("click", function () { n.actions.close() }), u(), f()
            }
        }
    }]).provider("preview", function () {

        return {
            $get: ["$rootScope", "$document", "$compile", function (e, t, o) {
                var n = {
                    open: function (r) {
                        if (!r.imageList || r.imageList.length <= 0) return !1; n.instance && (n.instance.close(), n.instance = null); var a = {}; n.isOpen = !0, r = r || {}, angular.extend(a, r); var i; i = e.$new(), angular.extend(i, { imageList: r.imageList, current: r.current });
                        var c = angular.element('<div preview class="J_Preview" current="current" image-list="imageList"></div>'), s = o(c)(i), l = t.find("body").eq(0); l.append(s); var u = { close: function () { var e = s.scope(); e && e.$destroy(), s.remove() } }; return n.instance = u, u
                    }
                }; return n
            }]
        }
    })

});