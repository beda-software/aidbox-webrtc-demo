import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import usePrevious from '@rooks/use-previous';
import useBus, { dispatch as emit } from 'use-bus';

import  { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { getLocalMedia } from 'utils/media';

import Video from './components/video';


export default (props) => {
  const [localStream,     setLocalStream]     = useState(null);
  const [remoteStreams,   setRemoteStreams]   = useState([]);

  useEffect(() => {
    if (props.localParticipant) {
      initLocalStream();
    };
  }, [props.localParticipant]);

  // Local media

  const initLocalStream = async () => {
    setLocalStream(await getLocalMedia());
    console.log("Local media has been captured.");
  };

  return (
    <Grid.Row className="app-chat-row app-chat-main">
      {_.map(
        [localStream, ...remoteStreams],
        (stream) => stream && (
          <Video
            stream={stream}
            key={stream.id}
            width="95%"
            height="100%"
          />
        )
      )}
    </Grid.Row>
  )
}
