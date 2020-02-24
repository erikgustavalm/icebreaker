const vm = new Vue({
  el: "#text-wrapper",
  data: {
    numOfIcebreakers: icebreakers.length,
    hideIcebreaker: true,
    visible: false,
    icebreaker: "",
    icebreakerIndex: 0
  },
  methods: {
    showIcebreaker: async function() {
      var i = 0;
      while (i < 5) {
        this.visible = false;
        this.hideIcebreaker = true;
        await this.sleep(4000);
        this.hideIcebreaker = false;
        this.icebreakerIndex = Math.floor(Math.random() * this.numOfIcebreakers);
        this.visible = true;
        this.icebreaker = icebreakers[this.icebreakerIndex];
        await this.sleep(4000);
        this.icebreaker = "";
        i++;
      }
      this.goToSite("../user/dating.html");

    },
    sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    goToSite: function (link){ //" goToSite('./user/join.html')"
          
    window.location.href = link
},
  },
  created() {
    this.showIcebreaker();
  }
});
