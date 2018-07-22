var width = 720;
var height = 600;
var balloons = [];
var b_size = 150;
var b_x = 200;
var b_y = 450;
var b_total = 2;
var speed = 2;
var positions = [];
var answer = '';
var score = 0;
var level = -1;
var checked = false;
var correct = false;
var alpha = 0;
var dalpha = 0.05;
var button = 'START';
var started = false;
var exploding = [];
var t_expl = 0;
var pop = new Audio();
var panel = new Image();
var scoreCloud = new Image();
var imgs = [];
var expls = [];
pop.src = 'sound/pop1.mp3';
panel.src = 'img/panel1.png';
scoreCloud.src = 'img/score.png';
var sentences = ["Alan does not like eggs",
	"we do not drink tea in the evening",
	"does your dad go to work by train ?",
	"do they sell tomatoes in this shop ?",
	"do you pay for the tickets ?",
	"when do they meet ?",
	"they do not drive to work every day",
	"I do not eat cereals in the morning",
	"does she often dance ?",
	"you do not drink much coffee",
	"what do you buy in the supermarket ?",
	"how does he carry such a heavy bag ?",
	"we do not go to the cinema every Wednesday",
	"where does Harry study?",
	"he does not want to be an accountant",
	"do they wear suits to work ?",
	"he does not say much",
	"does she make dinner at the weekends ?",
	"I do not leave work on time very often",
	"why does your brother always get into trouble ?",
	"did Claire finish the housework ?",
	"did Ronald visit the Tower of London ?",
	"did she make the invitation cards herself ?",
	"did the girl drop the ketchup bottle ?",
	"did they practise karate this morning ?",
	"they did not visit a farm two weeks ago",
	"my mother did not crash into the van",
	"he did not drink milk at school",
	"Mandy did not tidy up her room on Thursday",
	"I did not like physics at school",
	"he does not feel good",
	"she was training at 6 o'clock",
	"do you want to play ?",
	"did she make a cake ?",
	"we did not want to upset you",
	"is she doing this project with us ?",
	"they are travelling around the world",
	"I did not call you because I was in a hurry",
	"Greg and John are playing chess at the moment",
	"she did not ask a lot of questions",
	"did you take photos when you were on holiday ?",
	"Christian did not buy a new guitar",
	"did the ladies have a cup of tea in the café ?",
	"did Nancy text in the French lesson ?",
	"the friends did not get new computers",
	"did your brother say hello to people in the street ?",
	"did the teacher open the windows in your classroom ?",
	"did the girls in your class play chess two weeks ago ?",
	"did your mother make breakfast yesterday morning ?",
	"he is not shouting her name",
	"we are taking nice photos",
	"is Phil explaining the exercise ?",
	"what are you doing here ?",
	"I am not sitting on the sofa",
	"the cat is not lying on the carpet",
	"are they listening to the radio now ?",
	"the eagle is catching the mouse",
	"why is Ruth asking for money ?",
	"the boys are not diving into the pool",
	"the children are not asking questions",
	"Nick is not going to the gym",
	"I am not opening the door",
	"he is not telling jokes",
	"the baby is not crying now",
	"we are not visiting a farm",
	"they are not answering the phone",
	"my friends are not eating hamburgers",
	"my teacher is not waiting at the bus stop",
	"the rabbit is not climbing over the fence",
	"she was not eating a cheeseburger",
	"they were not painting pictures",
	"Johnny was not riding his bike",
	"we were not working on the computer",
	"Doris was not watching the news on TV",
	"was Ashley working on the computer ?",
	"were they repairing the bike ?",
	"was Melissa taking out a book ?",
	"were you listening to music?",
	"was Nicolas looking at a picture ?",
	"we were sitting at the breakfast table when the doorbell rang"
];

var j, x, i;
for (i = sentences.length - 1; i > 0; i--) {
	j = Math.floor(Math.random() * (i + 1));
	x = sentences[i];
	sentences[i] = sentences[j];
	sentences[j] = x;
}

for (var i = 0; i < 8; i++) {
	var img = new Image();
	var imge = new Image();
	img.src = 'img/' + (i + 1) + '.png';
	imge.src = 'img/' + (i + 1) + 'e.png';
	imgs.push(img);
	expls.push(imge);
}

function fillBalloons() {
	positions = [];
	var randInt = Math.floor(Math.random() * 8)
	var text = sentences[level].split(' ');
	for (var i = 0; i < text.length; i++) {
		while (true) {
			b_x = Math.floor(Math.random() * 4);
			b_y = Math.floor(Math.random() * 3);
			coordinates = b_x + '#' + b_y;
			if (!positions.includes(coordinates)) {
				positions.push(coordinates);
				break;
			}
		}
		b_x = b_x * 180 + Math.floor(Math.random() * 40 - 20);
		b_y = b_y * 200 + 400 + Math.floor(Math.random() * 100);

		var img = imgs[(i + randInt) % 8];
		var expl = expls[(i + randInt) % 8];
		balloons.push([img, b_x, b_y, speed, text[i], expl]);
	}
}

