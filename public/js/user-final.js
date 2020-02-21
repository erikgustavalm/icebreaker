const vm = new Vue ({
    el: "#user-final-screen",

    created() {
	console.log("created");
	var sections = document.getElementsByClassName("user-sections");

	for (var i = 0; i < sections.length; i++) {
	    sections[i].addEventListener("touchstart", this.touchStart, false);
	    sections[i].addEventListener("touchmove", this.touchMove, false);
	    sections[i].addEventListener("touchend", this.touchEnd, false);
	}
    },

    data: {
	suggestions: [{name: "lars"},
		      {name: "inger"},
		      {name: "bloho"}],

	startX: 0,
	currX: 0,
	limitX: 200,
	distance: 0,
    },



    methods: {
	touchStart: function(event) {
	    event.preventDefault();
	    this.startX = event.touches[0].clientX;
	},

	touchMove: function(event) {
	    this.currX = event.touches[0].clientX;
	    this.distance = Math.floor(this.startX - this.currX);
	    if (this.distance > 200 || this.distance < -200) {
		event.target.style.opacity = "0.1";
	    } else if (this.distance > 150 || this.distance < -150) {
		event.target.style.opacity = "0.25";
	    } else if (this.distance > 100 || this.distnace < -100) {
		event.target.style.opacity = "0.5";
	    } else if (this.distance > 50 || this.distance < -50) {
		event.target.style.opacity = "0.75";
	    }
	},

	touchEnd: function(event) {
	    if (this.distance > this.limitX) {
		event.target.style.backgroundColor = "red";
	    } else if (this.distance < this.limitX * -1) {
		event.target.style.backgroundColor = "green";
	    }
	    event.target.style.opacity = "1";
	    this.distance = 0;
	}
    }
})
