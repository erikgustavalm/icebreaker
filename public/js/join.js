const vm = new Vue({
  el: "#join-room-container",
  data: {
    roomKey: "Enter room key:",
    enteredKey: "",
    
  },
  methods: {
    goToSite: function(link) {
        window.location.href = link;
    }
  }
});
