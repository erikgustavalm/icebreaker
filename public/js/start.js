"use strict";
const socket = io();

const vm = new Vue({
  el: "#start-site",
  data: {
    userLoggedIn: false,
    isHidden: true,
    password: "",
    username: "",
    displayMatches: false,
    registrationHidden: true,
    accountDetails: true,
    incorrectLogin: false,
    newUser: {
      username: "",
      password: "",
      email: "",
      name: "",
      age: "",
      gender: "",
      imgPath: "",
      matches: []
    },
    loggedInUser: {}
  },

  //* Why have mounted on the starting page? Well we need to know what user
  //* is online after an event is over and the user goes to the starting page again
  //* so that we can keep the user logged in
  mounted() {
    if (window.sessionStorage.getItem("roomId") != null) {
      socket.emit("requestUser", {
        username: window.sessionStorage.getItem("roomId")
      });
      socket.on(
        "getUser",
        function(user) {
          this.loggedInUser = user.data;
          this.userLoggedIn = true;
          console.log(
            this.loggedInUser.username + " is logged in on this page"
          );
        }.bind(this)
      );
    }
  },
  methods: {
    goToSite: function(link) {
      window.location.href = link;
    },
    overlay: function() {
      this.incorrectLogin = false;
      this.isHidden = false;
    },
    loginUser: function() {
      if (this.username != "" && this.password != "") {
        //* send logged in user to server
        socket.emit("loginUser", {
          username: this.username,
          password: this.password
        });
        //* we get message from server that may include the user object or not
        socket.on(
          "accountInfo",
          function(user) {
            var online = user.exists;
            if (online != false) {
              this.loggedInUser = user.data;
              this.userLoggedIn = true;
              this.isHidden = true;
              window.sessionStorage.setItem("roomId", user.data.username);
              console.log(window.sessionStorage.getItem("roomId"));
              console.log("user logged in successfully!");
            } else {
              this.incorrectLogin = true;
              this.username = "";
              this.password = "";
              console.log("user doesn't exist or is already online!");
            }
          }.bind(this)
        ); //* bind this is used so that we bind 'this' to the vue object
      }
    },
    logoutUser: function() {
      //* emit to the server that user want to log out.
      socket.emit("logoutUser", {
        username: this.loggedInUser.username
      });
      window.sessionStorage.removeItem("roomId");
      this.userLoggedIn = false;
      this.loggedInUser = {};
      console.log("user logged out successfully!");
      this.username = "";
      this.password = "";
    },
    setRegistration: function() {
      this.incorrectLogin = false;
      this.registrationHidden = false;
      console.log("sign up button clicked!");
    },
    regProfile: function() {
      if (this.inputCheckerAccount()) {
        socket.emit("isValidUsername", {
          username: this.username
        });

        socket.on("validUsername", function(validity) {
          if (validity.valid == true) {
              this.accountDetails = false;
              console.log("next button clicked!");
          } else {
            document.getElementById("username").classList.add("unfilled-entry");
          }
        }.bind(this));
      }
    },
    abort: function() {
      this.resetBorderColor();
      this.accountDetails = true;
      this.registrationHidden = true;
      this.isHidden = true;
      this.displayMatches = false;
      this.emptyUserFields();
      console.log("aborted!");
    },
    backToAccountDetails: function() {
      this.accountDetails = true;
      this.resetBorderColor("profile");
      console.log("back to account details!");
    },
    doneWithRegistration: function() {
      if (this.inputCheckerProfile()) {
        this.accountDetails = true;
        this.registrationHidden = true;
        this.isHidden = true;
        console.log("Registration successfull!");
        socket.emit('createdUser', {
          account: this.newUser,
        })
      }
    },
    resetIncorrectLogin: function() {
      this.incorrectLogin = false;
    },
    emptyUserFields: function() {
      this.username = "";
      this.password = "";
      this.newUser.username = "";
      this.newUser.password = "";
      this.newUser.email = "";
      this.newUser.name = "";
      this.newUser.age = "";
      this.newUser.gender = "";
    },
    inputCheckerAccount: function() {
      var result = true;

      if (!this.newUser.username) {
        document.getElementById("username").classList.add("unfilled-entry");
        result = false;
      }
      if (!this.newUser.password) {
        document.getElementById("password").classList.add("unfilled-entry");
        result = false;
      }
      if (!this.newUser.email) {
        document.getElementById("email").classList.add("unfilled-entry");
        result = false;
      }
      if (result == true) {
        this.resetBorderColor("account");
      }
      return result;
    },
    inputCheckerProfile: function() {
      var result = true;

      if (!this.newUser.name) {
        result = false;
        document.getElementById("name").classList.add("unfilled-entry");
      }
      if (!this.newUser.age) {
        result = false;
        document.getElementById("age").classList.add("unfilled-entry");
      }
      if (!this.newUser.gender) {
        result = false;
        document.getElementById("gender").classList.add("unfilled-entry");
      }

      if (result == true) {
        this.resetBorderColor("profile");
      }
      return result;
    },
    resetBorderColor: function(from) {
      if (from == "account") {
        document.getElementById("username").classList.remove("unfilled-entry");
        document.getElementById("password").classList.remove("unfilled-entry");
        document.getElementById("email").classList.remove("unfilled-entry");
      }
      if (from == "profile") {
        document.getElementById("name").classList.remove("unfilled-entry");
        document.getElementById("age").classList.remove("unfilled-entry");
        document.getElementById("gender").classList.remove("unfilled-entry");
      }
    },
    addPicture: function() {
      let image = document.getElementById("profile-pic");
      this.newUser.imgPath = "./img/testPic.jpeg";
      image.src = this.newUser.imgPath;
    },
    showMatches: function() {
      this.overlay();
      this.displayMatches = true;
      console.log("displaying matches!");
    },

    toggleCard: function(card, index) {
      var el = document.getElementById("card-" + index);
      if (el.classList.contains("expand")) {
        el.classList.remove("expand");
        el.childNodes[2].childNodes[4].classList.add("toggle-off");
        el.childNodes[2].childNodes[6].classList.add("toggle-off");
      } else {
        el.classList.add("expand");
        el.childNodes[2].childNodes[4].classList.remove("toggle-off");
        el.childNodes[2].childNodes[6].classList.remove("toggle-off");
      }
    }
  }
});
