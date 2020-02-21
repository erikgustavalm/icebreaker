


const vm = new Vue({
    el: '#app-container',
    data: {
        userLoggedIn : false,
        isHidden: true,
        password: "",
        username: "",
    },
    methods: {
        goToSite: function (link){
            window.location.href = link;
        },
        pullDown: function (){
            console.log("account button clicked!");
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
        }

    }
})

