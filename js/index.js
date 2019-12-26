var sceneManagerGame;
var pnrMng = new PNRManager();
var cardsArr = [];
var sceneManagerGame;
var questions = 25;
var timestampInit = 0;
var timestampFinal = 0;

$(document).ready(function() {
	//---
	var startScene = $('#startScene');
	var startButton = $('.start');
	var clear = $('#clear');
	//---
	var PNRSelectorScene = $('#PNRSelectorScene');
	var cardsContainer = $('#cardsContainer');
	var cardsHtml = generateCards(questions);
	cardsContainer.html(cardsHtml);

	var cards = $('div[id^="quiz-card-"]');
	var gameTimer = $('#gameTimer');
	//---
	var rankingScene = $('#rankingScene');
	var finalResultAnswers = $('.final-result-answers', rankingScene);
	var finalResultTime = $('.final-result-time', rankingScene);
	var restartButton = $('.restart');
	var highScore = $('#highScore');
	var cite = $('#cite');

	//---
	sceneManagerGame = new SceneManager();
	sceneManagerGame.addScene(startScene);
	sceneManagerGame.addScene(PNRSelectorScene);
	sceneManagerGame.addScene(rankingScene);

	//---
	var clock;

	startButton.on('click', function() {
		nextScene();
		timestampInit = Date.now();

		clock = setInterval(function() {
			$(gameTimer).html(globalClock);
		}, 1000);
	});

	clear.on('click', function() {
		localStorage.clear();
		refresh();
	});

	restartButton.on('click', function() {
		refresh();
	});

	// -------------------------------------------------
	// Walk for each card
	// -------------------------------------------------
	for (const card of cards) {
		var cardId = $(card)[0].id;
		var cardPNR = pnrMng.getPNRFakeOrReal();
		var cardIsOk = pnrMng.validate(cardPNR);
		var cardAnswer = false;

		var obj = {
			id: cardId,
			pnr: cardPNR,
			isOk: cardIsOk,
			answer: cardAnswer
		};
		cardsArr.push(obj);

		// -------------------------------------------------
		// Show pnr in card DOM
		// -------------------------------------------------
		$('.PNR', '#' + cardId).html(cardPNR);

		// -------------------------------------------------
		// Set Event
		// -------------------------------------------------
		$(card).on('click', function(event) {
			let thisCardId = $(card)[0].id;
			let userResponse = event.target.value;

			if (userResponse != undefined) {
				//$('#' + thisCardId).hide();
				//console.log(questions);

				questions--;

				var arrPorID = getObjectFromArray(cardsArr, 'id', thisCardId);
				arrPorID.answer = userResponse === 'true' ? true : false;

				if (arrPorID.answer) {
					anime({
						targets: '#' + thisCardId,
						translateY: {
							value: -100,
							duration: 500
						},
						translateX: {
							value: 350,
							duration: 500
						},
						rotate: {
							value: 90,
							duration: 500
						},
						easing: 'easeInOutExpo',
						opacity: {
							value: 0,
							duration: 500
						}
					});
				}
				else {
					anime({
						targets: '#' + thisCardId,
						translateY: {
							value: -100,
							duration: 500
						},
						translateX: {
							value: -350,
							duration: 500
						},
						rotate: {
							value: -90,
							duration: 500
						},
						easing: 'easeInOutExpo',
						opacity: {
							value: 0,
							duration: 500
						}
					});
				}

				if (questions === 0) {
					nextScene();
					let scoreAnswers = getAnswersOk() + '/' + getTotalQuestions();
					let scoreTime = getActualTime();
					let finalResultAnswerHtml = scoreAnswers;
					$(finalResultAnswers).html(finalResultAnswerHtml);
					$(finalResultTime).html(scoreTime);

					saveHighScore();

					$(highScore).html(showHighScore());
					$(cite).html(phrases[getAnswersOk()]);

					clearInterval(clock);
				}
			}
		});
	}

	//---
	$(highScore).html(showHighScore());
});

