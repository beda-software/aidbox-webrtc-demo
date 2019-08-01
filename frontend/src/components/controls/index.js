import isReactNative from 'src/utils/platform';

import copy from 'copy-text-to-clipboard';

import React, { useState } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import ControlsUI from './controls-ui';


const Controls = ({ room, localParticipant }) => {
    const [isMutedAudio, setIsMutedAudio] = useState(true);
    const [isMutedVideo, setIsMutedVideo] = useState(false);

    useBus("response-mute-micro",   () => setIsMutedAudio(true));
    useBus("response-unmute-micro", () => setIsMutedAudio(false));

    useBus("response-mute-video",   () => setIsMutedVideo(true));
    useBus("response-unmute-video", () => setIsMutedVideo(false));

    const shareLink = () => {
        copy(isReactNative ? window.location.href : room);
    };

    const toggleMicro = () => {
        emit({
            type: `${isMutedAudio ? "unmute" : "mute"}-micro`,
            participant: localParticipant,
        });
    };

    const toggleVideo = () => {
        emit({
            type: `${isMutedVideo ? "unmute" : "mute"}-video`,
            participant: localParticipant,
        });
    };

    return (
        <ControlsUI
            copyHandler={shareLink}
            microHandler={toggleMicro}
            videoHandler={toggleVideo}
            isMutedAudio={isMutedAudio}
            isMutedVideo={isMutedVideo}
        />
    )
}

export default Controls;
