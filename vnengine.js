/*jshint esversion: 6 */

var data={"boards":{}, "backpack":{}, "items":{}, "globalActiveBoard":0, "globalitem":0, "animate":false};

function startTheGame() {
	clearData();
	clearGame();
	
	getFile("game.json", b => {
		data.boards = JSON.parse(b);	
		loadBoard(0);
	});
}


function clearData(){
	data={"boards":{},"backpack":{}, "items":{}, "globalActiveBoard":0, "globalitem":0, "animate":false};
}
function clearGame(){
	document.getElementById("startbutton").style.display="none";
	document.getElementById("textarea").style.display="block";
	document.getElementById("itemarea").style.display="flex";
}
function clearAnswers() {
	document.getElementById("answers").innerHTML="";
}


function loadBoard(index) {
	var board=data.boards[index];
	data.globalActiveBoard=index;

	clearAnswers();
	setUpBackground(board);
	document.getElementById("narration").innerHTML = board.narration;
	
	for (let i in board.branches){
		document.getElementById("answers").innerHTML+=`<div class="answer" id="b${board.branches[i]}" onclick="loadBoard('${board.branches[i]}')">${data.boards[board.branches[i]].branchText}</div>`;	
	}
	checkForDeath(board);
}
function setUpBackground(board){
	data.animate=false;
	document.getElementById("content").style.backgroundPositionY = "0px";
	document.getElementById("content").style.backgroundImage=`url(bg/${board.bg}.jpg)`;
	
	if (board.hasOwnProperty("animation")){
		var loop = 1;
		if (board.animation.hasOwnProperty("loop"))
			loop = board.animation.loop;
		
		data.animate = true;
		animateBackground(1, [board.animation.speed, board.animation.frams, loop]);
	}
}
function animateBackground(i, args){
	if (data.animate){
		var speed=args[0];
		var frams=args[1];
		var loop=args[2];
		var pos=600*(frams-(i-1));
		
		document.title=`[${pos}]`;
		document.getElementById("content").style.backgroundPositionY = pos+"px";
		if (i < frams){
			setTimeout(()=>{
				i++;
				return animateBackground(i, args);
			}, speed*1000);
		}
		else{
			setTimeout(()=> {
				return animateBackground(loop, args);
			}, speed*1000);
		}
	}
}
function checkForDeath(board) {
	if (board.death)
		return proposeRestart();
	document.getElementById("answers").removeChild("restart");
}
function proposeRestart() {
	document.getElementById("answers").innerHTML+=`<div id="restart" class="answer" onclick="startTheGame()">Restart the game?</div>`;
}


function checkInteractives(event){
	var x=event.clientX - document.getElementById("content").offsetLeft;
	var y=event.clientY - document.getElementById("content").offsetTop;
	var board=data.boards[data.globalActiveBoard].interactibles;
	
	hideItemAreaIfVisible();
	if (!board)
		return;
	for (let i in board){
		if ((x >= board[i].x1y1[0] && x <= board[i].x2y2[0]) && (y >= board[i].x1y1[1] && y <= board[i].x2y2[1])){
			reactToInteractible(board[i]);
			data.globalitem = i;
			return;
		}
	}
}
function reactToInteractible(interactible){
	if (interactible.type == "item"){ //show item description
		showItemInfo(interactible);
		return;
	}
	if (interactible.type == "branch"){
		if (interactible.hasOwnProperty("requires")){
			if (!data.backpack.hasOwnProperty(interactible.requires)){
				showItemInfo(interactible);
				return;
			}
		}
		loadBoard(interactible.branches);
	}
}
function collectItem(){
	data.backpack[data.globalitem] = data.boards[data.globalActiveBoard].interactibles[data.globalitem];
	delete data.boards[data.globalActiveBoard].interactibles[data.globalitem];
	alert(`You collected ${data.backpack[data.globalitem].description}.`);
}
function showItemInfo(interactible){
	checkForItemPicture(interactible);
	if (interactible.description)
		document.getElementById("item-desc").innerHTML = interactible.description;
	if (interactible.collectible)
		document.getElementById("item-collect").style.display="block";
	document.getElementById("itemarea").style.visibility = "visible";
}
function checkForItemPicture(interactible){
	var itemImg=document.getElementById("item-img");
	
	if (interactible.img){
		itemImg.innerHTML = `<img src="img/${interactible.img}.png" alt="Picture unavailable."/>`;
		itemImg.style.height="200px";
		itemImg.style.width="200px";
		itemImg.style.padding="10px";
	}
	else{
		itemImg.innerHTML = "";
		itemImg.style.height="0";
		itemImg.style.width="0";
		itemImg.style.padding="0";
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
	document.getElementById("item-img").innerHTML = "<img src='src/load.gif' alt='Picture unavailable.'/>";
	document.getElementById("item-desc").innerHTML = "";
	document.getElementById("item-collect").style.display="none";
}


function giveCoordinates(event){
	var x=event.clientX - document.getElementById("content").offsetLeft;
	var y=event.clientY - document.getElementById("content").offsetTop;
	document.getElementById("coordinates").innerHTML = `${x},${y}`;
}
function getFile(url, callback) {
	var path = url;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", path, false);
	xmlhttp.send(null);
	callback(xmlhttp.responseText);
}
