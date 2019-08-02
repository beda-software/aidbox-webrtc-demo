import _ from 'lodash';

import React from 'react';
import { Container } from 'native-base';

import Video from './components/video';
import RTCConnection from './components/rtc-connection';

import s from 'src/style';


const VideoChatUI = ({ localStream, localParticipant, remoteParticipants }) => {
    return (
        <Container style={s.container}>
            {localStream && (
                <Video
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
        </Container>
    );
};

export default VideoChatUI;
