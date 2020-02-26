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
let startingSlot;
// let mouseOverActive = false;


function slotTaken(slot){
    return slot.getAttribute('locked');
}

function lockSlot(slot){
    console.log("lockSlot() ID " + slot.id);
    slot.setAttribute('locked', true);
}

function unlockSlot(slot){
    console.log("unlockSlot() ID: " + slot.id);
    slot.setAttribute('locked', false);
}

function onDragStart(event) {

    if(event.target == null){
	console.log("Invalid element!!");
	event.preventDefault();
	return;
    }

     if(event.target.nodeName == "#text"){
	 console.log("Invalid element!!");
	 event.preventDefault();
	return;
    }

    console.log(event.target.classList);

    if(event.target.parentElement.classList.contains("manager-slot-empty")){
	event.target.parentElement.style.opacity = 0.2;
	console.log("looool");
    }

    if(!event.target.classList.contains("manager-slot-taken") && !event.target.classList.contains("manager-list-slot")){
	console.log("Invalid element!!");
	event.preventDefault();
	return;
    }

    event.dataTransfer.setData("text", event.target.id);
    event.currentTarget.style.backgroundColor = "#eab9c1";
    startingSlot = event.currentTarget.parentNode;
    if(event.currentTarget.parentNode.getAttribute('name') == "profile-wrapper-slot"){
	unlockSlot(event.currentTarget.parentNode);
    }
}

function onDragOver(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    if(dropzone.classList == "manager-slot-empty"){
	dropzone.classList.add("manager-slot-hover");
    }
}

function onDragExit(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    dropzone.classList.remove("manager-slot-hover");
}
function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);

    console.log(id);
    if(draggableElement == null){
	console.log("Invalid element!!");
	return
    }
    if(!draggableElement.classList.contains("manager-slot-taken") && !draggableElement.classList.contains("manager-list-slot")){
	console.log("Invalid element!!");
	return;
    }

    draggableElement.style.backgroundColor = "#e19ba7";
    let dropzone = event.currentTarget;
    dropzone.classList.remove("manager-slot-hover");

    let userInfo = draggableElement.children[0];
    let userImg = draggableElement.children[1];

    if(dropzone.id == "manager-user-list-wrapper"){
	draggableElement.classList.remove("manager-slot-taken");
	draggableElement.classList.add("manager-list-slot");
	userInfo.style.display = "flex";
	userImg.style.display = "none";
	getUserById(draggableElement.id).matched = false;

    }else if(dropzone.classList == "manager-list-slot"){
	dropzone = document.getElementById("manager-user-list-wrapper");
	draggableElement.classList.remove("manager-slot-taken");
	draggableElement.classList.add("manager-list-slot");
	userInfo.style.display = "flex";
	userImg.style.display = "none";
	getUserById(draggableElement.id).matched = false;
    }else{
	if(slotTaken(dropzone) == "true"){
	    swapUsers(draggableElement, dropzone);
	    return;
	}else{
	    lockSlot(dropzone);
	    draggableElement.classList.remove("manager-list-slot");
	    draggableElement.classList.add("manager-slot-taken");
	    dropzone.style.opacity = "1";
	    userInfo.style.display = "none";
	    userImg.style.display = "block";
	    getUserById(draggableElement.id).matched = true;
	}
    }

    dropzone.appendChild(draggableElement);
    //event.dataTransfer.clearData();
}

function openProfile(event) {
    console.log("openProfile()");
    // if(mouseOverActive != mouseOverCall) return;
    // mouseOverActive = true;
    event.preventDefault();
    idContainer = event.currentTarget.id; // TODO: dont use global variable

    const popupWindow = document.getElementById("manager-profile-popup");
    const profile = document.getElementById(event.currentTarget.id);
    let name = document.getElementById("manager-profile-popup-name");
    let age = document.getElementById("manager-profile-popup-age");
    let gender = document.getElementById("manager-profile-popup-gender");
    let img = document.getElementById("manager-profile-popup-img");
    let index = parseInt(profile.id.substring(4, profile.id.length), 10);
    img.src = users_json[index].img;
    name.innerHTML = "Name: " + users_json[index].name;
    age.innerHTML = "Age: " + users_json[index].age;
    gender.innerHTML = "Gender: " + users_json[index].gender;

    /* Disable draggable while profile window is active */
    profile.draggable = false;

    /* Make profile window visibel */
    document.querySelector('.manager-profile-popup').style.display = "flex";

    /* Place profile window relative to the profile picture*/
    popupWindow.style.top = profile.offsetTop + 'px';
    popupWindow.style.left = (profile.offsetLeft + (profile.offsetWidth/2)) - (popupWindow.offsetWidth/2) + 'px';
}

function closeProfile(event) {
    console.log("closeProfile()");
    event.preventDefault();

    const id = idContainer;
    const profile = document.getElementById(id);

    profile.draggable = true;

    document.querySelector('.manager-profile-popup').style.display = "none";

    // if(mouseOverActive != mouseOverCall) mouseOverActive = false;
}
function getUserById(userID){
    for(let i=0; i<vm.users.length; i++){
	if(vm.users[i].id == userID){
	    return vm.users[i];
	}
    }
}

function swapUsers(draggableElement, dropzone){

    let element2 = dropzone.children[0];

    if(draggableElement.classList == "manager-list-slot"){

	let name1 = draggableElement.children[0];
	let img1 = draggableElement.children[1];

	let name2 = element2.children[0];
	let img2 = element2.children[1];


	draggableElement.classList.remove("manager-list-slot");
	draggableElement.classList.add("manager-slot-taken");

	element2.classList.remove("manager-slot-taken");
	element2.classList.add("manager-list-slot");
	name1.style.display = "none";
	img1.style.display = "block";

	name2.style.display = "block";
	img2.style.display = "none";
	getUserById(draggableElement.id).matched = true;
    }
    startingSlot.appendChild(element2);
    startingSlot.style.opacity = "1";
    dropzone.appendChild(draggableElement);
    lockSlot(startingSlot);
}

function skipDrag(event){
    console.log("skipDrag()");
    event.preventDefault();
}
