"use strict";
const socket = io();

const vm = new Vue({
  el: ".container",
  data: {
    numOfIcebreakers: 0,
    hideIcebreaker: true,
    visible: false,
    icebreakers: [],
    icebreaker: "",
    icebreakerIndex: 0,
    loggedInUser: {},
    wait: true,
    overlayOff: true,
    toggleHelp: false,
    time: 900, //in seconds
    timer: null,
    display: null,
    loggedInUser: {},
    dateImg: "",
    myDate: {},
    seat: false,
    tableID: 0,
    questions: ["Was your date pleasant?"],
    defaultRating: 5,
    rating: ["1"],
    message: "",
    rate: false,
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
        if (data.seat.seat1.username === this.loggedInUser.username) {
          this.myDate = data.seat.seat2;
        } else {
          this.myDate = data.seat.seat1;
        }
        this.dateImg = this.myDate.img;
        console.log("MY DATE:");
        console.log(this.myDate);
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
      document.getElementById("table-wrapper").style.display = "flex";
      var seat = document.getElementById(data.seat.tableID);
      this.tableID = data.seat.tableID;
      seat.classList.add("colorIn");
    },

    goToSite: function(link) {
      window.location.href = link;
    },
    showInfo: function() {
      if (this.toggleHelp == false) {
        this.toggleHelp = true;
      } else {
        this.toggleHelp = false;
      }
    },
    startTimer: function() {
      //time since 1970 in milliseconds
      const now = Date.now();

      const then = now + this.time * 1000;
      this.timer = setInterval(() => {
        const secondsLeft = Math.round(then - Date.now()) / 1000;
        if (secondsLeft < 1) {
          this.goToSite("../user/rating.html");
        }
        this.timeLeft(secondsLeft);
      }, 1000);
    },
    timeLeft: function(secondsLeft) {
      let minutes = "" + Math.floor(secondsLeft / 60);
      let seconds = "" + Math.floor(secondsLeft % 60);
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      this.display = `${minutes}:${seconds}`;
    },
    goToSite: function(link) {
      clearInterval(this.timer);
      window.location.href = link;
    },
    getDate: function(){
      this.seat = true;
      document.getElementById("table-wrapper").style.display = "none";
      var seat = document.getElementById(this.tableID);
      seat.classList.remove("colorIn");
      
      socket.on(
        "startTimer",
        function(data) {
          this.startTimer();
        }.bind(this)
      );
    },
    cancelDate: function(){
      clearInterval(this.timer);
      this.seat = false;
      this.rate = true
    },
    submitRating: function(event){
      console.log("Rating:");
      console.log(this.rating);
      console.log("Your msg to Host:");
      console.log(this.message);
    },
  },
  created() {
    this.showIcebreaker();
  }
});
