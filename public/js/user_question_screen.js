

const vm = new Vue({
  el: '#questionform',
  data: {
      questionlist: samplequestions,
      answerArray: [], // Här finns alla svar på frågorna, inkulsive open ended som sista.
  },
    methods: {
        checkValid: function(){
            validInput = true;
            for(var question of this.questionlist)
            {
                console.log(question.alt1);
                if(document.getElementById(question.alt1) != null && document.getElementById(question.alt2) != null && document.getElementById(question.alt3) != null && document.getElementById(question.alt4) != null)
                {
                    if(document.getElementById(question.alt1).checked || document.getElementById(question.alt2).checked || document.getElementById(question.alt3).checked || document.getElementById(question.alt4).checked)
                    {
                        
                    }
                    else
                    {
                        validInput = false;
                        alert("first");
                    }
                }
                else if(document.getElementById(question.alt1) != null && document.getElementById(question.alt2) != null)
                {
                    if(!document.getElementById(question.alt1).checked || !document.getElementById(question.alt2).checked)
                    {
                        
                    }
                    else
                    {
                        validInput = false;
                        alert("third");
                    }
                }
                else
                {
                    if(document.getElementById('openEnded').value == "")
                    {
                        validInput = false;
                        alert("third");
                    }
                }

                
            }

            if(validInput)
            {
                this.goToSite('./user/join.html');
            }
            
            
            
        },
        
        goToSite: function (link){ //" goToSite('./user/join.html')"
          
            window.location.href = link
        },
  }
})
