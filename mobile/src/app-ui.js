import React, { useState } from 'react';
import { dispatch as emit } from 'use-bus';

import { StatusBar } from 'react-native';

import {
    Container,
    Content,
    Text,
    Header,
    Body,
    Icon,
    Form,
    Item,
    Label,
    Input,
    Button,
    CheckBox,
    ListItem,
    StyleProvider,
} from 'native-base';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';

import SignalingChannel from './components/signaling';
import VideoChat from './components/video-chat';
import Controls from './components/controls';

import s from './style';


const AppUI = ({
    isEntered,
    room,
    localParticipant,
    remoteParticipants,
}) => {
    const [isLinkCopied,    setIsCopiedLink]    = useState(false);

    const [isDisabledAudio, setIsDisabledAudio] = useState(true);
    const [isDisabledVideo, setIsDisabledVideo] = useState(false);

    const renameRoom = (room) => {
        emit({
            type: "rename-room",
            room,
        })
    };

    const enterRoom = () => {
        emit({ type: "preset-audio", enabled: !isDisabledAudio });
        emit({ type: "preset-video", enabled: !isDisabledVideo });
        emit({ type: "enter-room" });
    };

    const shareLink = () => {
        emit({ type: "copy-room-link" });
        setIsCopiedLink(true);
    };

    const setAudio = () => {
        setIsDisabledAudio(!isDisabledAudio);
    };

    const setVideo = () => {
        setIsDisabledVideo(!isDisabledVideo);
    };

    return (
        <StyleProvider style={getTheme(material)}>
            <Container style={{ display: "flex" }}>
                <Header style={s.header}>
                    <StatusBar backgroundColor="#111"/>
                    <Body>
                        <Text style={s.title}>
                            Voice and video chat
                        </Text>
                    </Body>
                    {isEntered && (
                        <Button style={s.menu}>
                            <Text>Options</Text>
                        </Button>
                    )}
                </Header>
                {!isEntered ? (
                    <Content style={s.content} padder>
                        <Form>
                            <Item style={s.inputWrapper} stackedLabel>
                                <Label style={s.label}>Room ID</Label>
                                <Input
                                    onChangeText={renameRoom}
                                    value={room}
                                    style={s.input}
                                    autoFocus
                                />
                            </Item>
                            <ListItem style={{ marginLeft: 0 }}>
                                <CheckBox
                                    onPress={setAudio}
                                    checked={isDisabledAudio}
                                />
                                <Body>
                                    <Text style={{ color: "white" }}>Mute my micro</Text>
                                </Body>
                            </ListItem>
                            <ListItem style={{ marginLeft: 0 }}>
                                <CheckBox
                                    onPress={setVideo}
                                    checked={isDisabledVideo}
                                />
                                <Body>
                                    <Text style={{ color: "white" }}>Disable my video</Text>
                                </Body>
                            </ListItem>
                            <Button style={s.button} onPress={enterRoom} full>
                                <Text>Enter</Text>
                            </Button>
                        </Form>
                    </Content>
                ) : (
                    <Content style={s.app} padder>
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
                )}
            </Container>
        </StyleProvider>
    );
};

export default AppUI;
