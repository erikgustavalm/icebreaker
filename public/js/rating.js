//var VSlider = require('v-slider');

const vm = new Vue({
  el: "#rate-date-container",
  data: {
    questions: ["Q1", "Q2", "Q4", "Q5"],
    defaultRating: 5,
    rating: ["5","5","5","5"],
    hideImg: false
  },
  methods: {
    fadeImg: function() {
      img = document.getElementById("current-date-img");
      img.style.display = "none";
      this.hideImg = true;
    },
    submitRating: function(event){
        console.log(this.rating);
    }
  }
});
