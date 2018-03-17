window.addEventListener('load', function() {
	
	// Quintus
	var Q = window.Q = Quintus({development: true})
    	.include('Sprites, Scenes, Input, 2D, Touch, UI, TMX, Anim')
        .setup({
        	maximize: true
        })
        .controls().touch();
	
	// Constants
	SPRITE_DEFAULT = 1;
	SPRITE_PLAYER = 2;
	SPRITE_FLAG = 4;
	
	//Variables
	//console.log(Q.stageScene())
	var H = Q.height - 70,
		W = Q.width,
		normalW = (W < 1200) ? W : 1200,
		dy = -90;
	
	window.addEventListener("resize", function() {
		Q.clear();
	    Q.setup('new', {
	    	maximize: true
	    })
		H = Q.height - 70;
		W = Q.width;
		normalW = (W < 1200) ? W : 1200;
		restart();
		Q.clearStage(2);
		Q.stageScene('hud', 2);
	});
	
	// Shuffle
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex--;
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }
		return array;
	}
	
	// Restart
    function restart() {
    	Q.clearStage(1);
    	Q.clearStage(0);
    	Q.stageScene('level');
    	game();
    	Q.stageScene('text', 1);
    }
	
    // Variables
	var timer, pos, begin, score, x, text, mistake, cpm, colorTimer, color, flag, flagDown, player;
	
	// Game
	function game() {
		timer = 30;
		pos = 0;
		begin = false;
		score = 0;
		x = 0;
		mistake = false;
		cpm = 0;
		colorTimer = 0;
		color = 'black';
		flagDown = false;
		
		var file = new XMLHttpRequest();	
		file.open('GET', 'words.txt');
		file.onreadystatechange = function() {
			text = shuffle(file.responseText.split(' ')).join(' ');
			Q('UI.Text', 1).items[0].p.label = '_' + text.slice(0, normalW / 900 * 22) + '...';
		}
		file.send();
	}

	window.addEventListener('keydown', function(key) {
		if(key.keyCode == 32 && key.target == document.body) {
	        key.preventDefault();
		}
		if (key.which == 13) {
			restart();
			return;
		} else if (timer > 0) {
			code = text[pos];
			keyCode = String.fromCharCode(key.which).toLowerCase()
			if (keyCode == code) {
				mistake = false;
				if (!begin) {
					setTimeout(time, 1000);
				}
				begin = true;
				text = text.slice(1, text.length);
				if (text.length > normalW / 900 * 35) {
					Q('UI.Text', 1).items[0].p.label = '_' + text.slice(0, normalW / 900 * 22) + '...';
				} else {
					Q('UI.Text', 1).items[0].p.label = '_' + text;
				}
				score++;
				cpm++;
				color = '#174968';//right text color
				colorTimer = 36;
				x += 10;
			} else if (!mistake && ((key.which > 64 && key.which < 91) || (key.which == 32))) {
				if (score > 0) {
					score--;
				}
				mistake = true;
				color = '#ff5d5d';//mistake text color
				colorTimer = 12;
				cpm -= 2;
				x += -10;
			}
			Q('UI.Text', 1).items[2].p.label = 'Score: ' + score;
		}
	})
	
	function time() {
		if (begin) {
			timer--;
			Q('UI.Text', 1).items[1].p.label = '' + timer;
			if (timer > 0) {
				setTimeout(time, 1000);
			} else {
				var highscore = localStorage.getItem('highscore');
				if (!highscore) {
					highscore = 0;
				}
				if (score > highscore) {
					localStorage.setItem('highscore', score);
					highscore = score;
					flag = new Q.Flag();
					flag.p.x = player.p.x + 42;
					flag.p.y = player.p.y + dy;
					localStorage.setItem('flagX', flag.p.x);
					localStorage.setItem('flagY', flag.p.y);
					flag.p.asset = 'flag.png';
					Q.stage().insert(flag);
					player.destroy();
					player = new Q.Player();
					player.p.x = flag.p.x - 42;
					player.p.y = flag.p.y - dy;
					Q.stage().insert(player);
			    	Q.stage().add('viewport').follow(player, {x: true, y: false});
				}
				Q.clearStage(1);
				Q.stageScene('end', 1);
				Q('UI.Text', 1).items[0].p.label = 'score: ' + score;
				Q('UI.Text', 1).items[2].p.label = 'highscore: ' + highscore;
				Q('UI.Text', 1).items[1].p.label = 'wpm: ' + Math.round(2 * cpm / 5);
			}		
		}
	}
	
	Q.scene('text', function(stage) {    	
    	var container = stage.insert(new Q.UI.Container({
    			//fill: 'black',
      	  		opacity: 0.1,
      	  		x: W / 2,
      	  		y: H / 40,
      	  		h: H / 2,
      	  		w: W
    		})),
    	
    		label = container.insert(new Q.UI.Text({
    			x: -normalW / 2 + 270,
    			y: 3*H/4,
    			size: normalW / 900 * 35,
    			color: 'white',
    			align: 'left',
    			label: ''
    		})),
    	
    		label = container.insert(new Q.UI.Text({
    			x: 0,
    			y: H / 8,
    			size: normalW / 900 * 75,
				label: '' + timer,
				color: 'white',
				weight: 100
    		})),
    	
    		label = container.insert(new Q.UI.Text({
    			x: 0,
    			y: H / 32,
    			size: normalW / 900 * 35,
    			label: 'Score: 0',
				color: 'white'
    		}));
	});
	
    Q.scene('hud', function(stage) {
    	var container = stage.insert(new Q.UI.Container({
    			x: W / 2,
    			y: 19*H/20,
    			h: H / 4,
    			w: W
    		})),
    	
    		label = container.insert(new Q.UI.Text({
      	  		x: 0, 
      	  		y: 0,
      	  		size: 20 * normalW / 900,
				label: 'Press "Enter" to restart',
				family: 'Arial',
				weight: 100,
				color: 'white'
    		}));
    });
	
	
	// Player
	Q.Sprite.extend('Player', {
    	init: function(p) {
    		this._super(p, {
    			x: 363,
    			y: 1000,
    			sheet: 'cat',
    			sprite: 'cat',
    			frame: 0,
    			scale: 1,
    			runTimer: 0,
    			colorTimer: 24,
    			points: [[-30, -40], [30, -40], [30, 45], [-30, 45]],
    			collisionMask: Q.SPRITE_DEFAULT,
				type: Q.SPRITE_PLAYER,
				gravity: 0
    		});
    		this.add('2d, animation'); 
    	},
    	step: function(dt) {
    		// Animation
    		if (x > 0) {
    			this.p.runTimer = 24;
    		} else if (x < 0) {
    			this.p.runTimer = 0;
    		} else {
    			this.p.runTimer--;
    		}
    		if (this.p.runTimer > 0) {
    			this.play('run_right');
    		} else {
    			//this.play('stand_right');
				this.play('run_right')
    		}
    		
    		// Color
    		if (colorTimer > 0 && timer > 0) {
    			colorTimer--;
    			Q('UI.Text', 1).items[0].p.color = color;
    		} else if (timer > 0) {
    			Q('UI.Text', 1).items[0].p.color = '#174968';//darkblue
    		}
    		if (timer > 0 && timer < 5) {
    			Q('UI.Text', 1).items[1].p.color = '#ff5d5d';//final countdown color
    		}
    		
    		// Movement
    		this.p.x += x;
    		x = 0;
    		
    		// Flag
    		if (!flagDown && flag && this.p.x + 42 > flag.p.x) {
    			flagDown = true;
    			flag.p.asset = 'flagOld.png';
        		player.destroy();
    			player = new Q.Player();
    			player.p.x = flag.p.x - 42;
    			player.p.y = flag.p.y - dy;
    			x += 10;
    			Q.stage().insert(player);
    	    	Q.stage().add('viewport').follow(player, {x: true, y: true});
    		}
        }
	});
    
	// Animations
	Q.animations('cat', {
    	run_right: {frames:[0, 1, 3, 4, 6, 7, 2, 5], loop: true, rate: 1/7, flip: false},
        stand_right: {frames: [0], flip: false}
    });
	
    // End
    Q.scene('end', function(stage) {    	
    	var container = stage.insert(new Q.UI.Container({
    	//		fill: 'black',
      	  		opacity: 0.1,
      	  		x: W / 2,
      	  		y: H/4,
      	  		h: H / 2,
      	  		w: W
        	})),
    	
    		label = container.insert(new Q.UI.Text({
    			x: 0,
    			y: -H / 6,
    			size: normalW / 900 * 35,
				color: '#174968'
    		})),
    	
    		label = container.insert(new Q.UI.Text({
    			x: 0,
    			y: -H / 24,
    			size: normalW / 900 * 35,
				color: '#174968'
    		})),
    	
    		label = container.insert(new Q.UI.Text({
    			x: 0,
    			y: H / 12,
    			size: normalW / 900 * 35,
				color: '#174968'
    		}));
    });
    
    // Flag
    Q.Sprite.extend('Flag', {
    	init: function(p) {
    		this._super(p, {
    			asset: 'flag.png',
    			scale: 1,
    			collisionMask: Q.SPRITE_DEFAULT,
    			type: Q.SPRITE_FLAG
    		});
    	}
    });
    
    // Level
    Q.scene('level', function(stage) {   	
    	Q.stageTMX('level.tmx', stage);
    	player = new Q.Player();
		stage.insert(player);
		stage.add('viewport').follow(player, {x: true, y: true});
		//stage.centerOn(W,H+300);
    	//Q.audio.play('start.mp3');
    	if (localStorage.getItem('flagX')) {
    		flag = new Q.Flag()
    		flag.p.x = localStorage.getItem('flagX');
    		flag.p.y = localStorage.getItem('flagY');
    		Q.stage().insert(flag);
    	}
    }); 
    
    // Assets
    var level = 1,
    	tmx_files = 'level.tmx,',
    	json_files = 'cat.json,',
    	png_files = 'cat.png, flag.png, flagOld.png';
    
    // Load assets
    Q.loadTMX(tmx_files + json_files + png_files, function() {
    	Q.compileSheets('cat.png', 'cat.json');
    	localStorage.removeItem('highscore');
		localStorage.removeItem('flagY');
		localStorage.removeItem('flagX')
    	Q.stageScene('level');
    	Q.stageScene('hud', 2);
    	game();
    	Q.stageScene('text', 1);
    }, {
    	progressCallback: function(loaded, total) {
    	    var element = document.getElementById('loading_progress');
    	    element.style.width = Math.floor(loaded/total*100) + '%';
    	    if (loaded == total) {
    	    	document.getElementById('loading').remove();
    	    }
    	}
    });
});