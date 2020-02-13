// Here we write json and functionalities.
let tables = [
    {
	id1: 1, user1: "", id2: 2, user2: ""
    },
    {
	id1: 3, user1: "", id2: 4, user2: ""
    },
    {
	id1: 5, user1: "", id2: 6, user2: ""
    },
    {
	id1: 7, user1: "", id2: 8, user2: ""
    },
    {
	id1: 9, user1: "", id2: 10, user2: ""
    },
    {
	id1: 11, user1: "", id2: 12, user2: ""
    },
    {
	id1: 13, user1: "", id2: 14, user2: ""
    },
    {
	id1: 15, user1: "", id2: 16, user2: ""
    },
    {
	id1: 17, user1: "", id2: 18, user2: ""
    },
    {
	id1: 19, user1: "", id2: 20, user2: ""
    }
]

let idContainer;

function onDragStart(event) {
    console.log("onDragStart()");
        console.log(event);
    event.dataTransfer.setData("text", event.target.id);
    event.currentTarget.style.backgroundColor = "yellow";
}

function onDragOver(event) {
    event.preventDefault();
    const dropzone = event.target;
    dropzone.classList.add("manager-slot-hover");
}

function onDragExit(event) {
    event.preventDefault();
    const dropzone = event.target;
    dropzone.classList.remove("manager-slot-hover");
}
function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    console.log(id);

    const draggableElement = document.getElementById(id);
    draggableElement.style.backgroundColor = "blue";
    const dropzone = event.target;
    dropzone.classList.remove("manager-slot-hover");
    dropzone.appendChild(draggableElement);
     //event.dataTransfer.clearData();
}

function openProfile(event) {
    event.preventDefault();
    
    idContainer = event.target.id; // TODO: dont use global variable
    const popupWindow = document.getElementById("manager-profile-popup");
    const profile = document.getElementById(event.target.id);

    /* Disable draggable while profile window is active */
    profile.draggable = false;
    
    /* Make profile window visibel */
    document.querySelector('.manager-profile-popup-bg').style.display = "flex";

    /* Place profile window relative to the profile picture*/
    popupWindow.style.top = profile.offsetTop + 'px';
    popupWindow.style.left = (profile.offsetLeft + (profile.offsetWidth/2)) - (popupWindow.offsetWidth/2) + 'px';
}

function closeProfile(event) {
    event.preventDefault();

    const id = idContainer;
    const profile = document.getElementById(id);
    profile.draggable = true;
    
    document.querySelector('.manager-profile-popup-bg').style.display = "none";
   
}