function drawBalloons() {
	for (var i = 0; i < balloons.length; i++) {
		ctx.drawImage(balloons[i][0], balloons[i][1], balloons[i][2], b_size, b_size);
		ctx.font = '25px Arial';
		ctx.fillStyle = 'white';
		textWidth = ctx.measureText(balloons[i][4]).width
		textWidthMax = ctx.measureText('question').width
		if (textWidth > textWidthMax) {
			ctx.font = Math.floor(textWidthMax / textWidth * 25) + 'px Arial';
			textWidth = ctx.measureText(balloons[i][4]).width;
		}
		ctx.fillText(balloons[i][4], balloons[i][1] + b_size / 2 - textWidth / 2, balloons[i][2] + b_size / 2);
	}
}

function drawAnswer() {
	ctx.drawImage(panel, 0, 0);
	ctx.font = '30px Arial';
	if (!checked) {
		ctx.fillStyle = '#0a3d62';
	} else {
		ctx.fillStyle = (correct ? '#1dd1a1' : '#ff6b6b');

	}

	textWidth = ctx.measureText(answer).width;
	if (textWidth > 650) {
		ctx.font = Math.floor(650 / textWidth * 30) + 'px Arial';
		textWidth = ctx.measureText(answer).width;
	}
	ctx.fillText(answer, width / 2 - textWidth / 2, 540);

	if (checked && !correct) {
		ctx.fillStyle = '#0a3d62';
		ctx.font = '20px Arial';
		key = '(' + sentences[level] + ')';
		textWidth = ctx.measureText(key).width;
		ctx.fillText(key, width / 2 - textWidth / 2, 570);
	}
}

function drawScore() {
	ctx.drawImage(scoreCloud, 0, 0);
	ctx.font = '50px Arial';
	textWidth = ctx.measureText(score).width;
	ctx.fillStyle = '#48dbfb';
	ctx.fillText(score, 60 - textWidth / 2, 90);
	ctx.font = '30px Arial';
	ctx.fillText('score', 30, 35);
}

function drawButton() {
	ctx.font = '70px Arial';
	ctx.fillStyle = 'rgba(255, 255, 255,' + alpha + ')';
	textWidth = ctx.measureText(button).width;
	ctx.fillText(button, width / 2 - textWidth / 2, 300);
	alpha = Math.max(0, Math.min(1, alpha + dalpha));
}

function nextLevel() {
	if ((alpha == 0) && (dalpha < 0) && (level < sentences.length - 1)) {
		checked = false;
		if (!started) {
			started = true;
			button = 'NEXT';
		}
		dalpha *= -1;
		level += 1;
		answer = '';
		b_x = 200;
		b_y = 450;
		fillBalloons();
	}
}

function pressButton(mx, my) {
	textWidth = ctx.measureText(button).width;
	if ((mx < (width / 2 + textWidth)) &&
		(mx > (width / 2 - textWidth)) &&
		(my < 300 + 40) &&
		(my > 300 - 40)) {
		if (dalpha > 0) dalpha *= -1;
	}
}

function moveBalloons() {
	for (var i = 0; i < balloons.length; i++) {
		if (balloons[i][2] > -b_size) {
			balloons[i][2] -= speed;
		} else if (balloons[i][2] < 0) {
			balloons[i][2] = 450;
		}
	}
}

function shot(mx, my) {
	var balloons_ = []
	for (var i = 0; i < balloons.length; i++) {
		var bx = balloons[i][1] + b_size / 2;
		var by = balloons[i][2] + b_size / 2;
		if (Math.pow(mx - bx, 2) + Math.pow(my - by, 2) > Math.pow(b_size / 2, 2)) {
			balloons_.push(balloons[i]);
		} else {
			t_expl = 0;
			answer += balloons[i][4] + ' ';
			exploding = [balloons[i][1], balloons[i][2], balloons[i][5]];
		}
	}
	balloons = balloons_
}

function checkAnswer() {
	correct = (answer.slice(0, -1) == sentences[level]);
	if (correct) {
		score += 10;
	} else {
		score -= 5;
	}
	checked = true;
}

function explodeBalloon() {
	if ((exploding.length > 0) && (t_expl < 10)) {
		if (t_expl == 0) {
			pop.currentTime = 0;
			pop.play();
		}
		ctx.drawImage(exploding[2], exploding[0], exploding[1], b_size, b_size);
		t_expl += 1;
	} else {
		t_expl = 0;
		exploding = [];
	}
}

function clearCanvas() {
	ctx.clearRect(0, 0, width, height);
}

function getMousePos(e) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	canvas.addEventListener('click', function(e) {
		var mousePos = getMousePos(e);
		shot(mousePos.x, mousePos.y);
		if (checked || !started) {
			pressButton(mousePos.x, mousePos.y);
		}
	}, true);

	setInterval(gameLoop, 25);
}

function gameLoop() {
	clearCanvas();
	nextLevel();
	moveBalloons();
	explodeBalloon();
	if (balloons.length > 0) {
		drawBalloons();
	} else if (!checked && started) {
		checkAnswer();
	} else if (level < sentences.length - 1) {
		drawButton();
	}
	drawAnswer();
	drawScore();
}
window.onload = init;