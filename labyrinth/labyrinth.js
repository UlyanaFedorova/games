// # Quintus platformer example
//
// [Run the example](../quintus/examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.
window.addEventListener("load",function() {

var timer, playerx, playery;	
function game() {
	timer = 90;
	time();
}	

function time() {
	timer--;
	Q('UI.Text', 2).items[0].p.label = '' + timer;
	if (timer > 0) {
		setTimeout(time, 1000);
	}
	else {
		Q.stageScene("endGame",1 , { label: "Game Over" }); 
		Q('Player').destroy();
	}
}

function recreatePlayer() {
	Q.clearStage(1);	
	player = Q.stage().insert(new Q.Player({x: playerx, y: playery}));
	Q.stage().add("viewport").follow(player);	
}
// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` componet.
var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup('myGame')
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
Q.Sprite.extend("Player",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "player",  // Setting a sprite sheet sets sprite width and height
      x: 410,           // You can also set additional properties that can
      y: 250             // be overridden on object creation
    });

    // Add in pre-made components to get up and running quickly
    // The `2d` component adds in default 2d collision detection
    // and kinetics (velocity, gravity)
    // The `platformerControls` makes the player controllable by the
    // default input actions (left, right to move,  up or action to jump)
    // It also checks to make sure the player is on a horizontal surface before
    // letting them jump.
    this.add('2d, platformerControls');

    // Write event handlers to respond hook into behaviors.
    // hit.sprite is called everytime the player collides with a sprite
    this.on("hit.sprite",function(collision) {

      // Check the collision, if it's the Tower, you win!
      if(collision.obj.isA("Tower")) {
        //Q.stageScene("door",1, { label: "responsible" }); 
        this.destroy();
		playerx = this.p.x;
		playery = this.p.y;
      }
    });

  }

});


// ## Tower Sprite
// Sprites can be simple, the Tower sprite just sets a custom sprite sheet
Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: 'tower', num: '0' });
	
	this.on("hit.sprite",function(collision) {

      // Check the collision, if it's the Tower, you win!
      if(collision.obj.isA('Player')) {
        Q.stageScene('door',1, { word: 'responsible', ans1: 'in', ans2: 'ur', ans3: 'ir', ans4: 'im', ans5: 'dis', num: this.p.num }); 
        this.destroy();
      }
	}); 
  } 
});

// ## Enemy Sprite
// Create the Enemy class to add in some baddies
Q.Sprite.extend("Enemy",{
  init: function(p) {
    this._super(p, { sheet: 'enemy', vx: 100 });

    // Enemies use the Bounce AI to change direction 
    // whenver they run into something.
    this.add('2d, aiBounce');

    // Listen for a sprite collision, if it's the player,
    // end the game unless the enemy is hit on top
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "Game Over" }); 
        collision.obj.destroy();
      }
    });

    // If the enemy gets hit on the top, destroy it
    // and give the user a "hop"
    this.on("bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        this.destroy();
        collision.obj.p.vy = -300;
      }
    });
  }
});

// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall2.jpg", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level.json',
                             sheet:     'tiles' }));


  // Create the player and add them to the stage
  var player = stage.insert(new Q.Player());

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // Add in a couple of enemies
  stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));

  // Finally add in the tower goal
  stage.insert(new Q.Tower({ x: 700, y: 370 }));
});

// To display a game over / game won popup box, 
// create a endGame scene that takes in a `label` option
// to control the displayed message.

Q.scene('door',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(255,255,255,1)"
  }));

  var button1 = container.insert(new Q.UI.Button({ x: -75, y: 0, asset: 'radio.png', scale: 0.7 }))  
  var button2 = container.insert(new Q.UI.Button({ x: -75, y: 30, asset: 'radio.png', scale: 0.7 })) 
  var button3 = container.insert(new Q.UI.Button({ x: -75, y: 60, asset: 'radio.png', scale: 0.7 })) 
  var button4 = container.insert(new Q.UI.Button({ x: -75, y: 90, asset: 'radio.png', scale: 0.7 }))
  var button5 = container.insert(new Q.UI.Button({ x: -75, y: 120, asset: 'radio.png', scale: 0.7 })) 
  container.insert(new Q.UI.Text({x:-40, y: -60, 
										 label: stage.options.word,
										 align: 'center'
										 }));
  container.insert(new Q.UI.Text({x:-40, y: button1.p.y - 20, 
										 label: stage.options.ans1,
										 align: 'left'
										 }));
  container.insert(new Q.UI.Text({x:-40, y: button2.p.y - 20, 
										 label: stage.options.ans2,
										 align: 'left'
										 }));
  container.insert(new Q.UI.Text({x:-40, y: button3.p.y - 20, 
										 label: stage.options.ans3,
										 align: 'left'
										 }));
  container.insert(new Q.UI.Text({x:-40, y: button4.p.y - 20, 
										 label: stage.options.ans4,
										 align: 'left'
										 }));
  container.insert(new Q.UI.Text({x:-40, y: button5.p.y - 20, 
										 label: stage.options.ans5,
										 align: 'left'
										 }));										 
  // When the button is clicked, clear all the stages
  // and restart the game.
  button1.on("click",function() {
	setTimeout(recreatePlayer, 1000);
    
    //Q.stageScene('level1');
  });
  
  button2.on("click",function() {
	setTimeout(function() {
		Q.clearStage(1);	
		player = Q.stage().insert(new Q.Player());
		Q.stage().add("viewport").follow(player);
	}, 1000);
    
    //Q.stageScene('level1');
  });


  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});

Q.scene('timer', function(stage) {    	
    	var container = stage.insert(new Q.UI.Container({
    			//fill: 'black',
      	  		//opacity: 0,
      	  		x: 20,
      	  		y: 20,
    		}))
    	
    	
		label = container.insert(new Q.UI.Text({
			x: 0,
			y: 0,
			label: '' + timer,
			color: 'black',
			weight: 100
		}))
    	
});

Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Play Again" }))         
  var label = container.insert(new Q.UI.Text({x:0, y: -20 - button.p.h, 
                                                   label: stage.options.label }));
  // When the button is clicked, clear all the stages
  // and restart the game.
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
	Q.stageScene('timer', 2);
	game();
  });

  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});

// ## Asset Loading and Game Launch
// Q.load can be called at any time to load additional assets
// assets that are already loaded will be skipped
// The callback will be triggered when everything is loaded
Q.load("sprites.png, sprites.json, level.json, tiles.png, background-wall2.jpg, radio.png", function() {
  // Sprites sheets can be created manually
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

  // Or from a .json asset that defines sprite locations
  Q.compileSheets("sprites.png","sprites.json");

  // Finally, call stageScene to run the game
  Q.stageScene("level1");
  Q.stageScene("timer", 2);
  game();
});

// ## Possible Experimentations:
// 
// The are lots of things to try out here.
// 
// 1. Modify level.json to change the level around and add in some more enemies.
// 2. Add in a second level by creating a level2.json and a level2 scene that gets
//    loaded after level 1 is complete.
// 3. Add in a title screen
// 4. Add in a hud and points for jumping on enemies.
// 5. Add in a `Repeater` behind the TileLayer to create a paralax scrolling effect.

});
