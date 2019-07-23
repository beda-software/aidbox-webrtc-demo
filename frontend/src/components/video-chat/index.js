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

  useBus("mute-micro", ({ participant }) => {
    if (participant === localParticipant) {
      muteMicro(localStream);
      emit("response-mute-micro");
    };
  }, [localStream, localParticipant]);

  useBus("unmute-micro", ({ participant }) => {
    if (participant === localParticipant) {
      unmuteMicro(localStream);
      emit("response-unmute-micro")
    };
  }, [localStream, localParticipant]);

  useEffect(() => {
    initLocalStream();
  }, []);

  // Local media

  const initLocalStream = async () => {
    setLocalStream(await getLocalMedia());
    emit("media-captured");
  };

  const muteMicro = (stream) => {
    _.first(stream.getAudioTracks()).enabled = false;
  };

  const unmuteMicro = (stream) => {
    _.first(stream.getAudioTracks()).enabled = true;
  };

  return (
    <Grid.Row className="app-chat-row app-chat-main">
      {localStream && (
        <Video
          stream={localStream}
          key={localParticipant}
          width="95%"
          height="100%"
        />
      )}
      {_.map(
        remoteParticipants,
        (participant) => (
          <RTCConnection
            localParticipant={localParticipant}
            localStream={localStream}
            remoteParticipant={participant}
            key={participant.login}
          />
        )
      )}
    </Grid.Row>
  )
}
