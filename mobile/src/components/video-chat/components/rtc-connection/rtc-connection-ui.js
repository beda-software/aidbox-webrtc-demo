import React from 'react';
import Video from '../video';


const RTCConnectionUI = ({
    stream,
    width,
    height
}) => {
    return stream && (
        <Video
            stream={stream}
            width="95%"
            height="100%"
        />
    )
};

export default RTCConnectionUI;
