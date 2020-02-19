const vm = new Vue({
    el: "#manager-wrapper",
    data: {
	tables: tables,
	users: users_json,
	session: {session_name: "", },
	showHelp: false,
    },
    methods: {
	switchShowHelp: function() {
	    if (this.showHelp) {
		this.showHelp = false;
	    } else {
		this.showHelp = true;
	    }
	    console.log("Switched show help");
	}
    },
})
