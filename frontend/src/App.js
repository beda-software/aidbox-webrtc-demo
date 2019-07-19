import _ from 'lodash';

import React, { useState } from 'react';
import useBus, { dispatch as emit } from 'use-bus';

import  { Container, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { createRoom, createLogin } from './utils/room';

import SignalingChannel from './components/signaling';
import VideoChat from './components/video-chat';
import Controls from './components/controls';
import './App.css';


const App = () => {
  const [room,               setRoom]               = useState(createRoom());
  const [localParticipant,   setLocalParticipant]   = useState(createLogin());
  const [remoteParticipants, setRemoteParticipants] = useState([]);

  // Enter room when local media is ready

  useBus("media-captured", () => {
    emit({ type: "login", login: localParticipant });
    emit({ type: "join-room", login: localParticipant, room });
  });

  // Listen signaling channel

  useBus("response-wait-offer", ({ login }) => {
    addRemoteParticipant({ isWaitingOffer: true, login});
  });

  useBus("response-join-room", ({ login }) => {
    addRemoteParticipant({ isWaitingOffer: false, login });
  });

  useBus("response-logout", ({ login }) => {
    removeRemoteParticipant(_.find(remoteParticipants, { login }));
  }, [remoteParticipants]);

  // Room

  const addRemoteParticipant = (participant) => {
    setRemoteParticipants((prevRemoteParticipants) => {
      return [...prevRemoteParticipants, participant]
    });
  };

  const removeRemoteParticipant = (participant) => {
    setRemoteParticipants((prevRemoteParticipants) => {
      return _.without(prevRemoteParticipants, participant)
    });
  };

  return (
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

        <Controls />

      </Grid>
    </Container>
  )
};

export default App;
