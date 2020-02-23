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
      while (true) {
        this.visible = false;
        this.hideIcebreaker = true;
        await this.sleep(4000);
        this.hideIcebreaker = false;
        this.icebreakerIndex = Math.floor(Math.random() * 4);
        this.visible = true;
        this.icebreaker = icebreakers[this.icebreakerIndex];
        await this.sleep(4000);
        this.icebreaker = "";
      }
    },
    sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  created() {
    this.showIcebreaker();
  }
});
