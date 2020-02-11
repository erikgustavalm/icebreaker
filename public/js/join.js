const vm = new Vue({
  el: "main",
  data: {
    roomKey: "Room Key: nitram",
    enteredKey: [],
    
  },
  methods: {
    goToSite: function(link) {
        window.location.href = link;
    }
  }
});
