import React from 'react';

import VideoUI from './video-ui';


const Video = ({ stream, width, height }) => {
    return (
        <VideoUI
            stream={stream}
            width={width}
            height={height}
        />
    );
};

export default Video;
