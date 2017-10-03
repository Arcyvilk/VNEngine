/*jshint esversion: 6 */
var data={"boards":{}, "backpack":[], "items":{}, "animate":false};

document.onkeydown = checkKey;

function startTheGame() {
	clearData();
	clearGame();
	
	try{
		getFile("game/game.json", boards => {
			getFile("game/items.json", items => {
				data.boards = JSON.parse(boards);
				data.items = JSON.parse(items);	
				loadBoard("start");
			});
		});
	}
	catch(e){
		//alert(`Failed to load the game files.\n${e}`);
	}
}
function clearData(){
	data={"boards":{},"backpack":["b1meds"], "items":{}, "animate":false};
}
function clearGame(){
	document.getElementById("startbutton").style.display="none";
	document.getElementsByClassName("textarea")[0].style.display="block";
	document.getElementsByClassName("itemarea")[0].style.display="flex";
	document.getElementsByClassName("content")[0].style.backgroundColor="transparent";
}
function clearAnswers() {
	document.getElementById("answers").innerHTML="";
}


function fadeOut(callback){
	var bg = document.getElementsByClassName("content")[0];
	var opacity = 1;
	var timer=setInterval( function(){
		if (opacity <= 0.1){
			callback();
			clearInterval(timer);
		}
		bg.style.opacity = opacity;
		opacity = opacity - 0.01;
	},3);
}
function fadeIn(callback) {
	var bg = document.getElementsByClassName("content")[0];
	var opacity = 0;
	var timer=setInterval( function(){
		if (opacity >= 1){
			callback();
			clearInterval(timer);
		}
		bg.style.opacity = opacity;
		opacity = opacity + 0.01;
	},3);
}



