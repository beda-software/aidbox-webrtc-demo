const express  = require('express'),
      http     = require('http'),
      ws       = require('ws'),
      _        = require('lodash');

const app = express();

const server = http.createServer(app);
server.listen(3001);

const wsServer = new ws.Server({ server, path: '/ws' });

var users = {};

wsServer.on('connection', function(connection) {
   console.log("User connected");

   connection.on('message', function(message) {

      var data;
      //accepting only JSON messages
      try {
         data = JSON.parse(message);
      } catch (e) {
         console.log("Invalid JSON");
         data = {};
      }

      // Destruct if success
      const { type, room, name, offer, answer, candidate } = data;

      //switching type of the user message
      switch (type) {
         //when a user tries to login

         case "login":
            //if anyone is logged in with this username then refuse

            if(users[name]) {
               sendTo(connection, {
                  type: "login",
                  name: name,
                  success: false
               });
            } else {
               //save user connection on the server
               users[name] = connection;
               connection.name = name;
               connection.room = room;

               _.mapValues(
                  _.filter(users, (connection) => connection.room === room),
                  (connection) =>
                  sendTo(connection, {
                     type: "login",
                     name,
                     success: true
                  })
               );

               console.log("User logged", name);
            }

            break;

         case "offer":
            //for ex. UserA wants to call UserB
            console.log("Sending offer to: ", name);

            //if UserB exists then send him offer details
            var conn = users[name];

            if (conn != null) {
               //setting that UserA connected with UserB
               connection.otherName = name;

               sendTo(conn, {
                  type: "offer",
                  offer: offer,
                  name: connection.name
               });
            }

            break;

         case "answer":
            console.log("Sending answer to: ", name);
            //for ex. UserB answers UserA
            var conn = users[name];

            if(conn != null) {
               connection.otherName = name;
               sendTo(conn, {
                  type: "answer",
                  answer: answer,
                  name: connection.name,
               });
            }

            break;

         case "candidate":
            console.log(`Sending candidate to ${name}`);
            // TODO: why I use connection instead conn?
            var conn = users[name];
            sendTo(conn, {
               type: "candidate",
               candidate: candidate
            });

            break;

         case "leave":
            console.log("Disconnecting from", name);
            var conn = users[name];
            conn.otherName = null;

            //notify the other user so he can disconnect his peer connection
            if(conn != null) {
               sendTo(conn, {
                  type: "leave"
               });
            }

            break;

         case "checking":
            var conn = users[name];

            if (room) {
               console.log(`Checking for room '${room}...'`);
               const isExistRoom = !!_.find(users, {room});
               console.log(`Is exist room? ${isExistRoom}`);
               sendTo(conn, {
                  type: "checking",
                  room,
                  status: isExistRoom,
                  name,
               });
            }
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

   connection.on("close", function() {

      if(connection.name) {
      delete users[connection.name];

         if(connection.otherName) {
            console.log("Disconnecting from ", connection.otherName);
            var conn = users[connection.otherName];
            conn.otherName = null;

            if(conn != null) {
               sendTo(conn, {
                  type: "leave"
               });
            }
         }
      }
   });

   connection.send(JSON.stringify({status: "success"}));

});

function sendTo(connection, message) {
   connection.send(JSON.stringify(message));
}
