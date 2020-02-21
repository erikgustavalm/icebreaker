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
    },



    methods: {
	touchStart: function(event) {
	    event.preventDefault();
	    this.startX = event.touches[0].clientX;
	},

	touchMove: function(event) {
	    this.currX = event.touches[0].clientX;
	},

	touchEnd: function(event) {
	    let distance = Math.floor(this.startX - this.currX);

	    if (distance > this.limitX) {
		event.target.style.backgroundColor = "red";
	    } else if (distance < this.limitX * -1) {
		event.target.style.backgroundColor = "green";
	    }
	}
    }
})
