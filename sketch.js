const sz = 600;

const launchX = sz / 2;
const launchY = sz * .75;

const tomatoSize = sz * .05;



let isPulledBack = false;
let isFlying = false;

let tomatoXSpeed = 0;
let tomatoYSpeed = 0;

let tomatoX = 0;
let tomatoY = 0;

const initalFling = .2;
const GRAV = sz * .0004;

const rowBottoms = [
  { pos: sz * 0.25, score:300}, {pos: sz * 0.4,score:200}, {pos:sz * 0.55,score:100}];
let ducks = [];

const DUCKSPEED = sz * .01;
const DUCKSIZE = sz * .05;

const TICKS_BETWEEN_DUCKLAUNCH = 20;
let duckLaunchCounter = 0;
let score = 0;
/*
   x,y

*/
let duckImg,tomatoImg, slingshotImg, curtainImg, panelImg,bgImg, splatImg;

function preload() {
  duckImg = loadImage('ducksquare.png');
  tomatoImg = loadImage('tomato.png');
  slingshotImg = loadImage('slingshot.png');
  curtainImg = loadImage('curtain.png');
  panelImg = loadImage('lowerpanel.png');
  bgImg = loadImage('background.png');
  splatImg = loadImage('splat.png');

}

function resetGame(){
   resetTomato(); 
  score = 0;
  ducks = [];
}


function setup() {
  createCanvas(sz, sz);
  resetGame();
}

function draw() {
  textAlign(CENTER,CENTER);
  image(bgImg,0,0,width,height);
  
  drawBrown();
  
  image(curtainImg,0,0,width,height*.2);
  
  image(panelImg,0,height*.8,width,height*.2);

  strokeWeight(sz*.01);
  stroke(246,174,47);  
  rowBottoms.map((bot) => {
    line(0, bot.pos+sz*.03, width, bot.pos+sz*.03);
  });
  strokeWeight(sz*.01);
  stroke(160,94,31);  
  rowBottoms.map((bot) => {
    line(0, bot.pos+sz*.04, width, bot.pos+sz*.04);
  });

  
  drawScore();
  
  
  
  
  
  moveDucks();
  
  
  
  moveTomato();

  
  checkIfAnyDucksHit();
  
  drawLaunchpoint();
  
  drawDucks();
  
  image(slingshotImg,width*.4,height*.75,width*.2,height*.3);
  
  
  
  
  drawTomato();

  drawElastic();


  maybeAddDuck();

}


function drawElastic(){
    stroke(219,136,139);
    strokeWeight(5);

  if (isPulledBack) {
    line(width*.425,height*.78, tomatoX, tomatoY+sz*.02);
    line(width*.575,height*.78, tomatoX, tomatoY+sz*.02);
  } else {
    line(width*.425,height*.78, width*.575,height*.78);
    
  }
}


function drawScore(){
  textSize(sz*.07);
  noStroke();
  fill(0);
  //text('FOO',0,0,width,height);
   text(score.toString().padStart(4,'0'),0,sz*.8,width,sz*.2); 
}

function maybeAddDuck() {

  if (duckLaunchCounter <= 0) {
    addDuck();
    duckLaunchCounter = TICKS_BETWEEN_DUCKLAUNCH;
  }
  duckLaunchCounter--;
}

function addDuck(){
  const bot = random(rowBottoms);
   const newduck = {x:-4 * DUCKSIZE, y:bot.pos, score:bot.score};
  ducks.push(newduck);
}

function moveDucks(){
    
   ducks.map((duck)=>{
       duck.x += DUCKSPEED;
       
   }); 
  ducks = ducks.filter((duck)=>{
     return duck.x < width + (4 * DUCKSIZE); 
  });
  
}


function checkIfAnyDucksHit(){
  ducks.map((d)=>{
    if(dist(d.x,d.y,tomatoX,tomatoY) < (DUCKSIZE+tomatoSize)/2) {
      if(! d.hit){
         score += d.score; 
      }
       d.hit = true; 
      isFlying=false;
      resetTomato();
    }
  });
    
}

function drawLaunchpoint() {



}

function moveTomato() {
  //tomatoX = mouseX;
  //tomatoY = mouseY;
  //return;
  
  if (isFlying) {
    tomatoYSpeed += GRAV;
    tomatoX += tomatoXSpeed;
    tomatoY += tomatoYSpeed;


    if (tomatoY > height || tomatoY < 0 || tomatoX < 0 || tomatoX > width) {
      resetTomato();
    }
  }
}


function resetTomato() {
  tomatoX = launchX;
  tomatoY = launchY;

  currentTomatoDepth = 0;
  isFlying = false;
  isPulledBack = false;
}

function mousePressed() {
  if (!isPulledBack && mouseIsOverLaunchPoint()) {
    isPulledBack = true;
  }
}

function mouseDragged() {
  if (isPulledBack) {
    tomatoX = mouseX;
    tomatoY = mouseY;
  }
}


function drawDucks(){
  //imageMode(CENTER);
  
  const DUCKIMGSIZE = sz * .08;
  
   ducks.map((duck)=>{
       //duck.hit ? fill(255,0,0,128):fill(255,255,0,128);
       image(duckImg,duck.x- DUCKIMGSIZE*.4 ,duck.y - DUCKIMGSIZE/2,DUCKIMGSIZE,DUCKIMGSIZE);
       //circle(duck.x,duck.y,DUCKSIZE);
       if(duck.hit){
              image(splatImg,duck.x- DUCKIMGSIZE*.4 ,duck.y-DUCKIMGSIZE/2,DUCKIMGSIZE,DUCKIMGSIZE);

         
       }
   }); 
}

function drawTomato() {
  const TOMIMGSIZE = sz * .07;
  image(tomatoImg,tomatoX-TOMIMGSIZE/2,tomatoY-TOMIMGSIZE/2,TOMIMGSIZE,TOMIMGSIZE);
  
  //fill(255, 0, 0,128);
  //const drawSize
  //circle(tomatoX, tomatoY, tomatoSize);


}


function launchTomato() {
  tomatoXSpeed = (launchX - tomatoX) * initalFling;
  tomatoYSpeed = (launchY - tomatoY) * initalFling  * .75;
  isFlying = true;
}

function mouseReleased() {
  if (isPulledBack) launchTomato();
  isPulledBack = false;
}

function mouseIsOverLaunchPoint() {
  return (dist(launchX, launchY, mouseX, mouseY) < tomatoSize / 2);
}

function keyPressed() {
  resetTomato();
}



function drawBrown(){
   noStroke(); 
    fill(160,94,31);
  rect(0,0,width,height*.1);
  //rect(0,0,width*.05,height);
  //rect(width*.95,0,width*.05,height);
}