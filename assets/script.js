
var planetsUrl = [
	'./assets/images/planets/001-global.png',
	'./assets/images/planets/002-travel.png',
	'./assets/images/planets/002-travel.png',
	'./assets/images/planets/003-science-2.png',
	'./assets/images/planets/004-science-1.png',
	'./assets/images/planets/005-science.png',
	'./assets/images/planets/006-mars.png',
	'./assets/images/planets/007-planet-earth-1.png',
	'./assets/images/planets/008-earth-globe.png',
	'./assets/images/planets/009-saturn.png',
	'./assets/images/planets/010-uranus.png',
	'./assets/images/planets/011-planet-earth.png',
	'./assets/images/planets/012-jupiter.png',
];

var ally = [
	'./assets/images/ally1.png',
	'./assets/images/ally2.png',
];

var enemy = [
	'./assets/images/enemy1.png',
	'./assets/images/enemy2.png',
];

var asteroids = [
	'./assets/images/aestroid_brown.png',
	'./assets/images/aestroid_dark.png',
	'./assets/images/aestroid_gray.png',
	'./assets/images/aestroid_gray_2.png',
];

var planetSizes = [1, 1.2, 1.4, 1.8, 2];

var onscreen = false;
var onGame = false;

var laserId = 0;
var enemyId = 0;

var x;
var y;

$(document).ready(function(){
   
	document.addEventListener('keyup', (e) => {
    	if((e.code == 'Space' && onGame == true) && onscreen == true){
    		shoot();
    	}
	});
	
	$('#start-btn').click(function(){
		removeStartScreen();
		startGame();
	});

	function removeStartScreen(){
		fadeAndHide($('#logo'));
		fadeAndHide($('#instructions'));
		fadeAndHide($('#tagline'));
		fadeAndHide($('#start-btn'));
		$('#main-spaceship').removeClass('spaceship-animation');
	}

	function shoot(){
		let offset = $('.container').offset();
		let laser = $(`<div class="laser" style="left: "></div>`)
		$('.container').prepend(laser);

		var right = 1200- x;
		var duration = ( right / 1200 ) *500;

		$(laser).css({
			"right": right,
			"top": y
		});

		$(laser).animate({"right": "-20px"}, duration, "linear", () => {
			 $(laser).remove();
		});
	}

	function startGame(){
		drawPlanets();
		onscreen = true;
		onGame = true;
		$('#main-spaceship').css({"margin":""});
		$('.container').addClass('hide-crusor');
		$('.container').on('mousemove', spaceshipMove);
		$('.container').on('mouseenter', ()=>{
			onscreen = true;
		});
		$('.container').on('mouseleave', ()=>{
			onscreen = false;
		});
		spawnObjects();
		detectCollision();
		
	}

	function detectCollision(){
		let spaceship = document.getElementById('main-spaceship')
			.getBoundingClientRect();

		// $('.laser').each( () =>{
		// 	let laser = this;
		// 	$('.asteroid').each(() => {
		// 		console.log($(this).get(0));
		// 		if(doesCollide(this.getBoundingClientRect(), this.getBoundingClientRect()))
		// 			console.log('colide');
		// 	});
		// });

		let lasers = $('.laser');

		for (var i = 0; i < lasers.length; i++) {
			let laser = lasers[i];
			let asteroids = $('.asteroid');
			for (var i = 0; i < asteroids.length; i++) {
				let asteroid = asteroids[i];
				if (doesCollide(laser.getBoundingClientRect(), 
					asteroid.getBoundingClientRect())) {
					console.log('colide');
				}
			}
		}

		setTimeout(detectCollision, 10);
	}

	function doesCollide(ojbect1, object2){
		if ( ojbect1.left < object2.left + object2.width && 
			ojbect1.left + ojbect1.width > object2.left &&
			ojbect1.top < object2.top + object2.height &&
			ojbect1.top + ojbect1.height > object2.top) {
			return true;
		}
		return false;
	}

	function spawnObjects(){
		spawnEnemies();
		spawnAllies();
		spawnAsteroids();
	}

	function spawnAsteroids(){
		let randomTime = Math.floor(Math.random() * 8) * 1000;
		let randomY = Math.floor(Math.random() * (600-100 - 100)) + 100;
		let randomAsteroid = Math.floor(Math.random() * asteroids.length);
		setTimeout( ()=>{
			
			let asteroid = $(`
					<img src="${asteroids[randomAsteroid]}"  class="asteroid" 
					style="top:${randomY}px">
				`);
			$('.container').append(asteroid);

			$(asteroid).animate({'right': '1300px'}, 4000, 'linear', ()=>{
				$(asteroid).remove();
			});

			$(asteroid).change( ()=>{
				console.log('change');
			});

			$(asteroid).on('animationstart', ()=>{
				console.log('animationstart');
			});

			spawnAsteroids();
		}, randomTime);
	}

	function spawnAllies(){
		let randomTime = Math.floor(Math.random() * 8) * 1000;
		let randomY = Math.floor(Math.random() * (600-100 - 100)) + 100;
		let randomAlly = Math.floor(Math.random() * ally.length);
		setTimeout( ()=>{
			
			let allyShip = $(`
					<img src="${ally[randomAlly]}"  class="ship" 
					style="top:${randomY}px" >
				`);
			$('.container').append(allyShip);

			$(allyShip).animate({'right': '1300px'}, 4000, 'linear', ()=>{
				$(allyShip).remove();
			});
			spawnAllies();
		}, randomTime);
	}

	function spawnEnemies(){

		let randomTime = Math.floor(Math.random() * 8) * 1000;
		let randomY = Math.floor(Math.random() * (600-126 - 126)) + 126;
		let randomEnemy = Math.floor(Math.random() * enemy.length);
		setTimeout( ()=>{
			
			let enemyShip = $(`
					<img src="${enemy[randomEnemy]}"  class="ship" 
					style="top:${randomY}px" >
				`);
			$('.container').append(enemyShip);

			$(enemyShip).animate({'right': '1300px'}, 4000, 'linear', ()=>{
				$(enemyShip).remove();
			});
			spawnEnemies();
		}, randomTime);
	}

	function drawPlanets(){
		
		planetNum = Math.floor(Math.random() * planetsUrl.length);
		planetSize = Math.floor(Math.random() * planetSizes.length);
		planetY =  Math.floor(Math.random() * 100);
		drawPlanet(planetNum, planetSize);

		let planet = document.getElementById('planet');
		planet.onload = () => {
			$(planet).css({'top': Math.floor(Math.random()*300)+'px'});
			width = planet.naturalWidth;
			height = planet.naturalHeight;
			duration = 10000 / (500/ height);
			$(planet).animate( {"left": "-1000px"},  duration, "linear" , ()=>{
				$(planet).remove();
				drawPlanets();
			});
		}
		
	}

	function drawPlanet(num, size){
		$('.container').append(`
				<img id="planet" 
				style="transform: scale(${planetSizes[size]});"
				src="${planetsUrl[num]}">
			`);
	}

	function spaceshipMove(event){
		let offset = $('.container').offset();
		x = event.pageX - offset.left;  
		y = event.pageY - offset.top;
		$('#main-spaceship').css({
			"left": x,
			"top": y
		});
	}

	function fadeAndHide(element){
		$(element).effect('fade', null, 500, ()=>{
			hideElement(element);
		});
	}

	function hideElement(element){
		$(element).addClass('hide');
	}

	function showElement(element){
		$(element).removeClass('hide');
	}
});


