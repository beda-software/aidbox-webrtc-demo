import React from 'react';
import Video from '../video';


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
