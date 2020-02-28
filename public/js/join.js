"use strict";
const socket = io();

const vm = new Vue({
  el: "#join-room-container",
  data: {
    roomKey: "Enter room key:",
    enteredKey: "",
    loggedInUser: {},
    
  },
  mounted(){
    console.log(window.sessionStorage.getItem('roomId'));
    socket.emit('requestUser', {
      username: window.sessionStorage.getItem('roomId'),
    });
    socket.on('getUser', function(user){
      this.loggedInUser = user.data;
      console.log(this.loggedInUser.username + " is logged in on this page");
    }.bind(this));
  },
  methods: {
    goToSite: function(link) {
        window.location.href = link;
    }
  }
});
