var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

server.listen(3001);

var users = {};

io.on('connection', function(connection) {
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
      const { type, name, offer, answer, candidate } = data;

      //switching type of the user message
      switch (data.type) {
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

               // TODO: restrict mapping within current room
               _.mapValues(users, (connection) => {
                  sendTo(connection, {
                     type: "login",
                     name: name,
                     success: true
                  });
               })

               console.log("User logged", name);
            }

            break;

         case "offer":
            //for ex. UserA wants to call UserB
            console.log("Sending offer to: ", name);

            //if UserB exists then send him offer details
            var conn = users[name];

            if(conn != null) {
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
            var conn = users[name];
            sendTo(connection, {
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