function showHighScore() {
	let score = getHighScore();
	let objTime = TimeCounter(score.time);

	return (
		'High Score: ' +
		score.answers +
		'/' +
		getTotalQuestions() +
		' in ' +
		objTime.hours +
		':' +
		objTime.minutes +
		':' +
		objTime.seconds
	);
}

function getHighScore() {
	var highScoreAnswers = localStorage.getItem('highScoreAnswers') || 0;
	var highScoreTime = localStorage.getItem('highScoreTime') || 0;

	return {
		answers: highScoreAnswers,
		time: highScoreTime
	};
}
function saveHighScore(answers, time) {
	timestampFinal = Date.now();
	var answersOk = getAnswersOk(); // Return a int (ej: 7)
	var totalSeconds = calculateSecondsBeweenTimestamp(timestampInit, timestampFinal); // Return seconds (ej: 72)

	var highScoreAnswers = localStorage.getItem('highScoreAnswers') || 0;
	var highScoreTime = localStorage.getItem('highScoreTime') || 1000000000;

	if (highScoreAnswers == answersOk) {
		if (highScoreTime >= totalSeconds) {
			localStorage.setItem('highScoreAnswers', answersOk);
			localStorage.setItem('highScoreTime', totalSeconds);
		}
	}

	if (highScoreAnswers < answersOk) {
		localStorage.setItem('highScoreAnswers', answersOk);
		localStorage.setItem('highScoreTime', totalSeconds);
	}
}

function getAnswersOk() {
	let answerOk = 0;
	cardsArr.forEach(function(objCard) {
		if (objCard.isOk === objCard.answer) {
			answerOk++;
		}
	});
	var result = answerOk;

	return result;
}

function getTotalQuestions() {
	return cardsArr.length;
}

function getObjectFromArray(arr, attr, attrValue) {
	var result = false;

	arr.forEach((element) => {
		if ('' + attr + '' in element && element.id === '' + attrValue + '') {
			result = element;
		}
	});

	return result;
}

function nextScene() {
	var actualScene = sceneManagerGame.getActualScene();
	var newScene = sceneManagerGame.getNextScene();

	actualScene.hide();
	newScene.show();
}

var seconds = 0;
var minutes = 0;
var hours = 0;

function globalClock() {
	seconds++;
	if (seconds > 59) {
		seconds = 0;
		minutes += 1;
	}

	if (minutes > 59) {
		minutes = 0;
		hours += 1;
	}

	if (hours > 23) {
		hours = 0;
	}

	return getActualTime();
}

function getActualTime() {
	return checkZero(hours) + ':' + checkZero(minutes) + ':' + checkZero(seconds);
}

function TimeCounter(sec) {
	if (sec == undefined) {
		sec = 0;
	}

	t = parseInt(sec.toString());
	var days = parseInt(t / 86400);

	t = t - days * 86400;
	var hours = parseInt(t / 3600);

	t = t - hours * 3600;
	var minutes = parseInt(t / 60);

	t = t - minutes * 60;
	var seconds = t;

	return {
		days: checkZero(days.toString()),
		hours: checkZero(hours.toString()),
		minutes: checkZero(minutes.toString()),
		seconds: checkZero(seconds.toString())
	};
}

function checkZero(number) {
	if (number < 10) {
		return '0' + number;
	}
	return number;
}

function calculateSecondsBeweenTimestamp(t1, t2) {
	var totalSeconds = Math.floor((t2 - t1) / 1000);
	return totalSeconds;
}

function calculateMilisecondsBeweenTimestamp(t1, t2) {
	var totalSeconds = Math.floor(t2 - t1);
	return totalSeconds;
}

function generateCards(questions) {
	var cardsElements = '';
	for (let index = 0; index < questions; index++) {
		cardsElements += `<div id="quiz-card-${index}" class="quiz-card col">
		<div class="PNR">QPQTSX</div>
		<div class="row d-flex justify-content-center buttons-options">
			<button class="col-md-5" value="false">False</button>
			<button class="col-md-5" value="true">True</button>
		</div>
	</div>`;
	}
	return cardsElements;
}

function refresh() {
	window.location = './index.html';
}
