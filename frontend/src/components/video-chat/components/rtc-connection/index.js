import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import RTCConnectionUI from './rtc-connection-ui';

import config from 'src/app-config';


export default ({
    localParticipant,
    localStream,
    remoteParticipant,
    key
}) => {
    const [connection,  setConnection]  = useState(null);
    const [stream,      setStream]      = useState(null);
    const [offer,       setOffer]       = useState(null);
    const [answer,      setAnswer]      = useState(null);
    const [candidates,  setCandidates]  = useState([]);

    useBus("response-offer",     onOffer,     [connection]);
    useBus("response-answer",    onAnswer,    [connection]);
    useBus("response-candidate", onCandidate, [connection]);

    useEffect(() => {
        setConnection(createConnection(remoteParticipant));
    }, [remoteParticipant]);

    useEffect(() => {
        if (connection && remoteParticipant.isWaitingOffer) {
            sendOffer();
        };
    }, [connection]);

    useEffect(() => {
        if (connection && offer) {
            sendAnswer();
        };
    }, [connection, offer]);

    useEffect(() => {
        if (connection && answer) {
            console.log(connection);
            connection.setRemoteDescription(answer);
        };
    }, [connection, answer])

    useEffect(() => {
        if (connection && candidates.length) {
            _.forEach(candidates, sendCandidate);
        };
    }, [connection, candidates]);

    // Connection

    const createConnection = () => {
        const conn = new RTCPeerConnection(config.connection);

        conn.addEventListener('icecandidate', onIceCandidate);
        conn.addEventListener('addstream',    onAddStream);

        // TODO: replace code below with addTrack method
        conn.addStream(localStream);

        return conn;
    };

    // Sending handlers

    async function sendOffer() {
        const offer = await connection.createOffer();
        connection.setLocalDescription(offer);

        console.log("Send offer", offer);
        send("offer", offer);
    };

    async function sendAnswer() {
        await connection.setRemoteDescription(offer);
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);

        if (connection.canTrickleIceCandidates) {
            return connection.localDescription;
        }

        connection.addEventListener(
            "icegatheringstatechange",
            onIceGatheringStateChange
        );

        console.log("Send answer", answer);
        send('answer', answer);
    };

    function sendCandidate(candidate) {
        send("candidate", candidate);
    };

    // General RTC receivers

    async function onOffer({ offer }) {
        console.log("Got offer", offer);
        setOffer(offer);
    };

    function onAnswer({ answer }) {
        console.log("Got answer", answer);
        setAnswer(answer);
    };

    function onCandidate({ candidate }) {
        if (connection) {
            connection.addIceCandidate(candidate);
        } else {
            // TODO: fix this case
            console.error(
                "Connection doesn't exist, but got candidate",
                candidate,
            );
        }
    };

    // RTC connection listeners

    const onIceCandidate = ({ candidate }) => {
        if (candidate) {
            setCandidates([...candidates, candidate]);
        }
    };

    const onAddStream = ({ stream }) => {
        setStream(stream);
    };

    const onIceGatheringStateChange = async (e) => {
        if (e.target.iceGatheringState === "complete") {
            const answer = await connection.localDescription;
            send("answer", answer);
        }
    };

    // Wrapper for emitting messages to global event bus

    const send = (type, message) => {
        emit({
            from: localParticipant,
            to: remoteParticipant.login,
            type,
            [type]: message,
        })
    };

    return (
        <RTCConnectionUI
            stream={stream}
            key={key}
            width="95%"
            height="100%"
        />
    )
};
