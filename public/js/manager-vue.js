"use strict";
const socket = io();

const popVm = new Vue({
    el: "#manager-profile-popup",
    data: {
	questions: [],
	answers: [],
	user: null
    },
    methods: {
	
    }
})

const vm = new Vue({
  el: "#manager-wrapper",
  data: {
    eventID: "",
    tables: tables,
    users: null,
    session: { session_name: "" },
    showHelp: false,
    timerLabel: "START ROUND",
    TIME_LIMIT: 10,
    timePassed: 0,
    timeLeft: 0,
    timerInterval: 0,
      pairs: null,
      event: null,
      
  },
  methods: {
    autoMatch: function() {
      console.log("autoMatch()");
      if (this.users.length == 0) {
        console.log("No users to match, abort!");
        return;
      }
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].matched == false) {
          let pairIndex;
          let seat;
          if (i % 2 == 0) {
            pairIndex = Math.floor(i / 2);
            seat = 0;
          } else {
            pairIndex = Math.floor(i / 2);
            seat = 1;
          }
          this.moveUserToPair(this.users[i], pairIndex, seat);
        }
      }

      //* send seats to users
      this.sendMatchedPairs();
    },

    moveUserToPair: function(user, pairIndex, seat) {
      const userElement = document.getElementById(user.id);
      console.log(userElement);
      const userName = userElement.children[0];
      const userImg = userElement.children[1];

      let pair = this.pairs[pairIndex].children;

      if (slotTaken(pair[seat]) == "true") {
        //		lockSlot(startingSlot);
        console.log("Slot is taken, abort!!");
        return;
      }

      userElement.classList.remove("manager-list-slot");
      userElement.classList.add("manager-slot-taken");
      userName.style.display = "none";
      userImg.style.display = "block";

      pair[seat].style.opacity = "1";

      // console.log(user.id);
      // console.log(this.pairs[pairIndex].lastChild.id);
      // console.log(seat);

      rearrange_table(
        user.id,
        getTableId(this.pairs[pairIndex].lastChild.id),
        seat + 1
      );
      pair[seat].appendChild(userElement);
      lockSlot(pair[seat]);
      user.matched = true;
    },

    switchShowHelp: function() {
      if (this.showHelp) {
        this.showHelp = false;
      } else {
        this.showHelp = true;
      }
      console.log("Switched show help");
    },

    onTimesUp: function() {
      clearInterval(this.timerInterval);
      this.timerLabel = "START ROUND";

      document.getElementById("manager-round-timer").style.backgroundColor =
        "#399939";

      this.timePassed = 0;
      this.timeLeft = 0;
    },

    startTimer: function() {
      this.timerInterval = setInterval(() => {
        this.timePassed = this.timePassed += 1;
        this.timeLeft = this.TIME_LIMIT - this.timePassed;
        this.timerLabel = this.formatTime();

        document.getElementById("manager-round-timer").style.backgroundColor =
          "#ff3939";

        if (this.timeLeft === 0) {
          this.onTimesUp();
        }
      }, 1000);
    },

    formatTime: function() {
      m = Math.floor(this.timeLeft / 60);
      s = this.timeLeft % 60;
      if (s < 10) {
        s = `0${s}`;
      }
      return `${m}:${s}`;
    },

    sendMatchedPairs: function() {
	  console.log(this.tables);
      socket.emit("sendMatchedPairs", {
        matchedPairs: this.tables,
      });
    },

    onTimesUp: function() {
      clearInterval(this.timerInterval);
      this.timerLabel = "START ROUND";

      document.getElementById("manager-round-timer").style.backgroundColor =
        "#399939";

      this.timePassed = 0;
      this.timeLeft = 0;
    },

    startTimer: function() {
      this.timerInterval = setInterval(() => {
        this.timePassed = this.timePassed += 1;
        this.timeLeft = this.TIME_LIMIT - this.timePassed;
        this.timerLabel = this.formatTime();

        document.getElementById("manager-round-timer").style.backgroundColor =
          "#ff3939";

        if (this.timeLeft === 0) {
          this.onTimesUp();
        }
      }, 1000);
    },

    formatTime: function() {
      m = Math.floor(this.timeLeft / 60);
      s = this.timeLeft % 60;
      if (s < 10) {
        s = `0${s}`;
      }
      return `${m}:${s}`;
    }
  },
  mounted() {
    this.pairs = document.getElementById("manager-pairs-wrapper").children;
    console.log(this.pairs);

    if (window.sessionStorage.getItem("eventID") != null) {
      socket.emit("requestEvent", {
        eventID: window.sessionStorage.getItem("eventID")
      });
      socket.on(
        "getEvent",
        function(event) {
          this.event = event.event;
            this.users = this.event.users;
	    popVm.users = this.event.users;
	    popVm.questions = this.event.questions;
        }.bind(this)
      );
    }

    socket.on(
      "onUserJoin",
      function(data) {
          vm.users.push(data.user);
	  popVm.users.push(data.user);
	  popVm.answers = data.user.answers;
	  popVm.questions = this.event.questions;
      }.bind(this)
    );
  }
});
