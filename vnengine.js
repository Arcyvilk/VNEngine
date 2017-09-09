var boards="";

function startTheGame() {
	document.getElementById("startbutton").style.display='none';
	clearAnswers();		
	getFile(b => {
		boards = JSON.parse(b);
		loadBoard(0);
	});
}
function findBoard(index) {
	clearAnswers();
	loadBoard(index);
}
function loadBoard(index) {
	var board=boards[index];
		
	document.getElementById("narration").innerHTML = board.narration;
	document.getElementById("content").style.backgroundImage=`url(img/${board.background}.png)`;
	for (i in board.options)
		document.getElementById("answers").innerHTML+=`<div class="answer" id="b${board.options[i]}" onclick="findBoard(${board.options[i]})">${boards[board.options[i]].choiceText}</div>`;
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

function getFile(callback) {
	var path = 'boards.json';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", path, false);
	xmlhttp.send(null);
	callback(xmlhttp.responseText);
}
