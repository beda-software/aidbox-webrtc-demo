import React from 'react';

import  { Grid, Button } from 'semantic-ui-react';


const ControlsUI = ({
    copyHandler,
    microHandler,
    videoHandler,
    isMutedAudio,
    isMutedVideo
}) => {
    return (
        <Grid.Row className="app-chat-row app-controls">
            <Button
                onClick={copyHandler}
                size="big"
                color="green"
                icon="share alternate"
                circular
            />
            <Button
                onClick={microHandler}
                color={isMutedAudio ? "green" : "red"}
                icon="microphone"
                size="big"
                circular
            />
            <Button
                color="red"
                icon="phone"
                size="big"
                circular
                disabled
            />
            <Button
                onClick={videoHandler}
                color={isMutedVideo ? "green" : "red"}
                icon="video"
                size="big"
                circular
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
