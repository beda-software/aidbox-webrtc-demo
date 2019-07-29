import React from 'react';

const RTCConnectionUI = ({
    stream,
    key,
    width,
    height
}) => {
    return stream && (
        <Video
            stream={stream}
            key={key}
            width="95%"
            height="100%"
        />
    )
};

export default RTCConnectionUI;
