const vm = new Vue({
  el: "#start-site",
  data: {
    userLoggedIn: false,
    isHidden: true,
    password: "",
    username: "",
    registrationHidden: true,
    accountDetails: true,
    incorrectLogin: false,
    newUser: {
      username: "",
      password: "",
      email: "",
      fullname: "",
      age: 0,
      gender: "",
      imgPath:"",
      totalMatches: []
    },
    loggedInUser: {}
  },
  methods: {
    goToSite: function(link) {
      window.location.href = link;
    },
    pullDown: function() {
      this.incorrectLogin = false;
      console.log("my account button clicked!");
      if (this.isHidden) {
        this.isHidden = false;
      } else {
        this.isHidden = true;
      }
    },
    loginUser: function() {
      if (this.username != "" && this.password != "") {
        // mockup - the registrated user becomes the logged in user
        if (
          this.username == this.newUser.username &&
          this.password == this.newUser.password
        ) {
          this.userLoggedIn = true;
          this.isHidden = true;
          console.log("user logged in successfully!");
          this.loggedInUser = this.newUser;
          this.username = "";
          this.password = "";
        }
      }
      this.incorrectLogin = true;
    },
    logoutUser: function() {
      this.userLoggedIn = false;
      this.loggedInUser = {};
      console.log("user logged out successfully!");
    },
    setRegistration: function() {
      this.incorrectLogin = false;
      this.registrationHidden = false;
      console.log("sign up button clicked!");
    },
    regProfile: function() {
      if (this.inputCheckerAccount()) {
        this.accountDetails = false;
        console.log("next button clicked!");
      }
    },
    abortRegistration: function() {
      this.resetBorderColor();
      this.accountDetails = true;
      this.registrationHidden = true;
      this.isHidden = true;
      this.emptyUserFields();
      console.log("aborted registration!");
    },
    backToAccountDetails: function() {
      this.accountDetails = true;
      this.resetBorderColor("profile");
      console.log("back to account details!");
    },
    doneWithRegistration: function() {
      if (this.inputCheckerProfile()) {
        this.accountDetails = true;
        this.registrationHidden = true;
        this.isHidden = true;
        console.log("Registration successfull!");
      }
    },
    resetIncorrectLogin: function() {
      this.incorrectLogin = false;
    },
    emptyUserFields: function() {
      this.newUser.username = "";
      this.newUser.password = "";
      this.newUser.email = "";
      this.newUser.fullname = "";
      this.newUser.age = 0;
      this.newUser.gender = "";
    },
    inputCheckerAccount: function() {
      result = true;

      if (!this.newUser.username) {
        document.getElementById("username").classList.add("unfilled-entry");
        result = false;
      }
      if (!this.newUser.password) {
        document.getElementById("password").classList.add("unfilled-entry");
        result = false;
      }
      if (!this.newUser.email) {
        document.getElementById("email").classList.add("unfilled-entry");
        result = false;
      }
      if (result == true) {
        this.resetBorderColor("account");
      }
      return result;
    },
    inputCheckerProfile: function() {
      result = true;

      if (!this.newUser.fullname) {
        result = false;
        document.getElementById("name").classList.add("unfilled-entry");
      }
      if (!this.newUser.age) {
        result = false;
        document.getElementById("age").classList.add("unfilled-entry");
      }
      if (!this.newUser.gender) {
        result = false;
        document.getElementById("gender").classList.add("unfilled-entry");
      }

      if (result == true) {
        this.resetBorderColor("profile");
      }
      return result;
    },
    resetBorderColor: function(from) {
      if (from == "account") {
        document.getElementById("username").classList.remove("unfilled-entry");
        document.getElementById("password").classList.remove("unfilled-entry");
        document.getElementById("email").classList.remove("unfilled-entry");
      }
      if (from == "profile") {
        document.getElementById("name").classList.remove("unfilled-entry");
        document.getElementById("age").classList.remove("unfilled-entry");
        document.getElementById("gender").classList.remove("unfilled-entry");
      }
    },
    addPicture: function() {
      let image = document.getElementById("profile-pic");
      this.newUser.imgPath = "./img/testPic.jpeg";
      image.src = this.newUser.imgPath;
    }
  }
});
