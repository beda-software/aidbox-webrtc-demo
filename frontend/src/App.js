import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import { createRoom, createLogin } from './utils/room';

import AppUI from './app-ui';


const App = () => {
    const [isMediaCaptured,    setIsMediaCaptured]    = useState(false);
    const [isSignalingReady,   setIsSignalingReady]   = useState(false);

    const [room,               setRoom]               = useState(createRoom());
    const [localParticipant,   setLocalParticipant]   = useState(createLogin());
    const [remoteParticipants, setRemoteParticipants] = useState([]);

    // Enter room when local media and signaling channel is ready

    useBus("media-captured", () => { setIsMediaCaptured(true) });
    useBus("channel-opened", () => { setIsSignalingReady(true) });

    useEffect(() => {
        if (isMediaCaptured && isSignalingReady) {
            emit({ type: "login", login: localParticipant });
            emit({ type: "join-room", login: localParticipant, room });
        };
    }, [isMediaCaptured, isSignalingReady])

    // Listen signaling channel

    useBus("response-wait-offer", ({ login }) => {
        addRemoteParticipant({ isWaitingOffer: true, login});
    });

    useBus("response-join-room", ({ login }) => {
        addRemoteParticipant({ isWaitingOffer: false, login });
    });

    useBus("response-logout", ({ login }) => {
        removeRemoteParticipant(_.find(remoteParticipants, { login }));
    }, [remoteParticipants]);

    // Room

    const addRemoteParticipant = (participant) => {
        setRemoteParticipants((prevRemoteParticipants) => {
            return [...prevRemoteParticipants, participant]
        });
    };

    const removeRemoteParticipant = (participant) => {
        setRemoteParticipants((prevRemoteParticipants) => {
            return _.without(prevRemoteParticipants, participant)
        });
    };

    return (
        <AppUI
            room={room}
            localParticipant={localParticipant}
            remoteParticipants={remoteParticipants}
        />
    )
};

export default App;
