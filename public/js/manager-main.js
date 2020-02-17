// Here we write json and functionalities.
let tables = [
    {
	id1: 1, user1: "",  id2: 2, user2: "" 
    },
    {
	id1: 3, user1: "",  id2: 4, user2: "" 
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
// let mouseOverActive = false;

function onDragStart(event) {
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
    const draggableElement = document.getElementById(id);
    draggableElement.style.backgroundColor = "blue";
    const dropzone = event.target;
    dropzone.classList.remove("manager-slot-hover");
    dropzone.appendChild(draggableElement);
     //event.dataTransfer.clearData();
}

function openProfile(event) {

    // if(mouseOverActive != mouseOverCall) return;
    // mouseOverActive = true;
    
    event.preventDefault();
    console.log(event.parent);
    console.log(event);
    idContainer = event.target.id; // TODO: dont use global variable

    const popupWindow = document.getElementById("manager-profile-popup");
    const profile = document.getElementById(event.target.id);
    let name = document.getElementById("manager-profile-popup-name");
    let age = document.getElementById("manager-profile-popup-age");
    let img = document.getElementById("manager-profile-popup-img");
    let index = parseInt(profile.id.substring(4, profile.id.length), 10);
    img.src = users_json[index].img;   
    name.innerHTML = "Name: " + users_json[index].name;
    age.innerHTML = "Age: " + users_json[index].age;

    
    /* Disable draggable while profile window is active */
    profile.draggable = false;
    
    /* Make profile window visibel */
    document.querySelector('.manager-profile-popup').style.display = "flex";
    
    /* Place profile window relative to the profile picture*/
    popupWindow.style.top = profile.offsetTop + 'px';
    popupWindow.style.left = (profile.offsetLeft + (profile.offsetWidth/2)) - (popupWindow.offsetWidth/2) + 'px';
}

function closeProfile(event) {
    event.preventDefault();
    
    const id = idContainer;
    const profile = document.getElementById(id);
    
    profile.draggable = true;
    
    document.querySelector('.manager-profile-popup').style.display = "none";

    // if(mouseOverActive != mouseOverCall) mouseOverActive = false;
}
