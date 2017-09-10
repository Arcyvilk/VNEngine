var data="";
var active=0;

function startTheGame() {
	getFile(b => {
		data = JSON.parse(b);	
		document.getElementById("startbutton").style.display='none';
		document.getElementById("textarea").style.display='block';
		document.getElementById("itemarea").style.display='flex';
		loadBoard(0);
	});
}
function loadBoard(index) {
	var board=data[index];
	active=index;

	clearAnswers();
	document.getElementById("content").style.backgroundImage=`url("bg/${board.bg}.png")`;
	document.getElementById("narration").innerHTML = board.narration;
	for (i in board.options)
		document.getElementById("answers").innerHTML+=`<div class="answer" id="b${board.options[i]}" onclick="loadBoard(${board.options[i]})">${data[board.options[i]].choiceText}</div>`;	
	checkForDeath(board);
}
function checkForDeath(board) {
	if (board.death){
		proposeRestart();
		return;
	}
	document.getElementById("answers").removeChild("restart");
}

function clearAnswers() {
	document.getElementById("answers").innerHTML='';
}
function proposeRestart() {
	document.getElementById("answers").innerHTML+=`<div id="restart" class="answer" onclick="startTheGame()">Restart the game?</div>`;
}

function checkInteractives(event){
	var x=event.clientX - document.getElementById("content").offsetLeft;
	var y=event.clientY - document.getElementById("content").offsetTop;
	var board=data[active].interactibles;
	
	hideItemAreaIfVisible();
	
	if (!board)
		return;
	for (i in board){
		if ((x >= board[i].x1y1[0] && x <= board[i].x2y2[0]) && (y >= board[i].x1y1[1] && y <= board[i].x2y2[1])){
			reactToInteractible(board[i]);
			return;
		}
	}
}
function reactToInteractible(interactible){
	if (interactible.type == "item"){ //show item description
		if (interactible.img)
			document.getElementById("item-img").innerHTML = `<img src="img/${interactible.img}.png" alt="Picture unavailable."/>`;
		if (interactible.description)
			document.getElementById("item-desc").innerHTML = interactible.description;
		document.getElementById("itemarea").style.visibility = "visible";
	}
}
function hideItemAreaIfVisible(){
	var el=document.getElementById("itemarea");
	if (el.style.visibility != "hidden"){
		el.style.visibility = "hidden";
		clearItemArea();
	}
}
function clearItemArea(){
	document.getElementById("item-img").innerHTML = "";
	document.getElementById("item-desc").innerHTML = "";
}


function giveCoordinates(event){
	var x=event.clientX - document.getElementById("content").offsetLeft;
	var y=event.clientY - document.getElementById("content").offsetTop;
	document.getElementById("coordinates").innerHTML = `${x},${y}`;
}

function getFile(callback) {
	var path = 'boards.json';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", path, false);
	xmlhttp.send(null);
	callback(xmlhttp.responseText);
}
