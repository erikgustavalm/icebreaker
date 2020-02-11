const mpw = new Vue({
    el: "#manager-pairs-wrapper",
    data: {
	pairs: [],
	users: users_json,
	slots: 20,
    },
    methods: {
	showProfile: function(user) {
	    console.log(user.name, user.age);
	    console.log(user.img)

	    if (user.showInfo) {
		user.showInfo = false;
	    } else {
		user.showInfo = true;
	    }
	},

     },
})
