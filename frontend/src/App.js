import _ from 'lodash';

import isReactNative from 'src/utils/platform';

import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import { createRoom, createLogin } from './utils/room';

import AppUI from './app-ui';


const App = () => {
    const [isMediaCaptured,    setIsMediaCaptured]    = useState(false);
    const [isSignalingReady,   setIsSignalingReady]   = useState(false);

    const [isEntered,          setIsEntered]          = useState(false);
    const [isEnabledAudio,     setIsEnabledAudio]     = useState(false);
    const [isEnabledVideo,     setIsEnabledVideo]     = useState(true);

    const [room,               setRoom]               = useState(createRoom());
    const [localParticipant,   setLocalParticipant]   = useState(createLogin());
    const [remoteParticipants, setRemoteParticipants] = useState([]);

    // Enter room when local media and signaling channel is ready

    useBus("media-captured", () => {
        setIsMediaCaptured(true);

        emit({
            type: `${isEnabledAudio ? "un" : ""}mute-micro`,
            participant: localParticipant,
        });
        emit({
            type: `${isEnabledVideo ? "un" : ""}mute-video`,
            participant: localParticipant,
        });
    }, [isEnabledAudio, isEnabledVideo]);

    useBus("channel-opened", () => { setIsSignalingReady(true) });

    useEffect(() => {
        if (isMediaCaptured && isSignalingReady) {
            emit({ type: "login", login: localParticipant });
            emit({ type: "join-room", login: localParticipant, room });
        }
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

    // Media

    useBus("set-audio", ({ enabled }) => {
        setIsEnabledAudio(enabled);
    });

    useBus("set-video", ({ enabled }) => {
        setIsEnabledVideo(enabled);
    });

    // Room

    useBus("change-room", ({ room }) => {
        setRoom(room);
    });

    useBus("enter-room", () => {
        setIsEntered(true);
    });

    useEffect(() => {
        if (!isReactNative()) {
            window.history.pushState(
                {},
                `Room: ${room}`,
                `/${room}`
            );
        }
    }, [room])

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
            isEntered={isEntered}
            room={room}
            localParticipant={localParticipant}
            remoteParticipants={remoteParticipants}
        />
    )
};

export default App;
