import React from 'react';

import {
    Container,
    Header,
    Body,
    Content,
    Item,
    Input
} from 'native-base';

import SignalingChannel from './components/signaling';
import VideoChat from './components/video-chat';
import Controls from './components/controls';


const AppUI = ({ room, localParticipant, remoteParticipants }) => {
    return (
        <Container>
            <Header>
                <Body>
                    <Item regular>
                        <Input value={room} style={{ color: "white" }} />
                    </Item>
                </Body>
            </Header>
            <Content>
                <SignalingChannel />

                <VideoChat
                    localParticipant={localParticipant}
                    remoteParticipants={remoteParticipants}
                />

                <Controls
                    room={room}
                    localParticipant={localParticipant}
                />
            </Content>
        </Container>
    );
};

export default AppUI;
