//var VSlider = require('v-slider');
"use strict";
const socket = io();

window.setTimeout(
    function(){
        $('#current-date-img').fadeOut('slow');
    },10000);

const vm = new Vue({
  el: "#rate-date-container",
  data: {
    questions: ["Was your date plesant?", "Did you find your date attractive?", "Would you like to meet your date again?"],
    defaultRating: 5,
    rating: ["5","5","5","5"],
    hideImg: false,
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
    fadeImg: function() {
      var img = document.getElementById("current-date-img");
      img.style.display = "none";
      this.hideImg = true;
    },
*/
    submitRating: function(event){
        console.log(this.rating);
    }
  }
});
