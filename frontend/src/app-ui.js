import _ from 'lodash';

import React from 'react';

import  { Container, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import SignalingChannel from './components/signaling';
import VideoChat from './components/video-chat';
import Controls from './components/controls';
import './App.css';


const AppUI = ({ room, localParticipant, remoteParticipants }) => {
    return (
        <Container
            className="app"
            fluid
        >
            <Grid className="app-chat">
                <SignalingChannel />

                <Grid.Row className="app-chat-debug">
                    <p>Participants: {
                        _.map(
                            [localParticipant, ...remoteParticipants],
                            (p) => `${p.login || p} `)
                        }
                    </p>
                </Grid.Row>

                <VideoChat
                    localParticipant={localParticipant}
                    remoteParticipants={remoteParticipants}
                />

                <Controls
                    room={room}
                    localParticipant={localParticipant}
                />

            </Grid>
        </Container>
    )
};

export default AppUI;
