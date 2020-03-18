"use strict";
const socket = io();

const popVm = new Vue({
  el: "#manager-profile-popup",
  data: {
    questions: [],
    answers: [],
    user: null
  },
  methods: {}
});

const vm = new Vue({
  el: "#manager-wrapper",
  data: {
    eventID: "",
    tables: tables,
    users: null,
    round: 1,
    cancel: false,
    session: { session_name: "" },
    showHelp: false,
      seated: false,
    timerLabel: "SEND SEATS",
    TIME_LIMIT: 5,
    timePassed: 0,
    timeLeft: 0,
    timerInterval: 0,
    pairs: null,
    event: null
  },

    methods: {
      goToSite: function() {
        window.location.href = "../index.html";
      },
    autoMatch: function() {
	console.log("autoMatch()");
	if (this.users.length == 0) {
            console.log("No users to match, abort!");
            return;
	}
	// Split the users in gender
	let males = [];
	let females = [];

	for (let i = 0; i < this.users.length; i++) {
	    if (this.users[i].gender == "male") {
		males.push(this.users[i]);
	    } else {
		females.push(this.users[i]);
	    }
	}

	// MOCKING, set pairs (needs to be the the same number of males and females)
	for (let i = 0; i < males.length; i++) {
            if (males[i].matched == false) {
		this.moveUserToPair(males[i], i, 0);
		this.moveUserToPair(females[i], i, 1);
            }
	}
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

    startTimer: function() {
	if (this.seated == false) {
	    // Should be checking if all are matched
	    this.sendMatchedPairs();
	    this.seated = true;
	    this.timerLabel = "START R" + this.round;
	} else {
	    if (this.cancel == false || this.seated) {
		socket.emit("startDateTimer", {});
		this.cancel = true;
		this.timerInterval = setInterval(() => {
		    this.timePassed = this.timePassed += 1;
		    this.timeLeft = this.TIME_LIMIT - this.timePassed;
		    this.timerLabel = this.formatTime();
		    document.getElementById("manager-round-timer").style.backgroundColor =
			"#ff3939";

		    if (this.timeLeft === 0) {
          this.cancel = false;
			this.onTimesUp();
		    }
		}, 1000);

	    } else {
		this.cancel = false;
		this.onTimesUp();
	    }
	}
    },

    formatTime: function() {
      var m = Math.floor(this.timeLeft / 60);
      var s = this.timeLeft % 60;
      if (s < 10) {
        s = `0${s}`;
      }
      return `${m}:${s}`;
    },

    sendMatchedPairs: function() {
      console.log(this.tables);
      socket.emit("sendMatchedPairs", {
        matchedPairs: this.tables,
        eventID: window.sessionStorage.getItem("eventID")
      });
    },

    onTimesUp: function() {
      clearInterval(this.timerInterval);
      if (this.round + 1 == 4) {
          this.timerLabel = "DONE";
          document.getElementById("manager-round-timer").disabled = true;
      } else {
          this.round = this.round + 1;
	  this.seated = false;
	  this.timerLabel = "SEND SEATS";
      }
      document.getElementById("manager-round-timer").style.backgroundColor =
        "#399939";
      this.timePassed = 0;
      this.timeLeft = 0;
      socket.emit("cancelRound", {});
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
          popVm.answers = this.event.answers;
        }.bind(this)
      );
    }

    socket.on(
      "onUserJoin",
      function(data) {
        //   vm.users.push(data.user);
        popVm.users.push(data.user);
        popVm.answers = data.user.answers;
        popVm.questions = this.event.questions;
      }.bind(this)
    );
      socket.on(
	  "getRateDateAns",
	  function(data) {
	      let user = getUserByName(data.user.name);
	      user.ratings.push(data.user.ratings[data.user.ratings.length-1]);
	      user.messages.push(data.user.messages[data.user.messages.length-1]);

	      console.log(user.ratings[0]);
	      console.log(user.messages[0]);
	  }.bind(this)
    );

  }
});
