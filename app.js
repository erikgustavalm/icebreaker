"use strict";

// Require express, socket.io, and vue
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");
const initialAccounts = require("./public/js/accounts_json.js").totalAccounts;
const initialQuestions = require("./public/js/sample_questions.js")
  .predefinedQuestions;
const initialIcebreakers = require("./public/js/icebreakers.js")
  .initIcebreakers;

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
  for (let event of events) {
    if (event.eventID === eventID) {
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

Array.prototype.addUser = function(eventID, user) {
  let event = events.getEvent(eventID);
  event.users.push(user);
  event.attended++;
};
Array.prototype.addMatchingPair = function(eventID, matchedPair) {
  let event = events.getEvent(eventID);
  event.usersMatched.push(matchedPair);
};
Array.prototype.addAnswers = function(eventID, answers) {
  let event = events.getEvent(eventID);
  event.questionAnswers.push(answers);
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
      users: [], // array of 19 users defined in the JSON file. Manager could add these during mount for our bots. Joining a room also adds it
      questions: [],
      icebreakers: [],
      questionAnswers: [],
      max: 20,
      attended: 19, //starts at 20 because of our bots? Else manager should send attended count.
      tables: [], //seats should be updated by manager only when done, no need to update it on every drag
      round: 0,
      usersMatched: [], //array of [[2],[2]..] arrays, where the [2] array contains 2 users.
      //Should probably be created in manager and sent through emit
      startTimer: false,
      eventIsFull: false
    };

    var bots = accounts.accounts;
    //initialize bots for the event
    for (let i = 0; i < 19; i++) {
      event.users.push(bots[i]);
    }

    //initial questions for event
    for (let i = 0; i < initialQuestions.length; i++) {
      event.questions.push(initialQuestions[i]);
    }
    for (let i = 0; i < currentSession.questions.length; i++) {
      const element = currentSession.questions[i];
      event.questions.push({ question: currentSession.questions[i] });
    }

    for (let i = 0; i < initialIcebreakers.length; i++) {
      event.icebreakers.push(initialIcebreakers[i]);
    }

    for (let i = 0; i < currentSession.quotes.length; i++) {
      event.icebreakers.push(currentSession.quotes[i]);
    }

    events.addEvent(event);
    console.log(events.getEvent(event.eventID));
  });

  //* start date timer
  socket.on("startDateTimer", function(data) {
    console.log("in timer!");
    io.emit("startTimer", {});
  });
  //* send the questionaire to answer for the event
  socket.on("requestQuestions", function(data) {
    let event = events.getEvent(data.eventID);
    io.to(data.roomId).emit("sendQuestions", {
      questions: event.questions
    });
  });

  //*send correct date to dating screen
  socket.on("requestDate", function(data) {
    let event = events.getEvent(data.eventID);
    let matchedPairs = event.tables;
    for (let i = 0; i < matchedPairs.length; i++) {
      const userRoom1 = matchedPairs[i].seat1.username;
      const userRoom2 = matchedPairs[i].seat2.username;
      console.log(userRoom1);
      console.log(userRoom2);
      io.to(userRoom1).emit("yourDate", {
        seat: matchedPairs[i]
      });
      io.to(userRoom2).emit("yourDate", {
        seat: matchedPairs[i]
      });
    }
  });
  //* send the icebreakers to show whilst waiting
  socket.on("requestIcebreakers", function(data) {
    let event = events.getEvent(data.eventID);
    io.to(data.roomId).emit("sendIcebreakers", {
      icebreakers: event.icebreakers
    });
  });

  socket.on("sendAnswers", function(data) {
    let event = events.getEvent(data.eventID);
    let user = accounts.getAccount(data.user);
    let newAnswers = data.answers;
    for (let i = 0; i < data.answers.length; i++) {
      user.answers.push(newAnswers[i]);
    }
    let id = event.users.length - 1;
    let userId = "user" + id;
    user.id = userId;

    socket.to(event.eventID).emit("onUserJoin", { user: user });
  });

  //* let user join an exisiting event if attended <
  //TODO Need to add error handling if event is full
  socket.on("joinEvent", function(data) {
    let event = events.getEvent(data.eventID);
    let user = data.user;
    let hasJoined = false;
    if (event.attended < event.max) {
      events.addUser(event.eventID, user);
      hasJoined = true;
      console.log(event);
      // let id = event.users.length - 1;
      // let userId = "user" + id;
      // user.id = userId;
      // socket.to(event.eventID).emit("onUserJoin", {user:user});
    }

    io.to(user.username).emit("userJoined", {
      eventID: event.eventID,
      joined: hasJoined
    });
  });

  //* get the event ID of event and send it back
  socket.on("requestEvent", function(eventID) {
    let event = events.getEvent(eventID.eventID);

    socket.join(eventID.eventID);
    if (eventID.eventID != null) {
      io.to(eventID.eventID).emit("getEvent", {
        event: event
      });
    }
  });

  socket.on("sendMatchedPairs", function(data) {
    let event = events.getEvent(data.eventID);
    let matchedPairs = data.matchedPairs;
    event.tables = matchedPairs;

    for (let i = 0; i < matchedPairs.length; i++) {
      const userRoom1 = matchedPairs[i].seat1.username;
      const userRoom2 = matchedPairs[i].seat2.username;

      socket.to(userRoom1).emit("yourDate", {
        seat: matchedPairs[i]
      });
      socket.to(userRoom2).emit("yourDate", {
        seat: matchedPairs[i]
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

  //* checks username validity
  socket.on("isValidUsername", function(username) {
    if (accounts.getAccount(username.username) == null) {
      socket.emit("validUsername", {
        valid: true
      });
    } else {
      socket.emit("validUsername", {
        valid: false
      });
    }
  });

  socket.on("createdUser", function(acc) {
    accounts.addAccount(acc.account);
    console.log("Created a new account:");
    console.log(acc.account.picture);
    fs.writeFile(
      "public/uploads/profile_pictures/" + acc.account.username + ".jpeg",
      acc.account.picture,
      { encoding: "binary" },
      function(error) {
        console.log(error);
      }
    );
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
