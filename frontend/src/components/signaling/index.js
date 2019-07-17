import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';


const socket = new WebSocket(
  process.env.REACT_APP_BACKEND_BASE_URL ||
  "ws://localhost:3001/ws/"
);

export default () => {
  const [channel,   setChannel]   = useState(socket);

  const [login,     setLogin]     = useState(null);
  const [joinRoom,  setJoinRoom]  = useState(null);
  const [logout,    setLogout]    = useState(null);

  const [offer,     setOffer]     = useState(null);
  const [answer,    setAnswer]    = useState(null);
  const [candidate, setCandidate] = useState(null);

  useBus("login",     send);
  useBus("join-room", send);
  useBus("logout",    send);

  useBus("offer",     send);
  useBus("answer",    send);
  useBus("candidate", send);

  useEffect(() => {
    if (login) {
      emit({ type: "response-login", response: login });
    };
  }, [login]);

  useEffect(() => {
    if (joinRoom) {
      emit({
        type: "response-join-room",
        response: joinRoom,
      });
    };
  }, [joinRoom]);

  useEffect(() => {
    if (logout) {
      emit({
        type: "response-logout",
        response: logout,
      });
    };
  }, [logout]);

  useEffect(() => {
    if (offer) {
      emit({
        type: "transfer-offer",
        response: offer,
        login,
      });
    };
  }, [offer]);

  useEffect(() => {
    if (answer) {
      emit({
        type: "transfer-answer",
        response: answer,
        login,
      });
    };
  }, [answer]);

  useEffect(() => {
    if (candidate) {
      emit({
        type: "transfer-candidate",
        response: candidate,
        login,
      });
    };
  }, [candidate]);

  useEffect(() => {
    channel.addEventListener("message", transferMessage);
  }, []);

  function transferMessage({ data }) {
    const message = parseMessage(data);

    switch(message.type) {
      case "login":
        setLogin(message);
        break;
      case "join-room":
        setJoinRoom(message);
        break;
      case "logout":
        setLogout(message);
        break;
      case "offer":
        setOffer(message);
        break;
      case "answer":
        setAnswer(message);
        break;
      case "candidate":
        setCandidate(message);
        break;
      default:
        break;
    };
  };

  function parseMessage(message) {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log("Invalid JSON");
      data = {};
    }
    return data;
  };

  function send(message) {
    console.log("TCL: send -> message", message)
    channel.send(JSON.stringify(message));
  };

  return null;
}
