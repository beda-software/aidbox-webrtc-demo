import _ from 'lodash';

import React from 'react';

import  { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import Video from './components/video';
import RTCConnection from './components/rtc-connection';

const VideoChatUI = ({ localStream, localParticipant, remoteParticipants }) => {
    return (
        <Grid.Row className="app-chat-row app-chat-main">
            {localStream && (
                <Video
                    className="local-stream"
                    stream={localStream}
                    key={localParticipant}
                    width="95%"
                    height="100%"
                />
            )}
            {_.map(
                remoteParticipants,
                (participant) => (
                    <RTCConnection
                        localParticipant={localParticipant}
                        localStream={localStream}
                        remoteParticipant={participant}
                        key={participant.login}
                    />
                )
            )}
        </Grid.Row>
    )
};

export default VideoChatUI;
