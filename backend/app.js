const express  = require('express'),
      http     = require('http'),
      ws       = require('ws'),
      _        = require('lodash');

const app = express();

const server = http.createServer(app);
server.listen(3001);

const wsServer = new ws.Server({ server, path: '/ws/' });
let users = {};

wsServer.on('connection', function(connection) {
   console.log("User connected");

   connection.on('message', (message) => {

      let data = parseMessage(message);
      let { type, room, login, offer, answer, candidate } = data;
      let conn = users[login];

      switch (type) {

         case "login":

            if(users[login]) {
               sendTo(connection, {
                  type: "login",
                  login,
                  success: false
               });
            } else {
               users[login] = connection;
               connection.login = login;
               sendTo(connection, {
                  type: "login",
                  login,
                  success: true
               });
               console.log("User logged", login);
            };

            break;

         case 'join-room':
            conn.room = room;
            joinRoom(room, login);
            break;

         case "offer":
            console.log("Sending offer to: ", login);

            if (conn !== null) {
               sendTo(conn, {
                  type: "offer",
                  offer,
                  login,
               });
            };

            break;

         case "answer":
            console.log("Sending answer to: ", login);

            if(conn !== null) {
               sendTo(conn, {
                  type: "answer",
                  answer,
                  login,
               });
            };

            break;

         case "candidate":
            console.log(`Sending candidate to ${login}`);
            if (conn !== null) {
               sendTo(conn, {
                  type: "candidate",
                  candidate,
               });
            };

            break;

         case "logout":
            leaveRoom(room, login);
            break;

         default:
            console.log('Unknown:', data);
            sendTo(connection, {
               type: "error",
               message: "Command not found: " + type
            });
            break;
      }
   });

   connection.on("close", () => {
      const { login, room } = connection;

      leaveRoom(room, login);
      console.log(`Disconnecting from ${login}.`);
   });

   connection.send(JSON.stringify({status: "success"}));

});

// Room: high-level methods

function joinRoom(room, initiator) {
   console.log(`User ${initiator} is joining to ${room}.`);
   let conn = users[initiator];
   conn.room = room;

   notifyRoom(room, {
      type: "join-room",
      login: initiator,
   });

   _.forEach(
      getAllRemoteParticipants(room, initiator),
      (participant) => sendTo(conn, {
         type: "join-room",
         login: participant.login,
      })
   );
};

function leaveRoom(room, initiator) {
   notifyRoom(room, {
      type: "logout",
      login: initiator,
   });
   delete users[initiator];
};

// Room: low-level methods

function notifyRoom(room, message) {
   const { login:initiator } = message;
   const participants = initiator
      ? getAllRemoteParticipants(room, initiator)
      : getAllParticipants(room);

   _.forEach(
      participants,
      (participant) => sendTo(participant, message)
   );
};

function getAllParticipants(room) {
   return _.filter(users, (user) => user.room === room);
};

function getAllRemoteParticipants(room, initiator) {
   return _.filter(
      getAllParticipants(room),
      (user) => user.login !== initiator
   );
};

// Server: low-level methods

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

function sendTo(connection, message) {
   connection.send(JSON.stringify(message));
};
