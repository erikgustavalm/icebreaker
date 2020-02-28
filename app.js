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

Data.prototype.getAccount = function(username, password) {
  for (var i = 0; i < this.accounts.length; i++) {
    if (
      this.accounts[i].username == username &&
      this.accounts[i].password == password
    ) {
      return this.accounts[i];
    }
  }
  return null;
};

//* set up the accounts var with all the initial accounts from json file.
//* now we can use the methods created for the Data class
const accounts = new Data();


//! SOCKET.IO SERVER CODE HERE

io.on("connection", function(socket) {
  socket.on("loginUser", function(info) {
    var user = accounts.getAccount(info.username, info.password);
    var exists = false;
    if (user != null && user.loggedIn != true) {
      exists = true;
      user.loggedIn = true;
    }
    socket.emit("accountInfo", {
      exists: exists,
      data: user
    });
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
