var boards="";

function startTheGame() {
	document.getElementById("startbutton").style.display='none';
	clearAnswers();		
	getFile(b => {
		boards = JSON.parse(b);
		loadBoard(0);
	});
}
function findBoard(id) {
	var text=document.getElementById(id).innerHTML;
	
	clearAnswers();
	for (i in boards){
		if (boards[i].choiceText == text)
			loadBoard(i);
	}
}
function loadBoard(index) {
	var board=boards[index];
	
	document.getElementById("narration").innerHTML = board.narration;
	document.getElementById("content").style.backgroundImage="url(img/"+board.background+".png)";
	for (i in board.options)
		document.getElementById("answer"+i).innerHTML = boards[board.options[i]].choiceText;
	checkForDeath(index);
}
function checkForDeath(i) {
	if (boards[i].death){
		proposeRestart();
		return;
	}
	document.getElementById("restart").innerHTML='';
}

function clearAnswers() {
	document.getElementById("answer0").innerHTML='';
	document.getElementById("answer1").innerHTML='';
	document.getElementById("answer2").innerHTML='';
	document.getElementById("restart").innerHTML='';
}
function proposeRestart() {
	document.getElementById("restart").innerHTML='Restart the game?';
}

function getFile(callback) {
	var path = 'boards.json';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", path, false);
	xmlhttp.send(null);
	callback(xmlhttp.responseText);
}
