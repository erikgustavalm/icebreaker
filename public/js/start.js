


const vm = new Vue({
    el: '#start-site',
    data: {
        userLoggedIn : false,
        isHidden: true,
        password: "",
        username: "",
        registrationHidden: true,
        accountDetails: true,
    },
    methods: {
        goToSite: function (link){
            window.location.href = link;
        },
        pullDown: function (){
            console.log("my account button clicked!");
            if(this.isHidden){
                this.isHidden = false;
            } else {
                this.isHidden = true;
            }
        },
        loginUser: function(){
            this.userLoggedIn = true;
            this.isHidden = true;
            console.log("user logged in successfully!");
        },
        logoutUser: function() {
            this.userLoggedIn = false;
            console.log("user logged out successfully!");
        },
        setRegistration: function() {
            this.registrationHidden = false;
            console.log("sign up button clicked!")
        },
        regProfile: function() {
            this.accountDetails = false;
            console.log("next button clicked!")
        },
        abortRegistration: function() {
            this.accountDetails = true;
            this.registrationHidden = true;
            this.isHidden = true;
            console.log("aborted registration!")
        },
        backToAccountDetails: function(){
            this.accountDetails = true;
            console.log("back to account details!")
        },
        doneWithRegistration: function(){
            this.accountDetails = true;
            this.registrationHidden = true;
            this.isHidden = true;
            console.log("Registration successfull!")
        }


    }
})

