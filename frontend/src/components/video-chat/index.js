import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import { getLocalMedia } from 'src/utils/media';

import VideoChatUI from './video-chat-ui';


const VideoChat = ({ localParticipant, remoteParticipants }) => {
    const [localStream, setLocalStream] = useState(null);

    useBus("mute-micro", ({ participant }) => {
        if (localStream && participant === localParticipant) {
            muteMicro(localStream);
            emit("response-mute-micro");
        }
    }, [localStream, localParticipant]);

    useBus("unmute-micro", ({ participant }) => {
        if (localStream && participant === localParticipant) {
            unmuteMicro(localStream);
            emit("response-unmute-micro");
        }
    }, [localStream, localParticipant]);

    useBus("mute-video", ({ participant }) => {
        if (localStream && participant === localParticipant) {
            muteVideo(localStream);
            emit("response-mute-video");
        }
    }, [localStream, localParticipant]);

    useBus("unmute-video", ({ participant }) => {
        if (localStream && participant === localParticipant) {
            unmuteVideo(localStream);
            emit("response-unmute-video");
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

    const muteVideo = (stream) => {
        _.first(stream.getVideoTracks()).enabled = false;
    };

    const unmuteVideo = (stream) => {
        _.first(stream.getVideoTracks()).enabled = true;
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
