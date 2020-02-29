"use strict";
const socket = io();

const vm = new Vue({
  el: "#questionform",
  data: {
    questionlist: samplequestions,
    answerArray: [], // Här finns alla svar på frågorna, inkulsive open ended som sista.
    loggedInUser: {},
  },
  mounted() {
    console.log(window.sessionStorage.getItem("roomId"));
    socket.emit("requestUser", {
      username: window.sessionStorage.getItem("roomId")
    });
    socket.on(
      "getUser",
      function(user) {
        this.loggedInUser = user.data;
        console.log(this.loggedInUser.username + " is logged in on this page");
      }.bind(this)
    );
  },
  methods: {
    checkValid: function() {
      var validInput = true;
      for (var question of this.questionlist) {
        console.log(question.alt1);
        if (
          document.getElementById(question.alt1) != null &&
          document.getElementById(question.alt2) != null &&
          document.getElementById(question.alt3) != null &&
          document.getElementById(question.alt4) != null
        ) {
          if (
            document.getElementById(question.alt1).checked ||
            document.getElementById(question.alt2).checked ||
            document.getElementById(question.alt3).checked ||
            document.getElementById(question.alt4).checked
          ) {
          } else {
            validInput = false;
            alert("first");
          }
        } else if (
          document.getElementById(question.alt1) != null &&
          document.getElementById(question.alt2) != null
        ) {
          if (
            !document.getElementById(question.alt1).checked ||
            !document.getElementById(question.alt2).checked
          ) {
          } else {
            validInput = false;
            alert("third");
          }
        } else {
          if (document.getElementById("openEnded").value == "") {
            validInput = false;
            alert("third");
          }
        }
      }

      if (validInput) {
        this.goToSite("../user/waiting.html");
      }
    },

    goToSite: function(link) {
      //" goToSite('./user/join.html')"

      window.location.href = link;
    }
  }
});
