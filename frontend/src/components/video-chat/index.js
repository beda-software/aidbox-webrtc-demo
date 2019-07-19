import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import  { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { getLocalMedia } from 'utils/media';

import Video from './components/video';
import RTCConnection from './components/rtc-connection';


export default ({ localParticipant, remoteParticipants }) => {
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    initLocalStream();
  }, []);

  // Local media

  const initLocalStream = async () => {
    setLocalStream(await getLocalMedia());
    emit("media-captured");
  };

  return (
    <Grid.Row className="app-chat-row app-chat-main">
      {localStream && (
        <Video
          stream={localStream}
          key={localParticipant.login}
          width="95%"
          height="100%"
        />
      )}
      {_.map(
        remoteParticipants,
        (participant) => (
          <RTCConnection
            localParticipant={participant}
            localStream={localStream}
            remoteParticipant={participant}
            key={participant}
          />
        )
      )}
    </Grid.Row>
  )
}
