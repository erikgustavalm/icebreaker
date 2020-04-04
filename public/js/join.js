"use strict";
const socket = io();

const vm = new Vue({
  el: "#join-room-container",
  data: {
    roomKey: "Enter room key:",
    enteredKey: "", //eventID
    loggedInUser: {},
    error: false,
    errorMessage: "",
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
      this.error = false;
      this.errorMessage = "";

      socket.emit("joinEvent", {
        user: this.loggedInUser,
        eventID: this.enteredKey
      });
      socket.on(
        "userJoined",
        function(data) {
          if(data.joined == false){
            this.error = true;
            this.errorMessage = data.error;
            console.log(data.error);
          }else{
            window.sessionStorage.setItem("eventID", data.eventID);
            console.log(data.eventID);
            this.goToSite("../user/user_question_screen.html");
          }

        }.bind(this)
      );
    },
    goToSite: function(link) {
      window.location.href = link;
    }
  }
});
