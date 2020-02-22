const vm = new Vue({
  el: "#start-site",
  data: {
    userLoggedIn: false, 
    isHidden: true,
    password: "",
    username: "",
    displayMatches: false,
    registrationHidden: true,
    accountDetails: true,
    incorrectLogin: false,
    testMatches : [{
      email: "user@gmail.com",
      name: "Axel Lingestål",
      age: "18",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "Anton Jäger",
      age: "19",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "Fredrik Vandermondes",
      age: "20",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "Jokke jokkake",
      age: "21",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "Sukram Lucero",
      age: "22",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "Nitram Lucero",
      age: "23",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "ERiiik eriIk",
      age: "24",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "Kalle Karlsson",
      age: "25",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "Markiplier Youtuber",
      age: "26",
      gender: "male",
      imgPath: "../img/index.png"
    },
    {
      email: "user@gmail.com",
      name: "Frankenstein Monster",
      age: "27",
      gender: "male",
      imgPath: "../img/index.png"
    }],
    newUser: {
      username: "",
      password: "",
      email: "",
      name: "",
      age: "",
      gender: "",
      imgPath: "",
      matches: []
    },
    loggedInUser: {}
  },
  methods: {
    goToSite: function(link) {
      window.location.href = link;
    },
    overlay: function() {
      this.incorrectLogin = false;
      console.log("overlay activated!");
      this.isHidden = false;
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
    abort: function() {
      this.resetBorderColor();
      this.accountDetails = true;
      this.registrationHidden = true;
      this.isHidden = true;
      this.displayMatches = false;
      this.emptyUserFields();
      console.log("aborted!");
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
      this.username = "";
      this.password = "";
      this.newUser.username = "";
      this.newUser.password = "";
      this.newUser.email = "";
      this.newUser.name = "";
      this.newUser.age = "";
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
    },
    showMatches: function() {
      this.overlay();
      this.displayMatches = true;
      console.log("displaying matches!");
    },

    toggleCard: function(card,index){
      var el = document.getElementById("card-"+index);
      if(el.classList.contains("expand")){
        el.classList.remove("expand");
        el.childNodes[2].childNodes[4].classList.add("toggle-off");
        el.childNodes[2].childNodes[6].classList.add("toggle-off");
      } else {
        el.classList.add("expand");
        el.childNodes[2].childNodes[4].classList.remove("toggle-off");
        el.childNodes[2].childNodes[6].classList.remove("toggle-off");
      }
      
    }
  }
});