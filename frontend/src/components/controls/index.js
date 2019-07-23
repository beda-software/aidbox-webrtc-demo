import copy from 'copy-text-to-clipboard';

import React, { useState } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import  { Grid, Button } from 'semantic-ui-react';


const Controls = ({ localParticipant }) => {
  const [isMute, setIsMute] = useState(false);

  useBus("response-mute-micro",   () => setIsMute(true));
  useBus("response-unmute-micro", () => setIsMute(false));

  const toggleMicro = () => {
    emit({
      type: `${isMute ? "unmute" : "mute"}-micro`,
      participant: localParticipant,
    });
  };

  return (
    <Grid.Row className="app-chat-row app-controls">
      <Button
        onClick={() => copy(window.location.href)}
        size="big"
        color="green"
        icon="share alternate"
        circular
      />
      <Button
        onClick={toggleMicro}
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
}

export default Controls;
