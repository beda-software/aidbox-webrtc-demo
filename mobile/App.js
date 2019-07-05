import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { createLogin } from './components/room';

import { SafeAreaView, View, TextInput } from 'react-native';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices
} from 'react-native-webrtc';

import s from './style';

const App = () => {
  const [RTCConfig, setRTCConfig] = useState({});
  const [roomID, setRoomID] = useState(null);
  const [localParticipant, setLocalParticipant] = useState(createLogin());
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  // Signaling channel
  const signalingChannel = io('http://localhost:3001');

  useEffect(() => {
    const captureLocalMedia = async () => {
      return mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    };

    const startChat = async () => {
      const stream = await captureLocalMedia();
      setLocalStream(stream);

      // Peer connection
      setRTCConfig({
        iceServers: [{ url: 'stun:stun.1.google.com:19302' }],
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

      signalingChannel.on('connect', () => {
        send({ type: 'login', name: localParticipant, room: roomID })
      });
      signalingChannel.on('error', console.error);
      signalingChannel.on('message', (message) => {
        console.log('message', message);
        const { type, name, offer, answer, candidate, roomID, status } = JSON.parse(message);

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
          case 'checking':
            onChecking(roomID, status)
            console.log('onChecking fired.');
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

      const onChecking = (roomID, status) => {
        if (status === 'success') {
          setRoomID(roomID);
          console.log('roomID: ', roomID);
        }
      };
    }
    startChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = (message) => {
    console.log('Send message...', JSON.stringify(message));
    signalingChannel.send(JSON.stringify(message));
  };

  const joinToChat = (text) => send({ type: "checking", room: text });

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={s.container}>
        <TextInput
          onChangeText={_.debounce(joinToChat, 500)}
          autoCapitalize="none"
          autoFocus
          placeholder="Enter room ID here..."
          style={s.input}
        />
        {localStream && _.map(
          [localStream, ...remoteStreams],
          (stream, i) => (
            <RTCView
              style={s.rtcView}
              streamURL={stream.id}
              key={i}
            />
          )
        )}
      </View>
    </SafeAreaView>
  )
};

export default App;
