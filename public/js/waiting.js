"use strict";
const socket = io();

const vm = new Vue({
  el: ".container",
  data: {
    numOfIcebreakers: 0,
    hideIcebreaker: true,
    visible: false,
    icebreakers: [], //contains all icebreakers
    icebreaker: "", //holds current icebreaker
    icebreakerIndex: 0, //used to index icebreakers
    loggedInUser: {}, //the user logged in
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
    // objects in this list like this {date: , rating: , msg: }
    dates: [], //contains the dates that I've had this event in accordance with object above, push new after each dates
    //event done at round 3 -> then user should decide whom to share contacts with
    rounds: 0,
    final: false, // is true when rounds are done
    //used by swiper
    startX: 0,
    currX: 0,
    limitX: 200,
    distance: 0,
    //* will contain the swipes
    swipes: [false, false, false],
    //* will contain the matched people
    matched: []
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
      this.time = 900;
      this.timer = null;
      this.display = null;
      const then = now + this.time * 1000;
      this.timer = setInterval(() => {
        const secondsLeft = Math.round(then - Date.now()) / 1000;
        if (secondsLeft < 1) {
          this.cancelDate;
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
    getDate: function() {
      
      this.seat = true;
      document.getElementById("table-wrapper").style.display = "none";
      var seat = document.getElementById(this.tableID);
      seat.classList.remove("colorIn");
      socket.on(
        "sendCancelRound",
        function(data) {
          this.cancelDate();
        }.bind(this)
      );

      socket.on(
        "startTimer",
        function(data) {
          this.startTimer();
        }.bind(this)
      );
    },
    cancelDate: function() {
      clearInterval(this.timer);
      this.seat = false;
      this.rate = true;
    },
    submitRating: function(event) {
      clearInterval(this.timer);
      this.time = 900;
      this.display = null;
      this.seat = false;
      this.rate = false;
      this.overlayOff = true;
      this.dates.push({
        date: this.myDate,
        rating: this.rating,
        msg: this.message
      });
      socket.emit("rateDateAns", {
        rating: this.rating[0],
        message: this.message
      });
      this.rating = ["1"];
      this.message = "";
      console.log("All your current dates:");
      console.log(this.dates);
      this.rounds++;
      if (this.rounds != 3) {
        this.wait = true;
        this.showIcebreaker();
      } else {
        this.final = true;
        var sections = document.getElementsByClassName("user-sections");

        for (var i = 0; i < sections.length; i++) {
          sections[i].addEventListener("touchstart", this.touchStart, false);
          sections[i].addEventListener("touchmove", this.touchMove, false);
          sections[i].addEventListener("touchend", this.touchEnd, false);
        }
        console.log("show matches");
      }
    },
    touchStart: function(event) {
      event.preventDefault();
      this.startX = event.touches[0].clientX;
    },

    touchMove: function(event) {
      this.currX = event.touches[0].clientX;
      this.distance = Math.floor(this.startX - this.currX);
      // if (this.distance > 200 || this.distance < -200) {
      // 	event.target.style.opacity = "0.1";
      // } else if (this.distance > 150 || this.distance < -150) {
      // 	event.target.style.opacity = "0.25";
      // } else if (this.distance > 100 || this.distnace < -100) {
      // 	event.target.style.opacity = "0.5";
      // } else if (this.distance > 50 || this.distance < -50) {
      // 	event.target.style.opacity = "0.75";
      // }
    },

    touchEnd: function(event) {
      if (!event.target.classList.contains("flipable")) {
        this.distance = 0;
        return;
      }
      if (this.distance > this.limitX) {
        //* swipe left
        event.target.style.animation = "flipper";
        event.target.style.animationDuration = "0.2s";
        event.target.style.animationTimingFunction = "linear";
        event.target.style.animationFillMode = "forwards";
        if (event.target.id === "date-0") {
          this.swipes[0] = false;
        } else if (event.target.id === "date-1") {
          this.swipes[1] = false;
        } else {
          this.swipes[2] = false;
        }
      } else if (this.distance < this.limitX * -1) {
        //* swipe right
        event.target.style.animation = "flipper-back";
        event.target.style.animationDuration = "0.2s";
        event.target.style.animationTimingFunction = "linear";
        event.target.style.animationFillMode = "forwards";
        if (event.target.id === "date-0") {
          this.swipes[0] = true;
        } else if (event.target.id === "date-1") {
          this.swipes[1] = true;
        } else {
          this.swipes[2] = true;
        }
      }
      // event.target.style.opacity = "1";
      this.distance = 0;
      //event.target.style.animation = "None";
    },
    matchedDates: function() {
      console.log(this.swipes);
      this.matched = [];
      for (let i = 0; i < this.swipes.length; i++) {
        if (this.swipes[i] == true) {
          this.matched.push(this.dates[i]);
        }
      }
      socket.emit("datesDone", {
        userID: this.loggedInUser.username,
        matches: this.matched
      });
      console.log(this.matched);
      this.goToSite("../index.html");
    }
  },
  created() {
    this.showIcebreaker();
  }
});
