import React from 'react';

import  { Grid, Button } from 'semantic-ui-react';


const ControlsUI = ({ copyHandler, microHandler, isMute }) => {
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
                color={isMute ? "green" : "red"}
                icon={isMute ? "microphone" : "microphone slash"}
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
                icon="video"
                size="big"
                circular
                disabled
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
