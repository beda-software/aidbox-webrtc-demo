import React from 'react';

import { RTCView } from 'react-native-webrtc';


const VideoUI = ({ stream, key, width, height }) => {
    return (
        <RTCView
            streamURL={stream.toURL()}
            key={key}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
};

export default VideoUI;
