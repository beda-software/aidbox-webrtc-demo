import copy from 'copy-text-to-clipboard';

import React from 'react';

import  { Grid, Button } from 'semantic-ui-react';


export default (props) => {
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
        icon="microphone"
        size="big"
        circular
        disabled
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
