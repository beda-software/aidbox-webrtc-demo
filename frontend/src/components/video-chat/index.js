import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import { getLocalMedia } from 'src/utils/media';

import VideoChatUI from './video-chat-ui';


const VideoChat = ({ localParticipant, remoteParticipants }) => {
    const [localStream, setLocalStream] = useState(null);

    useBus("mute-micro", ({ participant }) => {
        if (participant === localParticipant) {
            muteMicro(localStream);
            emit("response-mute-micro");
        }
    }, [localStream, localParticipant]);

    useBus("unmute-micro", ({ participant }) => {
        if (participant === localParticipant) {
            unmuteMicro(localStream);
            emit("response-unmute-micro")
        }
    }, [localStream, localParticipant]);

    useEffect(() => {
        initLocalStream();
    }, []);

    // Local media

    const initLocalStream = async () => {
        setLocalStream(await getLocalMedia());
        emit("media-captured");
    };

    const muteMicro = (stream) => {
        _.first(stream.getAudioTracks()).enabled = false;
    };

    const unmuteMicro = (stream) => {
        _.first(stream.getAudioTracks()).enabled = true;
    };

    return (
        <VideoChatUI
            localStream={localStream}
            localParticipant={localParticipant}
            remoteParticipants={remoteParticipants}
        />
    )
};

export default VideoChat;
