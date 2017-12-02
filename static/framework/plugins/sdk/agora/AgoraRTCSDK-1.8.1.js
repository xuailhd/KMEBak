var AgoraRTC = function() {
    var d = {};
    Object.defineProperties(d, {
        version: {
            get: function() {
                return "<%= pkg.version %>"
            }
        },
        name: {
            get: function() {
                return "<%= pkg.title %>"
            }
        }
    });
    return d
} (),
L = {};
AgoraRTC.EventDispatcher = function(d) {
    var a = {};
    d.dispatcher = {};
    d.dispatcher.eventListeners = {};
    a.addEventListener = function(a, c) {
        void 0 === d.dispatcher.eventListeners[a] && (d.dispatcher.eventListeners[a] = []);
        d.dispatcher.eventListeners[a].push(c)
    };
    a.on = a.addEventListener;
    a.removeEventListener = function(a, c) {
        var e;
        e = d.dispatcher.eventListeners[a].indexOf(c); - 1 !== e && d.dispatcher.eventListeners[a].splice(e, 1)
    };
    a.dispatchEvent = function(a) {
        var c;
        L.Logger.debug("Event: " + a.type);
        for (c in d.dispatcher.eventListeners[a.type]) if (d.dispatcher.eventListeners[a.type].hasOwnProperty(c) && "function" === typeof d.dispatcher.eventListeners[a.type][c]) d.dispatcher.eventListeners[a.type][c](a)
    };
    return a
};
AgoraRTC.LicodeEvent = function(d) {
    var a = {};
    a.type = d.type;
    return a
};
AgoraRTC.StreamEvent = function(d) {
    var a = AgoraRTC.LicodeEvent(d);
    a.stream = d.stream;
    a.msg = d.msg;
    return a
};
AgoraRTC.ClientEvent = function(d) {
    var a = AgoraRTC.LicodeEvent(d);
    a.uid = d.uid;
    a.attr = d.attr;
    a.stream = d.stream;
    return a
};
AgoraRTC.MediaEvent = function(d) {
    var a = AgoraRTC.LicodeEvent(d);
    a.msg = d.msg;
    return a
};
AgoraRTC.FcStack = function() {
    return {
        addStream: function() {}
    }
};
AgoraRTC.FirefoxStack = function(d) {
    var a = {},
    b = mozRTCPeerConnection,
    c = mozRTCSessionDescription,
    e = !1;
    a.pc_config = {
        iceServers: []
    };
    d.iceServers instanceof Array ? d.iceServers.map(function(c) {
        0 === c.url.indexOf("stun:") && a.pc_config.iceServers.push({
            url: c.url
        })
    }) : d.stunServerUrl && (d.stunServerUrl instanceof Array ? d.stunServerUrl.map(function(c) {
        "string" === typeof c && "" !== c && a.pc_config.iceServers.push({
            url: c
        })
    }) : "string" === typeof d.stunServerUrl && "" !== d.stunServerUrl && a.pc_config.iceServers.push({
        url: d.stunServerUrl
    }));
    void 0 === d.audio && (d.audio = !0);
    void 0 === d.video && (d.video = !0);
    a.mediaConstraints = {
        offerToReceiveAudio: d.audio,
        offerToReceiveVideo: d.video,
        mozDontOfferDataChannel: !0
    };
    a.roapSessionId = 103;
    a.peerConnection = new b(a.pc_config);
    a.peerConnection.onicecandidate = function(c) {
        L.Logger.debug("PeerConnection: ", d.session_id);
        if (c.candidate) a.iceCandidateCount = a.iceCandidateCount + 1;
        else {
            L.Logger.debug("State: " + a.peerConnection.iceGatheringState);
            if (a.ices === void 0) a.ices = 0;
            a.ices = a.ices + 1;
            L.Logger.debug(a.ices);
            if (a.ices >= 1 && a.moreIceComing) {
                a.moreIceComing = false;
                a.markActionNeeded()
            }
        }
    };
    L.Logger.debug('Created webkitRTCPeerConnnection with config "' + JSON.stringify(a.pc_config) + '".');
    a.processSignalingMessage = function(b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        if (a.state === "new") if (b.messageType === "OFFER") {
            b.sdp = f(b.sdp);
            b = {
                sdp: b.sdp,
                type: "offer"
            };
            a.peerConnection.setRemoteDescription(new c(b),
            function() {
                L.Logger.debug("setRemoteDescription succeeded")
            },
            function(a) {
                L.Logger.info("setRemoteDescription failed: " + a.name)
            });
            a.state = "offer-received";
            a.markActionNeeded()
        } else a.error("Illegal message for this state: " + b.messageType + " in state " + a.state);
        else if (a.state === "offer-sent") if (b.messageType === "ANSWER") {
            b.sdp = f(b.sdp);
            b.sdp = b.sdp.replace(/ generation 0/g, "");
            b.sdp = b.sdp.replace(/ udp /g, " UDP ");
            b.sdp = b.sdp.replace(/a=group:BUNDLE audio video/, "a=group:BUNDLE sdparta_0 sdparta_1");
            b.sdp = b.sdp.replace(/a=mid:audio/, "a=mid:sdparta_0");
            b.sdp = b.sdp.replace(/a=mid:video/, "a=mid:sdparta_1");
            b = {
                sdp: b.sdp,
                type: "answer"
            };
            L.Logger.debug("Received ANSWER: ", b.sdp);
            a.peerConnection.setRemoteDescription(new c(b),
            function() {
                L.Logger.debug("setRemoteDescription succeeded")
            },
            function(a) {
                L.Logger.info("setRemoteDescription failed: " + a)
            });
            a.sendOK();
            a.state = "established"
        } else if (b.messageType === "pr-answer") {
            b = {
                sdp: b.sdp,
                type: "pr-answer"
            };
            a.peerConnection.setRemoteDescription(new c(b),
            function() {
                L.Logger.debug("setRemoteDescription succeeded")
            },
            function(a) {
                L.Logger.info("setRemoteDescription failed: " + a.name)
            })
        } else b.messageType === "offer" ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state);
        else if (a.state === "established") if (b.messageType === "OFFER") {
            b = {
                sdp: b.sdp,
                type: "offer"
            };
            a.peerConnection.setRemoteDescription(new c(b),
            function() {
                L.Logger.debug("setRemoteDescription succeeded")
            },
            function(a) {
                L.Logger.info("setRemoteDescription failed: " + a.name)
            });
            a.state = "offer-received";
            a.markActionNeeded()
        } else a.error("Illegal message for this state: " + b.messageType + " in state " + a.state)
    };
    a.addStream = function(b) {
        e = true;
        a.peerConnection.addStream(b);
        a.markActionNeeded()
    };
    a.removeStream = function() {
        a.markActionNeeded()
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function() {
        a.actionNeeded = true;
        a.doLater(function() {
            a.onstablestate()
        })
    };
    a.doLater = function(a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function() {
        var b;
        if (a.actionNeeded) {
            if (a.state === "new" || a.state === "established") {
                L.Logger.debug("Creating offer");
                if (e) a.mediaConstraints = void 0; (function() {
                    a.peerConnection.createOffer(function(b) {
                        b.sdp = f(b.sdp);
                        var c = b.sdp;
                        L.Logger.debug("Changed", b.sdp);
                        if (c !== a.prevOffer) {
                            a.peerConnection.setLocalDescription(b);
                            a.state = "preparing-offer";
                            a.markActionNeeded()
                        } else L.Logger.debug("Not sending a new offer")
                    },
                    function(a) {
                        L.Logger.debug("Ups! Something went wrong ", a)
                    },
                    a.mediaConstraints)
                })()
            } else if (a.state === "preparing-offer") {
                if (a.moreIceComing) return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: ", a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if (a.state === "offer-received") a.peerConnection.createAnswer(function(b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                if (a.iceStarted) a.markActionNeeded();
                else {
                    L.Logger.debug((new Date).getTime() + ": Starting ICE in responder");
                    a.iceStarted = true
                }
            },
            function() {
                L.Logger.debug("Ups! Something went wrong")
            });
            else if (a.state === "offer-received-preparing-answer") {
                if (a.moreIceComing) return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
            a.actionNeeded = false
        }
    };
    a.sendOK = function() {
        a.sendMessage("OK")
    };
    a.sendMessage = function(b, c) {
        var d = {};
        d.messageType = b;
        d.sdp = c;
        if (b === "OFFER") {
            d.offererSessionId = a.sessionId;
            d.answererSessionId = a.otherSessionId;
            d.seq = a.sequenceNumber = a.sequenceNumber + 1;
            d.tiebreaker = Math.floor(Math.random() * 429496723 + 1)
        } else {
            d.offererSessionId = a.incomingMessage.offererSessionId;
            d.answererSessionId = a.sessionId;
            d.seq = a.incomingMessage.seq
        }
        a.onsignalingmessage(JSON.stringify(d))
    };
    a.error = function(a) {
        throw "Error in RoapOnJsep: " + a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = d.callback;
    a.peerConnection.onopen = function() {
        if (a.onopen) a.onopen()
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function(b) {
        if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
    };
    var f = function(a) {
        if (d.video && d.maxVideoBW) {
            var b = a.match(/m=video.*\r\n/);
            b == null && (b = a.match(/m=video.*\n/));
            if (b && b.length > 0) var c = b[0] + "b=AS:" + d.maxVideoBW + "\r\n",
            a = a.replace(b[0], c)
        }
        if (d.audio && d.maxAudioBW) {
            b = a.match(/m=audio.*\r\n/);
            b == null && (b = a.match(/m=audio.*\n/));
            if (b && b.length > 0) {
                c = b[0] + "b=AS:" + d.maxAudioBW + "\r\n";
                a = a.replace(b[0], c)
            }
        }
        return a
    };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
AgoraRTC.ChromeStableStack = function(d) {
    var a = {},
    b = RTCPeerConnection;
    a.pc_config = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    d.iceServers instanceof Array ? a.pc_config.iceServers = d.iceServers: (d.stunServerUrl && (d.stunServerUrl instanceof Array ? d.stunServerUrl.map(function(b) {
        "string" === typeof b && "" !== b && a.pc_config.iceServers.push({
            url: b
        })
    }) : "string" === typeof d.stunServerUrl && "" !== d.stunServerUrl && a.pc_config.iceServers.push({
        url: d.stunServerUrl
    })), d.turnServer && (d.turnServer instanceof Array ? d.turnServer.map(function(b) {
        "string" === typeof b.url && "" !== b.url && a.pc_config.iceServers.push({
            username: b.username,
            credential: b.password,
            url: b.url
        })
    }) : "string" === typeof d.turnServer.url && "" !== d.turnServer.url && a.pc_config.iceServers.push({
        username: d.turnServer.username,
        credential: d.turnServer.password,
        url: d.turnServer.url
    })));
    void 0 === d.audio && (d.audio = !0);
    void 0 === d.video && (d.video = !0);
    a.mediaConstraints = {
        mandatory: {
            OfferToReceiveVideo: d.video,
            OfferToReceiveAudio: d.audio
        }
    };
    a.roapSessionId = 103;
    a.peerConnection = new b(a.pc_config, a.con);
    a.peerConnection.onicecandidate = function(b) {
        L.Logger.debug("PeerConnection: ", d.session_id);
        if (b.candidate) {
            if (a.iceCandidateCount === 0) a.timeout = setTimeout(function() {
                if (a.moreIceComing) {
                    a.moreIceComing = false;
                    a.markActionNeeded()
                }
            },
            1E3);
            a.iceCandidateCount = a.iceCandidateCount + 1
        } else {
            L.Logger.debug("State: " + a.peerConnection.iceGatheringState);
            clearTimeout(a.timeout);
            if (a.ices === void 0) a.ices = 0;
            a.ices = a.ices + 1;
            if (a.ices >= 1 && a.moreIceComing) {
                a.moreIceComing = false;
                a.markActionNeeded()
            }
        }
    };
    var c = function(a) {
        var b, c;
        if (d.minVideoBW && d.maxVideoBW) {
            b = a.match(/m=video.*\r\n/);
            c = b[0] + "b=AS:" + d.maxVideoBW + "\r\n";
            a = a.replace(b[0], c);
            L.Logger.debug("Set Video Bitrate - min:" + d.minVideoBW + " max:" + d.maxVideoBW)
        }
        if (d.maxAudioBW) {
            b = a.match(/m=audio.*\r\n/);
            c = b[0] + "b=AS:" + d.maxAudioBW + "\r\n";
            a = a.replace(b[0], c)
        }
        return a
    };
    a.processSignalingMessage = function(b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        if (a.state === "new") if (b.messageType === "OFFER") {
            b = {
                sdp: b.sdp,
                type: "offer"
            };
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(b));
            a.state = "offer-received";
            a.markActionNeeded()
        } else a.error("Illegal message for this state: " + b.messageType + " in state " + a.state);
        else if (a.state === "offer-sent") if (b.messageType === "ANSWER") {
            b = {
                sdp: b.sdp,
                type: "answer"
            };
            L.Logger.debug("Received ANSWER: ", b.sdp);
            b.sdp = c(b.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(b));
            a.sendOK();
            a.state = "established"
        } else if (b.messageType === "pr-answer") {
            b = {
                sdp: b.sdp,
                type: "pr-answer"
            };
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(b))
        } else b.messageType === "offer" ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state);
        else if (a.state === "established") if (b.messageType === "OFFER") {
            b = {
                sdp: b.sdp,
                type: "offer"
            };
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(b));
            a.state = "offer-received";
            a.markActionNeeded()
        } else a.error("Illegal message for this state: " + b.messageType + " in state " + a.state)
    };
    a.getStats = function(b) {
        a.peerConnection.getStats(null,
        function(a) {
            Object.keys(a).forEach(function(c) {
                c = a[c];
                c.type === "ssrc" && b(c)
            })
        })
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b);
        a.markActionNeeded()
    };
    a.removeStream = function() {
        a.markActionNeeded()
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function() {
        a.actionNeeded = true;
        a.doLater(function() {
            a.onstablestate()
        })
    };
    a.doLater = function(a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function() {
        var b;
        if (a.actionNeeded) {
            if (a.state === "new" || a.state === "established") a.peerConnection.createOffer(function(b) {
                b.sdp = c(b.sdp);
                if (b.sdp !== a.prevOffer) {
                    a.peerConnection.setLocalDescription(b);
                    a.state = "preparing-offer";
                    a.markActionNeeded()
                } else L.Logger.debug("Not sending a new offer")
            },
            function(a) {
                L.Logger.debug("peer connection create offer failed ", a)
            },
            a.mediaConstraints);
            else if (a.state === "preparing-offer") {
                if (a.moreIceComing) return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: " + a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if (a.state === "offer-received") a.peerConnection.createAnswer(function(b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                if (a.iceStarted) a.markActionNeeded();
                else {
                    L.Logger.debug((new Date).getTime() + ": Starting ICE in responder");
                    a.iceStarted = true
                }
            },
            function(a) {
                L.Logger.debug("peer connection create answer failed ", a)
            },
            a.mediaConstraints);
            else if (a.state === "offer-received-preparing-answer") {
                if (a.moreIceComing) return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
            a.actionNeeded = false
        }
    };
    a.sendOK = function() {
        a.sendMessage("OK")
    };
    a.sendMessage = function(b, c) {
        var d = {};
        d.messageType = b;
        d.sdp = c;
        if (b === "OFFER") {
            d.offererSessionId = a.sessionId;
            d.answererSessionId = a.otherSessionId;
            d.seq = a.sequenceNumber = a.sequenceNumber + 1;
            d.tiebreaker = Math.floor(Math.random() * 429496723 + 1)
        } else {
            d.offererSessionId = a.incomingMessage.offererSessionId;
            d.answererSessionId = a.sessionId;
            d.seq = a.incomingMessage.seq
        }
        a.onsignalingmessage(JSON.stringify(d))
    };
    a.error = function(a) {
        throw "Error in RoapOnJsep: " + a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = d.callback;
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function(b) {
        if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
    };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
AgoraRTC.ChromeCanaryStack = function(d) {
    var a = {},
    b = webkitRTCPeerConnection;
    a.pc_config = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    d.iceServers instanceof Array ? a.pc_config.iceServers = d.iceServers: (d.stunServerUrl && (d.stunServerUrl instanceof Array ? d.stunServerUrl.map(function(b) {
        "string" === typeof b && "" !== b && a.pc_config.iceServers.push({
            url: b
        })
    }) : "string" === typeof d.stunServerUrl && "" !== d.stunServerUrl && a.pc_config.iceServers.push({
        url: d.stunServerUrl
    })), d.turnServer && (d.turnServer instanceof Array ? d.turnServer.map(function(b) {
        "string" === typeof b.url && "" !== b.url && a.pc_config.iceServers.push({
            username: b.username,
            credential: b.password,
            url: b.url
        })
    }) : "string" === typeof d.turnServer.url && "" !== d.turnServer.url && a.pc_config.iceServers.push({
        username: d.turnServer.username,
        credential: d.turnServer.password,
        url: d.turnServer.url
    })));
    void 0 === d.audio && (d.audio = !0);
    void 0 === d.video && (d.video = !0);
    a.mediaConstraints = {
        mandatory: {
            OfferToReceiveVideo: d.video,
            OfferToReceiveAudio: d.audio
        }
    };
    a.roapSessionId = 103;
    a.peerConnection = new b(a.pc_config, a.con);
    a.peerConnection.onicecandidate = function(b) {
        L.Logger.debug("PeerConnection: ", d.session_id);
        if (b.candidate) a.iceCandidateCount = a.iceCandidateCount + 1;
        else {
            L.Logger.debug("State: " + a.peerConnection.iceGatheringState);
            if (a.ices === void 0) a.ices = 0;
            a.ices = a.ices + 1;
            if (a.ices >= 1 && a.moreIceComing) {
                a.moreIceComing = false;
                a.markActionNeeded()
            }
        }
    };
    var c = function(a) {
        var b, c;
        if (d.minVideoBW && d.maxVideoBW) {
            b = a.match(/m=video.*\r\n/);
            c = b[0] + "b=AS:" + d.maxVideoBW + "\r\n";
            a = a.replace(b[0], c);
            L.Logger.debug("Set Video Bitrate - min:" + d.minVideoBW + " max:" + d.maxVideoBW)
        }
        if (d.maxAudioBW) {
            b = a.match(/m=audio.*\r\n/);
            c = b[0] + "b=AS:" + d.maxAudioBW + "\r\n";
            a = a.replace(b[0], c)
        }
        return a
    };
    a.processSignalingMessage = function(b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        if (a.state === "new") if (b.messageType === "OFFER") {
            b = {
                sdp: b.sdp,
                type: "offer"
            };
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(b));
            a.state = "offer-received";
            a.markActionNeeded()
        } else a.error("Illegal message for this state: " + b.messageType + " in state " + a.state);
        else if (a.state === "offer-sent") if (b.messageType === "ANSWER") {
            b = {
                sdp: b.sdp,
                type: "answer"
            };
            L.Logger.debug("Received ANSWER: ", b.sdp);
            b.sdp = c(b.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(b));
            a.sendOK();
            a.state = "established"
        } else if (b.messageType === "pr-answer") {
            b = {
                sdp: b.sdp,
                type: "pr-answer"
            };
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(b))
        } else b.messageType === "offer" ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state);
        else if (a.state === "established") if (b.messageType === "OFFER") {
            b = {
                sdp: b.sdp,
                type: "offer"
            };
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(b));
            a.state = "offer-received";
            a.markActionNeeded()
        } else a.error("Illegal message for this state: " + b.messageType + " in state " + a.state)
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b);
        a.markActionNeeded()
    };
    a.removeStream = function() {
        a.markActionNeeded()
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function() {
        a.actionNeeded = true;
        a.doLater(function() {
            a.onstablestate()
        })
    };
    a.doLater = function(a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function() {
        var b;
        if (a.actionNeeded) {
            if (a.state === "new" || a.state === "established") a.peerConnection.createOffer(function(b) {
                b.sdp = c(b.sdp);
                L.Logger.debug("Changed", b.sdp);
                if (b.sdp !== a.prevOffer) {
                    a.peerConnection.setLocalDescription(b);
                    a.state = "preparing-offer";
                    a.markActionNeeded()
                } else L.Logger.debug("Not sending a new offer")
            },
            function(a) {
                L.Logger.debug("peer connection create offer failed ", a)
            },
            a.mediaConstraints);
            else if (a.state === "preparing-offer") {
                if (a.moreIceComing) return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: " + a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if (a.state === "offer-received") a.peerConnection.createAnswer(function(b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                if (a.iceStarted) a.markActionNeeded();
                else {
                    L.Logger.debug((new Date).getTime() + ": Starting ICE in responder");
                    a.iceStarted = true
                }
            },
            function(a) {
                L.Logger.debug("peer connection create answer failed ", a)
            },
            a.mediaConstraints);
            else if (a.state === "offer-received-preparing-answer") {
                if (a.moreIceComing) return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
            a.actionNeeded = false
        }
    };
    a.sendOK = function() {
        a.sendMessage("OK")
    };
    a.sendMessage = function(b, c) {
        var d = {};
        d.messageType = b;
        d.sdp = c;
        if (b === "OFFER") {
            d.offererSessionId = a.sessionId;
            d.answererSessionId = a.otherSessionId;
            d.seq = a.sequenceNumber = a.sequenceNumber + 1;
            d.tiebreaker = Math.floor(Math.random() * 429496723 + 1)
        } else {
            d.offererSessionId = a.incomingMessage.offererSessionId;
            d.answererSessionId = a.sessionId;
            d.seq = a.incomingMessage.seq
        }
        a.onsignalingmessage(JSON.stringify(d))
    };
    a.error = function(a) {
        throw "Error in RoapOnJsep: " + a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = d.callback;
    a.peerConnection.onopen = function() {
        if (a.onopen) a.onopen()
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function(b) {
        if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
    };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
AgoraRTC.sessionId = 103;
AgoraRTC.Connection = function(d) {
    var a = {};
    d.session_id = AgoraRTC.sessionId += 1;
    if ("undefined" !== typeof module && module.exports) L.Logger.error("Publish/subscribe video/audio streams not supported yet"),
    a = AgoraRTC.FcStack(d);
    else if (null !== window.navigator.userAgent.match("Firefox")) a.browser = "mozilla",
    a = AgoraRTC.FirefoxStack(d);
    else if (window.navigator.userAgent.indexOf("Safari")) L.Logger.debug("Safari"),
    a = AgoraRTC.ChromeStableStack(d),
    a.browser = "safari";
    else if (window.navigator.userAgent.indexOf("MSIE ")) L.Logger.debug("IE"),
    a = AgoraRTC.ChromeStableStack(d),
    a.browser = "ie";
    else if (26 <= window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1]) L.Logger.debug("Stable"),
    a = AgoraRTC.ChromeStableStack(d),
    a.browser = "chrome-stable";
    else if (40 <= window.navigator.userAgent.toLowerCase().indexOf("chrome")) L.Logger.debug("Canary!"),
    a = AgoraRTC.ChromeCanaryStack(d),
    a.browser = "chrome-canary";
    else throw a.browser = "none",
    "WebRTC stack not available";
    return a
};
AgoraRTC.GetUserMedia = function(d, a, b) {
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (d.screen) if (L.Logger.debug("Screen access requested"), null !== window.navigator.userAgent.match("Firefox")) {
        var c = {};
        void 0 != d.video.mandatory ? (c.video = d.video, c.video.mediaSource = "window") : c = {
            video: {
                mediaSource: "window"
            }
        };
        navigator.getMedia(c, a, b)
    } else if (null !== window.navigator.userAgent.match("Chrome")) if (34 > window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1]) b({
        code: "This browser does not support screen sharing"
    });
    else {
        var e = "okeephmleflklcdebijnponpabbmmgeo";
        d.extensionId && (L.Logger.debug("extensionId supplied, using " + d.extensionId), e = d.extensionId);
        L.Logger.debug("Screen access on chrome stable, looking for extension");
        try {
            chrome.runtime.sendMessage(e, {
                getStream: !0
            },
            function(e) {
                if (e === void 0) {
                    L.Logger.debug("Access to screen denied");
                    b({
                        code: "Access to screen denied"
                    })
                } else {
                    c = {
                        video: {
                            mandatory: {
                                chromeMediaSource: "desktop",
                                chromeMediaSourceId: e.streamId,
                                maxHeight: d.attributes.height,
                                maxWidth: d.attributes.width,
                                maxFrameRate: d.attributes.maxFr,
                                minFrameRate: d.attributes.minFr
                            }
                        }
                    };
                    navigator.getMedia(c, a, b)
                }
            })
        } catch(f) {
            L.Logger.debug("AgoraRTC screensharing plugin is not accessible"),
            b({
                code: "no_plugin_present"
            })
        }
    } else L.Logger.debug("This browser does not support screenSharing");
    else "undefined" !== typeof module && module.exports ? L.Logger.error("Video/audio streams not supported yet") : navigator.getMedia(d, a, b)
};
L.Logger = function() {
    var d = 0,
    a;
    a = function() {
        var a = arguments[0],
        c = arguments;
        if (! (a < d)) {
            switch (a) {
            case 0:
                c[0] = "DEBUG:";
                break;
            case 1:
                c[0] = "TRACE:";
                break;
            case 2:
                c[0] = "INFO:";
                break;
            case 3:
                c[0] = "WARNING:";
                break;
            case 4:
                c[0] = "ERROR:";
                break;
            default:
                return
            }
            console.log.apply(console, c)
        }
    };
    return {
        DEBUG: 0,
        TRACE: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4,
        NONE: 5,
        setLogLevel: function(a) {
            5 < a ? a = 5 : 0 > a && (a = 0);
            d = a
        },
        log: a,
        debug: function() {
            for (var b = [0], c = 0; c < arguments.length; c++) b.push(arguments[c]);
            a.apply(this, b)
        },
        trace: function() {
            for (var b = [1], c = 0; c < arguments.length; c++) b.push(arguments[c]);
            a.apply(this, b)
        },
        info: function() {
            for (var b = [2], c = 0; c < arguments.length; c++) b.push(arguments[c]);
            a.apply(this, b)
        },
        warning: function() {
            for (var b = [3], c = 0; c < arguments.length; c++) b.push(arguments[c]);
            a.apply(this, b)
        },
        error: function() {
            for (var b = [4], c = 0; c < arguments.length; c++) b.push(arguments[c]);
            a.apply(this, b)
        }
    }
} ();
L.Base64 = function() {
    var d, a, b, c, e, f, g, h, i;
    d = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/".split(",");
    a = [];
    for (e = 0; e < d.length; e += 1) a[d[e]] = e;
    f = function(a) {
        b = a;
        c = 0
    };
    g = function() {
        var a;
        if (!b || c >= b.length) return - 1;
        a = b.charCodeAt(c) & 255;
        c += 1;
        return a
    };
    h = function() {
        if (!b) return - 1;
        for (;;) {
            if (c >= b.length) return - 1;
            var d = b.charAt(c);
            c += 1;
            if (a[d]) return a[d];
            if ("A" === d) return 0
        }
    };
    i = function(a) {
        a = a.toString(16);
        1 === a.length && (a = "0" + a);
        return unescape("%" + a)
    };
    return {
        encodeBase64: function(a) {
            var b, c, i;
            f(a);
            a = "";
            b = Array(3);
            c = 0;
            for (i = !1; ! i && -1 !== (b[0] = g());) if (b[1] = g(), b[2] = g(), a += d[b[0] >> 2], -1 !== b[1] ? (a += d[b[0] << 4 & 48 | b[1] >> 4], -1 !== b[2] ? (a += d[b[1] << 2 & 60 | b[2] >> 6], a += d[b[2] & 63]) : (a += d[b[1] << 2 & 60], a += "=", i = !0)) : (a += d[b[0] << 4 & 48], a += "=", a += "=", i = !0), c += 4, 76 <= c) a += "\n",
            c = 0;
            return a
        },
        decodeBase64: function(a) {
            var b, c;
            f(a);
            a = "";
            b = Array(4);
            for (c = !1; ! c && -1 !== (b[0] = h()) && -1 !== (b[1] = h());) b[2] = h(),
            b[3] = h(),
            a += i(b[0] << 2 & 255 | b[1] >> 4),
            -1 !== b[2] ? (a += i(b[1] << 4 & 255 | b[2] >> 2), -1 !== b[3] ? a += i(b[2] << 6 & 255 | b[3]) : c = !0) : c = !0;
            return a
        }
    }
} (); (function() {
    function d() { (new L.ElementQueries).init()
    }
    this.L = this.L || {};
    this.L.ElementQueries = function() {
        function a(a) {
            a || (a = document.documentElement);
            a = getComputedStyle(a, "fontSize");
            return parseFloat(a) || 16
        }
        function b(b, c) {
            var d = c.replace(/[0-9]*/, ""),
            c = parseFloat(c);
            switch (d) {
            case "px":
                return c;
            case "em":
                return c * a(b);
            case "rem":
                return c * a();
            case "vw":
                return c * document.documentElement.clientWidth / 100;
            case "vh":
                return c * document.documentElement.clientHeight / 100;
            case "vmin":
            case "vmax":
                return c * (0, Math["vmin" === d ? "min": "max"])(document.documentElement.clientWidth / 100, document.documentElement.clientHeight / 100);
            default:
                return c
            }
        }
        function c(a) {
            this.element = a;
            this.options = [];
            var c, d, e, f = 0,
            l = 0,
            m, o, g, h, p;
            this.addOption = function(a) {
                this.options.push(a)
            };
            var q = ["min-width", "min-height", "max-width", "max-height"];
            this.call = function() {
                f = this.element.offsetWidth;
                l = this.element.offsetHeight;
                g = {};
                c = 0;
                for (d = this.options.length; c < d; c++) e = this.options[c],
                m = b(this.element, e.value),
                o = "width" == e.property ? f: l,
                p = e.mode + "-" + e.property,
                h = "",
                "min" == e.mode && o >= m && (h += e.value),
                "max" == e.mode && o <= m && (h += e.value),
                g[p] || (g[p] = ""),
                h && -1 === (" " + g[p] + " ").indexOf(" " + h + " ") && (g[p] += " " + h);
                for (var a in q) g[q[a]] ? this.element.setAttribute(q[a], g[q[a]].substr(1)) : this.element.removeAttribute(q[a])
            }
        }
        function d(a, b) {
            a.elementQueriesSetupInformation ? a.elementQueriesSetupInformation.addOption(b) : (a.elementQueriesSetupInformation = new c(a), a.elementQueriesSetupInformation.addOption(b), new ResizeSensor(a,
            function() {
                a.elementQueriesSetupInformation.call()
            }));
            a.elementQueriesSetupInformation.call()
        }
        function f(a) {
            for (var b, a = a.replace(/'/g, '"'); null !== (b = h.exec(a));) if (5 < b.length) {
                var c = b[1] || b[5],
                f = b[2],
                r = b[3];
                b = b[4];
                var l = void 0;
                document.querySelectorAll && (l = document.querySelectorAll.bind(document)); ! l && "undefined" !== typeof $$ && (l = $$); ! l && "undefined" !== typeof jQuery && (l = jQuery);
                if (!l) throw "No document.querySelectorAll, jQuery or Mootools's $$ found.";
                for (var c = l(c), l = 0, m = c.length; l < m; l++) d(c[l], {
                    mode: f,
                    property: r,
                    value: b
                })
            }
        }
        function g(a) {
            var b = "";
            if (a) if ("string" === typeof a) a = a.toLowerCase(),
            ( - 1 !== a.indexOf("min-width") || -1 !== a.indexOf("max-width")) && f(a);
            else for (var c = 0,
            d = a.length; c < d; c++) 1 === a[c].type ? (b = a[c].selectorText || a[c].cssText, -1 !== b.indexOf("min-height") || -1 !== b.indexOf("max-height") ? f(b) : ( - 1 !== b.indexOf("min-width") || -1 !== b.indexOf("max-width")) && f(b)) : 4 === a[c].type && g(a[c].cssRules || a[c].rules)
        }
        var h = /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;
        this.init = function() {
            for (var a = 0,
            b = document.styleSheets.length; a < b; a++) g(document.styleSheets[a].cssText || document.styleSheets[a].cssRules || document.styleSheets[a].rules)
        }
    };
    window.addEventListener ? window.addEventListener("load", d, !1) : window.attachEvent("onload", d);
    this.L.ResizeSensor = function(a, b) {
        function c(a, b) {
            window.OverflowEvent ? a.addEventListener("overflowchanged",
            function(a) {
                b.call(this, a)
            }) : (a.addEventListener("overflow",
            function(a) {
                b.call(this, a)
            }), a.addEventListener("underflow",
            function(a) {
                b.call(this, a)
            }))
        }
        function d() {
            this.q = [];
            this.add = function(a) {
                this.q.push(a)
            };
            var a, b;
            this.call = function() {
                a = 0;
                for (b = this.q.length; a < b; a++) this.q[a].call()
            }
        }
        function f(a, b) {
            function f() {
                var b = !1,
                c = a.resizeSensor.offsetWidth,
                d = a.resizeSensor.offsetHeight;
                r != c && (m.width = c - 1 + "px", o.width = c + 1 + "px", b = !0, r = c);
                l != d && (m.height = d - 1 + "px", o.height = d + 1 + "px", b = !0, l = d);
                return b
            }
            if (a.resizedAttached) {
                if (a.resizedAttached) {
                    a.resizedAttached.add(b);
                    return
                }
            } else a.resizedAttached = new d,
            a.resizedAttached.add(b);
            var k = function() {
                f() && a.resizedAttached.call()
            };
            a.resizeSensor = document.createElement("div");
            a.resizeSensor.className = "resize-sensor";
            a.resizeSensor.style.cssText = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;";
            a.resizeSensor.innerHTML = '<div class="resize-sensor-overflow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;"><div></div></div><div class="resize-sensor-underflow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;"><div></div></div>';
            a.appendChild(a.resizeSensor);
            if ("absolute" !== (a.currentStyle ? a.currentStyle.position: window.getComputedStyle ? window.getComputedStyle(a, null).getPropertyValue("position") : a.style.position)) a.style.position = "relative";
            var r = -1,
            l = -1,
            m = a.resizeSensor.firstElementChild.firstChild.style,
            o = a.resizeSensor.lastElementChild.firstChild.style;
            f();
            c(a.resizeSensor, k);
            c(a.resizeSensor.firstElementChild, k);
            c(a.resizeSensor.lastElementChild, k)
        }
        if ("array" === typeof a || "undefined" !== typeof jQuery && a instanceof jQuery || "undefined" !== typeof Elements && a instanceof Elements) for (var g = 0,
        h = a.length; g < h; g++) f(a[g], b);
        else f(a, b)
    }
})();
AgoraRTC.View = function(d) {
    d = AgoraRTC.EventDispatcher(d);
    d.url = ".";
    return d
};
AgoraRTC.VideoPlayer = function(d) {
    var a = AgoraRTC.View({}),
    b,
    c;
    a.id = d.id;
    a.url = d.url;
    a.stream = d.stream.stream;
    a.elementID = d.elementID;
    b = function() {
        a.bar.display()
    };
    c = function() {
        a.bar.hide()
    };
    a.destroy = function() {
        a.video.pause();
        delete a.resizer;
        a.parentNode.removeChild(a.div)
    };
    a.resize = function() {
        var b = a.container.offsetWidth,
        c = a.container.offsetHeight;
        if (d.stream.screen) 0.75 * b < c ? (a.video.style.width = b + "px", a.video.style.height = 0.75 * b + "px", a.video.style.top = -(0.75 * b / 2 - c / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = c + "px", a.video.style.width = 4 / 3 * c + "px", a.video.style.left = -(4 / 3 * c / 2 - b / 2) + "px", a.video.style.top = "0px");
        else if (b !== a.containerWidth || c !== a.containerHeight) 0.75 * b > c ? (a.video.style.width = b + "px", a.video.style.height = 0.75 * b + "px", a.video.style.top = -(0.75 * b / 2 - c / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = c + "px", a.video.style.width = 4 / 3 * c + "px", a.video.style.left = -(4 / 3 * c / 2 - b / 2) + "px", a.video.style.top = "0px");
        a.containerWidth = b;
        a.containerHeight = c
    };
    a.div = document.createElement("div");
    a.div.setAttribute("id", "player_" + a.id);
    d.stream.video ? a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;") : a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; overflow: hidden;");
    a.video = document.createElement("video");
    a.video.setAttribute("id", "stream" + a.id);
    d.stream.local && !d.stream.screen ? a.video.setAttribute("style", "width: 100%; height: 100%; position: absolute; transform: rotateY(180deg);") : d.stream.video ? a.video.setAttribute("style", "width: 100%; height: 100%; position: absolute;") : a.video.setAttribute("style", "width: 100%; height: 100%; position: absolute; display: none;");
    a.video.setAttribute("autoplay", "autoplay");
    d.stream.local && (a.video.volume = 0);
    void 0 !== a.elementID ? (document.getElementById(a.elementID).appendChild(a.div), a.container = document.getElementById(a.elementID)) : (document.body.appendChild(a.div), a.container = document.body);
    a.parentNode = a.div.parentNode;
    a.div.appendChild(a.video);
    a.video.addEventListener("playing",
    function() {
        var b = function() {
            a.video.videoWidth * a.video.videoHeight > 4 ? L.Logger.info("video dimensions:", a.video.videoWidth, a.video.videoHeight) : setTimeout(b, 50)
        };
        b()
    });
    a.containerWidth = 0;
    a.containerHeight = 0;
    a.resizer = new L.ResizeSensor(a.container, a.resize);
    a.resize();
    a.bar = new AgoraRTC.Bar({
        elementID: "player_" + a.id,
        id: a.id,
        stream: d.stream,
        media: a.video,
        options: d.options,
        url: a.url
    });
    a.div.onmouseover = d.stream.local ? c: b;
    a.div.onmouseout = c;
    attachMediaStream(document.getElementById("stream" + a.id), d.stream.stream);
    return a
};
AgoraRTC.AudioPlayer = function(d) {
    var a = AgoraRTC.View({}),
    b,
    c;
    a.id = d.id;
    a.url = d.url;
    a.stream = d.stream.stream;
    a.elementID = d.elementID;
    L.Logger.debug("Creating URL from stream " + a.stream);
    a.stream_url = (window.URL || webkitURL).createObjectURL(a.stream);
    a.audio = document.createElement("audio");
    a.audio.setAttribute("id", "stream" + a.id);
    a.audio.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.audio.setAttribute("autoplay", "autoplay");
    d.stream.local && (a.audio.volume = 0);
    d.stream.local && (a.audio.volume = 0);
    void 0 !== a.elementID ? (a.destroy = function() {
        a.audio.pause();
        a.parentNode.removeChild(a.div)
    },
    b = function() {
        a.bar.display()
    },
    c = function() {
        a.bar.hide()
    },
    a.div = document.createElement("div"), a.div.setAttribute("id", "player_" + a.id), a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; overflow: hidden;"), document.getElementById(a.elementID).appendChild(a.div), a.container = document.getElementById(a.elementID), a.parentNode = a.div.parentNode, a.div.appendChild(a.audio), a.bar = new AgoraRTC.Bar({
        elementID: "player_" + a.id,
        id: a.id,
        stream: d.stream,
        media: a.audio,
        options: d.options,
        url: a.url
    }), a.div.onmouseover = d.stream.local ? c: b, a.div.onmouseout = c) : (a.destroy = function() {
        a.audio.pause();
        a.parentNode.removeChild(a.audio)
    },
    document.body.appendChild(a.audio), a.parentNode = document.body);
    a.audio.src = a.stream_url;
    return a
};
AgoraRTC.Bar = function(d) {
    var a = AgoraRTC.View({}),
    b,
    c;
    a.elementID = d.elementID;
    a.id = d.id;
    a.url = d.url;
    a.div = document.createElement("div");
    a.div.setAttribute("id", "bar_" + a.id);
    a.bar = document.createElement("div");
    a.bar.setAttribute("style", "width: 100%; height: 15%; max-height: 30px; position: absolute; bottom: 0; right: 0; background-color: rgba(255,255,255,0.62)");
    a.bar.setAttribute("id", "subbar_" + a.id);
    a.link = document.createElement("a");
    a.link.setAttribute("href", "http://www.lynckia.com/");
    a.link.setAttribute("target", "_blank");
    a.logo = document.createElement("img");
    a.logo.setAttribute("style", "width: 100%; height: 100%; max-width: 30px; position: absolute; top: 0; left: 2px;");
    a.logo.setAttribute("alt", "Lynckia");
    c = function(c) {
        "block" !== c ? c = "none": clearTimeout(b);
        a.div.setAttribute("style", "width: 100%; height: 100%; position: absolute; bottom: 0; right: 0; display:" + c)
    };
    a.display = function() {
        c("block")
    };
    a.hide = function() {
        b = setTimeout(c, 1E3)
    };
    document.getElementById(a.elementID).appendChild(a.div);
    a.div.appendChild(a.bar);
    if (!d.stream.screen && (void 0 === d.options || void 0 === d.options.speaker || !0 === d.options.speaker)) a.speaker = new AgoraRTC.Speaker({
        elementID: "subbar_" + a.id,
        id: a.id,
        stream: d.stream,
        media: d.media,
        url: a.url
    });
    a.display();
    a.hide();
    return a
};
AgoraRTC.Speaker = function(d) {
    var a = AgoraRTC.View({}),
    b,
    c,
    e,
    f = 50;
    a.elementID = d.elementID;
    a.media = d.media;
    a.id = d.id;
    void 0 !== d.url && (a.url = d.url);
    a.stream = d.stream;
    a.div = document.createElement("div");
    a.div.setAttribute("style", "width: 40%; height: 100%; max-width: 32px; position: absolute; right: 0;z-index:0;");
    a.icon = document.createElement("img");
    a.icon.setAttribute("id", "volume_" + a.id);
    a.icon.setAttribute("src", a.url + "/assets/sound48.png");
    a.icon.setAttribute("style", "width: 80%; height: 100%; position: absolute;");
    a.div.appendChild(a.icon);
    a.stream.local ? (c = function() {
        a.media.muted = true;
        a.icon.setAttribute("src", a.url + "/assets/mute48.png")
    },
    e = function() {
        a.media.muted = false;
        a.icon.setAttribute("src", a.url + "/assets/sound48.png")
    },
    a.icon.onclick = function() {
        a.media.muted ? e() : c()
    }) : (a.picker = document.createElement("input"), a.picker.setAttribute("id", "picker_" + a.id), a.picker.type = "range", a.picker.min = 0, a.picker.max = 100, a.picker.step = 10, a.picker.value = f, a.picker.setAttribute("orient", "vertical"), a.div.appendChild(a.picker), a.media.volume = a.picker.value / 100, a.media.muted = !1, a.picker.oninput = function() {
        if (a.picker.value > 0) {
            a.media.muted = false;
            a.icon.setAttribute("src", a.url + "/assets/sound48.png")
        } else {
            a.media.muted = true;
            a.icon.setAttribute("src", a.url + "/assets/mute48.png")
        }
        a.media.volume = a.picker.value / 100
    },
    b = function(b) {
        a.picker.setAttribute("style", "background: transparent; width: 32px; height: 100px; position: absolute; bottom: 90%; z-index: 1;" + a.div.offsetHeight + "px; right: 0px; -webkit-appearance: slider-vertical; display: " + b)
    },
    c = function() {
        a.icon.setAttribute("src", a.url + "/assets/mute48.png");
        f = a.picker.value;
        a.picker.value = 0;
        a.media.volume = 0;
        a.media.muted = true
    },
    e = function() {
        a.icon.setAttribute("src", a.url + "/assets/sound48.png");
        a.picker.value = f;
        a.media.volume = a.picker.value / 100;
        a.media.muted = false
    },
    a.icon.onclick = function() {
        a.media.muted ? e() : c()
    },
    a.div.onmouseover = function() {
        b("block")
    },
    a.div.onmouseout = function() {
        b("none")
    },
    b("none"));
    document.getElementById(a.elementID).appendChild(a.div);
    return a
};
AgoraRTC.Stream = function(d) {
    function a(a, b) {
        return null !== window.navigator.userAgent.match("Firefox") ? {
            width: {
                exact: a
            },
            height: {
                exact: b
            }
        }: {
            mandatory: {
                minWidth: a,
                minHeight: b,
                maxWidth: a,
                maxHeight: b
            },
            optional: []
        }
    }
    var b = AgoraRTC.EventDispatcher(d);
    b.stream = d.stream;
    b.aux_stream = void 0;
    b.url = d.url;
    b.onClose = void 0;
    b.local = !1;
    b.video = d.video;
    b.audio = d.audio;
    b.screen = d.screen;
    b.screenAttributes = {
        width: 1920,
        height: 1080,
        maxFr: 5,
        minFr: 1
    };
    b.videoSize = d.videoSize;
    b.player = void 0;
    d.attributes = d.attributes || {};
    b.videoEnabled = !0;
    b.audioEnabled = !0;
    if (void 0 !== b.videoSize && (!(b.videoSize instanceof Array) || 4 !== b.videoSize.length)) throw Error("Invalid Video Size");
    b.videoSize = [640, 480, 640, 480];
    if (void 0 === d.local || !0 === d.local) b.local = !0;
    b.initialized = !b.local;
    var c = {
        "true": !0,
        unspecified: !0,
        "120p": a(160, 120),
        "240p": a(320, 240),
        "360p": a(640, 360),
        "480p": a(640, 480),
        "720p": a(1280, 720),
        "1080p": a(1920, 1080),
        "4k": a(3840, 2160)
    };
    b.unmuteAudio = void 0;
    b.muteAudio = void 0;
    b.unmuteVideo = void 0;
    b.muteVideo = void 0;
    b.setVideoResolution = function(a) {
        a += "";
        return void 0 !== c[a] ? (d.video = c[a], d.attributes = d.attributes || {},
        d.attributes.resolution = a, !0) : !1
    };
    b.setVideoFrameRate = function(a) {
        return "object" === typeof a && a instanceof Array && 1 < a.length ? (d.attributes = d.attributes || {},
        d.attributes.minFrameRate = a[0], d.attributes.maxFrameRate = a[1], !0) : !1
    };
    b.setVideoBitRate = function(a) {
        return "object" === typeof a && a instanceof Array && 1 < a.length ? (d.attributes = d.attributes || {},
        d.attributes.minVideoBW = a[0], d.attributes.maxVideoBW = a[1], !0) : !1
    };
    b.setScreenProfile = function(a) {
        if ("string" == typeof a) {
            switch (a) {
            case "480p_1":
                b.screenAttributes.width = 640;
                b.screenAttributes.height = 480;
                b.screenAttributes.maxFr = 5;
                b.screenAttributes.minFr = 1;
                break;
            case "480p_2":
                b.screenAttributes.width = 640;
                b.screenAttributes.height = 480;
                b.screenAttributes.maxFr = 30;
                b.screenAttributes.minFr = 25;
                break;
            case "720p_1":
                b.screenAttributes.width = 1280;
                b.screenAttributes.height = 720;
                b.screenAttributes.maxFr = 5;
                b.screenAttributes.minFr = 1;
                break;
            case "720p_2":
                b.screenAttributes.width = 1280;
                b.screenAttributes.height = 720;
                b.screenAttributes.maxFr = 30;
                b.screenAttributes.minFr = 25;
                break;
            case "1080p_1":
                b.screenAttributes.width = 1920;
                b.screenAttributes.height = 1080;
                b.screenAttributes.maxFr = 5;
                b.screenAttributes.minFr = 1;
                break;
            case "1080p_2":
                b.screenAttributes.width = 1920,
                b.screenAttributes.height = 1080,
                b.screenAttributes.maxFr = 30,
                b.screenAttributes.minFr = 25
            }
            return ! 0
        }
        return ! 1
    };
    b.setVideoProfile = function(a) {
        if ("string" == typeof a) {
            switch (a) {
            case "120p_1":
                b.setVideoResolution("120p");
                b.setVideoFrameRate([15, 15]);
                b.setVideoBitRate([10, 80]);
                break;
            case "240p_1":
                b.setVideoResolution("240p");
                b.setVideoFrameRate([15, 15]);
                b.setVideoBitRate([10, 200]);
                break;
            case "480p_1":
                b.setVideoResolution("480p");
                b.setVideoFrameRate([15, 15]);
                b.setVideoBitRate([20, 500]);
                break;
            case "480p_2":
                b.setVideoResolution("480p");
                b.setVideoFrameRate([30, 30]);
                b.setVideoBitRate([20, 1E3]);
                break;
            case "480p_3":
                b.setVideoResolution("480p");
                b.setVideoFrameRate([25, 25]);
                b.setVideoBitRate([20, 750]);
                break;
            case "720p_1":
                b.setVideoResolution("720p");
                b.setVideoFrameRate([15, 15]);
                b.setVideoBitRate([30, 1E3]);
                break;
            case "720p_2":
                b.setVideoResolution("720p");
                b.setVideoFrameRate([30, 30]);
                b.setVideoBitRate([30, 2E3]);
                break;
            case "720p_3":
                b.setVideoResolution("720p");
                b.setVideoFrameRate([25, 25]);
                b.setVideoBitRate([30, 1500]);
                break;
            case "1080p_1":
                b.setVideoResolution("1080p");
                b.setVideoFrameRate([15, 15]);
                b.setVideoBitRate([50, 1500]);
                break;
            case "1080p_2":
                b.setVideoResolution("1080p");
                b.setVideoFrameRate([30, 30]);
                b.setVideoBitRate([50, 3E3]);
                break;
            default:
                b.setVideoResolution("480p"),
                b.setVideoFrameRate([15, 15]),
                b.setVideoBitRate([20, 500])
            }
            return ! 0
        }
        return ! 1
    };
    b.getId = function() {
        return d.streamID
    };
    b.getAttributes = function() {
        return d.attributes
    };
    b.hasAudio = function() {
        return d.audio
    };
    b.hasVideo = function() {
        return d.video
    };
    b.hasScreen = function() {
        return d.screen
    };
    b.isVideoOn = function() {
        return b.hasVideo && b.videoEnabled
    };
    b.isAudioOn = function() {
        return b.hasAudio && b.audioEnabled
    };
    b.init = function(a, c, g) {
        var h = g;
        void 0 === h && (h = 2);
        if (!0 === b.initialized)"function" === typeof c && c({
            type: "warning",
            msg: "STREAM_ALREADY_INITIALIZED"
        });
        else if (!0 !== b.local)"function" === typeof c && c({
            type: "warning",
            msg: "STREAM_NOT_LOCAL"
        });
        else try {
            if ((d.audio || d.video || d.screen) && void 0 === d.url) {
                L.Logger.debug("Requested access to local media");
                var i = d.video;
                if (d.screen) var j = {
                    video: i,
                    audio: d.audio,
                    screen: !0,
                    data: !0,
                    extensionId: "minllpmhdgpndnkomcoccfekfegnlikg",
                    attributes: b.screenAttributes,
                    fake: d.fake
                };
                else if (j = {
                    video: i,
                    audio: d.audio,
                    fake: d.fake
                },
                !(null !== window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./) && 35 >= window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1]))(i = g = 15, void 0 !== d.attributes.minFrameRate && (g = d.attributes.minFrameRate), void 0 !== d.attributes.maxFrameRate && (i = d.attributes.maxFrameRate), null !== window.navigator.userAgent.match("Firefox")) ? !0 === j.video ? (j.video = {
                    width: {
                        exact: b.videoSize[0]
                    },
                    height: {
                        exact: b.videoSize[1]
                    },
                    framerate: {
                        ideal: g,
                        max: i
                    }
                },
                b.setVideoBitRate([500, 500])) : "object" === typeof j.video && (j.video.framerate = {
                    ideal: g,
                    max: i
                }) : !0 === j.video ? (j.video = {
                    mandatory: {
                        minWidth: b.videoSize[0],
                        minHeight: b.videoSize[1],
                        maxWidth: b.videoSize[2],
                        maxHeight: b.videoSize[3],
                        minFrameRate: g,
                        maxFrameRate: i
                    }
                },
                b.setVideoBitRate([500, 500])) : "object" === typeof j.video && void 0 !== j.video.mandatory && (j.video.mandatory.maxFrameRate = i, j.video.mandatory.minFrameRate = g);
                void 0 !== d.cameraId && "" !== d.cameraId && (j.video.optional = [{
                    sourceId: d.cameraId
                }]);
                void 0 !== d.microphoneId && "" !== d.microphoneId && (j.audio = {
                    optional: [{
                        sourceId: d.microphoneId
                    }]
                });
                L.Logger.debug(j);
                AgoraRTC.GetUserMedia(j,
                function(c) {
                    L.Logger.info("User has granted access to local media.");
                    b.stream = c;
                    a();
                    b.initialized = true
                },
                function(d) {
                    d = {
                        type: "error",
                        msg: d.name || d
                    };
                    switch (d.msg) {
                    case "Starting video failed":
                    case "TrackStartError":
                        b.setVideo("unspecified");
                        b.videoSize = void 0;
                        if (h > 0) {
                            setTimeout(function() {
                                b.init(a, c, h - 1)
                            },
                            1);
                            return
                        }
                        d.msg = "MEDIA_OPTION_INVALID";
                        break;
                    case "DevicesNotFoundError":
                        d.msg = "DEVICES_NOT_FOUND";
                        break;
                    case "NotSupportedError":
                        d.msg = "NOT_SUPPORTED";
                        break;
                    case "PermissionDeniedError":
                        d.msg = "PERMISSION_DENIED";
                        break;
                    case "PERMISSION_DENIED":
                        break;
                    case "ConstraintNotSatisfiedError":
                        d.msg = "CONSTRAINT_NOT_SATISFIED";
                        break;
                    default:
                        if (!d.msg) d.msg = "UNDEFINED"
                    }
                    L.Logger.error("Media access:", d.msg);
                    typeof c === "function" && c(d)
                });
                if (d.screen && d.audio) {
                    var n = {
                        video: !1,
                        audio: j.audio
                    };
                    L.Logger.debug(n);
                    AgoraRTC.GetUserMedia(n,
                    function(a) {
                        L.Logger.info("User has granted access to auxiliary local media.");
                        b.aux_stream = a
                    },
                    function(d) {
                        d = {
                            type: "error",
                            msg: d.name || d
                        };
                        switch (d.msg) {
                        case "Starting video failed":
                        case "TrackStartError":
                            b.setVideo("unspecified");
                            b.videoSize = void 0;
                            if (h > 0) {
                                setTimeout(function() {
                                    b.init(a, c, h - 1)
                                },
                                1);
                                return
                            }
                            d.msg = "MEDIA_OPTION_INVALID";
                            break;
                        case "DevicesNotFoundError":
                            d.msg = "DEVICES_NOT_FOUND";
                            break;
                        case "NotSupportedError":
                            d.msg = "NOT_SUPPORTED";
                            break;
                        case "PermissionDeniedError":
                            d.msg = "PERMISSION_DENIED";
                            break;
                        case "PERMISSION_DENIED":
                            break;
                        case "ConstraintNotSatisfiedError":
                            d.msg = "CONSTRAINT_NOT_SATISFIED";
                            break;
                        default:
                            if (!d.msg) d.msg = "UNDEFINED"
                        }
                        L.Logger.error("Media access:", d.msg);
                        typeof c === "function" && c(d)
                    })
                }
            } else "function" === typeof c && c({
                type: "warning",
                msg: "STREAM_HAS_NO_MEDIA_ATTRIBUTES"
            })
        } catch(k) {
            L.Logger.error("Stream init:", k),
            "function" === typeof c && c({
                type: "error",
                msg: k.message || k
            })
        }
    };
    b.close = function() {
        if (void 0 !== b.stream) {
            var a = b.stream.getTracks(),
            c;
            for (c in a) a.hasOwnProperty(c) && a[c].stop();
            b.stream = void 0
        }
        b.initialized = !1;
        b.unmuteAudio = void 0;
        b.muteAudio = void 0;
        b.unmuteVideo = void 0;
        b.muteVideo = void 0;
        void 0 !== b.pc && (b.pc.close(), b.pc = void 0)
    };
    b.enableAudio = function() {
        return b.hasAudio() && b.initialized && void 0 !== b.stream && !0 !== b.stream.getAudioTracks()[0].enabled ? (void 0 !== b.unmuteAudio && b.unmuteAudio(), b.audioEnabled = !0, b.stream.getAudioTracks()[0].enabled = !0) : !1
    };
    b.disableAudio = function() {
        return b.hasAudio() && b.initialized && void 0 !== b.stream && b.stream.getAudioTracks()[0].enabled ? (void 0 !== b.muteAudio && b.muteAudio(), b.audioEnabled = !1, b.stream.getAudioTracks()[0].enabled = !1, !0) : !1
    };
    b.enableVideo = function() {
        return b.initialized && void 0 !== b.stream && b.stream.getVideoTracks().length && !0 !== b.stream.getVideoTracks()[0].enabled ? (void 0 !== b.unmuteVideo && b.unmuteVideo(), b.videoEnabled = !0, b.stream.getVideoTracks()[0].enabled = !0) : !1
    };
    b.disableVideo = function() {
        return b.initialized && void 0 !== b.stream && b.stream.getVideoTracks().length && b.stream.getVideoTracks()[0].enabled ? (void 0 !== b.muteVideo && b.muteVideo(), b.videoEnabled = !1, b.stream.getVideoTracks()[0].enabled = !1, !0) : !1
    };
    b.play = function(a, c) {
        b.showing = !1; ! b.local || b.video ? void 0 !== a && (b.player = new AgoraRTC.VideoPlayer({
            id: b.getId(),
            stream: b,
            elementID: a,
            options: void 0,
            url: c
        }), b.showing = !0) : b.hasAudio() && (b.player = new AgoraRTC.AudioPlayer({
            id: b.getId(),
            stream: b,
            elementID: a,
            options: void 0,
            url: c
        }), b.showing = !0)
    };
    b.stop = function() {
        void 0 !== b.player && b.player.destroy()
    };
    return b
};
AgoraRTC.createStream = function(d) {
    return AgoraRTC.Stream(d)
};
AgoraRTC.getDevices = function(d) {
    navigator.mediaDevices && navigator.mediaDevices.enumerateDevices().then(function(a) {
        d(a)
    })
};
AgoraRTC.Client = function(d) {
    function a() {
        return "https:" == document.location.protocol ? !0 : !1
    }
    function b() {
        var a = arguments[0];
        if ("function" === typeof a) {
            var b = Array.prototype.slice.call(arguments, 1);
            a.apply(null, b)
        }
    }
    var c = AgoraRTC.EventDispatcher(d),
    e,
    f,
    g;
    c.errorCodes = {
        INVALID_KEY: 10,
        INVALID_OPERATION: 11,
        INVALID_LOCAL_STREAM: 12,
        INVALID_REMOTE_STREAM: 13,
        SOCKET_ERROR: 100,
        SOCKET_DISCONNECTED: 101,
        PEERCONNECTION_FAILED: 102,
        CONNECT_GATEWAY_ERROR: 103,
        SERVICE_NOT_AVAILABLE: 1E3,
        JOIN_CHANNEL_FAILED: 1001,
        PUBLISH_STREAM_FAILED: 1002,
        UNPUBLISH_STREAM_FAILED: 1003,
        SUBSCRIBE_STREAM_FAILED: 1004,
        UNSUBSCRIBE_STREAM_FAILED: 1005
    };
    c.localStreams = {};
    c.remoteStreams = {};
    c.socket = void 0;
    c.state = 0;
    c.vocsDomain = "vocsweb.agorabeckon.com";
    c.proxyDomain = "gwcsproxy.agorabeckon.com";
    c.mode = d.mode;
    c.timers = {};
    c.version = "1.8.0";
    c.attemps = 1;
    c.p2p_attemps = 1;
    var h = function(b) {
        a() ? (b = b.replace("http", "https"), b = b.replace("9998", "8999"), c.socket = io.connect(b, {
            timeout: 1E4,
            reconnection: !1,
            secure: !0,
            transports: ["websocket"],
            upgrade: !1
        })) : c.socket = io.connect(b, {
            timeout: 1E4,
            reconnection: !1,
            secure: !1,
            transports: ["websocket"],
            upgrade: !1
        })
    };
    e = function(a, d, n) {
        var k = a.host;
        if (void 0 !== c.socket) c.socket.socket.connect();
        else {
            h(k);
            c.socket.on("connect",
            function() {
                c.attemps = 1;
                f("token", a, d, n)
            });
            c.socket.on("connect_error",
            function(a) {
                c.state = 0;
                c.socket = void 0;
                var b = l(c.attemps);
                L.Logger.info("Connect to gateway error due to " + a + ", attempt to recover " + c.attemps + " times after " + b / 1E3 + " seconds");
                setTimeout(function() {
                    c.attemps++;
                    e()
                },
                b)
            });
            c.socket.on("disconnect",
            function(a) {
                if (0 !== c.state) {
                    for (var d in c.timers) c.timers.hasOwnProperty(d) && clearInterval(c.timers[d]);
                    for (d in c.remoteStreams) if (c.remoteStreams.hasOwnProperty(d)) {
                        var i = c.remoteStreams[d],
                        j = AgoraRTC.ClientEvent({
                            type: "stream-removed",
                            uid: i.getId(),
                            stream: i
                        });
                        c.dispatchEvent(j);
                        delete c.remoteStreams[d];
                        void 0 !== i.pc && (i.pc.close(), i.pc = void 0)
                    }
                    c.state = 0;
                    c.socket = void 0;
                    b(n, c.errorCodes.SOCKET_DISCONNECTED);
                    d = l(c.attemps);
                    L.Logger.info("Disconnect from gateway due to " + a + ", attempt to recover " + c.attemps + " times after " + d / 1E3 + " seconds");
                    setTimeout(function() {
                        c.attemps++;
                        e()
                    },
                    d)
                }
            });
            var e = function() {
                c.key ? (L.Logger.info(c.uid + " re-joining to " + c.channel), c.join(c.channel, c.uid,
                function(a) {
                    L.Logger.info(c.uid + " re-joined to " + c.channel);
                    if (void 0 !== c.localStreams[a]) {
                        var b = c.localStreams[a];
                        delete c.localStreams[a];
                        void 0 !== b.pc && (b.pc.close(), b.pc = void 0);
                        L.Logger.info("Publish the old local stream again");
                        c.publish(b,
                        function() {
                            L.Logger.info("Err: publish the old stream failed")
                        })
                    }
                },
                function() {
                    L.Logger.error("Err: re-join channel failed")
                })) : (b(n, c.errorCodes.INVALID_KEY), L.Logger.info("Err: invalid key"))
            },
            l = function(a) {
                return 1E3 * Math.min(30, Math.pow(2, a) - 1)
            };
            c.socket.on("onAddAudioStream",
            function(a) {
                if (void 0 === c.remoteStreams[a.id]) {
                    var b = AgoraRTC.Stream({
                        streamID: a.id,
                        local: !1,
                        audio: a.audio,
                        video: a.video,
                        screen: a.screen,
                        attributes: a.attributes
                    });
                    c.remoteStreams[a.id] = b;
                    a = AgoraRTC.StreamEvent({
                        type: "stream-added",
                        stream: b
                    });
                    c.dispatchEvent(a)
                }
            });
            c.socket.on("onAddVideoStream",
            function(a) {
                if (void 0 === c.remoteStreams[a.id]) {
                    var b = AgoraRTC.Stream({
                        streamID: a.id,
                        local: !1,
                        audio: a.audio,
                        video: a.video,
                        screen: a.screen,
                        attributes: a.attributes
                    });
                    c.remoteStreams[a.id] = b;
                    a = AgoraRTC.StreamEvent({
                        type: "stream-added",
                        stream: b
                    });
                    c.dispatchEvent(a)
                } else void 0 !== c.remoteStreams[a.id].stream ? (c.remoteStreams[a.id].video = !0, c.remoteStreams[a.id].enableVideo(), L.Logger.info("Stream changed: enable video" + a.id), a = c.remoteStreams[a.id], b = a.player.elementID, a.stop(), a.play(b)) : (b = AgoraRTC.Stream({
                    streamID: a.id,
                    local: !1,
                    audio: !0,
                    video: !0,
                    screen: !1,
                    attributes: a.attributes
                }), c.remoteStreams[a.id] = b, L.Logger.info("Stream changed: modify video" + a.id))
            });
            c.socket.on("onRemoveStream",
            function(a) {
                var b = c.remoteStreams[a.id];
                delete c.remoteStreams[a.id];
                a = AgoraRTC.StreamEvent({
                    type: "stream-removed",
                    stream: b
                });
                c.dispatchEvent(a);
                b.close()
            });
            c.socket.on("onPublishStream",
            function(a) {
                a = AgoraRTC.StreamEvent({
                    type: "stream-published",
                    stream: c.localStreams[a.id]
                });
                c.dispatchEvent(a)
            });
            c.socket.on("onP2PLost",
            function() {
                var a = l(c.p2p_attemps) + l(c.attemps);
                L.Logger.info("p2p connection lost, attempt to recover " + c.p2p_attemps + " times after " + a / 1E3 + " seconds");
                setTimeout(function() {
                    c.p2p_attemps++;
                    void 0 !== c.socket && c.socket.disconnect()
                },
                a)
            });
            c.socket.on("onPeerLeave",
            function(a) {
                var b = c.remoteStreams[a.id],
                d = AgoraRTC.ClientEvent({
                    type: "peer-leave",
                    uid: a.id,
                    stream: b
                });
                c.dispatchEvent(d);
                c.remoteStreams.hasOwnProperty(a.id) && (L.Logger.info("closing stream on peer leave", a.id), c.remoteStreams[a.id].close(), delete c.remoteStreams[a.id]);
                void 0 != c.timers[b.getId()] && clearInterval(c.timers[b.getId()])
            })
        }
    };
    f = function(a, d, f, k) {
        if (void 0 === c.socket) b(k, c.errorCodes.INVALID_OPERATION),
        L.Logger.info("Err: no socket available");
        else try {
            c.socket.emit(a, d,
            function(a, b) {
                "success" === a ? "function" === typeof f && f(b) : "function" === typeof k && k(b)
            })
        } catch(e) {
            b(k, c.errorCodes.SOCKET_ERROR),
            L.Logger.info("Err: socket emit msg failed")
        }
    };
    g = function(a, b, d, f) {
        if (void 0 === c.socket) L.Logger.error("Error in sendSDPSocket: socket not ready");
        else try {
            c.socket.emit(a, b, d,
            function(a, b) {
                void 0 !== f && f(a, b)
            })
        } catch(e) {
            L.Logger.error("Error in sendSDPSocket: ", e)
        }
    };
    c.init = function(i, j, f) {
        var k, e;
        a() ? (k = "https://" + c.vocsDomain + ":8999/getvocs/jsonp", e = "https://" + c.proxyDomain + ":8997/getgwcs/jsonp") : (k = "http://" + c.vocsDomain + ":9999/getvocs/jsonp", e = "http://" + c.proxyDomain + ":9997/getgwcs/jsonp");
        $.ajax({
            url: k + "?key=" + i,
            dataType: "jsonp",
            error: function() {
                L.Logger.debug("Trying to get choose server list");
                $.ajax({
                    url: e,
                    dataType: "jsonp",
                    success: function(e) {
                        for (var e = e.choose_servers,
                        g = false,
                        h = 0; h < e.length; ++h) {
                            k = a() ? "https://" + e[h] + ":8999/getvocs/jsonp": "http://" + e[h] + ":9999/getvocs/jsonp";
                            $.ajax({
                                url: k + "?key=" + i,
                                dataType: "jsonp",
                                success: function(a) {
                                    if (!g) {
                                        var e = a.error;
                                        if (e != void 0) {
                                            b(f, c.errorCodes.SERVICE_NOT_AVAILABLE);
                                            L.Logger.info("Err: get gateway node failed, ", e)
                                        } else {
                                            d.host = a.gateway_addr;
                                            c.key = i;
                                            b(j)
                                        }
                                        g = true
                                    }
                                }
                            })
                        }
                    }
                })
            },
            success: function(a) {
                var e = a.error;
                if (e != void 0) {
                    b(f, c.errorCodes.SERVICE_NOT_AVAILABLE);
                    L.Logger.info("Err: get gateway node failed, ", e)
                } else {
                    d.host = a.gateway_addr;
                    c.key = i;
                    b(j)
                }
            }
        })
    };
    c.join = function(a, j, g, k) {
        0 !== c.state ? (b(k, c.errorCodes.INVALID_OPERATION), L.Logger.error("Err: VOSGateway already in connecting/connected state")) : (c.uid = j, c.channel = a, c.state = 1, e(d,
        function(a) {
            c.stunServerUrl = a.stunServerUrl;
            c.turnServer = a.turnServer;
            c.state = 2;
            L.Logger.info("VOSGateway connected.");
            f("customMessage", {
                type: "join",
                payload: {
                    key: c.key,
                    channel: c.channel,
                    uid: c.uid,
                    version: c.version,
                    browser: navigator.userAgent,
                    mode: c.mode
                }
            },
            function(a) {
                c.uid = a;
                g(a)
            },
            k)
        },
        function(a) {
            b(k, a);
            L.Logger.info("Err: user join failed, ", a)
        }))
    };
    c.leave = function(a, b) {
        f("customMessage", {
            type: "leave"
        },
        a, b);
        for (var d in c.localStreams) if (c.localStreams.hasOwnProperty(d)) {
            var e = c.localStreams[d];
            delete c.localStreams[d];
            void 0 !== e.pc && (e.pc.close(), e.pc = void 0)
        }
        for (d in c.remoteStreams) c.remoteStreams.hasOwnProperty(d) && (e = c.remoteStreams[d], delete c.remoteStreams[d], void 0 !== e.pc && (e.pc.close(), e.pc = void 0));
        c.state = 0;
        c.socket = void 0
    };
    c.publish = function(a, d, e) {
        if ("object" !== typeof a || null === a) b(e, c.errorCodes.INVALID_LOCAL_STREAM),
        L.Logger.info("Err: invalid local stream");
        else if (null === a.stream && void 0 === a.url) b(e, c.errorCodes.INVALID_LOCAL_STREAM),
        L.Logger.info("Err: invalid local stream");
        else if (2 !== c.state) b(e, c.errorCodes.INVALID_OPERATION),
        L.Logger.info("Err: user not in the session");
        else if (d = a.getAttributes() || {},
        a.local && void 0 === c.localStreams[a.getId()] && (a.hasAudio() || a.hasVideo() || a.hasScreen())) void 0 !== a.url ? g("publish", {
            state: "url",
            audio: a.hasAudio(),
            video: a.hasVideo(),
            attributes: a.getAttributes(),
            mode: c.mode
        },
        a.url,
        function(d, f) {
            "success" === d ? (a.getId = function() {
                return f
            },
            c.localStreams[f] = a, a.onClose = function() {
                c.unpublish(a)
            }) : (b(e, c.errorCodes.PUBLISH_STREAM_FAILED), L.Logger.info("Err: publishing the stream failed, ", d))
        }) : (c.localStreams[a.getId()] = a, a.pc = AgoraRTC.Connection({
            callback: function(d) {
                g("publish", {
                    state: "offer",
                    id: a.getId(),
                    audio: a.hasAudio(),
                    video: a.hasVideo(),
                    attributes: a.getAttributes(),
                    mode: c.mode
                },
                d,
                function(d, j) {
                    "error" === d ? (b(e, c.errorCodes.PUBLISH_STREAM_FAILED), L.Logger.info("Err: publish stream failed")) : (a.pc.onsignalingmessage = function(b) {
                        a.pc.onsignalingmessage = function() {};
                        g("publish", {
                            state: "ok",
                            id: a.getId(),
                            audio: a.hasAudio(),
                            video: a.hasVideo(),
                            screen: a.hasScreen(),
                            attributes: a.getAttributes(),
                            mode: c.mode
                        },
                        b);
                        a.getId = function() {
                            return j.id
                        };
                        L.Logger.info("Stream published " + j.id);
                        a.onClose = function() {
                            c.unpublish(a)
                        };
                        a.unmuteAudio = function() {
                            f("customMessage", {
                                type: "control",
                                payload: {
                                    action: "audio-out-on"
                                }
                            },
                            function() {},
                            function() {})
                        };
                        a.unmuteVideo = function() {
                            f("customMessage", {
                                type: "control",
                                payload: {
                                    action: "video-out-on"
                                }
                            },
                            function() {},
                            function() {})
                        };
                        a.muteAudio = function() {
                            f("customMessage", {
                                type: "control",
                                payload: {
                                    action: "audio-out-off"
                                }
                            },
                            function() {},
                            function() {})
                        };
                        a.muteVideo = function() {
                            f("customMessage", {
                                type: "control",
                                payload: {
                                    action: "video-out-off"
                                }
                            },
                            function() {},
                            function() {})
                        }
                    },
                    a.pc.oniceconnectionstatechange = function(d) {
                        "failed" === d && (void 0 != c.timers[a.getId()] && clearInterval(c.timers[a.getId()]), f("p2p_lost", void 0,
                        function() {},
                        function() {}), b(e, c.errorCodes.PEERCONNECTION_FAILED), L.Logger.info("Err: [publish] peer connection lost"))
                    },
                    a.pc.processSignalingMessage(d))
                })
            },
            audio: a.hasAudio(),
            video: a.hasVideo(),
            iceServers: [],
            stunServerUrl: c.stunServerUrl,
            turnServer: c.turnServer,
            maxAudioBW: d.maxAudioBW,
            minVideoBW: d.minVideoBW,
            maxVideoBW: d.maxVideoBW,
            mode: c.mode
        }), a.pc.addStream(a.stream), c.timers[a.getId()] = setInterval(function() {
            a && a.pc && a.pc.getStats && a.pc.getStats(function(a) {
                g("publish_stats", {
                    stats: a
                },
                null, null)
            })
        },
        3E3), void 0 !== a.aux_stream && a.pc.addStream(a.aux_stream))
    };
    c.unpublish = function(a, d) {
        "object" !== typeof a || null === a ? (b(d, c.errorCodes.INVALID_LOCAL_STREAM), L.Logger.info("Err: invalid local stream")) : 2 !== c.state ? (b(d, c.errorCodes.INVALID_OPERATION), L.Logger.info("Err: user not in the session")) : (void 0 != c.timers[a.getId()] && clearInterval(c.timers[a.getId()]), void 0 !== c.socket ? a.local && void 0 !== c.localStreams[a.getId()] ? (delete c.localStreams[a.getId()], f("unpublish", a.getId(),
        function(e) {
            if ("error" === e) b(d, c.errorCodes.UNPUBLISH_STREAM_FAILED),
            L.Logger.info("Err: unpublish stream failed");
            else {
                if ((a.hasAudio() || a.hasVideo() || a.hasScreen()) && void 0 === a.url && void 0 !== a.pc) a.pc.close(),
                a.pc = void 0;
                a.getId = function() {
                    return null
                };
                a.onClose = void 0;
                a.unmuteAudio = void 0;
                a.muteAudio = void 0;
                a.unmuteVideo = void 0;
                a.muteVideo = void 0
            }
        },
        d)) : (b(d, c.errorCodes.INVALID_LOCAL_STREAM), L.Logger.info("Err: invalid local stream")) : (b(d, c.errorCodes.INVALID_OPERATION), L.Logger.info("Err: no socket available")))
    };
    c.subscribe = function(a, d) {
        "object" !== typeof a || null === a ? (b(d, c.errorCodes.INVALID_REMOTE_STREAM), L.Logger.info("Err: invalid remote stream")) : 2 !== c.state ? (b(d, c.errorCodes.INVALID_OPERATION), L.Logger.info("Err: user not in the session")) : a.local ? (b(d, c.errorCodes.INVALID_REMOTE_STREAM), L.Logger.info("Err: invalid remote stream")) : a.hasAudio() || a.hasVideo() || a.hasScreen() ? (a.pc = AgoraRTC.Connection({
            callback: function(e) {
                g("subscribe", {
                    streamId: a.getId(),
                    audio: !0,
                    video: !0,
                    mode: c.mode
                },
                e,
                function(e) {
                    "error" === e ? (b(d, c.errorCodes.SUBSCRIBE_STREAM_FAILED), L.Logger.info("Err: subscribe failed, closing stream ", a.getId()), a.close()) : a.pc.processSignalingMessage(e)
                })
            },
            nop2p: !0,
            audio: !0,
            video: !0,
            iceServers: [],
            stunServerUrl: c.stunServerUrl,
            turnServer: c.turnServer
        }), a.pc.onaddstream = function(b) {
            L.Logger.info("Stream subscribed");
            c.remoteStreams[a.getId()].stream = b.stream;
            c.remoteStreams[a.getId()].hasVideo() || c.remoteStreams[a.getId()].disableVideo();
            b = AgoraRTC.StreamEvent({
                type: "stream-subscribed",
                stream: c.remoteStreams[a.getId()]
            });
            c.dispatchEvent(b);
            a.unmuteAudio = function() {
                f("customMessage", {
                    type: "control",
                    payload: {
                        action: "audio-in-on",
                        streamId: a.getId()
                    }
                },
                function() {},
                function() {})
            };
            a.muteAudio = function() {
                f("customMessage", {
                    type: "control",
                    payload: {
                        action: "audio-in-off",
                        streamId: a.getId()
                    }
                },
                function() {},
                function() {})
            };
            a.unmuteVideo = function() {
                f("customMessage", {
                    type: "control",
                    payload: {
                        action: "video-in-on",
                        streamId: a.getId()
                    }
                },
                function() {},
                function() {})
            };
            a.muteVideo = function() {
                f("customMessage", {
                    type: "control",
                    payload: {
                        action: "video-in-off",
                        streamId: a.getId()
                    }
                },
                function() {},
                function() {})
            };
            c.timers[a.getId()] = setInterval(function() {
                a && a.pc && a.pc.getStats && a.pc.getStats(function(b) {
                    g("subscribe_stats", {
                        id: a.getId(),
                        stats: b
                    },
                    null, null)
                })
            },
            3E3)
        },
        a.pc.oniceconnectionstatechange = function(e) {
            "failed" === e && (void 0 != c.timers[a.getId()] && clearInterval(c.timers[a.getId()]), f("p2p_lost", void 0,
            function() {},
            function() {}), b(d, c.errorCodes.PEERCONNECTION_FAILED), L.Logger.info("Err: [subscribe] peer connection lost"))
        },
        L.Logger.info("Subscribing to: " + a.getId())) : (b(d, c.errorCodes.INVALID_REMOTE_STREAM), L.Logger.info("Err: invalid remote stream"))
    };
    c.unsubscribe = function(a, d) {
        "object" !== typeof a || null === a ? (b(d, c.errorCodes.INVALID_REMOTE_STREAM), L.Logger.info("Err: invalid remote stream")) : 2 !== c.state ? (b(d, c.errorCodes.INVALID_OPERATION), L.Logger.info("Err: user not in the session")) : (void 0 != c.timers[a.getId()] && clearInterval(c.timers[a.getId()]), void 0 !== c.socket ? a.local ? (b(d, c.errorCodes.INVALID_REMOTE_STREAM), L.Logger.info("Err: invalid remote stream")) : f("unsubscribe", a.getId(),
        function(e) {
            "error" === e ? (b(d, c.errorCodes.UNSUBSCRIBE_STREAM_FAILED), L.Logger.info("Err: unsubscribe stream failed")) : a.close()
        },
        d) : (b(d, c.errorCodes.INVALID_OPERATION), L.Logger.info("Err: no socket available")))
    };
    return c
};
AgoraRTC.createClient = function() {
    L.Logger.info("Client in compatible mode");
    return AgoraRTC.Client({})
};
AgoraRTC.createRtcClient = function() {
    L.Logger.info("Client in RTC mode");
    return AgoraRTC.Client({
        mode: "rtc"
    })
};
AgoraRTC.createLiveClient = function() {
    L.Logger.info("Client in Live mode");
    return AgoraRTC.Client({
        mode: "live"
    })
};