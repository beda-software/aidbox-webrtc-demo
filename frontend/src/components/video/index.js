import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import  { Loader } from 'semantic-ui-react';

export default (props) => {
    const [isReady, setIsReady] = useState(false);

    const onReadyStateChange = (e) => {
        const { readyState } = e.target;
        if (readyState === 4) {
            setIsReady(true);
        }
    }

    return (
        <div className="video-container">
            <video
                onLoadedData={onReadyStateChange}
                key={props.key || null}
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
