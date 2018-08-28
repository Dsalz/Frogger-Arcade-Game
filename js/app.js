
//Initialized global variables

const gameLife = document.getElementById('game-life');
const gameScore = document.getElementById('game-score');
const gameHeart = '<span>&#x2764</span>';
const gameOverScore = document.querySelector('.game-over-score');
const gameOverModal = document.querySelector('.game-over-modal');
const gameScreen = document.querySelector('.game-screen');
const welcomeModal = document.querySelector('.welcome-modal');
const blueGemCounter = document.getElementById('bluegems');
const greenGemCounter = document.getElementById('greengems');
const orangeGemCounter = document.getElementById('orangegems');
let allEnemies;
let allGems;
let player;
let playerImg = "images/char-boy.png";




// Enemy class
class Enemy {

constructor(x,y,pace) {
    this.x = x;
    this.y = y;
    this.pace = pace;
    this.sprite = 'images/enemy-bug.png';
};

update(dt){

    // reloading enemies when they go offscreen with different pace
    this.x += (this.x > 900)? -1050 : this.pace * dt;
    this.pace = (this.x > 900)? 200 + (Math.random() * 500) : this.pace;

    //checking if they collide with the player
    if((player.x >= this.x - 30 && player.x <= this.x + 50) && (player.y >= this.y - 30 && player.y <= this.y + 50)){
        setTimeout(player.gotHit(), 500);  
    }
}

render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

}


// player class
class Player{

    constructor(x,y){
        this.x = x;
        this.y = y;
        this.lives = 5;
        this.greenGems = 0;
        this.blueGems = 0;
        this.orangeGems = 0;
        this.score = 0;
        this.sprite = playerImg; //setting player image to global variable so that it can be changed to user's input
    }

    checkGameOver(){ //checking if player lives are empty 

        if(this.lives == 0){
            gameOverScore.textContent = this.score;
            gameOverModal.style.display  = 'block';
        }
    }

    update(){
    }

    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    gotHit(){ // function to call when the player gets hit
        this.x = 300;
        this.y = 470;

        this.lives--;
        
        this.updatePlayerStats();
        this.checkGameOver();
    }

    gotGem(gemType){ //function to call when a player gets a gem
        
        this.score += (gemType == 'blue')? 1 : (gemType == 'green')? 2 : 3;
        
        if(gemType === 'blue'){
            this.blueGems++;
        }

        if(gemType === 'green'){
            this.greenGems++;
        }

        if(gemType === 'orange'){
            this.orangeGems++;
        }

        player.updatePlayerStats();
    }

    updatePlayerStats(){ //function for updating on screen stats
        gameLife.innerHTML = gameHeart.repeat(this.lives);
        gameScore.innerHTML = ` Score : ${this.score}`;
        orangeGemCounter.textContent = this.orangeGems;
        blueGemCounter.textContent = this.blueGems;
        greenGemCounter.textContent = this.greenGems;
    }

    reachedWater(){ // when player crosses succesfully
        this.updatePlayerStats();
        this.x = 300;
        this.y = 470;
    }

    handleInput(keyPressed){ // handling keyboard input

        switch(keyPressed){

        case 'left':
        if(this.x > 50){
        this.x -= 100;
        }
        break;

        case 'right':
        if(this.x < 600){
        this.x += 100;
        }
        break;

        case 'down':
        if(this.y < 420){
        this.y += 80;
        }
        break;

        case 'up':
        this.y -= 80;
        break;

        }

        if(this.y < 10){ // checking if player has reached the water tile and resetting game gems;
            
            setTimeout(
                function(){
            player.reachedWater();
            getGems();
            }, 
            150);

            this.score += 5; 
        }

    }
}

// gem class
class Gem {

    constructor(imageUrl, x, y){
        this.imageUrl = imageUrl;
        this.x = x;
        this.y = y;
        this.type = (this.imageUrl == 'images/gem-blue.png')? 'blue' : (this.imageUrl == 'images/gem-green.png')? 'green' : 'orange';
    }

    render(){
        ctx.drawImage(Resources.get(this.imageUrl), this.x, this.y);
    }

    update(){

        if((player.x >= this.x - 30 && player.x <= this.x + 50) && (player.y >= this.y - 30 && player.y <= this.y + 50)){
            player.gotGem(this.type)
            this.x = -100;
            this.y = -100;
        }

    }
}


//object with key value pairs for looking up user's chosen image 

const playerImages = {
    'boy-character': "images/char-boy.png",
    'cat-girl-character': "images/char-cat-girl.png",
    'horn-girl-character': "images/char-horn-girl.png",
    'pink-girl-character': "images/char-pink-girl.png",
    'princess-character' : "images/char-princess-girl.png"
}


//randomizing and deploying gems 
const getGems = () =>{
 
 const gemPositionsX = [0, 100, 200, 300, 400];
 const gemPositionsY = [60, 140, 220, 300, 380];
 const gemTypes = [
    'images/gem-blue.png',
    'images/gem-green.png',
    'images/gem-orange.png'
 ]

 allGems= [
    new Gem(gemTypes[Math.floor(Math.random() * 3)], gemPositionsX[Math.floor(Math.random() * 5)], gemPositionsY[Math.floor(Math.random() * 5)]),
    new Gem(gemTypes[Math.floor(Math.random() * 3)], gemPositionsX[Math.floor(Math.random() * 5)], gemPositionsY[Math.floor(Math.random() * 5)]),
    new Gem(gemTypes[Math.floor(Math.random() * 3)], gemPositionsX[Math.floor(Math.random() * 5)], gemPositionsY[Math.floor(Math.random() * 5)])
]
}

//starting the game
const startGame = () => {
  gameOverModal.style.display  = 'none';

 
 getGems();

allEnemies = [
    new Enemy(-150, 60, 400),
    new Enemy(-150, 140, 280),
    new Enemy(-150, 220, 380),
    new Enemy(-150, 300, 580),
    new Enemy(-150, 380, 300),
];

player = new Player(300, 470);

player.updatePlayerStats();

}

startGame();





// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//getting user's chosen character and updating player object
document.querySelector('.welcome-modal-choice').addEventListener('click', (e)=>{

    if(e.target.nodeName === 'IMG'){
        player.sprite = playerImages[e.target.id];
        playerImg = playerImages[e.target.id];
        gameScreen.style.visibility = "visible";
        document.querySelector('canvas').style.display = "inline-block";
        welcomeModal.style.display = "none";
    }
})


//event listeners for refresh button in game and restart on the game over screen
document.querySelector('.game-over-modal-btn').addEventListener('click', startGame);

document.getElementById('reset').addEventListener('click', startGame);
