import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import copy from 'copy-text-to-clipboard';

import Video from './components/video';
import { createLogin, getRoomID, initRoom } from './components/room';

import 'semantic-ui-css/semantic.min.css';
import  { Button } from 'semantic-ui-react';

import './App.css';

const App = () => {
  const [RTCConfig, setRTCConfig] = useState({});
  const [roomID, setRoomID] = useState(getRoomID());
  const [isCapturedUserMedia, setIsCapturedUserMedia] = useState(false);
  const [localNegotiator, setLocalNegotiator] = useState(createLogin());
  const [remoteNegotiators, setRemoteNegotiators] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    const captureLocalMedia = async () => {
      console.log('Capture local media...');
      return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    };

    initRoom(roomID);

    if (!isCapturedUserMedia) {
      captureLocalMedia()
        .then((stream) => {
          setIsCapturedUserMedia(true);
          setLocalStream(stream);

    // Peer connection
    setRTCConfig({
      iceServers: [{ url: 'stun:stun.1.google.com:19302' }],
    });

    const peerConnection = new RTCPeerConnection(RTCConfig);
    console.log('RTC connection has been created.');

    peerConnection.onicecandidate = (e) => {
      console.log('onicecandidate fired.');
      if (e.candidate) {
        _.forEach(remoteNegotiators, (negotiator) => {
          send({
            type: "candidate",
            name: negotiator,
            candidate: e.candidate,
          });
        })
      }
    };
    peerConnection.onaddstream = async (e) => {
      console.log('onaddstream event fired.');
      setRemoteStreams([...remoteStreams, e.stream]);
    };

    peerConnection.addStream(stream);

    // Signaling channel
    const signalingChannel = io('http://localhost:3001');
    signalingChannel.on('connect', () => {
      send({
        type: 'login',
        name: localNegotiator,
      })
    });
    signalingChannel.on('error', console.log);
    signalingChannel.on('message', (message) => {
      const { type, name, offer, answer, candidate } = JSON.parse(message);

      switch (type) {
        case 'login':
          onLogin(name);
          break;
        case 'offer':
          onOffer(offer, name);
          break;
        case 'answer':
          onAnswer(answer);
          break;
        case 'candidate':
          onCandidate(candidate);
          break;
        default:
          break;
      }
    });

    const onLogin = async (name) => {
      if (name !== localNegotiator && !_.includes(remoteNegotiators, name)) {
        console.log('onLogin handler fired. Name:', name);
        setRemoteNegotiators([...remoteNegotiators, name]);
        peerConnection.createOffer()
          .then((offer) => {
            peerConnection.setLocalDescription(offer);
            send({
              type: 'offer',
              name,
              offer,
            });
          })
          .catch(console.log);
      }
    };

    const onOffer = async (offer, name) => {
      console.log('onOffer handler fired.');
      peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      peerConnection.createAnswer()
        .then((answer) => {
          peerConnection.setLocalDescription(answer);
          send({
            type: "answer",
            name,
            answer,
          })
        })
        .catch(console.log)
    };

    const onAnswer = async (answer) => {
      console.log('onAnswer handler fired.');
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const onCandidate = async (candidate) => {
      console.log('onCandidate handler fired.');
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const send = async (message) => {
      console.log('Send message to signaling channel: ', message);
      signalingChannel.send(JSON.stringify(message));
    };
        })
        .catch(console.log)
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
            icon="circle"
            circular
            disabled
          />
        </div>
      </div>
    </div>
  )
};

export default App;
