import _ from 'lodash';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Notify signaling server about new participant
    emit({ type: "login", login: localParticipant });
    emit({ type: "join-room", login: localParticipant, room });
  }, []);

  // Listen signaling channel

  useBus("response-join-room", (data) => {
    addRemoteParticipant(data.response.login)
  });

  useBus("response-logout", (data) => {
    removeRemoteParticipant(data.response.login);
  });

  // Room

  const addRemoteParticipant = (login) => {
    setRemoteParticipants((prevRemoteParticipants) => {
      return [...prevRemoteParticipants, login]
    });
  };

  const removeRemoteParticipant = (login) => {
    setRemoteParticipants((prevRemoteParticipants) => {
      return _.without(prevRemoteParticipants, login)
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
              (p) => `${p} `)
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
