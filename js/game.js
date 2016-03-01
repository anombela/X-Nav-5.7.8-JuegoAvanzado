// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos


//princesa ocupa 16
//arboles ocupan 32


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

//piedras.......................................
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";
//...............................................

//monstruos.......................................
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";
//...............................................



// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: canvas.width / 2,
	y: canvas.height / 2
};
var princess = {};
var princessesCaught = 0;  //princesas atrapadas
var stones = [  //array de piedras
];
var numstones = 3;
var monsters = [  //array de monstruos
];
var nummonsters = 1 ;
var lives = 3;  //vidas

// Handle keyboard controls
var keysDown = {};
var pause = false;
var newgame = false;
var start = true;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener("keypress", function(e){
	if (e.charCode == 32){
		var p = document.getElementById("main");
		var texto = "";
		if (pause){
			if (newgame){
				newgame = false;
				startnewgame();
			}
			pause = false;
		}else{
			texto = "<h2 id='pause'>PAUSA</h2>"
			pause = true;
		}
		p.innerHTML = texto;
	}
}, false);



  
function touching(array){

	for( var i = 0 ;  i < array.length ; i++){
		if (hero.x <= (array[i].x + 16)  
			&& array[i].x <= (hero.x + 16) 
			&& hero.y <= (array[i].y + 16) 
			&& array[i].y <= (hero.y + 16))
		
			return true;  //si alguno se da acaba como true
	}
	return false;
	

};

