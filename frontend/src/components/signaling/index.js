import React, { useState, useEffect } from 'react';
import useBus, { dispatch as emit } from 'use-bus';


const socket = new WebSocket(
  process.env.REACT_APP_BACKEND_BASE_URL ||
  "ws://localhost:3001/ws/"
);

export default () => {
  const [channel,    setChannel]    = useState(socket);

  const [login,      setLogin]      = useState(null);
  const [joinRoom,   setJoinRoom]   = useState(null);
  const [logout,     setLogout]     = useState(null);

  const [waitOffer,  setWaitOffer]  = useState(null);
  const [offer,      setOffer]      = useState(null);
  const [answer,     setAnswer]     = useState(null);
  const [candidate,  setCandidate]  = useState(null);

  useBus("login",      send);
  useBus("join-room",  send);
  useBus("logout",     send);

  useBus("wait-offer", send);
  useBus("offer",      send);
  useBus("answer",     send);
  useBus("candidate",  send);

  useEffect(() => {
    if (login) {
      emit({
        ...login,
        type: "response-login",
      });
    };
  }, [login]);

  useEffect(() => {
    if (joinRoom) {
      emit({
        ...joinRoom,
        type: "response-join-room",
      });
    };
  }, [joinRoom]);

  useEffect(() => {
    if (logout) {
      emit({
        ...logout,
        type: "response-logout",
      });
    };
  }, [logout]);

  useEffect(() => {
    if (waitOffer) {
      emit({
        ...waitOffer,
        type: "response-wait-offer",
      });
    };
  }, [waitOffer]);

  useEffect(() => {
    if (offer) {
      emit({
        ...offer,
        type: "response-offer",
      });
    };
  }, [offer]);

  useEffect(() => {
    if (answer) {
      emit({
        ...answer,
        type: "response-answer",
      });
    };
  }, [answer]);

  useEffect(() => {
    if (candidate) {
      emit({
        ...candidate,
        type: "response-candidate",
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
      case "wait-offer":
        setWaitOffer(message);
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
    channel.send(JSON.stringify(message));
  };

  return null;
}
