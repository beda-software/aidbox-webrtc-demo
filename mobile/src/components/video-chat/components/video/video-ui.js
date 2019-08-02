import React from 'react';

import { RTCView } from 'react-native-webrtc';


const VideoUI = ({ stream, width, height }) => {
    return (
        <RTCView
            streamURL={stream.toURL()}
            style={{
                width: "100%",
                height: 300,
            }}
        />
    );
};

export default VideoUI;
