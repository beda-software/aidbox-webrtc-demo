import _ from 'lodash';

import React, { useState, useEffect } from 'react';

import { createLogin } from './components/room';

import { SafeAreaView, View, TextInput } from 'react-native';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices
} from 'react-native-webrtc';

import {PermissionsAndroid} from 'react-native';

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      return true;
    } else {
      console.log('Camera permission denied');
      return false;
    }
  } catch (err) {
    console.err(err);
  }
}

import s from './style';

const App = () => {
  const [RTCConfig, setRTCConfig] = useState({
    iceServers: [{ url: 'stun:stun.1.google.com:19302' }],
  });
  const [roomID, setRoomID] = useState(null);
  const [localParticipant, setLocalParticipant] = useState(createLogin());
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  // Signaling channel
  const signalingChannel = new WebSocket('wss://webrtc.beda.software/ws/');
  console.log(signalingChannel);

  useEffect(() => {
    const captureLocalMedia = async () => {
      return mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    };

    const startChat = async () => {
      const stream = await captureLocalMedia();
      const isGranted = await requestCameraPermission();
      if (!isGranted) {
        return;
      };

      setLocalStream(stream);
      console.log("localParticipant", localParticipant);

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

      signalingChannel.addEventListener('open', () => {
        console.log('Connection established');
        send({ type: 'login', name: localParticipant, room: roomID });
      });

      signalingChannel.addEventListener('message', (event) => {
        const { data:message } = event;
        const { type, name, offer, answer, candidate, roomID, status } = JSON.parse(message);
        console.log('Got message ', JSON.parse(message));

        switch (type) {
          case 'login':
            onLogin(name);
            console.log('onLogin fired.');
            break;
          case 'offer':
            onOffer(offer, name);
            console.log('onOffer fired.');
            break;
          case 'answer':
            onAnswer(answer);
            console.log('onAnswer fired.');
            break;
          case 'candidate':
            onCandidate(candidate);
            console.log('onCandidate fired.');
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

  const joinToChat = (text) => send({
    type: "checking",
    name: localParticipant,
    room: text
  });

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
