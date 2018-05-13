/*author @ngocquyhoang*/
// set general value
var timeDiff = 0;
var gameScore = 0;
var timeCardActive = 0;
var gameMemoriesArray = ['yasuo', 'leblanc', 'jinx', 'tristana', 'vayne', 'garen', 'lux', 'fiora', 'leona', 'zed', 'lucian', 'leesin'];
var pause = false;
var pausePoint = 0;
var timeRemaining = 0;
var gameTime = 0;
var winLose = false;
// bouble array
gameMemoriesArray = gameMemoriesArray.concat(gameMemoriesArray);
// temp array
memoriesArrayActived = [];
memoriesActivedSelector = [];
countActived = 0;

$(document).ready(function(){
	// set ting flip card
	$(".card").flip();
	$('.select-lever').delay(300).slideDown(500, "linear");
	$( "#game-time-bar" ).progressbar({ value: 0, max: 1000,});
	// sulf element
	shuffleArray(gameMemoriesArray);
	// set card
	setCard(gameMemoriesArray);
	Game ();	
});
// audio control...
function muteAudio () {
	var control = $(".control-bar .mute i");
	var video = $('.background-video .tristana-dragon');
    video.prop('muted', !video.prop('muted'));
    if (video.prop('muted') == true) {
		control.removeClass('fa-volume-up');
		control.addClass('fa-volume-off');
    } else{
    	control.removeClass('fa-volume-off');
		control.addClass('fa-volume-up');
    };
};
// game control...
function gameControl () {
	$('div.pause-game').slideDown(500, "linear");
	control = $(".control-bar .pause i");
	control.removeClass('fa-pause-circle');
	control.addClass('fa-play-circle');
	// game pause...
	pause = true;
};
// resume game
function resumeGame () {
	$('div.pause-game').slideUp(500, "linear");
	control = $(".control-bar .pause i");
	control.removeClass('fa-play-circle');
	control.addClass('fa-pause-circle');
	// resume game...
	pause = false;
	// timeout for animation
	setTimeout(function(){ 
		var startTime = new Date();
		timeCount(startTime, gameTime);
	}, 500);
}
function startGame (gameLever) {
	// hide select game lever...
	$('.select-lever').slideUp(500, "linear");
	// set time
	if (gameLever == 1) {
		gameTime = 60000;
	} else if (gameLever == 2) {
		gameTime = 50000;
	} else{
		gameTime = 40000;
	};
	pause = false;
	// timeout for animation
	setTimeout(function(){ 
		var startTime = new Date();
		timeCount(startTime, gameTime);
	}, 500);
};
function resetGame () {
	$('div.pause-game').slideUp(500, "linear");
	$('.end-game').slideUp(500);
	// clear
	memoriesArrayActived = [];
	memoriesActivedSelector = [];
	countActived = 0;
	// sulf element
	shuffleArray(gameMemoriesArray);
	// set card
	setCard(gameMemoriesArray);
	// reset Game score
	gameScore = 0;
	timeCardActive = 0;
	timeDiff = 0;
	// reset time
	winLose = false;
	pause = false;
	pausePoint = 0;
	timeRemaining = 0;
	// timeout for animation
	setTimeout(function(){ 
		var startTime = new Date();
		timeCount(startTime, gameTime);
	}, 500);
	$('#game-score-number').html(gameScore);
	// show all card hidden
	$('.game-card .game-card-box .card').removeClass('correct');
	// unfilp all card
	$('.game-card .game-card-box .card').flip(false);
	$('.over-proteced-box').show(); // do not accept user click when animotion playing
	setTimeout(function () {$('.over-proteced-box').hide();}, 250); // do not accept user click when animotion playing
}
// main game function
function Game () {
	$('.game-card .game-card-box .card').click(function() {
		$('.over-proteced-box').show(); 	// do not accept user click when animotion playing
		setTimeout(function () {$('.over-proteced-box').hide();}, 250); // do not accept user click when animotion playing
		if (memoriesArrayActived.length < 2) {
			if (memoriesArrayActived.length == 0) {
				memoriesArrayActived.push($(this).find('.back').attr('name'));
				memoriesActivedSelector.push($(this));
			} else{
				memoriesArrayActived.push($(this).find('.back').attr('name'));
				memoriesActivedSelector.push($(this));
				// compare value
				if ((memoriesActivedSelector[0].attr("id") !== memoriesActivedSelector[1].attr("id")) && (memoriesArrayActived[0] == memoriesArrayActived[1])) {
					// if true
					countActived += 2;
					// delay for user can see card font
					setTimeout(function() {
						// hidden correct card
						memoriesActivedSelector[0].addClass('correct');
						memoriesActivedSelector[1].addClass('correct');
						// clear array
						memoriesArrayActived = [];
						memoriesActivedSelector = [];
						// make a score
						if ((timeDiff - timeCardActive) <= 10000 ) {
							gameScore = gameScore + 11503 - timeDiff + timeCardActive;
						} else{
							gameScore = gameScore + 1503;
						};
						timeCardActive = timeDiff;
						$('#game-score-number').html(gameScore);
						// check clearn all to win
						if ( countActived == gameMemoriesArray.length ) {
							// show alert win
							setTimeout(function() {
								$('.end-game').slideDown(500);
							}, 500);
							// stop time
							pause = true;
							$('.score-end span.score').html(gameScore);
							$('.score-end span.time-end-game').html($('#timeValue').html());
							// stop time bar
							if (timeDiff <= gameTime) {
								winLose = true;
								if (winLose) {$('.end-game .win-lose span').html('win');} else {$('.end-game .win-lose span').html('lose')};
							} else {
								winLose = false;
								if (winLose) {$('.end-game .win-lose span').html('win');} else {$('.end-game .win-lose span').html('lose')};
							};
						};
					}, 100);
					// end correct
				} else{
					// flip back
					setTimeout(function() {
						// unflip
						memoriesActivedSelector[0].flip(false);
						memoriesActivedSelector[1].flip(false);
						$('.over-proteced-box').show(); // do not accept user click when animotion playing
						setTimeout(function () {$('.over-proteced-box').hide();}, 250); // do not accept user click when animotion playing
						// clear array
						memoriesArrayActived = [];
						memoriesActivedSelector = [];
					}, 500);
				};

			};
		};
	});
}
// set card function
function setCard (gameMemoriesArray) {
	for (var i = 0; i < gameMemoriesArray.length; i++) {
		$('.game-card .game-card-box .card').eq(i).find('.back').attr('name', gameMemoriesArray[i]);
		// set images
		$('.game-card .game-card-box .card').eq(i).find('.back').css('background-image', 'url(./images/' + gameMemoriesArray[i] + '.jpg )');
	};
}
// shuffle array 
function shuffleArray (array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
// time count
function timeCount (start, limit) {
	animateUpdate();
	// count time
	function animateUpdate() {
	    var now = new Date();
	    timeDiff = now.getTime() - start.getTime();
	    if(pause == false){
				if (timeDiff <= (limit + 20)) {
					updateProgress(timeDiff, limit);
					setTimeout(animateUpdate, 10);
				};
		  } else{
		  	timeRemaining = limit - timeDiff;
		  	pausePoint = pausePoint + timeDiff; 
		  };
	};
		// update to view
	function updateProgress(timeAct, limit) {
    $('#game-time-bar').progressbar({ value: (timeAct + pausePoint) , max: gameTime, });
    $('#timeValue').html((timeAct + pausePoint)/1000);
    if (timeAct >= limit) {
    	$('#timeValue').html(gameTime/1000 + '.000');
    	setTimeout(function() {
				$('.end-game').slideDown(500);
			}, 500);
			pause = true;
			$('.score-end span.score').html(gameScore);
			$('.score-end span.time-end-game').html($('#timeValue').html());
			// stop time bar
			if (timeDiff <= gameTime) {
				winLose = true;
				if (winLose) {$('.end-game .win-lose span').html('win');} else {$('.end-game .win-lose span').html('lose')};
			} else {
				winLose = false;
				if (winLose) {$('.end-game .win-lose span').html('win');} else {$('.end-game .win-lose span').html('lose')};
			};      
		};
	};
};
