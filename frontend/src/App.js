import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import copy from 'copy-text-to-clipboard';

import Video from './components/video';
import { createLogin, getRoomID, initRoom } from './utils';

import 'semantic-ui-css/semantic.min.css';
import  { Button } from 'semantic-ui-react';

import './App.css';

// TODO: reorganize logic into one external hook (learn React tutorials)
const App = () => {
  // TODO: look around organize state (like single object or current view)
  const [RTCConfig, setRTCConfig] = useState({});
  const [roomID, setRoomID] = useState(getRoomID());
  const [localParticipant, setLocalParticipant] = useState(createLogin());
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    const captureLocalMedia = async () => {
      return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    };

    const startChat = async () => {
      initRoom(roomID);

      const stream = await captureLocalMedia();
      setLocalStream(stream);

      // Peer connection
      setRTCConfig({
        iceServers: [
    	    {
            url: 'turn:82.202.236.141:3478',
            credential: 'tah8uaP1',
            username: 'turnuser',
          },
          {
            url: 'stun:stun.1.google.com:19302',
          },
	      ],
      });

      const peerConnection = new RTCPeerConnection(RTCConfig);

      peerConnection.addEventListener('icecandidate', (e) => {
        if (e.candidate && peerConnection.canTrickleIceCandidates) {
          _.forEach(remoteParticipants, (participant) => {
            send({
              type: "candidate",
              name: participant,
              candidate: e.candidate,
            });
          })
        }
      });

      peerConnection.addEventListener('addstream', (e) => {
        setRemoteStreams([...remoteStreams, e.stream]);
      });

      peerConnection.addStream(stream);

      // Signaling channel
      const signalingChannel = new WebSocket(process.env.REACT_APP_LOCAL_ADDRESS);
      signalingChannel.addEventListener('open', () => {
        send({ type: 'login', name: localParticipant });
        send({ type: 'join-room', name: localParticipant, room: roomID });
      });
      signalingChannel.addEventListener('error', console.error);
      signalingChannel.addEventListener('message', (event) => {
        const { data:message } = event;
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
        if (name !== localParticipant && !_.includes(remoteParticipants, name)) {
          setRemoteParticipants([...remoteParticipants, name]);
          const offer = await peerConnection.createOffer();
          peerConnection.setLocalDescription(offer);
          send({ type: 'offer', name, offer });
        }
      };

      const onOffer = async (offer, name) => {
        if (!_.includes(remoteParticipants, name)) {
          setRemoteParticipants([...remoteParticipants, name]);
        }

        await peerConnection.setRemoteDescription(offer)
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer);

        if (peerConnection.canTrickleIceCandidates) {
          return peerConnection.localDescription;
        }

        peerConnection.addEventListener('icegatheringstatechange', async (e) => {
          if (e.target.iceGatheringState === 'complete') {
            const answer = await peerConnection.localDescription;
            send({ type: 'answer', name, answer });
          }
        })
      };

      const onAnswer = (answer) => {
        peerConnection.setRemoteDescription(answer);
      };

      const onCandidate = (candidate) => {
        peerConnection.addIceCandidate(candidate);
      };

      const send = (message) => {
        signalingChannel.send(JSON.stringify(message));
      };
    }
    startChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <div className="chat">
        <div className="chat-main">
          <div className="chat-videos">
            {_.map(
              [localStream, ...remoteStreams],
              (stream, i) => (
                <Video
                  stream={stream}
                  key={i}
                  width="95%"
                  height="100%"
                />
              )
            )}
          </div>
        </div>
        <div className="chat-controls">
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
