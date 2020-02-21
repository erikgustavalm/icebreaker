const vm = new Vue({
    el: "#manager-wrapper",
    data: {
	tables: tables,
	users: users_json,
	session: {session_name: "", },
	showHelp: false,
	timerLabel: "START ROUND",
	TIME_LIMIT: 10,
	timePassed: 0,
	timeLeft: 0,
	timerInterval: 0,
    },
    methods: {
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

	    document.getElementById("manager-round-timer").style.backgroundColor = "green";
	    document.getElementById("manager-round-timer").style.color = "#393939";

	    this.timePassed = 0;
	    this.timeLeft = 0;
	},

	startTimer: function() {
	    this.timerInterval = setInterval(() => {
		this.timePassed = this.timePassed += 1;
		this.timeLeft = this.TIME_LIMIT - this.timePassed;
		this.timerLabel = this.formatTime();

		document.getElementById("manager-round-timer").style.backgroundColor = "red";
		document.getElementById("manager-round-timer").style.color = "white";


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
})
