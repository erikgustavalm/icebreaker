"use strict";
const socket = io();

const vm = new Vue({
  el: "#text-wrapper",
  data: {
    numOfIcebreakers: icebreakers.length,
    hideIcebreaker: true,
    visible: false,
    icebreaker: "",
    icebreakerIndex: 0,
    loggedInUser: {},
  },
  mounted(){
    console.log(window.sessionStorage.getItem('roomId'));
    socket.emit('requestUser', {
      username: window.sessionStorage.getItem('roomId'),
    });
    socket.on('getUser', function(user){
      this.loggedInUser = user.data;
      console.log(this.loggedInUser.username + " is logged in on this page");
    }.bind(this));
  },
  methods: {
    showIcebreaker: async function() {
      var i = 0;
      while (i < 2) {
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

    goToSite: function (link){       
    window.location.href = link
},
  },
  created() {
    this.showIcebreaker();
  }
});
