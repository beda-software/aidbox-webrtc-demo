import React from 'react';

import VideoUI from './video-ui';


const Video = ({ stream, key, width, height }) => {
    return (
        <VideoUI
            stream={stream}
            key={key}
            width={width}
            height={height}
        />
    );
};

export default Video;
