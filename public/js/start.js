


const vm = new Vue({
    el: '#app-container',
    data: {

    },
    methods: {
        goToSite: function (link){
            window.location.href = link;
        }
    }
})

