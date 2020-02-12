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

function onDragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.currentTarget.style.backgroundColor = "yellow";
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");

    const draggableElement = document.getElementById(id);
    draggableElement.style.backgroundColor = "blue";
    const dropzone = event.target;

    dropzone.appendChild(draggableElement);
     //event.dataTransfer.clearData();
}
