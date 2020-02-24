//var VSlider = require('v-slider');

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
    hideImg: false
  },
  methods: {
    /*fadeImg: function() {
      img = document.getElementById("current-date-img");
      img.style.display = "none";
      this.hideImg = true;
    },
*/
    submitRating: function(event){
        console.log(this.rating);
    }
  }
});
