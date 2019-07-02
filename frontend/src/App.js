import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import copy from 'copy-text-to-clipboard';

import Video from './components/video';
import { createLogin, getRoomID } from './utils';

import 'semantic-ui-css/semantic.min.css';
import  { Button } from 'semantic-ui-react';

import './App.css';



const App = () => {
  const [login, setLogin] = useState(createLogin());
  const [remoteNegotiators, setRemoteNegotiators] = useState([]);
  const [roomID, setRoomID] = useState(getRoomID());
  const [isCapturedUserMedia, setIsCapturedUserMedia] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
  // Peer connection
  const configuration = {
    iceServers: [{ url: 'stun:stun.1.google.com:19302' }],
  };

  const connection = new RTCPeerConnection(configuration);

  // Socket
  const socket = io('http://localhost:3001');
  socket.on('connect', () => {
    send({
      type: 'login',
      name: login,
    })
  });
  socket.on('error', console.log);
  socket.on('message', (message) => {
    console.log('Got message', message);
    const data = JSON.parse(message);

    switch (data.type) {
      case 'login':
        onLogin(data.name);
        break;
      case 'offer':
        onOffer(data.offer, data.name);
        break;
      case 'answer':
        onAnswer(data.answer);
        break;
      case 'candidate':
        onCandidate(data.candidate);
        break;
      default:
        break;
    }
  });

  const onLogin = (name) => {
    if (name !== login) {
      console.log(`User ${name} joined`);
      setRemoteNegotiators([...remoteNegotiators, name]);
      connection.createOffer()
        .then((offer) => {
          send({
            type: 'offer',
            name,
            offer,
          });
          connection.setLocalDescription(offer);
        })
        .catch(console.log);
    }
  };

  const onOffer = (offer, name) => {
    connection.setRemoteDescription(new RTCSessionDescription(offer));
    connection.createAnswer()
      .then((answer) => {
        connection.setLocalDescription(answer);
        send({
          type: "answer",
          name,
          answer,
        })
      })
      .catch(console.log)
  };

  const onAnswer = (answer) => {
    connection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const onCandidate = (candidate) => {
    connection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const send = (message) => {
    socket.send(JSON.stringify(message));
  };

  const initRoom = () => {
    window.history.replaceState({}, `Room: ${roomID}`, `/${roomID}`);
  };

    initRoom();

    if (!isCapturedUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      }).then((localStream) => {
        setIsCapturedUserMedia(true);
        setLocalStream(localStream);

        connection.addStream(localStream);
        connection.onicecandidate = (e) => {
          if (e.candidate) {
            console.log('remoteNegotiators before mapping', JSON.stringify(remoteNegotiators));
            _.forEach(remoteNegotiators, (negotiator) => {
              send({
                type: "candidate",
                name: negotiator,
                candidate: e.candidate,
              });
            })
          }
        }
        connection.onaddstream = (e) => {
          setRemoteStreams([...remoteStreams, e.stream]);
          console.log('addStream', e);
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="App-chat">
        <div className="App-chat-main">
          <div className="App-chat-videos">
            {_.map(
              [localStream, ...remoteStreams],
              (stream, i) => (
                <Video
                  stream={stream}
                  key={i}
                  width={`${100 / (remoteNegotiators.length + 1)}%`}
                />
              )
            )}
          </div>
        </div>
        <div className="App-chat-controls">
          <Button
            onClick={() => copy(window.location.href)}
            color="green"
            icon="share alternate"
            circular
          />
        </div>
      </div>
    </div>
  )
};

export default App;