function loadBoard(index) {
	var content=document.getElementsByClassName("content")[0];
	var board=data.boards[index];
	content.id=index;
	
	fadeOut(() => {
		setUpBackground(board, () => {
			clearAnswers();
			document.getElementById("narration").innerHTML = board.narration;
			for (let i in board.branches){
				document.getElementById("answers").innerHTML+=`<div class="answer" id="b${board.branches[i]}" onclick="loadBoard('${board.branches[i]}')">${data.boards[board.branches[i]].branchText}</div>`;	
			}
			checkForDeath(board);
			fadeIn(() => {});
		});
	});
}
function setUpBackground(board, callback){
	var content=document.getElementsByClassName("content")[0];
	var bg=new Image();
	
	bg.onload = function(){
		data.animate=false;
		content.style.backgroundPositionY = "0px";
		content.style.backgroundImage=`url(${this.src})`;
		if (board.hasOwnProperty("animation")){
			var loop = 1;
			if (board.animation.hasOwnProperty("loop"))
				loop = board.animation.loop;
			
			data.animate = true;
			animateBackground(1, [board.animation.speed, board.animation.frams, loop]);
		}
		callback();
	}
	bg.src=`game/bg/${board.bg}.jpg`;
}
function animateBackground(i, args){
	if (data.animate){
		var speed=args[0];
		var frams=args[1];
		var loop=args[2];
		var pos=600*(frams-(i-1));
		
		document.getElementsByClassName("content")[0].style.backgroundPositionY = pos+"px";
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
	if (document.getElementById("restart"))
		document.getElementById("answers").removeChild("restart");
}
function proposeRestart() {
	document.getElementById("answers").innerHTML+=`<div id="restart" class="answer" onclick="startTheGame()">Restart the game?</div>`;
}


function checkInteractives(event){
	var x=event.clientX - document.getElementsByClassName("content")[0].offsetLeft;
	var y=event.clientY - document.getElementsByClassName("content")[0].offsetTop;
	var activeBoard=document.getElementsByClassName("content")[0].id;
	var board=data.boards[activeBoard].interactibles;
	
	hideItemAreaIfVisible();
	if (!board)
		return;
	for (let interactible in board){
		if (x >= board[interactible].x1 && x <= board[interactible].x2 && y >= board[interactible].y1 && y <= board[interactible].y2){
			reactToInteractible(data.items[interactible]);
			document.getElementsByClassName("itemarea")[0].id=interactible;
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
		if (interactible.hasOwnProperty("requires") && data.backpack.indexOf(interactible.requires) == -1){
			showItemInfo(interactible);
			return;
		}
		loadBoard(interactible.branches);
	}
}
function collectItem(){
	var activeBoard=document.getElementsByClassName("content")[0].id;
	var activeItem=document.getElementsByClassName("itemarea")[0].id;
	
	data.backpack.push(activeItem);
	delete data.boards[activeBoard].interactibles[activeItem];
	alert(`You collected ${data.items[activeItem].name}.`);
}
function showItemInfo(interactible){
	checkForItemPicture(interactible);
	if (interactible.description)
		document.getElementById("item-desc").innerHTML = interactible.description;
	if (interactible.collectible)
		document.getElementById("item-collect").style.display="block";
	document.getElementsByClassName("itemarea")[0].style.visibility = "visible";
}
function checkForItemPicture(interactible){
	var itemImg=document.getElementById("itemarea-img");
	
	if (interactible.img){
		var downloadedItemImage=new Image();		
		
		itemImg.style.height="200px";
		itemImg.style.width="200px";
		itemImg.style.padding="10px";
		
		downloadedItemImage.onload = function(){
			document.getElementById("item-img").src=this.src;
			itemImg.style.backgroundImage = "none";
		};
		downloadedItemImage.src=`game/img/${interactible.img}.png`;	
	}
	else{
		itemImg.style.height="0";
		itemImg.style.width="0";
		itemImg.style.padding="0";
	}
}
function hideItemAreaIfVisible(){
	var el=document.getElementsByClassName("itemarea")[0];
	if (el.style.visibility != "hidden"){
		el.style.visibility = "hidden";
		clearItemArea();
	}
}
function clearItemArea(){
	document.getElementById("itemarea-img").style.background = "url(src/load.gif) 50% no-repeat";
	document.getElementById("item-img").src="";
	document.getElementById("item-desc").innerHTML = "";
	document.getElementById("item-collect").style.display="none";
}
function openInventory(){
	var el=document.getElementsByClassName("inventoryarea")[0];
	var list=document.getElementById("inv-list");
	var l=data.backpack.length;
	
	list.innerHTML="";
	for (item of data.backpack){
		var node=document.createElement("li");
		node.innerHTML = `<div class="inv-pict" style="background-image:url(game/img/${data.items[item].img}.png);"></div>
						<div class="inv-desc">${data.items[item].name}</div>
						<div class="inv-numb"></div>`;
		list.appendChild(node);
	}
	if (el.style.visibility != "visible")
		el.style.visibility = "visible";
	else el.style.visibility = "hidden";
}


function giveCoordinates(event){
	var x=event.clientX - document.getElementsByClassName("content")[0].offsetLeft;
	var y=event.clientY - document.getElementsByClassName("content")[0].offsetTop;
	document.getElementsByClassName("coordinates")[0].innerHTML = `${x},${y}`;
}
function getFile(url, callback) {
	var path = url;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", path, false);
	xmlhttp.send(null);
	callback(xmlhttp.responseText);
}

//event listeners
window.onload = function() {
	var content = document.getElementsByClassName("content")[0];
	content.addEventListener("click", checkInteractives, false);
	var startbutton = document.getElementById("startbutton");
	startbutton.addEventListener("click", startTheGame, false);
	var itemcollect = document.getElementById("item-collect");
	itemcollect.addEventListener("click", collectItem, false);
}

function checkKey(e){
	if (!document.getElementsByClassName("content")[0].id) //this blocks opening inventory in the pre-starting board
		return;
		
	e = e || window.event;	
	if (e.keyCode == '73') { //inv
		openInventory();
		return;
	}
	if (e.keyCode == '67') { //coord
	var el=document.getElementsByClassName("coordinates")[0];
		if (el.style.visibility != "visible")
			el.style.visibility = "visible";
		else el.style.visibility = "hidden";
		
		return;
	}
}