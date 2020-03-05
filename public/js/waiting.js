"use strict";
const socket = io();

const vm = new Vue({
  el: "#text-wrapper",
  data: {
    numOfIcebreakers: 0,
    hideIcebreaker: true,
    visible: false,
    icebreakers: [],
    icebreaker: "",
    icebreakerIndex: 0,
    loggedInUser: {},
    wait: true,
    overlayOff: true
  },
  mounted() {
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

    socket.emit("requestIcebreakers", {
      roomId: window.sessionStorage.getItem("roomId"),
      eventID: window.sessionStorage.getItem("eventID")
    });

    socket.on(
      "sendIcebreakers",
      function(data) {
        this.icebreakers = data.icebreakers;
        this.numOfIcebreakers = data.icebreakers.length;
      }.bind(this)
    );

    socket.on(
      "yourDate",
      function(data) {
        console.log(data.seat);
        this.wait = false;
        this.overlayOff = false;
        this.setTable(data);
      }.bind(this)
    );
  },
  methods: {
    showIcebreaker: async function() {
      while (this.wait) {
        this.visible = false;
        this.hideIcebreaker = true;
        await this.sleep(4000);
        this.hideIcebreaker = false;
        this.icebreakerIndex = Math.floor(
          Math.random() * this.numOfIcebreakers
        );
        this.visible = true;
        this.icebreaker = this.icebreakers[this.icebreakerIndex];
        await this.sleep(4000);
        this.icebreaker = "";
      }
    },
    sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    setTable: function(data) {
      var seat = document.getElementById(data.seat.tableID);
      seat.classList.add("colorIn"); 

      if (data.seat.seat1.username === this.loggedInUser.username) {

        
      } else {
      }
    },

    goToSite: function(link) {
      window.location.href = link;
    }
  },
  created() {
    this.showIcebreaker();
  }
});
