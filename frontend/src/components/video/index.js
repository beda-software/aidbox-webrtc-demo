import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import  { Loader } from 'semantic-ui-react';
import './video.css';

export default (props) => {
    const [isReady, setIsReady] = useState(false);

    const onReadyStateChange = (e) => {
        const { readyState } = e.target;
        if (readyState === 4) {
            setIsReady(true);
        }
    }

    return props.stream && (
        <div className="video-container">
            <video
                onLoadedData={onReadyStateChange}
                key={props.key}
                ref={(video) => {
                    if (video) {
                        video.srcObject = props.stream;
                    }
                }}
                autoPlay
                width={props.width}
                style={{
                    display: isReady ? 'initial' : 'none',
                }}
            />
            <Loader active={!isReady} />
        </div>
    )
}
