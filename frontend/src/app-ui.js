import _ from 'lodash';

import React, { useState } from 'react';
import { dispatch as emit } from 'use-bus';

import {
    Container,
    Grid,
    Button,
    Header,
    Modal,
    Input,
    Form,
    Checkbox,
    Icon,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import SignalingChannel from './components/signaling';
import VideoChat from './components/video-chat';
import Controls from './components/controls';
import './App.css';


const AppUI = ({
    isEntered,
    room,
    localParticipant,
    remoteParticipants,
}) => {
    const [isLinkCopied,    setIsCopiedLink]    = useState(false);

    const [isDisabledAudio, setIsDisabledAudio] = useState(true);
    const [isDisabledVideo, setIsDisabledVideo] = useState(false);

    const renameRoom = (e, { value: room }) => {
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

    const toggleAudio = () => {
        setIsDisabledAudio(!isDisabledAudio);
    };

    const toggleVideo = () => {
        setIsDisabledVideo(!isDisabledVideo);
    };

    return (
        <Container
            className="app"
            fluid
        >
            {!isEntered ? (
                <Modal
                    size="small"
                    open
                    basic
                >
                    <Header
                        icon="chat"
                        content="Create new chat or join to exist room."
                    />
                    <Modal.Content>
                        <Input
                            action={{
                                onClick: shareLink,
                                labelPosition: "left",
                                icon: "copy",
                                content: isLinkCopied ? "Copied" : "Copy",
                                color: isLinkCopied ? "green" : "grey",
                            }}
                            actionPosition="left"
                            onChange={renameRoom}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    enterRoom();
                                }
                            }}
                            value={room}
                            focus
                            fluid
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            className="settings-button"
                            floated="left"
                        >
                            <Form.Field
                                onChange={toggleAudio}
                                control={Checkbox}
                                label="Mute my micro"
                                checked={isDisabledAudio}
                            />
                        </Button>
                        <Button
                            className="settings-button"
                            floated="left"
                        >
                            <Form.Field
                                onChange={toggleVideo}
                                control={Checkbox}
                                label="Disable my video"
                                checked={isDisabledVideo}
                            />
                        </Button>
                        <Button
                            color="green"
                            onClick={enterRoom}
                            labelPosition="right"
                            icon
                        >
                            Enter
                            <Icon name="right arrow" />
                        </Button>
                    </Modal.Actions>
                </Modal>
            ) : (
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
                        localParticipant={localParticipant}
                    />
                </Grid>
            )}
        </Container>
    )
};

export default AppUI;
