import React from 'react';

import VideoUI from './video-ui';


const Video = ({ stream, className, width, height }) => {
    return (
        <VideoUI
            stream={stream}
            className={className}
            width={width}
            height={height}
        />
    );
};

export default Video;
