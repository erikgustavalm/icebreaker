const mhsf = new Vue({
    el: "#manager-host-session-form",
    data: {
	session: {name: ""},
	quotes: [],
	newQuote: ""
   },
    methods: {
	addQuote: function() {
	    this.quotes.push(this.newQuote);
	    this.newQuote = "";
	    console.log(this.quotes);
	},
	formDone: function() {
	    if (this.session.name != "") {
		console.log("session.name" + this.session.name);
		window.location.replace("host.html");
	    } else {
		console.log("Form not filled");
	    }
	}
    }
})
