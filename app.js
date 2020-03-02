"use strict";

// Require express, socket.io, and vue
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const initialAccounts = require("./public/js/accounts_json.js").totalAccounts;

// Pick arbitrary port for server
const port = 3000;
app.set("port", process.env.PORT || port);

// Serve static assets from public/
app.use(express.static(path.join(__dirname, "public/")));
// Serve vue from node_modules as vue/
app.use(
  "/vue",
  express.static(path.join(__dirname, "/node_modules/vue/dist/"))
);
// Serve index.html directly as root page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//!  data (accounts) set up code here and methods for Data class

//* will contain all accounts registered to the app
function Data() {
  this.accounts = [];
}

Data.prototype.addAccount = function(account) {
  this.accounts.push(account);
};

Data.prototype.size = function() {
  return this.accounts.length;
};

Data.prototype.getAllAccounts = function() {
  return this.accounts;
};

Data.prototype.getAccount = function(username) {
  for (var i = 0; i < this.accounts.length; i++) {
    if (this.accounts[i].username == username) {
      return this.accounts[i];
    }
  }
  return null;
};

Data.prototype.removeAccount = function(username) {
  const index = this.accounts.indexOf(username);
  if (index > -1) {
    this.accounts.splice(index, 1);
  }
};
//* set up the accounts var with all the initial accounts from json file.
//* now we can use the methods created for the Data class
const accounts = new Data();

//! The event obj array and methods to operate on the event obj go here

let events = new Array();

Array.prototype.addEvent = function(event) {
  events.push(event);
};

Array.prototype.getEvent = function(eventID) {
  for (let event in events) {
    if (event.eventID === eventID) {
      console.log(event);
      return event;
    }
  }
  return null;
};
Array.prototype.nextRound = function(eventID) {
  let event = events.getEvent(eventID);
  event.round++;
};
Array.prototype.eventIsFull = function(eventID) {
  let event = events.getEvent(eventID);
  if (event.max == event.attended) {
    event.eventIsFull = true;
  } else {
    event.eventIsFull = false;
  }
};
Array.prototype.addAttendant = function(eventID) {
  let event = events.getEvent(eventID);
  event.attended++;
};

Array.prototype.addUsers = function(eventID, userArray) {
  let event = events.getEvent(eventID);
  event.users = userArray;
};
Array.prototype.addMatches = function(eventID, usersMatched) {
  let event = events.getEvent(eventID);
  event.usersMatched = usersMatched;
};

//! SOCKET.IO SERVER CODE HERE

//* will contain all room id's for each logged in user
//* You can send a request to specific users online by using the room ID in
//* this array, (room ID == username) for example like this:
//* io.to(roomID).emit('msg', {data})..
var roomSessions = [];

//* newEvent is sent by submitting the final form before entering
//* This initializes the event with baseline values that must be updated
//* by the manager. E.g starting a session would update seats & usersMatched and send these values
//* to the right destinations could change at any time
//* stores all events in an array
io.on("connection", function(socket) {
  socket.on("newEvent", function(currentSession) {
    let event = {
      eventID: currentSession.eventID,
      users: [], // array of all users defined in the JSON file. Manager could add these during mount for our bots. Joining a room also adds it
      session: currentSession.session, //contains room name, questions and quotes.
      max: 20,
      attended: 20, //starts at 20 because of our bots? Else manager should send attended count.
      tables: [], //seats should be updated by manager only when done, no need to update it on every drag
      round: 0,
      usersMatched: [], //array of [[2],[2]..] arrays, where the [2] array contains 2 users.
      //Should probably be created in manager and sent through emit
      eventIsFull: true
    };
    events.addEvent(event);
  });
  socket.on("requestEvent", function(eventID) {
    let event = events.getEvent(eventID.eventID);
    socket.join(eventID.eventID);
    if (eventID.eventID != null) {
      io.to(eventID.eventID).emit("getEvent", {
        event: eventID.eventID
      });
    }
  });

  //* 'loginUser' is sent by starting page when a user tries to log in
  socket.on("loginUser", function(info) {
    var user = null;
    var allAccounts = accounts.getAllAccounts();
    for (var i = 0; i < allAccounts.length; i++) {
      if (
        allAccounts[i].username == info.username &&
        allAccounts[i].password == info.password
      ) {
        user = allAccounts[i];
      }
    }
    var exists = false;
    //* user was found..
    if (user != null && user.loggedIn != true) {
      exists = true;
      //* change user account status to logged in
      user.loggedIn = true;

      //* each user logged in creates it's own room channel
      //* to be used for user specific emits
      socket.room = info.username;
      socket.join(socket.room);

      //* each created room is added to roomSessions
      roomSessions.push(socket.room);

      console.log(info.username + " successfully logged in!");
      console.log("All created rooms: ");
      console.log(roomSessions);
    }
    //* Send back the account info to the user who sent 'loginUser' request
    if (exists == true) {
      //* successfull login - send right account info
      io.to(socket.room).emit("accountInfo", {
        exists: exists,
        data: user
      });
    } else {
      //* unsuccessfull login - send back false
      socket.emit("accountInfo", {
        exists: exists,
        data: user
      });
    }
  });

  //* used for getting user info from username (since username is unique)
  //! important - requestUser only used for USER pages and not HOST
  //* also subscribes the socket to the room attached to that user since
  //* this request should only hapen from pages that has a user logged in
  //* and should be requested in the created() part of the pages vue object
  socket.on("requestUser", function(user) {
    var account = accounts.getAccount(user.username);
    //* socket connected who sent 'requestUser' will be attached to the room
    //* with the room id of username
    socket.join(account.username);
    if (account.username != null) {
      //* only emit to specific room channel
      //* we will do this aswell in HOST backend when sending to specific
      io.to(account.username).emit("getUser", {
        data: account
      });
    }
  });

  //* When user wants to log out we remove room id from roomSessions and
  //* set online status to false in accounts
  socket.on("logoutUser", function(user) {
    var account = accounts.getAccount(user.username);

    const index = roomSessions.indexOf(account.username);
    if (index > -1) {
      roomSessions.splice(index, 1);
    }
    account.loggedIn = false;
    console.log(user.username + " successfully logged out!");
    console.log("All created rooms: ");
    console.log(roomSessions);
  });
});

/* eslint-disable-next-line no-unused-vars */
const server = http.listen(app.get("port"), function() {
  console.log("Server listening on port " + app.get("port"));

  //* add all initial accounts from json file to our accounts variable
  for (var i = 0; i < initialAccounts.length; i++) {
    accounts.addAccount(initialAccounts[i]);
  }
});