function startnewgame(){

	hero = {
		speed: 256, // movement in pixels per second
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	princessesCaught = 0;  //princesas atrapadas
	numstones = 3;
	nummonsters = 1 ;
	lives = 3;  //vidas
	localStorage.setItem('lives',lives);
	localStorage.setItem('princessesCaught',princessesCaught);
	reset();
};

// Reset the game when the player catches a princess
var reset = function () {//posicion inicial de princesa y heroe
	/*hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;*/
	stones = [];
	monsters = [];

	// Throw the princess somewhere on the screen randomly
	//-----con los bucles la princesa ya no estara entre los arboles nunca
	do{
		princess.x = 32 + (Math.random() * (canvas.width - 64));
	}while(princess.x > canvas.width - 64);
	do{
		princess.y = 32 + (Math.random() * (canvas.height - 64));
	}while(princess.y > canvas.height - 64);


	for( var i = 0 ;  i < numstones; i++){
		var stone = {};
		do{
			stone.x = 32 + (Math.random() * (canvas.width - 64));
		}while(stone.x > canvas.width - 64 ||
			   (stone.x >= canvas.width / 2  &&
			   stone.x <= (canvas.width / 2) + 16) ||//distinto posicion inicial 
			   (stone.x >= princess.x  &&
			   stone.x <= princess.x + 16)  ||//distinta posicion princesa
			   (stone.x >= hero.x - 32 &&
			   stone.x <= hero.x + 16 + 32)  //distinta posicion heroe seguridad de 32
			   );
		do{
			stone.y = 32 + (Math.random() * (canvas.height - 64));
		}while(stone.y > canvas.height - 64 ||
			   (stone.y <= canvas.height / 2  &&
			   stone.y >= (canvas.height / 2) - 16) ||//distinto posicion inicial 
			   (stone.y <= princess.y  &&
			   stone.y >= princess.y - 16) || //distinta posicion princesa
			   (stone.y <= hero.y + 32 &&
			   stone.y >= hero.y - 16 - 32)  //margen de seguridad de 32
			   );

		stones.push(stone);
	}

	for( var i = 0 ;  i < nummonsters; i++){
		var monster = {};
		do{
			monster.x = 32 + (Math.random() * (canvas.width - 64));
		}while(monster.x > canvas.width - 64);
		do{
			monster.y = 32 + (Math.random() * (canvas.height - 64));
		}while(stone.y > monster.height - 64);

		monsters.push(monster);
	}

};

// Update game objects
var update = function (modifier) { //modifier es variable de tiempo creo

	if (pause) { // nada se mueve en pausa
		return;	
	}
	
	if (38 in keysDown ) { // Player holding up
		var aux = hero.y;
		hero.y -= hero.speed * modifier;
		if (hero.y <= 32 || touching(stones))
			hero.y = aux;
	}
	if (40 in keysDown) { // Player holding down
		var aux = hero.y;
		hero.y += hero.speed * modifier;
		if (hero.y >= canvas.height - 64 || touching(stones))
			hero.y = aux;
	}
	if (37 in keysDown) { // Player holding left
		var aux = hero.x;
		hero.x -= hero.speed * modifier;
		if (hero.x < 32 || touching(stones))
			hero.x = aux;
	}
	if (39 in keysDown) { // Player holding right
		var aux = hero.x;
		hero.x += hero.speed * modifier;
		if (hero.x >= canvas.width - 64 || touching(stones))
			hero.x = aux;
	}


//////////mosterssss movimientos///////////
	for( var i = 0 ;  i < nummonsters; i++){
		if (monsters[i].x < hero.x){
			monsters[i].x += (hero.speed/8) * modifier
		}else{
			monsters[i].x -= (hero.speed/8) * modifier
		}

		if (monsters[i].y < hero.y){
			monsters[i].y += (hero.speed/8) * modifier
		}else{
			monsters[i].y -= (hero.speed/8) * modifier
		}
	}
	if (touching(monsters)){
		--lives;
		if (lives <= 0){
			newgame = true;
			pause = true;
			var p = document.getElementById("main");
			p.innerHTML = "<h2 id='gameover'>HAS PERDIDO</h2>" +
			"<div id='nmain'>Pulsa barra espaciadora para nuevo juego.</div>";
			
		}else{
			reset();
		}
	}
///////////////////////////////////////////

	// Are they touching?  //se tocan la princesa y el heroe
	if (
		hero.x <= (princess.x + 16)  //toca por el lado derecho de la princesa
		&& princess.x <= (hero.x + 16)  //lado izquierdo princesa
		&& hero.y <= (princess.y + 16)  //abajo princesa
		&& princess.y <= (hero.y + 16)   //arriba princesa
	) {
		++princessesCaught;
		numstones = 3 + Math.floor(princessesCaught / 3 ); //cada 3 princesas 1 piedra mas
		nummonsters = 1 + Math.floor(princessesCaught / 6 );  //cada 6 princesas 1 monstruo mas
		reset();  //para resetear(seguir jugando)
	}
};

// Draw everything
var render = function () {
	if (bgReady) { ///si esta ya cargado el background
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) { //ha cargado el heroe
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {  //ha cargado la princesa
		ctx.drawImage(princessImage, princess.x, princess.y);
	}
	//++++++++++++++++++++++++++++++++
	if (stoneReady) {  //ha cargado la princesa
		for( var i = 0 ;  i < stones.length ; i++){
			ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		}
	}
	//++++++++++++++++++++++++++++
	//++++++++++++++++++++++++++++++++
	if (monsterReady) {  //ha cargado la princesa
		for( var i = 0 ;  i < monsters.length ; i++){
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}
	//++++++++++++++++++++++++++++
	//hasta aqui ha pintada el fondo la princesa y el heroe

	// Score  //el texto que aparece
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesas: " + princessesCaught, 32, 32); //escribe texto
	ctx.fillText("Vidas: " + lives, 380, 32); //escribe texto
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	princessesCaught = localStorage.getItem('princessesCaught');
	lives = localStorage.getItem('lives');
	if (lives <= 0 && start){
		startnewgame();
	}
	start = false;

	update(delta / 1000);
	render();

	localStorage.setItem('lives',lives);
	localStorage.setItem('princessesCaught',princessesCaught);
	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible  //bucle que se ejecuta cada milisegundo
