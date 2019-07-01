import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import 'semantic-ui-css/semantic.min.css';
import  { Loader, Button, Icon } from 'semantic-ui-react';

import './App.css';

const App = () => {
  const socket = io('http://localhost:3001');

  const [receivedUserMedia, setReceivedUserMedia] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    if (!receivedUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      }).then((localStream) => {
        setReceivedUserMedia(true);
        setLocalStream(localStream);
      })
    }
  });

  return (
    <div className="App">
      <div className="App-chat">
        <div className="App-chat-main">
          {localStream ? (
            <video
              ref={(video) => video.srcObject = localStream}
              autoPlay
            />
          ) : (
            <Loader active />
          )}
        </div>
        <div className="App-chat-controls">
          <Button
            content="Пригласить в чат"
            labelPosition="left"
            color="green"
            icon="share alternate"
          />
        </div>
      </div>
    </div>
  )
};

export default App;
