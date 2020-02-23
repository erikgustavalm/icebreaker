const vm = new Vue({
    el: 'main',
    data: {
        firstname: '',
        lastname: '',
        email: '',
        gender: '',
        age: 0,
        

    },
    methods: {
        checkData: function(){
            result = true;
            if(!document.getElementById("firstname").value) {
                alert("Please enter your first name.");
                result = false;
            }
            else if(!document.getElementById("lastname").value) {
                alert("Please enter your last name.");
                result=false;
            }
            else if(!document.getElementById("email").value) {
                alert("Please enter your email.");
                result=false;
            }
            else if(!document.getElementById("age").value) {
                alert("Please enter your age.");
                result=false;
            }

            if(result)
            {
                this.submitData();
            }
        },
        submitData: function(){
            let firstname = document.getElementById("firstname").value;
            let lastname = document.getElementById("lastname").value;
            let email = document.getElementById("email").value;
            
            let gender = "male";

            if(document.getElementById("female").checked){
                gender = "female";
            }
            if(document.getElementById("other").checked){
                gender = "other";
            }

            this.firstname = firstname;
            this.lastname = lastname;
            this.email = email;
            this.gender = gender;
            this.age = age;

            this.goToSite("../user/join.html");
        },
        addPicture: function(){
            let image = document.getElementById("profilePic");
            image.src = "../img/testPic.jpeg";
        },
        goToSite: function (link){ //" goToSite('./user/join.html')"
            window.location.href = link
        },
    }
})

