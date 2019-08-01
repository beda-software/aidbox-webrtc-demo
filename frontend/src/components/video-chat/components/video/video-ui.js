import React, { useState } from 'react';

import 'semantic-ui-css/semantic.min.css';
import  { Container, Loader } from 'semantic-ui-react';
import './video.css';


const VideoUI = ({ stream, className, width, height }) => {
    const [isReady, setIsReady] = useState(false);

    const onReadyStateChange = (e) => {
        const { readyState } = e.target;
        if (readyState === 4) {
            setIsReady(true);
        }
    };

    return (
        stream && (
            <Container className="video-container">
                <video
                    className={className}
                    onLoadedData={onReadyStateChange}
                    ref={(video) => {
                        if (video) {
                            video.srcObject = stream;
                        }
                    }}
                    autoPlay
                    width={width}
                    height={height}
                    style={{
                        display: isReady ? 'initial' : 'none',
                    }}
                />
                <Loader active={!isReady} />
            </Container>
        )
    )
};

export default VideoUI;
