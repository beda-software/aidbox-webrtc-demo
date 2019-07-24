import isReactNative from 'utils/platform';

import copy from 'copy-text-to-clipboard';

import React, { useState } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import ControlsUI from './controls-ui';


const Controls = ({ room, localParticipant }) => {
    const [isMute, setIsMute] = useState(false);

    useBus("response-mute-micro",   () => setIsMute(true));
    useBus("response-unmute-micro", () => setIsMute(false));

    const shareLink = () => {
        copy(isReactNative ? window.location.href : room);
    };

    const toggleMicro = () => {
        emit({
            type: `${isMute ? "unmute" : "mute"}-micro`,
            participant: localParticipant,
        });
    };

    return (
        <ControlsUI
            copyHandler={shareLink}
            microHandler={toggleMicro}
            isMute={isMute}
        />
    )
}

export default Controls;
