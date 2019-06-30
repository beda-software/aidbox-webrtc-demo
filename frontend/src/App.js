import React from 'react';
import io from 'socket.io-client';

import logo from './logo.svg';
import './App.css';

const App = () => {
  const socket = io('http://localhost:3001');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  )
};

export default App;
