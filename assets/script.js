
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

var planetSizes = [1, 1.2, 1.4, 1.8, 2];

var onscreen = false;
var onGame = false;

var laserId = 0;

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
		$('.container').prepend(`
			<div id="laser" style="left: "></div>
		`);

		var laser = $('#laser');
		var right = 1200- x;
		var duration = ( right / 1200 ) *500;
		console.log(laser);

		$(laser).css({
			"right": right,
			"top": y
		});


		$(laser).animate({"right": "-20px"}, duration, "linear", () => {
			 $(laser).remove();
		});

		laserId++;
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


