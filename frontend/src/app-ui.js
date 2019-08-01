import _ from 'lodash';
import copy from 'copy-text-to-clipboard';

import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

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


const AppUI = ({ isEntered, room, localParticipant, remoteParticipants }) => {
    const [isCopiedLink,    setIsCopiedLink]    = useState(false);

    const [isDisabledAudio, setIsDisabledAudio] = useState(true);
    const [isDisabledVideo, setIsDisabledVideo] = useState(false);

    const changeRoom = (e, { value: room }) => {
        emit({
            type: "change-room",
            room,
        })
    };

    const enterRoom = () => {
        emit({ type: "set-audio", enabled: !isDisabledAudio });
        emit({ type: "set-video", enabled: !isDisabledVideo });
        emit({ type: "enter-room" });
    };

    const shareLink = () => {
        copy(window.location.href);
        setIsCopiedLink(true);
    };

    const setAudio = (e, { checked: enabled }) => {
        setIsDisabledAudio(enabled);
    };

    const setVideo = (e, { checked: enabled }) => {
        setIsDisabledVideo(enabled);
    };

    return !isEntered ? (
        <Modal
            size="small"
            open={!isEntered}
            basic
        >
            <Header
                icon="wechat"
                content="Create new conference or join to exist room"
            />
            <Modal.Content>
                <Input
                    action={{
                        onClick: shareLink,
                        labelPosition: "left",
                        icon: "copy",
                        content: isCopiedLink ? "Copied" : "Copy",
                        color: isCopiedLink ? "green" : null,
                    }}
                    actionPosition="left"
                    onChange={changeRoom}
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
                        onChange={setAudio}
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
                        onChange={setVideo}
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
