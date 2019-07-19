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
      let { type, room, from, to, login, offer, answer, candidate } = data;
      const receiver = login || to;
      let conn = users[receiver];

      switch (type) {

         case "login":

            if(users[login]) {
               sendTo(connection, {
                  type: "login",
                  login,
                  success: false
               });
               console.log(`User ${login} exists already`);
            } else {
               users[login] = connection;
               connection.login = login;
               sendTo(connection, {
                  type: "login",
                  login,
                  success: true
               });
               console.log(`User logged ${login}`);
            };

            break;

         case "join-room":
            conn.room = room;
            joinRoom(room, login);
            break;

         case "offer":
            console.log(`Sending offer to: ${to}`);

            if (conn !== null) {
               sendTo(conn, {
                  type: "offer",
                  offer,
                  from,
                  to,
               });
            };

            break;

         case "answer":
            console.log(`Sending answer to: ${to}`);

            if(conn !== null) {
               sendTo(conn, {
                  type: "answer",
                  answer,
                  from,
                  to,
               });
            };

            break;

         case "candidate":
            console.log(`Sending candidate to ${to}`);
            if (conn !== null) {
               sendTo(conn, {
                  type: "candidate",
                  candidate,
                  from,
                  to,
               });
            };

            break;

         case "logout":
            leaveRoom(room, login);
            break;

         default:
            console.log(`Unknown: ${data}`);
            sendTo(connection, {
               type: "error",
               message: `Command not found: ${type}`,
            });
            break;
      }
   });

   connection.on("close", () => {
      const { login, room } = connection;

      leaveRoom(room, login);
      console.log(`Disconnecting from ${login}.`);
   });
});

// Room: high-level methods

function joinRoom(room, login) {
   console.log(`User ${login} is joining to ${room}.`);
   let conn = users[login];
   conn.room = room;

   // Notify room about new participant
   notifyRoom(room, {
      type: "join-room",
      login,
   });

   // Send signal by participants about ready for receiving RTC offer
   _.forEach(
      getAllRemoteParticipants(room, login),
      (participant) => sendTo(conn, {
         type: "wait-offer",
         login: participant.login,
      })
   );
};

function leaveRoom(room, login) {
   notifyRoom(room, {
      type: "logout",
      login,
   });
   delete users[login];
};

// Room: low-level methods

function notifyRoom(room, message) {
   const { login } = message;
   const participants = getAllRemoteParticipants(room, login);

   _.forEach(
      participants,
      (participant) => sendTo(participant, message)
   );
};

function getAllParticipants(room) {
   return _.filter(users, (user) => user.room === room);
};

function getAllRemoteParticipants(room, login) {
   return _.filter(
      getAllParticipants(room),
      (user) => user.login !== login
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
