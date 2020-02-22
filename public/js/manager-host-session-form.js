const mhsf = new Vue({
    el: "#manager-host-session-form",
    data: {
	session: {name: "", quotes: [], questions: []},
	newQuote: "",
	newQuestion: "",
	formNr: 0,
	formLast: 2
   },
    methods: {

	addQuote: function() {
	    if (this.newQuote != "") {
		this.session.quotes.push(this.newQuote);
		this.newQuote = "";
		console.log(this.quotes);
	    }
	},

	addQuestion: function() {
	    if (this.newQuestion != "") {
		this.session.questions.push(this.newQuestion);
		this.newQuestion = "";
		console.log(this.question);
	    }
	},

	formQuestionNext: function() {
	    if (this.session.questions.length == 0) {
		alert("Please enter at least one question");
	    } else {
		this.formNr++;
	    }

	},

	formDone: function() {
	    if (this.session.name != "") {
		console.log("session.name" + this.session.name);
		window.location.replace("host.html");
	    } else {
		console.log("Form not filled");
	    }
	},

	formNext: function() {
	    if (this.formNr == this.formLast) {
		this.formDone();
	    }
	    this.formNr++;
	}
    }
})
