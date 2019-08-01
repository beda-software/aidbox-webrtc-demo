import React from 'react';

import Video from '../video';


const RTCConnectionUI = ({
    stream,
    width,
    height
}) => {
    return stream && (
        <Video
            className="remote-stream"
            stream={stream}
            width={width}
            height={height}
        />
    )
}

export default RTCConnectionUI;
