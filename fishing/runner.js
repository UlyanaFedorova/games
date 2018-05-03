window.addEventListener("load",function() {

var sentences = ["Detroid is renowned for the ....... of cars.",
                 "If you make a good ....... at the interview, you will get the job.",
				 "Teaching and medicine are more than ......., they're professions."]
var words = [['production', 'produce', 'product', 'producsion', 'productivity'],
			 ['impression', 'impress', 'impressive', 'impressiveness', 'impressivity'],
			 ['occupation', 'occupier', 'occupy', 'occupasion', 'occupanity']]
var level = 0;

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .setup('myGame')
        .controls().touch()

var SPRITE_BOX = 1;

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}	

Q.gravityY = 0;

Q.Sprite.extend("Player",{

  init: function(p) {

    this._super(p,{
      sheet: "player",
      sprite: "player",
      collisionMask: SPRITE_BOX, 
      x: 40,
      y: 555,
      standingPoints: [[ 0, 35 ], [0,-10], [23,-10], [23, 35 ]],
      //duckingPoints : [ [ -16, 44], [ -23, 35 ], [-23,-10], [23,-10], [23, 35 ], [ 16, 44 ]],
      speedx: 1,
	  speedy: 4,
      jump: -700,
	  score: 0,
	  lives: 3
    });

    this.p.points = this.p.standingPoints;

    this.add("2d, animation");
  },

  step: function(dt) {
    this.p.x += this.p.speedx;

    if(this.p.y > 555) {
      this.p.y = 555;
    } else if (this.p.y < 200){
      this.p.y = 200;
    }

    if(Q.inputs['up']) {
      //this.p.vy = this.p.jump;
	  this.p.y -= this.p.speedy;
    } 
	
	if(Q.inputs['down']) {
      //this.p.vy = this.p.jump;
	  this.p.y += this.p.speedy;
	  
    } 

    //this.play("walk_right");
	//this.p.points = this.p.standingPoints;

    this.stage.viewport.centerOn(this.p.x + 200, 400 );

  }
});

Q.Sprite.extend("Fish",{
  init: function(p) {

    var levels = [ 500, 400, 300, 200 ];

    var player = Q("Player").first();
    this._super(p, {
      x: player.p.x + Q.width + 50,
      y: levels[Math.floor(Math.random() * 3)],
 //     frame: Math.random() < 0.5 ? 1 : 0,
 //     scale: 2,
//      type: SPRITE_BOX,
 //     sheet: "crates",
      vx: -50 + 0 * Math.random(),
      vy: 0,
      ay: 0,
	  w: 50,
	  h: 50,
	  color: 'white',
	  word: 'word'	
    });
	
    this.on("hit");
  },

  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    // Draw a filled rectangle centered at
    // 0,0 (i.e. from -w/2,-h2 to w/2, h/2)
    ctx.fillRect(-this.p.cx - 5,
                 -this.p.cy - this.p.h/2,
                 this.p.w,
                 this.p.h);
	ctx.font = '15px Arial';
	ctx.fillStyle = 'black';
	ctx.fillText(this.p.word, -this.p.cx, -this.p.cy);

  },
  
  step: function(dt) {
    this.p.x += this.p.vx * dt;
    if(this.p.y > 800) { this.destroy(); }

  },

  hit: function() {
	player = Q("Player").first();
	if (words[level].indexOf(this.p.word) == 0) {
		player.p.score++;
		level++;
		Q.stageScene("sentence", 1);
	} else player.p.lives--;
    this.destroy();
	Q('UI.Text', 2).items[0].p.label = 'Score: ' + player.p.score;
	Q('UI.Text', 2).items[1].p.label = 'Lives: ' + player.p.lives;
	if (player.lives < 0) {
	}
  }
  

});

Q.GameObject.extend("FishSource",{
  init: function() {
    this.p = {
      launchDelay: 0.75,
      launchRandom: 1,
      launch: 2,
	  counter: 0,
    }
  },

  update: function(dt) {
    this.p.launch -= dt;
	var word = words[level][this.p.counter]
    if(this.p.launch < 0) {
      this.stage.insert(new Q.Fish({word: word}));
      this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
	  this.p.counter = (this.p.counter + 1)%words[level].length;
    }
  }

});


Q.scene("level1",function(stage) {

  stage.insert(new Q.Repeater({ asset: "background-wall.png",
                                speedX: 0.5 }));

  /*stage.insert(new Q.Repeater({ asset: "background-floor.png",
                                repeatY: false,
                                speedX: 1.0,
                                y: 300 }));*/

  stage.insert(new Q.FishSource());
  
  stage.insert(new Q.Player());
  stage.add("viewport");

});


Q.scene('sentence', function(stage) {    	
    	var container = stage.insert(new Q.UI.Container({
    			//fill: 'black',
      	  		//opacity: 0,
      	  		x: 20,
      	  		y: 530,
    		}));
			
		Q.ctx.font = '30px Arial';
		var base_w = 600;
		var text_w = Q.ctx.measureText(sentences[level]).width;
		var size = Math.floor(base_w/text_w*30);
		
		//console.log(size);
		label = container.insert(new Q.UI.Text({
			x: Q.width/2,
			y: 0,
			label: sentences[level],
			color: 'white',
			//align: 'center',
			size: size,
			weight: 100
		}));
});

Q.scene('hud', function(stage) {    	
    	var container = stage.insert(new Q.UI.Container({
    		}));
			
		//console.log(size);
		container.insert(new Q.UI.Text({
			x: 80,
			y: 20,
			label: 'Score: 0',
			color: 'white',
			//align: 'center',
			size: 25,
			weight: 100
		}));
		container.insert(new Q.UI.Text({
			x: 80,
			y: 60,
			label: 'Lives: 3',
			color: 'white',
			//align: 'center',
			size: 25,
			weight: 100
		}));
});

Q.scene('GameOver', function(stage) {    	
    	var container = stage.insert(new Q.UI.Container({
    		}));
			
		//console.log(size);
		container.insert(new Q.UI.Text({
			x: Q.width/2,
			y: Q.width/2,
			label: 'Game Over',
			color: 'white',
			//align: 'center',
			size: 25,
			weight: 100
		}));

});
  
Q.load("player.json, player.png, background-wall.png, background-floor.png, crates.png, crates.json", function() {
    Q.compileSheets("player.png","player.json");
    Q.compileSheets("crates.png","crates.json");
    /*Q.animations("player", {
      walk_right: { frames: [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip: false, loop: true },
      jump_right: { frames: [13], rate: 1/10, flip: false },
      stand_right: { frames:[14], rate: 1/10, flip: false },
      duck_right: { frames: [15], rate: 1/10, flip: false },
    });*/
    Q.stageScene("level1");
	Q.stageScene("sentence", 1);
	Q.stageScene("hud", 2);
  
});


});
