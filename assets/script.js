
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
		if(document.getElementsByClassName('laser').length == 0){
			let offset = $('.container').offset();
			let laser = $(`<div class="laser"></div>`)
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
	}

	function enemyShoot(enemy){
		enemy[0].onload  = () => {
			let offset = $('.container').offset();
			let x = 1200 - $(enemy).get(0).x - offset.left;
			let y = $(enemy).get(0).y - offset.top;
			let duration = ( 1200 -x  / 1200) * 1000;
			let laser = $(`<div class="red-laser" ></div>`);
			let height = $(enemy)[0].clientHeight;
			console.log(enemy);
			$('.container').prepend(laser);  
			$(laser).css({
				"right": x,
				"top": y + (height/2)
			});
			$(laser).animate({"right": "1220px"}, 1000, "linear", () => {
				$(laser).remove();
			});
		}
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
		setInterval(detectCollision, 1000/60);
	}

	function detectCollision(){
		let spaceship = document.getElementById('main-spaceship');

		let lasers = document.getElementsByClassName("laser");
		let asteroids = document.getElementsByClassName("asteroid");
		let enemies = document.getElementsByClassName("enemies");
		let allies = document.getElementsByClassName("allies");
		let redLaser = document.getElementsByClassName("red-laser");
		
		let laser = lasers[0];

		//test for asteroid collission
		for (var i = 0; i < asteroids.length; i++) {
			let asteroid = asteroids[i];
			
			//collide with laser
			if(!!laser){
				if (doesCollide(laser.getBoundingClientRect(), 
					asteroid.getBoundingClientRect())) {
					$(laser).remove();
					$(asteroid).attr('hit', parseInt($(asteroid).attr('hit'))+1);
					if($(asteroid).attr('hit') == 2){
						$(asteroid).stop();
						$(asteroid).attr('hit', 2);
						$(asteroid).attr('exploded', true);
						$(asteroid).effect('explode', {}, 500, () => {
							$(asteroid).remove();
						});
					} 
				} 
			} 
			
			//asteroid collide with spaceship
			if(doesCollide(spaceship.getBoundingClientRect(), 
			asteroid.getBoundingClientRect()) &&  !!!$(asteroid).attr('exploded')){
				console.log('hit');
				$(asteroid).stop();
				$(asteroid).attr('exploded', true);
				$(asteroid).effect('explode', {}, 500, () => {
					$(asteroid).remove();
				});
			}
		}

		//test for enemy collision
		for (var i = 0; i < enemies.length; i++) {
			let enemy = enemies[i];

			if(!!laser){
				if (doesCollide(laser.getBoundingClientRect(), 
					enemy.getBoundingClientRect())) {
					if(!!!$(enemy).attr('explode')){
						$(laser).remove();
						destroy(enemy);
					} 
				} 
			} 

			if(doesCollide(spaceship.getBoundingClientRect(), 
			enemy.getBoundingClientRect()) &&  !!!$(enemy).attr('explode')){
				destroy(enemy);
			}
		}

		//test for ally collision
		for (var i = 0; i < allies.length; i++) {
			let ally = allies[i];

			if(!!laser){
				if (doesCollide(laser.getBoundingClientRect(), 
					ally.getBoundingClientRect())) {
					if(!!!$(ally).attr('explode')){
						$(laser).remove();
						destroy(ally);
					} 
				} 
			} 

			if(doesCollide(spaceship.getBoundingClientRect(), 
			ally.getBoundingClientRect()) &&  !!!$(ally).attr('explode')){
				destroy(ally);
			}
		}

		//test for enemy laser collision
		for (var i = 0; i < redLaser.length; i++) {
			let laser = redLaser[i];

		
			if (doesCollide(spaceship.getBoundingClientRect(), 
				laser.getBoundingClientRect())) {
				if(!!!$(ally).attr('explode')){
					$(laser).remove();
					console.log('sapul');
				} 
			} 

		}

	}

	function destroy(element){
		$(element).stop();
		$(element).attr('explode', true);
		$(element).effect('explode', {}, 500, () => {
			$(element).remove();
		});
	}

	function doesCollide(ojbect1, object2){
		if (ojbect1.left < object2.left + object2.width && 
			ojbect1.left + ojbect1.width > object2.left &&
			ojbect1.top < object2.top + object2.height &&
			ojbect1.top + ojbect1.height > object2.top) {
			return true;
		} else 
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
					style="top:${randomY}px" hit="0">
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
					<img src="${ally[randomAlly]}"  class="ship allies" 
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
					<img src="${enemy[randomEnemy]}"  class="ship enemies" 
					style="top:${randomY}px" >
				`);
			$('.container').append(enemyShip);

			$(enemyShip).animate({'right': '1300px'}, 4000, 'linear', ()=>{
				$(enemyShip).remove();      
			});

			enemyShoot(enemyShip);
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