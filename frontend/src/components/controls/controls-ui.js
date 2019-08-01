import React from 'react';
import { dispatch as emit } from 'use-bus';

import  { Grid, Button, Popup } from 'semantic-ui-react';


const ControlsUI = ({
    copyHandler,
    microHandler,
    videoHandler,
    isLinkCopied,
    isMutedAudio,
    isMutedVideo,
}) => {
    return (
        <Grid.Row className="app-chat-row app-controls">
            <Popup
                onClose={() => { emit("unset-is-copied-room-link") }}
                content={
                    isLinkCopied
                        ? "Link has been copied"
                        : "Copy link to clipboard"
                }
                trigger={
                    <Button
                        onClick={copyHandler}
                        size="big"
                        color="green"
                        icon="share alternate"
                        circular
                    />
                }
                position="top center"
                inverted
                />
            <Popup
                content={`${isMutedAudio ? "Unmute" : "Mute"} microphone`}
                trigger={
                    <Button
                        onClick={microHandler}
                        color={isMutedAudio ? "green" : "red"}
                        icon="microphone"
                        size="big"
                        circular
                    />
                }
                position="top center"
                inverted
            />
            <Button
                color="red"
                icon="phone"
                size="big"
                circular
                disabled
            />
            <Popup
                content={`${isMutedVideo ? "Enable" : "Disable"} camera`}
                trigger={
                    <Button
                        onClick={videoHandler}
                        color={isMutedVideo ? "green" : "red"}
                        icon="video"
                        size="big"
                        circular
                    />
                }
                position="top center"
                inverted
            />
            <Button
                size="big"
                icon="circle"
                circular
                disabled
            />
        </Grid.Row>
    )
};

export default ControlsUI;
