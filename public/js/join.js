"use strict";
const socket = io();

const vm = new Vue({
  el: "#join-room-container",
  data: {
    roomKey: "Enter room key:",
    enteredKey: "", //eventID
    loggedInUser: {}
  },
  mounted() {
    console.log(window.sessionStorage.getItem("roomId"));
    socket.emit("requestUser", {
      username: window.sessionStorage.getItem("roomId")
    });
    socket.on(
      "getUser",
      function(user) {
        this.loggedInUser = user.data;
        console.log(this.loggedInUser.username + " is logged in on this page");
      }.bind(this)
    );
  },
  methods: {
    joinRoom: function() {
      socket.emit("joinEvent", {
        user: this.loggedInUser,
        eventID: this.enteredKey
      });
      socket.on(
        "userJoined",
        function(data) {
          window.sessionStorage.setItem("eventID", data.eventID);
          console.log(data.eventID);
          this.goToSite("../user/user_question_screen.html");
        }.bind(this)
      );
    },
    goToSite: function(link) {
      window.location.href = link;
    }
  }
});
