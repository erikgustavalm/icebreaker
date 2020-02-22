new Vue({
  el: "#your-date-container",
  data: {
    time: 900, //in seconds
    timer: null,
    display: null
  },
  methods: {
    startTimer: function() {
      //time since 1970 in milliseconds
      const now = Date.now();

      const then = now + this.time * 1000;
      this.timer = setInterval(() => {
        const secondsLeft = Math.round(then - Date.now()) / 1000;
        if (secondsLeft < 0) {
          clearInterval(timer);
          return;
        }
        this.timeLeft(secondsLeft);
      }, 1000);
    },
    timeLeft: function(secondsLeft) {
      let minutes = "" + Math.floor(secondsLeft / 60);
      let seconds = "" + Math.floor(secondsLeft % 60);
      minutes.padStart(2, "0");
      seconds.padStart(2, "0");
      this.display = `${minutes}:${seconds}`;

      console.log(this.display);
    }
  },
  mounted() {
    this.startTimer();
  }
});
